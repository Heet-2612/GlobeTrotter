import React, { useEffect, useState, useRef } from 'react';
import {
  TripResponse,
  TripStopResponse,
  CityResponse,
  ActivityResponse,
  TripActivityResponse,
  PlaceResponse,
} from '../types';
import { api } from '../services/api';
import {
  placeSearchService,
  NormalizedPlace,
} from '../services/placeSearchService';
import {
  MapPin,
  Calendar,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  Share2,
  Eye,
  Edit3,
  X,
  Search,
  Sparkles,
  ArrowLeft,
  Globe,
  Loader2,
} from 'lucide-react';
import { Button, Card, Badge, Input, LoadingState } from '../components/common/UIComponents';
import { useCurrency } from '../context/CurrencyContext';
import { getCityImageUrl, getActivityImageUrl, onCityImageError } from '../utils/imageUtils';


interface ItineraryBuilderPageProps {
  tripId: number;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const ItineraryBuilderPage: React.FC<ItineraryBuilderPageProps> = ({ tripId, onNavigate }) => {
  const { formatDual } = useCurrency();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [stops, setStops] = useState<TripStopResponse[]>([]);
  const [activitiesMap, setActivitiesMap] = useState<Record<number, TripActivityResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Stop Modal State
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<CityResponse[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResponse | null>(null);
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');
  const [stopNotes, setStopNotes] = useState('');
  const [stopSubmitting, setStopSubmitting] = useState(false);

  // Add Activity Modal State
  const [activeStopForActivity, setActiveStopForActivity] = useState<TripStopResponse | null>(null);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'live' | 'curated'>('live');

  // Live Places Search State (Geoapify Provider)
  const [livePlacesResults, setLivePlacesResults] = useState<NormalizedPlace[]>([]);
  const [liveSearching, setLiveSearching] = useState(false);
  const [liveSearchError, setLiveSearchError] = useState<string | null>(null);
  const [liveAttribution, setLiveAttribution] = useState<string | undefined>(undefined);
  const [convertingPlace, setConvertingPlace] = useState(false);

  // Curated Search State
  const [curatedResults, setCuratedResults] = useState<ActivityResponse[]>([]);

  // Selected Activity for assignment
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);

  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  const [customCost, setCustomCost] = useState<string>('');
  const [activitySubmitting, setActivitySubmitting] = useState(false);

  // Search Cancellation / Stale Request Handling Ref
  const searchRequestIdRef = useRef<number>(0);

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tripData = await api.getTripById(tripId);
      setTrip(tripData);

      const stopsData = await api.getTripStops(tripId);
      setStops(stopsData);

      const map: Record<number, TripActivityResponse[]> = {};
      for (const stop of stopsData) {
        try {
          const acts = await api.getTripActivities(tripId, stop.id);
          map[stop.id] = acts;
        } catch {
          map[stop.id] = [];
        }
      }
      setActivitiesMap(map);
    } catch (err: any) {
      setError(err.message || 'Failed to load trip builder data');
    } finally {
      setLoading(false);
    }
  };

  // City Search handler
  useEffect(() => {
    if (!citySearchQuery.trim()) {
      setCitySearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await api.searchCities(citySearchQuery);
        setCitySearchResults(results);
      } catch {
        setCitySearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearchQuery]);

  // Live Places Search Handler (~400ms debounce, min 2 chars, stale request cancellation)
  useEffect(() => {
    if (!activeStopForActivity || searchMode !== 'live') return;
    const query = activitySearchQuery.trim();

    if (query.length < 2) {
      setLivePlacesResults([]);
      setLiveSearchError(null);
      return;
    }

    const currentRequestId = ++searchRequestIdRef.current;
    setLiveSearching(true);
    setLiveSearchError(null);

    const timer = setTimeout(async () => {
      const response = await placeSearchService.searchPlaces(
        query,
        activeStopForActivity.city.name
      );

      // Ignore stale requests if a newer search was initiated
      if (currentRequestId !== searchRequestIdRef.current) return;

      setLiveSearching(false);
      if (response.error) {
        setLivePlacesResults([]);
        setLiveSearchError(response.error.message);
      } else {
        setLivePlacesResults(response.places);
        setLiveAttribution(response.attribution);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activitySearchQuery, activeStopForActivity, searchMode]);

  // Curated Activities Search Handler
  useEffect(() => {
    if (!activeStopForActivity || searchMode !== 'curated') return;

    const timer = setTimeout(async () => {
      try {
        const results = await api.searchActivities(
          activeStopForActivity.city.id,
          activitySearchQuery || undefined
        );
        setCuratedResults(results);
      } catch {
        setCuratedResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [activitySearchQuery, activeStopForActivity, searchMode]);

  const handleSelectLivePlaceSuggestion = async (place: NormalizedPlace) => {
    if (!activeStopForActivity) return;
    setConvertingPlace(true);
    try {
      const placeResponse: PlaceResponse = {
        placeId: place.id,
        name: place.name,
        formattedAddress: place.formattedAddress,
        latitude: place.lat,
        longitude: place.lng,
        primaryType: place.category,
      };

      const convertedActivity = await api.convertPlaceToActivity(
        activeStopForActivity.city.id,
        placeResponse
      );

      setSelectedActivity(convertedActivity);
      setActivitySearchQuery(place.name);
      setCustomCost(convertedActivity.estimatedCost ? convertedActivity.estimatedCost.toString() : '0');
      setLivePlacesResults([]);
    } catch (err: any) {
      alert(err.message || 'Failed to select place');
    } finally {
      setConvertingPlace(false);
    }
  };

  const handleSelectCuratedActivity = (act: ActivityResponse) => {
    setSelectedActivity(act);
    setActivitySearchQuery(act.name);
    setCustomCost(act.estimatedCost ? act.estimatedCost.toString() : '0');
    setCuratedResults([]);
  };

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !stopStartDate || !stopEndDate) {
      alert('Please select a city and valid start/end dates.');
      return;
    }
    setStopSubmitting(true);
    try {
      await api.createTripStop(tripId, {
        cityId: selectedCity.id,
        startDate: stopStartDate,
        endDate: stopEndDate,
        notes: stopNotes.trim() || undefined,
      });
      setShowAddStopModal(false);
      setSelectedCity(null);
      setCitySearchQuery('');
      setStopStartDate('');
      setStopEndDate('');
      setStopNotes('');
      await loadTripData();
    } catch (err: any) {
      alert(err.message || 'Failed to add stop');
    } finally {
      setStopSubmitting(false);
    }
  };

  const handleDeleteStop = async (stopId: number) => {
    if (!window.confirm('Delete this stop and all its scheduled activities?')) return;
    try {
      await api.deleteTripStop(tripId, stopId);
      await loadTripData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete stop');
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStopForActivity || !selectedActivity || !scheduledDate) {
      alert('Please select an activity and scheduled date.');
      return;
    }
    setActivitySubmitting(true);
    try {
      await api.createTripActivity(tripId, activeStopForActivity.id, {
        activityId: selectedActivity.id,
        scheduledDate,
        startTime: startTime ? (startTime.length === 5 ? `${startTime}:00` : startTime) : undefined,
        notes: activityNotes.trim() || undefined,
        customCost: customCost ? parseFloat(customCost) : undefined,
      });
      setActiveStopForActivity(null);
      setSelectedActivity(null);
      setActivitySearchQuery('');
      setLivePlacesResults([]);
      setCuratedResults([]);
      setScheduledDate('');
      setStartTime('');
      setActivityNotes('');
      setCustomCost('');
      await loadTripData();
    } catch (err: any) {
      alert(err.message || 'Failed to add activity');
    } finally {
      setActivitySubmitting(false);
    }
  };

  const handleDeleteActivity = async (stopId: number, tripActivityId: number) => {
    if (!window.confirm('Remove this activity from stop?')) return;
    try {
      await api.deleteTripActivity(tripId, stopId, tripActivityId);
      await loadTripData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete activity');
    }
  };

  if (loading) {
    return <LoadingState message="Loading itinerary builder..." />;
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error || 'Trip not found.'}
        </div>
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => onNavigate('my-trips')} className="mt-4">
          Back to My Trips
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header View Switcher Card */}
      <Card className="p-6 sm:p-8 space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Interactive Trip Builder</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium mt-2">
              <span className="flex items-center space-x-1">
                <MapPin size={13} className="text-emerald-600" />
                <span>{stops.length} Destination Stops</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar size={13} className="text-emerald-600" />
                <span>{trip.startDate} - {trip.endDate}</span>
              </span>
              <span className="flex items-center space-x-1">
                <DollarSign size={13} className="text-emerald-600" />
                <span>Budget: {formatDual(trip.budget)}</span>
              </span>
            </div>
          </div>

          {/* View Toolbar Switcher */}
          <div className="flex flex-wrap gap-2 pt-2 lg:pt-0">
            <Button variant="emerald" size="sm" icon={<Edit3 size={14} />} onClick={() => onNavigate('builder', tripId)}>
              Builder
            </Button>
            <Button variant="secondary" size="sm" icon={<Eye size={14} />} onClick={() => onNavigate('view', tripId)}>
              Read View
            </Button>
            <Button variant="secondary" size="sm" icon={<DollarSign size={14} />} onClick={() => onNavigate('budget', tripId)}>
              Budget
            </Button>
            <Button variant="secondary" size="sm" icon={<Clock size={14} />} onClick={() => onNavigate('timeline', tripId)}>
              Timeline
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stops List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">Destination Stops</h2>
            <Button variant="emerald" size="sm" icon={<Plus size={14} />} onClick={() => setShowAddStopModal(true)}>
              Add City Stop
            </Button>
          </div>

          {stops.length === 0 ? (
            <Card className="p-12 text-center space-y-4 bg-white border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No destination stops added yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Start building your itinerary by adding your first city stop. You can then attach attractions and activities.
                </p>
              </div>
              <Button variant="emerald" size="md" icon={<Plus size={16} />} onClick={() => setShowAddStopModal(true)}>
                Add First Stop
              </Button>
            </Card>
          ) : (
            stops.map((stop, idx) => {
              const stopActivities = activitiesMap[stop.id] || [];
              const cityImage = getCityImageUrl(stop.city.name, stop.city.imageUrl);

              return (
                <Card key={stop.id} className="p-6 space-y-6 shadow-xs bg-white border border-slate-200">
                  {/* Stop Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 relative border border-slate-200">
                        <img src={cityImage} alt={stop.city.name} loading="lazy" onError={onCityImageError} className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-slate-900/30"></div>
                        <span className="absolute inset-0 flex items-center justify-center font-extrabold text-white text-base">
                          #{idx + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {stop.city.name}, <span className="text-slate-500 text-base font-normal">{stop.city.country}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          📅 {stop.startDate} - {stop.endDate} {stop.notes && `• ${stop.notes}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="emerald"
                        size="sm"
                        icon={<Plus size={14} />}
                        onClick={() => {
                          setActiveStopForActivity(stop);
                          setSelectedActivity(null);
                          setActivitySearchQuery('');
                          setLivePlacesResults([]);
                          setCuratedResults([]);
                          setSearchMode('live');
                          setScheduledDate(stop.startDate);
                        }}
                      >
                        Add Activity
                      </Button>
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Delete Stop"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Scheduled Activities for Stop */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Scheduled Activities ({stopActivities.length})</h4>

                    {stopActivities.length === 0 ? (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                        No activities scheduled for this stop yet. Click "Add Activity" to discover places via Geoapify or add curated attractions.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stopActivities.map((act) => {
                          const actImg = getActivityImageUrl(act.activity?.category, act.activity?.imageUrl);
                          return (
                            <div key={act.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 relative group">
                              <div className="flex space-x-3 items-start">
                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                  <img src={actImg} alt={act.activity.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 pr-6">
                                  <h5 className="font-bold text-slate-900 text-xs truncate">{act.activity.name}</h5>
                                  <Badge variant="emerald" className="mt-0.5 text-[10px] py-0 px-1.5">{act.activity.category || 'Attraction'}</Badge>
                                </div>
                                <button
                                  onClick={() => handleDeleteActivity(stop.id, act.id)}
                                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                                  title="Remove Activity"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                                <Clock size={11} className="text-emerald-600 shrink-0" />
                                <span>{act.scheduledDate} {act.startTime && `at ${act.startTime}`}</span>
                              </p>

                              <div className="pt-1.5 flex items-center justify-between border-t border-slate-200 text-xs">
                                <span className="text-slate-500">Cost:</span>
                                <span className="font-bold text-emerald-700">
                                  {formatDual(act.customCost ?? act.activity?.estimatedCost, act.activity?.currency)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-white border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900">Builder Help & Tips</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">
                ✨ <strong>Geoapify Places Integration:</strong> Search live real-world places and attractions directly inside any city stop.
              </p>
              <p className="leading-relaxed">
                📍 <strong>Multi-Stop Routing:</strong> Add as many destination cities as you wish in chronological order.
              </p>
              <p className="leading-relaxed">
                💰 <strong>Local & Display Currency:</strong> Stored costs use local destination currency while presentation converts instantly to your preferred display currency.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Add City Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add City Destination Stop</h3>
              <button onClick={() => setShowAddStopModal(false)} className="text-slate-500 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStop} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Search Destination City *</label>
                <Input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="e.g. Udaipur, Jaipur, Goa..."
                />
                {citySearchResults.length > 0 && (
                  <div className="mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-md">
                    {citySearchResults.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city);
                          setCitySearchQuery(`${city.name}, ${city.country}`);
                          setCitySearchResults([]);
                        }}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs text-slate-900 font-medium flex justify-between"
                      >
                        <span>{city.name}, {city.region}</span>
                        <span className="text-slate-500">{city.country}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCity && (
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    ✓ Selected: {selectedCity.name}, {selectedCity.country} ({selectedCity.currencyCode})
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date *"
                  type="date"
                  value={stopStartDate}
                  onChange={(e) => setStopStartDate(e.target.value)}
                  required
                />
                <Input
                  label="End Date *"
                  type="date"
                  value={stopEndDate}
                  onChange={(e) => setStopEndDate(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Notes"
                type="text"
                value={stopNotes}
                onChange={(e) => setStopNotes(e.target.value)}
                placeholder="e.g. Hotel reservation near city center"
              />

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddStopModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm" loading={stopSubmitting} disabled={!selectedCity}>
                  Add Stop
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Add Activity Modal (Geoapify Places Dynamic Discovery + Curated Option) */}
      {activeStopForActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 space-y-4 shadow-xl bg-white border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Add Activity to {activeStopForActivity.city.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Native Currency: <strong>{activeStopForActivity.city.currencyCode || 'INR'} ({activeStopForActivity.city.currencySymbol || '₹'})</strong>
                </p>
              </div>
              <button onClick={() => setActiveStopForActivity(null)} className="text-slate-500 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSearchMode('live');
                  setSelectedActivity(null);
                  setActivitySearchQuery('');
                  setLivePlacesResults([]);
                  setLiveSearchError(null);
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  searchMode === 'live'
                    ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe size={14} className={searchMode === 'live' ? 'text-emerald-600' : ''} />
                <span>Live Places (Geoapify)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode('curated');
                  setSelectedActivity(null);
                  setActivitySearchQuery('');
                  setCuratedResults([]);
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                  searchMode === 'curated'
                    ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} className={searchMode === 'curated' ? 'text-emerald-600' : ''} />
                <span>Curated Attractions</span>
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-4">
              {/* Live Places Search */}
              {searchMode === 'live' && (
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Search Places in {activeStopForActivity.city.name} *
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={activitySearchQuery}
                      onChange={(e) => {
                        setActivitySearchQuery(e.target.value);
                        if (selectedActivity && e.target.value !== selectedActivity.name) {
                          setSelectedActivity(null);
                        }
                      }}
                      placeholder={`e.g. Bagore Ki Haveli, City Palace, Lake Pichola...`}
                    />
                    {liveSearching && (
                      <div className="absolute right-3 top-3 text-slate-400">
                        <Loader2 size={16} className="animate-spin text-emerald-600" />
                      </div>
                    )}
                  </div>

                  {convertingPlace && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                      <Loader2 size={14} className="animate-spin text-emerald-700" />
                      <span>Fetching place details & saving activity...</span>
                    </div>
                  )}

                  {liveSearchError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                      ⚠️ {liveSearchError}
                    </div>
                  )}

                  {/* Live Autocomplete Suggestions Dropdown */}
                  {!selectedActivity && activitySearchQuery.trim().length >= 2 && !liveSearching && !liveSearchError && (
                    <div className="mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-lg z-20">
                      {livePlacesResults.length === 0 ? (
                        <div className="p-3 text-xs text-slate-500 italic text-center">
                          No places found.
                        </div>
                      ) : (
                        <>
                          {livePlacesResults.map((sug) => (
                            <div
                              key={sug.id}
                              onClick={() => handleSelectLivePlaceSuggestion(sug)}
                              className="p-3 hover:bg-emerald-50/70 cursor-pointer text-xs transition-colors flex justify-between items-start"
                            >
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{sug.name}</p>
                                {sug.formattedAddress && (
                                  <p className="text-slate-500 text-[11px] mt-0.5">{sug.formattedAddress}</p>
                                )}
                              </div>
                              <Badge variant="emerald" className="text-[10px] shrink-0 ml-2">Live Place</Badge>
                            </div>
                          ))}
                          {liveAttribution && (
                            <div className="p-2 text-[10px] text-slate-400 bg-slate-50 text-center border-t border-slate-100">
                              {liveAttribution}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Explicit Selection Confirmation Banner */}
                  {selectedActivity && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">
                          ✓ Selected: {selectedActivity.name}
                        </span>
                        <Badge variant="emerald" className="text-[10px]">Live Discovered</Badge>
                      </div>
                      <p className="text-emerald-700 text-[11px]">
                        Category: {selectedActivity.category || 'Sightseeing'} • Local Currency: {selectedActivity.currency || activeStopForActivity.city.currencyCode || 'INR'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Curated Pre-Seeded Attractions Search */}
              {searchMode === 'curated' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Search Curated Attractions in {activeStopForActivity.city.name} *
                  </label>
                  <Input
                    type="text"
                    value={activitySearchQuery}
                    onChange={(e) => {
                      setActivitySearchQuery(e.target.value);
                      if (selectedActivity && e.target.value !== selectedActivity.name) {
                        setSelectedActivity(null);
                      }
                    }}
                    placeholder="Search curated attractions..."
                  />

                  {!selectedActivity && curatedResults.length > 0 && (
                    <div className="mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-md">
                      {curatedResults.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => handleSelectCuratedActivity(act)}
                          className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs text-slate-900 flex justify-between items-center font-medium"
                        >
                          <div>
                            <span className="font-bold">{act.name}</span>
                            <span className="text-slate-500 block text-[11px]">{act.category}</span>
                          </div>
                          <span className="text-emerald-700 font-bold">
                            {formatDual(act.estimatedCost, act.currency || activeStopForActivity.city.currencyCode || 'INR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedActivity && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-emerald-900">
                        ✓ Selected Curated Activity: {selectedActivity.name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Date & Time Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Scheduled Date *"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
                <Input
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              {/* Custom Cost in City's Local Currency */}
              <Input
                label={`Custom Cost (${activeStopForActivity.city.currencyCode || 'INR'})`}
                type="number"
                min="0"
                step="10"
                value={customCost}
                onChange={(e) => setCustomCost(e.target.value)}
                placeholder="e.g. 150"
              />

              <Input
                label="Notes"
                type="text"
                value={activityNotes}
                onChange={(e) => setActivityNotes(e.target.value)}
                placeholder="e.g. Guided tour at 10 AM, entry tickets pre-booked"
              />

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <Button type="button" variant="secondary" size="sm" onClick={() => setActiveStopForActivity(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="emerald"
                  size="sm"
                  loading={activitySubmitting || convertingPlace}
                  disabled={!selectedActivity}
                >
                  Assign Activity
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

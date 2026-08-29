import React, { useEffect, useState, useRef } from 'react';
import {
  CityResponse,
  ActivityResponse,
  TripResponse,
  TripStopResponse,
  PlaceResponse,
} from '../types';
import { api } from '../services/api';
import {
  placeSearchService,
  NormalizedPlace,
} from '../services/placeSearchService';
import { useCurrency } from '../context/CurrencyContext';
import { getCityImageUrl, onCityImageError } from '../utils/imageUtils';
import ActivityImage from '../components/common/ActivityImage';

import {
  MapPin,
  Star,
  Search,
  Plus,
  ArrowLeft,
  Clock,
  Check,
  Compass,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Globe,
  Navigation,
  X,
} from 'lucide-react';
import { Button, Card, Badge, Input, LoadingState, ExpandableDescription } from '../components/common/UIComponents';

interface DestinationDetailsPageProps {
  cityId: number;
  onNavigate: (tab: string, param?: string | number) => void;
}

const CATEGORIES = [
  'All',
  'Attractions',
  'Culture',
  'Nature',
  'Shopping',
  'Food',
  'Entertainment',
];

export const DestinationDetailsPage: React.FC<DestinationDetailsPageProps> = ({ cityId, onNavigate }) => {
  const { formatDual } = useCurrency();
  const [city, setCity] = useState<CityResponse | null>(null);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Places Dynamic Discovery states (Geoapify Provider)
  const [livePlaces, setLivePlaces] = useState<NormalizedPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);
  const [placesAttribution, setPlacesAttribution] = useState<string | undefined>(undefined);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<NormalizedPlace[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<NormalizedPlace | null>(null);

  // Debouncing ref for autocomplete
  const autocompleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add to itinerary modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);
  const [userTrips, setUserTrips] = useState<TripResponse[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<number | undefined>(undefined);
  const [tripStops, setTripStops] = useState<TripStopResponse[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<number | undefined>(undefined);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCityDetails();
  }, [cityId]);

  useEffect(() => {
    if (city) {
      loadActivities();
    }
  }, [cityId, selectedCategory, searchQuery]);

  const loadCityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCityById(cityId);
      setCity(data);
    } catch (err: any) {
      setError(err.message || 'Destination not found.');
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      setLoadingActivities(true);
      const categoryParam = selectedCategory === 'All' ? undefined : selectedCategory;
      const searchParam = searchQuery.trim() ? searchQuery.trim() : undefined;
      const data = await api.searchActivities(cityId, searchParam, categoryParam);
      setActivities(data);
    } catch (err: any) {
      console.error('Failed to load curated activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Live Places Search (Geoapify Provider)
  const handleLivePlacesSearch = async (queryToSearch: string) => {
    if (!city || !queryToSearch.trim()) return;
    setLoadingPlaces(true);
    setPlacesError(null);
    setShowAutocomplete(false);
    try {
      const response = await placeSearchService.searchPlaces(queryToSearch.trim(), city.name);
      if (response.error) {
        setPlacesError(response.error.message);
        setLivePlaces([]);
      } else {
        setLivePlaces(response.places);
        setPlacesAttribution(response.attribution);
        if (response.places.length === 0) {
          setPlacesError(`No live places found matching "${queryToSearch}" in ${city.name}.`);
        }
      }
    } catch (err: any) {
      setPlacesError("Couldn't search live places right now. Your saved destinations are still available.");
    } finally {
      setLoadingPlaces(false);
    }
  };

  // Debounced Autocomplete
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (autocompleteTimerRef.current) {
      clearTimeout(autocompleteTimerRef.current);
    }

    if (val.trim().length >= 2 && city) {
      autocompleteTimerRef.current = setTimeout(async () => {
        const response = await placeSearchService.searchPlaces(val.trim(), city.name);
        if (!response.error && response.places.length > 0) {
          setAutocompleteSuggestions(response.places);
          setShowAutocomplete(true);
        } else {
          setShowAutocomplete(false);
        }
      }, 400);
    } else {
      setAutocompleteSuggestions([]);
      setShowAutocomplete(false);
    }
  };

  const handleSelectAutocomplete = (suggestion: NormalizedPlace) => {
    setSearchQuery(suggestion.name);
    setShowAutocomplete(false);
    setSelectedPlaceDetails(suggestion);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleOpenAddModalForActivity = async (activity: ActivityResponse) => {
    setSelectedActivity(activity);
    setShowAddModal(true);
    setLoadingTrips(true);
    try {
      const trips = await api.getTrips();
      setUserTrips(trips);
      if (trips.length > 0) {
        setSelectedTripId(trips[0].id);
        loadStopsForTrip(trips[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load user trips:', err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleAddLivePlaceToItinerary = async (place: NormalizedPlace) => {
    if (!city) return;
    try {
      setSubmitting(true);
      const placeResponse: PlaceResponse = {
        placeId: place.id,
        name: place.name,
        formattedAddress: place.formattedAddress,
        latitude: place.lat,
        longitude: place.lng,
        primaryType: place.category,
      };

      const convertedActivity = await api.convertPlaceToActivity(city.id, placeResponse);
      handleOpenAddModalForActivity(convertedActivity);
    } catch (err: any) {
      alert(err.message || 'Failed to initialize place for itinerary');
    } finally {
      setSubmitting(false);
    }
  };

  const loadStopsForTrip = async (tId: number) => {
    try {
      const stops = await api.getTripStops(tId);
      setTripStops(stops);
      if (stops.length > 0) {
        setSelectedStopId(stops[0].id);
        setScheduledDate(stops[0].startDate);
      } else {
        setSelectedStopId(undefined);
      }
    } catch (err) {
      console.error('Failed to load stops for trip:', err);
    }
  };

  const handleTripChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setSelectedTripId(val);
    loadStopsForTrip(val);
  };

  const handleAddActivityToItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId || !selectedStopId || !selectedActivity || !scheduledDate) {
      alert('Please select a trip, stop, and scheduled date.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createTripActivity(selectedTripId, selectedStopId, {
        activityId: selectedActivity.id,
        scheduledDate,
        notes: notes.trim() || undefined,
      });

      setShowAddModal(false);
      setToastMsg(`Successfully added "${selectedActivity.name}" to your trip!`);
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to add activity to trip.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading destination details..." />;
  }

  if (error || !city) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error || 'Destination not found.'}
        </div>
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => onNavigate('city-search')} className="mt-4">
          Back to Search
        </Button>
      </div>
    );
  }

  const cityImg = getCityImageUrl(city.name, city.region, city.imageUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => onNavigate('city-search')}>
        Back to Destinations
      </Button>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-sm font-semibold animate-bounce">
          <Check size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 shadow-lg border border-slate-200">
        <img src={cityImg} alt={city.name} loading="lazy" onError={onCityImageError} className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-3 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">{city.country}</Badge>
            <Badge variant="neutral" className="bg-white/20 text-white border-white/30 backdrop-blur-xs">
              Popularity #{city.popularityRank}
            </Badge>
            <Badge variant="neutral" className="bg-emerald-500/80 text-white border-none">
              {city.currencyCode} ({city.currencySymbol})
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">{city.name}</h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl flex items-center space-x-2">
            <MapPin size={14} className="text-emerald-400 shrink-0" />
            <span>Region: {city.region || city.name}, {city.country}</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories Pill Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input with Autocomplete */}
          <div className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder={`Search places in ${city.name}...`}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleLivePlacesSearch(searchQuery);
                }
              }}
            />
            {searchQuery && (
              <button
                onClick={() => handleLivePlacesSearch(searchQuery)}
                className="absolute right-2 top-2 p-1 text-emerald-600 hover:text-emerald-800"
                title="Search Live Places"
              >
                <Search size={16} />
              </button>
            )}

            {/* Autocomplete Dropdown */}
            {showAutocomplete && autocompleteSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {autocompleteSuggestions.map((sug) => (
                  <div
                    key={sug.id}
                    onClick={() => handleSelectAutocomplete(sug)}
                    className="p-3 hover:bg-emerald-50 cursor-pointer text-xs space-y-0.5 transition-colors"
                  >
                    <p className="font-bold text-slate-900">{sug.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{sug.formattedAddress}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Live Place Card Details */}
      {selectedPlaceDetails && (
        <Card className="p-6 bg-emerald-50/70 border border-emerald-200 space-y-4 relative">
          <button
            onClick={() => setSelectedPlaceDetails(null)}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"
          >
            <X size={16} />
          </button>
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="emerald">Live Place (Geoapify)</Badge>
                {selectedPlaceDetails.category && (
                  <Badge variant="neutral">{selectedPlaceDetails.category}</Badge>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedPlaceDetails.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{selectedPlaceDetails.formattedAddress}</p>
              {selectedPlaceDetails.attribution && (
                <p className="text-[10px] text-slate-400 mt-1">{selectedPlaceDetails.attribution}</p>
              )}
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button
              variant="emerald"
              size="sm"
              icon={<Plus size={14} />}
              loading={submitting}
              onClick={() => handleAddLivePlaceToItinerary(selectedPlaceDetails)}
            >
              Add Place to Trip Itinerary
            </Button>
          </div>
        </Card>
      )}

      {/* Curated Attractions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Sparkles size={18} className="text-emerald-600" />
            <span>Curated Popular Attractions ({activities.length})</span>
          </h2>
        </div>

        {loadingActivities ? (
          <LoadingState message="Loading attractions..." />
        ) : activities.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-xs italic">
            No curated attractions match your current filter. Try searching live places above!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => {
              return (
                <Card key={act.id} className="overflow-hidden flex flex-col justify-between hover:shadow-md transition-all bg-white border border-slate-200">
                  <div className="space-y-3 p-5">
                    <div className="h-40 rounded-xl overflow-hidden relative border border-slate-200">
                      <ActivityImage
                        imageUrl={act.imageUrl}
                        subcategoryId={act.subcategoryId}
                        category={act.category}
                        alt={act.name}
                        className="w-full h-full rounded-xl"
                        iconSize={36}
                      />
                      <Badge variant="emerald" className="absolute top-3 left-3 shadow-xs">
                        {act.category || 'Attraction'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{act.name}</h3>
                      <ExpandableDescription text={act.description} maxChars={90} className="text-xs text-slate-500 mt-1" />
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Estimated Cost</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {formatDual(act.estimatedCost, act.currency || city.currencyCode)}
                      </span>
                    </div>
                    <Button
                      variant="emerald"
                      size="sm"
                      icon={<Plus size={14} />}
                      onClick={() => handleOpenAddModalForActivity(act)}
                    >
                      Add to Trip
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Activity to Trip Modal */}
      {showAddModal && selectedActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add to Trip Itinerary</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <p className="font-bold text-emerald-900">{selectedActivity.name}</p>
              <p className="text-emerald-700">Cost: {formatDual(selectedActivity.estimatedCost, selectedActivity.currency || city.currencyCode)}</p>
            </div>

            <form onSubmit={handleAddActivityToItinerary} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Select Trip *</label>
                {loadingTrips ? (
                  <p className="text-xs text-slate-500">Loading your trips...</p>
                ) : userTrips.length === 0 ? (
                  <p className="text-xs text-rose-600">You don't have any trips created yet. Create a trip first!</p>
                ) : (
                  <select
                    value={selectedTripId}
                    onChange={handleTripChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.startDate})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {tripStops.length > 0 && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Select Trip Stop *</label>
                  <select
                    value={selectedStopId}
                    onChange={(e) => {
                      const sId = Number(e.target.value);
                      setSelectedStopId(sId);
                      const found = tripStops.find((st) => st.id === sId);
                      if (found) setScheduledDate(found.startDate);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {tripStops.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.city.name} ({st.startDate} to {st.endDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Input
                label="Scheduled Date *"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />

              <Input
                label="Notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Morning visit, entry ticket pre-booked"
              />

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="emerald"
                  size="sm"
                  loading={submitting}
                  disabled={!selectedTripId || !selectedStopId}
                >
                  Add Activity
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

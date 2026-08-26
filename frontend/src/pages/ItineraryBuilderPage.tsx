import React, { useEffect, useState, useRef } from 'react';
import {
  TripResponse,
  TripStopResponse,
  CityResponse,
  ActivityResponse,
  TripActivityResponse,
} from '../types';
import { api } from '../services/api';
import {
  MapPin,
  Calendar,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  Eye,
  Edit3,
  X,
  Search,
  Sparkles,
  ArrowLeft,
  Loader2,
  Compass,
  CheckCircle2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { Button, Card, Badge, Input, LoadingState } from '../components/common/UIComponents';
import { useCurrency } from '../context/CurrencyContext';
import { getCityImageUrl, getActivityImageUrl, onCityImageError, getDestinationImageUrl } from '../utils/imageUtils';
import { DestinationExplorationModal } from '../components/destination/DestinationExplorationModal';

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

  // View Mode: 'destination' (Grouped by Stop) vs 'timeline' (Chronological Day-by-Day)
  const [viewMode, setViewMode] = useState<'destination' | 'timeline'>('destination');

  // Exploration Modal State (Phase 2D Integration)
  const [activeStopForExploration, setActiveStopForExploration] = useState<TripStopResponse | null>(null);

  // Stop Date Edit Modal State
  const [editingStop, setEditingStop] = useState<TripStopResponse | null>(null);
  const [editStopStartDate, setEditStopStartDate] = useState('');
  const [editStopEndDate, setEditStopEndDate] = useState('');
  const [stopUpdateSubmitting, setStopUpdateSubmitting] = useState(false);
  const [stopUpdateError, setStopUpdateError] = useState<string | null>(null);

  // Activity Schedule Edit Modal State
  const [editingTripActivity, setEditingTripActivity] = useState<{ stop: TripStopResponse; ta: TripActivityResponse } | null>(null);
  const [editActivityDate, setEditActivityDate] = useState('');
  const [editActivityTime, setEditActivityTime] = useState('');
  const [editActivityNotes, setEditActivityNotes] = useState('');
  const [editActivityCost, setEditActivityCost] = useState('');
  const [activityUpdateSubmitting, setActivityUpdateSubmitting] = useState(false);
  const [activityUpdateError, setActivityUpdateError] = useState<string | null>(null);

  // Add New Stop Modal State
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<CityResponse[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResponse | null>(null);
  const [newStopStartDate, setNewStopStartDate] = useState('');
  const [newStopEndDate, setNewStopEndDate] = useState('');
  const [newStopNotes, setNewStopNotes] = useState('');
  const [addStopSubmitting, setAddStopSubmitting] = useState(false);

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

  // City Search Handler for Add Stop Modal
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

  // Handle Stop Date Update Submit
  const handleUpdateStopDates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStop || !trip) return;
    setStopUpdateError(null);

    if (editStopStartDate < trip.startDate) {
      setStopUpdateError(`Stop start date cannot be before trip start date (${trip.startDate}).`);
      return;
    }
    if (editStopEndDate > trip.endDate) {
      setStopUpdateError(`Stop end date cannot be after trip end date (${trip.endDate}).`);
      return;
    }
    if (editStopStartDate > editStopEndDate) {
      setStopUpdateError('Stop start date cannot be after end date.');
      return;
    }

    setStopUpdateSubmitting(true);
    try {
      await api.updateTripStop(tripId, editingStop.id, {
        startDate: editStopStartDate,
        endDate: editStopEndDate,
      });

      setEditingStop(null);
      await loadTripData();
    } catch (err: any) {
      setStopUpdateError(err.message || 'Failed to update stop dates.');
    } finally {
      setStopUpdateSubmitting(false);
    }
  };

  // Handle Activity Schedule Update Submit
  const handleUpdateActivitySchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTripActivity) return;
    const { stop, ta } = editingTripActivity;
    setActivityUpdateError(null);

    if (editActivityDate < stop.startDate || editActivityDate > stop.endDate) {
      setActivityUpdateError(`Scheduled date must fall within stop range (${stop.startDate} to ${stop.endDate}).`);
      return;
    }

    setActivityUpdateSubmitting(true);
    try {
      await api.updateTripActivity(tripId, stop.id, ta.id, {
        scheduledDate: editActivityDate,
        startTime: editActivityTime ? (editActivityTime.length === 5 ? `${editActivityTime}:00` : editActivityTime) : undefined,
        notes: editActivityNotes.trim() || undefined,
        customCost: editActivityCost ? parseFloat(editActivityCost) : undefined,
      });

      setEditingTripActivity(null);
      await loadTripData();
    } catch (err: any) {
      setActivityUpdateError(err.message || 'Failed to update activity schedule.');
    } finally {
      setActivityUpdateSubmitting(false);
    }
  };

  // Delete Stop Handler
  const handleDeleteStop = async (stopId: number, destName: string) => {
    if (!window.confirm(`Remove ${destName} from your trip itinerary? Underlying destination catalog data will not be deleted.`)) return;
    try {
      await api.deleteTripStop(tripId, stopId);
      await loadTripData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete stop.');
    }
  };

  // Delete Activity Handler
  const handleDeleteActivity = async (stopId: number, tripActivityId: number) => {
    if (!window.confirm('Remove this activity from your itinerary?')) return;
    try {
      await api.deleteTripActivity(tripId, stopId, tripActivityId);
      await loadTripData();
    } catch (err: any) {
      alert(err.message || 'Failed to remove activity.');
    }
  };

  // Add New Stop Handler
  const handleAddStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !newStopStartDate || !newStopEndDate || !trip) {
      alert('Please select a destination and valid start/end dates.');
      return;
    }
    setAddStopSubmitting(true);
    try {
      await api.createTripStop(tripId, {
        destinationId: selectedCity.id,
        startDate: newStopStartDate,
        endDate: newStopEndDate,
        notes: newStopNotes.trim() || undefined,
      });
      setShowAddStopModal(false);
      setSelectedCity(null);
      setCitySearchQuery('');
      setNewStopStartDate('');
      setNewStopEndDate('');
      setNewStopNotes('');
      await loadTripData();
    } catch (err: any) {
      alert(err.message || 'Failed to add stop');
    } finally {
      setAddStopSubmitting(false);
    }
  };

  // Generate Date List for Chronological Timeline View
  const getTimelineDates = () => {
    if (!trip || !trip.startDate || !trip.endDate) return [];
    const dates: string[] = [];
    const current = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Flat list of all activities across all stops for Chronological Timeline View
  const allActivitiesList: TripActivityResponse[] = (Object.values(activitiesMap) as TripActivityResponse[][]).flat();

  if (loading) {
    return <LoadingState message="Loading itinerary builder..." />;
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error || 'Trip not found.'}
        </div>
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => onNavigate('dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Trip Banner & Mode Switcher */}
      <Card className="p-6 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              <Compass size={16} />
              <span>GlobeTrotter V2 Travel Itinerary</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" />
                {trip.startDate} to {trip.endDate}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-600" />
                {stops.length} Destination Stop{stops.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />} onClick={() => onNavigate('dashboard')}>
              My Trips
            </Button>
            <Button variant="emerald" size="sm" icon={<Plus size={14} />} onClick={() => setShowAddStopModal(true)}>
              Add Destination
            </Button>
          </div>
        </div>

        {/* Mental Model View Switcher: "By Destination" vs "Chronological Timeline" */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('destination')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                viewMode === 'destination'
                  ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin size={14} className={viewMode === 'destination' ? 'text-emerald-600' : ''} />
              <span>By Destination</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar size={14} className={viewMode === 'timeline' ? 'text-emerald-600' : ''} />
              <span>Chronological Timeline</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {viewMode === 'destination'
              ? 'Organized by destination stops & activities'
              : 'Chronological day-by-day travel schedule'}
          </span>
        </div>
      </Card>

      {/* VIEW 1 — BY DESTINATION STOPS */}
      {viewMode === 'destination' && (
        <div className="space-y-6">
          {stops.length === 0 ? (
            <Card className="p-12 text-center space-y-4 bg-white border border-slate-200 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your trip doesn't have any destinations yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Start building your itinerary by adding your first destination stop across India's States & UTs.
                </p>
              </div>
              <Button variant="emerald" size="md" icon={<Plus size={16} />} onClick={() => setShowAddStopModal(true)}>
                Add Destination
              </Button>
            </Card>
          ) : (
            stops.map((stop, idx) => {
              const destination = stop.destination || stop.city;
              const stopActivities = activitiesMap[stop.id] || [];
              const destImage = getDestinationImageUrl(destination.name, destination.imageUrl);

              return (
                <Card key={stop.id} className="p-6 space-y-6 bg-white border border-slate-200 shadow-xs rounded-2xl">
                  {/* Stop Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative border border-slate-200 bg-slate-100">
                        <img
                          src={destImage}
                          alt={destination.name}
                          onError={onCityImageError}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/30" />
                        <span className="absolute inset-0 flex items-center justify-center font-black text-white text-base">
                          #{idx + 1}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-slate-900">{destination.name}</h3>
                          <Badge variant="emerald" className="text-[10px]">
                            {destination.regionName || destination.region || destination.country || 'India'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-emerald-600" />
                            {stop.startDate} to {stop.endDate}
                          </span>
                          <span>•</span>
                          <span>{stopActivities.length} Activit{stopActivities.length !== 1 ? 'ies' : 'y'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Sliders size={13} />}
                        onClick={() => {
                          setEditingStop(stop);
                          setEditStopStartDate(stop.startDate);
                          setEditStopEndDate(stop.endDate);
                        }}
                      >
                        Edit Dates
                      </Button>

                      <Button
                        variant="emerald"
                        size="sm"
                        icon={<Sparkles size={14} />}
                        onClick={() => setActiveStopForExploration(stop)}
                      >
                        + Explore Destination
                      </Button>

                      <button
                        onClick={() => handleDeleteStop(stop.id, destination.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Remove Stop"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Destination Scheduled Activities */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                        Planned Activities ({stopActivities.length})
                      </h4>
                    </div>

                    {stopActivities.length === 0 ? (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                        <p className="text-xs text-slate-500">No activities planned yet for {destination.name}.</p>
                        <Button
                          variant="emerald"
                          size="sm"
                          icon={<Sparkles size={14} />}
                          onClick={() => setActiveStopForExploration(stop)}
                        >
                          Explore {destination.name} Highlights & Places →
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {stopActivities.map((ta) => {
                          const act = ta.activity;
                          const isScheduled = !!ta.scheduledDate;

                          return (
                            <div
                              key={ta.id}
                              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group hover:bg-white hover:shadow-xs transition-all"
                            >
                              <div className="flex space-x-3 items-start pr-6">
                                <img
                                  src={getActivityImageUrl(act?.category, act?.imageUrl)}
                                  alt={act?.name || 'Activity'}
                                  onError={onCityImageError}
                                  className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-bold text-slate-900 text-xs truncate">{act?.name || 'Activity'}</h5>
                                  <span className="text-[10px] text-emerald-700 font-semibold uppercase bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                    {act?.category || 'Sightseeing'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteActivity(stop.id, ta.id)}
                                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Remove activity"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                                  <Clock size={12} className="text-emerald-600 shrink-0" />
                                  <span>
                                    {isScheduled ? `${ta.scheduledDate}${ta.startTime ? ` at ${ta.startTime}` : ''}` : 'Not scheduled'}
                                  </span>
                                </div>

                                <button
                                  onClick={() => {
                                    setEditingTripActivity({ stop, ta });
                                    setEditActivityDate(ta.scheduledDate || stop.startDate);
                                    setEditActivityTime(ta.startTime || '');
                                    setEditActivityNotes(ta.notes || '');
                                    setEditActivityCost(ta.customCost ? ta.customCost.toString() : '');
                                  }}
                                  className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                                >
                                  <Edit3 size={11} /> Schedule
                                </button>
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
      )}

      {/* VIEW 2 — CHRONOLOGICAL TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {getTimelineDates().map((dateStr) => {
            const dayActivities = allActivitiesList.filter((ta: TripActivityResponse) => ta.scheduledDate === dateStr);
            const dateObj = new Date(dateStr);
            const formattedDay = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <Card key={dateStr} className="p-6 space-y-4 bg-white border border-slate-200 shadow-xs rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{formattedDay}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{dateStr}</span>
                    </div>
                  </div>
                  <Badge variant="emerald">{dayActivities.length} Activity{dayActivities.length !== 1 ? 'ies' : ''}</Badge>
                </div>

                {dayActivities.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-slate-100">
                    No activities scheduled for this day.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayActivities
                      .sort((a: TripActivityResponse, b: TripActivityResponse) => (a.startTime || '').localeCompare(b.startTime || ''))
                      .map((ta: TripActivityResponse) => {
                        const act = ta.activity;
                        const parentStop = stops.find((s) => s.id === ta.tripStopId);
                        const destName = parentStop ? (parentStop.destination?.name || parentStop.city?.name) : 'Destination';

                        return (
                          <div
                            key={ta.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
                          >
                            <div className="flex items-center space-x-3.5 min-w-0">
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                <img
                                  src={getActivityImageUrl(act?.category, act?.imageUrl)}
                                  alt={act?.name || 'Activity'}
                                  onError={onCityImageError}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-bold text-slate-900 text-xs truncate">{act?.name}</h4>
                                  <Badge variant="outline" className="text-[9px] py-0 px-1">
                                    {destName}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-0.5 font-medium">
                                  {ta.startTime && (
                                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                                      <Clock size={11} /> {ta.startTime}
                                    </span>
                                  )}
                                  {act?.category && <span>• {act.category}</span>}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => parentStop && handleDeleteActivity(parentStop.id, ta.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Remove activity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* PHASE 2D DESTINATION EXPLORATION MODAL INTEGRATION */}
      {activeStopForExploration && (
        <DestinationExplorationModal
          tripId={tripId}
          stop={activeStopForExploration}
          existingTripActivities={activitiesMap[activeStopForExploration.id] || []}
          onClose={() => setActiveStopForExploration(null)}
          onActivitiesUpdated={loadTripData}
        />
      )}

      {/* STOP DATE EDIT MODAL */}
      {editingStop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-xl bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Stop Dates: {editingStop.destination?.name || editingStop.city?.name}
              </h3>
              <button onClick={() => setEditingStop(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            {stopUpdateError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {stopUpdateError}
              </div>
            )}

            <form onSubmit={handleUpdateStopDates} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date *"
                  type="date"
                  value={editStopStartDate}
                  onChange={(e) => setEditStopStartDate(e.target.value)}
                  required
                />
                <Input
                  label="End Date *"
                  type="date"
                  value={editStopEndDate}
                  onChange={(e) => setEditStopEndDate(e.target.value)}
                  required
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Trip Range: {trip.startDate} to {trip.endDate}
              </p>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="secondary" size="sm" onClick={() => setEditingStop(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm" loading={stopUpdateSubmitting}>
                  Save Stop Dates
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ACTIVITY SCHEDULING EDIT MODAL */}
      {editingTripActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-xl bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Schedule {editingTripActivity.ta.activity?.name}
              </h3>
              <button onClick={() => setEditingTripActivity(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            {activityUpdateError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {activityUpdateError}
              </div>
            )}

            <form onSubmit={handleUpdateActivitySchedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Scheduled Date *"
                  type="date"
                  value={editActivityDate}
                  onChange={(e) => setEditActivityDate(e.target.value)}
                  required
                />
                <Input
                  label="Start Time"
                  type="time"
                  value={editActivityTime}
                  onChange={(e) => setEditActivityTime(e.target.value)}
                />
              </div>

              <Input
                label="Custom Cost (Optional)"
                type="number"
                min="0"
                step="10"
                value={editActivityCost}
                onChange={(e) => setEditActivityCost(e.target.value)}
                placeholder="e.g. 150"
              />

              <Input
                label="Notes"
                type="text"
                value={editActivityNotes}
                onChange={(e) => setEditActivityNotes(e.target.value)}
                placeholder="e.g. Morning entry tickets pre-booked"
              />

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="secondary" size="sm" onClick={() => setEditingTripActivity(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm" loading={activityUpdateSubmitting}>
                  Save Schedule
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ADD STOP MODAL */}
      {showAddStopModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-xl bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Destination Stop</h3>
              <button onClick={() => setShowAddStopModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStopSubmit} className="space-y-4">
              <div className="space-y-1 relative">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Search Destination *</label>
                <Input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="e.g. Jaipur, Bengaluru, Ooty..."
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
                    ✓ Selected: {selectedCity.name}, {selectedCity.country}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Date *"
                  type="date"
                  value={newStopStartDate}
                  onChange={(e) => setNewStopStartDate(e.target.value)}
                  required
                />
                <Input
                  label="End Date *"
                  type="date"
                  value={newStopEndDate}
                  onChange={(e) => setNewStopEndDate(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Notes"
                type="text"
                value={newStopNotes}
                onChange={(e) => setNewStopNotes(e.target.value)}
                placeholder="e.g. Hotel reservation in city center"
              />

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddStopModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm" loading={addStopSubmitting} disabled={!selectedCity}>
                  Add Destination
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

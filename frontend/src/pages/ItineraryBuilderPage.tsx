import React, { useEffect, useState } from 'react';
import {
  TripResponse,
  TripStopResponse,
  CityResponse,
  ActivityResponse,
  TripActivityResponse,
} from '../types';
import { api } from '../services/api';

interface ItineraryBuilderPageProps {
  tripId: number;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const ItineraryBuilderPage: React.FC<ItineraryBuilderPageProps> = ({ tripId, onNavigate }) => {
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
  const [activitySearchResults, setActivitySearchResults] = useState<ActivityResponse[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  const [customCost, setCustomCost] = useState<string>('');
  const [activitySubmitting, setActivitySubmitting] = useState(false);

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

      // Load activities for each stop
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

  // Activity Search handler
  useEffect(() => {
    if (!activeStopForActivity) return;
    const timer = setTimeout(async () => {
      try {
        const results = await api.searchActivities(
          activeStopForActivity.city.id,
          activitySearchQuery || undefined
        );
        setActivitySearchResults(results);
      } catch {
        setActivitySearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [activitySearchQuery, activeStopForActivity]);

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
    return (
      <div className="text-center py-16 text-slate-400 flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span>Loading itinerary builder...</span>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-950/80 border border-red-800 p-6 rounded-xl text-red-300 text-sm">
          {error || 'Trip not found.'}
        </div>
        <button
          onClick={() => onNavigate('my-trips')}
          className="mt-4 text-xs font-semibold text-blue-400 hover:underline"
        >
          ← Back to My Trips
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Trip Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
            <span>Itinerary Builder</span>
            <span>•</span>
            <span>ID #{trip.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{trip.name}</h1>
          <p className="text-xs text-slate-400 mt-1">{trip.description || 'No description'}</p>
          <div className="flex items-center space-x-4 text-xs text-slate-300 mt-2">
            <span>📅 {trip.startDate} - {trip.endDate}</span>
            <span>💰 Budget: ${trip.budget ? trip.budget.toLocaleString() : '0'}</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
          <button
            onClick={() => onNavigate('builder', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
          >
            🛠️ Builder
          </button>
          <button
            onClick={() => onNavigate('view', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
          >
            👁️ Read View
          </button>
          <button
            onClick={() => onNavigate('budget', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
          >
            💰 Budget
          </button>
          <button
            onClick={() => onNavigate('timeline', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
          >
            ⏱️ Timeline
          </button>
          <button
            onClick={() => onNavigate('sharing', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
          >
            🌐 Share
          </button>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Trip Stops ({stops.length})</h2>
        <button
          onClick={() => setShowAddStopModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow flex items-center space-x-1"
        >
          <span>+ Add City Stop</span>
        </button>
      </div>

      {/* Stops List */}
      {stops.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">
          <p className="text-base font-semibold text-slate-300">No stops added yet</p>
          <p className="text-xs mt-1">Add your first destination city to start scheduling activities!</p>
          <button
            onClick={() => setShowAddStopModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            + Add First Stop
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {stops.map((stop, index) => {
            const stopActivities = activitiesMap[stop.id] || [];
            return (
              <div
                key={stop.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md"
              >
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {stop.city.name}, <span className="text-slate-400 text-sm font-normal">{stop.city.country}</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        📅 {stop.startDate} to {stop.endDate} {stop.notes && `• ${stop.notes}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setActiveStopForActivity(stop);
                        setScheduledDate(stop.startDate);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-medium px-3 py-1.5 rounded border border-slate-700"
                    >
                      + Add Activity
                    </button>
                    <button
                      onClick={() => handleDeleteStop(stop.id)}
                      className="text-xs text-red-400 hover:text-red-300 p-1.5 hover:bg-red-950/40 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Stop Activities Section */}
                <div className="space-y-2 pl-4 border-l-2 border-slate-800">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Scheduled Activities ({stopActivities.length})
                  </h4>
                  {stopActivities.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No activities added to this stop yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stopActivities.map((act) => (
                        <div
                          key={act.id}
                          className="bg-slate-850 border border-slate-800 rounded-lg p-3 text-xs space-y-1 relative group"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-white">{act.activity.name}</span>
                            <button
                              onClick={() => handleDeleteActivity(stop.id, act.id)}
                              className="text-red-400 hover:text-red-300 font-bold ml-1 text-sm"
                            >
                              ×
                            </button>
                          </div>
                          <span className="inline-block bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                            {act.activity.category || 'General'}
                          </span>
                          <p className="text-slate-400">
                            📅 {act.scheduledDate} {act.startTime && `at ${act.startTime}`}
                          </p>
                          <p className="font-semibold text-emerald-400">
                            Cost: ${act.customCost ?? act.activity.estimatedCost ?? 0}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add City Stop</h3>
              <button onClick={() => setShowAddStopModal(false)} className="text-slate-400 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStop} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Search City *
                </label>
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="e.g. Paris, Tokyo, London..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                {citySearchResults.length > 0 && (
                  <div className="mt-1 max-h-40 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg divide-y divide-slate-700">
                    {citySearchResults.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city);
                          setCitySearchQuery(`${city.name}, ${city.country}`);
                          setCitySearchResults([]);
                        }}
                        className="p-2 hover:bg-slate-700 cursor-pointer text-xs text-white flex justify-between"
                      >
                        <span>{city.name}, {city.country}</span>
                        <span className="text-slate-400">{city.region || ''}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCity && (
                  <p className="text-xs text-emerald-400 mt-1 font-semibold">
                    Selected: {selectedCity.name}, {selectedCity.country}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={stopStartDate}
                    onChange={(e) => setStopStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={stopEndDate}
                    onChange={(e) => setStopEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={stopNotes}
                  onChange={(e) => setStopNotes(e.target.value)}
                  placeholder="e.g. Staying near City Center"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stopSubmitting || !selectedCity}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                >
                  {stopSubmitting ? 'Adding...' : 'Add Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {activeStopForActivity && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                Add Activity to {activeStopForActivity.city.name}
              </h3>
              <button onClick={() => setActiveStopForActivity(null)} className="text-slate-400 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Search Activity *
                </label>
                <input
                  type="text"
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  placeholder="e.g. Museum, Tour, Dinner..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                />
                {activitySearchResults.length > 0 && (
                  <div className="mt-1 max-h-40 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg divide-y divide-slate-700">
                    {activitySearchResults.map((act) => (
                      <div
                        key={act.id}
                        onClick={() => {
                          setSelectedActivity(act);
                          setActivitySearchQuery(act.name);
                          setCustomCost(act.estimatedCost ? act.estimatedCost.toString() : '0');
                          setActivitySearchResults([]);
                        }}
                        className="p-2 hover:bg-slate-700 cursor-pointer text-xs text-white flex justify-between"
                      >
                        <span>{act.name} ({act.category || 'General'})</span>
                        <span className="text-emerald-400 font-semibold">${act.estimatedCost || 0}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedActivity && (
                  <p className="text-xs text-emerald-400 mt-1 font-semibold">
                    Selected: {selectedActivity.name} (${selectedActivity.estimatedCost || 0})
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Custom Cost ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={customCost}
                  onChange={(e) => setCustomCost(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  placeholder="e.g. Booked tickets online"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveStopForActivity(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={activitySubmitting || !selectedActivity}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                >
                  {activitySubmitting ? 'Assigning...' : 'Assign Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

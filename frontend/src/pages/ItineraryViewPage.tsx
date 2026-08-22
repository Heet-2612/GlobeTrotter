import React, { useEffect, useState } from 'react';
import { TripResponse, TripStopResponse, TripActivityResponse } from '../types';
import { api } from '../services/api';

interface ItineraryViewPageProps {
  tripId: number;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const ItineraryViewPage: React.FC<ItineraryViewPageProps> = ({ tripId, onNavigate }) => {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [stops, setStops] = useState<TripStopResponse[]>([]);
  const [activitiesMap, setActivitiesMap] = useState<Record<number, TripActivityResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItinerary();
  }, [tripId]);

  const loadItinerary = async () => {
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
      setError(err.message || 'Failed to load itinerary details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400 flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span>Loading itinerary...</span>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-950/80 border border-red-800 p-6 rounded-xl text-red-300 text-sm">
          {error || 'Trip not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Read-Only Itinerary View
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">{trip.name}</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">{trip.description || 'No description'}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('builder', tripId)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              🛠️ Builder
            </button>
            <button
              onClick={() => onNavigate('view', tripId)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
            >
              👁️ Read View
            </button>
            <button
              onClick={() => onNavigate('budget', tripId)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              💰 Budget
            </button>
            <button
              onClick={() => onNavigate('timeline', tripId)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              ⏱️ Timeline
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-300">
          <div>
            <span className="text-slate-500 text-xs block">TRIP DATES</span>
            <span className="font-semibold text-white">📅 {trip.startDate} to {trip.endDate}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">TARGET BUDGET</span>
            <span className="font-semibold text-emerald-400">💰 ${trip.budget ? trip.budget.toLocaleString() : '0'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">SHARING STATUS</span>
            <span className="font-semibold text-blue-400">{trip.isPublic ? '🌐 Shared Publicly' : '🔒 Private'}</span>
          </div>
        </div>
      </div>

      {/* Itinerary Stops Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Itinerary Overview ({stops.length} Stops)</h2>

        {stops.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No stops have been added to this trip yet.
          </div>
        ) : (
          stops.map((stop, idx) => {
            const stopActivities = activitiesMap[stop.id] || [];
            return (
              <div key={stop.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {stop.city.name}, {stop.city.country}
                    </h3>
                    <p className="text-xs text-slate-400">
                      📅 {stop.startDate} - {stop.endDate} {stop.notes && `• ${stop.notes}`}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pl-4">
                  <h4 className="text-xs font-semibold uppercase text-slate-400">Scheduled Activities</h4>
                  {stopActivities.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No activities scheduled for this city stop.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stopActivities.map((act) => (
                        <div key={act.id} className="bg-slate-850 border border-slate-800 rounded-lg p-4 space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white text-sm">{act.activity.name}</span>
                            <span className="text-xs font-semibold text-emerald-400">
                              ${act.customCost ?? act.activity.estimatedCost ?? 0}
                            </span>
                          </div>
                          <span className="inline-block bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                            {act.activity.category || 'Attraction'}
                          </span>
                          <p className="text-xs text-slate-400 mt-1">
                            📅 {act.scheduledDate} {act.startTime && `• ⏰ ${act.startTime}`}
                          </p>
                          {act.notes && <p className="text-xs text-slate-400 italic">"{act.notes}"</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { TripResponse, TripStopResponse, TripActivityResponse } from '../types';
import { api } from '../services/api';

interface TimelinePageProps {
  tripId: number;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ tripId, onNavigate }) => {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [stops, setStops] = useState<TripStopResponse[]>([]);
  const [activitiesMap, setActivitiesMap] = useState<Record<number, TripActivityResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTimeline();
  }, [tripId]);

  const loadTimeline = async () => {
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
      setError(err.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400 flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span>Loading trip timeline...</span>
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
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Chronological Timeline View
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">{trip.name}</h1>
          <p className="text-xs text-slate-400">📅 {trip.startDate} to {trip.endDate}</p>
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
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
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
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
          >
            ⏱️ Timeline
          </button>
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Day-by-Day Timeline</h2>

        {stops.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No stops or scheduled events in timeline yet.
          </div>
        ) : (
          <div className="relative border-l-2 border-blue-600/50 pl-6 ml-4 space-y-8">
            {stops.map((stop, idx) => {
              const stopActivities = activitiesMap[stop.id] || [];
              return (
                <div key={stop.id} className="relative group">
                  {/* Timeline Dot Marker */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-slate-950 shadow-md"></div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          Stop #{idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white">
                          {stop.city.name}, {stop.city.country}
                        </h3>
                        <p className="text-xs text-slate-400">
                          📅 {stop.startDate} - {stop.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Activities</p>
                      {stopActivities.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No scheduled activities.</p>
                      ) : (
                        <div className="space-y-2">
                          {stopActivities.map((act) => (
                            <div
                              key={act.id}
                              className="bg-slate-850 border border-slate-800 rounded-lg p-3 text-xs flex justify-between items-center"
                            >
                              <div>
                                <span className="font-bold text-white block">{act.activity.name}</span>
                                <span className="text-slate-400">
                                  📅 {act.scheduledDate} {act.startTime && `• ⏰ ${act.startTime}`}
                                </span>
                              </div>
                              <span className="font-semibold text-emerald-400">
                                ${act.customCost ?? act.activity.estimatedCost ?? 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { TripResponse } from '../types';
import { api } from '../services/api';

interface MyTripsPageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ onNavigate }) => {
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await api.getTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeletingId(tripId);
    try {
      await api.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete trip');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTrips = trips.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">My Trips</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your travel itineraries, itineraries, budgets, and public shares
          </p>
        </div>
        <button
          onClick={() => onNavigate('create-trip')}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition-colors flex items-center justify-center space-x-2"
        >
          <span>+ Create New Trip</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter trips by name or description..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading trips...</span>
        </div>
      ) : error ? (
        <div className="bg-red-950/80 border border-red-800 p-4 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <p className="text-lg font-semibold text-slate-300">No trips found</p>
          <p className="text-sm mt-1">
            {search ? 'No trips match your search filter.' : 'You haven’t created any trips yet.'}
          </p>
          {!search && (
            <button
              onClick={() => onNavigate('create-trip')}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Create Trip Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    {trip.isPublic ? '🌐 Shared Publicly' : '🔒 Private'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">#{trip.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-3 truncate">{trip.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
                  {trip.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>📅 {trip.startDate} - {trip.endDate}</span>
                  <span className="font-semibold text-emerald-400">
                    ${trip.budget ? trip.budget.toLocaleString() : '0'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onNavigate('builder', trip.id)}
                    className="bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-medium py-1.5 rounded transition-colors"
                  >
                    🛠️ Builder
                  </button>
                  <button
                    onClick={() => onNavigate('view', trip.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded border border-slate-700 transition-colors"
                  >
                    👁️ Read View
                  </button>
                  <button
                    onClick={() => onNavigate('budget', trip.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded border border-slate-700 transition-colors"
                  >
                    💰 Budget
                  </button>
                  <button
                    onClick={() => onNavigate('timeline', trip.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded border border-slate-700 transition-colors"
                  >
                    ⏱️ Timeline
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() => handleDelete(trip.id, trip.name)}
                    disabled={deletingId === trip.id}
                    className="text-xs text-red-400 hover:text-red-300 font-medium py-1 px-2 rounded hover:bg-red-950/40 transition-colors disabled:opacity-50"
                  >
                    {deletingId === trip.id ? 'Deleting...' : '🗑️ Delete Trip'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

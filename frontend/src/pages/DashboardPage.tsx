import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TripResponse } from '../types';
import { api } from '../services/api';

interface DashboardPageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const activeTrip = trips.length > 0 ? trips[0] : null;
  const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="inline-block bg-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-blue-400/20">
            GlobeTrotter Travel Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Explorer'}! 👋
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Plan your next journey, organize destinations, curate activities, and track your budget seamlessly.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('create-trip')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
            >
              <span>+ Create New Trip</span>
            </button>
            <button
              onClick={() => onNavigate('my-trips')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-4 py-2.5 rounded-lg border border-slate-700 transition-colors"
            >
              View All Trips ({trips.length})
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Trips</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{trips.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Trip</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1 truncate">
            {activeTrip ? activeTrip.name : 'None'}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Planned Budget</p>
          <p className="text-3xl font-bold text-indigo-400 mt-1">${totalBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Content Sections */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading dashboard...</span>
        </div>
      ) : error ? (
        <div className="bg-red-950/80 border border-red-800 p-4 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active / Recent Trips List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Trips</h2>
              <button
                onClick={() => onNavigate('my-trips')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                See all →
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
                <p className="text-base font-semibold text-slate-300">No trips created yet</p>
                <p className="text-sm mt-1">Start planning by creating your first trip!</p>
                <button
                  onClick={() => onNavigate('create-trip')}
                  className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Create Trip Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.slice(0, 4).map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => onNavigate('builder', trip.id)}
                    className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                          {trip.isPublic ? '🌐 Shared' : '🔒 Private'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ID: #{trip.id}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-3 truncate">{trip.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {trip.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <div>
                        📅 {trip.startDate} - {trip.endDate}
                      </div>
                      <div className="font-semibold text-emerald-400">
                        ${trip.budget ? trip.budget.toLocaleString() : '0'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Navigation Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Explore Features</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <button
                onClick={() => onNavigate('city-search')}
                className="w-full text-left p-3 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between text-white"
              >
                <div>
                  <p className="font-semibold text-sm">🌆 Destination Cities</p>
                  <p className="text-xs text-slate-400">Search world cities & cost indexes</p>
                </div>
                <span className="text-blue-400 font-bold">→</span>
              </button>

              <button
                onClick={() => onNavigate('activity-search')}
                className="w-full text-left p-3 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between text-white"
              >
                <div>
                  <p className="font-semibold text-sm">🎡 Discover Activities</p>
                  <p className="text-xs text-slate-400">Browse tours, attractions, dining</p>
                </div>
                <span className="text-blue-400 font-bold">→</span>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="w-full text-left p-3 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-between text-white"
              >
                <div>
                  <p className="font-semibold text-sm">👤 User Profile & Settings</p>
                  <p className="text-xs text-slate-400">Manage account & preferences</p>
                </div>
                <span className="text-blue-400 font-bold">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

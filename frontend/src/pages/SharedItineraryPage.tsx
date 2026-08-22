import React, { useEffect, useState } from 'react';
import { PublicTripItineraryResponse } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SharedItineraryPageProps {
  shareToken: string;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const SharedItineraryPage: React.FC<SharedItineraryPageProps> = ({ shareToken, onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const [itinerary, setItinerary] = useState<PublicTripItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccessMsg, setCopySuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadPublicTrip();
  }, [shareToken]);

  const loadPublicTrip = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPublicTrip(shareToken);
      setItinerary(data);
    } catch (err: any) {
      setError(err.message || 'Public itinerary not found or sharing has been disabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    setCopying(true);
    setCopySuccessMsg(null);
    try {
      const copiedTrip = await api.copyPublicTrip(shareToken);
      setCopySuccessMsg('Trip copied to your account successfully!');
      setTimeout(() => {
        onNavigate('builder', copiedTrip.id);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to copy public trip');
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span>Loading public itinerary...</span>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <div className="bg-red-950/80 border border-red-800 p-8 rounded-xl text-center space-y-3">
          <span className="text-3xl">🔒</span>
          <h2 className="text-xl font-bold text-white">Public Itinerary Unavailable</h2>
          <p className="text-sm text-red-300">
            {error || 'The requested public share link is invalid or has expired.'}
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            Go to GlobeTrotter Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Public Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-block bg-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/20 mb-2">
              🌐 Shared Itinerary by {itinerary.creatorName || 'GlobeTrotter User'}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">{itinerary.name}</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              {itinerary.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex flex-col sm:items-end space-y-2">
            <button
              onClick={handleCopyTrip}
              disabled={copying}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <span>📋 {copying ? 'Copying...' : 'Copy to My Trips'}</span>
            </button>
            {!isAuthenticated && (
              <span className="text-[11px] text-slate-400">Log in to clone this trip to your account</span>
            )}
          </div>
        </div>

        {copySuccessMsg && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs rounded-lg font-semibold">
            {copySuccessMsg}
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-6 text-sm text-slate-300">
          <div>
            <span className="text-slate-500 text-xs block">DATES</span>
            <span className="font-semibold text-white">📅 {itinerary.startDate} to {itinerary.endDate}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">ESTIMATED BUDGET</span>
            <span className="font-semibold text-emerald-400">💰 ${itinerary.budget ? itinerary.budget.toLocaleString() : '0'}</span>
          </div>
        </div>
      </div>

      {/* Stops & Activities Public View */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Itinerary Stops ({itinerary.stops.length})</h2>

        {itinerary.stops.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No stops defined in this shared itinerary.
          </div>
        ) : (
          itinerary.stops.map((stop, idx) => (
            <div key={stop.id || idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {stop.cityName}, {stop.country}
                  </h3>
                  <p className="text-xs text-slate-400">
                    📅 {stop.startDate} - {stop.endDate} {stop.notes && `• ${stop.notes}`}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pl-4">
                <h4 className="text-xs font-semibold uppercase text-slate-400">Activities</h4>
                {!stop.activities || stop.activities.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No scheduled activities for this city stop.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stop.activities.map((act, actIdx) => (
                      <div key={act.id || actIdx} className="bg-slate-850 border border-slate-800 rounded-lg p-4 space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white text-sm">{act.name}</span>
                          <span className="text-xs font-semibold text-emerald-400">${act.cost}</span>
                        </div>
                        <span className="inline-block bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                          {act.category}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          📅 {act.scheduledDate} {act.startTime && `• ⏰ ${act.startTime}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

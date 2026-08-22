import React, { useEffect, useState } from 'react';
import { TripSharingResponse } from '../types';
import { api } from '../services/api';

interface SharingSectionProps {
  tripId: number;
}

export const SharingSection: React.FC<SharingSectionProps> = ({ tripId }) => {
  const [sharing, setSharing] = useState<TripSharingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSharing();
  }, [tripId]);

  const loadSharing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSharingStatus(tripId);
      setSharing(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load sharing details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSharing = async (isPublic: boolean) => {
    try {
      setUpdating(true);
      setError(null);
      const updated = await api.updateSharing(tripId, { isPublic });
      setSharing(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update sharing');
    } finally {
      setUpdating(false);
    }
  };

  const getPublicLink = () => {
    if (!sharing || !sharing.shareToken) return '';
    return `${window.location.origin}/#public/${sharing.shareToken}`;
  };

  const handleCopyLink = () => {
    const link = getPublicLink();
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400 flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <span>Loading sharing status...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Public Sharing Settings</h3>
          <p className="text-xs text-slate-400 mt-1">
            Allow anyone with the link to view your trip itinerary without needing an account
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-300 font-semibold">
            {sharing?.isPublic ? 'Public' : 'Private'}
          </span>
          <button
            onClick={() => handleToggleSharing(!sharing?.isPublic)}
            disabled={updating}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              sharing?.isPublic ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {sharing?.isPublic ? (
        <div className="space-y-3 bg-slate-850 p-4 rounded-lg border border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Public Share URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={getPublicLink()}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Share Token: <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-400">{sharing.shareToken}</code>
          </p>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 text-xs">
          This trip is currently private. Enable sharing above to generate a public link.
        </div>
      )}
    </div>
  );
};

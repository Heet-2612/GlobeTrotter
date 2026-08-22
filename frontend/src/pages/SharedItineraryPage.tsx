import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Calendar, MapPin, DollarSign, Sparkles, 
  Copy, Check, Share2, ArrowRight, User as UserIcon, 
  CheckCircle2, Clock, ShieldCheck, AlertCircle
} from 'lucide-react';
import { sharingService } from '../services/sharingService';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { PublicTripItineraryResponse } from '../types';

interface SharedItineraryPageProps {
  shareToken: string;
  onSelectTab: (tab: string) => void;
}

export const SharedItineraryPage: React.FC<SharedItineraryPageProps> = ({ 
  shareToken, onSelectTab 
}) => {
  const { user } = useAuth();
  const { loadTrips, setActiveTripId } = useTrip();
  const [itinerary, setItinerary] = useState<PublicTripItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [clonedSuccess, setClonedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);
    sharingService.getPublicTripItinerary(shareToken)
      .then(res => setItinerary(res))
      .catch(err => {
        console.error('Failed to load public itinerary', err);
        setErrorMsg('This itinerary is unavailable or private.');
      })
      .finally(() => setLoading(false));
  }, [shareToken]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCloneTrip = async () => {
    if (!user) {
      onSelectTab('login');
      return;
    }
    setCloning(true);
    setErrorMsg(null);

    try {
      const clonedTrip = await sharingService.copyPublicTrip(shareToken);
      await loadTrips();
      await setActiveTripId(clonedTrip.id);
      setClonedSuccess(true);
      setTimeout(() => {
        onSelectTab('my-trips');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to copy trip to your account.');
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        Loading public traveler itinerary from GlobeTrotter...
      </div>
    );
  }

  if (errorMsg || !itinerary) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4 max-w-lg mx-auto my-12 shadow-sm">
        <Globe className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 font-['Outfit']">Shared Itinerary Unavailable</h3>
        <p className="text-xs text-slate-500">This travel link may be private, expired, or the token is invalid.</p>
        <button
          onClick={() => onSelectTab('dashboard')}
          className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const stops = itinerary.stops || [];
  const totalActivitiesCount = stops.reduce((acc, s) => acc + (s.activities ? s.activities.length : 0), 0);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Read-Only Public Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 shadow-sm">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>You are viewing a <strong>public read-only itinerary</strong> created by <strong>{itinerary.creatorName || 'Traveler'}</strong>.</span>
        </div>
        
        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center space-x-1 flex-shrink-0"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <img
          src={itinerary.coverPhoto || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={itinerary.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              Public Journey
            </span>
            <span className="text-xs text-slate-300">
              Curated by <strong className="text-white">{itinerary.creatorName || 'Traveler'}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight">
            {itinerary.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {itinerary.description || 'A complete multi-city itinerary with scheduled experiences.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{itinerary.startDate} to {itinerary.endDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{stops.length} City Destinations</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5 font-bold text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span>{totalActivitiesCount} Scheduled Experiences</span>
            </span>
            {itinerary.budget !== undefined && itinerary.budget !== null && (
              <>
                <span>•</span>
                <span className="flex items-center space-x-1 font-bold text-emerald-300">
                  <DollarSign className="w-4 h-4" />
                  <span>${Number(itinerary.budget).toLocaleString()} Target Budget</span>
                </span>
              </>
            )}
          </div>

          {/* Clone CTA */}
          <div className="pt-4">
            <button
              onClick={handleCloneTrip}
              disabled={cloning}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-xs font-extrabold shadow-xl shadow-emerald-500/20 active:scale-95 transition flex items-center space-x-2 cursor-pointer"
            >
              {cloning ? (
                <span>Cloning Itinerary into Your Account...</span>
              ) : clonedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Trip Successfully Cloned! Navigating...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{user ? 'Copy Trip to My Account' : 'Log in to Copy Trip'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Structured Multi-City Stops & Activities Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
          Public Destination Route & Schedule
        </h2>

        {stops.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 text-xs text-slate-500">
            No city stops published for this itinerary.
          </div>
        ) : (
          <div className="space-y-4">
            {stops.map((stop, sIdx) => (
              <div
                key={stop.stopId || sIdx}
                className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      {stop.stopOrder || sIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                        {stop.city?.name}, <span className="text-slate-500 font-normal text-xs">{stop.city?.country}</span>
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{stop.startDate} to {stop.endDate}</span>
                        {stop.notes && <span>• {stop.notes}</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {stop.activities.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No activities scheduled for {stop.city?.name}.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stop.activities.map((act) => (
                      <div key={act.tripActivityId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                            {act.category || 'SIGHTSEEING'}
                          </span>
                          <span className="text-xs font-black text-emerald-700">
                            ${(act.cost || 0).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mt-1">{act.activityName}</p>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{act.scheduledDate}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{act.startTime || '10:00:00'} ({act.durationMinutes || 60}m)</span>
                          </span>
                        </p>
                        {act.notes && (
                          <p className="text-[11px] text-slate-600 italic pt-1">
                            Note: {act.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

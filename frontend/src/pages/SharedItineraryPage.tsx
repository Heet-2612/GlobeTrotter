import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, Calendar, MapPin, DollarSign, Sparkles, 
  Copy, Check, Share2, ArrowRight, User as UserIcon, 
  CheckCircle2, Clock, ShieldCheck
} from 'lucide-react';
import { tripService } from '../services/tripService';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { SharedTripResponse } from '../types';

interface SharedItineraryPageProps {
  shareToken: string;
  onSelectTab: (tab: string) => void;
}

export const SharedItineraryPage: React.FC<SharedItineraryPageProps> = ({ 
  shareToken, onSelectTab 
}) => {
  const { user } = useAuth();
  const { copyTrip } = useTrip();
  const [data, setData] = useState<SharedTripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [clonedSuccess, setClonedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setLoading(true);
    tripService.getSharedTrip(shareToken)
      .then(res => setData(res))
      .catch(err => console.error('Failed to load shared trip', err))
      .finally(() => setLoading(false));
  }, [shareToken]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCloneTrip = async () => {
    if (!user) {
      onSelectTab('login');
      return;
    }
    setCloning(true);
    try {
      await copyTrip(shareToken);
      setClonedSuccess(true);
      setTimeout(() => {
        onSelectTab('my-trips');
      }, 1500);
    } catch (e) {
      console.error('Failed to clone trip', e);
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        Loading shared traveler itinerary...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-16 text-center rounded-3xl bg-white border border-slate-200 space-y-4 max-w-lg mx-auto my-12">
        <Globe className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 font-['Outfit']">Shared Itinerary Not Found</h3>
        <p className="text-xs text-slate-500">This travel link may be expired, private, or the token is invalid.</p>
        <button
          onClick={() => onSelectTab('dashboard')}
          className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { trip, owner, itinerary } = data;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Top Read-Only Banner */}
      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>You are viewing a <strong>public read-only itinerary</strong> shared by <strong>{owner.name}</strong>.</span>
        </div>
        
        <button
          onClick={handleCopyLink}
          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center space-x-1"
        >
          {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              Shared Journey
            </span>
            <span className="text-xs text-slate-300">
              Curated by <strong className="text-white">{owner.name}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight">
            {trip.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {trip.description || 'A complete multi-city itinerary with scheduled activities and budget estimations.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{trip.startDate} to {trip.endDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{trip.destinationCount || trip.stops?.length || 0} City Destinations</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5 font-bold text-emerald-300">
              <DollarSign className="w-4 h-4" />
              <span>${(trip.estimatedTotalCost || 0).toLocaleString()} Total Estimate</span>
            </span>
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
                  <span>Trip Successfully Cloned! Redirecting...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Trip to My Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Structured Day-by-Day Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
          Day-by-Day Schedule
        </h2>

        <div className="space-y-3">
          {itinerary.days.map((d) => (
            <div
              key={d.dayIndex}
              className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    D{d.dayIndex}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{d.city || 'Transit Day'}</h3>
                    <p className="text-[11px] text-slate-400">{d.date}</p>
                  </div>
                </div>

                <span className="text-xs font-black text-emerald-700">
                  ${d.dayCost.toFixed(2)}
                </span>
              </div>

              {d.activities.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No scheduled activities for this date.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {d.activities.map((act) => (
                    <div key={act.tripActivityId} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                      {act.imageUrl && (
                        <img src={act.imageUrl} alt={act.name} className="w-12 h-12 rounded-xl object-cover" />
                      )}
                      <div className="space-y-0.5 flex-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                          {act.type}
                        </span>
                        <p className="text-xs font-bold text-slate-900">{act.name}</p>
                        <p className="text-[10px] text-slate-500">{act.time} • ${act.cost.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, MapPin, Clock, DollarSign, Sparkles, 
  Share2, Edit3, Eye, AlertTriangle, CheckCircle2, 
  ChevronDown, ChevronUp, Layers, List, Bookmark
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { ItineraryViewResponse, DayItinerary } from '../types';

interface ItineraryViewPageProps {
  onSelectTab: (tab: string) => void;
  onOpenShareModal: (tripId: number, tripName: string) => void;
}

export const ItineraryViewPage: React.FC<ItineraryViewPageProps> = ({ 
  onSelectTab, onOpenShareModal 
}) => {
  const { activeTrip, getItinerary } = useTrip();
  const [itinerary, setItinerary] = useState<ItineraryViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'CARDS' | 'COMPACT'>('CARDS');

  useEffect(() => {
    if (activeTrip) {
      setLoading(true);
      getItinerary(activeTrip.id)
        .then(res => {
          setItinerary(res);
          // Expand all by default
          const exp: Record<number, boolean> = {};
          res.days.forEach(d => { exp[d.dayIndex] = true; });
          setExpandedDays(exp);
        })
        .catch(err => console.error('Failed to load itinerary', err))
        .finally(() => setLoading(false));
    }
  }, [activeTrip, getItinerary]);

  if (!activeTrip) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 font-['Outfit']">No Trip Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select an itinerary to inspect its structured day-wise timeline.
        </p>
        <button
          onClick={() => onSelectTab('my-trips')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
        >
          Go to My Trips
        </button>
      </div>
    );
  }

  const toggleDay = (dayIndex: number) => {
    setExpandedDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
  };

  const totalActivitiesCount = itinerary?.days.reduce((acc, d) => acc + d.activities.length, 0) || 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <img
          src={activeTrip.coverPhoto || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={activeTrip.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Day-Wise Travel Flow</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight">
              {activeTrip.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeTrip.startDate} — {activeTrip.endDate}</span>
              </span>
              <span>•</span>
              <span className="font-bold text-white">{itinerary?.totalDays || 0} Total Days</span>
              <span>•</span>
              <span className="font-bold text-emerald-400">{totalActivitiesCount} Experiences Scheduled</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-white/10 p-1 backdrop-blur-md">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'CARDS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode('COMPACT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'COMPACT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                Compact Flow
              </button>
            </div>

            <button
              onClick={() => onSelectTab('itinerary-builder')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Stops</span>
            </button>

            <button
              onClick={() => onOpenShareModal(activeTrip.id, activeTrip.name)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition"
              title="Share Itinerary"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center text-xs text-slate-500">
          Generating structured day-by-day timeline...
        </div>
      )}

      {/* Days Timeline Accordion */}
      {!loading && itinerary && (
        <div className="space-y-4">
          {itinerary.days.map((day) => {
            const isExpanded = expandedDays[day.dayIndex] ?? true;
            return (
              <div
                key={day.date}
                className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Day Header Bar */}
                <div
                  onClick={() => toggleDay(day.dayIndex)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-slate-50/80 to-white hover:bg-slate-100/50 transition border-b border-slate-100"
                >
                  <div className="flex items-center space-x-4">
                    {/* Day Pill */}
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-['Outfit'] shadow-md shadow-emerald-600/20 flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">DAY</span>
                      <span className="text-base font-black leading-none">{day.dayIndex}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                          {day.city || 'Travel Day'}
                        </h3>
                        {day.isOverbudget && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>High Daily Spend</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{day.date}</span>
                        <span>•</span>
                        <span>{day.activities.length} activity(ies)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Day Total</span>
                      <p className="text-sm font-extrabold text-emerald-700">
                        ${day.dayCost.toFixed(2)}
                      </p>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Day Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-5"
                    >
                      {day.activities.length === 0 ? (
                        <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
                          <p>No scheduled activities for this date. Free exploration or transit day.</p>
                          <button
                            onClick={() => onSelectTab('itinerary-builder')}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                          >
                            + Assign Activity in Builder
                          </button>
                        </div>
                      ) : (
                        <div className={viewMode === 'CARDS' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-2.5'}>
                          {day.activities.map((act, aIdx) => (
                            <div
                              key={act.tripActivityId}
                              className={`rounded-2xl border transition ${
                                viewMode === 'CARDS' 
                                  ? 'bg-slate-50/80 border-slate-200/80 p-3.5 flex items-start space-x-3 hover:border-slate-300' 
                                  : 'bg-slate-50 p-2.5 flex items-center justify-between border-slate-200'
                              }`}
                            >
                              {viewMode === 'CARDS' && act.imageUrl && (
                                <img
                                  src={act.imageUrl}
                                  alt={act.name}
                                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm"
                                />
                              )}

                              <div className="flex-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                                    {act.type}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900">
                                    {act.name}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-500 flex items-center space-x-3">
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{act.time} ({act.durationMin} mins)</span>
                                  </span>
                                </p>

                                {act.notes && (
                                  <p className="text-[11px] text-slate-600 bg-white/60 p-1.5 rounded-lg border border-slate-200/50">
                                    {act.notes}
                                  </p>
                                )}
                              </div>

                              <div className="text-right pl-2">
                                <span className="text-xs font-black text-emerald-700 block">
                                  ${act.cost.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

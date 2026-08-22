import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, DollarSign, 
  Sparkles, CheckCircle2, ChevronLeft, ChevronRight, 
  Layers, ArrowRight, Share2, Edit3
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { ItineraryViewResponse, DayItinerary } from '../types';

interface TimelinePageProps {
  onSelectTab: (tab: string) => void;
  onOpenShareModal: (tripId: number, tripName: string) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ 
  onSelectTab, onOpenShareModal 
}) => {
  const { activeTrip, getItinerary } = useTrip();
  const [itinerary, setItinerary] = useState<ItineraryViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);
  const [viewFormat, setViewFormat] = useState<'TIMELINE' | 'CALENDAR'>('TIMELINE');

  useEffect(() => {
    if (activeTrip) {
      setLoading(true);
      getItinerary(activeTrip.id)
        .then(res => {
          setItinerary(res);
          if (res.days.length > 0) setSelectedDayIndex(res.days[0].dayIndex);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTrip, getItinerary]);

  if (!activeTrip) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
        <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 font-['Outfit']">No Active Trip Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select a journey to inspect its interactive visual timeline.
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

  const selectedDay = itinerary?.days.find(d => d.dayIndex === selectedDayIndex) || itinerary?.days[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <span>Visual Chronology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Trip Timeline & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive schedule for <span className="font-bold text-slate-800">{activeTrip.name}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Format Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setViewFormat('TIMELINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewFormat === 'TIMELINE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Timeline Flow
            </button>
            <button
              onClick={() => setViewFormat('CALENDAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewFormat === 'CALENDAR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Calendar Matrix
            </button>
          </div>

          <button
            onClick={() => onOpenShareModal(activeTrip.id, activeTrip.name)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Share Itinerary"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-xs text-slate-500">
          Calculating timeline milestones...
        </div>
      )}

      {/* TIMELINE FLOW VIEW */}
      {!loading && itinerary && viewFormat === 'TIMELINE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Days Stepper (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Itinerary Schedule</span>
              <span className="text-xs text-emerald-700 font-bold">{itinerary.totalDays} Days</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {itinerary.days.map((d) => {
                const isSelected = d.dayIndex === selectedDayIndex;
                return (
                  <button
                    key={d.dayIndex}
                    onClick={() => setSelectedDayIndex(d.dayIndex)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm' 
                        : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {d.dayIndex}
                      </div>
                      <div className="truncate pr-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{d.city || 'Transit Day'}</p>
                        <p className="text-[10px] text-slate-500">{d.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-extrabold text-slate-800 block">${d.dayCost.toFixed(0)}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{d.activities.length} acts</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detailed Day Milestones (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6">
            {selectedDay ? (
              <>
                {/* Header of selected day */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-500/20">
                      <span className="text-[9px] font-bold uppercase text-emerald-200">DAY</span>
                      <span className="text-base font-black leading-none">{selectedDay.dayIndex}</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                        {selectedDay.city || 'Travel Day'}
                      </h2>
                      <p className="text-xs text-slate-500">{selectedDay.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Day Cost</span>
                    <p className="text-xl font-black font-['Outfit'] text-emerald-700">
                      ${selectedDay.dayCost.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Vertical Timeline Nodes */}
                {selectedDay.activities.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 space-y-3">
                    <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700">No scheduled activities for Day {selectedDay.dayIndex}</p>
                    <p>Use Itinerary Builder or Activities catalog to schedule tours, museum visits, or dinners.</p>
                    <button
                      onClick={() => onSelectTab('itinerary-builder')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                    >
                      Schedule Activity
                    </button>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                    {selectedDay.activities.map((act, idx) => (
                      <motion.div
                        key={act.tripActivityId}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative"
                      >
                        {/* Node circle */}
                        <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-emerald-600/30">
                          {idx + 1}
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                                  {act.type}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900">{act.name}</h4>
                              </div>
                              <p className="text-[11px] text-slate-500 flex items-center space-x-3 mt-1">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{act.time} ({act.durationMin}m)</span>
                                </span>
                              </p>
                            </div>

                            <span className="text-xs font-black text-emerald-700">
                              ${act.cost.toFixed(2)}
                            </span>
                          </div>

                          {act.notes && (
                            <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/60">
                              Note: {act.notes}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>

        </div>
      )}

      {/* CALENDAR MATRIX VIEW */}
      {!loading && itinerary && viewFormat === 'CALENDAR' && (
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-['Outfit']">
              Trip Duration Matrix ({activeTrip.startDate} to {activeTrip.endDate})
            </h2>
            <span className="text-xs text-slate-500 font-semibold">{itinerary.days.length} Total Trip Days</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {itinerary.days.map((day) => (
              <div
                key={day.dayIndex}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      DAY {day.dayIndex}
                    </span>
                    <span className="text-[10px] text-slate-400">{day.date.split('-').slice(1).join('/')}</span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 mt-2 truncate">
                    {day.city || 'Transit'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-right">
                  <span className="text-[10px] text-slate-400 block">{day.activities.length} activity(ies)</span>
                  <span className="text-xs font-black text-slate-900">${day.dayCost.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

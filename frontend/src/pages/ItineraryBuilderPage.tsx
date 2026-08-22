import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Calendar, Clock, DollarSign, Plus, 
  Trash2, ArrowUp, ArrowDown, Sparkles, ChevronRight, 
  AlertCircle, CheckCircle2, Search, Eye, Share2, Info
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { cityService } from '../services/cityService';
import { City, Activity, TripStop } from '../types';

interface ItineraryBuilderPageProps {
  onSelectTab: (tab: string) => void;
  onOpenShareModal: (tripId: number, tripName: string) => void;
}

export const ItineraryBuilderPage: React.FC<ItineraryBuilderPageProps> = ({ 
  onSelectTab, onOpenShareModal 
}) => {
  const { 
    activeTrip, addStop, deleteStop, reorderStops, 
    assignActivity, deleteTripActivity 
  } = useTrip();

  const [cities, setCities] = useState<City[]>([]);
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number>(1);
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');
  const [stopNotes, setStopNotes] = useState('');

  // Activity Assignment Modal State
  const [assigningStop, setAssigningStop] = useState<TripStop | null>(null);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('10:00:00');
  const [activityCost, setActivityCost] = useState<number>(0);
  const [activityNotes, setActivityNotes] = useState('');

  useEffect(() => {
    cityService.getCities().then(res => {
      setCities(res);
      if (res.length > 0) setSelectedCityId(res[0].id);
    });
  }, []);

  useEffect(() => {
    if (activeTrip) {
      setStopStartDate(activeTrip.startDate);
      setStopEndDate(activeTrip.endDate);
    }
  }, [activeTrip]);

  // Load activities when assigning stop changes
  useEffect(() => {
    if (assigningStop) {
      cityService.getActivitiesForCity(assigningStop.cityId).then(acts => {
        setAvailableActivities(acts);
        if (acts.length > 0) {
          setSelectedActivityId(acts[0].id);
          setActivityCost(acts[0].estimatedCost);
        }
      });
      setActivityDate(assigningStop.startDate);
    }
  }, [assigningStop]);

  if (!activeTrip) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 font-['Outfit']">No Active Trip Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select a journey from "My Trips" or dashboard to construct its multi-city itinerary.
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

  const handleAddStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) return;

    await addStop(activeTrip.id, {
      cityId: Number(selectedCityId),
      startDate: stopStartDate || activeTrip.startDate,
      endDate: stopEndDate || activeTrip.endDate,
      notes: stopNotes.trim(),
    });

    setIsAddStopModalOpen(false);
    setStopNotes('');
  };

  const handleMoveStop = async (index: number, direction: 'UP' | 'DOWN') => {
    if (!activeTrip.stops) return;
    const currentStops = [...activeTrip.stops];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentStops.length) return;

    const temp = currentStops[index];
    currentStops[index] = currentStops[targetIndex];
    currentStops[targetIndex] = temp;

    const orderedIds = currentStops.map(s => s.id);
    await reorderStops(activeTrip.id, orderedIds);
  };

  const handleAssignActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningStop || !selectedActivityId) return;

    await assignActivity(activeTrip.id, assigningStop.id, {
      activityId: selectedActivityId,
      activityDate: activityDate || assigningStop.startDate,
      startTime: activityTime,
      estimatedCost: Number(activityCost),
      notes: activityNotes.trim(),
    });

    setAssigningStop(null);
    setActivityNotes('');
  };

  const stops = activeTrip.stops || [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Itinerary Builder</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            {activeTrip.name}
          </h1>
          <p className="text-xs text-slate-500 flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{activeTrip.startDate} to {activeTrip.endDate}</span>
            <span>•</span>
            <span>{stops.length} City Stops</span>
            <span>•</span>
            <span className="font-bold text-emerald-700">${(activeTrip.estimatedTotalCost || 0).toLocaleString()} Total</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddStopModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add City Stop</span>
          </button>

          <button
            onClick={() => onSelectTab('itinerary-view')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Day-Wise</span>
          </button>

          <button
            onClick={() => onOpenShareModal(activeTrip.id, activeTrip.name)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Share Itinerary"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stops Sequential Flow */}
      {stops.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 font-['Outfit']">No City Stops Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Build your travel route by appending your first city stop. You can assign arrival and departure dates and schedule experiences.
          </p>
          <button
            onClick={() => setIsAddStopModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md transition flex items-center space-x-1.5 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Stop (e.g. Paris, Tokyo)</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {stops.map((stop, index) => {
            const isFirst = index === 0;
            const isLast = index === stops.length - 1;
            const city = stop.city;
            const activities = stop.activities || [];

            return (
              <motion.div
                key={stop.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Stop Header Banner */}
                <div className="relative h-28 bg-slate-900 overflow-hidden flex items-end p-4 text-white">
                  <img
                    src={city?.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80'}
                    alt={city?.name || 'City'}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Stop Number Badge & Actions */}
                  <div className="relative z-10 w-full flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center shadow-md">
                        {stop.stopOrder || index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold font-['Outfit']">
                          {city?.name}, <span className="text-emerald-300 font-normal text-sm">{city?.country}</span>
                        </h3>
                        <p className="text-[11px] text-slate-300 flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{stop.startDate} to {stop.endDate}</span>
                          {stop.notes && <span>• {stop.notes}</span>}
                        </p>
                      </div>
                    </div>

                    {/* Move Up/Down & Delete */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveStop(index, 'UP')}
                        disabled={isFirst}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition ${
                          isFirst ? 'opacity-30 cursor-not-allowed bg-white/10' : 'bg-black/40 hover:bg-black/60 text-white'
                        }`}
                        title="Move Stop Earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveStop(index, 'DOWN')}
                        disabled={isLast}
                        className={`p-1.5 rounded-lg backdrop-blur-md transition ${
                          isLast ? 'opacity-30 cursor-not-allowed bg-white/10' : 'bg-black/40 hover:bg-black/60 text-white'
                        }`}
                        title="Move Stop Later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteStop(activeTrip.id, stop.id)}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-600 text-white backdrop-blur-md transition ml-1"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stop Body & Activities */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Scheduled Experiences ({activities.length})</span>
                    </span>

                    <button
                      onClick={() => setAssigningStop(stop)}
                      className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Assign Activity</span>
                    </button>
                  </div>

                  {activities.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-500">
                      No activities scheduled for {city?.name} yet. Click <span className="font-semibold text-emerald-700">"Assign Activity"</span> to add sightseeing, food tours, or cultural visits.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activities.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between space-x-3 hover:border-slate-300 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                {act.activity?.type || 'SIGHTSEEING'}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                {act.activity?.name || 'Experience'}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 flex items-center space-x-3">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{act.activityDate}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{act.startTime || '10:00:00'} ({act.activity?.durationMin || 90}m)</span>
                              </span>
                            </p>

                            {act.notes && (
                              <p className="text-[11px] text-slate-600 italic">
                                Note: {act.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end justify-between self-stretch">
                            <span className="text-xs font-black text-emerald-700">
                              ${Number(act.estimatedCost || 0).toFixed(2)}
                            </span>
                            <button
                              onClick={() => deleteTripActivity(activeTrip.id, act.id)}
                              className="text-slate-400 hover:text-rose-600 transition p-1"
                              title="Delete scheduled activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal: Add City Stop */}
      <AnimatePresence>
        {isAddStopModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddStopModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Add City Destination Stop</h3>
                <button onClick={() => setIsAddStopModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleAddStopSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Destination City</label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  >
                    {cities.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}, {c.country} ({c.region}) — Cost Index: {c.costIndex}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Arrival Date</label>
                    <input
                      type="date"
                      value={stopStartDate}
                      onChange={(e) => setStopStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Departure Date</label>
                    <input
                      type="date"
                      value={stopEndDate}
                      onChange={(e) => setStopEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stop Notes / Accommodation</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Hotel in central historic district. Book museum passes."
                    value={stopNotes}
                    onChange={(e) => setStopNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddStopModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    Confirm Stop
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Assign Activity */}
      <AnimatePresence>
        {assigningStop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssigningStop(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Schedule Activity in {assigningStop.city?.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{assigningStop.startDate} to {assigningStop.endDate}</p>
                </div>
                <button onClick={() => setAssigningStop(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleAssignActivitySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Activity</label>
                  <select
                    value={selectedActivityId || ''}
                    onChange={(e) => {
                      const actId = Number(e.target.value);
                      setSelectedActivityId(actId);
                      const act = availableActivities.find(a => a.id === actId);
                      if (act) setActivityCost(act.estimatedCost);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  >
                    {availableActivities.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} (${a.estimatedCost} • {a.durationMin}m • {a.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={activityDate}
                      onChange={(e) => setActivityDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={activityTime}
                      onChange={(e) => setActivityTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Cost ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={activityCost}
                    onChange={(e) => setActivityCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Notes / Booking Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. Online tickets booked. Meet guide by north portal."
                    value={activityNotes}
                    onChange={(e) => setActivityNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssigningStop(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    Assign to Stop
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

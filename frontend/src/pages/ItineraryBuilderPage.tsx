import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Calendar, Clock, DollarSign, Plus, 
  Trash2, ArrowUp, ArrowDown, Sparkles, ChevronRight, 
  AlertCircle, CheckCircle2, Search, Eye, Share2, Info, Edit3
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { cityService } from '../services/cityService';
import { activityService } from '../services/activityService';
import { City, Activity, TripStop, TripActivity } from '../types';

interface ItineraryBuilderPageProps {
  onSelectTab: (tab: string) => void;
  onOpenShareModal: (tripId: number, tripName: string) => void;
}

export const ItineraryBuilderPage: React.FC<ItineraryBuilderPageProps> = ({ 
  onSelectTab, onOpenShareModal 
}) => {
  const { 
    activeTrip, addStop, updateStop, deleteStop, reorderStops, 
    assignActivity, updateTripActivity, reorderTripActivities, deleteTripActivity 
  } = useTrip();

  const [cities, setCities] = useState<City[]>([]);
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number>(1);
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');
  const [stopNotes, setStopNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Edit Stop Modal State
  const [editingStop, setEditingStop] = useState<TripStop | null>(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Activity Assignment Modal State
  const [assigningStop, setAssigningStop] = useState<TripStop | null>(null);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('10:00');
  const [activityCost, setActivityCost] = useState<number>(0);
  const [activityNotes, setActivityNotes] = useState('');
  const [actAssignError, setActAssignError] = useState<string | null>(null);

  // Edit Scheduled Activity State
  const [editingTripActivity, setEditingTripActivity] = useState<{ stop: TripStop; act: TripActivity } | null>(null);
  const [editActDate, setEditActDate] = useState('');
  const [editActTime, setEditActTime] = useState('10:00');
  const [editActCost, setEditActCost] = useState<number>(0);
  const [editActNotes, setEditActNotes] = useState('');
  const [editActError, setEditActError] = useState<string | null>(null);

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

  useEffect(() => {
    if (assigningStop) {
      setActAssignError(null);
      const cityId = assigningStop.cityId || (assigningStop.city ? assigningStop.city.id : 0);
      if (cityId) {
        cityService.getActivitiesForCity(cityId).then(acts => {
          setAvailableActivities(acts);
          if (acts.length > 0) {
            setSelectedActivityId(acts[0].id);
            setActivityCost(acts[0].estimatedCost);
          }
        });
      }
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
    setError(null);

    if (!selectedCityId) {
      setError('Please select a destination city.');
      return;
    }
    if (new Date(stopEndDate) < new Date(stopStartDate)) {
      setError('Departure date cannot be earlier than arrival date.');
      return;
    }

    try {
      await addStop(activeTrip.id, {
        cityId: Number(selectedCityId),
        startDate: stopStartDate || activeTrip.startDate,
        endDate: stopEndDate || activeTrip.endDate,
        notes: stopNotes.trim(),
      });

      setIsAddStopModalOpen(false);
      setStopNotes('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add city stop.');
    }
  };

  const handleEditStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStop) return;
    setEditError(null);

    if (new Date(editEndDate) < new Date(editStartDate)) {
      setEditError('Departure date cannot be earlier than arrival date.');
      return;
    }

    try {
      await updateStop(activeTrip.id, editingStop.id, {
        startDate: editStartDate,
        endDate: editEndDate,
        notes: editNotes.trim(),
      });
      setEditingStop(null);
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update stop dates or notes.');
    }
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
    setActAssignError(null);

    if (new Date(activityDate) < new Date(assigningStop.startDate) || new Date(activityDate) > new Date(assigningStop.endDate)) {
      setActAssignError(`Scheduled date must fall within stop dates (${assigningStop.startDate} to ${assigningStop.endDate}).`);
      return;
    }

    try {
      await assignActivity(activeTrip.id, assigningStop.id, {
        activityId: selectedActivityId,
        scheduledDate: activityDate || assigningStop.startDate,
        startTime: activityTime ? `${activityTime}:00` : '10:00:00',
        customCost: Number(activityCost),
        notes: activityNotes.trim(),
      });

      setAssigningStop(null);
      setActivityNotes('');
    } catch (err: any) {
      setActAssignError(err?.message || 'Failed to schedule activity.');
    }
  };

  const handleEditActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTripActivity) return;
    setEditActError(null);

    const { stop, act } = editingTripActivity;
    if (new Date(editActDate) < new Date(stop.startDate) || new Date(editActDate) > new Date(stop.endDate)) {
      setEditActError(`Scheduled date must fall within stop dates (${stop.startDate} to ${stop.endDate}).`);
      return;
    }

    try {
      await updateTripActivity(activeTrip.id, stop.id, act.id, {
        scheduledDate: editActDate,
        startTime: editActTime ? (editActTime.length === 5 ? `${editActTime}:00` : editActTime) : '10:00:00',
        customCost: Number(editActCost),
        notes: editActNotes.trim(),
      });

      setEditingTripActivity(null);
    } catch (err: any) {
      setEditActError(err?.message || 'Failed to update activity.');
    }
  };

  const handleMoveActivity = async (stop: TripStop, actIndex: number, direction: 'UP' | 'DOWN') => {
    const acts = [...(stop.activities || [])];
    const targetIdx = direction === 'UP' ? actIndex - 1 : actIndex + 1;
    if (targetIdx < 0 || targetIdx >= acts.length) return;

    const temp = acts[actIndex];
    acts[actIndex] = acts[targetIdx];
    acts[targetIdx] = temp;

    const orderedIds = acts.map(a => a.id);
    await reorderTripActivities(activeTrip.id, stop.id, orderedIds);
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
            <span className="font-bold text-emerald-700">${(activeTrip.budget || activeTrip.budgetThreshold || 0).toLocaleString()} Budget</span>
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

                    {/* Move Up/Down, Edit & Delete */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingStop(stop);
                          setEditStartDate(stop.startDate);
                          setEditEndDate(stop.endDate);
                          setEditNotes(stop.notes || '');
                        }}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
                        title="Edit Stop Dates & Notes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

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

                {/* Stop Body */}
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
                      No activities planned yet. Click <span className="font-semibold text-emerald-700">"Assign Activity"</span> to schedule experiences.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activities.map((act, actIdx) => (
                        <div
                          key={act.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between space-x-3 hover:border-slate-300 transition"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                                {act.activity?.category || act.activity?.type || 'SIGHTSEEING'}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                {act.activity?.name || 'Experience'}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 flex items-center space-x-3">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{act.scheduledDate || act.activityDate}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{act.startTime || '10:00:00'} ({act.activity?.estimatedDurationMinutes || act.activity?.durationMin || 60}m)</span>
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
                              ${Number(act.customCost ?? act.activity?.estimatedCost ?? 0).toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-1 mt-2">
                              <button
                                onClick={() => handleMoveActivity(stop, actIdx, 'UP')}
                                disabled={actIdx === 0}
                                className={`p-1 rounded text-slate-400 hover:text-slate-700 ${actIdx === 0 ? 'opacity-30' : ''}`}
                                title="Move Activity Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveActivity(stop, actIdx, 'DOWN')}
                                disabled={actIdx === activities.length - 1}
                                className={`p-1 rounded text-slate-400 hover:text-slate-700 ${actIdx === activities.length - 1 ? 'opacity-30' : ''}`}
                                title="Move Activity Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTripActivity({ stop, act });
                                  setEditActDate(act.scheduledDate || act.activityDate || stop.startDate);
                                  setEditActTime(act.startTime ? act.startTime.slice(0, 5) : '10:00');
                                  setEditActCost(act.customCost ?? act.activity?.estimatedCost ?? 0);
                                  setEditActNotes(act.notes || '');
                                  setEditActError(null);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 transition"
                                title="Edit Scheduled Activity"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteTripActivity(activeTrip.id, act.id)}
                                className="text-slate-400 hover:text-rose-600 transition p-1 ml-0.5"
                                title="Delete scheduled activity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
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

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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

      {/* Modal: Edit City Stop */}
      <AnimatePresence>
        {editingStop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStop(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Edit Stop Details ({editingStop.city?.name})</h3>
                <button onClick={() => setEditingStop(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleEditStopSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Arrival Date</label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Departure Date</label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                    placeholder="Notes or hotel details..."
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingStop(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    Save Changes
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

              {actAssignError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{actAssignError}</span>
                </div>
              )}

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
                        {a.name} (${a.estimatedCost} • {a.estimatedDurationMinutes || a.durationMin}m • {a.category || a.type})
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
                  <label className="block font-bold text-slate-700 mb-1">Custom Cost Override ($ USD)</label>
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

      {/* Modal: Edit Scheduled Activity */}
      <AnimatePresence>
        {editingTripActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTripActivity(null)}
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
                    Edit Experience ({editingTripActivity.act.activity?.name || 'Activity'})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Stop: {editingTripActivity.stop.city?.name} ({editingTripActivity.stop.startDate} to {editingTripActivity.stop.endDate})
                  </p>
                </div>
                <button onClick={() => setEditingTripActivity(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              {editActError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editActError}</span>
                </div>
              )}

              <form onSubmit={handleEditActivitySubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={editActDate}
                      onChange={(e) => setEditActDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={editActTime}
                      onChange={(e) => setEditActTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Cost Override ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editActCost}
                    onChange={(e) => setEditActCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custom Notes / Booking Details</label>
                  <input
                    type="text"
                    value={editActNotes}
                    onChange={(e) => setEditActNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    placeholder="Notes..."
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTripActivity(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    Save Changes
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

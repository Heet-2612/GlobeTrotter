import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Sparkles, Clock, DollarSign, MapPin, 
  Plus, Filter, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cityService } from '../services/cityService';
import { useTrip } from '../context/TripContext';
import { Activity, City } from '../types';

interface ActivitySearchPageProps {
  onSelectTab: (tab: string) => void;
  preselectedCityId?: number | null;
}

const CATEGORIES = ['ALL', 'SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURE', 'RELAXATION'];

export const ActivitySearchPage: React.FC<ActivitySearchPageProps> = ({ 
  onSelectTab, preselectedCityId = null 
}) => {
  const { activeTrip, assignActivity } = useTrip();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string>(preselectedCityId ? String(preselectedCityId) : 'ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [maxCost, setMaxCost] = useState<number>(150);
  const [loading, setLoading] = useState(true);

  // Quick Assign Modal State
  const [assigningActivity, setAssigningActivity] = useState<Activity | null>(null);
  const [targetStopId, setTargetStopId] = useState<number | null>(null);
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('10:00');
  const [activityNotes, setActivityNotes] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    cityService.getCities().then(res => setCities(res));
  }, []);

  useEffect(() => {
    if (preselectedCityId) {
      setSelectedCityId(String(preselectedCityId));
    }
  }, [preselectedCityId]);

  useEffect(() => {
    setLoading(true);
    cityService.getActivities({
      query: searchQuery,
      cityId: selectedCityId !== 'ALL' ? Number(selectedCityId) : undefined,
      category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
      maxCost: Number(maxCost),
    }).then(res => setActivities(res))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCityId, selectedCategory, maxCost]);

  const handleOpenAssign = (act: Activity) => {
    setAssigningActivity(act);
    if (activeTrip?.stops && activeTrip.stops.length > 0) {
      // Look for stop with same cityId, else fallback to first stop
      const matchStop = activeTrip.stops.find(s => s.cityId === act.cityId) || activeTrip.stops[0];
      setTargetStopId(matchStop.id);
      setActivityDate(matchStop.startDate);
    }
  };

  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !assigningActivity || !targetStopId) return;

    await assignActivity(activeTrip.id, targetStopId, {
      activityId: assigningActivity.id,
      activityDate: activityDate || activeTrip.startDate,
      startTime: activityTime ? `${activityTime}:00` : '10:00:00',
      estimatedCost: assigningActivity.estimatedCost,
      notes: activityNotes.trim(),
    });

    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setAssigningActivity(null);
      setActivityNotes('');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <span>Experiences & Tours</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Curated Global Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Discover sightseeing landmarks, culinary tastings, adventure tracks, and cultural expeditions.
          </p>
        </div>

        {activeTrip && (
          <button
            onClick={() => onSelectTab('itinerary-view')}
            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition self-start md:self-auto"
          >
            Active Trip: {activeTrip.name}
          </button>
        )}
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiences (e.g. Louvre, Ramen, Gondola)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* City Selector */}
          <div className="sm:col-span-4">
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            >
              <option value="ALL">All Destination Cities</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          {/* Max Cost Filter */}
          <div className="sm:col-span-3 flex items-center space-x-2 px-2">
            <span className="text-[11px] text-slate-500 whitespace-nowrap font-medium">Max Cost:</span>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <span className="text-xs font-bold text-slate-800 w-12 text-right">
              ${maxCost}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Results Grid */}
      {activities.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 font-['Outfit']">No Activities Found</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or increasing the price ceiling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activities.map((act) => {
            const city = cities.find(c => c.id === act.cityId);
            return (
              <motion.div
                key={act.id}
                layout
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img
                    src={act.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
                    alt={act.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    {act.type}
                  </span>

                  {/* City Pill */}
                  {city && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-medium flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{city.name}</span>
                    </span>
                  )}

                  {/* Activity Name */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="text-sm font-bold font-['Outfit'] truncate">{act.name}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {act.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{act.durationMin} mins</span>
                    </span>

                    <span className="text-sm font-black text-emerald-700">
                      ${act.estimatedCost.toFixed(2)}
                    </span>
                  </div>

                  {/* Assign CTA */}
                  <button
                    onClick={() => handleOpenAssign(act)}
                    disabled={!activeTrip}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm ${
                      activeTrip 
                        ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white cursor-pointer' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{activeTrip ? 'Schedule to Trip' : 'Select Trip First'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal: Schedule Activity */}
      <AnimatePresence>
        {assigningActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssigningActivity(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              {assignSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Experience Scheduled!</h3>
                  <p className="text-xs text-slate-500">Added to your itinerary timeline and budget ledger.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                        Schedule: {assigningActivity.name}
                      </h3>
                      <p className="text-xs text-slate-500">${assigningActivity.estimatedCost} • {assigningActivity.durationMin} mins</p>
                    </div>
                    <button onClick={() => setAssigningActivity(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  {(!activeTrip?.stops || activeTrip.stops.length === 0) ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <p className="font-bold">No city destination stops in active trip.</p>
                      <p>Please add a city stop in Itinerary Builder before scheduling activities.</p>
                      <button
                        onClick={() => {
                          setAssigningActivity(null);
                          onSelectTab('itinerary-builder');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                      >
                        Go to Itinerary Builder
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleConfirmAssign} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Target City Stop</label>
                        <select
                          value={targetStopId || ''}
                          onChange={(e) => setTargetStopId(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                          required
                        >
                          {activeTrip.stops.map((s, idx) => (
                            <option key={s.id} value={s.id}>
                              Stop {idx + 1}: {s.city?.name} ({s.startDate} to {s.endDate})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Date</label>
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
                        <label className="block font-bold text-slate-700 mb-1">Custom Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Priority entrance pass booked"
                          value={activityNotes}
                          onChange={(e) => setActivityNotes(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200"
                        />
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setAssigningActivity(null)}
                          className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                        >
                          Confirm Schedule
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

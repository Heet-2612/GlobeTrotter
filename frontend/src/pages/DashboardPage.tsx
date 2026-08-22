import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, MapPin, Calendar, DollarSign, Sparkles, 
  ArrowRight, Compass, Bookmark, TrendingUp, AlertTriangle, 
  CheckCircle2, Share2, Eye, ExternalLink, Star, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { cityService } from '../services/cityService';
import { City, TripBudgetSummary } from '../types';

interface DashboardPageProps {
  onSelectTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  onOpenShareModal: (tripId: number, tripName: string) => void;
  onQuickAddCityToTrip: (cityId: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onSelectTab, onOpenCreateModal, onOpenShareModal, onQuickAddCityToTrip 
}) => {
  const { user, savedDestinations, toggleSaveDestination } = useAuth();
  const { trips, activeTrip, setActiveTripId, getBudget } = useTrip();
  
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [activeBudget, setActiveBudget] = useState<TripBudgetSummary | null>(null);
  const [loadingBudget, setLoadingBudget] = useState(false);

  useEffect(() => {
    cityService.getCities({ region: 'ALL' }).then(cities => {
      setPopularCities(cities.slice(0, 6));
    });
  }, []);

  useEffect(() => {
    if (activeTrip) {
      setLoadingBudget(true);
      getBudget(activeTrip.id)
        .then(b => setActiveBudget(b))
        .catch(err => console.error(err))
        .finally(() => setLoadingBudget(false));
    } else {
      setActiveBudget(null);
    }
  }, [activeTrip, getBudget]);

  const totalDestinationsCount = trips.reduce((acc, t) => acc + (t.destinationCount || t.stops?.length || 0), 0);
  const totalSpendEstimate = trips.reduce((acc, t) => acc + (t.estimatedTotalCost || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Hero Banner with Welcome & Quick Action */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to GlobeTrotter</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Outfit']">
            Where to next, {user?.name?.split(' ')[0] || 'Traveler'}?
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            You have <span className="text-emerald-400 font-bold">{trips.length} active journeys</span> planned across <span className="text-emerald-400 font-bold">{totalDestinationsCount} destinations</span>. Manage your day-wise schedule, monitor daily expenses, or explore new cities.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </button>

            <button
              onClick={() => onSelectTab('city-search')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore Destinations</span>
            </button>

            {activeTrip && (
              <button
                onClick={() => onSelectTab('itinerary-builder')}
                className="px-5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 active:scale-95 text-emerald-300 text-xs font-bold border border-emerald-500/40 backdrop-blur-md transition flex items-center space-x-2"
              >
                <span>Edit Active: {activeTrip.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Trips</p>
            <p className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white">{trips.length}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Planned Stops</p>
            <p className="text-xl sm:text-2xl font-bold font-['Outfit'] text-emerald-400">{totalDestinationsCount}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Forecasted Total</p>
            <p className="text-xl sm:text-2xl font-bold font-['Outfit'] text-cyan-300">${totalSpendEstimate.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Saved Cities</p>
            <p className="text-xl sm:text-2xl font-bold font-['Outfit'] text-amber-300">{savedDestinations.length}</p>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Recent Trips + Active Budget Highlight Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Trips (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>My Active Journeys</span>
              </h2>
              <p className="text-xs text-slate-500">Pick an itinerary to view, edit stops, or schedule activities</p>
            </div>
            <button
              onClick={() => onSelectTab('my-trips')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>View All ({trips.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {trips.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-3">
              <Compass className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No journeys planned yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Create your first multi-city trip to start assigning city stops, activities, and budget goals.</p>
              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition"
              >
                Plan First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trips.slice(0, 4).map((trip) => {
                const isActive = activeTrip?.id === trip.id;
                return (
                  <motion.div
                    key={trip.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-2xl bg-white border overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                      isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
                    }`}
                  >
                    {/* Card Cover */}
                    <div className="relative h-36 bg-slate-800 overflow-hidden group">
                      <img
                        src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                      
                      {/* Active Tag */}
                      {isActive && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                          Active Selection
                        </span>
                      )}

                      {/* Share Shortcut */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenShareModal(trip.id, trip.name);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition"
                        title="Share trip"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Title & Dates */}
                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <h3 className="text-sm font-bold font-['Outfit'] truncate">{trip.name}</h3>
                        <p className="text-[11px] text-slate-300 flex items-center space-x-1.5 mt-0.5">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{trip.startDate} – {trip.endDate}</span>
                        </p>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{trip.destinationCount || trip.stops?.length || 0} City Stops</span>
                        </span>

                        <span className="font-extrabold text-emerald-700">
                          ${(trip.estimatedTotalCost || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-500">est.</span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setActiveTripId(trip.id);
                            onSelectTab('itinerary-view');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Days</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTripId(trip.id);
                            onSelectTab('itinerary-builder');
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit Stops</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Budget Highlight Widget (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Budget Snapshot</span>
            </h2>
            {activeTrip && (
              <button
                onClick={() => onSelectTab('budget')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Full Analytics
              </button>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-4">
            {activeTrip && activeBudget ? (
              <>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Selected Trip</span>
                    <span className="font-bold text-slate-900 truncate max-w-[150px]">{activeTrip.name}</span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-black font-['Outfit'] text-slate-900">
                        ${activeBudget.totalEstimatedCost.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        of ${activeBudget.budgetThreshold.toLocaleString()} target limit
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeBudget.totalEstimatedCost > activeBudget.budgetThreshold
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeBudget.totalEstimatedCost > activeBudget.budgetThreshold ? 'Over Limit' : 'On Track'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        activeBudget.totalEstimatedCost > activeBudget.budgetThreshold ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (activeBudget.totalEstimatedCost / (activeBudget.budgetThreshold || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Category mini breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Transport & Transit</span>
                    </span>
                    <span className="font-bold text-slate-800">${activeBudget.categoryBreakdown.TRANSPORT}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Stay & Lodging</span>
                    </span>
                    <span className="font-bold text-slate-800">${activeBudget.categoryBreakdown.STAY}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Activities & Tours</span>
                    </span>
                    <span className="font-bold text-slate-800">${activeBudget.categoryBreakdown.ACTIVITIES}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Meals & Dining</span>
                    </span>
                    <span className="font-bold text-slate-800">${activeBudget.categoryBreakdown.MEALS}</span>
                  </div>
                </div>

                {/* Overbudget Warning if any */}
                {activeBudget.overbudgetDays.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{activeBudget.overbudgetDays.length} Day(s) Exceed Daily Average</p>
                      <p className="text-[11px] text-amber-700">Check budget tab to review high-cost days.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onSelectTab('budget')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <span>Detailed Financial Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="text-center py-6 space-y-2">
                <DollarSign className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No active trip selected</p>
                <p className="text-[11px] text-slate-400">Select or create a trip to see real-time budget forecasting.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Recommended Global Destinations Gallery */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Recommended Global Destinations</span>
            </h2>
            <p className="text-xs text-slate-500">Curated global destinations with live cost rating and popularity metrics</p>
          </div>

          <button
            onClick={() => onSelectTab('city-search')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>Explore All Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {popularCities.map((city) => {
            const isSaved = savedDestinations.some(s => s.id === city.id);
            return (
              <motion.div
                key={city.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveDestination(city.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition ${
                      isSaved ? 'bg-amber-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                  </button>

                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <p className="text-xs font-bold truncate">{city.name}</p>
                    <p className="text-[10px] text-slate-300 truncate">{city.country}</p>
                  </div>
                </div>

                <div className="p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Cost:</span>
                    <span className="font-bold text-slate-700">{'★'.repeat(Math.round(city.costIndex))} <span className="text-[10px] text-slate-400 font-normal">({city.costIndex})</span></span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Popularity:</span>
                    <span className="font-extrabold text-emerald-600">{city.popularity}/100</span>
                  </div>

                  {activeTrip ? (
                    <button
                      onClick={() => onQuickAddCityToTrip(city.id)}
                      className="w-full py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Trip</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectTab('city-search')}
                      className="w-full py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-medium transition"
                    >
                      Explore
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

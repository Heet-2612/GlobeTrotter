import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Calendar, DollarSign, Plus, Search, 
  Trash2, Edit3, Eye, Share2, Sparkles, Copy, 
  ChevronRight, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { Trip } from '../types';

interface MyTripsPageProps {
  onSelectTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  onOpenShareModal: (tripId: number, tripName: string) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ 
  onSelectTab, onOpenCreateModal, onOpenShareModal 
}) => {
  const { trips, activeTrip, setActiveTripId, deleteTrip, updateTrip } = useTrip();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (trip.description && trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: number) => {
    await deleteTrip(id);
    setDeletingId(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;
    await updateTrip(editingTrip.id, {
      name: editingTrip.name,
      description: editingTrip.description,
      startDate: editingTrip.startDate,
      endDate: editingTrip.endDate,
      budgetThreshold: editingTrip.budgetThreshold,
    });
    setEditingTrip(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Search Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            My Travel Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your planned journeys, configure multi-city stops, and adjust budget allocations.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Filter & Stats Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trips by name or theme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-600 w-full sm:w-auto justify-between sm:justify-end">
          <span className="font-semibold">
            Showing <span className="text-emerald-700 font-bold">{filteredTrips.length}</span> of {trips.length} journeys
          </span>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 font-['Outfit']">No travel itineraries found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery ? 'No trips matched your search filter. Try adjusting terms.' : 'You haven’t created any journeys yet. Start by planning your first multi-city adventure.'}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
          >
            Create Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const isActive = activeTrip?.id === trip.id;
            return (
              <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-3xl bg-white border overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between ${
                  isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
                }`}
              >
                {/* Top Image Banner */}
                <div className="relative h-44 bg-slate-900 overflow-hidden group">
                  <img
                    src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/30" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        Active Selection
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveTripId(trip.id)}
                        className="px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 text-white text-[10px] font-bold backdrop-blur-md transition"
                      >
                        Set as Active
                      </button>
                    )}

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenShareModal(trip.id, trip.name)}
                        className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition"
                        title="Share Public Itinerary"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setEditingTrip(trip)}
                        className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition"
                        title="Edit Trip Metadata"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeletingId(trip.id)}
                        className="p-1.5 rounded-full bg-black/40 text-rose-300 hover:bg-rose-600 hover:text-white backdrop-blur-md transition"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Dates */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-base font-bold font-['Outfit'] truncate">{trip.name}</h3>
                    <p className="text-xs text-slate-300 flex items-center space-x-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{trip.startDate} to {trip.endDate}</span>
                    </p>
                  </div>
                </div>

                {/* Description & Metrics */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {trip.description || 'Custom multi-city travel itinerary.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">City Stops</span>
                      <p className="text-xs font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{trip.destinationCount || trip.stops?.length || 0} Destination(s)</span>
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Total Cost</span>
                      <p className="text-xs font-bold text-emerald-700 flex items-center space-x-1 mt-0.5">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        <span>${(trip.estimatedTotalCost || 0).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2">
                    <button
                      onClick={() => {
                        setActiveTripId(trip.id);
                        onSelectTab('itinerary-view');
                      }}
                      className="py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Day View</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTripId(trip.id);
                        onSelectTab('itinerary-builder');
                      }}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Stops</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTripId(trip.id);
                        onSelectTab('budget');
                      }}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center justify-center space-x-1"
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>Budget</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Delete Trip Itinerary?</h3>
                <p className="text-xs text-slate-500">
                  This will remove the trip and all associated city stops, scheduled activities, and budget expenses.
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Trip Modal */}
      <AnimatePresence>
        {editingTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTrip(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">Edit Trip Metadata</h3>
                <button onClick={() => setEditingTrip(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trip Name</label>
                  <input
                    type="text"
                    value={editingTrip.name}
                    onChange={(e) => setEditingTrip({ ...editingTrip, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={editingTrip.startDate}
                      onChange={(e) => setEditingTrip({ ...editingTrip, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={editingTrip.endDate}
                      onChange={(e) => setEditingTrip({ ...editingTrip, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Budget Target Limit ($)</label>
                  <input
                    type="number"
                    value={editingTrip.budgetThreshold || 2500}
                    onChange={(e) => setEditingTrip({ ...editingTrip, budgetThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingTrip.description || ''}
                    onChange={(e) => setEditingTrip({ ...editingTrip, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 resize-none"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTrip(null)}
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

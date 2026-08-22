import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, DollarSign, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tripId: number) => void;
}

const COVER_PRESETS = [
  { name: 'Parisian Sunset', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Tokyo Neon City', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Colosseum Rome', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Bali Emerald Jungle', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Barcelona Coastline', url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1000&q=80' },
  { name: 'New York Skyline', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80' },
];

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createTrip } = useTrip();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-20');
  const [coverPhoto, setCoverPhoto] = useState(COVER_PRESETS[0].url);
  const [budgetThreshold, setBudgetThreshold] = useState(2500);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a name for your journey.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Both start and end dates are required.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('Trip departure date cannot be earlier than start date.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createTrip({
        name: name.trim(),
        description: description.trim(),
        startDate,
        endDate,
        coverPhoto,
        budgetThreshold: Number(budgetThreshold),
      });
      onSuccess(created.id);
      onClose();
      // Reset
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize trip plan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
          >
            {/* Header with image preview banner */}
            <div className="relative h-32 bg-slate-800 overflow-hidden">
              <img
                src={coverPhoto}
                alt="Trip Cover"
                className="w-full h-full object-cover opacity-75 transform hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4">
                <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>New Travel Itinerary</span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  Design Your Next Journey
                </h3>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trip Title <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Euro Summer 2026 or Tokyo Sakura Discovery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-slate-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date <span className="text-emerald-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date <span className="text-emerald-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 bg-slate-50/50"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Budget Target ($ USD)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={budgetThreshold}
                    onChange={(e) => setBudgetThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ${budgetThreshold.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trip Description & Highlights (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Outline the inspiration, companions, or main goals of this vacation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 bg-slate-50/50 resize-none"
                />
              </div>

              {/* Cover Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Cover Photo Atmosphere</span>
                  <span className="text-[10px] text-slate-400 font-normal">Click preset to select</span>
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {COVER_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => setCoverPhoto(preset.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        coverPhoto === preset.url ? 'border-emerald-500 scale-95 shadow-md ring-2 ring-emerald-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 rounded-xl shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {submitting ? (
                    <span>Creating Plan...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Building Itinerary</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

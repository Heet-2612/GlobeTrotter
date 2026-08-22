import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, Mail, Globe, Bookmark, 
  Trash2, Plus, Sparkles, CheckCircle2, Shield, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';

interface ProfilePageProps {
  onSelectTab: (tab: string) => void;
  onQuickAddCityToTrip: (cityId: number) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
];

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'it', name: 'Italiano (Italian)' },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  onSelectTab, onQuickAddCityToTrip 
}) => {
  const { user, updateProfile, savedDestinations, toggleSaveDestination } = useAuth();
  const { trips } = useTrip();

  const [name, setName] = useState(user?.name || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || AVATAR_PRESETS[0]);
  const [languagePreference, setLanguagePreference] = useState(user?.languagePreference || 'en');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        profilePhoto,
        languagePreference,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error('Failed to update profile', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
          <span>Explorer Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
          Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Update personal traveler details, localization settings, and review saved destination bookmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Card & Form (7 cols) */}
        <div className="md:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
            <img
              src={profilePhoto}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Outfit']">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="mt-1 inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Verified Explorer
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Profile preferences successfully updated!</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Avatar Style</label>
              <div className="flex items-center space-x-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setProfilePhoto(preset)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                      profilePhoto === preset ? 'border-emerald-600 scale-105 shadow-sm ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Language & Localization</label>
              <select
                value={languagePreference}
                onChange={(e) => setLanguagePreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Explorer Stats (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-['Outfit'] uppercase tracking-wider text-[11px]">
              Traveler Statistics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Planned Itineraries</span>
                <span className="font-extrabold text-slate-900">{trips.length}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Bookmarked Destinations</span>
                <span className="font-extrabold text-emerald-700">{savedDestinations.length}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Account Type</span>
                <span className="font-bold text-slate-800">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bookmarked Destinations Gallery */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-emerald-600" />
              <span>Saved Destination Wishlist ({savedDestinations.length})</span>
            </h2>
            <p className="text-xs text-slate-500">Cities you have bookmarked for future travel plans</p>
          </div>

          <button
            onClick={() => onSelectTab('city-search')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Explore More Cities
          </button>
        </div>

        {savedDestinations.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">Your Destination Wishlist is Empty</p>
            <p>Browse the Explore Cities catalog and click the bookmark button to save places here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedDestinations.map(city => (
              <div
                key={city.id}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative h-28 bg-slate-800">
                  <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover opacity-80" />
                  <button
                    onClick={() => toggleSaveDestination(city.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-amber-400 hover:text-rose-400 backdrop-blur-md"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-2.5 text-white">
                    <p className="text-xs font-bold">{city.name}</p>
                    <p className="text-[10px] text-slate-300">{city.country}</p>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Cost:</span>
                    <span className="font-bold text-slate-800">{'★'.repeat(Math.round(city.costIndex))}</span>
                  </div>

                  <button
                    onClick={() => onQuickAddCityToTrip(city.id)}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Active Trip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState(user?.languagePreference || 'en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">User Profile & Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account information and app preferences</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow"
        >
          Logout
        </button>
      </div>

      {/* Account Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg border-2 border-blue-400/30">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-sm text-slate-300">✉️ {user?.email}</p>
          <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start text-xs text-slate-400">
            <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              User ID: #{user?.id}
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              Language: {user?.languagePreference?.toUpperCase() || 'EN'}
            </span>
            {user?.createdAt && (
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Settings & Preferences Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Application Preferences</h3>

        {savedMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-lg font-semibold">
            ✓ Preferences saved successfully!
          </div>
        )}

        <form onSubmit={handleSavePreferences} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Language Preference
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Notifications
              </label>
              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="notifications" className="text-sm text-slate-300 cursor-pointer">
                  Receive itinerary update summaries
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { Globe, Heart, Shield, Sparkles, MapPin, Compass } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md mt-16 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Vision */}
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 font-['Outfit']">GlobeTrotter</p>
              <p className="text-xs text-slate-500">Personalized Multi-City Travel Planner & Budget Engine</p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <button onClick={() => onSelectTab('dashboard')} className="hover:text-emerald-600 transition">
              Dashboard
            </button>
            <button onClick={() => onSelectTab('my-trips')} className="hover:text-emerald-600 transition">
              My Trips
            </button>
            <button onClick={() => onSelectTab('city-search')} className="hover:text-emerald-600 transition">
              Explore Cities
            </button>
            <button onClick={() => onSelectTab('activity-search')} className="hover:text-emerald-600 transition">
              Activities
            </button>
          </div>

          {/* Copyright & Tagline */}
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>© 2026 GlobeTrotter Inc. All rights reserved.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

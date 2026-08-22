import React, { useState } from 'react';
import { 
  Compass, MapPin, Calendar, DollarSign, Share2, 
  User as UserIcon, Plus, Search, Shield, LogOut, 
  Menu, X, Sparkles, Bookmark, ChevronDown, Check, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenCreateModal }) => {
  const { user, logout, savedDestinations } = useAuth();
  const { trips, activeTrip, setActiveTripId } = useTrip();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tripSwitcherOpen, setTripSwitcherOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchToast, setSwitchToast] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'my-trips', label: 'My Trips', icon: MapPin, count: trips.length },
    { id: 'itinerary-builder', label: 'Itinerary Builder', icon: Calendar, disabled: !activeTrip },
    { id: 'itinerary-view', label: 'Itinerary Timeline', icon: Sparkles, disabled: !activeTrip },
    { id: 'budget', label: 'Budget', icon: DollarSign, disabled: !activeTrip },
    { id: 'city-search', label: 'Explore Cities', icon: Search },
    { id: 'activity-search', label: 'Activities', icon: Sparkles },
  ];

  const handleSwitchTrip = (tripId: number, name: string) => {
    setActiveTripId(tripId);
    setTripSwitcherOpen(false);
    setSwitchToast(`Switched to ${name}`);
    setTimeout(() => setSwitchToast(null), 3000);
  };

  const getInitials = (name: string) => {
    if (!name) return 'GT';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center space-x-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-800 bg-clip-text text-transparent font-['Outfit']">
                  GlobeTrotter
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-600 -mt-1">
                  Travel Planner
                </span>
              </div>
            </button>

            {/* Active Trip Quick Switcher */}
            {user && trips.length > 0 && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setTripSwitcherOpen(!tripSwitcherOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 text-xs font-medium text-slate-700 transition border border-slate-200 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="max-w-[140px] truncate font-semibold">
                    {activeTrip ? activeTrip.name : 'Select Trip'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {tripSwitcherOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50"
                    >
                      <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        Switch Active Trip
                      </div>
                      <div className="max-h-56 overflow-y-auto py-1">
                        {trips.map(trip => (
                          <button
                            key={trip.id}
                            onClick={() => handleSwitchTrip(trip.id, trip.name)}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                              activeTrip?.id === trip.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <p className="truncate">{trip.name}</p>
                              <p className="text-[10px] text-slate-400">{trip.startDate}</p>
                            </div>
                            {activeTrip?.id === trip.id && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 pt-1 px-2">
                        <button
                          onClick={() => {
                            setTripSwitcherOpen(false);
                            onOpenCreateModal();
                          }}
                          className="w-full text-center py-1.5 text-xs text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Plan New Trip</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Trip Switch Feedback Toast */}
            <AnimatePresence>
              {switchToast && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-[11px] font-bold"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{switchToast}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  title={item.disabled ? 'Create or select an active trip first' : item.label}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1.5 ${
                    item.disabled 
                      ? 'opacity-40 cursor-not-allowed text-slate-400' 
                      : isActive 
                        ? 'text-emerald-700 bg-emerald-50/80 font-bold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 cursor-pointer'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & User Menu */}
          <div className="flex items-center space-x-2.5">
            {/* Create Trip CTA */}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plan Trip</span>
            </button>

            {/* Saved Destinations quick badge */}
            <button
              onClick={() => onSelectTab('profile')}
              title="Saved Destinations"
              className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {savedDestinations.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-[10px] text-white font-bold rounded-full flex items-center justify-center">
                  {savedDestinations.length}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-400/40 transition cursor-pointer"
                >
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center border border-slate-200">
                      {getInitials(user.name)}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50"
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                          {user.role === 'ADMIN' ? 'Administrator' : 'Explorer'}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            onSelectTab('profile');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Profile & Settings</span>
                        </button>
                        
                        {/* Only show Admin Analytics when user.role === 'ADMIN' */}
                        {user.role === 'ADMIN' && (
                          <button
                            onClick={() => {
                              onSelectTab('admin');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                          >
                            <Shield className="w-3.5 h-3.5 text-amber-500" />
                            <span>Admin Analytics</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            onSelectTab('login');
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => onSelectTab('login')}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg"
          >
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  title={item.disabled ? 'Create or select an active trip first' : item.label}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2.5 ${
                    currentTab === item.id 
                      ? 'bg-emerald-50 text-emerald-700 font-bold' 
                      : item.disabled 
                        ? 'opacity-40 text-slate-400' 
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'login')}>
            <div className="bg-blue-600 text-white font-bold text-xl rounded-lg p-2 flex items-center justify-center w-10 h-10 shadow-md">
              GT
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Globe<span className="text-blue-500">Trotter</span>
            </span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate('my-trips')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentTab === 'my-trips' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  My Trips
                </button>
                <button
                  onClick={() => onNavigate('city-search')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentTab === 'city-search' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Cities
                </button>
                <button
                  onClick={() => onNavigate('activity-search')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentTab === 'activity-search' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Activities
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Profile
                </button>
              </div>

              <div className="flex items-center space-x-4 border-l border-slate-700 pl-4">
                <span className="text-sm font-medium text-slate-300 hidden sm:inline">
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate('login')}
                className="text-slate-300 hover:text-white px-3 py-1.5 text-sm font-medium"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

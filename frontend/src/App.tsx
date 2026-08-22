import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { CitySearchPage } from './pages/CitySearchPage';
import { ActivitySearchPage } from './pages/ActivitySearchPage';
import { BudgetPage } from './pages/BudgetPage';
import { TimelinePage } from './pages/TimelinePage';
import { SharedItineraryPage } from './pages/SharedItineraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SharingSection } from './components/SharingSection';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeParam, setActiveParam] = useState<string | number | undefined>(undefined);

  // Handle hash routing for public share tokens (e.g. #public/token)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash.startsWith('public/')) {
        const token = hash.replace('public/', '');
        setCurrentTab('public');
        setActiveParam(token);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (tab: string, param?: string | number) => {
    setCurrentTab(tab);
    setActiveParam(param);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="text-slate-300 font-medium">Initializing GlobeTrotter...</span>
      </div>
    );
  }

  // Public screen (accessible without login)
  if (currentTab === 'public' && activeParam) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar currentTab={currentTab} onNavigate={handleNavigate} />
        <main className="flex-1">
          <SharedItineraryPage shareToken={String(activeParam)} onNavigate={handleNavigate} />
        </main>
      </div>
    );
  }

  // Unauthenticated users are shown AuthPage
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar currentTab="login" onNavigate={handleNavigate} />
        <main className="flex-1">
          <AuthPage onSuccess={() => handleNavigate('dashboard')} />
        </main>
      </div>
    );
  }

  // Render Protected Views for Authenticated Users
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />
      <main className="flex-1">
        {currentTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {currentTab === 'create-trip' && <CreateTripPage onNavigate={handleNavigate} />}
        {currentTab === 'my-trips' && <MyTripsPage onNavigate={handleNavigate} />}
        {currentTab === 'builder' && activeParam && (
          <ItineraryBuilderPage tripId={Number(activeParam)} onNavigate={handleNavigate} />
        )}
        {currentTab === 'view' && activeParam && (
          <ItineraryViewPage tripId={Number(activeParam)} onNavigate={handleNavigate} />
        )}
        {currentTab === 'city-search' && <CitySearchPage onNavigate={handleNavigate} />}
        {currentTab === 'activity-search' && <ActivitySearchPage onNavigate={handleNavigate} />}
        {currentTab === 'budget' && activeParam && (
          <BudgetPage tripId={Number(activeParam)} onNavigate={handleNavigate} />
        )}
        {currentTab === 'timeline' && activeParam && (
          <TimelinePage tripId={Number(activeParam)} onNavigate={handleNavigate} />
        )}
        {currentTab === 'sharing' && activeParam && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Public Sharing</h2>
              <button
                onClick={() => handleNavigate('builder', activeParam)}
                className="text-xs text-blue-400 font-semibold"
              >
                ← Back to Builder
              </button>
            </div>
            <SharingSection tripId={Number(activeParam)} />
          </div>
        )}
        {currentTab === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;

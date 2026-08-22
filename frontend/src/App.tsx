import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CreateTripModal } from './components/common/CreateTripModal';
import { ShareModal } from './components/common/ShareModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { CitySearchPage } from './pages/CitySearchPage';
import { ActivitySearchPage } from './pages/ActivitySearchPage';
import { BudgetPage } from './pages/BudgetPage';
import { TimelinePage } from './pages/TimelinePage';
import { SharedItineraryPage } from './pages/SharedItineraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainAppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { activeTrip, setActiveTripId, addStop } = useTrip();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [shareTokenParam, setShareTokenParam] = useState<string | null>(null);

  // Filter param passed across pages (e.g., from city card to activity page)
  const [preselectedCityId, setPreselectedCityId] = useState<number | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shareModalState, setShareModalState] = useState<{
    isOpen: boolean;
    tripId: number | null;
    tripName: string;
  }>({
    isOpen: false,
    tripId: null,
    tripName: '',
  });

  // Check URL params for share token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const shareToken = params.get('share');
      if (shareToken) {
        setShareTokenParam(shareToken);
        setCurrentTab('shared');
      }
    }
  }, []);

  // Redirect to login if unauthenticated on private views
  useEffect(() => {
    if (!authLoading && !user && currentTab !== 'shared' && currentTab !== 'login') {
      setCurrentTab('login');
    }
  }, [user, authLoading, currentTab]);

  const handleOpenShareModal = (tripId: number, tripName: string) => {
    setShareModalState({
      isOpen: true,
      tripId,
      tripName,
    });
  };

  const handleQuickAddCityToTrip = async (cityId: number) => {
    if (!activeTrip) {
      setCurrentTab('my-trips');
      return;
    }
    await addStop(activeTrip.id, {
      cityId,
      startDate: activeTrip.startDate,
      endDate: activeTrip.endDate,
    });
    setCurrentTab('itinerary-builder');
  };

  const handleFilterActivitiesByCity = (cityId: number) => {
    setPreselectedCityId(cityId);
    setCurrentTab('activity-search');
  };

  const handleViewPublicPage = (token: string) => {
    setShareTokenParam(token);
    setCurrentTab('shared');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 font-['Outfit']">Loading GlobeTrotter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Global Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setPreselectedCityId(null);
          setCurrentTab(tab);
        }}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {currentTab === 'login' && (
              <LoginPage onSuccess={() => setCurrentTab('dashboard')} />
            )}

            {currentTab === 'dashboard' && (
              <DashboardPage
                onSelectTab={setCurrentTab}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onOpenShareModal={handleOpenShareModal}
                onQuickAddCityToTrip={handleQuickAddCityToTrip}
              />
            )}

            {currentTab === 'my-trips' && (
              <MyTripsPage
                onSelectTab={setCurrentTab}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                onOpenShareModal={handleOpenShareModal}
              />
            )}

            {currentTab === 'itinerary-builder' && (
              <ItineraryBuilderPage
                onSelectTab={setCurrentTab}
                onOpenShareModal={handleOpenShareModal}
              />
            )}

            {currentTab === 'itinerary-view' && (
              <ItineraryViewPage
                onSelectTab={setCurrentTab}
                onOpenShareModal={handleOpenShareModal}
              />
            )}

            {currentTab === 'timeline' && (
              <TimelinePage
                onSelectTab={setCurrentTab}
                onOpenShareModal={handleOpenShareModal}
              />
            )}

            {currentTab === 'budget' && (
              <BudgetPage onSelectTab={setCurrentTab} />
            )}

            {currentTab === 'city-search' && (
              <CitySearchPage
                onSelectTab={setCurrentTab}
                onQuickAddCityToTrip={handleQuickAddCityToTrip}
                onFilterActivitiesByCity={handleFilterActivitiesByCity}
              />
            )}

            {currentTab === 'activity-search' && (
              <ActivitySearchPage
                onSelectTab={setCurrentTab}
                preselectedCityId={preselectedCityId}
              />
            )}

            {currentTab === 'shared' && shareTokenParam && (
              <SharedItineraryPage
                shareToken={shareTokenParam}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'profile' && (
              <ProfilePage
                onSelectTab={setCurrentTab}
                onQuickAddCityToTrip={handleQuickAddCityToTrip}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboardPage onSelectTab={setCurrentTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer onSelectTab={setCurrentTab} />

      {/* Global Modals */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(tripId) => {
          setActiveTripId(tripId);
          setCurrentTab('itinerary-builder');
        }}
      />

      <ShareModal
        isOpen={shareModalState.isOpen}
        tripId={shareModalState.tripId}
        tripName={shareModalState.tripName}
        onClose={() => setShareModalState(prev => ({ ...prev, isOpen: false }))}
        onViewPublicPage={handleViewPublicPage}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <MainAppContent />
      </TripProvider>
    </AuthProvider>
  );
}

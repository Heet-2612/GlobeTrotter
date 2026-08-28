import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { CitySearchPage } from './pages/CitySearchPage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { ActivitySearchPage } from './pages/ActivitySearchPage';
import { BudgetPage } from './pages/BudgetPage';
import { TimelinePage } from './pages/TimelinePage';
import { SharedItineraryPage } from './pages/SharedItineraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SharingSection } from './components/SharingSection';
import { Button, LoadingState } from './components/common/UIComponents';
import { ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, loading, handleOAuthExchange } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeParam, setActiveParam] = useState<string | number | undefined>(undefined);

  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.replace(/^#/, '');

      if (pathname === '/reset-password' || hash.startsWith('reset-password')) {
        const token = searchParams.get('token') || (hash.includes('token=') ? hash.split('token=')[1]?.split('&')[0] : '');
        setCurrentTab('reset-password');
        setActiveParam(token);
        return;
      }

      if (hash.startsWith('oauth2')) {
        const code = searchParams.get('code') || (hash.includes('code=') ? hash.split('code=')[1]?.split('&')[0] : null);
        const error = searchParams.get('error') || (hash.includes('error=') ? hash.split('error=')[1]?.split('&')[0] : null);
        setCurrentTab('oauth-callback');
        if (error) {
          setActiveParam(`error:${error}`);
        } else if (code) {
          setActiveParam(`code:${code}`);
        }
        return;
      }

      if (hash.startsWith('public/')) {
        const token = hash.replace('public/', '');
        setCurrentTab('public');
        setActiveParam(token);
        return;
      }

      if (pathname.startsWith('/cities/') || hash.startsWith('cities/') || hash.startsWith('city/')) {
        const parts = (pathname.startsWith('/cities/') ? pathname : hash).split('/');
        const cId = parts[parts.length - 1];
        if (cId && !isNaN(Number(cId))) {
          setCurrentTab('destination');
          setActiveParam(Number(cId));
          return;
        }
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleNavigate = (tab: string, param?: string | number) => {
    setCurrentTab(tab);
    setActiveParam(param);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (currentTab === 'oauth-callback' && activeParam && String(activeParam).startsWith('code:')) {
      const code = String(activeParam).split('code:')[1];
      handleOAuthExchange(code)
        .then(() => {
          // Clear URL and go to dashboard
          window.history.replaceState(null, '', window.location.pathname);
          handleNavigate('dashboard');
        })
        .catch((err) => {
          console.error(err);
          handleNavigate('oauth-callback', 'error:exchange_failed');
        });
    }
  }, [currentTab, activeParam, handleOAuthExchange]);

  if (loading || (currentTab === 'oauth-callback' && String(activeParam).startsWith('code:'))) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] text-slate-900 flex items-center justify-center">
        <LoadingState message={currentTab === 'oauth-callback' ? "Authenticating securely..." : "Initializing GlobeTrotter..."} />
      </div>
    );
  }

  // Reset Password Screen (Accessible publicly with token)
  if (currentTab === 'reset-password') {
    return (
      <div className="min-h-screen bg-[#f5f7f6] text-slate-900 flex flex-col font-sans">
        <Navbar currentTab="login" onNavigate={handleNavigate} />
        <main className="flex-1">
          <ResetPasswordPage token={activeParam ? String(activeParam) : undefined} onNavigate={handleNavigate} />
        </main>
      </div>
    );
  }

  // OAuth Callback Handler
  if (currentTab === 'oauth-callback' && activeParam) {
    const paramStr = String(activeParam);
    if (paramStr.startsWith('error:')) {
      const errorMsg = paramStr.split('error:')[1];
      return (
        <div className="min-h-screen bg-[#f5f7f6] text-slate-900 flex flex-col font-sans items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-rose-600">Authentication Failed</h2>
            <p className="text-slate-600">
              {errorMsg === 'unverified_email' 
                ? 'Your Google account email is not verified. Please verify your email with Google first.'
                : 'There was an error authenticating with Google.'}
            </p>
            <Button variant="outline" onClick={() => {
              window.history.replaceState(null, '', window.location.pathname);
              handleNavigate('login');
            }}>Return to Login</Button>
          </div>
        </div>
      );
    }
  }

  // Public screen (accessible without login)
  if (currentTab === 'public' && activeParam) {
    return (
      <div className="min-h-screen bg-[#f5f7f6] text-slate-900 flex flex-col font-sans">
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
      <div className="min-h-screen bg-[#f5f7f6] text-slate-900 flex flex-col font-sans">
        <Navbar currentTab="login" onNavigate={handleNavigate} />
        <main className="flex-1">
          <AuthPage onSuccess={() => handleNavigate('dashboard')} />
        </main>
      </div>
    );
  }

  // Render Protected Views for Authenticated Users
  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-900 flex flex-col font-sans">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />
      <main className="flex-1 pb-12">
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
        {currentTab === 'destination' && activeParam && (
          <DestinationDetailsPage cityId={Number(activeParam)} onNavigate={handleNavigate} />
        )}
        {currentTab === 'activity-search' && <ActivitySearchPage onNavigate={handleNavigate} />}
        {currentTab === 'budget' && activeParam && (
          <BudgetPage tripId={Number(activeParam)} onNavigate={handleNavigate} />
        )}
        {currentTab === 'timeline' && activeParam && (
          <TimelinePage tripId={Number(activeParam)} onNavigate={handleNavigate} />
        )}
        {currentTab === 'sharing' && activeParam && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900">Public Sharing Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft size={14} />}
                onClick={() => handleNavigate('builder', activeParam)}
              >
                Back to Builder
              </Button>
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
      <CurrencyProvider>
        <MainAppContent />
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;

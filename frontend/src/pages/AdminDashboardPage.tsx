import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminMeResponse } from '../types';
import { AdminUsersSection } from '../components/admin/AdminUsersSection';
import { AdminDestinationsSection } from '../components/admin/AdminDestinationsSection';
import { Card, Button } from '../components/common/UIComponents';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  ArrowLeft,
  RefreshCw,
  Server,
  Key,
  Users,
  MapPin,
  Sparkles,
  BarChart3,
  Layers,
  LayoutDashboard,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (tab: string, param?: string | number) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const [adminProfile, setAdminProfile] = useState<AdminMeResponse | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'users' | 'destinations'>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      setErrorMessage(null);
      const profile = await api.getAdminProfile();
      setAdminProfile(profile);
    } catch (err: any) {
      setAccessDenied(true);
      setErrorMessage(err.message || 'Access Denied: Platform Administrator privileges required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setAccessDenied(true);
      return;
    }
    checkAdminAccess();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="p-12 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Verifying Platform Admin Privileges...</h4>
            <p className="text-xs text-slate-500 mt-1">Checking secure backend authorization credentials.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || accessDenied || !adminProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 sm:p-12 text-center bg-white border border-rose-200 rounded-3xl shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
              403 Forbidden
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
              Access Denied: Administrator Access Required
            </h2>
            <p className="text-sm text-slate-600">
              The currently logged-in account (
              <span className="font-semibold text-slate-800">{user?.email || 'Unauthenticated'}</span>
              ) is not configured as the GlobeTrotter platform administrator.
            </p>
            {errorMessage && (
              <p className="text-xs text-rose-600 bg-rose-50/80 p-2.5 rounded-xl border border-rose-100 font-mono">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              icon={<ArrowLeft size={15} />}
              onClick={() => onNavigate('dashboard')}
            >
              Return to Dashboard
            </Button>
            <Button
              variant="ghost"
              icon={<RefreshCw size={14} />}
              onClick={checkAdminAccess}
              className="text-slate-600 hover:text-slate-900"
            >
              Retry Access
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header with Breadcrumb & Admin Identity Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-950/15">
            <ShieldCheck size={30} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Platform Admin Dashboard
              </h1>
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phase 1, 2 & 3: Platform Governance, Users & Destination Catalog
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={13} />}
            onClick={() => onNavigate('dashboard')}
            className="text-xs"
          >
            Back to Traveler App
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={13} />}
            onClick={checkAdminAccess}
            className="text-xs"
          >
            Verify Session
          </Button>
        </div>
      </div>

      {/* 2. Admin Sub-Navigation (Dashboard vs Users vs Destinations) */}
      <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveAdminTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'dashboard'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard size={15} />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'users'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={15} />
          <span>Users</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('destinations')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'destinations'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin size={15} />
          <span>Destinations</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeAdminTab === 'users' ? (
        <AdminUsersSection />
      ) : activeAdminTab === 'destinations' ? (
        <AdminDestinationsSection />
      ) : (
        <div className="space-y-8">
          {/* Admin Identity & Security Verification Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Key size={14} className="text-emerald-600" />
                <span>Admin Identity</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{adminProfile.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{adminProfile.email}</p>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                User ID #{adminProfile.id}
              </div>
            </Card>

            <Card className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Role & Authorization</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{adminProfile.role}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Single Platform Administrator</p>
              </div>
              <div className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
                Spring Security: ROLE_ADMIN
              </div>
            </Card>

            <Card className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Server size={14} className="text-emerald-600" />
                <span>Security Mechanism</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Backend Configuration</h4>
                <p className="text-xs text-slate-500 mt-0.5">app.admin.email environment binding</p>
              </div>
              <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                403 Strict Enforcement Active
              </div>
            </Card>
          </div>

          {/* Platform Modules (Phase 1, 2 & 3 Modules) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Management Modules</h3>
              <p className="text-xs text-slate-500">
                Platform modules overview. User & Destination Management are active.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className="p-5 bg-white border border-emerald-200 rounded-2xl space-y-2 cursor-pointer hover:border-emerald-400 hover:shadow-xs transition-all"
                onClick={() => setActiveAdminTab('users')}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">User Directory</h4>
                <p className="text-xs text-slate-500">Read-only account inspection and stats.</p>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md inline-block">
                  Active (Phase 2)
                </span>
              </Card>

              <Card
                className="p-5 bg-white border border-emerald-200 rounded-2xl space-y-2 cursor-pointer hover:border-emerald-400 hover:shadow-xs transition-all"
                onClick={() => setActiveAdminTab('destinations')}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Destinations & Cities</h4>
                <p className="text-xs text-slate-500">Catalog curation and region hierarchy.</p>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md inline-block">
                  Active (Phase 3)
                </span>
              </Card>

              <Card className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-2 opacity-75">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Activity Catalog</h4>
                <p className="text-xs text-slate-500">Global activity taxonomy and benchmarks.</p>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md inline-block">
                  Coming in Phase 4
                </span>
              </Card>

              <Card className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-2 opacity-75">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Platform Telemetry</h4>
                <p className="text-xs text-slate-500">System metrics and live API analytics.</p>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md inline-block">
                  Coming in Phase 5
                </span>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

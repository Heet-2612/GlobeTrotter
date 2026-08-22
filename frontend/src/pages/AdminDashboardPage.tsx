import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Users, Compass, DollarSign, Activity, 
  MapPin, Sparkles, RefreshCw, CheckCircle2, TrendingUp, 
  Layers, ArrowUpRight
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { AdminMetrics } from '../types';

interface AdminDashboardPageProps {
  onSelectTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onSelectTab }) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMetrics();
      setMetrics(data);
    } catch (e) {
      console.error('Failed to load admin metrics', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleResetData = async () => {
    if (window.confirm('Reset storage to fresh default seed data? (Users, demo trips, cities, and activities will be reinitialized)')) {
      await adminService.resetData();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        window.location.reload();
      }, 1200);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <Shield className="w-3 h-3 text-amber-600" />
            <span>Platform Administration & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            GlobeTrotter System Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time aggregate platform statistics, popular destinations leaderboard, and data administration.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadMetrics}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Seed Mock Relational DB</span>
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Relational mock database successfully re-seeded with demo records. Reloading...</span>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center text-xs text-slate-500">
          Calculating aggregate metrics...
        </div>
      )}

      {/* KPI Cards */}
      {!loading && metrics && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900">
                {metrics.totalUsers}
              </p>
              <p className="text-[10px] text-slate-400">Active accounts</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Itineraries</span>
                <Compass className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-blue-700">
                {metrics.totalTrips}
              </p>
              <p className="text-[10px] text-slate-400">Multi-city trips planned</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Global Stops</span>
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-purple-700">
                {metrics.totalStops}
              </p>
              <p className="text-[10px] text-slate-400">City legs scheduled</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Forecasted Volume</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black font-['Outfit'] text-emerald-700">
                ${metrics.totalRevenueEstimate.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">Combined budget estimates</p>
            </div>

          </div>

          {/* Leaderboards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Destinations */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Top Visited Global Destinations</span>
              </h2>

              <div className="space-y-2.5">
                {metrics.topCities.map((c, idx) => (
                  <div key={c.cityId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{c.cityName}</p>
                        <p className="text-[10px] text-slate-400">{c.country}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-700">{c.tripCount} visits</span>
                      <span className="text-[10px] text-slate-400 block font-medium">Score: {c.popularity}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Activities */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Most Scheduled Travel Experiences</span>
              </h2>

              <div className="space-y-2.5">
                {metrics.topActivities.map((a, idx) => (
                  <div key={a.activityId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        idx === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{a.activityName}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">
                          {a.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900">{a.scheduledCount} times</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

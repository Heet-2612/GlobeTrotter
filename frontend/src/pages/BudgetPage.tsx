import React, { useEffect, useState } from 'react';
import { BudgetSummaryResponse, TripResponse } from '../types';
import { api } from '../services/api';

interface BudgetPageProps {
  tripId: number;
  onNavigate: (tab: string, param?: string | number) => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ tripId, onNavigate }) => {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummaryResponse | null>(null);
  const [newBudget, setNewBudget] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadBudgetData();
  }, [tripId]);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tripData = await api.getTripById(tripId);
      setTrip(tripData);

      const summary = await api.getBudgetSummary(tripId);
      setBudgetSummary(summary);
      setNewBudget(summary.budget ? summary.budget.toString() : '0');
    } catch (err: any) {
      setError(err.message || 'Failed to load budget details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setUpdating(true);
    try {
      const updated = await api.updateBudget(tripId, {
        budget: parseFloat(newBudget) || 0,
      });
      setBudgetSummary(updated);
      setSuccessMsg('Budget updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update budget');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400 flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span>Loading budget & cost summary...</span>
      </div>
    );
  }

  if (error || !trip || !budgetSummary) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-950/80 border border-red-800 p-6 rounded-xl text-red-300 text-sm">
          {error || 'Budget information not found.'}
        </div>
      </div>
    );
  }

  const percentage = Math.min(Math.max(budgetSummary.budgetUsedPercentage || 0, 0), 100);
  const isExceeded = budgetSummary.budgetExceeded;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Trip Budget & Costs
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">{trip.name}</h1>
          <p className="text-xs text-slate-400">📅 {trip.startDate} to {trip.endDate}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('builder', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            🛠️ Builder
          </button>
          <button
            onClick={() => onNavigate('view', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            👁️ Read View
          </button>
          <button
            onClick={() => onNavigate('budget', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow"
          >
            💰 Budget
          </button>
          <button
            onClick={() => onNavigate('timeline', tripId)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            ⏱️ Timeline
          </button>
        </div>
      </div>

      {/* Exceeded Alert */}
      {isExceeded && (
        <div className="bg-red-950/80 border border-red-800 p-4 rounded-xl text-red-200 text-sm flex items-center space-x-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold">Budget Exceeded Alert!</p>
            <p className="text-xs text-red-300">
              Total activity costs (${budgetSummary.totalActivityCost}) exceed your target budget (${budgetSummary.budget}).
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-slate-400 uppercase">Target Budget</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">${budgetSummary.budget}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-slate-400 uppercase">Total Spent</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">${budgetSummary.totalActivityCost}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-slate-400 uppercase">Remaining</p>
          <p className={`text-2xl font-bold mt-1 ${budgetSummary.remainingBudget < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            ${budgetSummary.remainingBudget}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-slate-400 uppercase">% Used</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {budgetSummary.budgetUsedPercentage}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2 shadow">
        <div className="flex justify-between text-xs text-slate-300 font-semibold">
          <span>Budget Usage Progress</span>
          <span>{budgetSummary.budgetUsedPercentage}% Used</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all duration-500 ${
              isExceeded ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-emerald-400'
            }`}
            style={{ width: `${Math.min(budgetSummary.budgetUsedPercentage || 0, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Update Budget Form & Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Update Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow">
          <h3 className="text-lg font-bold text-white">Update Target Budget</h3>
          {successMsg && <p className="text-xs text-emerald-400">{successMsg}</p>}
          <form onSubmit={handleUpdateBudget} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                New Target Budget ($)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Save New Budget'}
            </button>
          </form>
        </div>

        {/* Category Breakdown Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow">
          <h3 className="text-lg font-bold text-white">Category Cost Breakdown</h3>
          {!budgetSummary.categoryBreakdown || budgetSummary.categoryBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No scheduled activities with costs yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-center">Activities Count</th>
                    <th className="p-3 text-right">Total Cost ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {budgetSummary.categoryBreakdown.map((cat, i) => (
                    <tr key={i} className="hover:bg-slate-850">
                      <td className="p-3 font-semibold text-white">{cat.category}</td>
                      <td className="p-3 text-center">{cat.count}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">${cat.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

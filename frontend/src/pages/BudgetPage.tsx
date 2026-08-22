import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, PieChart as PieChartIcon, TrendingUp, 
  AlertTriangle, CheckCircle2, Calendar, 
  Edit3, AlertCircle, Receipt, ShieldAlert
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { BudgetSummaryResponse, CategoryCostSummary } from '../types';

interface BudgetPageProps {
  onSelectTab: (tab: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; fill: string; hex: string }> = {
  TRANSPORT: { bg: 'bg-blue-100', text: 'text-blue-800', fill: '#3b82f6', hex: '#3b82f6' },
  STAY: { bg: 'bg-purple-100', text: 'text-purple-800', fill: '#a855f7', hex: '#a855f7' },
  ACTIVITIES: { bg: 'bg-emerald-100', text: 'text-emerald-800', fill: '#10b981', hex: '#10b981' },
  MEALS: { bg: 'bg-amber-100', text: 'text-amber-800', fill: '#f59e0b', hex: '#f59e0b' },
  OTHER: { bg: 'bg-slate-100', text: 'text-slate-800', fill: '#64748b', hex: '#64748b' },
  SIGHTSEEING: { bg: 'bg-emerald-100', text: 'text-emerald-800', fill: '#10b981', hex: '#10b981' },
  FOOD: { bg: 'bg-amber-100', text: 'text-amber-800', fill: '#f59e0b', hex: '#f59e0b' },
  ADVENTURE: { bg: 'bg-rose-100', text: 'text-rose-800', fill: '#f43f5e', hex: '#f43f5e' },
  CULTURE: { bg: 'bg-indigo-100', text: 'text-indigo-800', fill: '#6366f1', hex: '#6366f1' },
  RELAXATION: { bg: 'bg-teal-100', text: 'text-teal-800', fill: '#14b8a6', hex: '#14b8a6' },
};

export const BudgetPage: React.FC<BudgetPageProps> = ({ onSelectTab }) => {
  const { activeTrip, getBudget, updateBudget, refreshActiveTrip } = useTrip();
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Budget Modal State
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [newBudgetVal, setNewBudgetVal] = useState<number>(0);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const loadData = useCallback(async () => {
    if (!activeTrip) return;
    setLoading(true);
    try {
      const res = await getBudget(activeTrip.id);
      setBudgetSummary(res);
      setNewBudgetVal(res.budget ?? activeTrip.budget ?? 0);
    } catch (e) {
      console.error('Failed to load budget summary', e);
    } finally {
      setLoading(false);
    }
  }, [activeTrip, getBudget]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!activeTrip) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
        <DollarSign className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 font-['Outfit']">No Active Trip Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select an itinerary to inspect financial forecasts and budget allocations.
        </p>
        <button
          onClick={() => onSelectTab('my-trips')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
        >
          Go to My Trips
        </button>
      </div>
    );
  }

  const handleUpdateBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    if (newBudgetVal < 0) {
      setUpdateError('Budget target cannot be negative.');
      return;
    }

    try {
      const updatedRes = await updateBudget(activeTrip.id, Number(newBudgetVal));
      setBudgetSummary(updatedRes);
      await refreshActiveTrip();
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        setIsEditBudgetOpen(false);
      }, 1000);
    } catch (err: any) {
      setUpdateError(err?.message || 'Failed to update budget target.');
    }
  };

  const totalSpent = budgetSummary?.totalActivityCost ?? 0;
  const targetBudget = budgetSummary?.budget ?? activeTrip.budget ?? 0;
  const remaining = budgetSummary?.remainingBudget ?? (targetBudget > 0 ? targetBudget - totalSpent : 0);
  const isOver = budgetSummary?.budgetExceeded ?? (targetBudget > 0 ? totalSpent > targetBudget : false);
  const percentUsed = budgetSummary?.budgetUsedPercentage ?? (targetBudget > 0 ? Math.min(100, Math.round((totalSpent / targetBudget) * 100)) : 0);

  // Category Breakdown Slices for Donut Visual
  const breakdown: CategoryCostSummary[] = budgetSummary?.categoryBreakdown || [];
  let cumulativeAngle = 0;
  const slices = breakdown.map((item) => {
    const cost = Number(item.cost || 0);
    const percentage = totalSpent > 0 ? cost / totalSpent : 0;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + percentage * 360;
    cumulativeAngle = endAngle;

    const radius = 40;
    const center = 50;
    const x1 = center + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = center + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = center + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
    const y2 = center + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);
    const largeArc = percentage > 0.5 ? 1 : 0;
    const pathData = totalSpent > 0 && cost > 0
      ? `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
      : '';

    const catKey = (item.category || 'OTHER').toUpperCase();
    const color = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.OTHER;

    return {
      category: item.category,
      cost,
      activityCount: item.activityCount,
      percentage: Math.round(percentage * 100),
      pathData,
      color,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <span>Financial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Trip Budget & Cost Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Authoritative spend tracking for <span className="font-bold text-slate-800">{activeTrip.name}</span> ({activeTrip.startDate} to {activeTrip.endDate}).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setNewBudgetVal(targetBudget);
              setUpdateError(null);
              setIsEditBudgetOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Set Target Budget</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-xs text-slate-500">
          Calculating budget breakdown from live backend database...
        </div>
      )}

      {!loading && (
        <>
          {/* Main KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Total Forecasted Spend vs Target */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Activity Spend</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isOver ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isOver ? 'Over Budget' : 'Within Budget'}
                </span>
              </div>

              <div>
                <p className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900">
                  ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Target Budget: <span className="font-bold text-slate-800">${targetBudget.toLocaleString()}</span> ({percentUsed.toFixed(0)}% allocated)
                </p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, percentUsed)}%` }}
                />
              </div>
            </div>

            {/* Card 2: Remaining Budget */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining Allowance</span>
                <TrendingUp className={`w-4 h-4 ${isOver ? 'text-rose-500' : 'text-emerald-600'}`} />
              </div>

              <div>
                <p className={`text-3xl sm:text-4xl font-black font-['Outfit'] ${isOver ? 'text-rose-600' : 'text-emerald-700'}`}>
                  ${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isOver ? 'Exceeded target budget limit' : 'Available for remaining itinerary'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                Budget Currency: <span className="font-bold text-slate-900">{budgetSummary?.currency || 'USD'}</span>
              </div>
            </div>

            {/* Card 3: Overbudget Alert Status */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Financial Status</span>
                <ShieldAlert className={`w-4 h-4 ${isOver ? 'text-rose-600' : 'text-emerald-600'}`} />
              </div>

              <div>
                <p className="text-2xl font-black font-['Outfit'] text-slate-900">
                  {isOver ? 'Over Budget Alert' : 'On Track'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {breakdown.length} experience category group(s)
                </p>
              </div>

              <div className={`p-2.5 rounded-xl text-[11px] font-medium ${
                isOver ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              }`}>
                {isOver 
                  ? 'Total scheduled experiences exceed assigned budget cap.' 
                  : 'Total scheduled experiences are well within budget limits.'}
              </div>
            </div>

          </div>

          {/* Visual Analytics & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Donut Chart & Category Cards */}
            <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
                <PieChartIcon className="w-4 h-4 text-emerald-600" />
                <span>Category Spend Breakdown</span>
              </h2>

              {breakdown.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
                  <p>No scheduled activities in itinerary yet.</p>
                  <p className="text-[11px] text-slate-400">Schedule activities in Itinerary Builder to view category distribution.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  {/* SVG Donut Visual */}
                  <div className="sm:col-span-5 flex justify-center">
                    <div className="relative w-44 h-44">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                        {slices.map(s => s.pathData ? (
                          <path
                            key={s.category}
                            d={s.pathData}
                            fill={s.color.fill}
                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                          />
                        ) : null)}
                        <circle cx="50" cy="50" r="28" fill="#ffffff" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Total Spent</span>
                        <span className="text-xs font-black text-slate-900">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category Legend List */}
                  <div className="sm:col-span-7 space-y-2.5">
                    {slices.map(s => (
                      <div key={s.category} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color.hex }} />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{s.category}</span>
                            <span className="text-[10px] text-slate-400">{s.activityCount} item(s)</span>
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          <span className="font-extrabold text-slate-900">${s.cost.toFixed(2)}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({s.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Ledger Breakdown */}
            <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Backend Category Ledger</span>
              </h2>

              {breakdown.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No experience charges recorded.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {breakdown.map(item => (
                    <div key={item.category} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.category}</span>
                        <span className="text-[10px] text-slate-500">{item.activityCount} activity(ies)</span>
                      </div>
                      <span className="text-xs font-black text-emerald-700">
                        ${Number(item.cost || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}

      {/* Modal: Edit Target Budget */}
      <AnimatePresence>
        {isEditBudgetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditBudgetOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              {updateSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Budget Target Updated!</h3>
                  <p className="text-xs text-slate-500">Saved to Spring Boot backend database.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Set Target Trip Budget</h3>
                    <button onClick={() => setIsEditBudgetOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  {updateError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{updateError}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdateBudgetSubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Target Budget Amount ($ USD)</label>
                      <input
                        type="number"
                        step="10"
                        min="0"
                        value={newBudgetVal}
                        onChange={(e) => setNewBudgetVal(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-sm font-bold"
                        required
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Current scheduled experience spend: <strong>${totalSpent.toFixed(2)}</strong>
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditBudgetOpen(false)}
                        className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                      >
                        Save Budget Target
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

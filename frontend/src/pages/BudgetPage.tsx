import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, PieChart as PieChartIcon, TrendingUp, 
  AlertTriangle, Plus, Trash2, CheckCircle2, Calendar, 
  Tag, ArrowRight, Sparkles, MapPin, Receipt, ShieldAlert
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { TripBudgetSummary } from '../types';

interface BudgetPageProps {
  onSelectTab: (tab: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; fill: string; hex: string }> = {
  TRANSPORT: { bg: 'bg-blue-100', text: 'text-blue-800', fill: '#3b82f6', hex: '#3b82f6' },
  STAY: { bg: 'bg-purple-100', text: 'text-purple-800', fill: '#a855f7', hex: '#a855f7' },
  ACTIVITIES: { bg: 'bg-emerald-100', text: 'text-emerald-800', fill: '#10b981', hex: '#10b981' },
  MEALS: { bg: 'bg-amber-100', text: 'text-amber-800', fill: '#f59e0b', hex: '#f59e0b' },
  OTHER: { bg: 'bg-slate-100', text: 'text-slate-800', fill: '#64748b', hex: '#64748b' },
};

export const BudgetPage: React.FC<BudgetPageProps> = ({ onSelectTab }) => {
  const { activeTrip, getBudget, refreshActiveTrip } = useTrip();
  const [budget, setBudget] = useState<TripBudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Manual Expense Modal State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expCategory, setExpCategory] = useState<'TRANSPORT' | 'STAY' | 'ACTIVITIES' | 'MEALS' | 'OTHER'>('TRANSPORT');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState<number>(100);
  const [expDate, setExpDate] = useState('');

  const loadData = async () => {
    if (!activeTrip) return;
    setLoading(true);
    try {
      const b = await getBudget(activeTrip.id);
      setBudget(b);
      setExpDate(activeTrip.startDate);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTrip]);

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

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    // Persist to local engine
    const raw = localStorage.getItem('globetrotter_expenses');
    const expenses = raw ? JSON.parse(raw) : [];
    const newExp = {
      id: Date.now(),
      tripId: activeTrip.id,
      category: expCategory,
      amount: Number(expAmount),
      description: expDescription.trim() || `${expCategory} Expense`,
      expenseDate: expDate || activeTrip.startDate,
      createdAt: new Date().toISOString(),
    };
    expenses.push(newExp);
    localStorage.setItem('globetrotter_expenses', JSON.stringify(expenses));

    setIsAddExpenseOpen(false);
    setExpDescription('');
    loadData();
    refreshActiveTrip();
  };

  const total = budget?.totalEstimatedCost || 0;
  const threshold = budget?.budgetThreshold || 2500;
  const isOver = total > threshold;
  const percentUsed = Math.min(100, Math.round((total / (threshold || 1)) * 100));

  // Compute SVG Donut Slices
  const categories = budget?.categoryBreakdown || { TRANSPORT: 0, STAY: 0, ACTIVITIES: 0, MEALS: 0, OTHER: 0 };
  const catEntries = Object.entries(categories) as [string, number][];

  let cumulativeAngle = 0;
  const slices = catEntries.map(([cat, amount]) => {
    const percentage = total > 0 ? amount / total : 0;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + percentage * 360;
    cumulativeAngle = endAngle;

    // SVG arc coordinates
    const radius = 40;
    const center = 50;
    const x1 = center + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = center + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = center + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
    const y2 = center + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);
    const largeArc = percentage > 0.5 ? 1 : 0;
    const pathData = total > 0 && amount > 0
      ? `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
      : '';

    return {
      cat,
      amount,
      percentage: Math.round(percentage * 100),
      pathData,
      color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.OTHER,
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
            Budget & Expense Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time forecasting for <span className="font-bold text-slate-800">{activeTrip.name}</span> ({activeTrip.startDate} to {activeTrip.endDate}).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Custom Expense</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Total Forecast vs Threshold */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Forecasted Spend</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isOver ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isOver ? 'Over Budget' : 'Within Budget'}
            </span>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900">
              ${total.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Target Threshold: <span className="font-bold text-slate-800">${threshold.toLocaleString()}</span> ({percentUsed}% allocated)
            </p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOver ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Card 2: Daily Spend Velocity */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Daily Burn</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black font-['Outfit'] text-emerald-700">
              ${(budget?.averageDailyCost || 0).toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              across {budget?.dailyBreakdown.length || 0} itinerary days
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600">
            Recommended Daily Cap: <span className="font-bold text-slate-900">${((threshold || 2500) / Math.max(1, budget?.dailyBreakdown.length || 1)).toFixed(2)} / day</span>
          </div>
        </div>

        {/* Card 3: Overbudget Flag Summary */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alert Flags</span>
            <AlertTriangle className={`w-4 h-4 ${(budget?.overbudgetDays.length || 0) > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-black font-['Outfit'] text-slate-900">
              {budget?.overbudgetDays.length || 0} <span className="text-sm font-normal text-slate-500">Days</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              exceed average daily spend allocation
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-amber-900 font-medium">
            {(budget?.overbudgetDays.length || 0) > 0 
              ? 'Review high-cost activity bookings below.'
              : 'All days pacing within normal variance.'}
          </div>
        </div>

      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donut Chart & Category Cards (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
            <PieChartIcon className="w-4 h-4 text-emerald-600" />
            <span>Category Spending Distribution</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* SVG Donut Visual */}
            <div className="sm:col-span-5 flex justify-center">
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                  {slices.map(s => s.pathData ? (
                    <path
                      key={s.cat}
                      d={s.pathData}
                      fill={s.color.fill}
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ) : null)}
                  {/* Center cutout */}
                  <circle cx="50" cy="50" r="28" fill="#ffffff" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                  <span className="text-sm font-black text-slate-900">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Category Legend List */}
            <div className="sm:col-span-7 space-y-2.5">
              {slices.map(s => (
                <div key={s.cat} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color.hex }} />
                    <span className="text-xs font-bold text-slate-800">{s.cat}</span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-extrabold text-slate-900">${s.amount.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({s.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overbudget Alerts List (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>High Spend Itinerary Days</span>
          </h2>

          {(budget?.overbudgetDays.length || 0) === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold">No High-Spend Outliers</p>
              <p className="text-slate-500">Your daily activity distribution is balanced across the trip duration.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {budget?.overbudgetDays.map(ob => (
                <div key={ob.dayIndex} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-black text-[10px]">
                        DAY {ob.dayIndex}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{ob.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      City: <span className="font-semibold text-slate-700">{ob.city || 'Transit'}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-rose-700 block">
                      ${ob.dailyCost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-amber-800 font-semibold">
                      +${ob.excess.toFixed(2)} over avg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Daily Breakdown Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center space-x-2">
          <Receipt className="w-4 h-4 text-emerald-600" />
          <span>Complete Day-by-Day Financial Ledger</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold text-[10px]">
                <th className="pb-3">Day #</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Destination City</th>
                <th className="pb-3">Activities Scheduled</th>
                <th className="pb-3 text-right">Daily Cost</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {budget?.dailyBreakdown.map(d => (
                <tr key={d.dayIndex} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 font-bold text-slate-900">Day {d.dayIndex}</td>
                  <td className="py-3">{d.date}</td>
                  <td className="py-3 font-medium text-slate-800">{d.city || 'Free / Transit'}</td>
                  <td className="py-3 text-slate-500">{d.activitiesCount} item(s)</td>
                  <td className="py-3 text-right font-bold text-slate-900">${d.cost.toFixed(2)}</td>
                  <td className="py-3 text-right">
                    {d.isOverbudget ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        High Spend
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Manual Expense */}
      <AnimatePresence>
        {isAddExpenseOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddExpenseOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Log Custom Trip Expense</h3>
                <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expense Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  >
                    <option value="TRANSPORT">Transport (Flights, High-Speed Trains, Taxis)</option>
                    <option value="STAY">Stay & Accommodation (Hotels, Villas)</option>
                    <option value="ACTIVITIES">Activities & Experiences</option>
                    <option value="MEALS">Meals & Culinary Dining</option>
                    <option value="OTHER">Other / Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expense Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Eurostar High Speed Train ticket Paris to Rome"
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Amount ($ USD)</label>
                    <input
                      type="number"
                      step="1"
                      value={expAmount}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                  >
                    Record Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

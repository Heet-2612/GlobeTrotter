import React from 'react';
import { BudgetComparisonAnalytics } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card } from '../common/UIComponents';
import { Calculator, Target, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BudgetComparisonCardProps {
  budgetComparison?: BudgetComparisonAnalytics;
  currency: string;
}

export const BudgetComparisonCard: React.FC<BudgetComparisonCardProps> = ({
  budgetComparison,
  currency,
}) => {
  const { formatDual } = useCurrency();

  if (!budgetComparison) return null;

  const { targetBudget, plannedItineraryCost, actualSpent, variance } = budgetComparison;
  const isOverPlanned = variance > 0.005;
  const isUnderPlanned = variance < -0.005;

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calculator size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Budget & Itinerary Cost Comparison</h4>
            <p className="text-[11px] text-slate-500">Planned itinerary activity cost vs real expense total</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Target Budget */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-bold uppercase">
            <Target size={13} className="text-slate-400" />
            <span>Target Budget</span>
          </div>
          <div className="text-base font-black text-slate-900 font-mono">
            {targetBudget != null ? formatDual(targetBudget, currency) : (
              <span className="text-xs font-normal text-slate-400">Not set</span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            {targetBudget != null ? 'Trip overall target' : 'Optional trip budget'}
          </p>
        </div>

        {/* 2. Planned Itinerary Cost */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-bold uppercase">
            <Compass size={13} className="text-slate-400" />
            <span>Planned Itinerary</span>
          </div>
          <div className="text-base font-black text-slate-900 font-mono">
            {formatDual(plannedItineraryCost, currency)}
          </div>
          <p className="text-[10px] text-slate-400">
            Estimated from scheduled activities
          </p>
        </div>

        {/* 3. Actual Spent */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-bold uppercase">
            <Calculator size={13} className="text-slate-400" />
            <span>Actual Spent</span>
          </div>
          <div className="text-base font-black text-slate-900 font-mono">
            {formatDual(actualSpent, currency)}
          </div>
          <p className="text-[10px] text-slate-400">
            Sum of all logged trip expenses
          </p>
        </div>

        {/* 4. Variance */}
        <div className={`p-4 rounded-xl space-y-1 border ${
          isOverPlanned
            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
            : isUnderPlanned
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase opacity-80">
            {isOverPlanned ? (
              <AlertCircle size={13} className="text-rose-600" />
            ) : (
              <CheckCircle2 size={13} className="text-emerald-600" />
            )}
            <span>Planned Variance</span>
          </div>
          <div className="text-base font-black font-mono">
            {isOverPlanned ? `+${formatDual(variance, currency)}` : formatDual(variance, currency)}
          </div>
          <p className="text-[10px] opacity-75">
            {isOverPlanned
              ? 'Over planned itinerary cost'
              : isUnderPlanned
              ? 'Under planned itinerary cost'
              : 'Matches planned itinerary'}
          </p>
        </div>
      </div>
    </Card>
  );
};

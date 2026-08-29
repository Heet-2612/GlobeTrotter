import React from 'react';
import { ExpenseSourceAnalytics } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card } from '../common/UIComponents';
import { Layers, Compass, FileText } from 'lucide-react';

interface ExpenseSourceBreakdownProps {
  sourceBreakdown: ExpenseSourceAnalytics[];
  currency: string;
}

export const ExpenseSourceBreakdown: React.FC<ExpenseSourceBreakdownProps> = ({
  sourceBreakdown,
  currency,
}) => {
  const { formatDual } = useCurrency();

  if (!sourceBreakdown || sourceBreakdown.length === 0) {
    return null;
  }

  const activitySource = sourceBreakdown.find((s) => s.source === 'ACTIVITY') || {
    source: 'ACTIVITY' as const,
    totalAmount: 0,
    expenseCount: 0,
    percentage: 0,
  };

  const customSource = sourceBreakdown.find((s) => s.source === 'CUSTOM') || {
    source: 'CUSTOM' as const,
    totalAmount: 0,
    expenseCount: 0,
    percentage: 0,
  };

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Layers size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Activity vs Custom Spending</h4>
            <p className="text-[11px] text-slate-500">Planned activity bills vs standalone expenses</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. Activity-Linked Spending */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <Compass size={14} />
              </div>
              <span className="font-bold text-slate-900">Activity-Linked</span>
              <span className="text-[10px] text-slate-400">
                ({activitySource.expenseCount} bill{activitySource.expenseCount !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center space-x-2 font-mono">
              <span className="font-bold text-slate-900">{formatDual(activitySource.totalAmount, currency)}</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                {activitySource.percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, activitySource.percentage))}%` }}
            />
          </div>
        </div>

        {/* 2. Custom Spending */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-md bg-sky-50 text-sky-600">
                <FileText size={14} />
              </div>
              <span className="font-bold text-slate-900">Custom Expenses</span>
              <span className="text-[10px] text-slate-400">
                ({customSource.expenseCount} bill{customSource.expenseCount !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center space-x-2 font-mono">
              <span className="font-bold text-slate-900">{formatDual(customSource.totalAmount, currency)}</span>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/60">
                {customSource.percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, customSource.percentage))}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

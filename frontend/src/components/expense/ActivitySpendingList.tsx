import React from 'react';
import { ActivitySpendingAnalytics } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card } from '../common/UIComponents';
import { Compass, AlertCircle, CheckCircle2, Receipt } from 'lucide-react';

interface ActivitySpendingListProps {
  activitySpending: ActivitySpendingAnalytics[];
  currency: string;
}

export const ActivitySpendingList: React.FC<ActivitySpendingListProps> = ({
  activitySpending,
  currency,
}) => {
  const { formatDual } = useCurrency();

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Compass size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Activity Spending & Variance</h4>
            <p className="text-[11px] text-slate-500">Planned estimated cost vs actual logged activity receipts</p>
          </div>
        </div>
      </div>

      {activitySpending.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-600">No activity-linked expenses yet</p>
          <p className="text-[11px] text-slate-400">Attach expenses to itinerary activities to track variances</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pr-4">Activity</th>
                <th className="pb-3 px-3 text-right">Planned</th>
                <th className="pb-3 px-3 text-right">Actual Spent</th>
                <th className="pb-3 px-3 text-right">Bills</th>
                <th className="pb-3 pl-3 text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activitySpending.map((act) => {
                const isOver = act.variance > 0.005;
                const isUnder = act.variance < -0.005;
                const isOnPlan = !isOver && !isUnder;

                return (
                  <tr key={act.tripActivityId} className="hover:bg-slate-50/60 transition-colors">
                    {/* Activity Info */}
                    <td className="py-3 pr-4">
                      <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <Compass size={13} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{act.activityName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {act.category}
                      </span>
                    </td>

                    {/* Planned Cost */}
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {formatDual(act.plannedCost, currency)}
                    </td>

                    {/* Actual Spent */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatDual(act.actualSpent, currency)}
                    </td>

                    {/* Bills Count */}
                    <td className="py-3 px-3 text-right text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                        {act.expenseCount}
                      </span>
                    </td>

                    {/* Variance */}
                    <td className="py-3 pl-3 text-right">
                      {isOver && (
                        <div className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg font-mono font-bold text-[11px] border border-rose-200/70">
                          <AlertCircle size={11} className="shrink-0" />
                          <span>+{formatDual(act.variance, currency)}</span>
                          <span className="text-[9px] uppercase font-sans font-semibold">Over</span>
                        </div>
                      )}
                      {isUnder && (
                        <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-mono font-bold text-[11px] border border-emerald-200/70">
                          <CheckCircle2 size={11} className="shrink-0" />
                          <span>{formatDual(act.variance, currency)}</span>
                          <span className="text-[9px] uppercase font-sans font-semibold">Under</span>
                        </div>
                      )}
                      {isOnPlan && (
                        <div className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg font-sans font-semibold text-[11px]">
                          <span>On Plan</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

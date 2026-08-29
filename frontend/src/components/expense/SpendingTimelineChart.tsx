import React from 'react';
import { TimelineAnalytics } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card } from '../common/UIComponents';
import { Calendar, TrendingUp } from 'lucide-react';

interface SpendingTimelineChartProps {
  timeline: TimelineAnalytics[];
  currency: string;
}

export const SpendingTimelineChart: React.FC<SpendingTimelineChartProps> = ({
  timeline,
  currency,
}) => {
  const { formatDual } = useCurrency();

  if (!timeline || timeline.length === 0) {
    return (
      <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Daily Spending Timeline</h4>
            <p className="text-[11px] text-slate-500">Day-by-day expense timeline across the trip</p>
          </div>
        </div>
        <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-600">No daily spending recorded</p>
          <p className="text-[11px] text-slate-400">Log expenses with dates to see the spending timeline</p>
        </div>
      </Card>
    );
  }

  const maxAmount = Math.max(...timeline.map((t) => t.totalAmount), 1);

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Daily Spending Timeline</h4>
            <p className="text-[11px] text-slate-500">Day-by-day expense distribution across the trip</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <Calendar size={13} className="text-emerald-600" />
          <span>{timeline.length} active spending day{timeline.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {timeline.map((item) => {
            const heightPct = Math.max(15, Math.round((item.totalAmount / maxAmount) * 100));
            const dateObj = new Date(item.date);
            const dateLabel = isNaN(dateObj.getTime())
              ? item.date
              : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div
                key={item.date}
                className="flex flex-col items-center p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:bg-emerald-50/40 hover:border-emerald-200 transition-colors group"
              >
                <div className="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                  {dateLabel}
                </div>

                {/* Vertical Bar Container */}
                <div className="w-full h-24 flex items-end justify-center py-1">
                  <div
                    className="w-8 bg-emerald-500 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-600 shadow-2xs"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                <div className="text-center w-full">
                  <div className="font-black text-xs text-slate-900 font-mono truncate">
                    {formatDual(item.totalAmount, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.expenseCount} bill{item.expenseCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

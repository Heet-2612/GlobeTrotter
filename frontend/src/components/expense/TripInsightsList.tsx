import React from 'react';
import { Card } from '../common/UIComponents';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, Wallet, Compass, Calendar, DollarSign } from 'lucide-react';

interface TripInsightsListProps {
  insights: string[];
}

export const TripInsightsList: React.FC<TripInsightsListProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  const getInsightMeta = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('over') || lower.includes('remains outstanding')) {
      return {
        icon: <AlertCircle size={15} className="text-amber-600 shrink-0" />,
        bg: 'bg-amber-50/70 border-amber-200/70 text-slate-900',
        badge: 'bg-amber-100/80 text-amber-800',
      };
    }
    if (lower.includes('settled') || lower.includes('under')) {
      return {
        icon: <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />,
        bg: 'bg-emerald-50/70 border-emerald-200/70 text-slate-900',
        badge: 'bg-emerald-100/80 text-emerald-800',
      };
    }
    if (lower.includes('day') || lower.includes('august') || lower.includes('january') || lower.includes('february')) {
      return {
        icon: <Calendar size={15} className="text-sky-600 shrink-0" />,
        bg: 'bg-sky-50/70 border-sky-200/70 text-slate-900',
        badge: 'bg-sky-100/80 text-sky-800',
      };
    }
    if (lower.includes('activity') || lower.includes('planned')) {
      return {
        icon: <Compass size={15} className="text-indigo-600 shrink-0" />,
        bg: 'bg-indigo-50/70 border-indigo-200/70 text-slate-900',
        badge: 'bg-indigo-100/80 text-indigo-800',
      };
    }
    return {
      icon: <TrendingUp size={15} className="text-emerald-600 shrink-0" />,
      bg: 'bg-slate-50 border-slate-200 text-slate-900',
      badge: 'bg-slate-100 text-slate-700',
    };
  };

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Key Trip Insights</h4>
            <p className="text-[11px] text-slate-500">Automated financial takeaways generated from your trip data</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
          {insights.length} Takeaway{insights.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, idx) => {
          const meta = getInsightMeta(insight);

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-colors ${meta.bg}`}
            >
              <div className="mt-0.5">{meta.icon}</div>
              <p className="text-xs font-semibold leading-relaxed text-slate-800">
                {insight}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

import React from 'react';
import { TopExpenseAnalytics } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card, Badge } from '../common/UIComponents';
import { Award, Compass, User, Calendar } from 'lucide-react';

interface TopExpensesListProps {
  topExpenses: TopExpenseAnalytics[];
  currency: string;
}

export const TopExpensesList: React.FC<TopExpensesListProps> = ({
  topExpenses,
  currency,
}) => {
  const { formatDual } = useCurrency();

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Largest Expenses</h4>
            <p className="text-[11px] text-slate-500">Top 5 biggest receipts logged for this trip</p>
          </div>
        </div>
      </div>

      {topExpenses.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-600">No expenses recorded</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topExpenses.map((exp, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={exp.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isFirst
                    ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isFirst
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    <div className="min-w-0">
                      <h5 className="font-bold text-slate-900 text-xs truncate">{exp.title}</h5>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <span className="bg-slate-200/60 text-slate-700 font-semibold px-1.5 py-0.2 rounded">
                          {exp.category}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <User size={11} className="text-slate-400" />
                          <span>Paid by <strong className="text-slate-700 font-medium">{exp.payerName}</strong></span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Calendar size={11} className="text-slate-400" />
                          <span>{exp.expenseDate}</span>
                        </span>
                      </div>

                      {exp.activityName && (
                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md w-fit font-medium">
                          <Compass size={11} className="shrink-0" />
                          <span className="truncate">Linked to {exp.activityName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="font-black text-xs sm:text-sm text-slate-900 font-mono shrink-0">
                    {formatDual(exp.amount, currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

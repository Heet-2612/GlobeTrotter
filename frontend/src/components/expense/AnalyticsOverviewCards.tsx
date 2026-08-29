import React from 'react';
import { OverviewAnalytics } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card } from '../common/UIComponents';
import { Wallet, Scale, Receipt, Handshake } from 'lucide-react';

interface AnalyticsOverviewCardsProps {
  overview: OverviewAnalytics;
  currency: string;
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({
  overview,
  currency,
}) => {
  const { formatDual } = useCurrency();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Trip Expenses */}
      <Card className="p-5 bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet size={18} />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {formatDual(overview.totalTripExpenses, currency)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {overview.expenseCount > 0
              ? `Avg ${formatDual(overview.averageExpenseAmount, currency)} / bill`
              : 'No expenses logged'}
          </p>
        </div>
      </Card>

      {/* 2. Outstanding Balance */}
      <Card className="p-5 bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding</span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Scale size={18} />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {formatDual(overview.totalOutstandingBalance, currency)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {overview.totalOutstandingBalance > 0
              ? 'Unsettled group debt'
              : 'All balances settled'}
          </p>
        </div>
      </Card>

      {/* 3. Expense Count */}
      <Card className="p-5 bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bills</span>
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Receipt size={18} />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {overview.expenseCount}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Across all categories
          </p>
        </div>
      </Card>

      {/* 4. Settlement Volume & Count */}
      <Card className="p-5 bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Settled</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Handshake size={18} />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {formatDual(overview.totalSettlementVolume, currency)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {overview.settlementCount} payment{overview.settlementCount !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </Card>
    </div>
  );
};

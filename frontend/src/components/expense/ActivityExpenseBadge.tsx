import React from 'react';
import { Receipt } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface ActivityExpenseBadgeProps {
  billCount: number;
  totalCost: number;
  currency?: string;
  onClick?: () => void;
}

export const ActivityExpenseBadge: React.FC<ActivityExpenseBadgeProps> = ({
  billCount,
  totalCost,
  currency = 'INR',
  onClick,
}) => {
  const { formatDual } = useCurrency();

  if (billCount <= 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
      title={`${billCount} bill(s) logged for this activity`}
    >
      <Receipt size={13} className="text-emerald-600 shrink-0" />
      <span>{billCount} Bill{billCount > 1 ? 's' : ''}:</span>
      <span className="font-bold text-emerald-950">{formatDual(totalCost, currency)}</span>
    </button>
  );
};

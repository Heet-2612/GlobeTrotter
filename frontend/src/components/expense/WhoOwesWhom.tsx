import React from 'react';
import { DebtTransferResponse } from '../../types';
import { ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface WhoOwesWhomProps {
  transfers: DebtTransferResponse[];
  currency?: string;
  onSettleUp?: (transfer: DebtTransferResponse) => void;
}

export const WhoOwesWhom: React.FC<WhoOwesWhomProps> = ({ transfers, currency = 'INR', onSettleUp }) => {
  const { formatDual } = useCurrency();

  if (transfers.length === 0) {
    return (
      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-xs text-emerald-900">
        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
        <div>
          <span className="font-bold block">All Debts Settled!</span>
          <span className="text-[11px] text-emerald-700">No outstanding transfers required for this trip.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {transfers.map((t, idx) => (
        <div
          key={idx}
          className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs"
        >
          {/* Debtor */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">
              {t.fromMemberName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-slate-900 block truncate">{t.fromMemberName}</span>
              <span className="text-[10px] text-rose-600 font-semibold uppercase">Owes</span>
            </div>
          </div>

          {/* Transfer Arrow & Amount */}
          <div className="flex items-center space-x-2 shrink-0 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-black text-slate-900 text-xs">{formatDual(t.amount, currency)}</span>
            <ArrowRight size={14} className="text-emerald-600" />
          </div>

          {/* Creditor & Settle Up Button */}
          <div className="flex items-center space-x-3 justify-end text-right min-w-0">
            <div className="min-w-0">
              <span className="font-bold text-slate-900 block truncate">{t.toMemberName}</span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">Gets Paid</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
              {t.toMemberName.charAt(0).toUpperCase()}
            </div>

            {onSettleUp && (
              <button
                type="button"
                onClick={() => onSettleUp(t)}
                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Settle Up
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

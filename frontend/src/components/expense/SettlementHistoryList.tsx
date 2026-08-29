import React, { useState } from 'react';
import { SettlementResponse } from '../../types';
import { api } from '../../services/api';
import { History, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface SettlementHistoryListProps {
  tripId: number;
  settlements: SettlementResponse[];
  onSettlementDeleted: () => void;
  currentUserId?: number;
  isOwner?: boolean;
}

export const SettlementHistoryList: React.FC<SettlementHistoryListProps> = ({
  tripId,
  settlements,
  onSettlementDeleted,
  currentUserId,
  isOwner = false,
}) => {
  const { formatDual } = useCurrency();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (settlements.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
        No settlement payments logged yet.
      </div>
    );
  }

  const handleDelete = async (settlementId: number) => {
    if (!window.confirm('Are you sure you want to delete this settlement record? Outstanding balances will automatically recalculate.')) {
      return;
    }

    try {
      setDeletingId(settlementId);
      await api.deleteSettlement(tripId, settlementId);
      onSettlementDeleted();
    } catch (err: any) {
      alert(err.message || 'Failed to delete settlement.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-2.5">
      {settlements.map((s) => {
        const canDelete = isOwner || (currentUserId && currentUserId === s.createdByUserId);

        return (
          <div
            key={s.id}
            className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 truncate">
                  <span>{s.payerMemberName}</span>
                  <ArrowRight size={12} className="text-slate-400 shrink-0" />
                  <span>{s.receiverMemberName}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                  <span>{s.settlementDate}</span>
                  {s.notes && <span className="italic truncate">• "{s.notes}"</span>}
                  <span>• Logged by {s.createdByName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="font-extrabold text-emerald-700 text-sm">
                {formatDual(s.amount, s.currency)}
              </span>

              {canDelete && (
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete settlement"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

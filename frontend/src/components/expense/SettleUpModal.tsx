import React, { useState, useEffect } from 'react';
import { TripMemberResponse, CreateSettlementRequest } from '../../types';
import { api } from '../../services/api';
import { X, Check, Scale, DollarSign, Calendar, FileText } from 'lucide-react';
import { Button } from '../common/UIComponents';
import { useCurrency } from '../../context/CurrencyContext';

interface SettleUpModalProps {
  tripId: number;
  members: TripMemberResponse[];
  initialPayerId?: number;
  initialReceiverId?: number;
  initialAmount?: number;
  isOpen: boolean;
  onClose: () => void;
  onSettlementSuccess: () => void;
}

export const SettleUpModal: React.FC<SettleUpModalProps> = ({
  tripId,
  members,
  initialPayerId,
  initialReceiverId,
  initialAmount,
  isOpen,
  onClose,
  onSettlementSuccess,
}) => {
  const { formatDual } = useCurrency();
  const [payerId, setPayerId] = useState<number>(initialPayerId || (members[0]?.id ?? 0));
  const [receiverId, setReceiverId] = useState<number>(
    initialReceiverId || (members.find((m) => m.id !== payerId)?.id ?? 0)
  );
  const [amount, setAmount] = useState<string>(initialAmount ? initialAmount.toString() : '');
  const [settlementDate, setSettlementDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialPayerId) setPayerId(initialPayerId);
      if (initialReceiverId) setReceiverId(initialReceiverId);
      if (initialAmount) setAmount(initialAmount.toString());
      setError(null);
    }
  }, [isOpen, initialPayerId, initialReceiverId, initialAmount]);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const originalSuggested = initialAmount || 0;
  const remainingAfterPayment = Math.max(0, originalSuggested - numericAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerId || !receiverId) {
      setError('Please select both payer and receiver.');
      return;
    }
    if (payerId === receiverId) {
      setError('Payer and receiver cannot be the same person.');
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const req: CreateSettlementRequest = {
        payerMemberId: payerId,
        receiverMemberId: receiverId,
        amount: numericAmount,
        currency: 'INR',
        settlementDate,
        notes: notes.trim() || undefined,
      };

      await api.createSettlement(tripId, req);
      onSettlementSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record settlement.');
    } finally {
      setLoading(false);
    }
  };

  const payerMember = members.find((m) => m.id === payerId);
  const receiverMember = members.find((m) => m.id === receiverId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Scale size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Record Settlement</h3>
              <p className="text-xs text-slate-500">Log a direct payment between trip members</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* Payer & Receiver selects */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                Payer (Who Paid)
              </label>
              <select
                value={payerId}
                onChange={(e) => setPayerId(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} {m.role === 'OWNER' ? '(Owner)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                Receiver (Paid To)
              </label>
              <select
                value={receiverId}
                onChange={(e) => setReceiverId(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} {m.role === 'OWNER' ? '(Owner)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
              Settlement Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-sm font-bold pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Partial Settlement Remaining Preview */}
          {originalSuggested > 0 && numericAmount > 0 && numericAmount < originalSuggested && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold block">Partial Settlement Preview</span>
              <span className="text-[11px] text-amber-800">
                Suggested debt was {formatDual(originalSuggested)}. Remaining debt after this payment: {' '}
                <strong className="text-amber-950">{formatDual(remainingAfterPayment)}</strong>.
              </span>
            </div>
          )}

          {/* Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                Date Paid
              </label>
              <input
                type="date"
                value={settlementDate}
                onChange={(e) => setSettlementDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                Notes / Payment Ref
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Google Pay / Cash"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              icon={<Check size={16} />}
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Mark as Paid'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  TripMemberResponse,
  ExpenseResponse,
  ExpenseCategory,
  SplitType,
  CreateExpenseRequest,
  ExpenseParticipantRequest,
} from '../../types';
import { api } from '../../services/api';
import { X, DollarSign, Calendar, Tag, User, Receipt, Plus, Check } from 'lucide-react';
import { Button, Card, Input } from '../common/UIComponents';

interface AddExpenseModalProps {
  tripId: number;
  members: TripMemberResponse[];
  activities?: { id: number; name: string }[];
  initialExpense?: ExpenseResponse;
  initialActivityId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  tripId,
  members,
  activities = [],
  initialExpense,
  initialActivityId,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialExpense?.title || '');
  const [amount, setAmount] = useState(initialExpense ? initialExpense.amount.toString() : '');
  const [category, setCategory] = useState<ExpenseCategory>(initialExpense?.category || 'OTHER');
  const [expenseDate, setExpenseDate] = useState(
    initialExpense?.expenseDate || new Date().toISOString().split('T')[0]
  );
  const [splitType, setSplitType] = useState<SplitType>(initialExpense?.splitType || 'EQUAL');
  const [payerMemberId, setPayerMemberId] = useState<number>(
    initialExpense?.payer ? initialExpense.payer.id : members[0]?.id || 0
  );
  const [tripActivityId, setTripActivityId] = useState<number | undefined>(
    initialExpense?.tripActivityId || initialActivityId
  );
  const [notes, setNotes] = useState(initialExpense?.notes || '');

  // Active members only for new expenses
  const activeMembers = members.filter((m) => m.status === 'ACTIVE');

  // Participant selection state: memberId -> { selected: boolean, shareAmount: string, percentage: string }
  const [participantState, setParticipantState] = useState<
    Record<number, { selected: boolean; shareAmount: string; percentage: string }>
  >(() => {
    const initMap: Record<number, { selected: boolean; shareAmount: string; percentage: string }> = {};
    if (initialExpense && initialExpense.participants) {
      members.forEach((m) => {
        const found = initialExpense.participants.find((p) => p.memberId === m.id);
        if (found) {
          initMap[m.id] = {
            selected: true,
            shareAmount: found.shareAmount.toString(),
            percentage: (
              (found.shareAmount / initialExpense.amount) *
              100
            ).toFixed(2),
          };
        } else {
          initMap[m.id] = { selected: false, shareAmount: '', percentage: '' };
        }
      });
    } else {
      activeMembers.forEach((m) => {
        initMap[m.id] = { selected: true, shareAmount: '', percentage: '' };
      });
    }
    return initMap;
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleParticipant = (memberId: number) => {
    setParticipantState((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        selected: !prev[memberId]?.selected,
      },
    }));
  };

  const handleParticipantChange = (
    memberId: number,
    field: 'shareAmount' | 'percentage',
    val: string
  ) => {
    setParticipantState((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: val,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid expense amount greater than zero.');
      return;
    }

    if (!title.trim()) {
      setError('Expense title is required.');
      return;
    }

    if (!payerMemberId) {
      setError('Please select who paid the bill.');
      return;
    }

    const selectedMembers = Object.entries(participantState)
      .filter(([_, v]) => v.selected)
      .map(([k]) => parseInt(k, 10));

    if (selectedMembers.length === 0) {
      setError('At least one participant must be selected.');
      return;
    }

    // Build participant requests
    const participantRequests: ExpenseParticipantRequest[] = [];
    if (splitType === 'EXACT') {
      let totalExact = 0;
      for (const mId of selectedMembers) {
        const val = parseFloat(participantState[mId]?.shareAmount || '0');
        if (isNaN(val) || val < 0) {
          setError('Please enter valid exact share amounts for all participants.');
          return;
        }
        totalExact += val;
        participantRequests.push({ memberId: mId, shareAmount: val });
      }
      if (Math.abs(totalExact - parsedAmount) > 0.01) {
        setError(
          `Sum of exact shares (₹${totalExact.toFixed(2)}) must equal total amount (₹${parsedAmount.toFixed(2)}).`
        );
        return;
      }
    } else if (splitType === 'PERCENTAGE') {
      let totalPct = 0;
      for (const mId of selectedMembers) {
        const val = parseFloat(participantState[mId]?.percentage || '0');
        if (isNaN(val) || val <= 0) {
          setError('Please enter valid percentage shares greater than zero.');
          return;
        }
        totalPct += val;
        participantRequests.push({ memberId: mId, percentage: val });
      }
      if (Math.abs(totalPct - 100.0) > 0.01) {
        setError(`Sum of percentage shares (${totalPct.toFixed(2)}%) must equal 100%.`);
        return;
      }
    } else {
      // EQUAL
      for (const mId of selectedMembers) {
        participantRequests.push({ memberId: mId });
      }
    }

    const payload: CreateExpenseRequest = {
      title: title.trim(),
      amount: parsedAmount,
      currency: 'INR',
      category,
      expenseDate,
      splitType,
      payerMemberId,
      tripActivityId: tripActivityId || undefined,
      notes: notes.trim() || undefined,
      participants: participantRequests,
    };

    try {
      setSubmitting(true);
      if (initialExpense) {
        await api.updateExpense(tripId, initialExpense.id, payload);
      } else {
        await api.createExpense(tripId, payload);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-xl bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 space-y-5 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {initialExpense ? 'Edit Expense' : 'Log New Expense / Bill'}
              </h3>
              <p className="text-xs text-slate-500">Record shared expenses, activity bills, or custom receipts.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Expense Title *"
                placeholder="e.g. Dinner at Chokhi Dhani"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Total Amount (₹) *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date, Category, Payer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Input
                label="Expense Date *"
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="FOOD">Food & Dining</option>
                <option value="TRANSPORT">Transport</option>
                <option value="ACCOMMODATION">Accommodation</option>
                <option value="ACTIVITIES">Activities</option>
                <option value="TICKETS">Tickets & Entry</option>
                <option value="SHOPPING">Shopping</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Paid By *</label>
              <select
                value={payerMemberId}
                onChange={(e) => setPayerMemberId(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} {m.role === 'OWNER' ? '(Owner)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Activity Link */}
          {activities.length > 0 && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Link to Activity (Optional)</label>
              <select
                value={tripActivityId || ''}
                onChange={(e) => setTripActivityId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Custom Expense (Not Linked) --</option>
                {activities.map((act) => (
                  <option key={act.id} value={act.id}>
                    🏰 {act.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Split Type Switcher */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Split Type</label>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs">
              {(['EQUAL', 'EXACT', 'PERCENTAGE'] as SplitType[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSplitType(st)}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    splitType === st
                      ? 'bg-white text-emerald-800 shadow-2xs border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'EQUAL' ? 'Split Equally' : st === 'EXACT' ? 'Exact Amounts' : 'By Percentage'}
                </button>
              ))}
            </div>
          </div>

          {/* Participants Selection & Calculator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                Split Participants ({Object.values(participantState).filter((p) => p.selected).length})
              </label>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-48 overflow-y-auto bg-slate-50/50">
              {members.map((m) => {
                const isSel = participantState[m.id]?.selected || false;
                return (
                  <div key={m.id} className="p-2.5 flex items-center justify-between gap-3 bg-white">
                    <label className="flex items-center space-x-2.5 cursor-pointer min-w-0">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => handleToggleParticipant(m.id)}
                        className="rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-bold text-slate-900 truncate">{m.fullName}</span>
                      {m.role === 'OWNER' && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1 rounded">
                          Owner
                        </span>
                      )}
                    </label>

                    {isSel && splitType === 'EXACT' && (
                      <div className="flex items-center space-x-1 w-28">
                        <span className="text-slate-400">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={participantState[m.id]?.shareAmount || ''}
                          onChange={(e) => handleParticipantChange(m.id, 'shareAmount', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded-lg text-right font-bold text-slate-900"
                        />
                      </div>
                    )}

                    {isSel && splitType === 'PERCENTAGE' && (
                      <div className="flex items-center space-x-1 w-24">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          value={participantState[m.id]?.percentage || ''}
                          onChange={(e) => handleParticipantChange(m.id, 'percentage', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded-lg text-right font-bold text-slate-900"
                        />
                        <span className="text-slate-500 font-bold">%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via UPI, includes 5% GST"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="emerald" size="md" loading={submitting} disabled={submitting}>
              {initialExpense ? 'Save Changes' : 'Log Expense'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

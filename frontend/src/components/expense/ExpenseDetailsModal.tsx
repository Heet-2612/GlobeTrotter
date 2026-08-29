import React from 'react';
import { ExpenseResponse } from '../../types';
import { X, Calendar, DollarSign, User, Users, Receipt, Shield, Tag, CreditCard } from 'lucide-react';
import { Button, Card, Badge } from '../common/UIComponents';
import { useCurrency } from '../../context/CurrencyContext';

interface ExpenseDetailsModalProps {
  expense: ExpenseResponse;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

export const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({
  expense,
  onClose,
  onEdit,
  onDelete,
  canEdit = false,
}) => {
  const { formatDual } = useCurrency();
  const isMultiPayer = expense.isMultiplePayers && expense.payers && expense.payers.length > 1;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 space-y-5 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Badge variant="emerald" className="text-[10px] uppercase font-extrabold">
                {expense.category}
              </Badge>
              {expense.isActivityLinked && (
                <Badge variant="indigo" className="text-[10px] uppercase font-extrabold">
                  Activity Bill
                </Badge>
              )}
              {isMultiPayer && (
                <Badge variant="amber" className="text-[10px] uppercase font-extrabold">
                  Multiple Payers
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{expense.title}</h3>
            {expense.activityName && (
              <p className="text-xs text-indigo-700 font-medium mt-0.5">
                Linked to: {expense.activityName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Total Amount & Primary Payer summary */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Total Amount</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {formatDual(expense.amount, expense.currency)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500 uppercase">
              {isMultiPayer ? 'Payment Source' : 'Paid By'}
            </div>
            <div className="text-sm font-bold text-emerald-800 flex items-center justify-end space-x-1.5 mt-0.5">
              {isMultiPayer ? (
                <>
                  <Users size={14} className="text-emerald-600" />
                  <span>{expense.payers?.length} Contributors</span>
                </>
              ) : (
                <>
                  <User size={14} className="text-emerald-600" />
                  <span>{expense.payer ? expense.payer.fullName : 'Unknown'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Multi-Payer Breakdown if applicable */}
        {isMultiPayer && expense.payers && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard size={13} className="text-emerald-600" />
              Paid By ({expense.payers.length} Payers)
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {expense.payers.map((payer) => (
                <div key={payer.memberId} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                      {payer.memberFullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{payer.memberFullName}</span>
                  </div>
                  <span className="font-extrabold text-emerald-700">
                    {formatDual(payer.paidAmount, expense.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Calendar size={13} /> Date
            </span>
            <span className="font-bold text-slate-800 block">{expense.expenseDate}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Tag size={13} /> Split Method
            </span>
            <span className="font-bold text-slate-800 block uppercase">{expense.splitType}</span>
          </div>
        </div>

        {/* Notes if present */}
        {expense.notes && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-0.5">Notes:</span>
            {expense.notes}
          </div>
        )}

        {/* Participant Share Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Split Breakdown ({expense.participants.length} Participant{expense.participants.length !== 1 ? 's' : ''})
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {expense.participants.map((part) => (
              <div key={part.id} className="p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                    {part.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900">{part.fullName}</span>
                  {part.isGtUser && (
                    <span className="text-[10px] text-indigo-600 font-medium">GT User</span>
                  )}
                </div>
                <span className="font-extrabold text-slate-900">
                  {formatDual(part.shareAmount, expense.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {canEdit && onDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-rose-600 hover:bg-rose-50 border-rose-200"
              >
                Delete Expense
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            {canEdit && onEdit && (
              <Button type="button" variant="emerald" size="sm" onClick={onEdit}>
                Edit Expense
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

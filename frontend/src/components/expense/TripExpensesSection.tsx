import React, { useState, useEffect } from 'react';
import { ExpenseResponse, TripMemberResponse, ExpenseCategory } from '../../types';
import { api } from '../../services/api';
import { Receipt, Plus, Tag, Calendar, User, Eye, Edit3, Trash2, Compass, Filter } from 'lucide-react';
import { Button, Card, Badge } from '../common/UIComponents';
import { useCurrency } from '../../context/CurrencyContext';
import { ExpenseDetailsModal } from './ExpenseDetailsModal';
import { AddExpenseModal } from './AddExpenseModal';
import { TripBalanceSection } from './TripBalanceSection';

interface TripExpensesSectionProps {
  tripId: number;
  members: TripMemberResponse[];
  isOwner?: boolean;
  currentUserId?: number;
  activities?: { id: number; name: string }[];
}

export const TripExpensesSection: React.FC<TripExpensesSectionProps> = ({
  tripId,
  members,
  isOwner = true,
  currentUserId,
  activities = [],
}) => {
  const { formatDual } = useCurrency();
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal states
  const [selectedExpenseForDetails, setSelectedExpenseForDetails] = useState<ExpenseResponse | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseResponse | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTripExpenses(tripId);
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the expense "${title}"?`)) {
      return;
    }
    try {
      await api.deleteExpense(tripId, expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      if (selectedExpenseForDetails?.id === expenseId) {
        setSelectedExpenseForDetails(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory === 'ALL') return true;
    return e.category === selectedCategory;
  });

  const activityLinkedExpenses = filteredExpenses.filter((e) => e.isActivityLinked);
  const customExpenses = filteredExpenses.filter((e) => !e.isActivityLinked);

  return (
    <div className="space-y-6">
      {/* PHASE 3 & 4 BALANCE, SETTLEMENTS & WHO OWES WHOM SECTION */}
      <TripBalanceSection
        tripId={tripId}
        members={members}
        isOwner={isOwner}
        currentUserId={currentUserId}
      />
      {/* Header & Total Card */}
      <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Trip Expenses & Activity Bills</h3>
              <p className="text-xs text-slate-500">
                Log shared travel receipts, entry tickets, dining, and activity bills.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="emerald"
            size="md"
            icon={<Plus size={16} />}
            onClick={() => {
              setExpenseToEdit(null);
              setShowAddModal(true);
            }}
          >
            + Log Expense
          </Button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter size={13} /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Receipts' },
            { id: 'FOOD', label: 'Food & Dining' },
            { id: 'TRANSPORT', label: 'Transport' },
            { id: 'ACCOMMODATION', label: 'Accommodation' },
            { id: 'ACTIVITIES', label: 'Activities' },
            { id: 'TICKETS', label: 'Tickets' },
            { id: 'SHOPPING', label: 'Shopping' },
            { id: 'OTHER', label: 'Other' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
          {error}
        </div>
      )}

      {/* Expenses Feed */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs font-medium">Loading expenses...</div>
      ) : filteredExpenses.length === 0 ? (
        <Card className="p-12 text-center space-y-3 bg-white border border-slate-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Receipt size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base">No expenses logged yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first shared receipt or activity bill to start splitting costs among companions.
            </p>
          </div>
          <Button
            type="button"
            variant="emerald"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowAddModal(true)}
          >
            Log First Expense
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1 — ACTIVITY-LINKED BILLS */}
          {activityLinkedExpenses.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Compass size={14} className="text-indigo-600" />
                Activity Bills ({activityLinkedExpenses.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activityLinkedExpenses.map((expense) => {
                  const canModify =
                    isOwner || (currentUserId && expense.createdByUserId === currentUserId);

                  return (
                    <div
                      key={expense.id}
                      onClick={() => setSelectedExpenseForDetails(expense)}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge variant="indigo" className="text-[10px] uppercase font-extrabold mb-1">
                            🏰 {expense.activityName || 'Activity Bill'}
                          </Badge>
                          <h5 className="font-bold text-slate-900 text-sm">{expense.title}</h5>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900 block">
                            {formatDual(expense.amount, expense.currency)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase">
                            {expense.splitType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <User size={13} className="text-emerald-600" />
                          <span>Paid by <strong className="text-slate-800">{expense.payer?.fullName}</strong></span>
                        </div>
                        <span className="text-[11px] text-slate-400">{expense.expenseDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2 — CUSTOM EXPENSES */}
          {customExpenses.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Receipt size={14} className="text-emerald-600" />
                Custom Expenses ({customExpenses.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customExpenses.map((expense) => {
                  return (
                    <div
                      key={expense.id}
                      onClick={() => setSelectedExpenseForDetails(expense)}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge variant="emerald" className="text-[10px] uppercase font-extrabold mb-1">
                            {expense.category}
                          </Badge>
                          <h5 className="font-bold text-slate-900 text-sm">{expense.title}</h5>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900 block">
                            {formatDual(expense.amount, expense.currency)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase">
                            {expense.splitType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <User size={13} className="text-emerald-600" />
                          <span>Paid by <strong className="text-slate-800">{expense.payer?.fullName}</strong></span>
                        </div>
                        <span className="text-[11px] text-slate-400">{expense.expenseDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedExpenseForDetails && (
        <ExpenseDetailsModal
          expense={selectedExpenseForDetails}
          onClose={() => setSelectedExpenseForDetails(null)}
          canEdit={
            isOwner ||
            (currentUserId !== undefined &&
              selectedExpenseForDetails.createdByUserId === currentUserId)
          }
          onEdit={() => {
            setExpenseToEdit(selectedExpenseForDetails);
            setSelectedExpenseForDetails(null);
            setShowAddModal(true);
          }}
          onDelete={() => handleDeleteExpense(selectedExpenseForDetails.id, selectedExpenseForDetails.title)}
        />
      )}

      {/* Add / Edit Expense Modal */}
      {showAddModal && (
        <AddExpenseModal
          tripId={tripId}
          members={members}
          activities={activities}
          initialExpense={expenseToEdit || undefined}
          onClose={() => {
            setShowAddModal(false);
            setExpenseToEdit(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setExpenseToEdit(null);
            fetchExpenses();
          }}
        />
      )}
    </div>
  );
};

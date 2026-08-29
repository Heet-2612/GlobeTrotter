import React, { useState, useEffect, useCallback } from 'react';
import { TripAnalyticsResponse, TripMemberResponse, ExpenseCategory } from '../../types';
import { api } from '../../services/api';
import { AnalyticsOverviewCards } from './AnalyticsOverviewCards';
import { CategorySpendingBar } from './CategorySpendingBar';
import { MemberSpendingTable } from './MemberSpendingTable';
import { BudgetComparisonCard } from './BudgetComparisonCard';
import { SpendingTimelineChart } from './SpendingTimelineChart';
import { Card, Button, Input } from '../common/UIComponents';
import {
  BarChart3,
  RefreshCw,
  AlertCircle,
  Filter,
  RotateCcw,
  Calendar,
  Tag,
  User as UserIcon,
  Layers,
  Search,
} from 'lucide-react';

interface TripAnalyticsSectionProps {
  tripId: number;
}

const CATEGORIES: { label: string; value: ExpenseCategory }[] = [
  { label: 'Food & Dining', value: 'FOOD' },
  { label: 'Transport', value: 'TRANSPORT' },
  { label: 'Accommodation', value: 'ACCOMMODATION' },
  { label: 'Tickets & Entry', value: 'TICKETS' },
  { label: 'Activities', value: 'ACTIVITY' },
  { label: 'Shopping', value: 'SHOPPING' },
  { label: 'Other', value: 'OTHER' },
];

export const TripAnalyticsSection: React.FC<TripAnalyticsSectionProps> = ({ tripId }) => {
  const [analytics, setAnalytics] = useState<TripAnalyticsResponse | null>(null);
  const [members, setMembers] = useState<TripMemberResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtering, setFiltering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [dateRangeMode, setDateRangeMode] = useState<'ALL' | 'CUSTOM'>('ALL');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  // Fetch Trip Members for the member dropdown
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const memberList = await api.getTripMembers(tripId);
        setMembers(memberList);
      } catch {
        // Non-blocking fallback
        setMembers([]);
      }
    };
    loadMembers();
  }, [tripId]);

  const fetchAnalytics = useCallback(
    async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        } else {
          setFiltering(true);
        }
        setError(null);

        const params: {
          from?: string;
          to?: string;
          category?: string;
          memberId?: number;
          source?: string;
        } = {};

        if (dateRangeMode === 'CUSTOM') {
          if (fromDate) params.from = fromDate;
          if (toDate) params.to = toDate;
        }
        if (selectedCategory) params.category = selectedCategory;
        if (selectedMemberId) params.memberId = parseInt(selectedMemberId, 10);
        if (selectedSource && selectedSource !== 'ALL') params.source = selectedSource;

        const data = await api.getTripAnalytics(tripId, params);
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load trip analytics');
      } finally {
        setLoading(false);
        setFiltering(false);
      }
    },
    [tripId, dateRangeMode, fromDate, toDate, selectedCategory, selectedMemberId, selectedSource]
  );

  useEffect(() => {
    fetchAnalytics(true);
  }, [tripId]);

  // Trigger recalculation when dropdown filters change
  const handleApplyFilters = () => {
    fetchAnalytics(false);
  };

  const handleResetFilters = () => {
    setDateRangeMode('ALL');
    setFromDate('');
    setToDate('');
    setSelectedCategory('');
    setSelectedMemberId('');
    setSelectedSource('ALL');

    // Trigger instant fetch with cleared params
    setFiltering(true);
    api
      .getTripAnalytics(tripId)
      .then((data) => {
        setAnalytics(data);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to reset analytics');
      })
      .finally(() => setFiltering(false));
  };

  const hasActiveFilters =
    dateRangeMode === 'CUSTOM' ||
    Boolean(selectedCategory) ||
    Boolean(selectedMemberId) ||
    selectedSource !== 'ALL';

  if (loading) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Computing trip financial analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Unable to Load Trip Analytics</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {error || 'An unexpected error occurred while fetching financial data.'}
          </p>
        </div>
        <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={() => fetchAnalytics(false)}>
          Retry Analytics
        </Button>
      </Card>
    );
  }

  const { overview, categoryBreakdown, memberBreakdown, budgetComparison, timeline, currency } = analytics;

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Financial Analytics Dashboard</h3>
            <p className="text-xs text-slate-500">
              Filtered group spending, budget variance, category distributions, and member contributions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Filter size={11} /> Filters Active
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={13} className={filtering ? 'animate-spin' : ''} />}
            onClick={() => fetchAnalytics(false)}
            disabled={filtering}
            className="text-xs"
          >
            {filtering ? 'Applying...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* 2. ANALYTICS FILTER BAR */}
      <Card className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Filter size={16} className="text-emerald-600" />
            <span>Filter Spending & Insights</span>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw size={12} />}
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:bg-rose-50"
              >
                Reset Filters
              </Button>
            )}
            <Button
              variant="emerald"
              size="sm"
              icon={<Search size={13} />}
              onClick={handleApplyFilters}
              disabled={filtering}
              loading={filtering}
              className="text-xs font-semibold"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filter 1: Date Range */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar size={13} className="text-emerald-600" />
              Date Range
            </label>
            <select
              value={dateRangeMode}
              onChange={(e) => setDateRangeMode(e.target.value as 'ALL' | 'CUSTOM')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="ALL">All Time (Entire Trip)</option>
              <option value="CUSTOM">Custom Date Range</option>
            </select>

            {dateRangeMode === 'CUSTOM' && (
              <div className="grid grid-cols-2 gap-2 pt-1.5 animate-fadeIn">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">From</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">To</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filter 2: Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Tag size={13} className="text-emerald-600" />
              Expense Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 3: Member / Payer */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserIcon size={13} className="text-emerald-600" />
              Member / Payer
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} {m.role === 'OWNER' ? '(Owner)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Expense Source */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers size={13} className="text-emerald-600" />
              Expense Source
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="ALL">All Expenses</option>
              <option value="ACTIVITY_LINKED">Activity-linked Only</option>
              <option value="CUSTOM">Custom Expenses Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 3. Empty State when Filtered Expenses = 0 */}
      {overview.expenseCount === 0 ? (
        <Card className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Filter size={28} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No Expenses Match Selected Filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No trip expenses were found matching your active filter criteria. Try adjusting or clearing your date range,
              category, or member filters.
            </p>
          </div>
          <Button variant="outline" size="sm" icon={<RotateCcw size={14} />} onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <>
          {/* 4. OVERVIEW CARDS */}
          <AnalyticsOverviewCards overview={overview} currency={currency} />

          {/* 5. BUDGET COMPARISON */}
          <BudgetComparisonCard budgetComparison={budgetComparison} currency={currency} />

          {/* 6. CATEGORY SPENDING & MEMBER CONTRIBUTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <CategorySpendingBar categories={categoryBreakdown} currency={currency} />
            </div>
            <div className="lg:col-span-7">
              <MemberSpendingTable members={memberBreakdown} currency={currency} />
            </div>
          </div>

          {/* 7. DAILY SPENDING TIMELINE */}
          <SpendingTimelineChart timeline={timeline} currency={currency} />
        </>
      )}
    </div>
  );
};

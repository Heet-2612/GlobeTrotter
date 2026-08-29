import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminUserListItemResponse, AdminUserDetailResponse, AdminUserListPageResponse } from '../../types';
import { Card, Button, Input } from '../common/UIComponents';
import {
  Users,
  Search,
  X,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
  Calendar,
  DollarSign,
  Globe,
  MapPin,
  Compass,
  Lock,
  Eye,
  Info,
} from 'lucide-react';

export const AdminUsersSection: React.FC = () => {
  const [usersPage, setUsersPage] = useState<AdminUserListPageResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [authProviderFilter, setAuthProviderFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);

  // Selected User Detail Modal State
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0); // reset to first page on search change
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminUsers({
        page: currentPage,
        size: pageSize,
        search: debouncedSearch,
        authProvider: authProviderFilter,
      });
      setUsersPage(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, debouncedSearch, authProviderFilter]);

  const handleOpenDetail = async (userId: number) => {
    setSelectedUserId(userId);
    setSelectedUserDetail(null);
    setDetailError(null);
    try {
      setDetailLoading(true);
      const detail = await api.getAdminUserDetail(userId);
      setSelectedUserDetail(detail);
    } catch (err: any) {
      setDetailError(err.message || 'Failed to load user details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedUserId(null);
    setSelectedUserDetail(null);
    setDetailError(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Section Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              User Directory & Accounts
            </h2>
            <p className="text-xs text-slate-500">
              Read-only view of registered travelers across GlobeTrotter
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Auth Provider Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {['ALL', 'LOCAL', 'GOOGLE'].map((provider) => (
              <button
                key={provider}
                onClick={() => {
                  setAuthProviderFilter(provider);
                  setCurrentPage(0);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  authProviderFilter === provider
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {provider === 'ALL' ? 'All Providers' : provider === 'LOCAL' ? 'Local Password' : 'Google OAuth'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={13} />}
            onClick={loadUsers}
            disabled={loading}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* 2. Error State */}
      {error && (
        <Card className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={loadUsers} className="text-xs text-rose-700">
            Retry
          </Button>
        </Card>
      )}

      {/* 3. User Table Card */}
      <Card className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {usersPage ? (
              <>
                Showing <strong className="text-slate-900">{usersPage.content.length}</strong> of{' '}
                <strong className="text-slate-900">{usersPage.totalElements}</strong> registered users
              </>
            ) : (
              'Loading directory...'
            )}
          </span>
          <div className="flex items-center space-x-2">
            <span>Page size:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Fetching user accounts...</p>
          </div>
        ) : !usersPage || usersPage.content.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No users found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered user accounts match the current search or provider criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <th className="py-3.5 px-6">User / Traveler</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Auth Method</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {usersPage.content.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {u.profilePhoto ? (
                            <img
                              src={u.profilePhoto}
                              alt={u.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            u.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            ID #{u.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.authProvider === 'GOOGLE'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {u.authProvider === 'GOOGLE' ? 'Google OAuth' : 'Local Password'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.admin ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <ShieldCheck size={11} />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">Traveler</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={12} />}
                        onClick={() => handleOpenDetail(u.id)}
                        className="text-xs"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {usersPage && usersPage.totalPages > 1 && (
          <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Page <strong className="text-slate-900">{usersPage.page + 1}</strong> of{' '}
              <strong className="text-slate-900">{usersPage.totalPages}</strong>
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronLeft size={13} />}
                disabled={!usersPage.hasPrevious}
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronRight size={13} />}
                disabled={!usersPage.hasNext}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 4. Read-Only User Details Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl max-w-xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">User Account Profile</h3>
                  <p className="text-xs text-slate-500">Read-only account inspection</p>
                </div>
              </div>
              <button
                onClick={handleCloseDetail}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {detailLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Loading user details...</p>
              </div>
            ) : detailError ? (
              <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-2xl">
                {detailError}
              </div>
            ) : selectedUserDetail ? (
              <div className="space-y-5">
                {/* User Identity Banner */}
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-base flex items-center justify-center shrink-0">
                    {selectedUserDetail.profilePhoto ? (
                      <img
                        src={selectedUserDetail.profilePhoto}
                        alt={selectedUserDetail.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      selectedUserDetail.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-base truncate">
                        {selectedUserDetail.name}
                      </h4>
                      {selectedUserDetail.admin && (
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                          Platform Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono truncate">{selectedUserDetail.email}</p>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                      User ID
                    </span>
                    <span className="font-bold font-mono text-slate-800">#{selectedUserDetail.id}</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                      Auth Provider
                    </span>
                    <span className="font-bold text-slate-800">{selectedUserDetail.authProvider}</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                      Preferred Currency
                    </span>
                    <span className="font-bold text-slate-800">{selectedUserDetail.preferredCurrency || 'INR'}</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                      Language
                    </span>
                    <span className="font-bold text-slate-800">{selectedUserDetail.languagePreference || 'en'}</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                      Created At
                    </span>
                    <span className="font-bold text-slate-800">{formatDate(selectedUserDetail.createdAt)}</span>
                  </div>

                  <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                      Last Updated
                    </span>
                    <span className="font-bold text-slate-800">{formatDate(selectedUserDetail.updatedAt)}</span>
                  </div>
                </div>

                {/* Trips / Engagement Metric Cards */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                    <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-800">
                      <Compass size={13} />
                      <span>Trips Created</span>
                    </div>
                    <div className="text-xl font-black text-emerald-950 mt-1">
                      {selectedUserDetail.tripsCreatedCount}
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                    <div className="flex items-center space-x-1.5 text-[11px] font-bold text-blue-800">
                      <Users size={13} />
                      <span>Trip Memberships</span>
                    </div>
                    <div className="text-xl font-black text-blue-950 mt-1">
                      {selectedUserDetail.tripMembershipsCount}
                    </div>
                  </div>
                </div>

                {/* Read-Only Safety Notice */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start space-x-2 text-slate-500 text-[11px]">
                  <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <span>
                    Read-only platform inspection. Sensitive credentials (passwords, JWTs, OAuth tokens) are never exposed.
                  </span>
                </div>
              </div>
            ) : null}

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCloseDetail}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { TripBalanceResponse, SettlementResponse, DebtTransferResponse, TripMemberResponse } from '../../types';
import { api } from '../../services/api';
import { Scale, RefreshCw, CheckCircle2, ArrowUpRight, ArrowDownLeft, Users, Receipt, History } from 'lucide-react';
import { Card, Badge, Button } from '../common/UIComponents';
import { useCurrency } from '../../context/CurrencyContext';
import { MemberBalanceCard } from './MemberBalanceCard';
import { WhoOwesWhom } from './WhoOwesWhom';
import { SettleUpModal } from './SettleUpModal';
import { SettlementHistoryList } from './SettlementHistoryList';

interface TripBalanceSectionProps {
  tripId: number;
  members?: TripMemberResponse[];
  currentUserId?: number;
  isOwner?: boolean;
}

export const TripBalanceSection: React.FC<TripBalanceSectionProps> = ({
  tripId,
  members = [],
  currentUserId,
  isOwner = false,
}) => {
  const { formatDual } = useCurrency();
  const [balanceData, setBalanceData] = useState<TripBalanceResponse | null>(null);
  const [settlements, setSettlements] = useState<SettlementResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settle Up modal state
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedPayerId, setSelectedPayerId] = useState<number | undefined>(undefined);
  const [selectedReceiverId, setSelectedReceiverId] = useState<number | undefined>(undefined);
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [balData, stData] = await Promise.all([
        api.getTripBalances(tripId),
        api.getTripSettlements(tripId).catch(() => []),
      ]);
      setBalanceData(balData);
      setSettlements(stData);
    } catch (err: any) {
      setError(err.message || 'Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleUpTransfer = (transfer: DebtTransferResponse) => {
    setSelectedPayerId(transfer.fromMemberId);
    setSelectedReceiverId(transfer.toMemberId);
    setSelectedAmount(transfer.amount);
    setShowSettleModal(true);
  };

  const handleOpenGeneralSettleUp = () => {
    setSelectedPayerId(undefined);
    setSelectedReceiverId(undefined);
    setSelectedAmount(undefined);
    setShowSettleModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-slate-400 text-xs font-medium">
        Calculating balances...
      </div>
    );
  }

  if (error || !balanceData) {
    return (
      <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
        {error || 'Failed to load balance summary'}
      </div>
    );
  }

  const { totalTripExpenses, memberBalances, simplifiedTransfers, myBalanceSummary, currency } = balanceData;

  let myCalloutBg = 'bg-slate-50 border-slate-200 text-slate-900';
  let myIcon = <CheckCircle2 className="text-slate-600 shrink-0" size={20} />;

  if (myBalanceSummary) {
    if (myBalanceSummary.balanceStatus === 'GETS_BACK') {
      myCalloutBg = 'bg-emerald-50/80 border-emerald-200 text-emerald-950';
      myIcon = <ArrowUpRight className="text-emerald-600 shrink-0" size={22} />;
    } else if (myBalanceSummary.balanceStatus === 'OWES') {
      myCalloutBg = 'bg-rose-50/80 border-rose-200 text-rose-950';
      myIcon = <ArrowDownLeft className="text-rose-600 shrink-0" size={22} />;
    }
  }

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-6">
      {/* Top Banner: Total Spent & My Balance Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Spent */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Trip Spent</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {formatDual(totalTripExpenses, currency)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-200/70 text-slate-700 flex items-center justify-center font-bold">
            <Receipt size={20} />
          </div>
        </div>

        {/* My Balance Summary Callout */}
        {myBalanceSummary && (
          <div className={`md:col-span-2 p-4 rounded-2xl border ${myCalloutBg} flex items-center justify-between gap-4`}>
            <div className="flex items-center space-x-3">
              {myIcon}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block text-slate-500">
                  Your Balance
                </span>
                <span className="text-lg font-black text-slate-900 block">
                  {myBalanceSummary.summaryMessage}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <Button
                type="button"
                variant="emerald"
                size="sm"
                onClick={handleOpenGeneralSettleUp}
              >
                + Record Payment
              </Button>
              <button
                type="button"
                onClick={fetchData}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Refresh balances"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Transfers Section (Who Owes Whom) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Scale size={14} className="text-emerald-600" />
            Who Owes Whom ({simplifiedTransfers.length} Transfer{simplifiedTransfers.length !== 1 ? 's' : ''})
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">Simplified Minimum-Flow Settlements</span>
        </div>
        <WhoOwesWhom transfers={simplifiedTransfers} currency={currency} onSettleUp={handleSettleUpTransfer} />
      </div>

      {/* Member Balances Breakdown Grid */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
          <Users size={14} className="text-indigo-600" />
          Individual Member Balances ({memberBalances.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {memberBalances.map((m) => (
            <MemberBalanceCard key={m.memberId} member={m} currency={currency} />
          ))}
        </div>
      </div>

      {/* Settlement History Section */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <History size={14} className="text-emerald-600" />
            Settlement History ({settlements.length})
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">Recorded Direct Payments</span>
        </div>
        <SettlementHistoryList
          tripId={tripId}
          settlements={settlements}
          onSettlementDeleted={fetchData}
          currentUserId={currentUserId}
          isOwner={isOwner}
        />
      </div>

      {/* Settle Up Modal */}
      <SettleUpModal
        tripId={tripId}
        members={members}
        initialPayerId={selectedPayerId}
        initialReceiverId={selectedReceiverId}
        initialAmount={selectedAmount}
        isOpen={showSettleModal}
        onClose={() => setShowSettleModal(false)}
        onSettlementSuccess={fetchData}
      />
    </Card>
  );
};

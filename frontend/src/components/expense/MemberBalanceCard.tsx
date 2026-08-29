import React from 'react';
import { MemberBalanceResponse } from '../../types';
import { Badge } from '../common/UIComponents';
import { useCurrency } from '../../context/CurrencyContext';
import { User, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';

interface MemberBalanceCardProps {
  member: MemberBalanceResponse;
  currency?: string;
}

export const MemberBalanceCard: React.FC<MemberBalanceCardProps> = ({ member, currency = 'INR' }) => {
  const { formatDual } = useCurrency();
  const isInactive = member.memberStatus === 'INACTIVE';

  let badgeVariant: 'emerald' | 'rose' | 'slate' = 'slate';
  let badgeLabel = 'Settled up';
  let Icon = CheckCircle2;

  if (member.balanceStatus === 'GETS_BACK') {
    badgeVariant = 'emerald';
    badgeLabel = `Gets back ${formatDual(Math.abs(member.netBalance), currency)}`;
    Icon = ArrowUpRight;
  } else if (member.balanceStatus === 'OWES') {
    badgeVariant = 'rose';
    badgeLabel = `Owes ${formatDual(Math.abs(member.netBalance), currency)}`;
    Icon = ArrowDownLeft;
  }

  return (
    <div
      className={`p-4 rounded-2xl bg-white border transition-all ${
        isInactive ? 'border-slate-200 bg-slate-50/70 opacity-80' : 'border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
            {member.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-sm truncate">{member.fullName}</span>
              {member.role === 'OWNER' && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1 py-0.5 rounded uppercase shrink-0">
                  Owner
                </span>
              )}
              {isInactive && (
                <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1 py-0.5 rounded uppercase shrink-0">
                  Inactive
                </span>
              )}
            </div>
            {member.isGtUser ? (
              <span className="text-[10px] text-indigo-600 font-medium block">GlobeTrotter User</span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium block">Guest Contributor</span>
            )}
          </div>
        </div>

        <Badge variant={badgeVariant} className="text-[10px] uppercase font-extrabold flex items-center gap-1 shrink-0">
          <Icon size={12} />
          {badgeLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase block">Paid Upfront</span>
          <span className="font-bold text-slate-800">{formatDual(member.totalPaid, currency)}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Share</span>
          <span className="font-bold text-slate-800">{formatDual(member.totalOwed, currency)}</span>
        </div>
      </div>
    </div>
  );
};

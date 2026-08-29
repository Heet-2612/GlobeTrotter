import React from 'react';
import { MemberAnalytics } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card, Badge } from '../common/UIComponents';
import { Users, User, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';

interface MemberSpendingTableProps {
  members: MemberAnalytics[];
  currency: string;
}

export const MemberSpendingTable: React.FC<MemberSpendingTableProps> = ({
  members,
  currency,
}) => {
  const { formatDual } = useCurrency();

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Member Contribution & Share</h4>
            <p className="text-[11px] text-slate-500">
              Comparison between money paid upfront vs personal consumption share
            </p>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-600">No member analytics available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pr-4">Member</th>
                <th className="pb-3 px-3 text-right">Paid Upfront</th>
                <th className="pb-3 px-3 text-right">Personal Share</th>
                <th className="pb-3 px-3 text-right">Expense Net</th>
                <th className="pb-3 pl-3 text-right">Final Net Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => {
                const isPositive = m.finalNetBalance > 0.005;
                const isNegative = m.finalNetBalance < -0.005;
                const isSettled = !isPositive && !isNegative;

                return (
                  <tr key={m.memberId} className="hover:bg-slate-50/60 transition-colors">
                    {/* 1. Member Info */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                          {m.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                            <span>{m.fullName}</span>
                            {!m.isGtUser && (
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                Guest
                              </span>
                            )}
                            {m.memberStatus === 'INACTIVE' && (
                              <span className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.2 rounded font-medium">
                                Inactive
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Funded {m.fundingPercentage.toFixed(1)}% of trip
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Paid Upfront */}
                    <td className="py-3.5 px-3 text-right font-mono">
                      <span className="font-bold text-slate-900">{formatDual(m.totalPaid, currency)}</span>
                    </td>

                    {/* 3. Personal Share */}
                    <td className="py-3.5 px-3 text-right font-mono">
                      <span className="font-semibold text-slate-700">{formatDual(m.totalOwed, currency)}</span>
                    </td>

                    {/* 4. Expense Net */}
                    <td className="py-3.5 px-3 text-right font-mono">
                      <span
                        className={`font-semibold ${
                          m.expenseNetBalance > 0
                            ? 'text-emerald-700'
                            : m.expenseNetBalance < 0
                            ? 'text-rose-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {m.expenseNetBalance > 0 ? '+' : ''}
                        {formatDual(m.expenseNetBalance, currency)}
                      </span>
                    </td>

                    {/* 5. Final Net Status */}
                    <td className="py-3.5 pl-3 text-right">
                      {isPositive && (
                        <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-mono font-bold text-xs border border-emerald-200">
                          <ArrowDownLeft size={13} className="shrink-0" />
                          <span>+{formatDual(m.finalNetBalance, currency)}</span>
                          <span className="text-[10px] font-sans text-emerald-600 uppercase ml-0.5">Back</span>
                        </div>
                      )}
                      {isNegative && (
                        <div className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded-lg font-mono font-bold text-xs border border-rose-200">
                          <ArrowUpRight size={13} className="shrink-0" />
                          <span>{formatDual(Math.abs(m.finalNetBalance), currency)}</span>
                          <span className="text-[10px] font-sans text-rose-600 uppercase ml-0.5">Owes</span>
                        </div>
                      )}
                      {isSettled && (
                        <div className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-lg font-sans font-semibold text-xs">
                          <CheckCircle2 size={13} className="text-slate-500 shrink-0" />
                          <span>Settled Up</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

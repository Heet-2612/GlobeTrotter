import React, { useState, useEffect } from 'react';
import { TripMemberResponse } from '../../types';
import { api } from '../../services/api';
import { Users, UserPlus, Trash2, Search, Check, Shield, User as UserIcon } from 'lucide-react';
import { Button, Card, Badge, Input } from '../common/UIComponents';

interface TripContributorsSectionProps {
  tripId: number;
  isOwner?: boolean;
}

export const TripContributorsSection: React.FC<TripContributorsSectionProps> = ({
  tripId,
  isOwner = true,
}) => {
  const [members, setMembers] = useState<TripMemberResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [mode, setMode] = useState<'gt' | 'manual'>('gt');
  const [gtUserIdInput, setGtUserIdInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [tripId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTripMembers(tripId);
      setMembers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trip members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'gt') {
      const parsedId = parseInt(gtUserIdInput.trim(), 10);
      if (isNaN(parsedId) || parsedId <= 0) {
        setError('Please enter a valid numeric GlobeTrotter User ID.');
        return;
      }
      try {
        setSubmitting(true);
        const newMember = await api.addTripMember(tripId, { gtUserId: parsedId });
        setMembers((prev) => [...prev, newMember]);
        setGtUserIdInput('');
        setSuccessMsg(`Added ${newMember.fullName} (GT ID: ${newMember.userId}) to the trip!`);
      } catch (err: any) {
        setError(err.message || 'GlobeTrotter user not found');
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!fullNameInput.trim()) {
        setError('Please enter a full name for the contributor.');
        return;
      }
      try {
        setSubmitting(true);
        const newMember = await api.addTripMember(tripId, { fullName: fullNameInput.trim() });
        setMembers((prev) => [...prev, newMember]);
        setFullNameInput('');
        setSuccessMsg(`Added non-GT contributor ${newMember.fullName} to the trip!`);
      } catch (err: any) {
        setError(err.message || 'Failed to add manual contributor');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleRemoveMember = async (memberId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from this trip?`)) {
      return;
    }
    try {
      await api.removeTripMember(tripId, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setSuccessMsg(`Removed ${name} from the trip.`);
    } catch (err: any) {
      setError(err.message || 'Failed to remove contributor');
    }
  };

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Trip Contributors & Members</h3>
            <p className="text-xs text-slate-500">
              Manage trip companions, registered GT users, and non-GT contributors for bill splitting.
            </p>
          </div>
        </div>
        <Badge variant="emerald" className="px-3 py-1 text-xs">
          {members.length} {members.length === 1 ? 'Contributor' : 'Contributors'}
        </Badge>
      </div>

      {/* Error & Success Alerts */}
      {error && (
        <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          {error.includes('not found') && mode === 'gt' && (
            <button
              type="button"
              onClick={() => {
                setMode('manual');
                setError(null);
              }}
              className="font-bold text-emerald-700 underline ml-2 cursor-pointer"
            >
              Add manually instead
            </button>
          )}
        </div>
      )}
      {successMsg && (
        <div className="p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center space-x-2">
          <Check size={14} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Member List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Members</h4>
        {loading ? (
          <div className="text-xs text-slate-500 py-4 text-center">Loading contributors...</div>
        ) : members.length === 0 ? (
          <div className="text-xs text-slate-400 italic py-3 text-center border border-dashed rounded-lg">
            No contributors added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      member.role === 'OWNER'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : member.isGtUser
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {member.role === 'OWNER' ? (
                      <Shield size={16} />
                    ) : member.isGtUser ? (
                      <UserIcon size={16} />
                    ) : (
                      member.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-900 text-sm truncate">{member.fullName}</span>
                      {member.role === 'OWNER' && (
                        <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Owner
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                      {member.isGtUser ? (
                        <span className="text-indigo-600 font-medium">GT User (ID: {member.userId}) ✓</span>
                      ) : (
                        <span className="text-slate-400">Non-GT Contributor</span>
                      )}
                    </div>
                  </div>
                </div>

                {isOwner && member.role !== 'OWNER' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id, member.fullName)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove contributor"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Form (Owner Only) */}
      {isOwner && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add Contributor</h4>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('gt');
                  setError(null);
                }}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mode === 'gt' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                By GT User ID
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('manual');
                  setError(null);
                }}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  mode === 'manual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Add Manually (Non-GT)
              </button>
            </div>
          </div>

          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3">
            {mode === 'gt' ? (
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Enter GlobeTrotter User ID (e.g. 17)"
                  value={gtUserIdInput}
                  onChange={(e) => setGtUserIdInput(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter Full Name (e.g. Priya Patel)"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                />
              </div>
            )}
            <Button
              type="submit"
              variant="emerald"
              size="md"
              loading={submitting}
              disabled={submitting}
              icon={<UserPlus size={16} />}
            >
              {mode === 'gt' ? 'Add GT User' : 'Add Contributor'}
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
};

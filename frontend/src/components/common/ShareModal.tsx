import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, Globe, ExternalLink, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { sharingService } from '../../services/sharingService';

interface ShareModalProps {
  isOpen: boolean;
  tripId: number | null;
  tripName?: string;
  onClose: () => void;
  onViewPublicPage: (shareToken: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, tripId, tripName = 'Travel Plan', onClose, onViewPublicPage 
}) => {
  const [shareToken, setShareToken] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);
      setErrorMsg(null);
      sharingService.getSharingStatus(tripId).then(res => {
        setIsPublic(res.isPublic);
        setShareToken(res.shareToken || '');
      }).catch(err => {
        console.error('Failed to get sharing status', err);
        setErrorMsg('Failed to load sharing settings.');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [isOpen, tripId]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullShareUrl = shareToken ? `${origin}?share=${shareToken}` : '';

  const handleToggleSharing = async (targetState: boolean) => {
    if (!tripId) return;
    setUpdating(true);
    setErrorMsg(null);

    try {
      const res = await sharingService.updateSharing(tripId, targetState);
      setIsPublic(res.isPublic);
      setShareToken(res.shareToken || '');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update sharing state.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCopy = () => {
    if (!fullShareUrl) return;
    navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Public Trip Sharing
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[260px]">
                  {tripName}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 mb-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Fetching backend sharing configuration...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sharing Status Control */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                      {isPublic ? <Globe className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                      <span>Privacy Status</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isPublic ? 'Public Share Enabled' : 'Private'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {isPublic 
                      ? 'Anyone with the unique link can view your read-only itinerary and clone it.'
                      : 'This itinerary is currently private. Only you can view or edit it.'}
                  </p>

                  <button
                    onClick={() => handleToggleSharing(!isPublic)}
                    disabled={updating}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm ${
                      isPublic
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {updating ? (
                      <span>Updating Backend State...</span>
                    ) : isPublic ? (
                      <span>Disable Public Sharing</span>
                    ) : (
                      <span>Enable Public Sharing</span>
                    )}
                  </button>
                </div>

                {/* Public Link Copy Card (only when Public) */}
                {isPublic && shareToken && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                    <label className="block text-[11px] font-bold text-emerald-900">
                      Shareable Public URL
                    </label>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={fullShareUrl}
                        className="w-full text-xs font-mono bg-white border border-emerald-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none select-all"
                      />
                      <button
                        onClick={handleCopy}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 flex-shrink-0 ${
                          copied 
                            ? 'bg-emerald-700 text-white shadow-sm' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onViewPublicPage(shareToken);
                          onClose();
                        }}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
                      >
                        <span>Open Public Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Feature Highlights */}
                <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <p className="font-semibold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Public sharing capabilities:</span>
                  </p>
                  <ul className="pl-6 list-disc space-y-0.5 text-slate-500 text-[11px]">
                    <li>Read-only itinerary timeline for unauthenticated users</li>
                    <li>Authenticated visitors can click <span className="font-bold text-slate-700">"Copy Trip"</span> to clone it</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

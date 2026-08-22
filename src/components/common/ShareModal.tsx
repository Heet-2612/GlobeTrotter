import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, Globe, ExternalLink, QrCode, Lock, CheckCircle2 } from 'lucide-react';
import { tripService } from '../../services/tripService';
import { buildShareUrl } from '../../utils/shareUtils';

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
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (isOpen && tripId) {
      setLoading(true);
      tripService.getSharing(tripId).then(res => {
        setShareToken(res.shareToken);
        setIsPublic(res.isPublic);
        setLoading(false);
      }).catch(err => {
        console.error('Failed to get share link', err);
        setLoading(false);
      });
    }
  }, [isOpen, tripId]);

  const fullShareUrl = shareToken ? buildShareUrl(shareToken) : '';

  const handleTogglePublic = async () => {
    if (!tripId) return;
    const nextState = !isPublic;
    setLoading(true);
    try {
      const res = await tripService.updateSharing(tripId, nextState);
      setIsPublic(res.isPublic);
      setShareToken(res.shareToken);
    } catch (err) {
      console.error('Failed to toggle sharing', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareToken || !isPublic) return;
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
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 overflow-hidden"
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
                  Share Itinerary
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[260px]">
                  {tripName}
                </p>
              </div>
            </div>

            {/* Public Link Card */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Globe className={`w-3.5 h-3.5 ${isPublic ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Public Sharing</span>
                  </span>

                  <button
                    onClick={handleTogglePublic}
                    disabled={loading}
                    type="button"
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPublic ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isPublic ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {isPublic ? (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      readOnly
                      value={loading ? 'Generating unique share link...' : fullShareUrl}
                      className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 focus:outline-none select-all"
                    />
                    <button
                      onClick={handleCopy}
                      disabled={loading || !shareToken}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 flex-shrink-0 ${
                        copied 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
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
                ) : (
                  <p className="text-[11px] text-slate-500 italic bg-amber-50 border border-amber-200/60 p-2 rounded-lg text-amber-800">
                    This itinerary is currently private. Enable sharing above to generate a public link that anyone can view and copy.
                  </p>
                )}
              </div>

              {/* Feature Highlights for Friends */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <p className="font-semibold text-slate-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Anyone with this link can:</span>
                </p>
                <ul className="pl-6 list-disc space-y-1 text-slate-500 text-[11px]">
                  <li>View your complete day-wise travel timeline & stops</li>
                  <li>Inspect activities, locations, and estimated budget</li>
                  <li>Click <span className="font-bold text-slate-700">"Copy Trip"</span> to clone it into their own account</li>
                </ul>
              </div>

              {/* View Public Page directly */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Done
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    if (shareToken) {
                      onViewPublicPage(shareToken);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center space-x-1.5 transition"
                >
                  <span>Open Public Preview</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

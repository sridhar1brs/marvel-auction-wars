import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedeemCodeModal: React.FC<RedeemCodeModalProps> = ({ isOpen, onClose }) => {
  const { redeemCode, user } = useAuth();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string; astra?: number } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || cleanCode.length !== 10) {
      setResult({ success: false, error: 'Promo code must be exactly 10 characters long.' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    const res = await redeemCode(cleanCode);
    setIsSubmitting(false);

    if (res.success) {
      setResult({
        success: true,
        message: res.message || `+${(res.astraAwarded || 0).toLocaleString()} ASTRA Claimed!`,
        astra: res.astraAwarded
      });
      setCode('');
    } else {
      setResult({
        success: false,
        error: res.error || 'Failed to redeem code.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-indigo-950/95 to-slate-950 border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-950/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-bold"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-purple-500/20 border border-amber-300/30">
            🎟️
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-wide uppercase">
            Redeem Promotional Code
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter your 10-digit promotional key to claim exclusive Astra rewards & tactical supply drops.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
              10-Digit Key
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={10}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setResult(null);
                }}
                inputMode="numeric"
                placeholder="e.g. 4829173056"
                className="w-full bg-slate-950/90 border border-purple-500/40 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all uppercase"
                autoFocus
              />
              <span className="absolute right-3 top-3.5 text-xs text-slate-500 font-mono">
                {code.length}/10
              </span>
            </div>
          </div>

          {/* Feedback message */}
          {result && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium border ${
                result.success
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 animate-pulse'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
              }`}
            >
              {result.success ? (
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span>{result.message}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{result.error}</span>
                </div>
              )}
            </div>
          )}

          {/* Current Astra Balance Preview */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Current Astra Balance:</span>
            <span className="font-bold text-amber-400">✨ {(user?.astra ?? 0).toLocaleString()} ASTRA</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || code.length !== 10}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-purple-900/40 transition-all transform active:scale-98"
          >
            {isSubmitting ? 'Validating Key...' : 'Claim Astra Reward'}
          </button>
        </form>
      </div>
    </div>
  );
};

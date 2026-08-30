import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  isOpen: boolean;
  onConfirmLeave: () => void;
  onStay: () => void;
  title?: string;
  message?: string;
}

export function MatchLeaveConfirmModal({
  isOpen,
  onConfirmLeave,
  onStay,
  title = 'ARE YOU SURE YOU WANT TO LEAVE?',
  message = 'Leaving the match will end or cancel your current game session. Any unbanked match progress will be lost.'
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-[#0D0B14] border-2 border-red-500/70 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.4)] overflow-hidden p-5 sm:p-6 text-center space-y-4">
        
        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400 shadow-glow-red animate-bounce">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Title & Warning Message */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-black text-lg sm:text-xl text-white uppercase tracking-wider">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Actions: NO STAY vs YES LEAVE */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onStay();
            }}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-black text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
            <span>NO, STAY</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onConfirmLeave();
            }}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-heading font-black text-xs uppercase tracking-wider border border-red-400 shadow-glow-red transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>YES, LEAVE</span>
          </button>
        </div>

      </div>
    </div>
  );
}

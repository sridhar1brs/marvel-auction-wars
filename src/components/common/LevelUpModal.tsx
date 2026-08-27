import React, { useEffect } from 'react';
import { soundManager } from '../../audio/soundManager';
import { Trophy, Star, Sparkles, X, Crown, Shield, Zap, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
  username: string;
}

export function LevelUpModal({ isOpen, onClose, oldLevel, newLevel, username }: Props) {
  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();

      try {
        confetti({
          particleCount: 200,
          spread: 160,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FF1744', '#00E5FF', '#A855F7', '#10B981', '#FFFFFF']
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1C1438] via-[#100C24] to-[#080512] border-2 border-amber-400 rounded-3xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.5)] text-center space-y-5 text-white animate-scaleUp">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 rounded-full border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Level Up Banner Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-3xl rotate-6 animate-pulse opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-purple-600 rounded-3xl -rotate-6 opacity-80" />
          <div className="relative w-20 h-20 bg-[#0B0A1A] rounded-2xl border-2 border-amber-300 flex flex-col items-center justify-center shadow-inner">
            <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
            <span className="text-2xl font-heading font-black text-amber-300 leading-none">
              {newLevel}
            </span>
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>COMMANDER PROMOTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
            LEVEL UP!
          </h2>
          <p className="text-xs text-slate-300">
            Congratulations, <span className="text-amber-300 font-bold">{username}</span>! You reached <span className="text-cyan-400 font-bold">Level {newLevel}</span>!
          </p>
        </div>

        {/* Level Comparison Card */}
        <div className="p-3 bg-black/60 border border-amber-500/30 rounded-2xl flex items-center justify-around text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-mono block">PREVIOUS</span>
            <span className="text-lg font-heading font-black text-slate-400">LVL {oldLevel}</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40">
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-amber-400 font-mono block">NEW RANK</span>
            <span className="text-xl font-heading font-black text-amber-300 animate-pulse">LVL {newLevel}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:brightness-110 transition-all cursor-pointer"
        >
          CLAIM & CONTINUE
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, ArrowLeft, Trophy, Zap, Shield, User, Flame, KeyRound } from 'lucide-react';

interface Props {
  onBackToHome: () => void;
  onOpenProfile: () => void;
  onOpenRedeem?: () => void;
}

export function AscensionHeader({ onBackToHome, onOpenProfile, onOpenRedeem }: Props) {
  const { user, isAuthenticated } = useAuth();

  const getRankDisplay = () => {
    if (!user || !user.isPlacementsCompleted || user.rankedTier === 'UNRANKED') {
      return `UNRANKED (${user?.placementMatchesPlayed ?? 0}/10 Placements)`;
    }
    if (user.rankedTier === 'ASCENDER') {
      return `⚡ ASCENDER (${(user.rankedRating ?? 0).toLocaleString()} MMR)`;
    }
    return `${user.rankedTier} ${user.rankedDivision || ''} (${(user.rankedRating ?? 0).toLocaleString()} MMR)`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050812]/95 backdrop-blur-md border-b border-cyan-500/30 px-3 sm:px-6 py-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Platform Back & Ascension Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBackToHome();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/60 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Return to Main Platform Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Platform Hub</span>
          </button>

          <div className="flex items-center gap-1.5 select-none">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-heading font-black text-xs sm:text-base px-2 py-0.5 rounded shadow-glow-cosmic">
              MARVEL
            </div>
            <span className="font-heading font-black text-sm sm:text-lg bg-gradient-to-r from-cyan-300 via-amber-300 to-white bg-clip-text text-transparent uppercase tracking-wider">
              ASCENSION
            </span>
          </div>
        </div>

        {/* Center/Right: Commander Status, Astra & Rank */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* 🎟️ REDEEM CODE BUTTON */}
          {onOpenRedeem && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenRedeem();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-950/70 hover:bg-purple-900 border border-purple-400/60 text-purple-200 hover:text-white text-xs font-bold transition-all shadow-sm"
              title="Redeem Promotional Key"
            >
              <span>🎟️</span>
              <span className="hidden md:inline">Redeem Code</span>
            </button>
          )}

          {/* ✨ ASTRA PILL */}
          <div className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]">
            <span className="text-sm sm:text-base">✨</span>
            <div className="flex flex-col">
              <span className="text-[9px] text-amber-300 font-mono font-bold uppercase leading-none hidden xxs:inline">
                ASTRA
              </span>
              <span className="font-heading font-black text-xs sm:text-sm text-amber-300 leading-none">
                {(user?.astra ?? user?.ascensionCoins ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* 🏆 RANKED BADGE PILL */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/50">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-heading font-black text-cyan-200 uppercase tracking-wide">
              {getRankDisplay()}
            </span>
          </div>

          {/* 👤 COMMANDER PROFILE & XP BAR */}
          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenProfile();
              }}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-[#101426] border border-cyan-500/40 hover:border-cyan-300 transition-all cursor-pointer shadow-sm group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 border border-cyan-400 overflow-hidden flex items-center justify-center text-sm shadow-glow-cyan">
                {user.customAvatarUrl ? (
                  <img src={user.customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.avatar || '🦸‍♂️'}</span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] bg-cyan-500 text-black px-1 rounded-full font-black font-mono">
                    LVL {user.level || 1}
                  </span>
                  <span className="text-xs font-heading font-black text-white max-w-[90px] truncate group-hover:text-cyan-300">
                    {user.displayName || user.username}
                  </span>
                </div>
                {/* XP Progress Micro-bar */}
                <div className="w-20 h-1 bg-black/60 rounded-full overflow-hidden mt-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, user.progressPercent || 0))}%` }}
                  />
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-black text-xs transition-all shadow-glow-cyan"
            >
              <User className="w-3.5 h-3.5" />
              <span>COMMANDER</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

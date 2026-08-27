import React, { useState } from 'react';
import { GamePhase } from '../../types/game';
import { McuSoundEngine } from './McuSoundEngine';
import { SkillMasteryModal } from './SkillMasteryModal';
import { ComicFunFactsModal } from './ComicFunFactsModal';
import { AuthModal } from '../auth/AuthModal';
import { PlayerProfileModal } from './PlayerProfileModal';
import { SettingsModal } from '../settings/SettingsModal';
import { useAuth } from '../../context/AuthContext';
import { useGameSettings } from '../../context/SettingsContext';
import { soundManager } from '../../audio/soundManager';
import { BookOpen, HelpCircle, Swords, ShoppingBag, Zap, Lightbulb, Menu, X, Shield, Settings, Sparkles } from 'lucide-react';

interface Props {
  phase: GamePhase;
  roomId?: string;
  isOnline: boolean;
  onNavigate: (phase: GamePhase) => void;
  onHomeClick: () => void;
  deviceView?: 'pc' | 'phone';
  onToggleDeviceView?: () => void;
}

export function Navbar({ 
  phase, 
  onNavigate, 
  onHomeClick,
}: Props) {
  const { user, isAuthenticated } = useAuth();
  const { openSettings } = useGameSettings();
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isFactsModalOpen, setIsFactsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (targetPhase: GamePhase) => {
    setIsMobileMenuOpen(false);
    onNavigate(targetPhase);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#050810]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2">
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Marvel Brand Logo */}
          <div 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onHomeClick();
            }}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="bg-gradient-to-r from-[#E62429] via-purple-600 to-indigo-600 text-white font-heading font-black text-sm sm:text-xl px-2 sm:px-2.5 py-0.5 rounded tracking-wider shadow-glow-red transform group-hover:scale-105 transition-transform flex-shrink-0">
              MARVEL
            </div>
            <span className="font-heading font-black text-xs sm:text-base text-white tracking-widest uppercase hidden xs:inline sm:inline flex-shrink-0 bg-gradient-to-r from-amber-300 via-cyan-300 to-white bg-clip-text text-transparent">
              ASCENSION
            </span>
          </div>

          {/* Center: Desktop Navigation Buttons (Equally Spaced in the Middle) */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-2 xl:gap-2.5 px-2">
            {/* 0. Ascension Mode Flagship */}
            <button
              type="button"
              onClick={() => onNavigate('ASCENSION')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-black uppercase tracking-wider transition-all border whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer ${
                phase === 'ASCENSION'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                  : 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 text-cyan-300 border-purple-500/50 hover:border-cyan-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Ascension Mode</span>
            </button>

            {/* 1. Relic Shop */}
            <button
              type="button"
              onClick={() => onNavigate('EQUIPMENT_SHOP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer ${
                phase === 'EQUIPMENT_SHOP'
                  ? 'bg-amber-950/80 text-amber-200 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-[#101522]/90 text-amber-300 border-amber-500/40 hover:bg-[#1A2234] hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Relic Shop</span>
            </button>

            {/* 2. Skill Mastery */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsSkillModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border bg-[#14101A]/90 text-yellow-300 border-yellow-500/40 hover:bg-yellow-950/60 hover:border-yellow-400 hover:text-white whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer"
              title="Skill Mastery (Explore 5 Signature Skills per Hero)"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <span>Skill Mastery</span>
            </button>

            {/* 3. Comic Facts */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsFactsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border bg-[#200A10]/90 text-rose-300 border-rose-500/40 hover:bg-rose-950/70 hover:border-rose-400 hover:text-white whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer"
              title="150 Marvel Comic Fun Facts & Easter Eggs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>Comic Facts</span>
            </button>

            {/* 4. Duel Simulator */}
            <button
              type="button"
              onClick={() => onNavigate('SANDBOX')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer ${
                phase === 'SANDBOX'
                  ? 'bg-purple-950/80 text-purple-200 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-[#101522]/90 text-purple-300 border-purple-500/40 hover:bg-[#1A2234] hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-purple-400" />
              <span>Duel Simulator</span>
            </button>

            {/* 5. Characters */}
            <button
              type="button"
              onClick={() => onNavigate('ENCYCLOPEDIA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer ${
                phase === 'ENCYCLOPEDIA'
                  ? 'bg-red-950/80 text-red-200 border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'bg-[#101522]/90 text-slate-300 border-slate-700 hover:bg-[#1A2234] hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-red-400" />
              <span>Characters</span>
            </button>

            {/* 6. Rules */}
            <button
              type="button"
              onClick={() => onNavigate('HOW_TO_PLAY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer ${
                phase === 'HOW_TO_PLAY'
                  ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-[#101522]/90 text-cyan-300 border-cyan-500/40 hover:bg-[#1A2234] hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rules</span>
            </button>
          </div>

          {/* Right: Commander Profile / Sign In + MCU Sound Engine + Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 relative z-50">
            {/* Commander Account Badge / Sign In Trigger */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsProfileModalOpen(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-cyan-950 via-[#101932] to-purple-950 border border-cyan-500/50 hover:border-cyan-400 text-white transition-all shadow-glow-cyan transform hover:scale-105 cursor-pointer"
                title="View Commander Dossier & Stats"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-600/40 border border-cyan-400 flex items-center justify-center text-xs sm:text-sm">
                  {user.avatar || '🦸‍♂️'}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] sm:text-[10px] font-black bg-amber-500 text-black px-1.5 py-0.2 rounded-full font-mono">
                    LVL {user.level}
                  </span>
                  <span className="text-xs font-heading font-black text-white max-w-[80px] sm:max-w-[110px] truncate hidden xxs:inline">
                    {user.displayName || user.username}
                  </span>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-heading font-black text-[11px] sm:text-xs uppercase tracking-wider border border-white/20 transition-all shadow-md shadow-red-600/30 transform hover:scale-105 cursor-pointer"
                title="Sign In or Create Commander Account"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <McuSoundEngine />

            {/* Dedicated Settings Button */}
            <button
              type="button"
              onClick={openSettings}
              className="p-1.5 sm:p-2 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-300 hover:text-amber-200 hover:border-amber-400 hover:bg-stone-800 transition-all shadow-sm cursor-pointer"
              title="Open Game Settings (Audio, Visuals, Profile)"
            >
              <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Mobile Hamburger Menu Button (Visible on screens < lg) */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsMobileMenuOpen(prev => !prev);
              }}
              className="lg:hidden p-2 rounded-xl bg-slate-900/90 border border-white/15 text-slate-200 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
              title="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Down Navigation Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-3 pb-2 border-t border-white/10 space-y-2 animate-fadeIn select-none">
            {/* Commander Account Status on Mobile */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-500/30 flex items-center justify-between">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{user.avatar || '🦸‍♂️'}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-black text-xs text-white truncate">{user.displayName || user.username}</span>
                      <span className="text-[9px] bg-amber-500 text-black font-black px-1.5 py-0.2 rounded-full">LVL {user.level}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">{user.wins} Wins • {user.playtimeFormatted || '0m'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-300">
                  <span>Guest Commander</span>
                  <span className="block text-[10px] text-slate-500">Sign in to save progression & stats</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  if (isAuthenticated) {
                    setIsProfileModalOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-all"
              >
                {isAuthenticated ? 'View Profile' : 'Sign In'}
              </button>
            </div>

            {/* Ascension Mode Banner Button (Mobile) */}
            <button
              type="button"
              onClick={() => handleMobileNav('ASCENSION')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-heading font-black uppercase tracking-wider border transition-all text-left cursor-pointer shadow-md ${
                phase === 'ASCENSION'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                  : 'bg-gradient-to-r from-purple-950/90 to-indigo-950/90 text-cyan-300 border-purple-500/50 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>MARVEL ASCENSION MODE</span>
              </div>
              <span className="text-[10px] bg-cyan-400 text-black px-2 py-0.5 rounded font-black">NEW</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              {/* Relic Shop */}
              <button
                type="button"
                onClick={() => handleMobileNav('EQUIPMENT_SHOP')}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  phase === 'EQUIPMENT_SHOP'
                    ? 'bg-amber-950/90 text-amber-200 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-900/80 text-amber-300 border-amber-500/30 hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Relic Shop</span>
              </button>

              {/* Skill Mastery */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  setIsSkillModalOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border bg-slate-900/80 text-yellow-300 border-yellow-500/30 hover:bg-slate-800 transition-all text-left"
              >
                <Zap className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
                <span className="truncate">Skill Mastery</span>
              </button>

              {/* Comic Facts */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  setIsFactsModalOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border bg-slate-900/80 text-rose-300 border-rose-500/30 hover:bg-slate-800 transition-all text-left"
              >
                <Lightbulb className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">Comic Facts</span>
              </button>

              {/* Duel Simulator */}
              <button
                type="button"
                onClick={() => handleMobileNav('SANDBOX')}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  phase === 'SANDBOX'
                    ? 'bg-purple-950/90 text-purple-200 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'bg-slate-900/80 text-purple-300 border-purple-500/30 hover:bg-slate-800'
                }`}
              >
                <Swords className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">Duel Simulator</span>
              </button>

              {/* Characters */}
              <button
                type="button"
                onClick={() => handleMobileNav('ENCYCLOPEDIA')}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  phase === 'ENCYCLOPEDIA'
                    ? 'bg-red-950/90 text-red-200 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-red-400 shrink-0" />
                <span className="truncate">Characters (350)</span>
              </button>

              {/* Rules */}
              <button
                type="button"
                onClick={() => handleMobileNav('HOW_TO_PLAY')}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                  phase === 'HOW_TO_PLAY'
                    ? 'bg-cyan-950/90 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Rules & Lore</span>
              </button>

              {/* Game Settings */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openSettings();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border border-amber-500/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 transition-all text-left cursor-pointer"
              >
                <Settings className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Game Settings</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Skill Mastery Modal */}
      <SkillMasteryModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
      />

      {/* Comic Fun Facts Modal */}
      <ComicFunFactsModal
        isOpen={isFactsModalOpen}
        onClose={() => setIsFactsModalOpen(false)}
      />

      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Player Profile Modal */}
      {isProfileModalOpen && (
        <PlayerProfileModal
          profile={user}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Game Settings Modal */}
      <SettingsModal />
    </>
  );
}

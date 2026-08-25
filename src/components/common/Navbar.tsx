import React, { useState } from 'react';
import { GamePhase } from '../../types/game';
import { McuSoundEngine } from './McuSoundEngine';
import { SkillMasteryModal } from './SkillMasteryModal';
import { ComicFunFactsModal } from './ComicFunFactsModal';
import { soundManager } from '../../audio/soundManager';
import { BookOpen, HelpCircle, Swords, ShoppingBag, Zap, Lightbulb, Menu, X } from 'lucide-react';

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
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isFactsModalOpen, setIsFactsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (targetPhase: GamePhase) => {
    setIsMobileMenuOpen(false);
    onNavigate(targetPhase);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#050810]/95 backdrop-blur-md border-b border-slate-800/80 px-2.5 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Marvel Brand Logo */}
          <div 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onHomeClick();
            }}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="bg-[#E62429] text-white font-heading font-black text-sm sm:text-xl px-2 sm:px-2.5 py-0.5 rounded tracking-wider shadow-glow-red transform group-hover:scale-105 transition-transform flex-shrink-0">
              MARVEL
            </div>
            <span className="font-heading font-black text-xs sm:text-base text-white tracking-widest uppercase hidden xs:inline sm:inline flex-shrink-0">
              AUCTION WARS
            </span>
          </div>

          {/* Center: Desktop Navigation Buttons (Visible on lg+) */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-2 flex-nowrap px-2">
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

          {/* Right: MCU Sound Engine + Mobile Menu Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 relative z-50">
            <McuSoundEngine />

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
          <div className="lg:hidden mt-2 pt-3 pb-2 border-t border-white/10 grid grid-cols-2 gap-2 animate-fadeIn select-none">
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
    </>
  );
}

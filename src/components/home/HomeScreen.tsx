import React, { useState } from 'react';
import { Users, Globe, BookOpen, HelpCircle, Shield, Zap, Sparkles, Award, Swords, ShoppingBag, ArrowRight, Flame, Layers } from 'lucide-react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { TAG_TEAM_COMBOS } from '../../engine/synergyEngine';
import { soundManager } from '../../audio/soundManager';
import { DuoHeroesModal } from '../common/DuoHeroesModal';

interface Props {
  onPlayLocal: () => void;
  onPlayBlindBidding: () => void;
  onPlayMultiplayer: () => void;
  onPlayDungeon?: () => void;
  onPlayBossRaid?: () => void;
  onPlayBlitz?: () => void;
  onOpenEncyclopedia: () => void;
  onOpenHowToPlay: () => void;
  onOpenSandbox: () => void;
  onOpenRelicShop: () => void;
  onOpenSkillVault?: () => void;
  onPlayIntro?: () => void;
}

export function HomeScreen({
  onPlayLocal,
  onPlayBlindBidding,
  onPlayMultiplayer,
  onPlayDungeon,
  onPlayBossRaid,
  onPlayBlitz,
  onOpenEncyclopedia,
  onOpenHowToPlay,
  onOpenSandbox,
  onOpenRelicShop,
  onOpenSkillVault,
  onPlayIntro,
}: Props) {
  const [isDuoModalOpen, setIsDuoModalOpen] = useState(false);

  const handleAction = (cb?: () => void) => {
    if (!cb) return;
    soundManager.playClick();
    cb();
  };

  return (
    <div className="relative min-h-[calc(100dvh-60px)] flex-1 flex flex-col items-center justify-between px-3 sm:px-6 py-4 sm:py-8 lg:py-10 overflow-hidden cyber-circuit-bg text-slate-100">
      
      {/* 1. Ambient Nebula Glow (Left Red & Right Blue, NO character sketches or faces) */}
      <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-red-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Circuit Trace SVG Lines radiating from the frame */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 250 L 300 250 L 350 290 L 450 290" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
        <path d="M 120 400 L 280 400 L 320 370 L 420 370" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />
        <path d="M 1820 250 L 1620 250 L 1570 290 L 1470 290" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
        <path d="M 1800 400 L 1640 400 L 1600 370 L 1500 370" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />
        <circle cx="450" cy="290" r="3.5" fill="#38BDF8" />
        <circle cx="1470" cy="290" r="3.5" fill="#38BDF8" />
      </svg>

      {/* 2. Top Golden Pill Badge */}
      <div className="relative z-10 mb-3 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#120E06]/95 border border-amber-500/70 shadow-[0_0_18px_rgba(245,158,11,0.3)] text-amber-300 text-xs font-heading font-black tracking-widest uppercase">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>COMPETITIVE CARD AUCTION & BATTLE ARENA</span>
        </div>
      </div>

      {/* 3. Central Holographic HUD Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto hud-cyber-bracket rounded-3xl p-6 sm:p-8 text-center mb-6 animate-fadeIn">
        
        {/* Top & Corner HUD Tech Brackets */}
        <div className="absolute top-2 left-3 text-cyan-400/60 font-mono text-[10px] select-none">┌ [SYS: ONLINE]</div>
        <div className="absolute top-2 right-3 text-cyan-400/60 font-mono text-[10px] select-none">[v2.0] ┐</div>
        <div className="absolute bottom-2 left-3 text-cyan-400/60 font-mono text-[10px] select-none">└ [SECURE]</div>
        <div className="absolute bottom-2 right-3 text-cyan-400/60 font-mono text-[10px] select-none">[350 HEROES] ┘</div>

        {/* 3A. MARVEL 3D Beveled Red Box with Blue Trim */}
        <div className="flex items-center justify-center mb-2">
          <div className="marvel-3d-box px-8 py-2 rounded-xl">
            <span className="font-heading font-black text-4xl sm:text-6xl text-white tracking-widest block leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              MARVEL
            </span>
          </div>
        </div>

        {/* 3B. AUCTION WARS Glowing Futuristic Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-wider auction-wars-glow-title uppercase">
          AUCTION WARS
        </h1>

        {/* 3C. Tagline: BID. BUILD. BATTLE. */}
        <p className="text-sm sm:text-lg md:text-xl font-heading font-black tracking-[0.3em] text-amber-400 uppercase mt-2 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
          BID. BUILD. BATTLE.
        </p>

        {/* 3D. Subtitle Description */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-3 leading-relaxed font-medium">
          Start with custom funds ($10-$150). Bid against rivals on <strong>{ALL_CHARACTERS.length} Marvel Characters</strong> across 5 competitive grades. Forge {TAG_TEAM_COMBOS.length} Duo Synergies, equip Tactical Artifacts, and conquer the championship!
        </p>
      </div>

      {/* 4. Main Futuristic Console Rack Chassis (1-to-1 Replica of Image 1) */}
      <div className="relative z-10 max-w-5xl w-full mb-3 animate-fadeIn">
        <div className="console-rack-chassis rounded-3xl p-3 sm:p-4 relative border-2 border-[#1E293B] shadow-[0_0_35px_rgba(0,0,0,0.8)]">
          
          {/* Side Accent Neon Lights */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-16 bg-red-500 rounded-full shadow-[0_0_18px_#EF4444]" />
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-16 bg-cyan-400 rounded-full shadow-[0_0_18px_#22D3EE]" />

          {/* 6 Primary Game Modes Side-by-Side in Horizontal Chassis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            
            {/* 1. Classic Match (Red) */}
            <button
              onClick={() => handleAction(onPlayLocal)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#221014] to-[#0D0608] border-2 border-red-500/80 hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-4 h-4 text-red-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-300 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Same Device / BOTS
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-red-300 leading-tight">
                  CLASSIC MATCH
                </h3>
              </div>
            </button>

            {/* 2. Blind Bidding (Purple) */}
            <button
              onClick={() => handleAction(onPlayBlindBidding)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#1C122A] to-[#0B0612] border-2 border-purple-500/80 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  100K MYSTERY CRATES
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-purple-300 leading-tight">
                  BLIND BIDDING
                </h3>
              </div>
            </button>

            {/* 3. Blitz Auction (Gold) */}
            <button
              onClick={() => handleAction(onPlayBlitz)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#261E0E] to-[#100C05] border-2 border-amber-500/80 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  5-SEC FAST DRAFT
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-amber-300 leading-tight">
                  BLITZ AUCTION
                </h3>
              </div>
            </button>

            {/* 4. Boss Raid (Rose/Pink) */}
            <button
              onClick={() => handleAction(onPlayBossRaid)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#26101B] to-[#10060A] border-2 border-pink-500/80 hover:border-pink-400 hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-4 h-4 text-pink-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-300 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  PVE TITAN BATTLE
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-pink-300 leading-tight">
                  BOSS RAID (PVE)
                </h3>
              </div>
            </button>

            {/* 5. Ancient Ruins Dungeons (Orange) */}
            <button
              onClick={() => handleAction(onPlayDungeon)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#2A1406] to-[#100702] border-2 border-orange-500/80 hover:border-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-300 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  1-300 ANCIENT RUINS
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-orange-300 leading-tight">
                  DUNGEONS (PVE)
                </h3>
              </div>
            </button>

            {/* 6. Multiplayer (Cyan/Blue) */}
            <button
              onClick={() => handleAction(onPlayMultiplayer)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#0F2232] to-[#050E16] border-2 border-cyan-500/80 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  2 TO 10 PLAYERS
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-cyan-300 leading-tight">
                  MULTIPLAYER
                </h3>
              </div>
            </button>

          </div>
        </div>

        {/* 5. Docked Console Sub-Tray */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2 animate-fadeIn">
          
          {/* Duel Simulator */}
          <button
            onClick={() => handleAction(onOpenSandbox)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121624]/90 hover:bg-slate-800 text-purple-300 border border-purple-500/40 text-[11px] font-black transition-all shadow-sm transform hover:scale-105"
          >
            <Swords className="w-3.5 h-3.5 text-purple-400" />
            <span>DUEL SIMULATOR</span>
          </button>

          {/* Relic Shop & Weapons */}
          <button
            onClick={() => handleAction(onOpenRelicShop)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#20170A]/95 hover:bg-[#2E200C] text-amber-300 border border-amber-500/70 text-[11px] font-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.35)] transform hover:scale-105"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>RELIC SHOP & WEAPONS</span>
          </button>

          {/* Duo Heroes (230) Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsDuoModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1F0E1E]/95 hover:bg-[#2C132B] text-pink-300 border border-pink-500/60 text-[11px] font-black transition-all shadow-[0_0_12px_rgba(236,72,153,0.25)] transform hover:scale-105"
          >
            <Flame className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
            <span>DUO HEROES ({TAG_TEAM_COMBOS.length})</span>
          </button>

          {/* Characters Encyclopedia */}
          <button
            onClick={() => handleAction(onOpenEncyclopedia)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#101422]/90 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-slate-500 text-[11px] font-black transition-all transform hover:scale-105"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>CHARACTERS ({ALL_CHARACTERS.length})</span>
          </button>

          {/* How To Play */}
          <button
            onClick={() => handleAction(onOpenHowToPlay)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#101422]/90 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-cyan-500 text-[11px] font-black transition-all transform hover:scale-105"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>

      {/* 6. Bottom Feature Highlights (4 Dark Rounded Cards) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full text-center mt-2 animate-fadeIn">
        <div className="p-3 rounded-2xl bg-[#0B101D]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">350 Marvel Characters</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Grade C to Cosmic Mythic</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0B101D]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">Authoritative Auctions</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Anti-Sniping & Mystery Crates</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0B101D]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Swords className="w-4 h-4 text-red-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">Equal Tier Battles</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Strategic Round Duels</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0B101D]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">Dynamic Brackets</span>
          <span className="text-[10px] text-slate-400 font-semibold block">2 to 10 Player Tournaments</span>
        </div>
      </div>

      {/* 7. Disclaimer Footer */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mt-4 px-2">
        <p className="text-[10px] text-slate-500 leading-tight">
          ⚡ <strong>Unofficial Fan Project:</strong> MARVEL - AUCTION WARS is a free, non-commercial game for educational and entertainment purposes. All characters, names, media, and trademarks belong to Marvel Characters, Inc., The Walt Disney Company, and Sony Pictures.
        </p>
      </div>

      {/* Duo Heroes Modal */}
      <DuoHeroesModal 
        isOpen={isDuoModalOpen} 
        onClose={() => setIsDuoModalOpen(false)} 
      />

    </div>
  );
}

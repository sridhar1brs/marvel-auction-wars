import { Users, Globe, BookOpen, HelpCircle, Shield, Zap, Sparkles, Award, Swords, ShoppingBag, ArrowRight } from 'lucide-react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { soundManager } from '../../audio/soundManager';

interface Props {
  onPlayLocal: () => void;
  onPlayBlindBidding: () => void;
  onPlayMultiplayer: () => void;
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
  onPlayBossRaid,
  onPlayBlitz,
  onOpenEncyclopedia,
  onOpenHowToPlay,
  onOpenSandbox,
  onOpenRelicShop,
  onOpenSkillVault,
  onPlayIntro,
}: Props) {
  const handleAction = (cb?: () => void) => {
    if (!cb) return;
    soundManager.playClick();
    cb();
  };

  return (
    <div className="relative min-h-[calc(100dvh-60px)] flex-1 flex flex-col items-center justify-between px-3 sm:px-6 py-3 sm:py-8 lg:py-10 overflow-hidden cyber-grid bg-[#06080E]">
      {/* 1. Moving Red & Blue Cosmic Nebula Fog Backgrounds (No character outlines) */}
      <div className="absolute top-10 left-[-10%] w-[650px] h-[650px] rounded-full cosmic-fog-red pointer-events-none z-0" />
      <div className="absolute bottom-10 right-[-10%] w-[650px] h-[650px] rounded-full cosmic-fog-blue pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* 2. Top Chamfered Official Badge */}
      <div className="relative z-10 mb-4 animate-fadeIn">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#120D04]/90 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-300 text-[11px] font-heading font-black tracking-widest uppercase">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>OFFICIAL COMPETITIVE CARD AUCTION & BATTLE ARENA</span>
        </div>
      </div>

      {/* 3. Main Title Section: MARVEL (Red Box) + AUCTION WARS + BID. BUILD. BATTLE. */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-7 animate-fadeIn">
        {/* MARVEL Box */}
        <div className="flex items-center justify-center mb-1">
          <div className="relative px-6 py-1.5 rounded-xl bg-gradient-to-b from-[#E62429] to-[#990F14] border-2 border-red-400 shadow-[0_0_25px_rgba(230,36,41,0.5)]">
            <span className="font-heading font-black text-3xl sm:text-5xl text-white tracking-widest block leading-none drop-shadow-md">
              MARVEL
            </span>
          </div>
        </div>

        {/* AUCTION WARS Metallic Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] uppercase mt-1">
          AUCTION WARS
        </h1>

        {/* Slogan */}
        <p className="text-base sm:text-xl lg:text-2xl font-heading font-black tracking-[0.25em] text-amber-400 uppercase mt-1 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
          BID. BUILD. BATTLE.
        </p>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-slate-300 max-w-xl mx-auto mt-2.5 leading-relaxed font-medium">
          Start with custom funds ($10-$150). Bid against rivals on <strong>301 Marvel Characters</strong> across 4 competitive grades. Forge Team Synergies, equip Tactical Artifacts, and conquer the championship!
        </p>
      </div>

      {/* 4. Main Futuristic Console Dock (Chassis with Red/Cyan side lights) */}
      <div className="relative z-10 max-w-5xl w-full mb-3 animate-fadeIn">
        <div className="relative p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#161B26]/95 via-[#0D111A]/95 to-[#080B10]/95 border-2 border-slate-700/60 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          {/* Side Accent Neon Lights */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-14 bg-red-500 rounded-full shadow-[0_0_15px_#EF4444]" />
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-14 bg-cyan-400 rounded-full shadow-[0_0_15px_#22D3EE]" />

          {/* 5 Mode Cards in Row */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-2.5">
            
            {/* 1. Classic Match (Red) */}
            <button
              onClick={() => handleAction(onPlayLocal)}
              className="group p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#1C1215] to-[#0D080A] border border-red-500/70 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-4 h-4 text-red-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Same Device / BOTS
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-red-300">
                  CLASSIC MATCH
                </h3>
              </div>
            </button>

            {/* 2. Blind Bidding (Purple) */}
            <button
              onClick={() => handleAction(onPlayBlindBidding)}
              className="group p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#181124] to-[#0A0712] border border-purple-500/70 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  100% MYSTERY CRATES
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-purple-300">
                  BLIND BIDDING
                </h3>
              </div>
            </button>

            {/* 3. Blitz Auction (Gold) */}
            <button
              onClick={() => handleAction(onPlayBlitz)}
              className="group p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#211A0E] to-[#0F0C06] border border-amber-500/80 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  5-SEC FAST DRAFT
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-amber-300">
                  BLITZ AUCTION
                </h3>
              </div>
            </button>

            {/* 4. Boss Raid (Pink/Crimson) */}
            <button
              onClick={() => handleAction(onPlayBossRaid)}
              className="group p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#221018] to-[#10060A] border border-rose-500/70 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-4 h-4 text-rose-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  PVE TITAN BATTLE
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-rose-300">
                  BOSS RAID (PVE)
                </h3>
              </div>
            </button>

            {/* 5. Multiplayer (Cyan/Blue) */}
            <button
              onClick={() => handleAction(onPlayMultiplayer)}
              className="group p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-[#0F1C28] to-[#060D14] border border-cyan-500/70 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex flex-col justify-between text-left transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  2 TO 8 PLAYERS
                </span>
                <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wide group-hover:text-cyan-300">
                  MULTIPLAYER
                </h3>
              </div>
            </button>

          </div>
        </div>

        {/* 5. Floating Quick-Links Tray Under Chassis (Skill Vault, Relic Vault, Sandbox, Characters, Rules) */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2 animate-fadeIn">
          {/* Duel Sandbox */}
          <button
            onClick={() => handleAction(onOpenSandbox)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121622]/90 hover:bg-slate-800 text-purple-300 border border-purple-500/40 text-[11px] font-bold transition-all shadow-sm"
          >
            <Swords className="w-3.5 h-3.5 text-purple-400" />
            <span>DUEL SANDBOX</span>
          </button>

          {/* Skill Vault */}
          <button
            onClick={() => handleAction(onOpenSkillVault)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/90 to-blue-950/90 hover:from-cyan-900 hover:to-blue-900 text-cyan-300 border border-cyan-400/60 text-[11px] font-black transition-all shadow-[0_0_12px_rgba(34,211,238,0.25)] transform hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>⚡ SKILL VAULT (5 SKILLS / HERO)</span>
          </button>

          {/* Relic Shop & Weapons */}
          <button
            onClick={() => handleAction(onOpenRelicShop)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C160B]/90 hover:bg-[#2A200E] text-amber-300 border border-amber-500/60 text-[11px] font-black transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] transform hover:scale-105"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>RELIC SHOP & WEAPONS</span>
          </button>

          {/* Characters Encyclopedia */}
          <button
            onClick={() => handleAction(onOpenEncyclopedia)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121622]/90 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-slate-500 text-[11px] font-bold transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>CHARACTERS ({ALL_CHARACTERS.length})</span>
          </button>

          {/* How To Play */}
          <button
            onClick={() => handleAction(onOpenHowToPlay)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121622]/90 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-cyan-500 text-[11px] font-bold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>

      {/* 6. Bottom Feature Highlights (4 Dark Rounded Cards) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full text-center mt-3 animate-fadeIn">
        <div className="p-3 rounded-2xl bg-[#0E121C]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">300 Marvel Characters</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Grade C to Cosmic Mythic</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0E121C]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">Authoritative Auctions</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Anti-Sniping & Mystery Crates</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0E121C]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Swords className="w-4 h-4 text-red-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">Equal Tier Battles</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Strategic Round Duels</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0E121C]/80 border border-white/10 space-y-0.5">
          <div className="flex justify-center mb-1">
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <span className="font-heading font-black text-xs text-white block">Dynamic Brackets</span>
          <span className="text-[10px] text-slate-400 font-semibold block">2 to 8 Player Tournaments</span>
        </div>
      </div>

      {/* 7. Disclaimer Footer */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mt-4 px-2">
        <p className="text-[10px] text-slate-500 leading-tight">
          ⚡ <strong>Unofficial Fan Project:</strong> MARVEL - AUCTION WARS is a free, non-commercial game for educational and entertainment purposes. All characters, names, media, and trademarks belong to Marvel Characters, Inc., The Walt Disney Company, and Sony Pictures.
        </p>
      </div>
    </div>
  );
}

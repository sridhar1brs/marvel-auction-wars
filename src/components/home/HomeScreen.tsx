import { Users, Globe, BookOpen, HelpCircle, Shield, Zap, Sparkles, Award, Swords, ShoppingBag } from 'lucide-react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { soundManager } from '../../audio/soundManager';

interface Props {
  onPlayLocal: () => void;
  onPlayBlindBidding: () => void;
  onPlayMultiplayer: () => void;
  onOpenEncyclopedia: () => void;
  onOpenHowToPlay: () => void;
  onOpenSandbox: () => void;
  onOpenRelicShop: () => void;
  onPlayIntro?: () => void;
}

export function HomeScreen({
  onPlayLocal,
  onPlayBlindBidding,
  onPlayMultiplayer,
  onOpenEncyclopedia,
  onOpenHowToPlay,
  onOpenSandbox,
  onOpenRelicShop,
  onPlayIntro,
}: Props) {
  const handleAction = (cb: () => void) => {
    soundManager.playClick();
    cb();
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Marvel Cosmic Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Title Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-marvel-red/20 border border-marvel-red/50 shadow-glow-red text-red-200 font-extrabold text-xs uppercase tracking-widest mb-4 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-marvel-gold" />
          <span>OFFICIAL COMPETITIVE CARD AUCTION & BATTLE ARENA</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-marvel-red text-white font-heading font-black text-4xl sm:text-7xl px-4 py-1 rounded-lg tracking-wider shadow-glow-red transform -rotate-1">
            MARVEL
          </div>
        </div>

        <h1 className="text-4xl sm:text-7xl font-heading font-black tracking-widest text-slate-100 uppercase drop-shadow-2xl">
          AUCTION WARS
        </h1>

        <p className="text-lg sm:text-2xl font-extrabold font-heading text-gold-gradient tracking-widest mt-2 uppercase">
          BID. BUILD. BATTLE.
        </p>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-4 leading-relaxed">
          Start with custom funds ($10-$150). Bid against rivals on <strong>300 Marvel Characters</strong> across 4 competitive grades. Forge Team Synergies, equip Tactical Artifacts, and conquer the championship!
        </p>
      </div>

      {/* Primary Action Buttons: Classic, Blind Bidding, and Multiplayer */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-8">
        {/* Play Classic Local */}
        <button
          onClick={() => handleAction(onPlayLocal)}
          className="group relative overflow-hidden bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white p-4 rounded-2xl border border-red-400/50 shadow-glow-red transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex flex-col justify-between text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform text-xs">
              →
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-red-200 uppercase tracking-widest block">
              SAME DEVICE / BOTS
            </span>
            <h2 className="text-xl font-heading font-black tracking-wide text-white">
              CLASSIC MATCH
            </h2>
          </div>
        </button>

        {/* Play Blind Bidding Mode */}
        <button
          onClick={() => handleAction(onPlayBlindBidding)}
          className="group relative overflow-hidden bg-gradient-to-br from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 text-white p-4 rounded-2xl border border-purple-400/50 shadow-glow-cosmic transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex flex-col justify-between text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/20">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform text-xs">
              →
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">
              100% MYSTERY CRATES
            </span>
            <h2 className="text-xl font-heading font-black tracking-wide text-white">
              BLIND BIDDING
            </h2>
          </div>
        </button>

        {/* Online Multiplayer */}
        <button
          onClick={() => handleAction(onPlayMultiplayer)}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-700 to-slate-900 hover:from-blue-600 hover:to-slate-800 text-white p-4 rounded-2xl border border-blue-400/50 shadow-glow-blue transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex flex-col justify-between text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/20">
              <Globe className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform text-xs">
              →
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block">
              2 TO 8 PLAYERS
            </span>
            <h2 className="text-xl font-heading font-black tracking-wide text-white">
              MULTIPLAYER
            </h2>
          </div>
        </button>
      </div>

      {/* Secondary Quick Links (Sandbox, Relics, Characters, Rules, Marvel Intro) */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 max-w-4xl w-full mb-12">
        {onPlayIntro && (
          <button
            onClick={() => handleAction(onPlayIntro)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-red-400 shadow-glow-red px-4 py-2.5 rounded-xl text-xs font-black text-white uppercase tracking-wider transition-all transform hover:scale-105"
          >
            <span>🕷️ WEB LETTER DAYS OST</span>
          </button>
        )}

        <button
          onClick={() => handleAction(onOpenSandbox)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-900/80 to-red-900/80 hover:from-purple-800 hover:to-red-800 border border-purple-500/50 shadow-glow-cosmic px-4 py-2.5 rounded-xl text-xs font-bold text-purple-200 transition-all"
        >
          <Swords className="w-4 h-4 text-amber-400" />
          <span>⚔️ DUEL SANDBOX</span>
        </button>

        <button
          onClick={() => handleAction(onOpenRelicShop)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-950/80 to-purple-950/80 hover:from-amber-900 hover:to-purple-900 border border-amber-500/50 shadow-sm px-4 py-2.5 rounded-xl text-xs font-bold text-amber-300 transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>⚡ RELIC SHOP & WEAPONS</span>
        </button>

        <button
          onClick={() => handleAction(onOpenEncyclopedia)}
          className="flex items-center gap-2 bg-marvel-card/80 hover:bg-slate-800 border border-marvel-border px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all hover:border-slate-500"
        >
          <BookOpen className="w-4 h-4 text-marvel-red" />
          <span>CHARACTERS ({ALL_CHARACTERS.length})</span>
        </button>

        <button
          onClick={() => handleAction(onOpenHowToPlay)}
          className="flex items-center gap-2 bg-marvel-card/80 hover:bg-slate-800 border border-marvel-border px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 transition-all hover:border-slate-500"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>HOW TO PLAY</span>
        </button>
      </div>

      {/* Feature Badges Footer */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full text-center">
        <FeatureItem 
          icon={<Shield className="w-4 h-4 text-emerald-400" />} 
          title="300 Marvel Characters" 
          desc="Grade C to Cosmic Mythic" 
        />
        <FeatureItem 
          icon={<Zap className="w-4 h-4 text-amber-400" />} 
          title="Authoritative Auctions" 
          desc="Anti-Sniping & Mystery Crates" 
        />
        <FeatureItem 
          icon={<Award className="w-4 h-4 text-red-400" />} 
          title="Equal Tier Battles" 
          desc="Strategic Round Duels" 
        />
        <FeatureItem 
          icon={<Sparkles className="w-4 h-4 text-purple-400" />} 
          title="Dynamic Brackets" 
          desc="2 to 8 Player Tournaments" 
        />
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-panel p-3 rounded-xl border border-white/5 flex flex-col items-center">
      <div className="p-2 bg-black/40 rounded-lg mb-1.5">
        {icon}
      </div>
      <h3 className="text-xs font-black text-slate-200">{title}</h3>
      <p className="text-[10px] text-slate-400">{desc}</p>
    </div>
  );
}

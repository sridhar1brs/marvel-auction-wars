import { useEffect } from 'react';
import { Player, GameState } from '../../types/game';
import { Trophy, Award, DollarSign, Swords, RotateCcw, Sparkles, Crown, Star, Flame, Zap } from 'lucide-react';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { soundManager } from '../../audio/soundManager';

interface Props {
  champion: Player;
  state: GameState;
  onPlayAgain: () => void;
}

export function VictoryScreen({ champion, state, onPlayAgain }: Props) {
  useEffect(() => {
    soundManager.playVictory();
  }, []);

  // Find MVP character in champion roster
  const mvpChar = [...champion.collection].sort((a, b) => b.overallPower - a.overallPower)[0] || null;

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-8 overflow-hidden">
      
      {/* COSMIC RED & BLUE ENERGY VEINS / TENDRILS SVG BACKGROUND */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <linearGradient id="redVeinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1744" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e62429" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff5252" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="blueVeinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2979ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- CRIMSON RED ENERGY VEINS (Wrapping from Left & Top across Cards) --- */}
        {/* Vein Red 1: Top Left down to Roster Panel */}
        <path
          d="M -20,100 Q 180,120 250,220 T 320,380 Q 200,440 120,540 T 150,720 Q 220,860 450,920"
          fill="none"
          stroke="url(#redVeinGrad)"
          strokeWidth="3.5"
          className="animate-vein-red"
        />
        {/* Vein Red 2: Branch curling around Trophy */}
        <path
          d="M 500,20 Q 420,80 430,150 T 380,240 Q 300,280 200,290"
          fill="none"
          stroke="url(#redVeinGrad)"
          strokeWidth="2.5"
          className="animate-vein-red"
        />
        {/* Vein Red 3: Branching toward MVP card & Bottom Play Button */}
        <path
          d="M 320,380 Q 450,420 480,560 T 350,760 Q 380,880 500,940"
          fill="none"
          stroke="url(#redVeinGrad)"
          strokeWidth="3"
          className="animate-vein-red"
        />
        {/* Red Vein Minor Offshoots */}
        <path d="M 250,220 Q 320,200 360,250" fill="none" stroke="#ff1744" strokeWidth="1.5" className="animate-vein-red" />
        <path d="M 120,540 Q 60,600 40,680" fill="none" stroke="#ff1744" strokeWidth="1.5" className="animate-vein-red" />
        <path d="M 480,560 Q 560,600 620,580" fill="none" stroke="#ff1744" strokeWidth="1.5" className="animate-vein-red" />

        {/* --- ELECTRIC BLUE ENERGY VEINS (Wrapping from Right & Bottom across Cards) --- */}
        {/* Vein Blue 1: Top Right down around Stats Panel */}
        <path
          d="M 1020,80 Q 820,140 750,230 T 680,420 Q 780,520 860,620 T 820,800 Q 750,890 550,940"
          fill="none"
          stroke="url(#blueVeinGrad)"
          strokeWidth="3.5"
          className="animate-vein-blue"
        />
        {/* Vein Blue 2: Branch curling around Trophy from Right */}
        <path
          d="M 500,20 Q 580,80 570,150 T 620,240 Q 700,280 800,290"
          fill="none"
          stroke="url(#blueVeinGrad)"
          strokeWidth="2.5"
          className="animate-vein-blue"
        />
        {/* Vein Blue 3: Wrapping across the Bottom Play Button */}
        <path
          d="M 680,420 Q 550,460 520,600 T 650,780 Q 600,900 500,950"
          fill="none"
          stroke="url(#blueVeinGrad)"
          strokeWidth="3"
          className="animate-vein-blue"
        />
        {/* Blue Vein Minor Offshoots */}
        <path d="M 750,230 Q 680,200 640,250" fill="none" stroke="#00e5ff" strokeWidth="1.5" className="animate-vein-blue" />
        <path d="M 860,620 Q 920,680 950,760" fill="none" stroke="#00e5ff" strokeWidth="1.5" className="animate-vein-blue" />
        <path d="M 520,600 Q 440,640 380,620" fill="none" stroke="#00e5ff" strokeWidth="1.5" className="animate-vein-blue" />

        {/* --- GLOWING BRANCH INTERSECTION NODES --- */}
        <circle cx="250" cy="220" r="4.5" fill="#ff1744" filter="url(#glowFilter)" className="animate-vein-node" />
        <circle cx="320" cy="380" r="5" fill="#ff5252" filter="url(#glowFilter)" className="animate-vein-node" />
        <circle cx="120" cy="540" r="4" fill="#ff1744" filter="url(#glowFilter)" className="animate-vein-node" />
        <circle cx="750" cy="230" r="4.5" fill="#00e5ff" filter="url(#glowFilter)" className="animate-vein-node" />
        <circle cx="680" cy="420" r="5" fill="#2979ff" filter="url(#glowFilter)" className="animate-vein-node" />
        <circle cx="500" cy="945" r="6" fill="#ffd700" filter="url(#glowFilter)" className="animate-vein-node" />
        <circle cx="500" cy="20" r="5" fill="#ffd700" filter="url(#glowFilter)" className="animate-vein-node" />
      </svg>

      {/* 3D FLOATING CHAMPIONSHIP TROPHY & TITLE HEADER */}
      <div className="relative z-10 text-center space-y-4">
        
        {/* Floating Golden Trophy with Infinity Gems */}
        <div className="inline-block relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-[0_0_50px_rgba(255,215,0,0.7)] animate-bounce flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-black/90 flex flex-col items-center justify-center relative overflow-hidden">
              <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]" />
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" />
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#A855F7]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#FBBF24]" />
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#F97316]" />
              </div>
            </div>
          </div>
          <Crown className="w-10 h-10 text-amber-300 fill-amber-400 absolute -top-4 -right-3 animate-pulse drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]" />
        </div>

        {/* Grand Title Banner */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-red-950 via-amber-950 to-blue-950 border border-amber-400/80 shadow-[0_0_20px_rgba(230,36,41,0.5)] text-amber-300 font-extrabold text-xs uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span>MARVEL AUCTION SUPREMACY</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-gold-gradient tracking-wider uppercase drop-shadow-[0_0_35px_rgba(255,215,0,0.7)]">
            TOURNAMENT CHAMPION
          </h1>

          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="text-4xl">{champion.avatar}</span>
            <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wide drop-shadow-md">
              {champion.name}
            </h2>
          </div>
        </div>
      </div>

      {/* CHAMPION SHOWCASE & SQUAD SHOWCASE (Wrapped by Tendril Borders) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Champion Roster Showcase (7 cols) */}
        <div className="md:col-span-7 glass-panel p-6 rounded-3xl border-2 border-red-500/50 shadow-[0_0_35px_rgba(230,36,41,0.3)] space-y-4 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="text-xs font-black uppercase text-red-300 tracking-wider">
                VICTORIOUS SQUAD ({champion.collection.length} HEROES)
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Total Power: <strong className="text-amber-400 font-black">{champion.collection.reduce((sum, c) => sum + c.overallPower, 0)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {champion.collection.map(char => (
              <div key={char.id} className="flex flex-col items-center bg-black/60 p-2.5 rounded-2xl border border-red-500/30 text-center hover:border-red-400 transition-all shadow-sm">
                <CharacterPortrait character={char} size="sm" showBadge={true} />
                <span className="font-extrabold text-xs text-white mt-2 truncate w-full">
                  {char.name}
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  ⚡ {char.overallPower} PWR
                </span>
              </div>
            ))}
          </div>

          {/* MVP Card Callout & Hall of Fame Spotlight */}
          {mvpChar && (
            <div className="mt-4 p-5 bg-gradient-to-r from-red-950/90 via-purple-950/80 to-blue-950/90 rounded-3xl border-2 border-amber-400 shadow-[0_0_30px_rgba(255,215,0,0.35)] space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0 relative">
                  <CharacterPortrait character={mvpChar} size="lg" showBadge={true} />
                  <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg border border-white animate-bounce">
                    👑 MVP
                  </span>
                </div>
                <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>
                      {champion.stats.battlesWon >= 3 
                        ? '🏆 IMMORTAL DUEL TITAN' 
                        : champion.money >= 30 
                        ? '💰 AUCTION ECONOMY MASTER' 
                        : mvpChar.overallPower >= 95 
                        ? '🌌 COSMIC CATACLYSM APEX' 
                        : '⚔️ CLUTCH TOURNAMENT CONQUEROR'}
                    </span>
                  </div>

                  <h4 className="font-heading font-black text-2xl text-white truncate">
                    {mvpChar.name}
                  </h4>
                  <p className="text-xs text-gray-300 italic line-clamp-2">
                    "{mvpChar.description}"
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                    <span className="text-[11px] bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-lg border border-amber-500/40">
                      ⚡ {mvpChar.overallPower} POWER RATING
                    </span>
                    <span className="text-[11px] bg-red-500/20 text-red-300 font-extrabold px-2.5 py-0.5 rounded-lg border border-red-500/40">
                      🩸 UNDEFEATED FINISHER
                    </span>
                  </div>
                </div>
              </div>

              {/* WHY THEY WON: Victory Analytics Breakdown */}
              <div className="bg-black/60 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  WHY {champion.name.toUpperCase()} WON THE CHAMPIONSHIP:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5 space-y-0.5">
                    <strong className="text-white block">💥 Vanguard Superiority</strong>
                    <span className="text-slate-400 text-[11px]">
                      {mvpChar.name} led the charge with a peak <strong>{mvpChar.overallPower} Power</strong> rating, overwhelming rival frontlines.
                    </span>
                  </div>

                  <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5 space-y-0.5">
                    <strong className="text-white block">💎 Draft Economy</strong>
                    <span className="text-slate-400 text-[11px]">
                      Spent <strong>${champion.stats.moneySpent}</strong> across {champion.collection.length} lots while retaining <strong>${champion.money}</strong> in cash reserves.
                    </span>
                  </div>

                  <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5 space-y-0.5">
                    <strong className="text-white block">🎯 Auction Dominance</strong>
                    <span className="text-slate-400 text-[11px]">
                      Secured high-priority targets with a peak winning bid of <strong>${champion.stats.highestBid}</strong>.
                    </span>
                  </div>

                  <div className="p-2 bg-slate-900/60 rounded-xl border border-white/5 space-y-0.5">
                    <strong className="text-white block">⚡ Combat Execution</strong>
                    <span className="text-slate-400 text-[11px]">
                      Won <strong>{champion.stats.battlesWon} match duels</strong> to eliminate all competing contenders!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Final Tournament Statistics (5 cols) */}
        <div className="md:col-span-5 glass-panel p-6 rounded-3xl border-2 border-blue-500/50 shadow-[0_0_35px_rgba(59,130,246,0.3)] space-y-4 backdrop-blur-md">
          <span className="text-xs font-black uppercase tracking-wider text-blue-300 block border-b border-white/10 pb-2">
            Final Match Analytics & Records
          </span>

          <div className="space-y-3 text-xs">
            <StatRow
              icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
              label="Total Money Invested"
              value={`$${champion.stats.moneySpent}`}
            />
            <StatRow
              icon={<DollarSign className="w-4 h-4 text-amber-400" />}
              label="Banked Treasury Cash"
              value={`$${champion.money}`}
            />
            <StatRow
              icon={<Swords className="w-4 h-4 text-red-400" />}
              label="Match Duels Won"
              value={`${champion.stats.battlesWon}`}
            />
            <StatRow
              icon={<Award className="w-4 h-4 text-purple-400" />}
              label="Peak Winning Bid"
              value={`$${champion.stats.highestBid}`}
            />
            <StatRow
              icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
              label="Total Squad Power"
              value={`${champion.collection.reduce((sum, c) => sum + c.overallPower, 0)} PWR`}
            />
          </div>

          <div className="pt-4 relative">
            <button
              onClick={() => {
                soundManager.playClick();
                onPlayAgain();
              }}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-amber-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-heading font-black text-lg uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.6)] border border-amber-400 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5 animate-spin" />
              <span>PLAY NEW TOURNAMENT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-black/50 rounded-xl border border-white/10">
      <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-heading font-black text-sm text-white">{value}</span>
    </div>
  );
}

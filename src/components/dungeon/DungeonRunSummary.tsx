import React from 'react';
import { DungeonRunState } from '../../types/dungeon';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import confetti from 'canvas-confetti';
import { 
  Trophy, Skull, Crown, Sparkles, Coins, Package, 
  Swords, ArrowRight, ShieldCheck, Zap, Heart, Flame, Award
} from 'lucide-react';

interface Props {
  runState: DungeonRunState;
  finalRewards?: {
    astraAwarded?: number;
    shardsAwarded?: number;
    cratesAwarded?: number;
    draftShardsAwarded?: Record<string, number>;
    xpAwarded?: { total: number };
  } | null;
  onExit: () => void;
}

export function DungeonRunSummary({ runState, finalRewards, onExit }: Props) {
  const { user } = useAuth();
  const isVictory = runState.isComplete && !runState.isGameOver;
  const wavesCompleted = runState.currentWave || runState.currentFloor || 1;
  const previousPeak = user?.dungeonPeak || user?.dungeonMaxWave || 0;
  const currentRunMaxWave = runState.maxWaveReached || wavesCompleted;
  const isNewRecord = currentRunMaxWave > previousPeak;
  const newDungeonPeak = Math.max(previousPeak, currentRunMaxWave);

  React.useEffect(() => {
    if (isVictory || isNewRecord) {
      soundManager.playVictoryFanfare();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [isVictory, isNewRecord]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn select-none p-4 pb-16">
      
      {/* 1. Master Plaque */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-5 shadow-2xl relative overflow-hidden ${
        isNewRecord || isVictory
          ? 'bg-gradient-to-b from-[#1C1508] via-[#0E0B04] to-black border-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.5)]'
          : 'bg-gradient-to-b from-[#1E080C] via-[#0D0204] to-black border-red-600 shadow-[0_0_80px_rgba(225,29,72,0.4)]'
      }`}>
        
        {/* New Dungeon Peak Banner */}
        {isNewRecord && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-heading font-black text-xs uppercase tracking-widest shadow-glow-gold animate-bounce">
            <Crown className="w-4 h-4 text-black" />
            <span>NEW DUNGEON PEAK! {newDungeonPeak} WAVES</span>
          </div>
        )}

        {/* Badge Icon */}
        <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-2xl border-2 ${
          isVictory || isNewRecord
            ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black border-amber-200'
            : 'bg-gradient-to-br from-red-600 to-rose-900 text-white border-red-400'
        }`}>
          {isVictory || isNewRecord ? '👑' : '💀'}
        </div>

        <div className="space-y-1">
          <span className={`px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest inline-block border ${
            isVictory || isNewRecord
              ? 'bg-amber-500/20 text-amber-300 border-amber-400'
              : 'bg-red-500/20 text-red-300 border-red-500'
          }`}>
            DUNGEON BATTLE SUMMARY
          </span>
          <h1 className={`text-2xl sm:text-4xl font-heading font-black uppercase tracking-wider ${
            isVictory || isNewRecord ? 'text-amber-300' : 'text-red-400'
          }`}>
            {isVictory ? 'DUNGEON EXPEDITION CONQUERED!' : 'EXPEDITION TERMINATED'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            {isVictory
              ? `Incredible tactical valor! You conquered the dungeon and reached Wave ${wavesCompleted}!`
              : `Your squad fell in combat on Wave ${wavesCompleted}. All earned Astra, Shards, and Crates have been safely deposited.`}
          </p>
        </div>

        {/* 2. Official Record & Wave Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
          <div className="p-3.5 rounded-2xl bg-black/80 border border-white/10 space-y-1">
            <span className="text-xs font-mono text-slate-400 block uppercase font-bold">Waves Completed</span>
            <span className="text-2xl font-heading font-black text-white">{wavesCompleted}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/80 border border-amber-500/40 space-y-1">
            <span className="text-xs font-mono text-amber-400 block uppercase font-bold">Dungeon Peak</span>
            <span className="text-2xl font-heading font-black text-amber-300">{newDungeonPeak} Waves</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/80 border border-white/10 space-y-1">
            <span className="text-xs font-mono text-slate-400 block uppercase font-bold">Previous Peak</span>
            <span className="text-2xl font-heading font-black text-slate-300">{previousPeak} Waves</span>
          </div>

          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            isNewRecord ? 'bg-amber-950/70 border-amber-400' : 'bg-black/80 border-white/10'
          }`}>
            <span className="text-xs font-mono text-slate-400 block uppercase font-bold">New Record</span>
            <span className={`text-2xl font-heading font-black ${isNewRecord ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`}>
              {isNewRecord ? 'YES 🌟' : 'NO'}
            </span>
          </div>
        </div>

        {/* 3. Authentic Economy Rewards Awarded */}
        <div className="p-5 rounded-2xl bg-black/80 border border-white/10 max-w-2xl mx-auto space-y-3">
          <h3 className="text-xs font-heading font-black text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Authentic Ascension Spoils Deposited
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {/* Astra */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
              <span className="text-xl">✨</span>
              <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Astra Earned</div>
              <div className="text-sm font-heading font-black text-amber-300">
                +{(finalRewards?.astraAwarded || runState.dungeonAstra || 500).toLocaleString()}
              </div>
            </div>

            {/* XP */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
              <span className="text-xl">⚡</span>
              <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Account XP</div>
              <div className="text-sm font-heading font-black text-cyan-300">
                +{(finalRewards?.xpAwarded?.total || wavesCompleted * 45).toLocaleString()} XP
              </div>
            </div>

            {/* Card Shards */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
              <span className="text-xl">🃏</span>
              <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Card Shards</div>
              <div className="text-sm font-heading font-black text-purple-300">
                +{finalRewards?.shardsAwarded || wavesCompleted * 5}
              </div>
            </div>

            {/* Relics Used */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
              <span className="text-xl">🔮</span>
              <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Relics Used</div>
              <div className="text-sm font-heading font-black text-emerald-400">
                {runState.activeRelics.length} Relics
              </div>
            </div>
          </div>
        </div>

        {/* 4. Detailed Combat Metrics */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Enemies Defeated:</span>
              <span className="text-white font-bold">{runState.runStats.battlesWon || wavesCompleted} Foe(s)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Bosses Slayed:</span>
              <span className="text-amber-400 font-bold">{runState.runStats.bossesConquered} Titans</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Damage:</span>
              <span className="text-red-400 font-bold">{(runState.runStats.totalDamageDealt || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Turns Taken:</span>
              <span className="text-cyan-400 font-bold">{runState.runStats.turnsTaken || 0} Turns</span>
            </div>
          </div>
        </div>

        {/* 5. Return Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onExit}
            className="w-full sm:w-auto px-12 py-4 rounded-2xl font-heading font-black text-base uppercase tracking-wider shadow-2xl transition-all transform hover:scale-105 cursor-pointer inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-glow-gold"
          >
            <span>RETURN TO ASCENSION HEADQUARTERS</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

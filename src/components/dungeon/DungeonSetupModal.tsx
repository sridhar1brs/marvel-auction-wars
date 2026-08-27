import React, { useState } from 'react';
import { DungeonSettings } from '../../types/dungeon';
import { DEFAULT_DUNGEON_SETTINGS } from '../../engine/dungeonEngine';
import { Swords, Flame, Sparkles, Shield, ArrowRight, ArrowLeft, Sliders, Play, RotateCcw, Users, User } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  onStartDungeon: (settings: DungeonSettings) => void;
  onBack: () => void;
}

export function DungeonSetupModal({ onStartDungeon, onBack }: Props) {
  const [gameplayMode, setGameplayMode] = useState<'solo' | 'same_device'>('solo');
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [totalWaves, setTotalWaves] = useState<number>(3);
  const [rerollFrequency, setRerollFrequency] = useState<number>(1);
  const [gradeCMax, setGradeCMax] = useState<number>(15);
  const [gradeBMax, setGradeBMax] = useState<number>(30);
  const [gradeAMax, setGradeAMax] = useState<number>(40);
  const [cosmicStart, setCosmicStart] = useState<number>(41);
  const [startingPotions, setStartingPotions] = useState<number>(3);

  const handleNameChange = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const handleStart = () => {
    soundManager.playClick();
    const effectiveCount = gameplayMode === 'solo' ? 1 : playerCount;
    const effectiveNames = gameplayMode === 'solo' 
      ? [playerNames[0] || 'Solo Explorer'] 
      : playerNames.slice(0, effectiveCount).map((name, i) => name.trim() || `Player ${i + 1}`);

    onStartDungeon({
      totalWaves,
      rerollFrequency,
      gradeWaveMilestones: {
        gradeCMax,
        gradeBMax,
        gradeAMax,
        cosmicStart
      },
      startingHealingPotions: startingPotions,
      gameplayMode,
      playerCount: effectiveCount,
      playerNames: effectiveNames
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#1C1508] via-[#2A1D0B] to-[#120D04] p-5 rounded-3xl border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="px-4 py-2 bg-black/60 hover:bg-stone-800 text-amber-300 hover:text-amber-200 rounded-xl border border-amber-500/40 transition-all flex items-center gap-2 text-xs font-black uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Exit to Menu</span>
        </button>

        <div className="text-center flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-1">
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>ANCIENT RUINS WAVE SURVIVAL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase tracking-wider">
            DUNGEON CONFIGURATION
          </h1>
        </div>

        <div className="w-20 shrink-0" />
      </div>

      {/* Mode Selector: Solo vs Same Device Co-op */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-[#0C0E14]/90 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Users className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-heading font-black text-white uppercase tracking-wide">
            DUNGEON MULTIPLAYER MODE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Solo Option */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setGameplayMode('solo');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              gameplayMode === 'solo'
                ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-black/40 border-white/10 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <User className="w-5 h-5 text-amber-400" />
              <span className="font-heading font-black text-white text-base">SOLO EXPLORER</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              1 Player. Summon a single hero and test your tactical endurance solo against all dungeon waves.
            </p>
          </button>

          {/* Same-Device Multiplayer Option */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setGameplayMode('same_device');
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              gameplayMode === 'same_device'
                ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-black/40 border-white/10 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <Users className="w-5 h-5 text-amber-400" />
              <span className="font-heading font-black text-white text-base">SAME-DEVICE MULTIPLAYER</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              2 to 4 Players on 1 Screen. Each player randomizes their own hero and takes turns attacking the boss!
            </p>
          </button>
        </div>

        {/* Player Count & Names for Same-Device Mode */}
        {gameplayMode === 'same_device' && (
          <div className="pt-3 border-t border-white/10 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-300 uppercase tracking-wide">
                Number of Local Players:
              </label>
              <div className="flex items-center gap-2">
                {[2, 3, 4].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setPlayerCount(count);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      playerCount === count
                        ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : 'bg-black/50 text-slate-300 border-white/10 hover:border-amber-500/40'
                    }`}
                  >
                    {count} PLAYERS
                  </button>
                ))}
              </div>
            </div>

            {/* Player Name Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {Array.from({ length: playerCount }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-black/60 p-2.5 rounded-xl border border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-amber-950 text-amber-300 font-mono text-xs font-black flex items-center justify-center shrink-0 border border-amber-500/30">
                    P{idx + 1}
                  </span>
                  <input
                    type="text"
                    maxLength={16}
                    value={playerNames[idx] || `Player ${idx + 1}`}
                    onChange={e => handleNameChange(idx, e.target.value)}
                    className="w-full bg-transparent text-xs text-white font-bold outline-none placeholder-slate-500"
                    placeholder={`Player ${idx + 1} Name`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Wave Setup & Milestone Customizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Wave Length & Hero Reroll Frequency */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-[#0C0E14]/90 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-heading font-black text-white uppercase tracking-wide">
              DUNGEON CHALLENGE LENGTH
            </h2>
          </div>

          {/* 1. Total Waves Slider & Input (1 to 300) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-300 uppercase tracking-wide">
                Total Waves (1 - 300):
              </label>
              <div className="flex items-center gap-1.5 bg-black/60 border border-amber-500/40 px-3 py-1 rounded-xl">
                <span className="text-xl font-black text-amber-400 font-heading">{totalWaves}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">WAVES</span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={300}
              value={totalWaves}
              onChange={e => setTotalWaves(parseInt(e.target.value) || 1)}
              className="w-full h-2.5 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[3, 10, 25, 40, 100].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTotalWaves(preset)}
                  className={`py-1.5 rounded-lg text-xs font-black transition-all border cursor-pointer ${
                    totalWaves === preset
                      ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-black/40 text-slate-300 border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  {preset}W
                </button>
              ))}
            </div>
          </div>

          {/* 2. Hero Re-Randomization Frequency */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                Randomize New Hero Every:
              </label>
              <span className="text-xs font-black text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-0.5 rounded-lg">
                {rerollFrequency === 1 ? 'Every 1 Round' : `Every ${rerollFrequency} Rounds`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 5].map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setRerollFrequency(freq)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border flex flex-col items-center justify-center cursor-pointer ${
                    rerollFrequency === freq
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                      : 'bg-black/40 text-slate-300 border-white/10 hover:border-cyan-500/40'
                  }`}
                >
                  <span>{freq === 1 ? '1 Round' : `${freq} Rounds`}</span>
                  <span className="text-[9px] opacity-75 font-semibold">{freq === 1 ? 'New Every Wave' : 'Keep Fighter'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Starting Healing Potions */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Starting Healing Potions:
              </label>
              <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-lg">
                {startingPotions} Potions (+45 HP each)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 5, 10].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setStartingPotions(p)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                    startingPotions === p
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-black/40 text-slate-300 border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  {p} POTIONS
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Milestone Configuration */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-[#0C0E14]/90 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-white uppercase tracking-wide">
                ENEMY GRADE WAVE MILESTONES
              </h2>
              <p className="text-[11px] text-slate-400">
                Choose at which wave tier each enemy character grade starts appearing.
              </p>
            </div>
          </div>

          {/* Grade C Range */}
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                GRADE C (Lower Tier Enemies)
              </span>
              <span className="text-xs font-black text-white">Waves 1 to {gradeCMax}</span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.min(totalWaves, 50)}
              value={gradeCMax}
              onChange={e => setGradeCMax(parseInt(e.target.value) || 1)}
              className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Grade B Range */}
          <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-blue-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                GRADE B (Strong Enemies)
              </span>
              <span className="text-xs font-black text-white">Waves {gradeCMax + 1} to {gradeBMax}</span>
            </div>
            <input
              type="range"
              min={gradeCMax + 1}
              max={Math.min(totalWaves, 100)}
              value={gradeBMax}
              onChange={e => setGradeBMax(parseInt(e.target.value) || gradeCMax + 1)}
              className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Grade A Range */}
          <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-red-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                GRADE A (Elite Heavyweights)
              </span>
              <span className="text-xs font-black text-white">Waves {gradeBMax + 1} to {gradeAMax}</span>
            </div>
            <input
              type="range"
              min={gradeBMax + 1}
              max={Math.min(totalWaves, 150)}
              value={gradeAMax}
              onChange={e => {
                const val = parseInt(e.target.value) || gradeBMax + 1;
                setGradeAMax(val);
                setCosmicStart(val + 1);
              }}
              className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Cosmic / Mythic Range */}
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                MYTHIC & COSMIC ENTITIES
              </span>
              <span className="text-xs font-black text-amber-300">Wave {cosmicStart}+ onwards</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              Cosmic deities (Knull, Galactus, Infinity Ultron, Dormammu, Beyonder) enter the dungeon sanctum from Wave <strong>{cosmicStart}</strong> to <strong>{totalWaves}</strong>!
            </p>
          </div>
        </div>
      </div>

      {/* Enter Dungeon CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={handleStart}
          className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-red-600 to-amber-500 hover:from-amber-400 hover:to-red-500 text-white font-heading font-black text-lg sm:text-xl uppercase tracking-widest shadow-[0_0_35px_rgba(245,158,11,0.5)] transform hover:scale-105 transition-all inline-flex items-center gap-3 cursor-pointer"
        >
          <Swords className="w-6 h-6 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span>ENTER ANCIENT RUINS DUNGEON</span>
          <ArrowRight className="w-6 h-6 text-amber-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

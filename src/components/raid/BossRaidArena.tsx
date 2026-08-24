import React, { useState, useEffect, useMemo } from 'react';
import { Player, Character, BattleActionType, BossRaidState } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { UltimateAnimationOverlay } from '../common/UltimateAnimationOverlay';
import { FloatingReactions } from '../common/FloatingReactions';
import { getFighterTagTeamCombo } from '../../engine/synergyEngine';
import { 
  Swords, Shield, Zap, Sparkles, Heart, Flame, Skull, Trophy, ArrowRight, RotateCcw, Activity, RefreshCw, Plus
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import confetti from 'canvas-confetti';

interface Props {
  players: Player[];
  onExitRaid: () => void;
}

// Iconic default strike team heroes if players haven't drafted yet
const DEFAULT_HERO_NAMES = [
  'Iron Man', 'Captain America', 'Thor', 'Spider-Man',
  'Wolverine', 'Doctor Strange', 'Scarlet Witch', 'Hulk'
];

export function BossRaidArena({ players, onExitRaid }: Props) {
  const [bossChoice, setBossChoice] = useState<'infinity_ultron' | 'galactus' | 'thanos'>('infinity_ultron');
  const [selectedHeroIdx, setSelectedHeroIdx] = useState(0);
  const [selectedAction, setSelectedAction] = useState<BattleActionType>('ATTACK');
  const [isClashing, setIsClashing] = useState(false);

  // Build the united raid team from players' collections, or create a default 4-6 hero strike team
  const [raidTeam, setRaidTeam] = useState<Character[]>(() => {
    const existingHeroes = players.flatMap(p => p.collection || []);
    if (existingHeroes.length > 0) {
      return existingHeroes.map(c => ({
        ...c,
        currentHp: c.currentHp !== undefined ? c.currentHp : (c.maxHp || 100),
        maxHp: c.maxHp || 100,
        isFainted: false,
      }));
    }

    // Default strike squad from ALL_CHARACTERS
    const defaultSquad = DEFAULT_HERO_NAMES
      .map(name => ALL_CHARACTERS.find(c => c.name.toLowerCase().includes(name.toLowerCase())))
      .filter((c): c is Character => !!c)
      .slice(0, 6)
      .map(c => ({
        ...c,
        currentHp: 100,
        maxHp: 100,
        isFainted: false,
      }));

    return defaultSquad.length > 0 ? defaultSquad : ALL_CHARACTERS.slice(0, 6).map(c => ({ ...c, currentHp: 100, maxHp: 100 }));
  });

  // Boss configurations
  const bossConfigs = useMemo(() => ({
    infinity_ultron: {
      name: 'Infinity Ultron',
      title: 'Supreme Multiverse Destroyer',
      maxHp: 600,
      imageUrl: '/images/characters/char-m-026.jpg',
      introLog: '⚡ RAID COMMENCED! Infinity Ultron wields all 6 Infinity Stones & Multiverse Cleave!',
      specialName: '🌌 INFINITY STONES OBLIVION'
    },
    galactus: {
      name: 'Galactus',
      title: 'Devourer of Worlds',
      maxHp: 500,
      imageUrl: '/images/characters/char-m-002.jpg',
      introLog: '⚡ RAID COMMENCED! Galactus channels the infinite Power Cosmic!',
      specialName: '🪐 PLANETARY CONVERGENCE'
    },
    thanos: {
      name: 'Thanos (Infinity Gauntlet)',
      title: 'The Mad Titan',
      maxHp: 550,
      imageUrl: '/images/characters/char-m-010.jpg',
      introLog: '⚡ RAID COMMENCED! Thanos stands ready with the complete Infinity Gauntlet!',
      specialName: '💥 TITAN METEOR CRUSH'
    }
  }), []);

  const currentBossConfig = bossConfigs[bossChoice];

  // Boss State
  const [bossHp, setBossHp] = useState(currentBossConfig.maxHp);
  const [bossPhase, setBossPhase] = useState<1 | 2>(1);
  const [combatLog, setCombatLog] = useState<string[]>([currentBossConfig.introLog]);
  const [isDefeated, setIsDefeated] = useState(false);

  // Reset Boss when changing selection
  const switchBoss = (choice: 'infinity_ultron' | 'galactus' | 'thanos') => {
    soundManager.playClick();
    setBossChoice(choice);
    const cfg = bossConfigs[choice];
    setBossHp(cfg.maxHp);
    setBossPhase(1);
    setIsDefeated(false);
    setCombatLog([cfg.introLog]);
  };

  // Reset Team Health
  const resetTeam = () => {
    soundManager.playClick();
    setRaidTeam(prev => prev.map(c => ({ ...c, currentHp: 100, isFainted: false })));
    setBossHp(currentBossConfig.maxHp);
    setBossPhase(1);
    setIsDefeated(false);
    setSelectedHeroIdx(0);
    setCombatLog([`🔄 RAID RESET! Your squad of ${raidTeam.length} heroes stands ready for battle!`]);
  };

  // Ultimate Cinematic Overlay State
  const [ultimateOverlay, setUltimateOverlay] = useState<{
    isOpen: boolean;
    type: 'special' | 'dual_strike' | 'boss_ultimate' | 'relic';
    heroName: string;
    partnerHeroName?: string;
    abilityTitle: string;
    description: string;
    bannerColor?: string;
    damageBonus?: number;
  }>({
    isOpen: false,
    type: 'special',
    heroName: '',
    abilityTitle: '',
    description: ''
  });

  const activeHero: Character = raidTeam[selectedHeroIdx] || raidTeam[0];
  const livingHeroes = raidTeam.filter(c => (c.currentHp === undefined || c.currentHp > 0));
  const isTeamWiped = livingHeroes.length === 0;
  const activeCombo = activeHero ? getFighterTagTeamCombo(activeHero, raidTeam) : null;

  // Auto-switch to first alive hero if current active hero faints
  useEffect(() => {
    if (activeHero && activeHero.currentHp !== undefined && activeHero.currentHp <= 0) {
      const nextAliveIdx = raidTeam.findIndex(c => (c.currentHp === undefined || c.currentHp > 0));
      if (nextAliveIdx !== -1) {
        setSelectedHeroIdx(nextAliveIdx);
      }
    }
  }, [activeHero, raidTeam]);

  // Execute Raid Combat Turn
  const handleExecuteRaidAttack = () => {
    if (isDefeated || isTeamWiped || isClashing || !activeHero) return;

    soundManager.playClick();
    setIsClashing(true);
    soundManager.playAttackHit();

    // 1. Calculate Player Strike Damage
    const basePwr = activeHero.overallPower || 85;
    const roll = Math.floor(Math.random() * 20) + 1;
    let bonus = 0;

    if (selectedAction === 'SPECIAL') {
      bonus = 22;
      setUltimateOverlay({
        isOpen: true,
        type: 'special',
        heroName: activeHero.name,
        abilityTitle: activeHero.specialAbilities?.[0]?.name || 'SIGNATURE SUPERPOWER',
        description: activeHero.specialAbilities?.[0]?.description || activeHero.powers || 'Unleashes devastating superhero burst!',
        bannerColor: activeHero.color || '#06B6D4',
        damageBonus: 22
      });
    } else if (selectedAction === 'DUAL_STRIKE' && activeCombo) {
      bonus = 32;
      setUltimateOverlay({
        isOpen: true,
        type: 'dual_strike',
        heroName: activeHero.name,
        partnerHeroName: activeCombo.hero2Name === activeHero.name ? activeCombo.hero1Name : activeCombo.hero2Name,
        abilityTitle: activeCombo.comboTitle,
        description: activeCombo.comboDescription,
        bannerColor: activeCombo.bannerColor,
        damageBonus: activeCombo.bonusDualDamage
      });
    } else if (selectedAction === 'ARTIFACT') {
      bonus = 16;
    }

    const heroDamage = Math.max(25, Math.round((basePwr + roll + bonus) * 0.70));
    const newBossHp = Math.max(0, bossHp - heroDamage);

    // 2. Calculate Boss Counter-Attack
    let bossBaseDamage = Math.floor(Math.random() * 18) + 20;
    if (selectedAction === 'DEFEND') {
      bossBaseDamage = Math.max(8, Math.round(bossBaseDamage * 0.5)); // 50% Kinetic Guard
    }
    if (bossPhase === 2) {
      bossBaseDamage = Math.round(bossBaseDamage * 1.4); // Enraged multiplier
    }

    const heroPrevHp = activeHero.currentHp ?? 100;
    const heroNewHp = Math.max(0, heroPrevHp - bossBaseDamage);

    // Update Team State
    setRaidTeam(prev => prev.map((c, i) => {
      if (i === selectedHeroIdx) {
        return {
          ...c,
          currentHp: heroNewHp,
          isFainted: heroNewHp <= 0
        };
      }
      return c;
    }));

    // Update Boss State
    setBossHp(newBossHp);
    const newPhase = newBossHp <= currentBossConfig.maxHp * 0.5 ? 2 : 1;
    setBossPhase(newPhase);

    const logEntries = [
      `⚔️ ${activeHero.name} used ${selectedAction} dealing 💥 ${heroDamage} DAMAGE to ${currentBossConfig.name}!`,
      `⚠️ ${currentBossConfig.name} counter-attacked with ${currentBossConfig.specialName} for 🩸 ${bossBaseDamage} damage on ${activeHero.name}! (${heroNewHp}/100 HP)`
    ];

    if (heroNewHp <= 0) {
      logEntries.push(`💀 ${activeHero.name} HAS FAINTED! Next hero deploying...`);
    }

    if (newBossHp <= 0) {
      setIsDefeated(true);
      soundManager.playVictory();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      logEntries.push(`👑 VICTORY! ${currentBossConfig.name} HAS BEEN VANQUISHED!`);
    }

    setCombatLog(prev => [...logEntries, ...prev.slice(0, 10)]);

    setTimeout(() => {
      setIsClashing(false);
    }, 500);
  };

  const bossHpPercent = Math.round((bossHp / currentBossConfig.maxHp) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. TOP TITAN BANNER & MODE SELECTOR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-red-950/90 via-purple-950/90 to-black border-2 border-red-500/50 shadow-2xl backdrop-blur-xl">
        <div className="text-center md:text-left space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-900/60 border border-red-500/50 text-[11px] font-black uppercase text-red-200 tracking-widest">
            <Skull className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>COOPERATIVE PVE TITAN RAID ARENA</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            RAID BOSS: {currentBossConfig.name}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Unite your Marvel squad to bring down universe-ending cosmic titans!
          </p>
        </div>

        {/* Boss Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-black/70 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => switchBoss('infinity_ultron')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              bossChoice === 'infinity_ultron'
                ? 'bg-cyan-600 text-white shadow-glow-cosmic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌌 Ultron (600 HP)
          </button>
          <button
            onClick={() => switchBoss('galactus')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              bossChoice === 'galactus'
                ? 'bg-purple-600 text-white shadow-glow-cosmic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🪐 Galactus (500 HP)
          </button>
          <button
            onClick={() => switchBoss('thanos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              bossChoice === 'thanos'
                ? 'bg-amber-600 text-white shadow-glow-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            👑 Thanos (550 HP)
          </button>
          <button
            onClick={resetTeam}
            title="Reset Raid & Heal Team"
            className="p-2 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN BATTLEFIELD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Titan Boss Showcase (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border-2 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.3)] space-y-4 text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-500/40">
              PHASE {bossPhase} {bossPhase === 2 && '🔥 ENRAGED (+40% DMG)'}
            </span>
            <span className="text-xs font-mono font-black text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              {bossHp} / {currentBossConfig.maxHp} HP
            </span>
          </div>

          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-3xl overflow-hidden border-4 border-red-500 shadow-2xl bg-black">
            <img 
              src={currentBossConfig.imageUrl} 
              alt={currentBossConfig.name} 
              onError={(e) => {
                const el = e.currentTarget;
                if (!el.dataset.failed) {
                  el.dataset.failed = '1';
                  el.src = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/680-ultron.jpg';
                }
              }}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" 
            />
            {bossPhase === 2 && (
              <div className="absolute inset-0 bg-red-600/30 mix-blend-overlay animate-pulse" />
            )}
          </div>

          <div>
            <h2 className="font-heading font-black text-3xl text-white drop-shadow">
              {currentBossConfig.name}
            </h2>
            <p className="text-xs text-red-300 font-semibold italic">
              {currentBossConfig.title}
            </p>
          </div>

          {/* Boss Massive Health Bar */}
          <div className="space-y-1.5 bg-black/70 p-3.5 rounded-2xl border border-white/10">
            <div className="flex justify-between text-xs font-black text-slate-300">
              <span>BOSS INTEGRITY</span>
              <span className="text-red-400 font-mono">{bossHpPercent}%</span>
            </div>
            <div className="w-full h-5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-red-500/40">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-500 shadow-glow-red"
                style={{ width: `${bossHpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Active Player Strike Station (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border-2 border-cyan-500/60 shadow-glow-cosmic space-y-4">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <span className="text-xs font-black text-cyan-300 uppercase block">Active Fielded Hero:</span>
                <h3 className="font-heading font-black text-lg text-white">{activeHero?.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-bold">Squad Life:</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-black border border-emerald-500/40">
                {livingHeroes.length}/{raidTeam.length} ALIVE
              </span>
            </div>
          </div>

          {/* Active Fielded Hero Details Card */}
          {activeHero && (
            <div className="flex items-center gap-4 bg-black/60 p-4 rounded-2xl border border-white/15">
              <CharacterPortrait character={activeHero} size="md" showBadge={true} />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-heading font-black text-xl text-white truncate">{activeHero.name}</h4>
                  <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40">
                    ⚡ PWR {activeHero.overallPower}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                    <span>HERO HEALTH</span>
                  </span>
                  <span className="font-mono text-emerald-400">{activeHero.currentHp ?? 100} / 100 HP</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, activeHero.currentHp ?? 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Command Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setSelectedAction('ATTACK')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'ATTACK'
                  ? 'bg-cyan-900/80 border-cyan-400 ring-2 ring-cyan-400 shadow-glow-cosmic scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-cyan-200">
                <Swords className="w-4 h-4 text-cyan-400" />
                <span>⚔️ STRIKE ATTACK</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Heavy kinetic physical assault</span>
            </button>

            <button
              onClick={() => setSelectedAction('SPECIAL')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'SPECIAL'
                  ? 'bg-purple-900/80 border-purple-400 ring-2 ring-purple-400 shadow-glow-cosmic scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-purple-200 truncate">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">⚡ {activeHero?.specialAbilities?.[0]?.name || 'SUPERPOWER'}</span>
              </div>
              <span className="text-[10px] text-purple-300 block mt-0.5">+22 Raid Bonus Damage</span>
            </button>

            <button
              onClick={() => setSelectedAction('DEFEND')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'DEFEND'
                  ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400 scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-blue-200">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>🛡️ TITAN SHIELD</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cuts boss retaliation by 50%</span>
            </button>

            <button
              onClick={() => setSelectedAction('ARTIFACT')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'ARTIFACT'
                  ? 'bg-amber-900/80 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>🔮 RELIC SURGE</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">+16 Cosmic Relic Damage</span>
            </button>

            {activeCombo && (
              <button
                onClick={() => setSelectedAction('DUAL_STRIKE')}
                className={`col-span-1 sm:col-span-2 p-3 rounded-xl border text-left transition-all ${
                  selectedAction === 'DUAL_STRIKE'
                    ? 'bg-gradient-to-r from-red-950 via-amber-900 to-purple-950 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                    : 'bg-gradient-to-r from-red-950/60 to-purple-950/60 border-amber-500/50 hover:border-amber-400 text-amber-200 animate-pulse'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-black text-xs text-amber-300 truncate">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                    <span className="truncate">🔥 {activeCombo.comboTitle}</span>
                  </div>
                  <span className="text-[10px] bg-red-950 text-red-300 font-extrabold px-2 py-0.5 rounded border border-red-500/40 shrink-0">
                    +{activeCombo.bonusDualDamage} DMG
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Launch Attack Button */}
          <button
            onClick={handleExecuteRaidAttack}
            disabled={isDefeated || isTeamWiped || isClashing}
            className={`w-full py-4 rounded-2xl font-heading font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 mt-4 ${
              isTeamWiped
                ? 'bg-red-950/60 border-red-950 text-red-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-red-600 via-purple-600 to-rose-600 hover:from-red-500 hover:to-purple-500 text-white shadow-[0_0_35px_rgba(239,68,68,0.7)] border-2 border-amber-400 hover:scale-[1.01] active:scale-98 animate-pulse'
            }`}
          >
            <Swords className="w-5 h-5 animate-spin" />
            <span>
              {isTeamWiped
                ? '💀 ENTIRE SQUAD DEFEATED • RESET TO RETRY'
                : `⚡ UNLEASH STRIKE AGAINST ${currentBossConfig.name.toUpperCase()}! ⚡`}
            </span>
          </button>
        </div>
      </div>

      {/* 3. HERO SQUAD BENCH DOCK (Switch Hero On The Fly) */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>YOUR RAID STRIKE TEAM ({raidTeam.length} HEROES • CLICK TO DEPLOY ACTIVE FIGHTER):</span>
          </span>
          <button
            onClick={resetTeam}
            className="text-[11px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/40"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Revive / Reset Squad</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {raidTeam.map((hero, i) => {
            const isFainted = hero.currentHp !== undefined && hero.currentHp <= 0;
            const isSelected = selectedHeroIdx === i;

            return (
              <button
                key={`${hero.id}-${i}`}
                disabled={isFainted}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedHeroIdx(i);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center gap-2 ${
                  isFainted
                    ? 'bg-red-950/20 border-red-950 opacity-40 grayscale cursor-not-allowed'
                    : isSelected
                    ? 'bg-gradient-to-b from-cyan-950 to-black border-cyan-400 ring-2 ring-cyan-400/80 shadow-glow-cosmic scale-105'
                    : 'bg-black/60 border-white/10 hover:border-cyan-500/50'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 bg-slate-900">
                  <img 
                    src={`/images/characters/${hero.id}.jpg`} 
                    alt={hero.name} 
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (!el.dataset.failed) {
                        el.dataset.failed = '1';
                        el.src = hero.imageUrl;
                      }
                    }}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="text-center w-full min-w-0">
                  <span className="text-xs font-black text-white block truncate leading-tight">{hero.name}</span>
                  <span className={`text-[10px] font-black block mt-0.5 ${isFainted ? 'text-red-500' : 'text-emerald-400'}`}>
                    {isFainted ? '💀 FAINTED' : `❤️ ${hero.currentHp ?? 100} HP`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. LIVE COMBAT RADAR LOG */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
        <span className="text-xs font-black uppercase text-slate-400 block border-b border-white/10 pb-1">
          📜 Live Raid Combat Radar Telemetry
        </span>
        <div className="space-y-1 font-mono text-xs max-h-36 overflow-y-auto">
          {combatLog.map((log, i) => (
            <div key={i} className="text-slate-300 py-0.5 border-b border-white/5 last:border-0">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* 5. VICTORY BANNER OVERLAY */}
      {isDefeated && (
        <div className="glass-panel-glow p-8 rounded-3xl border-2 border-emerald-500/70 text-center space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.6)] animate-bounce">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-400 text-xs font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400 animate-spin" />
            <span>TITAN DEFEATED • THE MULTIVERSE IS SAVED!</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white drop-shadow">
            👑 COSMIC RAID VICTORY!
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Your strike squad successfully destroyed {currentBossConfig.name}! All cosmic dimensions are restored!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={resetTeam}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-glow-cosmic"
            >
              Fight Again / Next Titan
            </button>
            <button
              onClick={onExitRaid}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg"
            >
              Return to Main Menu
            </button>
          </div>
        </div>
      )}

      {/* 6. ULTIMATE ANIMATION OVERLAY */}
      <UltimateAnimationOverlay
        isOpen={ultimateOverlay.isOpen}
        type={ultimateOverlay.type}
        heroName={ultimateOverlay.heroName}
        partnerHeroName={ultimateOverlay.partnerHeroName}
        abilityTitle={ultimateOverlay.abilityTitle}
        description={ultimateOverlay.description}
        bannerColor={ultimateOverlay.bannerColor}
        damageBonus={ultimateOverlay.damageBonus}
        onComplete={() => setUltimateOverlay(prev => ({ ...prev, isOpen: false }))}
      />

      <FloatingReactions playerName="Raid Leader" />
    </div>
  );
}

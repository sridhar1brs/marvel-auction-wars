import React, { useState, useEffect } from 'react';
import { Player, Character, BattleActionType, BossRaidState } from '../../types/game';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { UltimateAnimationOverlay } from '../common/UltimateAnimationOverlay';
import { FloatingReactions } from '../common/FloatingReactions';
import { getFighterTagTeamCombo } from '../../engine/synergyEngine';
import { 
  Swords, Shield, Zap, Sparkles, Heart, Flame, Skull, Trophy, ArrowRight, RotateCcw, Activity
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import confetti from 'canvas-confetti';

interface Props {
  players: Player[];
  onExitRaid: () => void;
}

export function BossRaidArena({ players, onExitRaid }: Props) {
  const [bossChoice, setBossChoice] = useState<'galactus' | 'infinity_ultron'>('infinity_ultron');
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [selectedAction, setSelectedAction] = useState<BattleActionType>('ATTACK');
  const [isClashing, setIsClashing] = useState(false);

  // Initialize Boss State
  const initialHp = bossChoice === 'infinity_ultron' ? 600 : 500;
  const [bossState, setBossState] = useState<BossRaidState>({
    bossId: bossChoice,
    bossName: bossChoice === 'infinity_ultron' ? 'Infinity Ultron' : 'Galactus',
    bossTitle: bossChoice === 'infinity_ultron' ? 'Supreme Multiverse Destroyer' : 'Devourer of Worlds',
    bossHp: initialHp,
    bossMaxHp: initialHp,
    bossPhase: 1,
    bossSpecialMeter: 0,
    bossImageUrl: bossChoice === 'infinity_ultron' 
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
      : 'https://static.wikia.nocookie.net/marveldatabase/images/c/c8/Galan_%28Earth-828%29_from_The_Fantastic_Four_First_Steps_promotional_material_001.jpg/revision/latest?cb=20250704182708',
    combatLog: ['⚡ RAID COMMENCED! Unite all heroes to defeat the cosmic titan!'],
    isDefeated: false,
    isTeamWiped: false,
  });

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

  const currentPlayer = players[activePlayerIdx] || players[0];
  const currentHero: Character = currentPlayer?.collection[activeHeroIdx] || currentPlayer?.collection[0];
  const currentCombo = currentHero ? getFighterTagTeamCombo(currentHero, currentPlayer.collection) : null;

  // Check living heroes across all players
  const allLivingHeroes = players.flatMap(p => p.collection.filter(c => (c.currentHp === undefined || c.currentHp > 0)));
  const isTeamWiped = allLivingHeroes.length === 0;

  useEffect(() => {
    if (bossState.bossHp <= 0 && !bossState.isDefeated) {
      setBossState(prev => ({ ...prev, isDefeated: true }));
      soundManager.playVictory();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  }, [bossState.bossHp]);

  const handleExecuteRaidAttack = () => {
    if (bossState.isDefeated || isTeamWiped || isClashing) return;

    soundManager.playClick();
    setIsClashing(true);
    soundManager.playAttackHit();

    // 1. Calculate Player Hero Damage
    const basePwr = currentHero.overallPower;
    const roll = Math.floor(Math.random() * 20) + 1;
    let bonus = 0;

    if (selectedAction === 'SPECIAL') {
      bonus = 18;
      setUltimateOverlay({
        isOpen: true,
        type: 'special',
        heroName: currentHero.name,
        abilityTitle: currentHero.specialAbilities?.[0]?.name || 'SIGNATURE SUPERPOWER',
        description: currentHero.specialAbilities?.[0]?.description || currentHero.powers,
        bannerColor: currentHero.color || '#06B6D4',
        damageBonus: 18
      });
    } else if (selectedAction === 'DUAL_STRIKE' && currentCombo) {
      bonus = 28;
      setUltimateOverlay({
        isOpen: true,
        type: 'dual_strike',
        heroName: currentHero.name,
        partnerHeroName: currentCombo.hero2Name === currentHero.name ? currentCombo.hero1Name : currentCombo.hero2Name,
        abilityTitle: currentCombo.comboTitle,
        description: currentCombo.comboDescription,
        bannerColor: currentCombo.bannerColor,
        damageBonus: currentCombo.bonusDualDamage
      });
    } else if (selectedAction === 'ARTIFACT') {
      bonus = 14;
    }

    const heroDamage = Math.max(20, Math.round((basePwr + roll + bonus) * 0.65));
    const newBossHp = Math.max(0, bossState.bossHp - heroDamage);

    // 2. Calculate Boss Retaliation Attack
    let bossDamage = Math.floor(Math.random() * 20) + 25;
    if (selectedAction === 'DEFEND') {
      bossDamage = Math.max(10, Math.round(bossDamage * 0.5));
    }
    if (bossState.bossPhase === 2) {
      bossDamage = Math.round(bossDamage * 1.4); // Enraged phase
    }

    const heroPrevHp = currentHero.currentHp ?? 100;
    const heroNewHp = Math.max(0, heroPrevHp - bossDamage);
    currentHero.currentHp = heroNewHp;
    currentHero.isFainted = heroNewHp <= 0;

    // Check boss phase transition
    const newPhase = newBossHp <= bossState.bossMaxHp * 0.5 ? 2 : 1;

    const logEntry = [
      `⚔️ ${currentPlayer.name}'s ${currentHero.name} used ${selectedAction} dealing ${heroDamage} DAMAGE to ${bossState.bossName}!`,
      `⚠️ ${bossState.bossName} retaliated with Cosmic Burst for ${bossDamage} damage on ${currentHero.name}! (${heroNewHp}/100 HP remaining)`
    ];

    if (heroNewHp <= 0) {
      logEntry.push(`💀 ${currentHero.name} FAINTED in battle!`);
    }

    setBossState(prev => ({
      ...prev,
      bossHp: newBossHp,
      bossPhase: newPhase,
      combatLog: [...logEntry, ...prev.combatLog.slice(0, 10)]
    }));

    setTimeout(() => {
      setIsClashing(false);
      // Advance to next player
      setActivePlayerIdx(prev => (prev + 1) % players.length);
    }, 600);
  };

  const bossHpPercent = Math.round((bossState.bossHp / bossState.bossMaxHp) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner with Raid Title & Mode Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-purple-950/90 to-black border-2 border-red-500/50 shadow-2xl backdrop-blur-xl">
        <div className="text-center md:text-left space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-900/60 border border-red-500/50 text-[11px] font-black uppercase text-red-200 tracking-widest">
            <Skull className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>COOPERATIVE PVE TITAN RAID ARENA</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase">
            RAID BOSS: {bossState.bossName}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            All players pool their heroes together to conquer the cosmic menace!
          </p>
        </div>

        {/* Boss Switcher */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              setBossChoice('infinity_ultron');
              setBossState({
                bossId: 'infinity_ultron',
                bossName: 'Infinity Ultron',
                bossTitle: 'Supreme Multiverse Destroyer',
                bossHp: 600,
                bossMaxHp: 600,
                bossPhase: 1,
                bossSpecialMeter: 0,
                bossImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                combatLog: ['⚡ RAID COMMENCED! Infinity Ultron wields all 6 Infinity Stones!'],
                isDefeated: false,
                isTeamWiped: false
              });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              bossChoice === 'infinity_ultron'
                ? 'bg-cyan-600 text-white shadow-glow-cosmic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌌 Infinity Ultron (600 HP)
          </button>
          <button
            onClick={() => {
              setBossChoice('galactus');
              setBossState({
                bossId: 'galactus',
                bossName: 'Galactus',
                bossTitle: 'Devourer of Worlds',
                bossHp: 500,
                bossMaxHp: 500,
                bossPhase: 1,
                bossSpecialMeter: 0,
                bossImageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c8/Galan_%28Earth-828%29_from_The_Fantastic_Four_First_Steps_promotional_material_001.jpg/revision/latest?cb=20250704182708',
                combatLog: ['⚡ RAID COMMENCED! Galactus channels the Power Cosmic!'],
                isDefeated: false,
                isTeamWiped: false
              });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              bossChoice === 'galactus'
                ? 'bg-purple-600 text-white shadow-glow-cosmic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🪐 Galactus (500 HP)
          </button>
        </div>
      </div>

      {/* Main Raid Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Titan Boss Showcase (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border-2 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.3)] space-y-4 text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-red-400 bg-red-950 px-3 py-1 rounded-full border border-red-500/40">
              PHASE {bossState.bossPhase} {bossState.bossPhase === 2 && '🔥 ENRAGED (+40% DMG)'}
            </span>
            <span className="text-xs font-mono font-black text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              {bossState.bossHp} / {bossState.bossMaxHp} HP
            </span>
          </div>

          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-3xl overflow-hidden border-4 border-red-500 shadow-2xl bg-black">
            <img 
              src={bossState.bossImageUrl} 
              alt={bossState.bossName} 
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" 
            />
            {bossState.bossPhase === 2 && (
              <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay animate-pulse" />
            )}
          </div>

          <div>
            <h2 className="font-heading font-black text-3xl text-white drop-shadow">
              {bossState.bossName}
            </h2>
            <p className="text-xs text-red-300 font-semibold italic">
              {bossState.bossTitle}
            </p>
          </div>

          {/* Boss Massive Health Bar */}
          <div className="space-y-1.5 bg-black/70 p-3 rounded-2xl border border-white/10">
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
              <span className="text-2xl">{currentPlayer?.avatar}</span>
              <div>
                <span className="text-xs font-black text-cyan-300 uppercase block">Active Turn:</span>
                <h3 className="font-heading font-black text-lg text-white">{currentPlayer?.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-bold">Team Life:</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-black border border-emerald-500/40">
                {allLivingHeroes.length} HEROES ALIVE
              </span>
            </div>
          </div>

          {/* Active Fielded Hero Details */}
          {currentHero && (
            <div className="flex items-center gap-4 bg-black/50 p-4 rounded-2xl border border-white/10">
              <CharacterPortrait character={currentHero} size="md" showBadge={true} />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-heading font-black text-xl text-white truncate">{currentHero.name}</h4>
                  <span className="text-xs font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded">
                    PWR {currentHero.overallPower}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                  <span>{currentHero.currentHp ?? 100} / {currentHero.maxHp || 100} HP</span>
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
                  : 'bg-black/50 border-white/10 text-slate-300'
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
                  : 'bg-black/50 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-purple-200 truncate">
                <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate">⚡ {currentHero?.specialAbilities?.[0]?.name || 'SUPERPOWER'}</span>
              </div>
              <span className="text-[10px] text-purple-300 block mt-0.5">+18 Raid Bonus Damage</span>
            </button>

            <button
              onClick={() => setSelectedAction('DEFEND')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'DEFEND'
                  ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400 scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-blue-200">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>🛡️ TITAN SHIELD</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cuts boss counter-attack by 50%</span>
            </button>

            <button
              onClick={() => setSelectedAction('ARTIFACT')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedAction === 'ARTIFACT'
                  ? 'bg-amber-900/80 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                  : 'bg-black/50 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-heading font-black text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>🔮 RELIC SURGE</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">+14 Cosmic Relic Damage</span>
            </button>

            {currentCombo && (
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
                    <span className="truncate">🔥 {currentCombo.comboTitle}</span>
                  </div>
                  <span className="text-[10px] bg-red-950 text-red-300 font-extrabold px-2 py-0.5 rounded border border-red-500/40 shrink-0">
                    +{currentCombo.bonusDualDamage} DMG
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Launch Attack Button */}
          <button
            onClick={handleExecuteRaidAttack}
            disabled={bossState.isDefeated || isTeamWiped || isClashing}
            className="w-full py-4 rounded-2xl font-heading font-black text-lg uppercase tracking-wider bg-gradient-to-r from-red-600 via-amber-600 to-rose-600 hover:brightness-110 text-white shadow-glow-red border border-amber-400 transition-transform active:scale-98 flex items-center justify-center gap-2 mt-4"
          >
            <Swords className="w-5 h-5 animate-spin" />
            <span>UNLEASH STRIKE AGAINST {bossState.bossName.toUpperCase()}!</span>
          </button>
        </div>
      </div>

      {/* Victory / Defeat Overlays */}
      {bossState.isDefeated && (
        <div className="glass-panel-glow p-8 rounded-3xl border-2 border-emerald-500/70 text-center space-y-4 shadow-glow-cosmic animate-bounce">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-400 text-xs font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>TITAN BOSS DEFEATED • COSMIC RAID VICTORS!</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white">
            👑 THE MULTIVERSE IS SAVED!
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Your united strike team brought down {bossState.bossName}! The cosmos honors your triumph!
          </p>
          <button
            onClick={onExitRaid}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg"
          >
            Return to Main Menu
          </button>
        </div>
      )}

      {/* Ultimate Animation Overlay */}
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

      <FloatingReactions playerName={currentPlayer?.name} />
    </div>
  );
}

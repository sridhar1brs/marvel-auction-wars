import React, { useState, useEffect } from 'react';
import { Character } from '../../types/game';
import { DungeonSettings, DungeonState, DungeonCombatLog } from '../../types/dungeon';
import { 
  selectEnemyForWave, 
  summonRandomPlayerHero, 
  executeDungeonCombatTurn 
} from '../../engine/dungeonEngine';
import { getSkillsForCharacter, CharacterSkill } from '../../data/skills/characterSkills';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { CombatFXOverlay, CombatEffectType, ComicBurst } from '../battle/fx/CombatFXOverlay';
import { Fighter2DSprite } from '../battle/fx/Fighter2DSprite';
import { getSignatureMoveForCharacter } from '../../data/characterMoves';
import { 
  Swords, Shield, Zap, Sparkles, Heart, Flame, RotateCcw, 
  ArrowRight, Trophy, Skull, ArrowLeft, RefreshCw, Activity, Award 
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';

function detectHeroCombatEffect(hero?: Character): CombatEffectType {
  if (!hero) return 'melee';
  const name = (hero.name || '').toLowerCase();
  const powers = (hero.powers || '').toLowerCase();
  const desc = (hero.description || '').toLowerCase();
  const all = `${name} ${powers} ${desc}`;

  if (all.includes('claw') || all.includes('wolverine') || all.includes('blade') || all.includes('panther')) return 'claw';
  if (all.includes('laser') || all.includes('repulsor') || all.includes('iron man') || all.includes('cyclops') || all.includes('vision')) return 'laser';
  if (all.includes('lightning') || all.includes('thunder') || all.includes('thor') || all.includes('storm') || all.includes('electro')) return 'lightning';
  if (all.includes('magic') || all.includes('sorcery') || all.includes('strange') || all.includes('wanda') || all.includes('scarlet')) return 'magic';
  if (all.includes('cosmic') || all.includes('thanos') || all.includes('tribunal') || all.includes('galactus') || all.includes('surfer') || all.includes('phoenix')) return 'cosmic';
  if (all.includes('fire') || all.includes('flame') || all.includes('torch') || all.includes('ghost rider')) return 'fire';
  if (all.includes('symbiote') || all.includes('venom') || all.includes('carnage') || all.includes('knull')) return 'symbiote';
  if (all.includes('shield') || all.includes('captain america')) return 'shield';
  return 'melee';
}

interface Props {
  settings: DungeonSettings;
  onExit: () => void;
}

export function DungeonArena({ settings, onExit }: Props) {
  const [dungeonState, setDungeonState] = useState<DungeonState>(() => {
    return {
      settings,
      phase: 'ALTAR_SUMMON',
      currentWave: 1,
      playerHero: null,
      enemyHero: null,
      playerHp: 100,
      playerMaxHp: 100,
      enemyHp: 100,
      enemyMaxHp: 100,
      healingPotions: settings.startingHealingPotions,
      wavesCleared: 0,
      totalDamageDealt: 0,
      currentBgIndex: 0,
      combatLogs: [],
      usedSkillIds: []
    };
  });

  const [isSummoning, setIsSummoning] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<CharacterSkill | null>(null);
  const [isClashing, setIsClashing] = useState(false);
  const [recentLog, setRecentLog] = useState<string>('');
  const [showPotionEffect, setShowPotionEffect] = useState(false);

  // 2D Combat FX States
  const [activeEffectType, setActiveEffectType] = useState<CombatEffectType>('none');
  const [activeComicBurst, setActiveComicBurst] = useState<ComicBurst | null>(null);
  const [activeSignatureMoveName, setActiveSignatureMoveName] = useState<string>('');
  const [p1DamageTaken, setP1DamageTaken] = useState<number | null>(null);
  const [p2DamageTaken, setP2DamageTaken] = useState<number | null>(null);
  const [isSuperCutIn, setIsSuperCutIn] = useState(false);
  const [p1Attacking, setP1Attacking] = useState(false);
  const [p2Attacking, setP2Attacking] = useState(false);
  const [p1TakingHit, setP1TakingHit] = useState(false);
  const [p2TakingHit, setP2TakingHit] = useState(false);

  // Initialize or update enemy on wave transition
  useEffect(() => {
    if (dungeonState.phase === 'ALTAR_SUMMON' || dungeonState.phase === 'COMBAT_READY') {
      const enemy = selectEnemyForWave(dungeonState.currentWave, dungeonState.settings);
      const enemyMaxHp = 80 + dungeonState.currentWave * 8 + (enemy.overallPower * 0.4);
      setDungeonState(prev => ({
        ...prev,
        enemyHero: enemy,
        enemyHp: Math.round(enemyMaxHp),
        enemyMaxHp: Math.round(enemyMaxHp)
      }));
    }
  }, [dungeonState.currentWave, dungeonState.phase]);

  // Background image calculated dynamically across the 10 images (1 to 10)
  const bgImageNumber = ((dungeonState.currentWave - 1) % 10) + 1;
  const bgImageUrl = `/images/dungeons/dungeon-${bgImageNumber}.jpg`;

  // Summon / Randomize Hero action on the ancient altar
  const handleSummonHero = () => {
    soundManager.playClick();
    setIsSummoning(true);

    setTimeout(() => {
      const hero = summonRandomPlayerHero(dungeonState.currentWave, dungeonState.settings);
      const playerMaxHp = 90 + (hero.overallPower * 0.5);
      
      setDungeonState(prev => ({
        ...prev,
        playerHero: hero,
        playerHp: Math.round(playerMaxHp),
        playerMaxHp: Math.round(playerMaxHp),
        phase: 'COMBAT_READY',
        usedSkillIds: []
      }));
      setIsSummoning(false);
      soundManager.playMythicReveal();
    }, 1200);
  };

  // Consume Healing Potion (+45 HP)
  const handleUsePotion = () => {
    if (dungeonState.healingPotions <= 0 || dungeonState.playerHp >= dungeonState.playerMaxHp) return;
    soundManager.playClick();
    setShowPotionEffect(true);
    setTimeout(() => setShowPotionEffect(false), 1500);

    setDungeonState(prev => ({
      ...prev,
      healingPotions: prev.healingPotions - 1,
      playerHp: Math.min(prev.playerMaxHp, prev.playerHp + 45),
      combatLogs: [
        {
          round: prev.combatLogs.length + 1,
          attackerName: prev.playerHero?.name || 'Player',
          defenderName: 'Self',
          actionUsed: 'Ancient Healing Elixir',
          damage: 0,
          isCrit: false,
          message: `🧪 Consumed an Ancient Healing Elixir! Restored +45 HP.`
        },
        ...prev.combatLogs
      ]
    }));
  };

  // Execute Combat Turn against the Dungeon Guardian
  const handleFightTurn = () => {
    if (!dungeonState.playerHero || !dungeonState.enemyHero || isClashing) return;

    const move = getSignatureMoveForCharacter(dungeonState.playerHero);

    setIsClashing(true);
    setP1Attacking(true);
    setActiveEffectType(move.effectType);
    setActiveSignatureMoveName(`${dungeonState.playerHero.name}: ${move.moveName}`);
    setActiveComicBurst({
      id: String(Date.now()),
      word: move.comicBurstWord,
      x: 50,
      y: 40,
      color: move.color,
      subText: `${dungeonState.playerHero.name}: ${move.moveName}`
    });

    if (selectedSkill || dungeonState.playerHero.grade === 'MYTHIC') {
      setIsSuperCutIn(true);
      setTimeout(() => setIsSuperCutIn(false), 800);
    }

    const roundNumber = dungeonState.combatLogs.length + 1;
    const turnResult = executeDungeonCombatTurn(
      dungeonState.playerHero,
      selectedSkill,
      dungeonState.enemyHero,
      roundNumber
    );

    // If a skill was used, mark it used for 1-time limit
    const updatedUsedSkills = selectedSkill 
      ? [...dungeonState.usedSkillIds, selectedSkill.id] 
      : dungeonState.usedSkillIds;

    const nextPlayerHp = Math.max(0, dungeonState.playerHp - turnResult.enemyDamageDealt + turnResult.playerHealed);
    const nextEnemyHp = Math.max(0, dungeonState.enemyHp - turnResult.playerDamageDealt);
    const isEnemyDefeated = nextEnemyHp <= 0;
    const isPlayerDefeated = nextPlayerHp <= 0;

    setRecentLog(turnResult.combatLogs[0].message);

    setTimeout(() => {
      setP1Attacking(false);
      setP2TakingHit(true);
      setP2DamageTaken(turnResult.playerDamageDealt);
      soundManager.playAttackHit();
      setTimeout(() => {
        setP2TakingHit(false);
        setP2DamageTaken(null);
      }, 350);
    }, 380);

    setTimeout(() => {
      setIsClashing(false);
      setSelectedSkill(null);
      setActiveEffectType('none');
      setActiveComicBurst(null);

      if (isEnemyDefeated) {
        soundManager.playVictory();
        const nextWave = dungeonState.currentWave + 1;
        const isComplete = dungeonState.currentWave >= dungeonState.settings.totalWaves;

        // Check if hero should persist or re-roll based on rerollFrequency
        const shouldReroll = nextWave % dungeonState.settings.rerollFrequency === 1 || dungeonState.settings.rerollFrequency === 1;

        setDungeonState(prev => ({
          ...prev,
          enemyHp: 0,
          wavesCleared: prev.wavesCleared + 1,
          totalDamageDealt: prev.totalDamageDealt + turnResult.playerDamageDealt,
          phase: isComplete ? 'DUNGEON_COMPLETE' : 'WAVE_VICTORY',
          combatLogs: [...turnResult.combatLogs, ...prev.combatLogs],
          usedSkillIds: updatedUsedSkills
        }));
      } else if (isPlayerDefeated) {
        soundManager.playClick();
        setDungeonState(prev => ({
          ...prev,
          playerHp: 0,
          phase: 'GAME_OVER',
          combatLogs: [...turnResult.combatLogs, ...prev.combatLogs]
        }));
      } else {
        setDungeonState(prev => ({
          ...prev,
          playerHp: nextPlayerHp,
          enemyHp: nextEnemyHp,
          totalDamageDealt: prev.totalDamageDealt + turnResult.playerDamageDealt,
          combatLogs: [...turnResult.combatLogs, ...prev.combatLogs],
          usedSkillIds: updatedUsedSkills
        }));
      }
    }, 850);
  };

  // Move to next wave
  const handleProceedToNextWave = () => {
    soundManager.playClick();
    const nextWave = dungeonState.currentWave + 1;
    const shouldKeepHero = nextWave % dungeonState.settings.rerollFrequency !== 1 && dungeonState.settings.rerollFrequency > 1;

    setDungeonState(prev => ({
      ...prev,
      currentWave: nextWave,
      phase: shouldKeepHero && prev.playerHero ? 'COMBAT_READY' : 'ALTAR_SUMMON',
      playerHero: shouldKeepHero ? prev.playerHero : null,
      usedSkillIds: []
    }));
  };

  const skills: CharacterSkill[] = dungeonState.playerHero ? getSkillsForCharacter(dungeonState.playerHero) : [];

  return (
    <div 
      className="relative min-h-[calc(100vh-60px)] flex flex-col justify-between px-3 sm:px-6 py-4 sm:py-6 overflow-hidden bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(6, 8, 14, 0.15), rgba(12, 10, 6, 0.25)), url("${bgImageUrl}")`
      }}
    >
      {/* 1. Ancient Top Bar with Wave Tracker, Healing Potions & Exit */}
      <div className="relative z-20 flex items-center justify-between gap-2 sm:gap-4 bg-[#120E08]/90 border border-amber-500/40 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        
        {/* Left: Exit button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onExit();
          }}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LEAVE DUNGEON</span>
        </button>

        {/* Center: Wave Progress & Theme Title */}
        <div className="text-center flex-1 min-w-0">
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-heading font-black text-amber-300 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>ANCIENT RUINS CHAMBER {bgImageNumber} / 10</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase tracking-wider">
            WAVE {dungeonState.currentWave} OF {dungeonState.settings.totalWaves}
          </h1>
        </div>

        {/* Right: Healing Potions Belt */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUsePotion}
            disabled={dungeonState.healingPotions <= 0 || dungeonState.playerHp >= dungeonState.playerMaxHp || dungeonState.phase !== 'COMBAT_READY'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${
              dungeonState.healingPotions > 0 && dungeonState.playerHp < dungeonState.playerMaxHp && dungeonState.phase === 'COMBAT_READY'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse'
                : 'bg-stone-900/80 text-stone-500 border-white/10 opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="text-base">🧪</span>
            <span>{dungeonState.healingPotions} POTIONS</span>
          </button>
        </div>
      </div>

      {/* 2. Main Stage: Changes based on Dungeon Phase */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto">
        
        {/* PHASE 1: ALTAR HERO SUMMONING */}
        {dungeonState.phase === 'ALTAR_SUMMON' && (
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border-2 border-amber-500/50 bg-[#120E08]/95 text-center max-w-2xl mx-auto shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-fadeIn space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-heading font-black tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>THE ANCIENT SUMMONING ALTAR</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider">
                SUMMON YOUR WAVE {dungeonState.currentWave} CHAMPION
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Step onto the runic pedestal. The ancient cosmic temple will randomize a powerful Marvel hero with complete battle stats and all 5 unique combat skills!
              </p>
            </div>

            {/* Altar Glowing Graphic */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-2 rounded-full border border-cyan-400/60 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-amber-500/20 to-purple-600/30 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                <span className="text-4xl sm:text-5xl animate-bounce">🔮</span>
              </div>
            </div>

            <button
              onClick={handleSummonHero}
              disabled={isSummoning}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black font-heading font-black text-base sm:text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.6)] transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-black" />
              <span>{isSummoning ? 'SUMMONING FROM COSMOS...' : 'SUMMON RANDOM HERO'}</span>
            </button>
          </div>
        )}

        {/* PHASE 2: ACTIVE COMBAT DUEL */}
        {(dungeonState.phase === 'COMBAT_READY' || dungeonState.phase === 'COMBAT_FIGHT') && dungeonState.playerHero && dungeonState.enemyHero && (
          <div className="space-y-4 animate-fadeIn relative">
            
            {/* 2D Combat FX Particle & Laser/Slash Overlay */}
            <CombatFXOverlay
              effectType={activeEffectType}
              attackerSide={p1Attacking ? 'left' : 'right'}
              comicBurst={activeComicBurst}
              isSuperMove={isSuperCutIn}
              superHeroName={dungeonState.playerHero?.name}
              superHeroImageUrl={`/images/characters/${dungeonState.playerHero?.id}.jpg`}
              superAbilityName={selectedSkill?.name || 'ANCIENT HEROIC STRIKE!'}
              signatureMoveName={activeSignatureMoveName}
            />

            {/* Duel Battleground: Player vs Enemy Guardian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              
              {/* Player Fighter Card & HP */}
              <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all bg-[#0B0E14]/45 backdrop-blur-md shadow-2xl flex flex-col justify-between ${
                isClashing ? 'scale-[1.02] border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.4)]' : 'border-cyan-500/40'
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-xs font-black uppercase text-cyan-300 tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    YOUR ACTIVE CHAMPION
                  </span>
                  <span className="text-xs font-black text-slate-300">GRADE {dungeonState.playerHero.grade}</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <Fighter2DSprite
                    character={dungeonState.playerHero}
                    side="p1"
                    isAttacking={p1Attacking}
                    isTakingHit={p1TakingHit}
                    isSuperActive={isSuperCutIn}
                    isDefeated={dungeonState.playerHp <= 0}
                    activeSkillName={selectedSkill?.name}
                    damageTaken={p1DamageTaken}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white truncate">
                      {dungeonState.playerHero.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic truncate mb-2">
                      "{dungeonState.playerHero.alias || dungeonState.playerHero.powers}"
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        PWR: <strong className="text-amber-400 font-black">{dungeonState.playerHero.overallPower}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Player Health Bar */}
                <div className="space-y-1.5 bg-black/35 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                      HEALTH POINTS
                    </span>
                    <span className="text-cyan-300">{dungeonState.playerHp} / {dungeonState.playerMaxHp} HP</span>
                  </div>
                  <div className="w-full h-3.5 bg-stone-900/80 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(0, (dungeonState.playerHp / dungeonState.playerMaxHp) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Enemy Guardian Card & HP */}
              <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all bg-[#140C0E]/45 backdrop-blur-md shadow-2xl flex flex-col justify-between ${
                isClashing ? 'scale-[1.02] border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]' : 'border-red-500/40'
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-xs font-black uppercase text-red-400 tracking-wide flex items-center gap-1.5">
                    <Skull className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    WAVE {dungeonState.currentWave} GUARDIAN
                  </span>
                  <span className="text-xs font-black text-amber-300">GRADE {dungeonState.enemyHero.grade}</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <Fighter2DSprite
                    character={dungeonState.enemyHero}
                    side="p2"
                    isAttacking={p2Attacking}
                    isTakingHit={p2TakingHit}
                    isDefeated={dungeonState.enemyHp <= 0}
                    damageTaken={p2DamageTaken}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white truncate">
                      {dungeonState.enemyHero.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic truncate mb-2">
                      "{dungeonState.enemyHero.alias || dungeonState.enemyHero.powers}"
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        PWR: <strong className="text-red-400 font-black">{dungeonState.enemyHero.overallPower}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enemy Health Bar */}
                <div className="space-y-1.5 bg-black/35 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                      GUARDIAN HEALTH
                    </span>
                    <span className="text-red-400">{dungeonState.enemyHp} / {dungeonState.enemyMaxHp} HP</span>
                  </div>
                  <div className="w-full h-3.5 bg-stone-900/80 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(0, (dungeonState.enemyHp / dungeonState.enemyMaxHp) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 5-Skill Tactical Selection Tray */}
            <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-amber-500/40 bg-[#0C0E14]/50 backdrop-blur-md space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  SELECT SPECIAL SKILL (5 SIGNATURE ABILITIES)
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedSkill ? `Selected: ${selectedSkill.name}` : 'Choose a skill or basic attack'}
                </span>
              </div>

              {/* 5 Skill Buttons (Unlimited Combat Skills in Dungeons) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {skills.map((skill) => {
                  const isSelected = selectedSkill?.id === skill.id;

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      disabled={isClashing}
                      onClick={() => setSelectedSkill(isSelected ? null : skill)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105'
                          : 'bg-black/40 backdrop-blur-sm hover:bg-stone-800/80 text-slate-200 border-white/10 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{skill.icon}</span>
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-black text-amber-300' : 'bg-amber-950/90 text-amber-300'
                        }`}>
                          +{skill.bonusPower} PWR
                        </span>
                      </div>
                      <span className="text-xs font-heading font-black truncate block">
                        {skill.name}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">
                        {skill.effectType}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Big Action Strike Button */}
              <div className="pt-2 text-center">
                <button
                  onClick={handleFightTurn}
                  disabled={isClashing}
                  className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(230,36,41,0.6)] transform hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  <Swords className="w-5 h-5 text-white" />
                  <span>{isClashing ? 'EXECUTING STRIKE...' : selectedSkill ? `UNLEASH ${selectedSkill.name.toUpperCase()}` : 'UNLEASH COMBAT ATTACK'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: WAVE VICTORY SCREEN */}
        {dungeonState.phase === 'WAVE_VICTORY' && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-emerald-500/60 bg-[#0A120E]/95 text-center max-w-xl mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-fadeIn space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.6)]">
              <Trophy className="w-8 h-8 text-emerald-300 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">
                CHAMBER {dungeonState.currentWave} CONQUERED!
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider mt-1">
                WAVE {dungeonState.currentWave} CLEARED
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              The ancient guardian has fallen! The stone doors to <strong>Wave {dungeonState.currentWave + 1}</strong> are grinding open.
            </p>

            <button
              onClick={handleProceedToNextWave}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-heading font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>PROCEED TO WAVE {dungeonState.currentWave + 1}</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </div>
        )}

        {/* PHASE 4: DUNGEON COMPLETE (ALL WAVES CONQUERED) */}
        {dungeonState.phase === 'DUNGEON_COMPLETE' && (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-amber-400 bg-[#140E04]/95 text-center max-w-2xl mx-auto shadow-[0_0_50px_rgba(245,158,11,0.5)] animate-fadeIn space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-400 to-yellow-600 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-pulse">
              <Award className="w-10 h-10 text-black" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-amber-300 tracking-widest block">
                ANCIENT RUINS CONQUERED
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider">
                DUNGEON MASTER CHAMPION!
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="p-3 bg-black/60 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">WAVES CLEARED</span>
                <strong className="text-xl font-black text-amber-400">{dungeonState.wavesCleared}</strong>
              </div>
              <div className="p-3 bg-black/60 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">TOTAL DAMAGE</span>
                <strong className="text-xl font-black text-red-400">{dungeonState.totalDamageDealt}</strong>
              </div>
              <div className="p-3 bg-black/60 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">POTIONS LEFT</span>
                <strong className="text-xl font-black text-emerald-400">{dungeonState.healingPotions}</strong>
              </div>
            </div>

            <button
              onClick={onExit}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-black text-base uppercase tracking-wider shadow-lg transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>RETURN TO MAIN MENU</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </div>
        )}

        {/* PHASE 5: GAME OVER (FALLEN IN DUNGEON) */}
        {dungeonState.phase === 'GAME_OVER' && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-red-500/60 bg-[#16080A]/95 text-center max-w-xl mx-auto shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-fadeIn space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.6)]">
              <Skull className="w-8 h-8 text-red-400" />
            </div>

            <div>
              <span className="text-xs font-black uppercase text-red-400 tracking-widest block">
                FALLEN IN THE RUINS
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider mt-1">
                DUNGEON DEFEAT
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Your fighter was overcome by the guardian on <strong>Wave {dungeonState.currentWave}</strong>. You successfully conquered <strong>{dungeonState.wavesCleared} waves</strong>!
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onExit}
                className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs uppercase transition-all"
              >
                Return to Menu
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setDungeonState({
                    settings,
                    phase: 'ALTAR_SUMMON',
                    currentWave: 1,
                    playerHero: null,
                    enemyHero: null,
                    playerHp: 100,
                    playerMaxHp: 100,
                    enemyHp: 100,
                    enemyMaxHp: 100,
                    healingPotions: settings.startingHealingPotions,
                    wavesCleared: 0,
                    totalDamageDealt: 0,
                    currentBgIndex: 0,
                    combatLogs: [],
                    usedSkillIds: []
                  });
                }}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Combat Ticker */}
      {recentLog && (
        <div className="relative z-10 max-w-3xl mx-auto w-full bg-black/80 border border-white/10 px-4 py-2 rounded-xl text-center text-xs text-slate-300 font-medium truncate shadow-md animate-fadeIn">
          ⚡ <strong>Recent Clash:</strong> {recentLog}
        </div>
      )}
    </div>
  );
}

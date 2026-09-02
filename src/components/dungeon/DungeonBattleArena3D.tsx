import React, { useState, useMemo } from 'react';
import { Character } from '../../types/game';
import {
  DungeonRunState,
  DungeonHeroState,
  TacticalActionMode,
  EnemyIntentInfo,
  DungeonBossPhase,
  DungeonCombatLog,
} from '../../types/dungeon';
import {
  executeRogueliteCombatTurn,
  generateEnemyIntentForTurn,
  DUNGEON_BOSSES,
} from '../../engine/dungeonRogueliteEngine';
import { getSkillsForCharacter, CharacterSkill } from '../../data/skills/characterSkills';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { CombatEffectType, ComicBurst } from '../battle/fx/CombatFXOverlay';
import { BattlePresentation3D } from '../battle/BattlePresentation3D';
import { soundManager } from '../../audio/soundManager';
import { 
  Swords, Shield, Zap, Sparkles, Heart, Flame, RotateCcw, 
  ArrowRight, Skull, Activity, ArrowLeft, RefreshCw, Users, ShieldAlert, Crosshair, HelpCircle
} from 'lucide-react';

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
  runState: DungeonRunState;
  onUpdateRunState: (updated: DungeonRunState) => void;
  onBattleVictory: (updatedState: DungeonRunState) => void;
  onBattleDefeat: (updatedState: DungeonRunState) => void;
  onWithdraw?: (currentState: DungeonRunState) => void;
}

export function DungeonBattleArena3D({
  runState,
  onUpdateRunState,
  onBattleVictory,
  onBattleDefeat,
  onWithdraw,
}: Props) {
  const [selectedAction, setSelectedAction] = useState<TacticalActionMode>('STRIKE');
  const [selectedSkill, setSelectedSkill] = useState<CharacterSkill | null>(null);
  const [isClashing, setIsClashing] = useState(false);
  const [recentLog, setRecentLog] = useState<string>('');
  const [showPotionEffect, setShowPotionEffect] = useState(false);
  const [isConfirmingWithdraw, setIsConfirmingWithdraw] = useState(false);

  // 2D/3D FX states
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

  const teamList = runState.team || [];
  const activeHero = teamList[runState.activeFighterIdx] || teamList.find(h => h && h.isAlive) || teamList[0];
  const battleState = runState.currentBattleState;
  const enemyTeamList = battleState?.enemyTeam || [];
  const currentEnemy = enemyTeamList[battleState?.activeEnemyIdx ?? 0] || enemyTeamList[0];

  const activeSkills: CharacterSkill[] = useMemo(() => {
    return activeHero?.character ? getSkillsForCharacter(activeHero.character) : [];
  }, [activeHero?.character]);

  const currentWaveNumber = runState.currentWave || runState.currentFloor || 1;
  const isBossFight = battleState?.isBossFight || false;
  const bossDef = battleState?.bossKey ? DUNGEON_BOSSES[battleState.bossKey] : undefined;
  const currentBossPhase = isBossFight && bossDef ? bossDef.phases[battleState?.currentBossPhase || 0] : undefined;

  const enemyIntent: EnemyIntentInfo = useMemo(() => {
    if (!currentEnemy) {
      return { type: 'HEAVY_SLUGGER', title: 'Power Strike', description: 'Charging assault', counterRecommendation: 'DEFEND_COUNTER', icon: '⚔️' };
    }
    return (
      battleState?.enemyIntent ||
      generateEnemyIntentForTurn(currentEnemy, currentWaveNumber, isBossFight, currentBossPhase)
    );
  }, [battleState?.enemyIntent, currentEnemy, currentWaveNumber, isBossFight, currentBossPhase]);

  if (!battleState || !activeHero || !activeHero.character || !currentEnemy) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-3xl bg-black/80 border border-white/10">
        <h3 className="text-xl font-heading font-black text-amber-300 uppercase">Synchronizing Arena State...</h3>
        <p className="text-xs font-mono text-slate-400">Restoring squad fighters and active wave encounter.</p>
        {onWithdraw && (
          <button
            type="button"
            onClick={() => onWithdraw(runState)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-heading font-bold text-xs uppercase cursor-pointer"
          >
            Reset to Squad Selection
          </button>
        )}
      </div>
    );
  }

  // Handle active hero swap from the bench bar
  const handleSwapActiveHero = (idx: number) => {
    if (isClashing) return;
    const targetHero = runState.team[idx];
    if (!targetHero || !targetHero.isAlive || idx === runState.activeFighterIdx) return;

    soundManager.playClick();
    onUpdateRunState({
      ...runState,
      activeFighterIdx: idx,
    });
    setSelectedSkill(null);
  };

  // Consume Healing Potion in Battle
  const handleUsePotion = () => {
    if (runState.healingPotionsCount <= 0 || !activeHero || activeHero.currentHp >= activeHero.maxHp) return;

    soundManager.playClick();
    setShowPotionEffect(true);
    setTimeout(() => setShowPotionEffect(false), 1500);

    const healAmount = Math.round(activeHero.maxHp * 0.45);
    const updatedTeam = runState.team.map((h, idx) => {
      if (idx === runState.activeFighterIdx) {
        return {
          ...h,
          currentHp: Math.min(h.maxHp, h.currentHp + healAmount),
        };
      }
      return h;
    });

    onUpdateRunState({
      ...runState,
      healingPotionsCount: runState.healingPotionsCount - 1,
      team: updatedTeam,
    });
  };

  // Execute Combat Turn
  const handleExecuteCombatTurn = () => {
    if (isClashing || !activeHero || !activeHero.isAlive || !currentEnemy) return;

    setIsClashing(true);
    soundManager.playAttackHit();

    // 1. Play attacker forward animation & FX
    setP1Attacking(true);
    setP2TakingHit(true);
    const p1Fx = detectHeroCombatEffect(activeHero.character);
    setActiveEffectType(p1Fx);

    const result = executeRogueliteCombatTurn(
      activeHero,
      selectedSkill,
      currentEnemy,
      enemyIntent,
      selectedAction,
      runState.activeRelics,
      runState.activeModifiers,
      runState.teamSize,
      battleState.round,
      battleState.currentWave,
      isBossFight,
      currentBossPhase
    );

    setP2DamageTaken(result.playerDamageDealt);

    if (result.isPlayerCrit) {
      setActiveComicBurst({
        id: `crit-${Date.now()}`,
        word: 'CRITICAL SMASH!',
        color: '#F59E0B',
        x: 65,
        y: 40,
      });
    }

    if (selectedSkill) {
      setActiveSignatureMoveName(selectedSkill.name);
      setIsSuperCutIn(true);
      setTimeout(() => setIsSuperCutIn(false), 800);
    }

    setRecentLog(result.combatLogs[0]?.message || '');

    // 2. Resolve combat outcome after animation delay
    setTimeout(() => {
      setP1Attacking(false);
      setP2TakingHit(false);

      // Enemy retaliates if still alive
      const newEnemyHp = Math.max(0, battleState.enemyHp - result.playerDamageDealt);
      const isEnemyDefeated = newEnemyHp <= 0;

      if (!isEnemyDefeated && result.enemyDamageDealt > 0) {
        setP2Attacking(true);
        setP1TakingHit(true);
        setP1DamageTaken(result.enemyDamageDealt);
        setTimeout(() => {
          setP2Attacking(false);
          setP1TakingHit(false);
        }, 500);
      }

      // Update hero health
      const newHeroHp = Math.max(0, activeHero.currentHp - result.enemyDamageDealt + result.playerHealed);
      const isHeroFallen = newHeroHp <= 0;

      const updatedTeam = runState.team.map((h, idx) => {
        if (idx === runState.activeFighterIdx) {
          return {
            ...h,
            currentHp: newHeroHp,
            isAlive: !isHeroFallen,
            usedSkillIds: selectedSkill ? [...h.usedSkillIds, selectedSkill.id] : h.usedSkillIds,
          };
        }
        return h;
      });

      const anyHeroAlive = updatedTeam.some(h => h.isAlive);

      // Next Enemy Intent
      const nextIntent = generateEnemyIntentForTurn(
        currentEnemy,
        currentWaveNumber,
        isBossFight,
        currentBossPhase
      );

      // Check for wave enemy defeat or full wave clearance
      if (isEnemyDefeated) {
        const nextEnemyIdx = battleState.activeEnemyIdx + 1;
        
        // Multi-enemy check (e.g. 1v2, 1v3, 2v2, 3v3)
        if (nextEnemyIdx < battleState.enemyTeam.length) {
          const nextEnemy = battleState.enemyTeam[nextEnemyIdx];
          const nextWaveHpScale = runState.currentEncounter?.enemyHpScaling || (1 + (runState.currentWave || 1) * 0.08);
          const nextEnemyMaxHp = Math.round((110 + (runState.currentWave || 1) * 12 + nextEnemy.overallPower * 0.75) * nextWaveHpScale);

          setActiveComicBurst({
            id: `down-${Date.now()}`,
            word: 'FOE DEFEATED! NEXT ENEMY!',
            color: '#10B981',
            x: 65,
            y: 35,
          });

          onUpdateRunState({
            ...runState,
            team: updatedTeam,
            currentBattleState: {
              ...battleState,
              activeEnemyIdx: nextEnemyIdx,
              enemyHp: nextEnemyMaxHp,
              enemyMaxHp: nextEnemyMaxHp,
              enemyIntent: generateEnemyIntentForTurn(nextEnemy, runState.currentWave || 1, isBossFight),
              round: battleState.round + 1,
              combatLogs: [...result.combatLogs, ...battleState.combatLogs],
            },
            runStats: {
              ...runState.runStats,
              totalDamageDealt: runState.runStats.totalDamageDealt + result.playerDamageDealt,
              totalDamageTaken: runState.runStats.totalDamageTaken + result.enemyDamageDealt,
              turnsTaken: runState.runStats.turnsTaken + 1,
            },
          });
          setIsClashing(false);
          setSelectedSkill(null);
          return;
        } else {
          // All enemies in current Wave eliminated!
          soundManager.playVictoryFanfare();
          const waveNum = runState.currentWave || runState.currentFloor || 1;
          const postState: DungeonRunState = {
            ...runState,
            team: updatedTeam,
            currentBattleState: null,
            maxWaveReached: Math.max(runState.maxWaveReached || 1, waveNum),
            maxFloorReached: Math.max(runState.maxFloorReached || 1, waveNum),
            runStats: {
              ...runState.runStats,
              battlesWon: runState.runStats.battlesWon + 1,
              elitesDefeated: runState.runStats.elitesDefeated + (isBossFight ? 0 : 1),
              bossesConquered: runState.runStats.bossesConquered + (isBossFight ? 1 : 0),
              totalDamageDealt: runState.runStats.totalDamageDealt + result.playerDamageDealt,
              totalDamageTaken: runState.runStats.totalDamageTaken + result.enemyDamageDealt,
              turnsTaken: runState.runStats.turnsTaken + 1,
            },
          };
          onBattleVictory(postState);
          setIsClashing(false);
          return;
        }
      }

      if (!anyHeroAlive) {
        // All squad heroes fallen: Game Over
        soundManager.playDefeat();
        const postState: DungeonRunState = {
          ...runState,
          team: updatedTeam,
          currentBattleState: null,
          isGameOver: true,
          runStats: {
            ...runState.runStats,
            totalDamageDealt: runState.runStats.totalDamageDealt + result.playerDamageDealt,
            totalDamageTaken: runState.runStats.totalDamageTaken + result.enemyDamageDealt,
            turnsTaken: runState.runStats.turnsTaken + 1,
          },
        };
        onBattleDefeat(postState);
        setIsClashing(false);
        return;
      }

      // If active hero fell, automatically swap to next living hero
      let nextActiveIdx = runState.activeFighterIdx;
      if (isHeroFallen) {
        const nextLivingIdx = updatedTeam.findIndex(h => h.isAlive);
        if (nextLivingIdx !== -1) nextActiveIdx = nextLivingIdx;
      }

      onUpdateRunState({
        ...runState,
        team: updatedTeam,
        activeFighterIdx: nextActiveIdx,
        currentBattleState: {
          ...battleState,
          enemyHp: newEnemyHp,
          enemyIntent: nextIntent,
          round: battleState.round + 1,
          combatLogs: [...result.combatLogs, ...battleState.combatLogs],
        },
        runStats: {
          ...runState.runStats,
          totalDamageDealt: runState.runStats.totalDamageDealt + result.playerDamageDealt,
          totalDamageTaken: runState.runStats.totalDamageTaken + result.enemyDamageDealt,
          turnsTaken: runState.runStats.turnsTaken + 1,
        },
      });

      setIsClashing(false);
      setSelectedSkill(null);
    }, 700);
  };

  const bgImageNumber = ((currentWaveNumber - 1) % 10) + 1;
  const bgImageUrl = `/images/dungeons/dungeon-${bgImageNumber}.jpg`;

  return (
    <div className="relative w-full min-h-[90vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden rounded-3xl border-2 border-white/10 select-none animate-fadeIn">
      
      {/* 1. Dynamic 3D Battle Arena Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/60" />
      </div>

      {/* 3. Top Combat HUD */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/85 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-heading font-black text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-glow-red">
            <Swords className="w-4 h-4" /> CURRENT WAVE: {currentWaveNumber}
          </span>
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-[11px] rounded-full uppercase">
            {Math.max(0, currentWaveNumber - 1)} WAVES SURVIVED
          </span>
          <span className="text-xs font-heading font-black text-slate-300 uppercase tracking-wide">
            {runState.currentEncounter?.encounterFormat || '1v1'} • Round {battleState.round}
          </span>
          {battleState.enemyTeam.length > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
              Foe {battleState.activeEnemyIdx + 1} of {battleState.enemyTeam.length}
            </span>
          )}
        </div>

        {/* Active Relics Display */}
        {runState.activeRelics.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-2xl border border-purple-500/30 overflow-x-auto max-w-xs sm:max-w-md">
            <span className="text-[9px] font-mono text-purple-300 font-bold uppercase shrink-0">🔮 Relics ({runState.activeRelics.length}):</span>
            {runState.activeRelics.map((relic, idx) => (
              <span
                key={`${relic.id}-${idx}`}
                title={`${relic.name}: ${relic.description}`}
                className="w-6 h-6 rounded-lg bg-slate-900 border border-white/20 flex items-center justify-center text-xs shrink-0 cursor-help hover:scale-110 transition-transform"
              >
                {relic.icon}
              </span>
            ))}
          </div>
        )}

        {/* Consumables & Safe Exit Quick Bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUsePotion}
            disabled={runState.healingPotionsCount <= 0 || activeHero.currentHp >= activeHero.maxHp || isClashing}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
              runState.healingPotionsCount > 0 && activeHero.currentHp < activeHero.maxHp
                ? 'bg-emerald-600/30 hover:bg-emerald-600/50 border-emerald-400 text-emerald-300 shadow-glow-gold cursor-pointer hover:scale-105'
                : 'bg-slate-900/60 border-white/5 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-current" />
            <span>Medkit ({runState.healingPotionsCount})</span>
          </button>

          {onWithdraw && (
            <button
              type="button"
              onClick={() => {
                if (isConfirmingWithdraw) {
                  onWithdraw(runState);
                } else {
                  setIsConfirmingWithdraw(true);
                  setTimeout(() => setIsConfirmingWithdraw(false), 4000);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-[10px] font-heading font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              {isConfirmingWithdraw ? '⚠️ CONFIRM WITHDRAW?' : 'WITHDRAW RUN'}
            </button>
          )}
        </div>
      </div>

      {/* 4. Boss Special Mechanics Alert (if Boss Encounter) */}
      {isBossFight && currentBossPhase && (
        <div className="relative z-20 max-w-2xl mx-auto w-full p-3 rounded-2xl bg-gradient-to-r from-red-950/90 via-purple-950/90 to-red-950/90 border-2 border-red-500/70 shadow-[0_0_30px_rgba(239,68,68,0.5)] text-center space-y-0.5 animate-pulse">
          <div className="flex items-center justify-center gap-2 text-xs font-heading font-black text-red-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>BOSS PHASE {currentBossPhase.phaseNumber}: {currentBossPhase.phaseName.toUpperCase()}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono">
            {currentBossPhase.mechanicDescription}
          </p>
        </div>
      )}

      {/* 5. Shared 3D Combat Arena Stage */}
      <div className="relative z-10 py-6">
        <BattlePresentation3D
          player={activeHero.character}
          opponent={currentEnemy}
          playerAttacking={p1Attacking}
          opponentAttacking={p2Attacking}
          playerTakingHit={p1TakingHit}
          opponentTakingHit={p2TakingHit}
          playerSuper={isSuperCutIn}
          playerDamage={p1DamageTaken}
          opponentDamage={p2DamageTaken}
          effectType={activeEffectType}
          signatureMoveName={activeSignatureMoveName}
          title={`DUNGEON WAVE ${currentWaveNumber} • ROUND ${battleState.round}`}
        />
        <div className="mt-3 flex justify-center">
          <div className="rounded-xl border border-amber-500/40 bg-black/80 px-3 py-1.5 text-[10px] font-mono text-amber-300">
            {enemyIntent.icon} {enemyIntent.title} • Counter: {enemyIntent.counterRecommendation}
          </div>
        </div>
      </div>
      {/* 6. Living Squad Bench Bar (Quick Hero Swap) */}
      <div className="relative z-20 p-3 rounded-2xl bg-black/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Users className="w-4 h-4 text-orange-400" />
          <span>Squad Rotation (Click to Swap Fighter):</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {runState.team.map((hero, idx) => {
            const isActive = idx === runState.activeFighterIdx;
            const hpPercent = Math.round((hero.currentHp / hero.maxHp) * 100);

            return (
              <button
                key={hero.characterId}
                type="button"
                disabled={!hero.isAlive || isClashing}
                onClick={() => handleSwapActiveHero(idx)}
                className={`p-1.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-500/30 border-orange-400 shadow-glow-red scale-105'
                    : hero.isAlive
                    ? 'bg-slate-900 border-white/10 hover:border-orange-400/50'
                    : 'bg-black/60 border-white/5 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 bg-black">
                  <img
                    src={hero.character.imageUrl || `/images/heroes/${hero.character.id}.jpg`}
                    alt={hero.character.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="text-left text-[9px] font-mono">
                  <div className="font-bold text-white truncate max-w-[70px]">{hero.character.name}</div>
                  <div className={hero.isAlive ? 'text-emerald-400' : 'text-red-500 font-bold'}>
                    {hero.isAlive ? `${hero.currentHp} HP` : 'FALLEN'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Tactical Stances & Signature Abilities Execution Tray */}
      <div className="relative z-20 p-4 rounded-3xl bg-black/90 backdrop-blur-md border-2 border-white/15 space-y-4 shadow-2xl">
        
        {/* Tactical Stance Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-heading font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5" /> Tactical Combat Stance
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Counter the enemy's telegraphed intent!</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'STRIKE', title: 'DIRECT STRIKE', desc: 'Interrupt energy charging', icon: '⚔️' },
              { id: 'SPECIAL_BLAST', title: 'SPECIAL BLAST', desc: 'Armor piercer (+70% vs Fortress)', icon: '⚡' },
              { id: 'DEFEND_COUNTER', title: 'DEFEND & COUNTER', desc: 'Absorb 75% heavy blow & counter', icon: '🛡️' },
              { id: 'EVADE_AMBUSH', title: 'EVADE & AMBUSH', desc: 'Acrobatic flank & dodge', icon: '💨' },
            ].map(stance => (
              <button
                key={stance.id}
                type="button"
                disabled={isClashing}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedAction(stance.id as TacticalActionMode);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedAction === stance.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-400 shadow-glow-red scale-105'
                    : 'bg-slate-900/80 border-white/10 hover:border-orange-500/40 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{stance.icon}</span>
                  <span className="text-[11px] font-heading font-black truncate">{stance.title}</span>
                </div>
                <p className="text-[9px] font-mono text-slate-400 line-clamp-1 mt-0.5">{stance.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Signature Abilities Selection */}
        {activeSkills.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>{activeHero.character.name}&apos;S SIGNATURE SKILLS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Optional: combine 1 skill with tactical stance</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {activeSkills.map(skill => {
                const isUsed = activeHero.usedSkillIds?.includes(skill.id);
                const isSelected = selectedSkill?.id === skill.id;

                return (
                  <button
                    key={skill.id}
                    type="button"
                    disabled={isUsed || isClashing}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedSkill(isSelected ? null : skill);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isUsed
                        ? 'bg-slate-950/60 border-white/5 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gradient-to-br from-yellow-500/30 to-amber-600/40 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-105 cursor-pointer'
                        : 'bg-slate-900/80 border-white/10 hover:border-yellow-500/40 hover:bg-slate-800/80 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{skill.icon || '⚡'}</span>
                      <span className={`text-[9px] font-mono font-bold ${isUsed ? 'text-slate-500' : 'text-amber-400'}`}>
                        {isUsed ? 'EXHAUSTED' : `+${skill.bonusPower} PWR`}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-heading font-black text-white truncate">{skill.name}</h4>
                    <p className="text-[9px] text-slate-400 line-clamp-1">{skill.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Master Execute Button */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={handleExecuteCombatTurn}
            disabled={isClashing}
            className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-600 to-amber-500 hover:from-orange-400 hover:to-red-500 text-white font-heading font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_0_30px_rgba(249,115,22,0.6)] transform hover:scale-105 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <Swords className="w-5 h-5 text-amber-200" />
            <span>
              {selectedSkill
                ? `EXECUTE [${selectedAction.replace('_', ' ')}] + ${selectedSkill.name.toUpperCase()} ⚡`
                : `EXECUTE [${selectedAction.replace('_', ' ')}] ATTACK ⚔️`}
            </span>
          </button>
        </div>
      </div>

      {/* 8. Live Combat Feed */}
      <div className="relative z-20 max-w-2xl mx-auto w-full bg-black/80 border border-white/10 rounded-2xl px-4 py-2 text-center text-xs font-mono text-slate-300 truncate shadow-md backdrop-blur-sm mt-3">
        {recentLog || `Chamber initialized • Wave ${runState.currentWave || runState.currentFloor || 1}`}
      </div>
    </div>
  );
}

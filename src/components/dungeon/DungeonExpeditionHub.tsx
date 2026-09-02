import React, { useState, useEffect, useCallback } from 'react';
import { Character } from '../../types/game';
import {
  DungeonRunState,
  DungeonRelic,
  DungeonShopItem,
  DungeonHeroState,
  DungeonMilestoneReward,
} from '../../types/dungeon';
import {
  calculateDungeonHeroBaseStats,
  generateEnemyIntentForTurn,
  generateInfiniteDungeonWave,
  generateMilestoneReward,
  mapArtifactToDungeonRelic,
} from '../../engine/dungeonRogueliteEngine';
import { DungeonTeamSelect } from './DungeonTeamSelect';
import { DungeonPrepShop } from './DungeonPrepShop';
import { DungeonBattleArena3D } from './DungeonBattleArena3D';
import { DungeonMilestoneModal } from './DungeonMilestoneModal';
import { DungeonRunSummary } from './DungeonRunSummary';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { Loader2 } from 'lucide-react';

type ExpeditionView =
  | 'TEAM_SELECT'
  | 'PREP_SHOP'
  | 'BATTLE'
  | 'MILESTONE_MODAL'
  | 'RUN_SUMMARY';

interface Props {
  onExit: () => void;
}

export function DungeonExpeditionHub({ onExit }: Props) {
  const { user, startDungeonExpedition, saveDungeonRun, getActiveDungeonRun, finalizeDungeonExpedition } = useAuth();

  const [currentView, setCurrentView] = useState<ExpeditionView>('TEAM_SELECT');
  const [runState, setRunState] = useState<DungeonRunState | null>(null);
  const [prepPurchases, setPrepPurchases] = useState<DungeonShopItem[]>([]);
  const [activeMilestoneReward, setActiveMilestoneReward] = useState<DungeonMilestoneReward | null>(null);
  const [finalRewards, setFinalRewards] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing active run to resume
  useEffect(() => {
    let isMounted = true;
    const checkActiveRun = async () => {
      try {
        const res = await getActiveDungeonRun();
        if (isMounted && res && res.success && res.runState && !res.runState.isGameOver && !res.runState.isComplete) {
          const run = res.runState;
          if (run.team && run.team.length > 0) {
            // If battle state is missing (e.g. from an old saved run or completed floor), reconstruct active wave encounter
            let restoredRun: DungeonRunState = run;
            if (!run.currentBattleState || !run.currentBattleState.enemyTeam || run.currentBattleState.enemyTeam.length === 0) {
              const waveNum = run.currentWave || run.currentFloor || 1;
              const enc = generateInfiniteDungeonWave(waveNum, run.seed || Date.now(), run.recentEnemyIds || []);
              const firstEnemy = enc.enemies[0];
              const enemyMaxHp = Math.round((110 + waveNum * 12 + firstEnemy.overallPower * 0.75) * enc.enemyHpScaling);
              restoredRun = {
                ...run,
                currentWave: waveNum,
                currentEncounter: enc,
                currentBattleState: {
                  enemyTeam: enc.enemies,
                  activeEnemyIdx: 0,
                  enemyHp: enemyMaxHp,
                  enemyMaxHp: enemyMaxHp,
                  enemyIntent: generateEnemyIntentForTurn(firstEnemy, waveNum, enc.isBoss, enc.bossPhase),
                  currentWave: waveNum,
                  totalWaves: enc.enemies.length,
                  round: 1,
                  isBossFight: enc.isBoss,
                  bossKey: enc.bossKey,
                  combatLogs: [],
                },
              };
            }
            setRunState(restoredRun);
            setCurrentView('BATTLE');
          } else {
            setCurrentView('TEAM_SELECT');
          }
        } else {
          if (isMounted) setCurrentView('TEAM_SELECT');
        }
      } catch (err) {
        console.error('Failed to check active dungeon run:', err);
        if (isMounted) setCurrentView('TEAM_SELECT');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    checkActiveRun();
    return () => { isMounted = false; };
  }, []);

  // Auto-save run state
  const handleUpdateRunState = useCallback((updated: DungeonRunState) => {
    setRunState(updated);
    saveDungeonRun(updated);
  }, [saveDungeonRun]);

  // 1. Confirm Team & Initialize Infinite Wave Expedition
  const handleConfirmTeam = async (selectedHeroes: Character[], teamSize: number) => {
    soundManager.playClick();
    setIsLoading(true);

    const charIds = selectedHeroes.map(c => c.id);
    const startRes = await startDungeonExpedition(charIds, 'EXPEDITION');

    if (!startRes.success) {
      soundManager.playOutbid();
      setIsLoading(false);
      return;
    }

    // 1. Gather all persistent owned relics from Ascension Vault and Prep Armory
    const startingRelics: DungeonRelic[] = [];
    const ownedRelicIds = Array.from(new Set([
      ...(user?.ownedRelics || []),
      ...prepPurchases.filter(p => p.type === 'RELIC' && p.relic).map(p => p.relic!.id)
    ]));

    ownedRelicIds.forEach(id => {
      const mapped = mapArtifactToDungeonRelic(id);
      if (mapped && !startingRelics.some(r => r.id === mapped.id)) {
        startingRelics.push(mapped);
      }
    });

    // 2. Initialize Hero States with real Ascension stats and prep shop bonuses
    let extraPower = 0;
    let extraDefense = 0;
    let extraHp = 0;
    let startingPotions = 3;
    let startingRevives = 0;

    prepPurchases.forEach(p => {
      if (p.type === 'HEAL_POTION') startingPotions += 1;
      if (p.type === 'REVIVE_STIM') startingRevives += 1;
      if (p.statBoost?.power) extraPower += p.statBoost.power;
      if (p.statBoost?.defense) extraDefense += p.statBoost.defense;
      if (p.statBoost?.hp) extraHp += p.statBoost.hp;
    });

    // Apply starting relic passive stat bonuses to squad
    startingRelics.forEach(relic => {
      if (relic.effectType === 'DAMAGE_PERCENT') extraPower += relic.value * 0.5;
      if (relic.effectType === 'DAMAGE_REDUCTION_PERCENT') extraDefense += relic.value * 0.5;
    });

    const heroStates: DungeonHeroState[] = selectedHeroes.map(char => {
      const lvl = user?.characterLevels?.[char.id] || 1;
      const stats = calculateDungeonHeroBaseStats(char, lvl, user?.characterStatsBoosts?.[char.id]);
      const maxHp = stats.maxHp + extraHp;

      return {
        characterId: char.id,
        character: char,
        ascensionLevel: lvl,
        currentHp: maxHp,
        maxHp,
        isAlive: true,
        usedSkillIds: [],
        role: stats.role,
        bonusPower: stats.basePower + extraPower,
        bonusDefense: stats.defense + extraDefense,
        bonusSpeed: stats.speed,
      };
    });

    // 3. Generate Wave 1 Encounter with unique seed
    const seed = Date.now();
    const wave1Encounter = generateInfiniteDungeonWave(1, seed, []);
    const firstEnemy = wave1Encounter.enemies[0];
    const enemyMaxHp = Math.round((110 + firstEnemy.overallPower * 0.75) * wave1Encounter.enemyHpScaling);

    const initialRun: DungeonRunState = {
      id: `exp-${seed}`,
      userId: user?.id || 'player',
      seed,
      difficultyMode: 'EXPEDITION',
      zone: wave1Encounter.backgroundTheme,
      currentWave: 1,
      maxWaveReached: 1,
      currentFloor: 1,
      maxFloorReached: 1,
      team: heroStates,
      teamSize,
      activeFighterIdx: 0,
      dungeonAstra: 500,
      activeRelics: startingRelics,
      activeModifiers: wave1Encounter.modifiers,
      waveMilestonesClaimed: [],
      healingPotionsCount: startingPotions,
      revivalStimsCount: startingRevives,
      recentEnemyIds: wave1Encounter.enemies.map(e => e.id),
      currentEncounter: wave1Encounter,
      runStats: {
        battlesWon: 0,
        elitesDefeated: 0,
        bossesConquered: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        astraCollected: 500,
        relicsAcquired: startingRelics.length,
        shardsGained: 0,
        turnsTaken: 0,
        heroesLost: 0,
      },
      currentBattleState: {
        enemyTeam: wave1Encounter.enemies,
        activeEnemyIdx: 0,
        enemyHp: enemyMaxHp,
        enemyMaxHp: enemyMaxHp,
        enemyIntent: generateEnemyIntentForTurn(firstEnemy, 1, wave1Encounter.isBoss, wave1Encounter.bossPhase),
        currentWave: 1,
        totalWaves: wave1Encounter.enemies.length,
        round: 1,
        isBossFight: wave1Encounter.isBoss,
        bossKey: wave1Encounter.bossKey,
        combatLogs: [],
      },
      isComplete: false,
      isGameOver: false,
      createdAt: seed,
      updatedAt: seed,
    };

    setRunState(initialRun);
    saveDungeonRun(initialRun);
    setCurrentView('BATTLE');
    setIsLoading(false);
  };

  // 2. Battle Victory -> Check for Milestone Reward or Transition directly to Next Wave
  const handleBattleVictory = (stateAfterBattle: DungeonRunState) => {
    const completedWave = stateAfterBattle.currentWave || stateAfterBattle.currentFloor || 1;
    const isMilestone = completedWave % 5 === 0;

    // Award standard wave victory Astra
    const waveAstraBonus = Math.round(150 + completedWave * 20);
    const updatedAstra = stateAfterBattle.dungeonAstra + waveAstraBonus;
    const updatedAstraCollected = stateAfterBattle.runStats.astraCollected + waveAstraBonus;

    const baseState: DungeonRunState = {
      ...stateAfterBattle,
      dungeonAstra: updatedAstra,
      maxWaveReached: Math.max(stateAfterBattle.maxWaveReached || 1, completedWave),
      maxFloorReached: Math.max(stateAfterBattle.maxFloorReached || 1, completedWave),
      runStats: {
        ...stateAfterBattle.runStats,
        astraCollected: updatedAstraCollected,
      },
    };

    if (isMilestone) {
      // Milestone Wave (5, 10, 15, 20, 25, 30, ...)
      const reward = stateAfterBattle.currentEncounter?.milestoneReward || generateMilestoneReward(completedWave, stateAfterBattle.seed);
      setActiveMilestoneReward(reward);
      setRunState(baseState);
      setCurrentView('MILESTONE_MODAL');
    } else {
      // Direct transition to next infinite wave
      advanceToNextWave(baseState, completedWave + 1);
    }
  };

  // Helper to advance to next wave
  const advanceToNextWave = (state: DungeonRunState, nextWave: number, draftedRelic?: DungeonRelic | null) => {
    try {
      const currentRelics = state.activeRelics || [];
      const nextRelics = draftedRelic
        ? [...currentRelics.filter(r => r.id !== draftedRelic.id), draftedRelic]
        : currentRelics;
      const recentIds = [...((state.recentEnemyIds || []).slice(-8))];

      const seed = state.seed || Date.now();
      const nextEncounter = generateInfiniteDungeonWave(nextWave, seed, recentIds);
      const firstEnemy = nextEncounter.enemies[0];
      const enemyMaxHp = Math.round((110 + nextWave * 12 + firstEnemy.overallPower * 0.75) * nextEncounter.enemyHpScaling);

      // Health persists directly from combat — NO automatic free heals between waves! Healing requires purchased potions.
      let refreshedTeam = (state.team || []).map(hero => {
        if (!hero.isAlive) return hero;
        return {
          ...hero,
          // Exact currentHp preserved
          usedSkillIds: [], // Refresh skill cooldowns
        };
      });

      // If all heroes were somehow dead, revive first hero with 50% HP
      if (!refreshedTeam.some(h => h.isAlive) && refreshedTeam.length > 0) {
        refreshedTeam[0].isAlive = true;
        refreshedTeam[0].currentHp = Math.round(refreshedTeam[0].maxHp * 0.5);
      }

      const livingIdx = refreshedTeam.findIndex(h => h.isAlive);
      const nextActiveIdx = livingIdx !== -1 ? livingIdx : 0;

      const nextRunState: DungeonRunState = {
        ...state,
        currentWave: nextWave,
        currentFloor: nextWave,
        maxWaveReached: Math.max(state.maxWaveReached || 1, nextWave),
        maxFloorReached: Math.max(state.maxFloorReached || 1, nextWave),
        zone: nextEncounter.backgroundTheme,
        activeRelics: nextRelics,
        activeModifiers: nextEncounter.modifiers,
        team: refreshedTeam,
        activeFighterIdx: nextActiveIdx,
        recentEnemyIds: [...recentIds, ...nextEncounter.enemies.map(e => e.id)],
        currentEncounter: nextEncounter,
        runStats: {
          ...(state.runStats || {
            battlesWon: 0,
            elitesDefeated: 0,
            bossesConquered: 0,
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            astraCollected: 0,
            relicsAcquired: 0,
            shardsGained: 0,
            turnsTaken: 0,
            heroesLost: 0,
          }),
          relicsAcquired: nextRelics.length,
        },
        currentBattleState: {
          enemyTeam: nextEncounter.enemies,
          activeEnemyIdx: 0,
          enemyHp: enemyMaxHp,
          enemyMaxHp: enemyMaxHp,
          enemyIntent: generateEnemyIntentForTurn(firstEnemy, nextWave, nextEncounter.isBoss, nextEncounter.bossPhase),
          currentWave: nextWave,
          totalWaves: nextEncounter.enemies.length,
          round: 1,
          isBossFight: nextEncounter.isBoss,
          bossKey: nextEncounter.bossKey,
          combatLogs: [],
        },
      };

      handleUpdateRunState(nextRunState);
      setCurrentView('BATTLE');
    } catch (err) {
      console.error('Failed to advance to next wave:', err);
      setCurrentView('BATTLE');
    }
  };

  // 3. Confirm Milestone Reward & Continue Run
  const handleConfirmMilestone = (chosenRelic: DungeonRelic | null) => {
    setActiveMilestoneReward(null);
    if (runState) {
      const currentWave = runState.currentWave || runState.currentFloor || 1;
      advanceToNextWave(runState, currentWave + 1, chosenRelic);
    } else {
      setCurrentView('TEAM_SELECT');
    }
  };

  // 4. Battle Defeat -> Finalize Expedition & Show Debrief
  const handleBattleDefeat = (stateAfterDefeat: DungeonRunState) => {
    handleFinalizeExpedition(stateAfterDefeat, false);
  };

  // 5. Safe Withdraw from Dungeon -> Finalize with Full Earned Spoils
  const handleWithdraw = (currentState: DungeonRunState) => {
    soundManager.playVictoryFanfare();
    handleFinalizeExpedition(currentState, true);
  };

  // 6. Finalize Run on Server / Database
  const handleFinalizeExpedition = async (finalState: DungeonRunState, isVictory: boolean) => {
    setIsLoading(true);
    const rewards = await finalizeDungeonExpedition(finalState, isVictory);
    setFinalRewards(rewards);
    setRunState(finalState);
    setCurrentView('RUN_SUMMARY');
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <span className="text-sm font-mono text-slate-400">Loading Dungeon Expedition Engine...</span>
      </div>
    );
  }

  const isSquadSelectView =
    currentView === 'TEAM_SELECT' ||
    (currentView === 'BATTLE' && (!runState || !runState.currentBattleState || !runState.team || runState.team.length === 0));

  return (
    <div className="min-h-screen bg-[#04060E] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-black">
      
      {/* 1. SQUAD SELECTION */}
      {isSquadSelectView && (
        <DungeonTeamSelect
          onConfirmTeam={handleConfirmTeam}
          onOpenPrepShop={() => setCurrentView('PREP_SHOP')}
          onBack={onExit}
        />
      )}

      {/* 2. PREPARATION ARMORY */}
      {currentView === 'PREP_SHOP' && (
        <DungeonPrepShop
          purchasedItems={prepPurchases}
          onPurchaseItem={item => setPrepPurchases(prev => [...prev, item])}
          onClose={() => setCurrentView('TEAM_SELECT')}
        />
      )}

      {/* 3. 3D COMBAT ARENA (CENTERPIECE ENDLESS SURVIVAL) */}
      {currentView === 'BATTLE' && !isSquadSelectView && runState && runState.currentBattleState && (
        <DungeonBattleArena3D
          runState={runState}
          onUpdateRunState={handleUpdateRunState}
          onBattleVictory={handleBattleVictory}
          onBattleDefeat={handleBattleDefeat}
          onWithdraw={handleWithdraw}
        />
      )}

      {/* 4. SURVIVAL MILESTONE CELEBRATION MODAL (EVERY 5 WAVES) */}
      {currentView === 'MILESTONE_MODAL' && activeMilestoneReward && (
        <DungeonMilestoneModal
          reward={activeMilestoneReward}
          onConfirm={handleConfirmMilestone}
        />
      )}

      {/* 5. EXPEDITION DEBRIEF & REWARDS SUMMARY */}
      {currentView === 'RUN_SUMMARY' && runState && (
        <DungeonRunSummary
          runState={runState}
          finalRewards={finalRewards}
          onExit={onExit}
        />
      )}
    </div>
  );
}

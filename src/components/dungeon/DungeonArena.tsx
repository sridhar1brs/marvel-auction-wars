import React, { useState, useEffect, useMemo } from 'react';
import { Character } from '../../types/game';
import { DungeonSettings, DungeonState, DungeonCombatLog, DungeonPlayer } from '../../types/dungeon';
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
  ArrowRight, Trophy, Skull, ArrowLeft, RefreshCw, Activity, Award, Users, User, Dices
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';
import { useAuth } from '../../context/AuthContext';

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

const PLAYER_AVATARS = ['🦸‍♂️', '🦹‍♂️', '🧙‍♂️', '🥷', '🤖', '⚡'];

interface Props {
  settings: DungeonSettings;
  onExit: () => void;
}

export function DungeonArena({ settings, onExit }: Props) {
  const { recordDungeonResult, isAuthenticated } = useAuth();

  const [dungeonState, setDungeonState] = useState<DungeonState>(() => {
    const playerCount = settings.playerCount || 1;
    const initialPlayers: DungeonPlayer[] = Array.from({ length: playerCount }).map((_, idx) => ({
      id: `p-${idx + 1}`,
      name: settings.playerNames?.[idx] || `Player ${idx + 1}`,
      avatar: PLAYER_AVATARS[idx % PLAYER_AVATARS.length],
      hero: null,
      hp: 100,
      maxHp: 100,
      usedSkillIds: [],
      isAlive: true,
      hasRandomized: false
    }));

    return {
      settings,
      phase: 'ALTAR_SUMMON',
      currentWave: 1,
      players: initialPlayers,
      activePlayerIndex: 0,
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

  const [randomizingPlayerId, setRandomizingPlayerId] = useState<string | null>(null);
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

  // Living players list
  const livingPlayers = useMemo(() => {
    return dungeonState.players.filter(p => p.isAlive && p.hero);
  }, [dungeonState.players]);

  const activePlayer: DungeonPlayer | undefined = dungeonState.players[dungeonState.activePlayerIndex] || dungeonState.players[0];

  // Active player's skills
  const activeSkills: CharacterSkill[] = useMemo(() => {
    return activePlayer?.hero ? getSkillsForCharacter(activePlayer.hero) : [];
  }, [activePlayer?.hero]);

  // Check if all players have randomized their hero for the wave
  const allPlayersRandomized = useMemo(() => {
    return dungeonState.players.every(p => !!p.hero);
  }, [dungeonState.players]);

  // Initialize or update enemy on wave transition
  useEffect(() => {
    if (dungeonState.phase === 'ALTAR_SUMMON' || dungeonState.phase === 'COMBAT_READY') {
      const enemy = selectEnemyForWave(dungeonState.currentWave, dungeonState.settings);
      // Scale boss health based on player count and wave tier
      const teamMultiplier = Math.max(1, dungeonState.players.length * 0.75);
      const enemyMaxHp = Math.round((80 + dungeonState.currentWave * 9 + (enemy.overallPower * 0.45)) * teamMultiplier);
      
      setDungeonState(prev => ({
        ...prev,
        enemyHero: enemy,
        enemyHp: enemyMaxHp,
        enemyMaxHp: enemyMaxHp
      }));
    }
  }, [dungeonState.currentWave, dungeonState.phase, dungeonState.players.length]);

  // Background image calculated dynamically across the 10 images (1 to 10)
  const bgImageNumber = ((dungeonState.currentWave - 1) % 10) + 1;
  const bgImageUrl = `/images/dungeons/dungeon-${bgImageNumber}.jpg`;

  // Individual Randomize Hero Action per Player
  const handleRandomizeHeroForPlayer = (playerId: string) => {
    soundManager.playClick();
    setRandomizingPlayerId(playerId);

    setTimeout(() => {
      const hero = summonRandomPlayerHero(dungeonState.currentWave, dungeonState.settings);
      const heroMaxHp = Math.round(90 + (hero.overallPower * 0.5));

      setDungeonState(prev => {
        const updatedPlayers = prev.players.map(p => {
          if (p.id === playerId) {
            return {
              ...p,
              hero,
              hp: heroMaxHp,
              maxHp: heroMaxHp,
              isAlive: true,
              hasRandomized: true,
              usedSkillIds: []
            };
          }
          return p;
        });

        const allReady = updatedPlayers.every(p => !!p.hero);

        return {
          ...prev,
          players: updatedPlayers,
          playerHero: updatedPlayers[0]?.hero || hero,
          playerHp: updatedPlayers[0]?.hp || heroMaxHp,
          playerMaxHp: updatedPlayers[0]?.maxHp || heroMaxHp,
          phase: allReady ? 'COMBAT_READY' : 'ALTAR_SUMMON'
        };
      });

      setRandomizingPlayerId(null);
      soundManager.playMythicReveal();
    }, 850);
  };

  // Consume Healing Potion (+45 HP for active player)
  const handleUsePotion = () => {
    if (dungeonState.healingPotions <= 0 || !activePlayer || activePlayer.hp >= activePlayer.maxHp) return;
    soundManager.playClick();
    setShowPotionEffect(true);
    setTimeout(() => setShowPotionEffect(false), 1500);

    setDungeonState(prev => {
      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === prev.activePlayerIndex) {
          return {
            ...p,
            hp: Math.min(p.maxHp, p.hp + 45)
          };
        }
        return p;
      });

      return {
        ...prev,
        healingPotions: prev.healingPotions - 1,
        players: updatedPlayers,
        playerHp: updatedPlayers[prev.activePlayerIndex]?.hp || prev.playerHp,
        combatLogs: [
          {
            round: prev.combatLogs.length + 1,
            attackerName: activePlayer.name,
            defenderName: activePlayer.hero?.name || 'Self',
            actionUsed: 'Ancient Healing Elixir',
            damage: 0,
            isCrit: false,
            message: `🧪 ${activePlayer.name} drank an Ancient Healing Elixir! Restored +45 HP to ${activePlayer.hero?.name}.`
          },
          ...prev.combatLogs
        ]
      };
    });
  };

  // Execute Combat Turn for Active Player against the Dungeon Guardian
  const handleFightTurn = () => {
    if (!activePlayer?.hero || !dungeonState.enemyHero || isClashing || !activePlayer.isAlive) return;

    const currentHero = activePlayer.hero;
    const move = getSignatureMoveForCharacter(currentHero);

    setIsClashing(true);
    setP1Attacking(true);
    setActiveEffectType(move.effectType);
    setActiveSignatureMoveName(`${activePlayer.name} (${currentHero.name}): ${move.moveName}`);
    setActiveComicBurst({
      id: String(Date.now()),
      word: move.comicBurstWord,
      x: 50,
      y: 40,
      color: move.color,
      subText: `${activePlayer.name}: ${move.moveName}`
    });

    if (selectedSkill || currentHero.grade === 'MYTHIC') {
      setIsSuperCutIn(true);
      setTimeout(() => setIsSuperCutIn(false), 800);
    }

    const roundNumber = dungeonState.combatLogs.length + 1;
    const turnResult = executeDungeonCombatTurn(
      currentHero,
      selectedSkill,
      dungeonState.enemyHero,
      roundNumber
    );

    const updatedUsedSkills = selectedSkill 
      ? [...(activePlayer.usedSkillIds || []), selectedSkill.id] 
      : (activePlayer.usedSkillIds || []);

    const nextActivePlayerHp = Math.max(0, activePlayer.hp - turnResult.enemyDamageDealt + turnResult.playerHealed);
    const nextEnemyHp = Math.max(0, dungeonState.enemyHp - turnResult.playerDamageDealt);
    const isEnemyDefeated = nextEnemyHp <= 0;
    const isActivePlayerKO = nextActivePlayerHp <= 0;

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

      setDungeonState(prev => {
        // Update players array
        const updatedPlayers = prev.players.map((p, idx) => {
          if (idx === prev.activePlayerIndex) {
            return {
              ...p,
              hp: nextActivePlayerHp,
              isAlive: !isActivePlayerKO,
              usedSkillIds: updatedUsedSkills
            };
          }
          return p;
        });

        const anyPlayerAlive = updatedPlayers.some(p => p.isAlive);

        if (isEnemyDefeated) {
          soundManager.playVictory();
          const nextWave = prev.currentWave + 1;
          const isComplete = prev.currentWave >= prev.settings.totalWaves;
          const newWavesCleared = prev.wavesCleared + 1;

          if (isAuthenticated && (isComplete || newWavesCleared % 5 === 0)) {
            recordDungeonResult(newWavesCleared, isComplete);
          }

          // Living players get +25 HP recovery on wave win
          const healedPlayers = updatedPlayers.map(p => ({
            ...p,
            hp: p.isAlive ? Math.min(p.maxHp, p.hp + 25) : 0
          }));

          return {
            ...prev,
            players: healedPlayers,
            enemyHp: 0,
            wavesCleared: newWavesCleared,
            totalDamageDealt: prev.totalDamageDealt + turnResult.playerDamageDealt,
            phase: isComplete ? 'DUNGEON_COMPLETE' : 'WAVE_VICTORY',
            combatLogs: [...turnResult.combatLogs, ...prev.combatLogs]
          };
        } else if (!anyPlayerAlive) {
          soundManager.playClick();
          if (isAuthenticated) {
            recordDungeonResult(prev.wavesCleared, false);
          }
          return {
            ...prev,
            players: updatedPlayers,
            enemyHp: nextEnemyHp,
            totalDamageDealt: prev.totalDamageDealt + turnResult.playerDamageDealt,
            phase: 'GAME_OVER',
            combatLogs: [...turnResult.combatLogs, ...prev.combatLogs]
          };
        } else {
          // Cycle to next living player
          let nextIndex = (prev.activePlayerIndex + 1) % updatedPlayers.length;
          let searchCount = 0;
          while (!updatedPlayers[nextIndex]?.isAlive && searchCount < updatedPlayers.length) {
            nextIndex = (nextIndex + 1) % updatedPlayers.length;
            searchCount++;
          }

          return {
            ...prev,
            players: updatedPlayers,
            activePlayerIndex: nextIndex,
            enemyHp: nextEnemyHp,
            totalDamageDealt: prev.totalDamageDealt + turnResult.playerDamageDealt,
            combatLogs: [...turnResult.combatLogs, ...prev.combatLogs]
          };
        }
      });
    }, 850);
  };

  // Move to next wave
  const handleProceedToNextWave = () => {
    soundManager.playClick();
    const nextWave = dungeonState.currentWave + 1;
    const shouldKeepHeroes = nextWave % dungeonState.settings.rerollFrequency !== 1 && dungeonState.settings.rerollFrequency > 1;

    setDungeonState(prev => {
      const resetPlayers = prev.players.map(p => ({
        ...p,
        hero: shouldKeepHeroes ? p.hero : null,
        hp: shouldKeepHeroes ? p.hp : 100,
        maxHp: shouldKeepHeroes ? p.maxHp : 100,
        isAlive: true,
        hasRandomized: shouldKeepHeroes,
        usedSkillIds: []
      }));

      return {
        ...prev,
        currentWave: nextWave,
        phase: shouldKeepHeroes && resetPlayers.every(p => !!p.hero) ? 'COMBAT_READY' : 'ALTAR_SUMMON',
        players: resetPlayers,
        activePlayerIndex: 0
      };
    });
  };

  return (
    <div 
      className="relative min-h-[calc(100vh-60px)] flex flex-col justify-between px-3 sm:px-6 py-4 sm:py-6 overflow-hidden bg-cover bg-center transition-all duration-700 select-none"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(6, 8, 14, 0.2), rgba(12, 10, 6, 0.35)), url("${bgImageUrl}")`
      }}
    >
      {/* 1. Ancient Top Bar with Wave Tracker, Mode Badge, Healing Potions & Exit */}
      <div className="relative z-20 flex items-center justify-between gap-2 sm:gap-4 bg-[#120E08]/95 border border-amber-500/40 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        
        {/* Left: Exit button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onExit();
          }}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LEAVE DUNGEON</span>
        </button>

        {/* Center: Wave Progress & Theme Title */}
        <div className="text-center flex-1 min-w-0">
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-heading font-black text-amber-300 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>ANCIENT RUINS CHAMBER {bgImageNumber} / 10 • {dungeonState.settings.gameplayMode === 'same_device' ? `CO-OP (${dungeonState.players.length}P)` : 'SOLO'}</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase tracking-wider">
            WAVE {dungeonState.currentWave} OF {dungeonState.settings.totalWaves}
          </h1>
        </div>

        {/* Right: Healing Potions Belt */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUsePotion}
            disabled={dungeonState.healingPotions <= 0 || !activePlayer || activePlayer.hp >= activePlayer.maxHp || dungeonState.phase !== 'COMBAT_READY'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              dungeonState.healingPotions > 0 && activePlayer && activePlayer.hp < activePlayer.maxHp && dungeonState.phase === 'COMBAT_READY'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 hover:bg-emerald-900 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-stone-900/80 text-slate-500 border-white/5 opacity-60 cursor-not-allowed'
            }`}
            title="Restore +45 HP to Active Fighter"
          >
            <span className="text-sm">🧪</span>
            <span>{dungeonState.healingPotions} POTIONS</span>
          </button>
        </div>
      </div>

      {/* Turn Indicator Banner (in Combat Mode) */}
      {(dungeonState.phase === 'COMBAT_READY' || dungeonState.phase === 'COMBAT_FIGHT') && activePlayer && (
        <div className="relative z-20 mt-2 flex items-center justify-between px-4 py-2 bg-black/80 border border-amber-500/50 rounded-2xl shadow-glow-gold animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-lg">{activePlayer.avatar}</span>
            <span className="text-xs sm:text-sm font-heading font-black text-amber-300 uppercase tracking-wider">
              ⚔️ {activePlayer.name}&apos;S TURN
            </span>
            <span className="text-xs text-slate-300 font-mono">
              ({activePlayer.hero?.name})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {dungeonState.players.map((p, idx) => (
              <div 
                key={p.id}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all ${
                  idx === dungeonState.activePlayerIndex
                    ? 'bg-amber-500 text-black font-black border-amber-300 scale-105 shadow-md'
                    : p.isAlive
                    ? 'bg-black/60 text-slate-300 border-white/10'
                    : 'bg-red-950 text-red-400 border-red-500/40 line-through opacity-60'
                }`}
              >
                <span>{p.avatar}</span>
                <span>{p.name.slice(0, 8)}</span>
                <span>{p.isAlive ? `${p.hp}HP` : 'KO'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Main Arena Stage Area */}
      <div className="relative z-10 my-auto py-2">
        {/* PHASE A: ALTAR HERO SUMMON / INDIVIDUAL RANDOMIZATION */}
        {dungeonState.phase === 'ALTAR_SUMMON' && (
          <div className="max-w-3xl mx-auto p-5 sm:p-7 rounded-3xl bg-black/80 border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] backdrop-blur-md text-center space-y-5 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-heading font-black uppercase">
              <Dices className="w-4 h-4 text-amber-400 animate-spin" />
              <span>MYSTIC SUMMONING ALTAR — WAVE {dungeonState.currentWave}</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-heading font-black text-white uppercase tracking-wider">
              {dungeonState.settings.gameplayMode === 'same_device' 
                ? 'EVERY PLAYER MUST RANDOMIZE THEIR HERO' 
                : 'RANDOMIZE YOUR DUNGEON VANGUARD'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Each commander channels the ancient multiverse altar to summon a distinct hero with 5 specialized abilities!
            </p>

            {/* Grid of Player Summoning Cards */}
            <div className={`grid gap-3 pt-2 ${
              dungeonState.players.length === 1 
                ? 'grid-cols-1 max-w-md mx-auto' 
                : dungeonState.players.length === 2 
                ? 'grid-cols-1 sm:grid-cols-2' 
                : 'grid-cols-2 sm:grid-cols-4'
            }`}>
              {dungeonState.players.map((p) => {
                const isRandomizing = randomizingPlayerId === p.id;
                return (
                  <div 
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all text-center space-y-3 ${
                      p.hero 
                        ? 'bg-gradient-to-b from-amber-950/60 to-black/80 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                        : 'bg-black/60 border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-heading font-black text-amber-300 flex items-center gap-1.5">
                        <span>{p.avatar}</span>
                        <span>{p.name}</span>
                      </span>
                      {p.hero && (
                        <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.2 rounded font-black">
                          ✓ SUMMONED
                        </span>
                      )}
                    </div>

                    {p.hero ? (
                      <div className="space-y-2">
                        <img
                          src={`/images/characters/${p.hero.id}.jpg`}
                          alt={p.hero.name}
                          className="w-20 h-20 mx-auto rounded-xl object-cover border-2 border-amber-400 shadow-md"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                            Grade {p.hero.grade} • {p.hero.overallPower} PWR
                          </span>
                          <h4 className="font-heading font-black text-white text-sm truncate">
                            {p.hero.name}
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/40 border border-dashed border-amber-500/50 flex items-center justify-center text-2xl">
                          ❓
                        </div>
                        <span className="text-[11px] text-slate-400 block font-semibold">
                          Awaiting Summon
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRandomizeHeroForPlayer(p.id)}
                      disabled={isRandomizing}
                      className={`w-full py-2.5 rounded-xl text-xs font-heading font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        p.hero
                          ? 'bg-stone-900/80 text-amber-300 border-amber-500/40 hover:bg-stone-800'
                          : 'bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white border-amber-300 shadow-md'
                      }`}
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isRandomizing ? 'animate-spin' : ''}`} />
                      <span>{p.hero ? 'RE-RANDOMIZE' : 'RANDOMIZE HERO'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE B: HEAD-TO-HEAD COMBAT ARENA (SOLO & SAME DEVICE CO-OP) */}
        {(dungeonState.phase === 'COMBAT_READY' || dungeonState.phase === 'COMBAT_FIGHT') && activePlayer?.hero && dungeonState.enemyHero && (
          <div className="relative max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 bg-black/85 border-2 border-amber-500/50 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-md space-y-4">
            
            {/* 2D Combat FX Particle & Slash Overlay */}
            <CombatFXOverlay
              effectType={activeEffectType}
              comicBurst={activeComicBurst}
              signatureMoveName={activeSignatureMoveName}
              isSuperMove={isSuperCutIn}
              superHeroName={activePlayer.hero.name}
              superHeroImageUrl={`/images/characters/${activePlayer.hero.id}.jpg`}
              superAbilityName={selectedSkill ? selectedSkill.name : 'SIGNATURE STRIKE'}
            />

            {/* Duelists Stage Layout */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 items-center">
              
              {/* Left Duelist: ACTIVE PLAYER HERO */}
              <div className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all ${
                isClashing ? 'scale-105' : ''
              } bg-gradient-to-b from-[#1C1206] to-black border-amber-500/50 shadow-glow-gold`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{activePlayer.avatar}</span>
                    <span className="text-xs font-heading font-black text-amber-300 uppercase truncate max-w-[100px]">
                      {activePlayer.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-black font-black px-1.5 py-0.2 rounded font-mono">
                    {activePlayer.hero.overallPower} PWR
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={`/images/characters/${activePlayer.hero.id}.jpg`}
                    alt={activePlayer.hero.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-heading font-black text-white truncate">
                      {activePlayer.hero.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Grade {activePlayer.hero.grade} • {activePlayer.hero.alignment}
                    </span>

                    {/* Health Bar */}
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-amber-300">
                        <span>HP</span>
                        <span>{activePlayer.hp} / {activePlayer.maxHp}</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(0, Math.min(100, (activePlayer.hp / activePlayer.maxHp) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Duelist: DUNGEON GUARDIAN / BOSS */}
              <div className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all ${
                isClashing ? 'scale-105' : ''
              } bg-gradient-to-b from-[#1C0606] to-black border-red-500/50 shadow-glow-red`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                  <span className="text-xs font-heading font-black text-red-400 uppercase truncate">
                    👑 GUARDIAN BOSS
                  </span>
                  <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.2 rounded font-mono">
                    {dungeonState.enemyHero.overallPower} PWR
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1 text-right">
                    <h3 className="text-sm sm:text-base font-heading font-black text-white truncate">
                      {dungeonState.enemyHero.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Grade {dungeonState.enemyHero.grade} • Wave {dungeonState.currentWave}
                    </span>

                    {/* Health Bar */}
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-red-400">
                        <span>HP</span>
                        <span>{dungeonState.enemyHp} / {dungeonState.enemyMaxHp}</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(0, Math.min(100, (dungeonState.enemyHp / dungeonState.enemyMaxHp) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <img
                    src={`/images/characters/${dungeonState.enemyHero.id}.jpg`}
                    alt={dungeonState.enemyHero.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-red-500 shadow-md shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

            </div>

            {/* 5 Unique Character Special Abilities Grid */}
            <div className="p-3 bg-black/60 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{activePlayer.name}&apos;S UNIQUE ABILITIES (5 SKILLS)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Select 1 skill to empower this strike (1-time use per skill)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {activeSkills.map((skill) => {
                  const isUsed = activePlayer.usedSkillIds?.includes(skill.id);
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
                        <span className={`text-[9px] font-mono font-bold ${
                          isUsed ? 'text-slate-500' : 'text-amber-400'
                        }`}>
                          {isUsed ? 'EXHAUSTED' : `+${skill.bonusPower} PWR`}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-heading font-black text-white truncate">
                        {skill.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 line-clamp-1">
                        {skill.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Master Attack Execution Button */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleFightTurn}
                disabled={isClashing}
                className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-red-600 to-amber-500 hover:from-amber-400 hover:to-red-500 text-white font-heading font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.5)] transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Swords className="w-5 h-5 text-amber-200" />
                <span>
                  {selectedSkill 
                    ? `EXECUTE ${selectedSkill.name.toUpperCase()} STRIKE ⚡` 
                    : `EXECUTE ${activePlayer.name.toUpperCase()}'S ATTACK ⚔️`}
                </span>
              </button>
            </div>

          </div>
        )}

        {/* PHASE C: WAVE VICTORY MODAL */}
        {dungeonState.phase === 'WAVE_VICTORY' && (
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-black/90 border-2 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.4)] backdrop-blur-md text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-3xl shadow-lg">
              🏆
            </div>
            <h2 className="text-2xl font-heading font-black text-emerald-400 uppercase tracking-wider">
              WAVE {dungeonState.currentWave} CLEARED!
            </h2>
            <p className="text-xs text-slate-300">
              The ancient guardian has been vanquished. Living commanders restored <strong>+25 HP</strong>!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToNextWave}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>PROCEED TO WAVE {dungeonState.currentWave + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE D: DUNGEON COMPLETE MODAL */}
        {dungeonState.phase === 'DUNGEON_COMPLETE' && (
          <div className="max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1C1508] to-black border-2 border-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.6)] backdrop-blur-md text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500 text-black flex items-center justify-center text-4xl shadow-xl border-2 border-amber-200">
              👑
            </div>
            <h2 className="text-3xl font-heading font-black text-amber-300 uppercase tracking-wider">
              DUNGEON CONQUERED!
            </h2>
            <p className="text-sm text-slate-300">
              Incredible valor! All {dungeonState.settings.totalWaves} waves of the Ancient Ruins have been conquered!
            </p>
            <button
              type="button"
              onClick={onExit}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-heading font-black text-base uppercase tracking-wider shadow-xl transition-all transform hover:scale-105 cursor-pointer"
            >
              RETURN TO HEADQUARTERS
            </button>
          </div>
        )}

        {/* PHASE E: GAME OVER MODAL */}
        {dungeonState.phase === 'GAME_OVER' && (
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-black/90 border-2 border-rose-600 shadow-[0_0_50px_rgba(225,29,72,0.5)] backdrop-blur-md text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-950 border border-red-500 flex items-center justify-center text-3xl">
              💀
            </div>
            <h2 className="text-2xl font-heading font-black text-rose-400 uppercase tracking-wider">
              ALL HEROES FALLEN
            </h2>
            <p className="text-xs text-slate-300">
              Defeated on Wave <strong>{dungeonState.currentWave}</strong>. You cleared <strong>{dungeonState.wavesCleared}</strong> total waves.
            </p>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onExit();
                }}
                className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-slate-300 font-heading font-black text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
              >
                EXIT DUNGEON
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Live Combat Feed Scroll */}
      <div className="relative z-20 max-w-2xl mx-auto w-full bg-black/70 border border-white/10 rounded-2xl px-4 py-2 text-center text-xs font-mono text-slate-300 truncate shadow-md backdrop-blur-sm">
        {recentLog || `Dungeon Chamber initialized • Wave ${dungeonState.currentWave}`}
      </div>
    </div>
  );
}

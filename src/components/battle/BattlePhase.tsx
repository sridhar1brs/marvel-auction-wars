import React, { useState, useEffect } from 'react';
import { TournamentMatch, GameState, BattleActionType, Character, ArenaBackgroundId } from '../../types/game';
import { CombatClash } from './CombatClash';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { UltimateAnimationOverlay } from '../common/UltimateAnimationOverlay';
import { FloatingReactions } from '../common/FloatingReactions';
import { CombatFXOverlay, CombatEffectType, ComicBurst } from './fx/CombatFXOverlay';
import { Fighter2DSprite } from './fx/Fighter2DSprite';
import { getSignatureMoveForCharacter } from '../../data/characterMoves';
import { getFighterTagTeamCombo, TagTeamCombo, findPossibleTagTeamFusions, mergeUltimateCharacter } from '../../engine/synergyEngine';
import { getSkillsForCharacter, CharacterSkill } from '../../data/skills/characterSkills';
import { 
  Swords, Trophy, ArrowRight, Zap, Shield, Sparkles, Heart, Flame, 
  Crosshair, ShieldAlert, Cpu, Activity, Skull, MapPin, Eye, Flag, FastForward, CheckCircle2, TestTube2
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
  state: GameState;
  onReturnToTree: () => void;
  onExecuteAction?: (matchId: string, action1: BattleActionType, action2: BattleActionType, p1HeroIdx: number, p2HeroIdx: number) => void;
  onConcedeMatch?: (matchId?: string) => void;
  onSkipMatch?: (matchId?: string) => void;
  isOnlineMode?: boolean;
  controllingPlayerId?: string;
}

export function BattlePhase({ 
  state, 
  onReturnToTree, 
  onExecuteAction,
  onConcedeMatch,
  onSkipMatch,
  isOnlineMode = false,
  controllingPlayerId,
}: Props) {
  const match = state.tournamentMatches.find(m => m.id === state.currentMatchId);
  const [p1HeroIdx, setP1HeroIdx] = useState(0);
  const [p2HeroIdx, setP2HeroIdx] = useState(0);
  const [p1Action, setP1Action] = useState<BattleActionType>('ATTACK');
  const [p2Action, setP2Action] = useState<BattleActionType>('ATTACK');
  const [isClashing, setIsClashing] = useState(false);
  const [arenaBg, setArenaBg] = useState<ArenaBackgroundId>('wakanda');
  
  // 2D Combat Animation & FX States
  const [activeEffectType, setActiveEffectType] = useState<CombatEffectType>('none');
  const [activeComicBurst, setActiveComicBurst] = useState<ComicBurst | null>(null);
  const [activeSignatureMoveName, setActiveSignatureMoveName] = useState<string>('');
  const [isSuperCutIn, setIsSuperCutIn] = useState(false);
  const [superHeroName, setSuperHeroName] = useState('');
  const [superHeroImageUrl, setSuperHeroImageUrl] = useState('');
  const [superAbilityName, setSuperAbilityName] = useState('');
  const [p1Attacking, setP1Attacking] = useState(false);
  const [p2Attacking, setP2Attacking] = useState(false);
  const [p1TakingHit, setP1TakingHit] = useState(false);
  const [p2TakingHit, setP2TakingHit] = useState(false);

  // Track 1-time skill usages per duel (Classic Match 1-time limit)
  const [p1UsedSkillIds, setP1UsedSkillIds] = useState<string[]>([]);
  const [p2UsedSkillIds, setP2UsedSkillIds] = useState<string[]>([]);

  // Healing Potion (1x use per match)
  const [p1UsedHealingPotion, setP1UsedHealingPotion] = useState(false);
  const [healingPopup, setHealingPopup] = useState<string | null>(null);

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

  if (!match || !match.player1 || !match.player2) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center glass-panel rounded-3xl border border-white/10 shadow-glow-cosmic">
        <h2 className="text-2xl font-black text-white mb-4">No Active Match in Progress</h2>
        <button
          onClick={onReturnToTree}
          className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-glow-red"
        >
          Return to Tournament Tree
        </button>
      </div>
    );
  }

  const p1 = match.player1;
  const p2 = match.player2;
  const latestRound = match.rounds.length > 0 ? match.rounds[match.rounds.length - 1] : null;
  const isMatchComplete = match.status === 'COMPLETED';

  const isUserP1 = isOnlineMode && controllingPlayerId ? (p1.id === controllingPlayerId) : true;
  const isUserP2 = isOnlineMode && controllingPlayerId ? (p2.id === controllingPlayerId) : false;

  const hasP1Locked = !!match.player1Action || !!match.player1Ready;
  const hasP2Locked = !!match.player2Action || !!match.player2Ready;
  const isUserLocked = isOnlineMode ? (isUserP1 ? hasP1Locked : isUserP2 ? hasP2Locked : false) : false;

  // Authoritative Hero Selection
  const p1SelectedHero: Character = p1.collection[p1HeroIdx] || p1.collection[0];
  const p2SelectedHero: Character = p2.collection[p2HeroIdx] || p2.collection[0];

  useEffect(() => {
    // If selected hero is dead, auto-switch to first living hero
    if (p1SelectedHero && p1SelectedHero.currentHp !== undefined && p1SelectedHero.currentHp <= 0) {
      const firstAlive = p1.collection.findIndex(c => (c.currentHp === undefined || c.currentHp > 0));
      if (firstAlive !== -1) setP1HeroIdx(firstAlive);
    }
    if (p2SelectedHero && p2SelectedHero.currentHp !== undefined && p2SelectedHero.currentHp <= 0) {
      const firstAlive = p2.collection.findIndex(c => (c.currentHp === undefined || c.currentHp > 0));
      if (firstAlive !== -1) setP2HeroIdx(firstAlive);
    }
  }, [match.rounds.length, p1.collection, p2.collection]);

  const handleExecuteRound = () => {
    soundManager.playClick();
    if (!onExecuteAction) return;

    if (isOnlineMode) {
      if (isUserP2) {
        onExecuteAction(match.id, p1Action, p2Action, p1HeroIdx, p2HeroIdx);
      } else {
        onExecuteAction(match.id, p1Action, p2Action, p1HeroIdx, p2HeroIdx);
      }
      return;
    }

    let botHeroIdx = p2HeroIdx;
    let botAction = p2Action;

    if (p2.isBot) {
      const liveHeroes = p2.collection
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => (c.currentHp === undefined || c.currentHp > 0));

      if (liveHeroes.length > 0) {
        const chosen = liveHeroes[Math.floor(Math.random() * liveHeroes.length)];
        botHeroIdx = chosen.i;
      }

      const actions: BattleActionType[] = ['ATTACK', 'SPECIAL', 'DEFEND', 'ARTIFACT'];
      botAction = actions[Math.floor(Math.random() * actions.length)];
    }

    const move = getSignatureMoveForCharacter(p1SelectedHero);

    setIsClashing(true);
    setP1Attacking(true);
    setActiveEffectType(move.effectType);
    setActiveSignatureMoveName(`${p1SelectedHero.name}: ${move.moveName}`);
    setActiveComicBurst({
      id: String(Date.now()),
      word: move.comicBurstWord,
      x: 50,
      y: 42,
      color: move.color,
      subText: `${p1SelectedHero.name}: ${move.moveName}`
    });

    if (p1Action === 'SPECIAL' || p1Action.startsWith('SKILL_') || p1SelectedHero.grade === 'MYTHIC') {
      setIsSuperCutIn(true);
      setSuperHeroName(p1SelectedHero.name);
      setSuperHeroImageUrl(`/images/characters/${p1SelectedHero.id}.jpg`);
      setSuperAbilityName(move.moveName || p1SelectedHero.specialAbilities?.[0]?.name || 'SUPER CRITICAL STRIKE!');
      setTimeout(() => setIsSuperCutIn(false), 900);
    }

    setTimeout(() => {
      setP1Attacking(false);
      setP2TakingHit(true);
      soundManager.playAttackHit();
      setTimeout(() => setP2TakingHit(false), 350);
    }, 380);

    setTimeout(() => {
      setIsClashing(false);
      setActiveEffectType('none');
      setActiveComicBurst(null);
      onExecuteAction(match.id, p1Action, botAction, p1HeroIdx, botHeroIdx);
    }, 750);
  };

  const getHpPercent = (hero?: Character) => {
    if (!hero) return 100;
    const hp = hero.currentHp !== undefined ? hero.currentHp : 100;
    const max = hero.maxHp || 100;
    return Math.max(0, Math.min(100, Math.round((hp / max) * 100)));
  };

  const getHpGradient = (percent: number) => {
    if (percent > 60) return 'from-emerald-500 to-green-400';
    if (percent > 25) return 'from-amber-500 to-yellow-400';
    return 'from-red-600 to-rose-500';
  };

  const p1LivingCount = p1.collection.filter(c => (c.currentHp === undefined || c.currentHp > 0)).length;
  const p2LivingCount = p2.collection.filter(c => (c.currentHp === undefined || c.currentHp > 0)).length;

  const p1Combo: TagTeamCombo | null = p1SelectedHero ? getFighterTagTeamCombo(p1SelectedHero, p1.collection) : null;
  const p2Combo: TagTeamCombo | null = p2SelectedHero ? getFighterTagTeamCombo(p2SelectedHero, p2.collection) : null;

  const p1Fusions = findPossibleTagTeamFusions(p1.collection);

  const handleUseHealingPotion = () => {
    if (p1UsedHealingPotion || !p1SelectedHero) return;
    soundManager.playVictory();
    const currentHp = p1SelectedHero.currentHp !== undefined ? p1SelectedHero.currentHp : 100;
    const maxHp = p1SelectedHero.maxHp || 100;
    const healedHp = Math.min(maxHp, currentHp + 40);
    p1SelectedHero.currentHp = healedHp;
    setP1UsedHealingPotion(true);
    setHealingPopup(`+40 HP RESTORED!`);
    setTimeout(() => setHealingPopup(null), 2500);
  };

  const handleUseSkill = (skill: CharacterSkill) => {
    if (p1UsedSkillIds.includes(skill.id)) return;
    soundManager.playClick();
    setP1Action('SPECIAL');
    setP1UsedSkillIds(prev => [...prev, skill.id]);
  };

  const handleInBattleMerge = (fusion: { hero1: Character; hero2: Character; combo: TagTeamCombo }) => {
    soundManager.playMythicReveal();
    const fusedChar = mergeUltimateCharacter(fusion.hero1, fusion.hero2, fusion.combo);
    const remaining = p1.collection.filter(c => c.id !== fusion.hero1.id && c.id !== fusion.hero2.id);
    p1.collection = [fusedChar, ...remaining];
    setP1HeroIdx(0);
    
    setUltimateOverlay({
      isOpen: true,
      type: 'dual_strike',
      heroName: fusion.hero1.name,
      partnerHeroName: fusion.hero2.name,
      abilityTitle: fusion.combo.comboTitle,
      description: fusion.combo.comboDescription,
      bannerColor: fusion.combo.bannerColor,
      damageBonus: fusion.combo.bonusDualDamage
    });
  };

  return (
    <div className={`max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6 arena-bg-${arenaBg} rounded-3xl transition-all duration-700`}>
      
      {/* 1. TOP STATUS BAR: MATCH INFO & ARENA SELECTOR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <button
              onClick={onReturnToTree}
              className="px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all"
            >
              ← Tournament Tree
            </button>
            <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-heading font-black tracking-wider uppercase">
              {match.roundName} • MATCH #{match.id.slice(-4)}
            </span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            {p1.name} <span className="text-red-500 text-xl sm:text-2xl font-mono">VS</span> {p2.name}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Battle continues until an entire team has 0 HP standing!
          </p>
        </div>

        {/* Right: Team Life Meter & Score */}
        <div className="flex items-center gap-6 bg-black/70 px-6 py-3.5 rounded-2xl border border-white/15 shadow-inner">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase text-red-400 flex items-center justify-center gap-1">
              <span>{p1.avatar}</span>
              <span className="truncate max-w-[90px]">{p1.name}</span>
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
              <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
              <span>{p1LivingCount}/{p1.collection.length} ALIVE</span>
            </div>
            <span className="font-heading font-black text-2xl text-emerald-400 block">
              {match.player1Score} WINS
            </span>
          </div>

          <div className="h-12 w-px bg-white/20" />

          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase text-blue-400 flex items-center justify-center gap-1">
              <span>{p2.avatar}</span>
              <span className="truncate max-w-[90px]">{p2.name}</span>
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
              <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
              <span>{p2LivingCount}/{p2.collection.length} ALIVE</span>
            </div>
            <span className="font-heading font-black text-2xl text-cyan-400 block">
              {match.player2Score} WINS
            </span>
          </div>
        </div>
      </div>

      {/* 2. GRAND HEAD-TO-HEAD SPOTLIGHT DUEL ARENA */}
      {!isMatchComplete && (
        <div className={`relative rounded-3xl p-4 sm:p-8 border-2 border-purple-500/40 bg-gradient-to-b from-purple-950/40 via-black/90 to-indigo-950/40 shadow-glow-cosmic overflow-hidden transition-all duration-300 ${
          isClashing ? 'scale-[0.99] brightness-150 animate-shake' : ''
        }`}>
          
          {/* 2D Combat FX Particle, Laser, Lightning & Slash Overlay */}
          <CombatFXOverlay
            effectType={activeEffectType}
            attackerSide={p1Attacking ? 'left' : 'right'}
            comicBurst={activeComicBurst}
            isSuperMove={isSuperCutIn}
            superHeroName={superHeroName}
            superHeroImageUrl={superHeroImageUrl}
            superAbilityName={superAbilityName}
            signatureMoveName={activeSignatureMoveName}
          />

          {/* Floating Healing Popup */}
          {healingPopup && (
            <div className="absolute top-8 left-1/4 -translate-x-1/2 z-40 animate-bounce">
              <div className="bg-emerald-500 text-black font-heading font-black text-sm sm:text-base px-4 py-2 rounded-2xl shadow-[0_0_25px_#10B981] border-2 border-white">
                💚 {healingPopup}
              </div>
            </div>
          )}

          {/* Top Clash Bar Title */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-4 mb-6 gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              <h2 className="font-heading font-black text-base sm:text-xl text-white tracking-wide uppercase">
                ACTIVE DUEL SPOTLIGHT • ROUND {match.rounds.length + 1}
              </h2>
            </div>
            
            {/* Ready Statuses */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                match.player1Ready 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                  : 'bg-stone-900 text-stone-400 border-white/10'
              }`}>
                {p1.name}: {match.player1Ready ? '🟢 READY ✓' : '🟡 CHOOSING...'}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                match.player2Ready 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                  : 'bg-stone-900 text-stone-400 border-white/10'
              }`}>
                {p2.name}: {match.player2Ready ? '🟢 READY ✓' : '🟡 CHOOSING...'}
              </span>
            </div>
          </div>

          {/* Center Stage: Two Large Heroes Facing Off */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* PLAYER 1 ACTIVE FIGHTER (5 Cols) */}
            <div className={`lg:col-span-5 rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-red-950/50 to-black/80 border-2 border-red-500/60 shadow-[0_0_30px_rgba(230,36,41,0.25)] space-y-4 relative overflow-hidden transition-all duration-300 ${
              isClashing ? 'translate-x-6 sm:translate-x-12 scale-[1.02] shadow-[0_0_50px_rgba(230,36,41,0.8)]' : ''
            }`}>
              {/* Defense Energy Shield Overlay */}
              {p1Action === 'DEFEND' && (
                <div className="absolute inset-0 bg-blue-500/15 border-2 border-blue-400 rounded-3xl pointer-events-none z-20 animate-shield-pulse flex items-center justify-center">
                  <div className="bg-blue-950/90 text-blue-300 font-heading font-black text-xs px-3 py-1 rounded-full border border-blue-400 shadow-lg flex items-center gap-1.5 animate-bounce">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>DEFENSIVE SHIELD ACTIVE (50% GUARD)</span>
                  </div>
                </div>
              )}

              {/* K.O. Stamp Overlay if fainted */}
              {(p1SelectedHero?.currentHp !== undefined && p1SelectedHero.currentHp <= 0) && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-3xl flex items-center justify-center z-30 pointer-events-none">
                  <div className="animate-ko-stamp bg-red-600 text-white font-heading font-black text-3xl sm:text-4xl px-6 py-2 rounded-2xl border-4 border-white shadow-[0_0_40px_rgba(230,36,41,0.9)] rotate-[-8deg]">
                    💥 K.O.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-red-300 bg-red-900/60 px-3 py-1 rounded-full border border-red-500/40 flex items-center gap-1.5">
                  <span>{p1.name}'S CHAMPION</span>
                  {match.player1Ready && (
                    <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                      READY ✓
                    </span>
                  )}
                </span>
                <span className="text-xs font-black text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  ⚡ POWER: {p1SelectedHero?.overallPower || 80}
                </span>
              </div>

              {/* Character Portrait & Floating Damage Popups */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 relative">
                {latestRound && latestRound.player2DamageDealt !== undefined && latestRound.player2DamageDealt > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="animate-damage-float bg-red-600 text-white font-heading font-black text-sm px-3 py-1 rounded-full border-2 border-white shadow-[0_0_20px_rgba(230,36,41,0.9)]">
                      💥 -{latestRound.player2DamageDealt} HP!
                    </div>
                  </div>
                )}

                <div className="relative shrink-0">
                  <Fighter2DSprite
                    character={p1SelectedHero}
                    side="p1"
                    isAttacking={p1Attacking}
                    isTakingHit={p1TakingHit}
                    isDefending={p1Action === 'DEFEND'}
                    isSuperActive={p1Action === 'SPECIAL' || p1Action.startsWith('SKILL_')}
                    isDefeated={(p1SelectedHero?.currentHp !== undefined && p1SelectedHero.currentHp <= 0)}
                  />
                </div>

                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-white leading-tight truncate drop-shadow">
                    {p1SelectedHero?.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {p1SelectedHero?.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                      🛡️ {p1SelectedHero?.factions?.[0] || p1SelectedHero?.alignment || 'Marvel'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 truncate max-w-[140px]">
                      ✨ {p1SelectedHero?.specialAbilities?.[0]?.name || p1SelectedHero?.powers || 'Signature Move'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Bar & Healing Potion (1x Match Limit) */}
              <div className="space-y-2 bg-black/50 p-3 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>CHAMPION HEALTH</span>
                  </span>
                  <span className="text-sm font-mono text-emerald-400">
                    {p1SelectedHero?.currentHp !== undefined ? p1SelectedHero.currentHp : 100} / {p1SelectedHero?.maxHp || 100} HP ({getHpPercent(p1SelectedHero)}%)
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/15">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getHpGradient(getHpPercent(p1SelectedHero))}`}
                    style={{ width: `${getHpPercent(p1SelectedHero)}%` }}
                  />
                </div>

                {/* Interactive Healing Potion Button (1x Match Limit) */}
                <div className="pt-1 flex items-center justify-between">
                  <button
                    disabled={p1UsedHealingPotion || (p1SelectedHero?.currentHp ?? 100) >= (p1SelectedHero?.maxHp ?? 100)}
                    onClick={handleUseHealingPotion}
                    className={`px-3 py-1 rounded-xl font-heading font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 border shadow ${
                      p1UsedHealingPotion
                        ? 'bg-slate-900/60 text-slate-500 border-slate-700 cursor-not-allowed opacity-50'
                        : 'bg-emerald-950/90 text-emerald-300 hover:bg-emerald-900 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-pulse'
                    }`}
                  >
                    <TestTube2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{p1UsedHealingPotion ? '🧪 HEAL POTION (USED 1x)' : '🧪 USE HEALING POTION (+40 HP)'}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p1UsedHealingPotion ? '0 Potions Left' : '1 Potion Available'}
                  </span>
                </div>
              </div>

              {/* TACTICAL COMBAT COMMANDS */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-red-300 block">
                    CHOOSE {p1SelectedHero?.name.toUpperCase()}'S MOVE:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setP1Action('ATTACK');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p1Action === 'ATTACK'
                        ? 'bg-red-900/80 border-red-400 ring-2 ring-red-400 shadow-glow-red scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-red-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-red-200">
                      <Swords className="w-3.5 h-3.5 text-red-400" />
                      <span>⚔️ STRIKE ATTACK</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Heavy assault + roll</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setP1Action('SPECIAL');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p1Action === 'SPECIAL'
                        ? 'bg-purple-900/80 border-purple-400 ring-2 ring-purple-400 shadow-glow-cosmic scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-purple-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-purple-200 truncate">
                      <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">⚡ {p1SelectedHero?.specialAbilities?.[0]?.name.toUpperCase() || 'SIGNATURE MOVE'}</span>
                    </div>
                    <span className="text-[9px] text-purple-300 block mt-0.5 truncate">
                      {p1SelectedHero?.specialAbilities?.[0]?.description || p1SelectedHero?.powers || 'Superpower strike'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setP1Action('DEFEND');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p1Action === 'DEFEND'
                        ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-blue-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-blue-200">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span>🛡️ DEFENSIVE GUARD</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">50% Damage Guard</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setP1Action('ARTIFACT');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p1Action === 'ARTIFACT'
                        ? 'bg-amber-900/80 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-amber-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>🔮 RELIC SURGE</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {p1SelectedHero?.equippedArtifact ? p1SelectedHero.equippedArtifact.name : 'Equipped Artifact'}
                    </span>
                  </button>
                </div>

                {/* 5 Unique Skills with 1-Time Usage Limit in Classic Matches */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-300">
                      ⚡ 5 SIGNATURE SKILLS (1-TIME USE ONLY PER MATCH):
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {5 - p1UsedSkillIds.filter(id => id.startsWith(`sk-${p1SelectedHero?.id}`)).length} / 5 Available
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {getSkillsForCharacter(p1SelectedHero).map((skill) => {
                      const isUsed = p1UsedSkillIds.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          disabled={isUsed}
                          onClick={() => handleUseSkill(skill)}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            isUsed
                              ? 'bg-black/30 border-slate-800 opacity-40 text-slate-500 cursor-not-allowed'
                              : p1Action === 'SPECIAL'
                              ? 'bg-purple-950/90 border-purple-400 ring-1 ring-purple-400 text-purple-200'
                              : 'bg-black/60 border-white/10 hover:border-purple-500/50 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-black text-xs text-white truncate flex items-center gap-1">
                              <span>{skill.icon}</span>
                              <span className="truncate">{skill.name}</span>
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isUsed ? 'bg-red-950 text-red-400' : 'bg-purple-950 text-purple-300'}`}>
                              {isUsed ? 'USED (1x)' : `+${skill.bonusPower} PWR`}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 block truncate mt-0.5">{skill.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* CENTER VS EMBLEM (1 Col) */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 space-y-2">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-red-600 via-purple-600 to-blue-600 p-0.5 shadow-glow-cosmic flex items-center justify-center transition-transform ${
                isClashing ? 'scale-125 animate-ping' : 'animate-pulse'
              }`}>
                <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center">
                  <Swords className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 animate-spin" />
                </div>
              </div>
              <span className="font-heading font-black text-xl sm:text-2xl text-white drop-shadow">VS</span>
            </div>

            {/* PLAYER 2 ACTIVE FIGHTER (5 Cols) */}
            <div className={`lg:col-span-5 rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-blue-950/50 to-black/80 border-2 border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)] space-y-4 relative overflow-hidden transition-all duration-300 ${
              isClashing ? '-translate-x-6 sm:-translate-x-12 scale-[1.02] shadow-[0_0_50px_rgba(59,130,246,0.8)]' : ''
            }`}>
              {/* Defense Energy Shield Overlay */}
              {p2Action === 'DEFEND' && (
                <div className="absolute inset-0 bg-blue-500/15 border-2 border-blue-400 rounded-3xl pointer-events-none z-20 animate-shield-pulse flex items-center justify-center">
                  <div className="bg-blue-950/90 text-blue-300 font-heading font-black text-xs px-3 py-1 rounded-full border border-blue-400 shadow-lg flex items-center gap-1.5 animate-bounce">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>DEFENSIVE SHIELD ACTIVE (50% GUARD)</span>
                  </div>
                </div>
              )}

              {/* K.O. Stamp Overlay if fainted */}
              {(p2SelectedHero?.currentHp !== undefined && p2SelectedHero.currentHp <= 0) && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-3xl flex items-center justify-center z-30 pointer-events-none">
                  <div className="animate-ko-stamp bg-red-600 text-white font-heading font-black text-3xl sm:text-4xl px-6 py-2 rounded-2xl border-4 border-white shadow-[0_0_40px_rgba(230,36,41,0.9)] rotate-[-8deg]">
                    💥 K.O.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-300 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-500/40 flex items-center gap-1.5">
                  <span>{p2.name}'S CHAMPION {p2.isBot && '🤖 AI'}</span>
                  {match.player2Ready && (
                    <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                      READY ✓
                    </span>
                  )}
                </span>
                <span className="text-xs font-black text-cyan-300 bg-black/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  ⚡ POWER: {p2SelectedHero?.overallPower || 85}
                </span>
              </div>

              {/* Large Character Portrait & Floating Damage Popups */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 relative">
                {latestRound && latestRound.player1DamageDealt !== undefined && latestRound.player1DamageDealt > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="animate-damage-float bg-red-600 text-white font-heading font-black text-sm px-3 py-1 rounded-full border-2 border-white shadow-[0_0_20px_rgba(230,36,41,0.9)]">
                      💥 -{latestRound.player1DamageDealt} HP!
                    </div>
                  </div>
                )}

                <div className="relative shrink-0">
                  <Fighter2DSprite
                    character={p2SelectedHero}
                    side="p2"
                    isAttacking={p2Attacking}
                    isTakingHit={p2TakingHit}
                    isDefending={p2Action === 'DEFEND'}
                    isSuperActive={p2Action === 'SPECIAL' || p2Action.startsWith('SKILL_')}
                    isDefeated={(p2SelectedHero?.currentHp !== undefined && p2SelectedHero.currentHp <= 0)}
                  />
                </div>

                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-white leading-tight truncate drop-shadow">
                    {p2SelectedHero?.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {p2SelectedHero?.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                      🛡️ {p2SelectedHero?.factions?.[0] || p2SelectedHero?.alignment || 'Marvel'}
                    </span>
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40 truncate max-w-[140px]">
                      ✨ {p2SelectedHero?.specialAbilities?.[0]?.name || p2SelectedHero?.powers || 'Cosmic Surge'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Bar */}
              <div className="space-y-1 bg-black/50 p-3 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />
                    <span>CHAMPION HEALTH</span>
                  </span>
                  <span className="text-sm font-mono text-cyan-400">
                    {p2SelectedHero?.currentHp !== undefined ? p2SelectedHero.currentHp : 100} / {p2SelectedHero?.maxHp || 100} HP ({getHpPercent(p2SelectedHero)}%)
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/15">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getHpGradient(getHpPercent(p2SelectedHero))}`}
                    style={{ width: `${getHpPercent(p2SelectedHero)}%` }}
                  />
                </div>
              </div>

              {/* P2 COMBAT MOVES */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-blue-300 block">
                    {p2.isBot ? '🤖 AI AUTO-TACTICAL SELECTION' : `CHOOSE ${p2SelectedHero?.name.toUpperCase()}'S MOVE:`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    disabled={p2.isBot}
                    onClick={() => {
                      if (!p2.isBot) {
                        soundManager.playClick();
                        setP2Action('ATTACK');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p2Action === 'ATTACK'
                        ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400 shadow-glow-blue scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-blue-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-blue-200">
                      <Swords className="w-3.5 h-3.5 text-blue-400" />
                      <span>⚔️ STRIKE ATTACK</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Heavy assault + roll</span>
                  </button>

                  <button
                    disabled={p2.isBot}
                    onClick={() => {
                      if (!p2.isBot) {
                        soundManager.playClick();
                        setP2Action('SPECIAL');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p2Action === 'SPECIAL'
                        ? 'bg-purple-900/80 border-purple-400 ring-2 ring-purple-400 shadow-glow-cosmic scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-purple-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-purple-200 truncate">
                      <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">⚡ {p2SelectedHero?.specialAbilities?.[0]?.name.toUpperCase() || 'SIGNATURE MOVE'}</span>
                    </div>
                    <span className="text-[9px] text-purple-300 block mt-0.5 truncate">
                      {p2SelectedHero?.specialAbilities?.[0]?.description || p2SelectedHero?.powers || 'Superpower strike'}
                    </span>
                  </button>

                  <button
                    disabled={p2.isBot}
                    onClick={() => {
                      if (!p2.isBot) {
                        soundManager.playClick();
                        setP2Action('DEFEND');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p2Action === 'DEFEND'
                        ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400 scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-blue-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-blue-200">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span>🛡️ DEFENSIVE GUARD</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">50% Damage Guard</span>
                  </button>

                  <button
                    disabled={p2.isBot}
                    onClick={() => {
                      if (!p2.isBot) {
                        soundManager.playClick();
                        setP2Action('ARTIFACT');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      p2Action === 'ARTIFACT'
                        ? 'bg-amber-900/80 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                        : 'bg-black/50 border-white/10 hover:border-amber-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>🔮 RELIC SURGE</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {p2SelectedHero?.equippedArtifact ? p2SelectedHero.equippedArtifact.name : 'Equipped Artifact'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* 3. HEROIC ROSTER DOCKS (Switch Active Fighter) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10 mt-6">
            
            {/* Player 1 Roster Bench */}
            <div className="space-y-2">
              {/* In-Battle Tag-Team Fusion Banner */}
              {p1Fusions.length > 0 && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950 via-purple-950 to-pink-950 border border-pink-500/70 shadow-[0_0_25px_rgba(236,72,153,0.4)] animate-pulse space-y-1.5 mb-2">
                  <span className="text-[10px] font-black text-pink-300 uppercase tracking-wider block">
                    ⚡ IN-BATTLE TAG-TEAM FUSION DETECTED!
                  </span>
                  {p1Fusions.map((fusion, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleInBattleMerge(fusion)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all"
                    >
                      <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                      <span>🔥 MERGE ULTIMATE HERO: {fusion.hero1.name} + {fusion.hero2.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <span className="text-xs font-black uppercase text-red-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-red-400" />
                <span>{p1.name}'S ROSTER BENCH (CLICK TO SWAP ACTIVE FIGHTER):</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {p1.collection.map((c, i) => {
                  const hp = c.currentHp !== undefined ? c.currentHp : 100;
                  const isDead = hp <= 0;
                  const isSelected = p1HeroIdx === i;

                  return (
                    <button
                      key={c.id}
                      disabled={isDead}
                      onClick={() => {
                        soundManager.playClick();
                        setP1HeroIdx(i);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isDead
                          ? 'bg-red-950/20 border-red-950 opacity-40 grayscale cursor-not-allowed'
                          : isSelected
                          ? 'bg-red-900/80 border-red-400 ring-2 ring-red-400/80 shadow-glow-red scale-105'
                          : 'bg-black/60 border-white/10 hover:border-red-500/50 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <CharacterPortrait character={c} size="sm" />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span className="text-xs font-black text-white block truncate leading-tight">{c.name}</span>
                        <span className={`text-[10px] font-black flex items-center gap-1 ${isDead ? 'text-red-500' : 'text-emerald-400'}`}>
                          {isDead ? (
                            <>
                              <Skull className="w-3 h-3 text-red-500" />
                              <span>KO</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-3 h-3 text-red-400 fill-current" />
                              <span>{hp} HP</span>
                            </>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Player 2 Roster Bench */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-blue-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>{p2.name}'S ROSTER BENCH:</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {p2.collection.map((c, i) => {
                  const hp = c.currentHp !== undefined ? c.currentHp : 100;
                  const isDead = hp <= 0;
                  const isSelected = p2HeroIdx === i;

                  return (
                    <button
                      key={c.id}
                      disabled={isDead || p2.isBot}
                      onClick={() => {
                        if (!p2.isBot && !isDead) {
                          soundManager.playClick();
                          setP2HeroIdx(i);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isDead
                          ? 'bg-red-950/20 border-red-950 opacity-40 grayscale cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
                          : 'bg-black/60 border-white/10 hover:border-blue-500/50 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <CharacterPortrait character={c} size="sm" />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span className="text-xs font-black text-white block truncate leading-tight">{c.name}</span>
                        <span className={`text-[10px] font-black flex items-center gap-1 ${isDead ? 'text-red-500' : 'text-emerald-400'}`}>
                          {isDead ? (
                            <>
                              <Skull className="w-3 h-3 text-red-500" />
                              <span>KO</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-3 h-3 text-red-400 fill-current" />
                              <span>{hp} HP</span>
                            </>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 4. MASSIVE UNLEASH CLASH BUTTON */}
          <div className="pt-6">
            {isOnlineMode && !isUserP1 && !isUserP2 ? (
              <div className="w-full py-5 rounded-3xl font-heading font-black text-sm sm:text-base uppercase tracking-widest bg-black/60 border border-white/20 text-slate-300 flex items-center justify-center gap-3">
                <Swords className="w-5 h-5 text-amber-400 animate-spin" />
                <span>👁️ SPECTATING DUEL • AWAITING {p1.name.toUpperCase()} & {p2.name.toUpperCase()} TO LOCK IN...</span>
              </div>
            ) : (
              <button
                onClick={handleExecuteRound}
                disabled={isUserLocked}
                className={`w-full py-5 rounded-3xl font-heading font-black text-base sm:text-xl uppercase tracking-widest border-2 transition-all transform flex items-center justify-center gap-3 ${
                  isUserLocked
                    ? 'bg-purple-950/80 border-purple-400/80 text-purple-200 shadow-glow-cosmic cursor-wait'
                    : 'bg-gradient-to-r from-red-600 via-purple-600 to-rose-600 hover:from-red-500 hover:to-purple-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.7)] border-amber-400 hover:scale-[1.01] active:scale-[0.99] animate-pulse'
                }`}
              >
                <Swords className="w-6 h-6 text-amber-300 animate-spin" />
                <span>
                  {isOnlineMode
                    ? isUserLocked
                      ? '⏳ MOVE LOCKED IN • WAITING FOR OPPONENT...'
                      : `⚡ LOCK IN ${isUserP1 ? p1SelectedHero?.name : p2SelectedHero?.name}'S MOVE (${isUserP1 ? p1Action : p2Action}) ⚡`
                    : `⚡ UNLEASH ROUND ${match.rounds.length + 1} CLASH! ⚡`}
                </span>
                <Swords className="w-6 h-6 text-amber-300 animate-spin" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* 5. ANIMATED RECENT ROUND CLASH RESOLUTION */}
      {latestRound && (
        <CombatClash
          round={latestRound}
          player1={match.player1}
          player2={match.player2}
        />
      )}

      {/* 6. TOURNAMENT CHAMPION ADVANCE BANNER */}
      {isMatchComplete && (
        <div className="glass-panel-glow p-8 rounded-3xl border-2 border-emerald-500/70 text-center space-y-5 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-shake">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-400 text-xs font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>MATCH VICTORY • {match.winner?.name.toUpperCase()} ADVANCES!</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            👑 VICTORY FOR {match.winner?.name}!
          </h2>

          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            {match.winner?.name} conquered the duel arena! Advance to the tournament tree to proceed with the next playoff showdown!
          </p>

          <button
            onClick={() => {
              soundManager.playClick();
              onReturnToTree();
            }}
            className="px-10 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-heading font-black text-base uppercase tracking-wider rounded-2xl shadow-glow-red transition-all flex items-center justify-center gap-2.5 mx-auto transform hover:scale-105"
          >
            <span>ADVANCE TO TOURNAMENT TREE</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 7. Full-Screen Ultimate Animations Overlay */}
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

      {/* 8. Floating Comic Reactions Bar */}
      <FloatingReactions playerName={isUserP1 ? p1.name : p2.name} />

    </div>
  );
}

import { useState, useEffect } from 'react';
import { TournamentMatch, GameState, BattleActionType, Character, ArenaBackgroundId } from '../../types/game';
import { CombatClash } from './CombatClash';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { UltimateAnimationOverlay } from '../common/UltimateAnimationOverlay';
import { FloatingReactions } from '../common/FloatingReactions';
import { getFighterTagTeamCombo, TagTeamCombo } from '../../engine/synergyEngine';
import { getSkillsForCharacter } from '../../data/skills/characterSkills';
import { 
  Swords, Trophy, ArrowRight, Zap, Shield, Sparkles, Heart, Flame, 
  Crosshair, ShieldAlert, Cpu, Activity, Skull, MapPin, Eye
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { playSound } from '../../audio/soundEffects';

interface Props {
  state: GameState;
  onReturnToTree: () => void;
  onExecuteAction?: (matchId: string, action1: BattleActionType, action2: BattleActionType, p1HeroIdx: number, p2HeroIdx: number) => void;
  isOnlineMode?: boolean;
  controllingPlayerId?: string;
}

export function BattlePhase({ 
  state, 
  onReturnToTree, 
  onExecuteAction,
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

  const hasP1Locked = !!match.player1Action;
  const hasP2Locked = !!match.player2Action;
  const isUserLocked = isOnlineMode ? (isUserP1 ? hasP1Locked : isUserP2 ? hasP2Locked : false) : false;

  // Automatically select first alive hero if current selection fainted
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
        botHeroIdx = liveHeroes[Math.floor(Math.random() * liveHeroes.length)].i;
      }
      const actions: BattleActionType[] = ['ATTACK', 'SPECIAL', 'DEFEND', 'ARTIFACT'];
      botAction = actions[Math.floor(Math.random() * actions.length)];
    }

    setIsClashing(true);
    soundManager.playAttackHit();

    setTimeout(() => {
      onExecuteAction(match.id, p1Action, botAction, p1HeroIdx, botHeroIdx);
      setIsClashing(false);
    }, 450);
  };

  const getHpPercent = (hero?: Character) => {
    if (!hero) return 100;
    const hp = hero.currentHp !== undefined ? hero.currentHp : 100;
    const max = hero.maxHp || 100;
    return Math.max(0, Math.min(100, Math.round((hp / max) * 100)));
  };

  const getHpGradient = (percent: number) => {
    if (percent > 55) return 'from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.7)]';
    if (percent > 25) return 'from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.7)]';
    return 'from-red-600 via-rose-600 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-pulse';
  };

  const p1LivingCount = p1.collection.filter(c => (c.currentHp === undefined || c.currentHp > 0)).length;
  const p2LivingCount = p2.collection.filter(c => (c.currentHp === undefined || c.currentHp > 0)).length;

  const p1Combo = getFighterTagTeamCombo(p1SelectedHero, p1.collection);
  const p2Combo = getFighterTagTeamCombo(p2SelectedHero, p2.collection);

  const getArenaBackdropClass = () => {
    switch (arenaBg) {
      case 'asgard':
        return 'from-amber-950/80 via-slate-950/95 to-black border-amber-500/40 shadow-glow-gold';
      case 'quantum':
        return 'from-indigo-950/80 via-slate-950/95 to-black border-indigo-500/40 shadow-glow-cosmic';
      case 'avengers':
        return 'from-slate-900/80 via-slate-950/95 to-black border-red-500/40 shadow-glow-red';
      case 'knowhere':
        return 'from-rose-950/80 via-slate-950/95 to-black border-purple-500/40 shadow-glow-cosmic';
      case 'wakanda':
      default:
        return 'from-purple-950/80 via-slate-950/95 to-black border-purple-500/40 shadow-glow-cosmic';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-8 animate-fadeIn">
      
      {/* 1. ARENA TITAN BANNER & SCOREBOARD & ARENA SELECTOR */}
      <div className={`relative rounded-3xl p-5 sm:p-7 border bg-gradient-to-r ${getArenaBackdropClass()} shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl transition-all duration-500`}>
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
        
        {/* Left: Tournament & Match Tier */}
        <div className="relative z-10 text-center md:text-left space-y-1">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-900/60 border border-red-500/50 text-[11px] font-black uppercase text-red-200 tracking-widest">
              <Swords className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{match.roundName} BATTLE ARENA • DEATHMATCH</span>
            </div>

            {/* Arena Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-full border border-white/10 text-[10px] font-bold">
              <span className="text-gray-400 pl-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
              </span>
              <button 
                onClick={() => setArenaBg('wakanda')} 
                className={`px-2 py-0.5 rounded-full transition-colors ${arenaBg === 'wakanda' ? 'bg-purple-600 text-white font-black' : 'text-gray-400 hover:text-white'}`}
              >
                Wakanda
              </button>
              <button 
                onClick={() => setArenaBg('asgard')} 
                className={`px-2 py-0.5 rounded-full transition-colors ${arenaBg === 'asgard' ? 'bg-amber-600 text-white font-black' : 'text-gray-400 hover:text-white'}`}
              >
                Asgard
              </button>
              <button 
                onClick={() => setArenaBg('quantum')} 
                className={`px-2 py-0.5 rounded-full transition-colors ${arenaBg === 'quantum' ? 'bg-indigo-600 text-white font-black' : 'text-gray-400 hover:text-white'}`}
              >
                Quantum
              </button>
              <button 
                onClick={() => setArenaBg('knowhere')} 
                className={`px-2 py-0.5 rounded-full transition-colors ${arenaBg === 'knowhere' ? 'bg-rose-600 text-white font-black' : 'text-gray-400 hover:text-white'}`}
              >
                Knowhere
              </button>
            </div>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            {p1.name} <span className="text-red-500 text-2xl font-mono">VS</span> {p2.name}
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Battle continues until an entire team has 0 HP standing!
          </p>
        </div>

        {/* Right: Team Life Meter & Score */}
        <div className="relative z-10 flex items-center gap-6 bg-black/70 px-6 py-3.5 rounded-2xl border border-white/15 shadow-inner">
          {/* P1 Stats */}
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

          {/* P2 Stats */}
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
        <div className={`relative rounded-3xl p-6 sm:p-8 border-2 border-purple-500/40 bg-gradient-to-b from-purple-950/40 via-black/90 to-indigo-950/40 shadow-glow-cosmic overflow-hidden transition-all duration-300 ${
          isClashing ? 'scale-[0.99] brightness-150 animate-shake' : ''
        }`}>
          {/* Top Clash Bar Title */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide uppercase">
                ACTIVE DUEL SPOTLIGHT • ROUND {match.rounds.length + 1}
              </h2>
            </div>
            <span className="text-xs font-extrabold text-amber-300 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-500/50 shadow-sm animate-pulse">
              ⚡ LIVE TACTICAL PHASE
            </span>
          </div>

          {/* Center Stage: Two Large Heroes Facing Off */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            
            {/* PLAYER 1 ACTIVE FIGHTER (5 Cols) */}
            <div className={`lg:col-span-5 rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-red-950/50 to-black/80 border-2 border-red-500/60 shadow-[0_0_30px_rgba(230,36,41,0.25)] space-y-4 relative overflow-hidden transition-all duration-300 ${
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
                <span className="text-xs font-black uppercase text-red-300 bg-red-900/60 px-3 py-1 rounded-full border border-red-500/40">
                  {p1.name}'S DEPLOYED CHAMPION
                </span>
                <span className="text-xs font-black text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  ⚡ POWER: {p1SelectedHero?.overallPower || 80}
                </span>
              </div>

              {/* Character Portrait & Floating Damage Popups */}
              <div className="flex flex-col sm:flex-row items-center gap-5 relative">
                {/* Floating Damage Popup */}
                {latestRound && latestRound.player2DamageDealt !== undefined && latestRound.player2DamageDealt > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="animate-damage-float bg-red-600 text-white font-heading font-black text-sm px-3 py-1 rounded-full border-2 border-white shadow-[0_0_20px_rgba(230,36,41,0.9)]">
                      💥 -{latestRound.player2DamageDealt} HP!
                    </div>
                  </div>
                )}

                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-red-400 shadow-[0_0_25px_rgba(230,36,41,0.6)] bg-black">
                    <img 
                      src={p1SelectedHero?.imageUrl} 
                      alt={p1SelectedHero?.name} 
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-white shadow">
                    {p1SelectedHero?.grade}
                  </span>
                </div>

                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-heading font-black text-2xl text-white leading-tight truncate drop-shadow">
                    {p1SelectedHero?.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {p1SelectedHero?.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                      🛡️ {p1SelectedHero?.factions?.[0] || p1SelectedHero?.alignment || 'Marvel'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 truncate max-w-[140px]">
                      ✨ {p1SelectedHero?.specialAbilities?.[0]?.name || p1SelectedHero?.powers || 'Signature Move'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Bar */}
              <div className="space-y-1 bg-black/50 p-3 rounded-2xl border border-white/10">
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
              </div>

              {/* TACTICAL COMBAT COMMANDS (Only shows equipped skills if purchased!) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-red-300 block">
                    CHOOSE {p1SelectedHero?.name.toUpperCase()}'S MOVE:
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {p1SelectedHero?.equippedSkills && p1SelectedHero.equippedSkills.length > 0
                      ? `⚡ ${p1SelectedHero.equippedSkills.length} Skills Equipped`
                      : '⚡ Skill Vault (0/5 Equipped)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* 1. Strike Attack */}
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

                  {/* 2. Signature Superpower */}
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

                  {/* 3. Defense Guard */}
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

                  {/* 4. Relic Power */}
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

                  {/* 5+. ONLY Render Equipped Skills ACTUALLY Purchased in Skill Vault! */}
                  {p1SelectedHero?.equippedSkills && p1SelectedHero.equippedSkills.map((sk: any, sIdx: number) => {
                    const actionKeys: BattleActionType[] = ['SKILL_1', 'SKILL_2', 'SKILL_3', 'SKILL_4', 'SKILL_5'];
                    const actKey = actionKeys[sIdx] || 'SPECIAL';
                    const isSelected = p1Action === actKey;
                    return (
                      <button
                        key={sk.id || sIdx}
                        onClick={() => {
                          soundManager.playClick();
                          setP1Action(actKey);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400 shadow-glow-cosmic scale-[1.02]'
                            : 'bg-slate-950/80 border-cyan-500/40 hover:border-cyan-400 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0 font-heading font-black text-xs text-cyan-200 truncate">
                            <span>{sk.icon || '🌟'}</span>
                            <span className="truncate">{sk.name}</span>
                          </div>
                          <span className="text-[8px] bg-cyan-950 text-cyan-300 font-bold px-1.5 py-0.5 rounded border border-cyan-500/40 shrink-0">
                            EQUIPPED
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                          <span className="text-amber-400 font-bold">+{sk.bonusPower || 10} PWR</span>
                          <span>{sk.triggerRate ? Math.round(sk.triggerRate * 100) : 60}% Rate</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Tag-Team Dual Strike (Bonus if Synergy unlocked) */}
                  {p1Combo && (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setP1Action('DUAL_STRIKE');
                        setUltimateOverlay({
                          isOpen: true,
                          type: 'dual_strike',
                          heroName: p1SelectedHero.name,
                          partnerHeroName: p1Combo.hero2Name === p1SelectedHero.name ? p1Combo.hero1Name : p1Combo.hero2Name,
                          abilityTitle: p1Combo.comboTitle,
                          description: p1Combo.comboDescription,
                          bannerColor: p1Combo.bannerColor,
                          damageBonus: p1Combo.bonusDualDamage
                        });
                      }}
                      className={`col-span-1 sm:col-span-2 p-3 rounded-xl border text-left transition-all ${
                        p1Action === 'DUAL_STRIKE'
                          ? 'bg-gradient-to-r from-red-950 via-amber-900 to-purple-950 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                          : 'bg-gradient-to-r from-red-950/60 to-purple-950/60 border-amber-500/50 hover:border-amber-400 text-amber-200 animate-pulse'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-heading font-black text-xs text-amber-300 truncate">
                          <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                          <span className="truncate">🔥 DUAL STRIKE: {p1Combo.comboTitle}</span>
                        </div>
                        <span className="text-[10px] bg-red-950 text-red-300 font-extrabold px-2 py-0.5 rounded border border-red-500/40 shrink-0">
                          +{p1Combo.bonusDualDamage} DMG
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* CENTER VS EMBLEM (1 Col) */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 space-y-2">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-red-600 via-purple-600 to-blue-600 p-0.5 shadow-glow-cosmic flex items-center justify-center transition-transform ${
                isClashing ? 'scale-125 animate-ping' : 'animate-pulse'
              }`}>
                <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center">
                  <Swords className="w-7 h-7 text-amber-400 animate-spin" />
                </div>
              </div>
              <span className="font-heading font-black text-2xl text-white drop-shadow">VS</span>
            </div>

            {/* PLAYER 2 ACTIVE FIGHTER (5 Cols) */}
            <div className={`lg:col-span-5 rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-blue-950/50 to-black/80 border-2 border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.25)] space-y-4 relative overflow-hidden transition-all duration-300 ${
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
                <span className="text-xs font-black uppercase text-blue-300 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-500/40">
                  {p2.name}'S DEPLOYED CHAMPION {p2.isBot && '🤖 AI'}
                </span>
                <span className="text-xs font-black text-cyan-300 bg-black/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  ⚡ POWER: {p2SelectedHero?.overallPower || 85}
                </span>
              </div>

              {/* Large Character Portrait & Floating Damage Popups */}
              <div className="flex flex-col sm:flex-row items-center gap-5 relative">
                {/* Floating Damage Popup */}
                {latestRound && latestRound.player1DamageDealt !== undefined && latestRound.player1DamageDealt > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="animate-damage-float bg-red-600 text-white font-heading font-black text-sm px-3 py-1 rounded-full border-2 border-white shadow-[0_0_20px_rgba(230,36,41,0.9)]">
                      💥 -{latestRound.player1DamageDealt} HP!
                    </div>
                  </div>
                )}

                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.6)] bg-black">
                    <img 
                      src={p2SelectedHero?.imageUrl} 
                      alt={p2SelectedHero?.name} 
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-white shadow">
                    {p2SelectedHero?.grade}
                  </span>
                </div>

                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-heading font-black text-2xl text-white leading-tight truncate drop-shadow">
                    {p2SelectedHero?.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {p2SelectedHero?.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
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
                  <span className="text-[10px] text-slate-400 font-bold">
                    {p2SelectedHero?.equippedSkills && p2SelectedHero.equippedSkills.length > 0
                      ? `⚡ ${p2SelectedHero.equippedSkills.length} Skills Equipped`
                      : '⚡ Skill Vault (0/5 Equipped)'}
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

                  {/* P2 Equipped Skills if purchased */}
                  {p2SelectedHero?.equippedSkills && p2SelectedHero.equippedSkills.map((sk: any, sIdx: number) => {
                    const actionKeys: BattleActionType[] = ['SKILL_1', 'SKILL_2', 'SKILL_3', 'SKILL_4', 'SKILL_5'];
                    const actKey = actionKeys[sIdx] || 'SPECIAL';
                    const isSelected = p2Action === actKey;
                    return (
                      <button
                        key={sk.id || sIdx}
                        disabled={p2.isBot}
                        onClick={() => {
                          if (!p2.isBot) {
                            soundManager.playClick();
                            setP2Action(actKey);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400 shadow-glow-cosmic scale-[1.02]'
                            : 'bg-slate-950/80 border-cyan-500/40 hover:border-cyan-400 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0 font-heading font-black text-xs text-cyan-200 truncate">
                            <span>{sk.icon || '🌟'}</span>
                            <span className="truncate">{sk.name}</span>
                          </div>
                          <span className="text-[8px] bg-cyan-950 text-cyan-300 font-bold px-1.5 py-0.5 rounded border border-cyan-500/40 shrink-0">
                            EQUIPPED
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                          <span className="text-amber-400 font-bold">+{sk.bonusPower || 10} PWR</span>
                          <span>{sk.triggerRate ? Math.round(sk.triggerRate * 100) : 60}% Rate</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* 5. P2 Tag-Team Dual Strike (Unlocked via Synergy) */}
                  {p2Combo && !p2.isBot && (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setP2Action('DUAL_STRIKE');
                        setUltimateOverlay({
                          isOpen: true,
                          type: 'dual_strike',
                          heroName: p2SelectedHero.name,
                          partnerHeroName: p2Combo.hero2Name === p2SelectedHero.name ? p2Combo.hero1Name : p2Combo.hero2Name,
                          abilityTitle: p2Combo.comboTitle,
                          description: p2Combo.comboDescription,
                          bannerColor: p2Combo.bannerColor,
                          damageBonus: p2Combo.bonusDualDamage
                        });
                      }}
                      className={`col-span-1 sm:col-span-2 p-3 rounded-xl border text-left transition-all ${
                        p2Action === 'DUAL_STRIKE'
                          ? 'bg-gradient-to-r from-blue-950 via-purple-900 to-amber-950 border-amber-400 ring-2 ring-amber-400 shadow-glow-gold scale-[1.02]'
                          : 'bg-gradient-to-r from-blue-950/60 to-purple-950/60 border-amber-500/50 hover:border-amber-400 text-amber-200 animate-pulse'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-heading font-black text-xs text-amber-300 truncate">
                          <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                          <span className="truncate">🔥 DUAL STRIKE: {p2Combo.comboTitle}</span>
                        </div>
                        <span className="text-[10px] bg-red-950 text-red-300 font-extrabold px-2 py-0.5 rounded border border-red-500/40 shrink-0">
                          +{p2Combo.bonusDualDamage} DMG
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* 3. BIG HEROIC ROSTER DOCKS (Switch Fighter On The Fly) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10 mt-6">
            
            {/* Player 1 Roster Dock */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-red-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-red-400" />
                <span>{p1.name}'S TEAM BENCH (CLICK TO SWAP ACTIVE FIGHTER):</span>
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
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        isDead
                          ? 'bg-red-950/20 border-red-950 opacity-40 grayscale cursor-not-allowed'
                          : isSelected
                          ? 'bg-red-900/80 border-red-400 ring-2 ring-red-400/80 shadow-glow-red scale-105'
                          : 'bg-black/60 border-white/10 hover:border-red-500/50 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                        <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span className="text-xs font-black text-white block truncate leading-tight">{c.name}</span>
                        <span className={`text-[10px] font-black flex items-center gap-1 ${isDead ? 'text-red-500' : 'text-emerald-400'}`}>
                          {isDead ? (
                            <>
                              <Skull className="w-3 h-3 text-red-500" />
                              <span>FAINTED</span>
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

            {/* Player 2 Roster Dock */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-blue-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>{p2.name}'S TEAM BENCH:</span>
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
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                        isDead
                          ? 'bg-red-950/20 border-red-950 opacity-40 grayscale cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
                          : 'bg-black/60 border-white/10 hover:border-blue-500/50 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                        <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span className="text-xs font-black text-white block truncate leading-tight">{c.name}</span>
                        <span className={`text-[10px] font-black flex items-center gap-1 ${isDead ? 'text-red-500' : 'text-emerald-400'}`}>
                          {isDead ? (
                            <>
                              <Skull className="w-3 h-3 text-red-500" />
                              <span>FAINTED</span>
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
                className={`w-full py-5 rounded-3xl font-heading font-black text-lg sm:text-xl uppercase tracking-widest border-2 transition-all transform flex items-center justify-center gap-3 ${
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



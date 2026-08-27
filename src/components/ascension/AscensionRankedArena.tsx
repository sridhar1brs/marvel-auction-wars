import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character } from '../../types/game';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { getSkillsForCharacter } from '../../data/skills/characterSkills';
import { 
  Trophy, Lock, Swords, Shield, Zap, Sparkles, Award, 
  Flame, CheckCircle2, ChevronRight, Crown, AlertTriangle, Play
} from 'lucide-react';

export function AscensionRankedArena() {
  const { user, recordAscensionMatch } = useAuth();
  const [matchFormat, setMatchFormat] = useState<'1v1' | '2v2' | '3v3'>('1v1');
  const [battleState, setBattleState] = useState<'IDLE' | 'MATCHMAKING' | 'DUEL' | 'RESULT'>('IDLE');
  const [queueTimer, setQueueTimer] = useState<number>(0);
  const [playerTeam, setPlayerTeam] = useState<Character[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Character[]>([]);
  const [opponentName, setOpponentName] = useState<string>('');
  const [opponentRating, setOpponentRating] = useState<number>(1000);
  const [combatLogs, setCombatLogs] = useState<string[]>([]);
  const [lastMatchResult, setLastMatchResult] = useState<{ isWin: boolean; ratingDelta: number; astraAwarded: number; newRating: number; newTier: string } | null>(null);

  const commanderLevel = user?.level || 1;
  const isLocked = commanderLevel < 10;

  const ownedCharIds = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);
  const availableRoster = useMemo(() => ALL_CHARACTERS.filter(c => ownedCharIds.has(c.id)), [ownedCharIds]);

  const teamSize = matchFormat === '1v1' ? 1 : matchFormat === '2v2' ? 2 : 3;

  // Rank Info Helper
  const rankInfo = useMemo(() => {
    const tier = user?.rankedTier || 'UNRANKED';
    const division = user?.rankedDivision || 0;
    const rating = user?.rankedRating || 0;
    const isPlacements = !user?.isPlacementsCompleted || tier === 'UNRANKED';
    const placementsPlayed = user?.placementMatchesPlayed || 0;

    let badgeColor = 'from-slate-700 to-slate-900 border-slate-600 text-slate-300';
    let icon = '🛡️';

    if (tier === 'ASCENDER') {
      badgeColor = 'from-amber-400 via-purple-600 to-cyan-400 border-amber-300 text-amber-200 shadow-glow-cosmic';
      icon = '⚡';
    } else if (tier === 'CELESTIAL') {
      badgeColor = 'from-purple-900 via-indigo-950 to-purple-800 border-purple-400 text-purple-200';
      icon = '🌌';
    } else if (tier === 'COSMIC') {
      badgeColor = 'from-indigo-900 to-blue-900 border-indigo-400 text-indigo-200';
      icon = '🪐';
    } else if (tier === 'VIBRANIUM') {
      badgeColor = 'from-teal-900 to-emerald-950 border-teal-400 text-teal-200';
      icon = '💠';
    } else if (tier === 'DIAMOND') {
      badgeColor = 'from-cyan-900 to-blue-950 border-cyan-400 text-cyan-200';
      icon = '💎';
    } else if (tier === 'PLATINUM') {
      badgeColor = 'from-slate-600 to-cyan-900 border-slate-300 text-white';
      icon = '⚔️';
    } else if (tier === 'GOLD') {
      badgeColor = 'from-amber-900 to-yellow-950 border-amber-400 text-amber-200';
      icon = '🏆';
    } else if (tier === 'SILVER') {
      badgeColor = 'from-slate-700 to-slate-800 border-slate-400 text-slate-200';
      icon = '🥈';
    } else if (tier === 'BRONZE') {
      badgeColor = 'from-orange-950 to-amber-950 border-orange-700 text-orange-300';
      icon = '🥉';
    }

    return { tier, division, rating, isPlacements, placementsPlayed, badgeColor, icon };
  }, [user]);

  // Handle Matchmaking Start
  const startMatchmaking = () => {
    if (playerTeam.length !== teamSize) return;

    soundManager.playClick();
    setBattleState('MATCHMAKING');
    setQueueTimer(0);

    const opponentPool = ['NovaSentinel', 'ThanosDisciple', 'ValkyriePrime', 'CosmicRider', 'AsgardWarlord', 'TitanCrusher', 'ShadowSpider'];
    const randomOpponent = opponentPool[Math.floor(Math.random() * opponentPool.length)];
    const oppRating = Math.max(100, (user?.rankedRating || 1000) + Math.floor(Math.random() * 200 - 100));

    // Simulated matchmaking countdown (1.5s - 3s)
    setTimeout(() => {
      soundManager.playVictoryFanfare();
      setOpponentName(randomOpponent);
      setOpponentRating(oppRating);

      // Pick Opponent Team
      const pool = ALL_CHARACTERS.slice().sort(() => 0.5 - Math.random());
      setOpponentTeam(pool.slice(0, teamSize));

      setCombatLogs([
        `🏆 RANKED MATCH FOUND!`,
        `⚔️ ${user?.displayName || user?.username} (${rankInfo.rating} MMR) VS ${randomOpponent} (${oppRating} MMR)`,
        `⚡ Format: Competitive ${matchFormat} Standard`
      ]);

      setBattleState('DUEL');
    }, 2200);
  };

  const handleExecuteTurn = async () => {
    const hero1 = playerTeam[0] || ALL_CHARACTERS[0];
    const oppHero = opponentTeam[0] || ALL_CHARACTERS[1];

    soundManager.playAttackHit();

    const pBoost = user?.characterStatsBoosts[hero1.id]?.power || 0;
    const pRoll = hero1.overallPower + pBoost + Math.floor(Math.random() * 25);
    const oppRoll = oppHero.overallPower + Math.floor(Math.random() * 25);

    const isWin = pRoll >= oppRoll;

    const res = await recordAscensionMatch({
      isWin,
      matchFormat,
      isRanked: true,
      isMvp: isWin && Math.random() > 0.5,
      isComeback: isWin && pRoll - oppRoll > 15,
      damageDealt: pRoll * 12
    });

    if (isWin) {
      soundManager.playVictoryFanfare();
    } else {
      soundManager.playDefeat();
    }

    setLastMatchResult({
      isWin,
      ratingDelta: isWin ? 25 : -15,
      astraAwarded: res?.astraAwarded || (isWin ? 1000 : 350),
      newRating: res?.newRating || rankInfo.rating,
      newTier: res?.newTier || rankInfo.tier
    });

    setBattleState('RESULT');
  };

  // 1. LOCKED VIEW (Level < 10)
  if (isLocked) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-gradient-to-b from-slate-900/95 via-purple-950/60 to-slate-950 border border-purple-500/30 rounded-3xl text-center shadow-2xl backdrop-blur-xl animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-4 bg-purple-950/80 border border-purple-500/50 rounded-2xl flex items-center justify-center text-4xl shadow-glow-purple">
          🔒
        </div>
        <div className="inline-block px-3 py-1 bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          Ranked Locked
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">
          Reach Commander Level 10
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
          Competitive Ranked matchmaking unlocks once you prove your mastery at Commander Level 10.
        </p>

        {/* Progress Bar towards Level 10 */}
        <div className="mt-6 max-w-md mx-auto p-4 bg-black/60 rounded-2xl border border-white/10">
          <div className="flex justify-between text-xs font-bold font-mono text-slate-400 mb-2">
            <span>Current: Level {commanderLevel}</span>
            <span className="text-cyan-400">Target: Level 10</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all"
              style={{ width: `${Math.min(100, (commanderLevel / 10) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Play Casual Battles, Dungeon Runs, and complete matches to level up!
          </p>
        </div>
      </div>
    );
  }

  // 2. UNLOCKED RANKED ARENA
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Banner with Rank Badge & Placement progress */}
      <div className={`p-6 bg-gradient-to-r ${rankInfo.badgeColor} rounded-3xl border shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-black/60 border border-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-xl">
            {rankInfo.icon}
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              Season 1 Competitive Ladder
            </div>
            <h2 className="text-3xl font-black text-white tracking-wide mt-0.5">
              {rankInfo.tier === 'ASCENDER'
                ? '⚡ ASCENDER'
                : rankInfo.isPlacements
                ? 'UNRANKED PLACEMENTS'
                : `${rankInfo.tier} ${rankInfo.division}`}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs font-bold font-mono">
              <span className="text-amber-300">⭐ {rankInfo.rating.toLocaleString()} MMR</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400">{user?.wins || 0} Wins</span>
              <span className="text-slate-400">•</span>
              <span className="text-cyan-300">{user?.winRate || 0}% Win Rate</span>
            </div>
          </div>
        </div>

        {/* Placements Tracker Card */}
        {rankInfo.isPlacements && (
          <div className="px-5 py-3.5 bg-black/60 border border-purple-500/40 rounded-2xl">
            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Placement Matches
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              {rankInfo.placementsPlayed} / 10 Completed
            </div>
            <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden mt-2 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-purple-500"
                style={{ width: `${(rankInfo.placementsPlayed / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Duel Flow */}
      {battleState === 'IDLE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Format Picker */}
          <div className="p-6 bg-slate-900/90 border border-purple-500/30 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Competitive Format</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['1v1', '2v2', '3v3'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    soundManager.playClick();
                    setMatchFormat(fmt);
                    setPlayerTeam([]);
                  }}
                  className={`py-3 rounded-xl font-bold font-mono text-sm border transition-all ${
                    matchFormat === fmt
                      ? 'bg-gradient-to-r from-amber-500 to-purple-600 border-amber-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <div className="text-white font-bold">Standard Match Rules:</div>
              <div>• Strict MMR rating matching</div>
              <div>• Ranked points: +25 on Win, -15 on Loss</div>
              <div>• Earn bonus Astra on Win Streaks</div>
            </div>

            <button
              onClick={startMatchmaking}
              disabled={playerTeam.length !== teamSize}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all"
            >
              {playerTeam.length === teamSize
                ? `Enter ${matchFormat} Ranked Queue`
                : `Select ${teamSize - playerTeam.length} More Hero${teamSize - playerTeam.length > 1 ? 'es' : ''}`}
            </button>
          </div>

          {/* Team Selector */}
          <div className="lg:col-span-2 p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-white">
                Select Your Competitive Roster ({playerTeam.length}/{teamSize})
              </h3>
              <span className="text-xs text-amber-400 font-bold">
                Owned Heroes: {availableRoster.length}
              </span>
            </div>

            {availableRoster.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                You do not own any heroes yet. Visit the Astra Shop or claim Battle Pass rewards to recruit heroes!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto pr-1">
                {availableRoster.map((hero) => {
                  const isSelected = playerTeam.some((c) => c.id === hero.id);
                  return (
                    <div
                      key={hero.id}
                      onClick={() => {
                        soundManager.playClick();
                        if (isSelected) {
                          setPlayerTeam(playerTeam.filter((c) => c.id !== hero.id));
                        } else if (playerTeam.length < teamSize) {
                          setPlayerTeam([...playerTeam, hero]);
                        }
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-glow-amber'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <CharacterPortrait character={hero} size="sm" showBadge={false} />
                      <div className="text-xs font-bold text-white mt-1.5 truncate w-full">
                        {hero.name}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        PWR {hero.overallPower + (user?.characterStatsBoosts[hero.id]?.power || 0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Matchmaking View */}
      {battleState === 'MATCHMAKING' && (
        <div className="py-16 text-center bg-slate-900/90 border border-purple-500/40 rounded-3xl shadow-2xl space-y-4 animate-pulse">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-3xl shadow-glow-cyan">
            ⚔️
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-wider">
            Searching for Opponent...
          </h3>
          <p className="text-sm text-purple-300 font-mono">
            Scanning Global {rankInfo.tier} Ladder • Matching MMR ({rankInfo.rating} Rating)
          </p>
        </div>
      )}

      {/* Duel Turn Resolution */}
      {battleState === 'DUEL' && (
        <div className="p-8 bg-slate-900/90 border border-purple-500/40 rounded-3xl shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Player Side */}
            <div className="p-6 bg-slate-950/80 border border-cyan-500/40 rounded-2xl text-center space-y-3">
              <div className="text-xs font-bold text-cyan-400 uppercase">You (Commander)</div>
              <div className="text-xl font-black text-white">{playerTeam[0]?.name}</div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                ⚡ PWR {playerTeam[0]?.overallPower + (user?.characterStatsBoosts[playerTeam[0]?.id]?.power || 0)}
              </div>
            </div>

            {/* Opponent Side */}
            <div className="p-6 bg-slate-950/80 border border-rose-500/40 rounded-2xl text-center space-y-3">
              <div className="text-xs font-bold text-rose-400 uppercase">Rival: {opponentName}</div>
              <div className="text-xl font-black text-white">{opponentTeam[0]?.name}</div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                ⚡ PWR {opponentTeam[0]?.overallPower}
              </div>
            </div>
          </div>

          <button
            onClick={handleExecuteTurn}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-400 text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-xl"
          >
            ⚡ Strike & Resolve Match
          </button>
        </div>
      )}

      {/* Match Result */}
      {battleState === 'RESULT' && lastMatchResult && (
        <div className="p-8 bg-slate-900/90 border border-amber-500/40 rounded-3xl text-center shadow-2xl space-y-5">
          <div className="text-6xl">
            {lastMatchResult.isWin ? '🏆' : '💀'}
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-wide">
            {lastMatchResult.isWin ? 'RANKED VICTORY!' : 'RANKED DEFEAT'}
          </h3>
          <div className="flex justify-center items-center gap-6 text-sm font-bold font-mono">
            <span className={lastMatchResult.isWin ? 'text-emerald-400' : 'text-rose-400'}>
              {lastMatchResult.isWin ? '+25 Rating' : '-15 Rating'}
            </span>
            <span className="text-amber-300">
              ✨ +{lastMatchResult.astraAwarded.toLocaleString()} ASTRA
            </span>
          </div>

          <button
            onClick={() => setBattleState('IDLE')}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
          >
            Return to Ranked Lobby
          </button>
        </div>
      )}
    </div>
  );
}

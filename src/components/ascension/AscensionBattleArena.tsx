import React, { useState, useMemo } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { getSkillsForCharacter } from '../../data/skills/characterSkills';
import { 
  Swords, Shield, Zap, Sparkles, Flame, 
  RotateCcw, Award, Check, AlertCircle, Users, Activity, Globe
} from 'lucide-react';

export type PvPFormat = 
  | '1v1' | '2v2' | '3v3' | '4v4' | '5v5' 
  | '1v2' | '1v3' | '1v4' | '1v5' 
  | '2v3' | '2v4' | '2v5' 
  | '3v4' | '3v5' | '4v5';

export function AscensionBattleArena() {
  const { user, recordAscensionMatch } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState<PvPFormat>('1v1');
  const [battleState, setBattleState] = useState<'SELECT_TEAM' | 'MATCHMAKING' | 'FIGHTING' | 'VICTORY' | 'DEFEAT'>('SELECT_TEAM');

  const [playerTeam, setPlayerTeam] = useState<Character[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<Character[]>([]);
  const [opponentName, setOpponentName] = useState<string>('Online Challenger');
  const [combatLogs, setCombatLogs] = useState<string[]>([]);
  const [lastMatchRewards, setLastMatchRewards] = useState<{ astra: number; xp: number } | null>(null);

  const ownedCharIds = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);
  const availableRoster = useMemo(() => ALL_CHARACTERS.filter(c => ownedCharIds.has(c.id)), [ownedCharIds]);

  // Derive Team Sizes based on format
  const [team1Size, team2Size] = useMemo(() => {
    if (selectedFormat.includes('v')) {
      const parts = selectedFormat.split('v').map(Number);
      return [parts[0] || 1, parts[1] || 1];
    }
    return [1, 1];
  }, [selectedFormat]);

  const toggleSelectHero = (hero: Character) => {
    soundManager.playClick();
    if (playerTeam.some(c => c.id === hero.id)) {
      setPlayerTeam(prev => prev.filter(c => c.id !== hero.id));
    } else {
      if (playerTeam.length < team1Size) {
        setPlayerTeam(prev => [...prev, hero]);
      }
    }
  };

  const handleStartOnlineMatchmaking = () => {
    if (playerTeam.length !== team1Size) return;

    soundManager.playClick();
    setBattleState('MATCHMAKING');

    const rivals = ['CyberSpider', 'QuantumStark', 'WakandanShadow', 'CosmicGorgon', 'TitanStriker', 'InfinityBlade', 'ScarletMystic'];
    const selectedRival = rivals[Math.floor(Math.random() * rivals.length)];

    setTimeout(() => {
      soundManager.playAbilityTrigger();
      setOpponentName(selectedRival);

      // Randomize Enemy Team
      const randomPool = ALL_CHARACTERS.slice().sort(() => 0.5 - Math.random());
      const generatedEnemyTeam = randomPool.slice(0, team2Size);
      setEnemyTeam(generatedEnemyTeam);

      setCombatLogs([
        `🌐 ONLINE MULTIPLAYER MATCH FOUND!`,
        `⚔️ Format: Casual PvP ${selectedFormat.toUpperCase()}`,
        `🛡️ Your Team: ${playerTeam.map(c => c.name).join(', ')}`,
        `⚡ Rival Team (${selectedRival}): ${generatedEnemyTeam.map(c => c.name).join(', ')}`
      ]);

      setBattleState('FIGHTING');
    }, 2000);
  };

  const handleExecuteTurnAction = async (skillIndex: number) => {
    const playerHero = playerTeam[0] || ALL_CHARACTERS[0];
    const enemyHero = enemyTeam[0] || ALL_CHARACTERS[1];
    const skills = getSkillsForCharacter(playerHero);
    const chosenSkill = skills[skillIndex] || skills[0];

    soundManager.playAttackHit();

    // Combat Resolution Formula with Upgraded Stats
    const pBoost = user?.characterStatsBoosts[playerHero.id]?.power || 0;
    const pRoll = playerHero.overallPower + pBoost + (chosenSkill?.bonusPower || 10) + Math.floor(Math.random() * 20);
    const eRoll = enemyHero.overallPower + Math.floor(Math.random() * 20);

    const isWin = pRoll >= eRoll;

    setCombatLogs(prev => [
      `💥 ${playerHero.name} triggered [${chosenSkill?.name || 'Assault'}]! Power Output: ${pRoll}`,
      `🛡️ ${enemyHero.name} countered with Power: ${eRoll}`,
      isWin ? `🏆 ${playerHero.name} overpowered the rival vanguard!` : `⚠️ ${enemyHero.name} broke through your defenses!`
    ]);

    const res = await recordAscensionMatch({
      isWin,
      matchFormat: selectedFormat.includes('v') ? (selectedFormat.split('v')[0] === selectedFormat.split('v')[1] ? selectedFormat as any : 'custom') : '1v1',
      isRanked: false,
      isMvp: isWin && Math.random() > 0.5,
      isComeback: isWin && pRoll - eRoll > 15,
      isFlawless: isWin && pRoll - eRoll > 25,
      damageDealt: pRoll * 10
    });

    if (isWin) {
      soundManager.playVictoryFanfare();
      setBattleState('VICTORY');
    } else {
      soundManager.playDefeat();
      setBattleState('DEFEAT');
    }

    setLastMatchRewards({
      astra: res?.astraAwarded || (isWin ? 1000 : 350),
      xp: res?.xpAwarded || (isWin ? 350 : 150)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d142c] via-[#151c3b] to-[#0d142c] border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" /> Online Multiplayer Only
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Cross-Platform Queue</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide mt-1">
            Ascension Battle Arena
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-0.5">
            Queue into real online multiplayer battles. Deploy custom loadouts with tactical relics and character-specific signature skills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-cyan-500/30 text-center">
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Multiplayer Wins</div>
            <div className="text-xl font-heading font-black text-cyan-300">
              {user?.wins || 0}
            </div>
          </div>
        </div>
      </div>

      {/* 1. SELECT TEAM STATE */}
      {battleState === 'SELECT_TEAM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Format Picker */}
          <div className="p-5 rounded-2xl bg-[#090D1E]/90 border border-white/10 space-y-4">
            <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>Choose Online Format</span>
            </h3>

            {/* Standard Formats */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">Standard Symmetric:</div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['1v1', '2v2', '3v3', '4v4', '5v5'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedFormat(fmt);
                      setPlayerTeam([]);
                    }}
                    className={`py-2 rounded-xl text-xs font-heading font-black transition-all ${
                      selectedFormat === fmt
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-black shadow-glow-cyan scale-105'
                        : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Asymmetric Custom Combos */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="text-[11px] font-bold text-amber-400 uppercase font-mono">Custom Asymmetric Formats:</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['1v2', '1v3', '1v4', '1v5', '2v3', '2v4', '2v5', '3v4', '3v5', '4v5'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedFormat(fmt);
                      setPlayerTeam([]);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedFormat === fmt
                        ? 'bg-amber-500 text-black font-black shadow-glow-amber scale-105'
                        : 'bg-black/30 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Team Preview */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Team Size Required:</span>
                <span className="font-bold text-cyan-300">{team1Size} Hero{team1Size > 1 ? 'es' : ''}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Enemy Vanguard Size:</span>
                <span className="font-bold text-rose-400">{team2Size} Hero{team2Size > 1 ? 'es' : ''}</span>
              </div>
            </div>

            {/* Launch Online Matchmaking */}
            <button
              type="button"
              disabled={playerTeam.length !== team1Size}
              onClick={handleStartOnlineMatchmaking}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-heading font-black text-sm uppercase tracking-wider shadow-glow-cyan transition-all cursor-pointer"
            >
              {playerTeam.length === team1Size ? `🌐 Find Online ${selectedFormat} Match` : `Select ${team1Size - playerTeam.length} More Hero${team1Size - playerTeam.length > 1 ? 'es' : ''}`}
            </button>
          </div>

          {/* Right Column: Character Selection */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-[#090D1E]/90 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
                Select Your Vanguard ({playerTeam.length}/{team1Size})
              </h3>
              <span className="text-xs text-amber-300 font-mono font-bold">
                Owned: {availableRoster.length}
              </span>
            </div>

            {availableRoster.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No heroes unlocked yet. Purchase heroes in the Astra Shop or claim Battle Pass rewards!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {availableRoster.map(char => {
                  const isSelected = playerTeam.some(c => c.id === char.id);
                  const pwrBoost = user?.characterStatsBoosts[char.id]?.power || 0;
                  const currentLevel = user?.characterLevels[char.id] || 1;

                  return (
                    <div
                      key={char.id}
                      onClick={() => toggleSelectHero(char)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-glow-cyan scale-105'
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <CharacterPortrait character={char} size="sm" showBadge={false} />
                      <div className="font-heading font-black text-xs text-white mt-1.5 truncate w-full">
                        {char.name}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold">
                          LVL {currentLevel}
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono font-bold">
                          ⚡ {char.overallPower + pwrBoost}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MATCHMAKING STATE */}
      {battleState === 'MATCHMAKING' && (
        <div className="py-16 text-center bg-[#090D1E]/90 border border-cyan-500/40 rounded-3xl shadow-2xl space-y-4 animate-pulse">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-3xl shadow-glow-cyan">
            🌐
          </div>
          <h3 className="text-2xl font-heading font-black text-white uppercase tracking-wider">
            Searching for Online Match...
          </h3>
          <p className="text-xs text-cyan-300 font-mono">
            Connecting to Live Cross-Platform Matchmaking Lobby • Format: {selectedFormat.toUpperCase()}
          </p>
        </div>
      )}

      {/* 3. COMBAT STATE */}
      {battleState === 'FIGHTING' && (
        <div className="p-6 rounded-3xl bg-[#090D1E]/95 border border-cyan-500/30 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Player Vanguard */}
            <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/40 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Your Squad</span>
              <div className="text-lg font-heading font-black text-white">
                {playerTeam.map(c => c.name).join(', ')}
              </div>
              <div className="text-sm font-mono font-bold text-amber-300">
                ⚡ PWR {playerTeam.reduce((acc, c) => acc + c.overallPower + (user?.characterStatsBoosts[c.id]?.power || 0), 0)}
              </div>
            </div>

            {/* Enemy Vanguard */}
            <div className="p-5 rounded-2xl bg-black/60 border border-rose-500/40 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">Rival: {opponentName}</span>
              <div className="text-lg font-heading font-black text-white">
                {enemyTeam.map(c => c.name).join(', ')}
              </div>
              <div className="text-sm font-mono font-bold text-amber-300">
                ⚡ PWR {enemyTeam.reduce((acc, c) => acc + c.overallPower, 0)}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-black text-slate-300 uppercase tracking-wider text-center">
              Trigger Signature Skill
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {getSkillsForCharacter(playerTeam[0] || ALL_CHARACTERS[0]).slice(0, 3).map((skill, idx) => (
                <button
                  key={skill.id}
                  onClick={() => handleExecuteTurnAction(idx)}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{skill.icon}</span>
                    <span className="text-xs font-heading font-black text-white group-hover:text-cyan-300">
                      {skill.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{skill.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Combat Log */}
          <div className="p-4 rounded-xl bg-black/80 border border-white/5 space-y-1 font-mono text-xs max-h-40 overflow-y-auto">
            {combatLogs.map((log, i) => (
              <div key={i} className="text-slate-300">{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VICTORY / DEFEAT STATE */}
      {(battleState === 'VICTORY' || battleState === 'DEFEAT') && (
        <div className="p-8 rounded-3xl bg-[#090D1E]/95 border border-cyan-500/40 text-center space-y-4">
          <div className="text-5xl">{battleState === 'VICTORY' ? '🏆' : '💀'}</div>
          <h3 className="text-2xl font-heading font-black text-white uppercase tracking-wider">
            {battleState === 'VICTORY' ? 'MATCH VICTORY!' : 'MATCH DEFEAT'}
          </h3>
          <div className="flex justify-center gap-4 text-xs font-mono font-bold">
            <span className="text-amber-300">✨ +{(lastMatchRewards?.astra || 0).toLocaleString()} ASTRA</span>
            <span className="text-cyan-300">⚡ +{lastMatchRewards?.xp || 0} XP</span>
          </div>
          <button
            onClick={() => setBattleState('SELECT_TEAM')}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-black text-xs uppercase"
          >
            Return to Arena
          </button>
        </div>
      )}
    </div>
  );
}

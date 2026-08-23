import { useState } from 'react';
import { Character, BattleRound, Player } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { CharacterCard } from '../common/CharacterCard';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { simulateRoundDuel } from '../../../server/battleEngine';
import { voiceManager } from '../../audio/voiceManager';
import { soundManager } from '../../audio/soundManager';
import { Swords, RotateCcw, Zap, Search, Trophy, Sparkles, Volume2, Shield } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function BattleSandbox({ onBack }: Props) {
  const [fighter1, setFighter1] = useState<Character>(ALL_CHARACTERS.find(c => c.name === 'Spider-Man') || ALL_CHARACTERS[0]);
  const [fighter2, setFighter2] = useState<Character>(ALL_CHARACTERS.find(c => c.name.includes('Blade')) || ALL_CHARACTERS[1]);
  const [matchFormat, setMatchFormat] = useState<1 | 3 | 5>(3);
  
  const [isSelecting1, setIsSelecting1] = useState(false);
  const [isSelecting2, setIsSelecting2] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  const [duelRounds, setDuelRounds] = useState<BattleRound[]>([]);
  const [f1Score, setF1Score] = useState(0);
  const [f2Score, setF2Score] = useState(0);
  const [isFighting, setIsFighting] = useState(false);
  const [duelComplete, setDuelComplete] = useState(false);

  const filteredList = ALL_CHARACTERS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.powers.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = gradeFilter === 'ALL' || c.grade === gradeFilter;
    return matchSearch && matchGrade;
  }).sort((a, b) => b.overallPower - a.overallPower);

  const startDuelSimulation = async () => {
    soundManager.playClick();
    setIsFighting(true);
    setDuelRounds([]);
    setF1Score(0);
    setF2Score(0);
    setDuelComplete(false);

    // Play initial battle voice quote for Fighter 1
    voiceManager.playCharacterVoiceline(fighter1);

    const dummyP1: Player = {
      id: 'fighter-1',
      name: fighter1.name,
      avatar: '🔴',
      money: 100,
      collection: [fighter1],
      isHost: true,
      isReady: true,
      isBot: false,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    const dummyP2: Player = {
      id: 'fighter-2',
      name: fighter2.name,
      avatar: '🔵',
      money: 100,
      collection: [fighter2],
      isHost: false,
      isReady: true,
      isBot: false,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 },
    };

    let score1 = 0;
    let score2 = 0;
    const targetWins = Math.ceil(matchFormat / 2);
    const rounds: BattleRound[] = [];

    for (let r = 1; r <= matchFormat; r++) {
      if (score1 >= targetWins || score2 >= targetWins) break;

      await new Promise(resolve => setTimeout(resolve, 900));

      const roundResult = simulateRoundDuel(dummyP1, fighter1, dummyP2, fighter2, r);
      rounds.push(roundResult);
      setDuelRounds([...rounds]);

      if (roundResult.winnerPlayerId === dummyP1.id) {
        score1++;
        setF1Score(score1);
        soundManager.playAttackHit();
      } else {
        score2++;
        setF2Score(score2);
        soundManager.playAttackHit();
      }
    }

    setIsFighting(false);
    setDuelComplete(true);

    // Play victory sound & winner voiceline
    soundManager.playVictory();
    const winnerChar = score1 > score2 ? fighter1 : fighter2;
    setTimeout(() => {
      voiceManager.playCharacterVoiceline(winnerChar);
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-black uppercase mb-1">
            <Swords className="w-3.5 h-3.5 text-marvel-red" />
            <span>HERO DUEL SIMULATOR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-wide">
            BATTLE SANDBOX
          </h1>
          <p className="text-xs text-slate-400">
            Pick any 2 characters from the 300 database and test their stats, rolls, and ability procs in instant combat!
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors"
        >
          ← Back to Game
        </button>
      </div>

      {/* Duel Setup Stage */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Fighter 1 Card (5 cols) */}
        <div className="md:col-span-5 glass-panel p-5 rounded-2xl border border-red-500/50 space-y-3 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full border-b border-white/10 pb-2">
            <span className="text-xs font-black uppercase text-red-400 tracking-wider">FIGHTER 1 (RED CORNER)</span>
            <button
              onClick={() => {
                soundManager.playClick();
                voiceManager.playCharacterVoiceline(fighter1);
              }}
              title="Play Voice Quote"
              className="p-1.5 bg-red-950 hover:bg-red-900 text-red-200 rounded-lg border border-red-500/40"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <CharacterPortrait character={fighter1} size="lg" showBadge={true} />

          <h3 className="text-xl font-heading font-black text-white">{fighter1.name}</h3>
          <span className="text-xs text-slate-400 italic truncate max-w-[250px]">{fighter1.powers}</span>

          <div className="flex items-center gap-3 pt-2 text-xs font-bold text-slate-300">
            <span>PWR: <strong className="text-amber-400 font-black">{fighter1.overallPower}</strong></span>
            <span>•</span>
            <span>TIER: <strong className="text-red-400 font-black">{fighter1.grade}</strong></span>
            <span>•</span>
            <span>${fighter1.startingPrice}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsSelecting1(true);
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors mt-2"
          >
            Change Fighter 1
          </button>
        </div>

        {/* Center Clash Settings & Start Button (1 col) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center gap-3 py-2">
          <div className="p-3 bg-red-950/80 rounded-full border border-red-500 shadow-glow-red">
            <Swords className="w-6 h-6 text-marvel-red animate-pulse" />
          </div>

          {/* Format Selector */}
          <select
            value={matchFormat}
            onChange={e => setMatchFormat(Number(e.target.value) as 1 | 3 | 5)}
            className="bg-black/60 border border-white/10 text-[10px] text-white font-bold px-2 py-1 rounded-lg focus:outline-none focus:border-red-500"
          >
            <option value={1}>1 Round Duel</option>
            <option value={3}>Best-of-3</option>
            <option value={5}>Best-of-5</option>
          </select>

          {/* Start Battle Button */}
          <button
            onClick={startDuelSimulation}
            disabled={isFighting}
            className="w-full py-3 px-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-glow-red transition-all"
          >
            {isFighting ? 'CLASHING...' : 'FIGHT!'}
          </button>
        </div>

        {/* Fighter 2 Card (5 cols) */}
        <div className="md:col-span-5 glass-panel p-5 rounded-2xl border border-blue-500/50 space-y-3 flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full border-b border-white/10 pb-2">
            <span className="text-xs font-black uppercase text-blue-400 tracking-wider">FIGHTER 2 (BLUE CORNER)</span>
            <button
              onClick={() => {
                soundManager.playClick();
                voiceManager.playCharacterVoiceline(fighter2);
              }}
              title="Play Voice Quote"
              className="p-1.5 bg-blue-950 hover:bg-blue-900 text-blue-200 rounded-lg border border-blue-500/40"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <CharacterPortrait character={fighter2} size="lg" showBadge={true} />

          <h3 className="text-xl font-heading font-black text-white">{fighter2.name}</h3>
          <span className="text-xs text-slate-400 italic truncate max-w-[250px]">{fighter2.powers}</span>

          <div className="flex items-center gap-3 pt-2 text-xs font-bold text-slate-300">
            <span>PWR: <strong className="text-amber-400 font-black">{fighter2.overallPower}</strong></span>
            <span>•</span>
            <span>TIER: <strong className="text-blue-400 font-black">{fighter2.grade}</strong></span>
            <span>•</span>
            <span>${fighter2.startingPrice}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsSelecting2(true);
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors mt-2"
          >
            Change Fighter 2
          </button>
        </div>
      </div>

      {/* Live Duel Clashes & Results */}
      {duelRounds.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5 animate-shake">
          {/* Score Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-heading font-black text-xl text-red-400">{fighter1.name}</span>
              <span className="font-heading font-black text-3xl text-white bg-black/60 px-4 py-1 rounded-xl border border-white/10">
                {f1Score} : {f2Score}
              </span>
              <span className="font-heading font-black text-xl text-blue-400">{fighter2.name}</span>
            </div>

            {duelComplete && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-black uppercase rounded-full shadow-glow-gold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>WINNER: {f1Score > f2Score ? fighter1.name : fighter2.name}</span>
              </div>
            )}
          </div>

          {/* Rounds Feed */}
          <div className="space-y-4">
            {duelRounds.map((round, idx) => (
              <div key={idx} className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-red-400">Round {round.roundNumber} Result:</span>
                  <span className="text-amber-400">
                    {fighter1.name} ({round.player1TotalPower}) vs {fighter2.name} ({round.player2TotalPower})
                  </span>
                </div>

                {round.player1AbilityTriggered && (
                  <div className="text-[11px] text-amber-300 font-bold bg-amber-950/40 p-1.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{fighter1.name} triggered [{round.player1AbilityTriggered.name}] (+{round.player1AbilityTriggered.bonusPower} Power)</span>
                  </div>
                )}

                {round.player2AbilityTriggered && (
                  <div className="text-[11px] text-blue-300 font-bold bg-blue-950/40 p-1.5 rounded border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>{fighter2.name} triggered [{round.player2AbilityTriggered.name}] (+{round.player2AbilityTriggered.bonusPower} Power)</span>
                  </div>
                )}

                <div className="pt-1 space-y-0.5">
                  {round.log.map((entry, logIdx) => (
                    <p key={logIdx} className="text-[11px] text-slate-400 font-mono">
                      {entry}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Character Selector Modal */}
      {(isSelecting1 || isSelecting2) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[85vh] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-black text-white uppercase">
                Select {isSelecting1 ? 'Fighter 1 (Red)' : 'Fighter 2 (Blue)'}
              </h2>
              <button
                onClick={() => {
                  setIsSelecting1(false);
                  setIsSelecting2(false);
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Search & Grade Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search 300 heroes (e.g. Miles, Thanos, Hulk)..."
                  className="w-full bg-black/50 border border-white/10 pl-9 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <select
                value={gradeFilter}
                onChange={e => setGradeFilter(e.target.value)}
                className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white font-bold"
              >
                <option value="ALL">All Grades</option>
                <option value="MYTHIC">★ Mythic</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>

            {/* Grid of Characters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 overflow-y-auto flex-1 p-1">
              {filteredList.map(char => (
                <div
                  key={char.id}
                  onClick={() => {
                    soundManager.playClick();
                    if (isSelecting1) setFighter1(char);
                    if (isSelecting2) setFighter2(char);
                    setIsSelecting1(false);
                    setIsSelecting2(false);
                    voiceManager.playCharacterVoiceline(char);
                  }}
                  className="bg-black/40 hover:bg-slate-800 p-2 rounded-xl border border-white/10 hover:border-red-500/80 cursor-pointer flex flex-col items-center text-center transition-all group"
                >
                  <CharacterPortrait character={char} size="sm" showBadge={true} />
                  <span className="font-extrabold text-xs text-white mt-1.5 truncate w-full group-hover:text-red-400">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    PWR {char.overallPower}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

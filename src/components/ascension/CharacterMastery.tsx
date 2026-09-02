import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Star, Zap, Shield, Swords, ChevronRight, Search } from 'lucide-react';

// XP required per mastery level
function getMasteryXpThreshold(level: number): number {
  return level * 500;
}

const MASTERY_LEVEL_REWARDS: Record<number, { type: string; amount: number; label: string }> = {
  1:  { type: 'astra',      amount: 200,  label: '200 ASTRA' },
  2:  { type: 'cardShards', amount: 15,   label: '15 Shards' },
  3:  { type: 'astra',      amount: 500,  label: '500 ASTRA' },
  5:  { type: 'astra',      amount: 1500, label: '1,500 ASTRA' },
  7:  { type: 'cardShards', amount: 50,   label: '50 Shards' },
  10: { type: 'astra',      amount: 5000, label: '5,000 ASTRA' },
};

const GRADE_GRADIENT: Record<string, string> = {
  C:     'from-slate-500 to-slate-600',
  B:     'from-blue-500 to-blue-700',
  A:     'from-purple-500 to-indigo-700',
  MYTHIC:'from-amber-400 to-yellow-600',
};

const ALIGNMENT_COLORS: Record<string, string> = {
  Hero:    'text-blue-400',
  Villain: 'text-red-400',
  Cosmic:  'text-purple-400',
  Neutral: 'text-slate-400',
};

interface MasteryBarProps {
  characterId: string;
  mastery: { xp: number; level: number };
  onAward?: () => void;
}

function MasteryBar({ characterId, mastery, onAward }: MasteryBarProps) {
  const { awardMasteryXp } = useAuth();
  const [awarding, setAwarding] = useState(false);

  const level = mastery.level;
  const xp = mastery.xp;
  const threshold = getMasteryXpThreshold(level);
  const nextThreshold = getMasteryXpThreshold(level + 1);
  const xpInLevel = xp - threshold;
  const xpNeeded = nextThreshold - threshold;
  const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const reward = MASTERY_LEVEL_REWARDS[level];
  const nextReward = MASTERY_LEVEL_REWARDS[level + 1];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">Mastery Level <span className="font-black text-white">{level}</span></span>
        <span className="text-slate-400">{xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
      </div>
      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {nextReward && (
        <div className="text-[10px] text-slate-500">
          Next reward at Lv.{level + 1}: {nextReward.label}
        </div>
      )}
    </div>
  );
}

export function CharacterMastery() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<'All' | 'C' | 'B' | 'A' | 'MYTHIC'>('All');
  const [sortBy, setSortBy] = useState<'level' | 'xp' | 'name'>('level');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const characterMastery = user?.characterMastery || {};
  const ownedIds = user?.ownedCharacters || [];

  // Only show owned characters
  const ownedCharacters = ALL_CHARACTERS.filter(c => ownedIds.includes(c.id));

  const filtered = ownedCharacters
    .filter(c => {
      const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGrade = filterGrade === 'All' || c.grade === filterGrade;
      return matchSearch && matchGrade;
    })
    .sort((a, b) => {
      const mA = characterMastery[a.id] || { xp: 0, level: 0 };
      const mB = characterMastery[b.id] || { xp: 0, level: 0 };
      if (sortBy === 'level') return mB.level - mA.level;
      if (sortBy === 'xp')    return mB.xp - mA.xp;
      return a.name.localeCompare(b.name);
    });

  // Stats
  const totalMasteryXp = Object.values(characterMastery).reduce((s, m) => s + (m?.xp || 0), 0);
  const highestLevel = Math.max(0, ...Object.values(characterMastery).map(m => m?.level || 0));
  const masteredCount = Object.values(characterMastery).filter(m => (m?.level || 0) >= 10).length;

  // Selected character detail
  const selectedCharObj = selectedChar ? ALL_CHARACTERS.find(c => c.id === selectedChar) : null;
  const selectedMastery = selectedChar ? characterMastery[selectedChar] || { xp: 0, level: 0 } : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Stats */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-[#1A0D0D] to-[#1A0D2E] border border-amber-500/20 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-400" /> Character Mastery
          </h1>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Mastery XP', value: totalMasteryXp.toLocaleString(), color: 'text-amber-400' },
              { label: 'Highest Level', value: highestLevel, color: 'text-orange-400' },
              { label: 'Mastered (Lv.10)', value: masteredCount, color: 'text-purple-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How mastery works */}
      <div className="px-4 py-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 space-y-1">
        <div className="font-bold text-amber-300">🎖️ How Mastery Works</div>
        <p>Earn Mastery XP by using a character in battles. Each level unlocks rewards (Astra, Card Shards). Reaching Level 10 marks a character as "Mastered".</p>
      </div>

      {/* Mastery Rewards Table */}
      <div className="rounded-2xl p-4 bg-[#0B0D1E] border border-white/5 space-y-2">
        <div className="text-sm font-heading font-black text-white uppercase tracking-wider mb-3">Level-Up Rewards</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.entries(MASTERY_LEVEL_REWARDS).map(([level, reward]) => (
            <div key={level} className={`p-2 rounded-xl text-center border ${
              reward.type === 'astra' ? 'border-cyan-500/20 bg-cyan-950/20' : 'border-indigo-500/20 bg-indigo-950/20'
            }`}>
              <div className="text-xs font-black text-white">Lv. {level}</div>
              <div className={`text-[10px] font-bold mt-1 ${reward.type === 'astra' ? 'text-cyan-400' : 'text-indigo-400'}`}>
                {reward.type === 'astra' ? '✨' : '🔷'} {reward.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search characters..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
          />
        </div>
        {(['All', 'MYTHIC', 'A', 'B', 'C'] as const).map(g => (
          <button key={g}
            onClick={() => setFilterGrade(g)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              filterGrade === g ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >{g}</button>
        ))}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs cursor-pointer"
        >
          <option value="level">Sort: Level</option>
          <option value="xp">Sort: XP</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Character Mastery Grid */}
      {ownedCharacters.length === 0 ? (
        <div className="text-center py-16 text-slate-500 space-y-2">
          <Star className="w-12 h-12 mx-auto opacity-20" />
          <p className="font-semibold">No characters owned</p>
          <p className="text-sm">Purchase characters from the Astra Shop to start leveling mastery</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(char => {
            const mastery = characterMastery[char.id] || { xp: 0, level: 0 };
            const isMastered = mastery.level >= 10;
            const isSelected = selectedChar === char.id;
            const gradColor = GRADE_GRADIENT[char.grade] || GRADE_GRADIENT.C;

            return (
              <div
                key={char.id}
                onClick={() => setSelectedChar(isSelected ? null : char.id)}
                className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500/50 bg-amber-950/10 scale-[1.01]'
                    : isMastered
                    ? 'border-purple-500/30 bg-purple-950/10'
                    : 'border-white/10 bg-[#0B0D1E] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Character artwork with a compact grade badge */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-black/40 flex-shrink-0">
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute bottom-0 left-0 right-0 bg-gradient-to-br ${gradColor} text-white text-[8px] leading-3 text-center font-black`}>
                      {char.grade}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-white text-sm truncate">{char.name}</span>
                      {isMastered && <span className="text-amber-400 text-xs">👑 Mastered</span>}
                    </div>
                    <div className={`text-xs ${ALIGNMENT_COLORS[char.alignment] || 'text-slate-400'}`}>
                      {char.alignment} • {(char.factions as string[] | undefined)?.[0] || 'Independent'}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-black text-amber-400">Lv.{mastery.level}</div>
                    <div className="text-[10px] text-slate-500">{mastery.xp.toLocaleString()} XP</div>
                  </div>
                </div>

                <MasteryBar characterId={char.id} mastery={mastery} />

                {/* Expanded stats */}
                {isSelected && (
                  <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-white/5 animate-fadeIn">
                    {[
                      { icon: <Swords className="w-3 h-3 text-red-400" />, label: 'Power',   value: char.overallPower },
                      { icon: <Shield className="w-3 h-3 text-green-400" />, label: 'Defense', value: char.stats?.durability },
                      { icon: <Zap className="w-3 h-3 text-yellow-400" />,   label: 'Speed',   value: char.stats?.speed },
                    ].map(s => (
                      <div key={s.label} className="text-center px-2 py-1.5 rounded-lg bg-white/5">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                          {s.icon} {s.label}
                        </div>
                        <div className="font-black text-white text-sm">{s.value ?? 'N/A'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

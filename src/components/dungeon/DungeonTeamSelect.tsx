import React, { useState, useMemo } from 'react';
import { Character } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { useAuth } from '../../context/AuthContext';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { calculateDungeonHeroBaseStats } from '../../engine/dungeonRogueliteEngine';
import { soundManager } from '../../audio/soundManager';
import { 
  Users, Swords, Shield, Zap, Sparkles, Heart, Check, 
  ArrowRight, ShieldAlert, Star, Flame, Trophy, Info, X
} from 'lucide-react';

interface Props {
  onConfirmTeam: (selectedCharacters: Character[], teamSize: number) => void;
  onOpenPrepShop: () => void;
  onBack: () => void;
}

export function DungeonTeamSelect({ onConfirmTeam, onOpenPrepShop, onBack }: Props) {
  const { user } = useAuth();
  const [teamSize, setTeamSize] = useState<number>(3);
  const [selectedHeroIds, setSelectedHeroIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<'ALL' | 'MYTHIC' | 'A' | 'B' | 'C'>('ALL');

  // Owned roster from real Ascension account
  const ownedSet = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);
  const ownedRoster = useMemo(() => {
    let list = ALL_CHARACTERS.filter(c => ownedSet.has(c.id));
    // If new player has no characters loaded yet, fallback to starter pool
    if (list.length === 0) list = ALL_CHARACTERS.slice(0, 10);
    return list;
  }, [ownedSet]);

  const filteredRoster = useMemo(() => {
    return ownedRoster.filter(c => {
      const matchSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchGrade = filterGrade === 'ALL' || c.grade === filterGrade;
      return matchSearch && matchGrade;
    });
  }, [ownedRoster, searchQuery, filterGrade]);

  // Pre-populate squad if empty so player can enter immediately
  React.useEffect(() => {
    if (selectedHeroIds.length === 0 && ownedRoster.length > 0) {
      setSelectedHeroIds(ownedRoster.slice(0, teamSize).map(c => c.id));
    }
  }, [ownedRoster, teamSize]);

  const handleToggleSelectHero = (hero: Character) => {
    soundManager.playClick();
    if (selectedHeroIds.includes(hero.id)) {
      setSelectedHeroIds(prev => prev.filter(id => id !== hero.id));
    } else {
      if (selectedHeroIds.length < teamSize) {
        setSelectedHeroIds(prev => [...prev, hero.id]);
      }
    }
  };

  const handleSetTeamSize = (size: number) => {
    soundManager.playClick();
    setTeamSize(size);
    if (selectedHeroIds.length > size) {
      setSelectedHeroIds(prev => prev.slice(0, size));
    }
  };

  const selectedCharacters = useMemo(() => {
    return selectedHeroIds.map(id => ALL_CHARACTERS.find(c => c.id === id)).filter(Boolean) as Character[];
  }, [selectedHeroIds]);

  const teamBonusDescription = useMemo(() => {
    if (teamSize <= 2) {
      return {
        title: '🔥 Concentrated Solo / Duo Power',
        desc: '+25% Damage, +15% Critical Chance, and massive focused energy surge per turn.',
        color: 'text-amber-400 bg-amber-950/70 border-amber-500/50',
      };
    } else if (teamSize <= 4) {
      return {
        title: '⚔️ Balanced Tactical Strike Force',
        desc: '+10% Damage, +10% Defense, balanced team substitution depth and synergy.',
        color: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/50',
      };
    } else {
      return {
        title: '🛡️ Full Vanguard Expedition Division',
        desc: 'Maximum survivability pool, 5–7 hero roster rotation depth, and extensive tactical counter coverage.',
        color: 'text-purple-400 bg-purple-950/70 border-purple-500/50',
      };
    }
  }, [teamSize]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn select-none pb-12">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1C0F05] via-[#2A1408] to-[#120703] border-2 border-orange-500/60 shadow-[0_0_40px_rgba(249,115,22,0.3)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-glow-red">
              <Swords className="w-3.5 h-3.5" /> Endless Wave Survival Mode
            </span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best Record: Wave {user?.dungeonPeak || user?.dungeonMaxWave || 0}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-wider mt-1.5">
            Dungeon Infinite Survival
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Battle through endless, progressively ferocious randomized waves! Earn milestone supply drops every 5 waves, draft game-changing relics, and push your personal highest wave record to the limit!
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenPrepShop}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-glow-gold transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Preparation Armory</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* 2. Team Size Selector (1 to 7) */}
      <div className="p-5 rounded-3xl bg-black/80 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-heading font-black text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-400" />
              <span>Choose Expedition Team Size (1–7 Heroes)</span>
            </span>
            <p className="text-[11px] text-slate-400">Smaller teams receive concentrated attack focus; larger teams offer more survivability and substitution depth.</p>
          </div>

          {/* Size Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-white/10">
            {[1, 2, 3, 4, 5, 6, 7].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSetTeamSize(size)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-heading font-black text-sm transition-all flex items-center justify-center cursor-pointer ${
                  teamSize === size
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-glow-red scale-105 border border-orange-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Team Size Buff Indicator */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${teamBonusDescription.color}`}>
          <div className="space-y-0.5">
            <span className="font-heading font-black uppercase tracking-wider block">{teamBonusDescription.title}</span>
            <span className="text-[11px] opacity-90">{teamBonusDescription.desc}</span>
          </div>
          <span className="text-xs font-mono font-bold shrink-0">
            {selectedHeroIds.length} / {teamSize} Selected
          </span>
        </div>
      </div>

      {/* 3. Selected Team Slots Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono uppercase">
          <span>Active Team Loadout ({selectedHeroIds.length}/{teamSize})</span>
          <span>Click hero slot to remove</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: teamSize }).map((_, idx) => {
            const hero = selectedCharacters[idx];
            if (hero) {
              const charLvl = user?.characterLevels?.[hero.id] || 1;
              const stats = calculateDungeonHeroBaseStats(hero, charLvl, user?.characterStatsBoosts?.[hero.id]);

              return (
                <div
                  key={hero.id}
                  onClick={() => handleToggleSelectHero(hero)}
                  className="p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-black border-2 border-orange-500/70 hover:border-red-500 shadow-md relative group cursor-pointer transition-all transform hover:scale-[1.02]"
                >
                  <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-red-600/80 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2">
                    <CharacterPortrait character={hero} size="md" showBadge={false} />
                    <div className="w-full">
                      <h4 className="text-xs font-heading font-black text-white truncate">{hero.name}</h4>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                          LVL {charLvl}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-mono">
                          {stats.role}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1">
                        HP: {stats.maxHp} • PWR: {stats.basePower}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`empty-${idx}`}
                className="h-44 rounded-2xl border-2 border-dashed border-white/15 bg-black/40 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                  +
                </div>
                <span className="text-[11px] font-heading font-black uppercase tracking-wider">Slot {idx + 1}</span>
                <span className="text-[9px] text-slate-500">Pick from roster below</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Owned Ascension Characters Selector */}
      <div className="p-5 rounded-3xl bg-black/80 border border-white/10 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-sm font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Owned Ascension Roster ({ownedRoster.length} Heroes)</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search hero..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 w-full sm:w-44"
            />
            <div className="flex items-center gap-1">
              {(['ALL', 'MYTHIC', 'A', 'B', 'C'] as const).map(grd => (
                <button
                  key={grd}
                  type="button"
                  onClick={() => setFilterGrade(grd)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-heading font-black uppercase tracking-wider cursor-pointer ${
                    filterGrade === grd
                      ? 'bg-orange-500 text-black font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {grd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto pr-1">
          {filteredRoster.map(char => {
            const isSelected = selectedHeroIds.includes(char.id);
            const charLvl = user?.characterLevels?.[char.id] || 1;
            const stats = calculateDungeonHeroBaseStats(char, charLvl, user?.characterStatsBoosts?.[char.id]);

            return (
              <button
                key={char.id}
                type="button"
                onClick={() => handleToggleSelectHero(char)}
                className={`p-2.5 rounded-2xl border text-left transition-all relative group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-950/80 to-red-950/90 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-105'
                    : 'bg-slate-900/80 border-white/10 hover:border-orange-500/40 hover:bg-slate-800/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-orange-500 text-black flex items-center justify-center text-[10px] font-black shadow">
                    ✓
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-1.5">
                  <CharacterPortrait character={char} size="sm" showBadge={false} />
                  <div className="w-full">
                    <h5 className="text-[11px] font-heading font-black text-white truncate">{char.name}</h5>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className="text-[9px] font-mono text-amber-400 font-bold">Lvl {charLvl}</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase">[{stats.role}]</span>
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 mt-0.5">
                      HP {stats.maxHp}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom Action: Start Expedition Button */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-black via-slate-950 to-black border-2 border-orange-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-mono">Ready to descend into the Ancient Ruins?</span>
          <h4 className="text-base font-heading font-black text-white uppercase">
            {selectedCharacters.length === teamSize
              ? `Squad Ready (${teamSize} Heroes Locked In)`
              : selectedCharacters.length > 0
              ? `${selectedCharacters.length} / ${teamSize} Heroes Selected`
              : `Select 1 to ${teamSize} Heroes`}
          </h4>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedCharacters.length < teamSize && filteredRoster.length > 0 && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                const needed = teamSize - selectedHeroIds.length;
                const unselected = filteredRoster.filter(c => !selectedHeroIds.includes(c.id));
                const toAdd = unselected.slice(0, needed).map(c => c.id);
                setSelectedHeroIds(prev => [...prev, ...toAdd]);
              }}
              className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-amber-400 border border-amber-500/30 text-xs font-heading font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              ⚡ Auto-Fill Squad
            </button>
          )}

          <button
            type="button"
            disabled={selectedCharacters.length === 0}
            onClick={() => {
              const finalTeam = selectedCharacters.length === teamSize 
                ? selectedCharacters 
                : selectedCharacters.slice(0, Math.min(selectedCharacters.length, teamSize));
              onConfirmTeam(finalTeam, finalTeam.length);
            }}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-heading font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all transform ${
              selectedCharacters.length > 0
                ? 'bg-gradient-to-r from-orange-500 via-red-600 to-amber-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:scale-105 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
            }`}
          >
            <span>ENTER DUNGEON EXPEDITION</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

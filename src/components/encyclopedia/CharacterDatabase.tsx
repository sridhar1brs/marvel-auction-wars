import { useState, useMemo } from 'react';
import { Character } from '../../types/game';
import { ALL_CHARACTERS, CHARACTERS_BY_GRADE } from '../../data/characters/index';
import { CharacterCard } from '../common/CharacterCard';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { Search, X, Zap } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface Props {
  onBack?: () => void;
}

export function CharacterDatabase({ onBack }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedAlignment, setSelectedAlignment] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'power' | 'grade' | 'name'>('power');
  const [inspectCharacter, setInspectCharacter] = useState<Character | null>(null);

  const gradeWeights: Record<string, number> = { MYTHIC: 4, A: 3, B: 2, C: 1 };

  const filteredCharacters = useMemo(() => {
    return ALL_CHARACTERS.filter(char => {
      const matchSearch =
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (char.alias && char.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
        char.powers.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGrade = selectedGrade === 'ALL' || char.grade === selectedGrade;
      const matchAlignment = selectedAlignment === 'ALL' || char.alignment === selectedAlignment;

      return matchSearch && matchGrade && matchAlignment;
    }).sort((a, b) => {
      if (sortBy === 'power') return b.overallPower - a.overallPower;
      if (sortBy === 'grade') return (gradeWeights[b.grade] || 0) - (gradeWeights[a.grade] || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, selectedGrade, selectedAlignment, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-marvel-red block">
            OFFICIAL ENCYCLOPEDIA
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-wide">
            MARVEL CHARACTER DATABASE ({ALL_CHARACTERS.length})
          </h1>
        </div>

        {onBack && (
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors"
          >
            ← Back to Game
          </button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box (6 cols) */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 300 Marvel characters (e.g. Miles Morales, Blade, Spider-Man, Knull)..."
              className="w-full bg-black/50 border border-white/10 pl-10 pr-4 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Grade Filter (2 cols) */}
          <div className="sm:col-span-2">
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
            >
              <option value="ALL">All Grades ({ALL_CHARACTERS.length})</option>
              <option value="MYTHIC">★ Mythic Cosmic ({CHARACTERS_BY_GRADE.MYTHIC.length})</option>
              <option value="A">Grade A ({CHARACTERS_BY_GRADE.A.length})</option>
              <option value="B">Grade B ({CHARACTERS_BY_GRADE.B.length})</option>
              <option value="C">Grade C ({CHARACTERS_BY_GRADE.C.length})</option>
            </select>
          </div>

          {/* Alignment Filter (2 cols) */}
          <div className="sm:col-span-2">
            <select
              value={selectedAlignment}
              onChange={e => setSelectedAlignment(e.target.value)}
              className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
            >
              <option value="ALL">All Alignments</option>
              <option value="Hero">Heroes</option>
              <option value="Villain">Villains</option>
              <option value="Anti-Hero">Anti-Heroes</option>
              <option value="Cosmic">Cosmic Forces</option>
            </select>
          </div>

          {/* Sort By (2 cols) */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'power' | 'grade' | 'name')}
              className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-bold"
            >
              <option value="power">Sort by Power ↓</option>
              <option value="grade">Sort by Tier (Mythic → C)</option>
              <option value="name">Sort by Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Count Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-1 border-t border-white/5">
          <span>Showing {filteredCharacters.length} of {ALL_CHARACTERS.length} characters</span>
          <span className="text-slate-500">Click any card to inspect full stats</span>
        </div>
      </div>

      {/* Grid of Characters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredCharacters.map(char => (
          <div
            key={char.id}
            onClick={() => {
              soundManager.playClick();
              setInspectCharacter(char);
            }}
            className="glass-panel p-3 rounded-xl border border-white/10 hover:border-red-500/80 cursor-pointer transition-all hover:scale-[1.03] group relative overflow-hidden flex flex-col items-center text-center"
          >
            <CharacterPortrait character={char} size="md" showBadge={true} />

            <h3 className="font-heading font-black text-xs sm:text-sm text-white mt-2 truncate w-full group-hover:text-red-400 transition-colors">
              {char.name}
            </h3>

            <span className="text-[10px] text-slate-400 italic truncate w-full mb-1">
              {char.alias || char.alignment}
            </span>

            <div className="mt-auto w-full flex items-center justify-center pt-2 border-t border-white/5 text-[11px] font-extrabold">
              <span className="text-amber-400 flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Zap className="w-2.5 h-2.5 fill-current" />
                PWR {char.overallPower}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Card Inspector */}
      {inspectCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setInspectCharacter(null)}
              className="absolute -top-3 -right-3 z-20 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-white/20 shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <CharacterCard character={inspectCharacter} size="lg" isSpotlight={true} showPrice={false} />
          </div>
        </div>
      )}
    </div>
  );
}

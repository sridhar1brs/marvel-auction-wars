import React, { useState } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character } from '../../types/game';
import { getSkillsForCharacter, CharacterSkill } from '../../data/skills/characterSkills';
import { CharacterPortrait } from './CharacterPortrait';
import { soundManager } from '../../audio/soundManager';
import { 
  Zap, Search, Shield, Swords, Sparkles, Flame, Heart, 
  Target, X, ChevronRight, Award
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillMasteryModal({ isOpen, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedEffectFilter, setSelectedEffectFilter] = useState<string>('ALL');
  const [activeHero, setActiveHero] = useState<Character>(ALL_CHARACTERS[0]);

  if (!isOpen) return null;

  const effectTypes = [
    { id: 'ALL', label: 'All Types' },
    { id: 'attack', label: '⚔️ Strike', icon: Swords },
    { id: 'shield', label: '🛡️ Defense', icon: Shield },
    { id: 'speed_evasion', label: '⚡ Evasion', icon: Zap },
    { id: 'lifesteal', label: '🩸 Lifesteal', icon: Heart },
    { id: 'critical', label: '💥 Critical', icon: Target },
    { id: 'tactical', label: '🎯 Tactical', icon: Sparkles }
  ];

  const filteredCharacters = ALL_CHARACTERS.filter(hero => {
    const heroSkills = getSkillsForCharacter(hero);
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      heroSkills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGrade = selectedGrade === 'ALL' || hero.grade === selectedGrade;
    const matchesEffect = selectedEffectFilter === 'ALL' || heroSkills.some(s => s.effectType === selectedEffectFilter);

    return matchesSearch && matchesGrade && matchesEffect;
  }).sort((a, b) => b.overallPower - a.overallPower);

  const activeHeroSkills = getSkillsForCharacter(activeHero);

  const getEffectBadgeColor = (effectType: string) => {
    switch (effectType) {
      case 'attack': return 'bg-red-950/80 text-red-300 border-red-500/40';
      case 'shield': return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'speed_evasion': return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'lifesteal': return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'critical': return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'tactical': return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#0A0E18]/95 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/30 flex items-center justify-between bg-gradient-to-r from-amber-950/60 via-slate-900 to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 shadow-inner">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-heading font-black text-white uppercase tracking-wider">
                  SKILL MASTERY
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold">
                  350 HEROES • 1,750 SKILLS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore, analyze, and master all 5 signature abilities, damage boosts & tactical counters.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 border-b border-white/10 bg-[#080B14] space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hero or skill name (e.g. Arc Reactor, Vibranium Slash, Cyber Scan)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-1">
              {['ALL', 'MYTHIC', 'A', 'B', 'C'].map(grd => (
                <button
                  key={grd}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGrade(grd);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                    selectedGrade === grd
                      ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-black/40 text-slate-400 border-white/10 hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  {grd}
                </button>
              ))}
            </div>
          </div>

          {/* Effect Type Pill Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {effectTypes.map(eff => (
              <button
                key={eff.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedEffectFilter(eff.id);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
                  selectedEffectFilter === eff.id
                    ? 'bg-amber-950 text-amber-200 border-amber-400 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{eff.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Showcase: Heroes List (Left) & Active Hero 5-Skill Mastery Breakdown (Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Heroes Selector (4 Cols) */}
          <div className="md:col-span-4 border-r border-white/10 overflow-y-auto max-h-[60vh] md:max-h-none p-3 space-y-1.5 custom-scrollbar bg-black/40">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              HEROES ({filteredCharacters.length})
            </span>

            {filteredCharacters.map(hero => {
              const isSelected = activeHero.id === hero.id;
              return (
                <button
                  key={hero.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveHero(hero);
                  }}
                  className={`w-full p-2 rounded-xl flex items-center justify-between transition-all border text-left ${
                    isSelected
                      ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <CharacterPortrait character={hero} size="sm" />
                    <div className="min-w-0">
                      <strong className={`text-xs block truncate ${isSelected ? 'text-amber-300 font-black' : 'text-white'}`}>
                        {hero.name}
                      </strong>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Grade {hero.grade} • <strong className="text-amber-400">{hero.overallPower} PWR</strong>
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: 5 Signature Skills Deep-Dive (8 Cols) */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#090C16]/90">
            {/* Active Hero Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <CharacterPortrait character={activeHero} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-heading font-black text-white">
                      {activeHero.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                      GRADE {activeHero.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    "{activeHero.alias || activeHero.powers}"
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-mono block">BASE POWER</span>
                <span className="text-xl font-heading font-black text-amber-400">
                  {activeHero.overallPower} / 100
                </span>
              </div>
            </div>

            {/* 5 Signature Skills Cards Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  5 SIGNATURE COMBAT ABILITIES
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Tactical Loadout
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {activeHeroSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-amber-500/40 transition-all flex items-start gap-3.5 group shadow-sm"
                  >
                    {/* Skill Icon */}
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {skill.icon}
                    </div>

                    {/* Skill Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-heading font-black text-white group-hover:text-amber-300">
                            {skill.name}
                          </strong>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${getEffectBadgeColor(skill.effectType)}`}>
                            {skill.effectType.replace('_', ' ')}
                          </span>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-400/50 text-xs font-black font-mono">
                          +{skill.bonusPower} PWR
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

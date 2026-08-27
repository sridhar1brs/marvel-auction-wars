import React, { useState, useMemo } from 'react';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { Character } from '../../types/game';
import { getSkillsForCharacter, CharacterSkill } from '../../data/skills/characterSkills';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CharacterPortrait } from '../common/CharacterPortrait';
import { Zap, Lock, Check, Sparkles, Shield, Swords, AlertCircle } from 'lucide-react';

export function AscensionSkillVault() {
  const { user, buySkill } = useAuth();
  const ownedCharIds = useMemo(() => new Set(user?.ownedCharacters || []), [user?.ownedCharacters]);
  const availableRoster = useMemo(() => ALL_CHARACTERS.filter(c => ownedCharIds.has(c.id)), [ownedCharIds]);

  const [selectedHeroId, setSelectedHeroId] = useState<string>(availableRoster[0]?.id || ALL_CHARACTERS[0].id);
  const [isUnlocking, setIsUnlocking] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  const selectedHero = useMemo(() => {
    return ALL_CHARACTERS.find(c => c.id === selectedHeroId) || ALL_CHARACTERS[0];
  }, [selectedHeroId]);

  const heroLevel = (user?.characterLevels || {})[selectedHero.id] || 1;
  const skills = useMemo(() => getSkillsForCharacter(selectedHero), [selectedHero]);
  const ownedSkillIds = useMemo(() => new Set(user?.ownedSkills || []), [user?.ownedSkills]);

  const handleUnlockSkill = async (skill: CharacterSkill) => {
    if (heroLevel < skill.requiredLevel) {
      setFeedback({
        id: skill.id,
        success: false,
        msg: `🔒 Skill Locked! Upgrade ${selectedHero.name} to Level ${skill.requiredLevel} to unlock (Current: Level ${heroLevel}).`
      });
      return;
    }

    const cost = skill.astraCost || 1000;
    if ((user?.astra || 0) < cost) {
      setFeedback({
        id: skill.id,
        success: false,
        msg: `Insufficient Astra. Need ✨ ${cost.toLocaleString()} Astra.`
      });
      return;
    }

    soundManager.playClick();
    setIsUnlocking(skill.id);
    setFeedback(null);

    const res = await buySkill(skill.id, selectedHero.id, skill.requiredLevel, cost);
    setIsUnlocking(null);

    if (res.success) {
      soundManager.playVictoryFanfare();
      setFeedback({
        id: skill.id,
        success: true,
        msg: `🎉 Successfully unlocked ${skill.name} for ${selectedHero.name}!`
      });
    } else {
      setFeedback({
        id: skill.id,
        success: false,
        msg: res.error || 'Failed to unlock skill.'
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Skill Vault Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-yellow-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
              Character-Specific Abilities
            </span>
            <span className="text-xs text-slate-400 font-mono">Level-Gated Progression</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide mt-1">
            Signature Skill Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-0.5">
            Every Marvel hero has 5 unique signature combat skills. Skills unlock as your hero reaches higher character levels (Lv 5, 10, 20, 30, 40).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-yellow-500/30 text-center">
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">Hero Level</div>
            <div className="text-xl font-heading font-black text-amber-400 font-mono">
              LEVEL {heroLevel} / 50
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Hero Selector on Left, 5 Skills on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Select Hero */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider flex items-center justify-between">
            <span>Select Hero</span>
            <span className="text-xs text-amber-300 font-mono">({availableRoster.length} Owned)</span>
          </h3>

          <div className="grid grid-cols-3 gap-2 max-h-[480px] overflow-y-auto pr-1">
            {(availableRoster.length > 0 ? availableRoster : ALL_CHARACTERS.slice(0, 12)).map(hero => {
              const isSelected = hero.id === selectedHero.id;
              const hLvl = (user?.characterLevels || {})[hero.id] || 1;

              return (
                <div
                  key={hero.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedHeroId(hero.id);
                    setFeedback(null);
                  }}
                  className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                    isSelected
                      ? 'bg-yellow-500/20 border-yellow-400 shadow-glow-yellow scale-105'
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <CharacterPortrait character={hero} size="sm" showBadge={false} />
                  <div className="text-[11px] font-bold text-white mt-1 truncate w-full">
                    {hero.name}
                  </div>
                  <div className="text-[9px] text-amber-300 font-mono font-bold">
                    LVL {hLvl}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5 Character-Specific Skills */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-xl font-heading font-black text-white">
                {selectedHero.name}'s Signature Abilities
              </h3>
              <p className="text-xs text-slate-400">
                5 distinct character-specific combat skills tied to character level milestones.
              </p>
            </div>
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 rounded-xl text-xs font-mono font-bold">
              Current Hero Level: {heroLevel}
            </div>
          </div>

          <div className="space-y-3">
            {skills.map((skill, idx) => {
              const isLocked = heroLevel < skill.requiredLevel;
              const isOwned = ownedSkillIds.has(skill.id);
              const isBusy = isUnlocking === skill.id;

              return (
                <div
                  key={skill.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isLocked
                      ? 'bg-black/60 border-slate-800 opacity-75'
                      : isOwned
                      ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-black border-emerald-500/40'
                      : 'bg-slate-950/80 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                      {skill.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-sm text-white">
                          {skill.name}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[9px] font-mono font-bold uppercase">
                          Skill #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/30 rounded text-[9px] font-mono">
                          +{skill.bonusPower} PWR
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{skill.description}</p>
                    </div>
                  </div>

                  {/* Actions & Requirement */}
                  <div className="shrink-0 w-full sm:w-auto text-right">
                    {isLocked ? (
                      <div className="px-3 py-2 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono font-bold flex items-center justify-center sm:justify-end gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>🔒 UNLOCKS AT LEVEL {skill.requiredLevel}</span>
                      </div>
                    ) : isOwned ? (
                      <div className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono font-bold flex items-center justify-center sm:justify-end gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>UNLOCKED & EQUIPPED</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUnlockSkill(skill)}
                        disabled={isBusy}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <span>{isBusy ? 'Unlocking...' : 'Unlock Skill'}</span>
                        <span className="font-mono font-bold">✨ {skill.astraCost.toLocaleString()} ASTRA</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-medium border ${feedback.success ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-rose-950/70 border-rose-500 text-rose-300'}`}>
              {feedback.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

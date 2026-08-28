import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { soundManager } from '../../audio/soundManager';
import { Users, Plus, Trash2, Edit3, Check, X, Shield, Zap, Swords, Star } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  characterIds: string[];
  createdAt: number;
  updatedAt: number;
}

const TEAM_SYNERGY_TAGS: Record<string, { label: string; color: string }> = {
  'Avengers':  { label: '⚡ Avengers Sync',  color: 'text-blue-400' },
  'X-Men':     { label: '🧬 X-Men Sync',     color: 'text-yellow-400' },
  'Villains':  { label: '💀 Villain Sync',   color: 'text-red-400' },
  'Guardians': { label: '🌌 Guardians Sync', color: 'text-green-400' },
};

function detectSynergy(characters: typeof ALL_CHARACTERS): string | null {
  const alignments = characters.map(c => c.alignment);
  const factions = characters.flatMap(c => (c.factions || []) as string[]);
  if (factions.filter(a => a === 'Avengers').length >= 2) return 'Avengers';
  if (factions.filter(a => a === 'X-Men').length >= 2) return 'X-Men';
  if (alignments.filter(a => a === 'Villain').length >= 3) return 'Villains';
  if (factions.filter(a => a === 'Guardians of the Galaxy').length >= 2) return 'Guardians';
  return null;
}

const GRADE_COLORS: Record<string, string> = {
  C: 'from-slate-500 to-slate-600',
  B: 'from-blue-500 to-blue-700',
  A: 'from-purple-500 to-indigo-700',
  MYTHIC: 'from-amber-400 to-yellow-600',
};

export function TeamBuilder() {
  const { user, saveTeam, deleteTeam, getTeams } = useAuth();
  const [teams, setTeams] = useState<Team[]>(user?.savedTeams || []);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlignment, setFilterAlignment] = useState<'All' | 'Hero' | 'Villain' | 'Cosmic'>('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const ownedIds = user?.ownedCharacters || [];
  const ownedCharacters = ALL_CHARACTERS.filter(c => ownedIds.includes(c.id));

  // Sync teams from user state
  useEffect(() => {
    if (user?.savedTeams) setTeams(user.savedTeams);
  }, [user?.savedTeams]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredOwned = ownedCharacters.filter(c => {
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAlign = filterAlignment === 'All' || c.alignment === filterAlignment;
    return matchSearch && matchAlign;
  });

  const startCreate = () => {
    setEditingTeam(null);
    setEditName('New Team');
    setSelectedChars([]);
    setIsCreating(true);
    soundManager.playClick();
  };

  const startEdit = (team: Team) => {
    setEditingTeam(team);
    setEditName(team.name);
    setSelectedChars([...team.characterIds]);
    setIsCreating(true);
    soundManager.playClick();
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingTeam(null);
    setSelectedChars([]);
    setEditName('');
  };

  const toggleChar = (id: string) => {
    if (selectedChars.includes(id)) {
      setSelectedChars(prev => prev.filter(c => c !== id));
    } else if (selectedChars.length < 5) {
      setSelectedChars(prev => [...prev, id]);
      soundManager.playClick();
    } else {
      showToast('Max 5 characters per team!');
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) { showToast('Team name required.'); return; }
    if (selectedChars.length === 0) { showToast('Select at least 1 character.'); return; }
    setSaving(true);
    const data = await saveTeam(editName.trim(), selectedChars, editingTeam?.id);
    setSaving(false);
    if (data.success) {
      soundManager.playVictoryFanfare();
      showToast(editingTeam ? '✓ Team updated!' : '✓ Team saved!');
      cancelEdit();
    } else {
      showToast(data.error || 'Save failed.');
    }
  };

  const handleDelete = async (teamId: string) => {
    const data = await deleteTeam(teamId);
    if (data.success) {
      soundManager.playClick();
      showToast('Team deleted.');
    }
  };

  const selectedCharacterObjects = ALL_CHARACTERS.filter(c => selectedChars.includes(c.id));
  const synergy = detectSynergy(selectedCharacterObjects);

  const totalPower = selectedCharacterObjects.reduce((sum, c) => sum + (c.overallPower || 0), 0);
  const totalHp = selectedCharacterObjects.reduce((sum, c) => sum + (c.stats?.durability || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl bg-slate-900 border border-white/20 text-white">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-[#0D1A0D] to-[#0D1535] border border-emerald-500/20 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-400" /> Team Builder
            </h1>
            <p className="text-slate-400 text-sm mt-1">Build teams of up to 5 characters — synergies apply in battles!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400">{teams.length}<span className="text-slate-500 text-lg">/10</span></div>
              <div className="text-xs text-slate-500">Teams Saved</div>
            </div>
            <button
              onClick={startCreate}
              disabled={teams.length >= 10 || isCreating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-40"
            >
              <Plus className="w-4 h-4" /> New Team
            </button>
          </div>
        </div>
      </div>

      {/* Team Creator / Editor */}
      {isCreating && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-white uppercase tracking-wide text-lg">
              {editingTeam ? '✏️ Edit Team' : '+ Create Team'}
            </h2>
            <button onClick={cancelEdit} className="p-2 hover:bg-white/10 rounded-lg cursor-pointer">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Team Name Input */}
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Team Name..."
            maxLength={30}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all text-sm font-semibold"
          />

          {/* Selected Roster */}
          {selectedCharacterObjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 uppercase font-bold tracking-widest">Selected Roster ({selectedChars.length}/5)</span>
                {synergy && (
                  <span className={`font-bold ${TEAM_SYNERGY_TAGS[synergy]?.color || 'text-white'}`}>
                    {TEAM_SYNERGY_TAGS[synergy]?.label}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedCharacterObjects.map(c => (
                  <div key={c.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${GRADE_COLORS[c.grade] || 'from-slate-600 to-slate-700'} text-white text-xs font-bold cursor-pointer hover:opacity-80 transition-all`}
                    onClick={() => toggleChar(c.id)}
                  >
                    <span>{c.name}</span>
                    <X className="w-3 h-3 opacity-70" />
                  </div>
                ))}
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-slate-300">Power: <strong className="text-white">{totalPower}</strong></span>
                </div>
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-slate-300">Total HP: <strong className="text-white">{totalHp.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Character Picker */}
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search characters..."
                className="flex-1 min-w-[160px] px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all text-xs"
              />
              {['All', 'Hero', 'Villain', 'Cosmic'].map(a => (
                <button key={a}
                  onClick={() => setFilterAlignment(a as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${filterAlignment === a ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                >
                  {a}
                </button>
              ))}
            </div>

            {ownedCharacters.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                You don't own any characters yet. Visit the Astra Shop!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto no-scrollbar">
                {filteredOwned.map(c => {
                  const isSelected = selectedChars.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleChar(c.id)}
                      className={`relative p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500/70 bg-emerald-950/40 scale-[1.02]'
                          : 'border-white/10 bg-black/20 hover:border-white/30'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <div className="text-xs font-bold text-white truncate pr-4">{c.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{c.grade} • {c.alignment}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button onClick={cancelEdit}
              className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 font-bold text-sm hover:bg-white/10 transition-all cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><span className="animate-spin">⚙</span> Saving...</> : <><Check className="w-4 h-4" /> Save Team</>}
            </button>
          </div>
        </div>
      )}

      {/* Saved Teams */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.map(team => {
            const chars = ALL_CHARACTERS.filter(c => team.characterIds.includes(c.id));
            const synergy = detectSynergy(chars);
            const power = chars.reduce((s, c) => s + (c.overallPower || 0), 0);

            return (
              <div key={team.id}
                className="rounded-2xl border border-white/10 bg-[#0B0D1E] p-4 space-y-3 hover:border-white/20 transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-heading font-black text-white text-base">{team.name}</div>
                    {synergy && (
                      <div className={`text-xs font-bold ${TEAM_SYNERGY_TAGS[synergy]?.color}`}>
                        {TEAM_SYNERGY_TAGS[synergy]?.label}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(team)}
                      className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer">
                      <Edit3 className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                    </button>
                    <button onClick={() => handleDelete(team.id)}
                      className="p-1.5 hover:bg-red-950/50 rounded-lg cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                </div>

                {/* Character Chips */}
                <div className="flex gap-1 flex-wrap">
                  {chars.map(c => (
                    <span key={c.id}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${GRADE_COLORS[c.grade] || 'from-slate-600 to-slate-700'} text-white opacity-90`}>
                      {c.name}
                    </span>
                  ))}
                  {team.characterIds.length > chars.length && (
                    <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full bg-white/5">
                      +{team.characterIds.length - chars.length} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1"><Swords className="w-3 h-3" /> Power: {power}</span>
                  <span>{chars.length} Characters</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : !isCreating && (
        <div className="text-center py-16 text-slate-500 space-y-3">
          <Users className="w-12 h-12 mx-auto opacity-20" />
          <p className="font-semibold">No teams saved yet</p>
          <p className="text-sm">Click "New Team" to build your first roster</p>
        </div>
      )}

      {/* Synergy Guide */}
      <div className="rounded-2xl p-5 bg-[#0B0D1E] border border-white/5 space-y-3">
        <h3 className="text-sm font-heading font-black text-white uppercase tracking-wider">🔗 Team Synergies</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(TEAM_SYNERGY_TAGS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3">
              <span className={`font-bold ${v.color}`}>{v.label}</span>
              <span className="text-slate-500">— 2+ {k} members</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

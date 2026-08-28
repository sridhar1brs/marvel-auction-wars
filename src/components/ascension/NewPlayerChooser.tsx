import React, { useEffect, useState } from 'react';
import { Character } from '../../types/game';
import { useAuth } from '../../context/AuthContext';
import { CharacterPortrait } from '../common/CharacterPortrait';

export function NewPlayerChooser({ onComplete }: { onComplete: () => void }) {
  const { getOnboardingChoices, chooseOnboardingCharacter } = useAuth();
  const [choices, setChoices] = useState<Character[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getOnboardingChoices().then(result => {
      if (result.success) setChoices((result.choices || []) as Character[]);
      else setError(result.error || 'Unable to load your starter choices.');
    });
  }, []);

  const choose = async () => {
    if (!selected || saving) return;
    setSaving(true);
    const result = await chooseOnboardingCharacter(selected);
    if (result.success) {
      onComplete();
    } else {
      setError(result.error || 'Unable to save your starter character.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-cyan-400/60 bg-[#080B1A] p-5 sm:p-8 shadow-[0_0_70px_rgba(6,182,212,0.35)]">
        <div className="text-center space-y-2 mb-6">
          <div className="text-cyan-300 text-xs font-mono font-black tracking-[0.3em] uppercase">Welcome, Commander</div>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase">Choose Your First Champion</h2>
          <p className="text-sm text-slate-300">Five heroes have been selected from the live character database. Choose one permanent starter.</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl border border-rose-500/50 bg-rose-950/60 text-rose-200 text-sm">{error}</div>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {choices.map(character => (
            <button key={character.id} type="button" onClick={() => setSelected(character.id)}
              className={`p-3 rounded-2xl border-2 text-center transition-all ${selected === character.id ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-glow-gold' : 'border-white/10 bg-black/40 hover:border-cyan-400/60'}`}>
              <CharacterPortrait character={character} size="md" className="mx-auto" />
              <div className="mt-2 font-heading font-black text-xs text-white truncate">{character.name}</div>
              <div className="text-[10px] text-cyan-300 font-mono mt-1">{character.grade} • {character.overallPower} PWR</div>
            </button>
          ))}
        </div>
        <button type="button" disabled={!selected || saving} onClick={choose}
          className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-black font-heading font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed">
          {saving ? 'SAVING STARTER...' : 'CONFIRM CHAMPION'}
        </button>
      </div>
    </div>
  );
}

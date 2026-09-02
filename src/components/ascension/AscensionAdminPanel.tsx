import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, Gift, LayoutDashboard, Search, ShieldAlert, Users, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminActionLog, RedeemCode } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';

type Section = 'dashboard' | 'players' | 'characters' | 'codes' | 'activity';

const card = 'rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl';
const input = 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400';

export const AscensionAdminPanel: React.FC = () => {
  const {
    user, fetchAdminStats, fetchAdminPlayers, fetchAdminPlayerDetail,
    adminApplyPlayerAction, fetchAdminActivity, fetchAdminCodes,
    createAdminCode, toggleAdminCode, deleteAdminCode,
    fetchAdminCharacters, updateAdminCharacterPrice,
  } = useAuth();
  const [section, setSection] = useState<Section>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [playerPage, setPlayerPage] = useState(1);
  const [playerTotalPages, setPlayerTotalPages] = useState(1);
  const [playerSearch, setPlayerSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [logs, setLogs] = useState<AdminActionLog[]>([]);
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [characterCatalog, setCharacterCatalog] = useState<any[]>([]);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [characterMessage, setCharacterMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [characterSearch, setCharacterSearch] = useState('');
  const [action, setAction] = useState('grant_astra');
  const [amount, setAmount] = useState(1000);
  const [actionCharacter, setActionCharacter] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [newCode, setNewCode] = useState({ astraReward: 5000, maxUses: 100, expiresAt: '2026-12-31', code: '' });
  const [codeRewardType, setCodeRewardType] = useState<'ASTRA' | 'CHARACTER' | 'SHARD' | 'CRATE'>('ASTRA');
  const [codeCharacter, setCodeCharacter] = useState('');
  const [codeShardCategory, setCodeShardCategory] = useState('RARE');
  const [codeCrateType, setCodeCrateType] = useState('SHARD_CRATE_RARE');

  const isAdmin = user?.role === 'admin' && user.isAdmin;

  const refresh = async () => {
    if (!isAdmin) { setLoading(false); return; }
    setLoading(true);
    setError('');
    const [statsRes, codeRes, activityRes, characterRes] = await Promise.all([
      fetchAdminStats(), fetchAdminCodes(), fetchAdminActivity(100), fetchAdminCharacters(),
    ]);
    if (statsRes.success) setStats(statsRes.stats);
    else setError(statsRes.error || 'Unable to load dashboard.');
    if (codeRes.success) setCodes(codeRes.codes || []);
    if (activityRes.success) setLogs(activityRes.logs || []);
    if (characterRes.success) {
      setCharacterCatalog(characterRes.characters || []);
      setPriceDrafts(Object.fromEntries((characterRes.characters || []).map((character: any) => [character.id, String(character.startingPrice)])));
    }
    setLoading(false);
  };

  const loadPlayers = async (page = playerPage, search = playerSearch) => {
    const result = await fetchAdminPlayers({ page, pageSize: 25, search });
    if (!result.success) { setError(result.error || 'Unable to load players.'); return; }
    setPlayers(result.players || []);
    setPlayerPage(result.page || page);
    setPlayerTotalPages(result.totalPages || 1);
  };

  useEffect(() => { refresh(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && section === 'players') loadPlayers(playerPage, playerSearch); }, [isAdmin, section, playerPage]);

  const openPlayer = async (player: any) => {
    setSelected(player);
    const result = await fetchAdminPlayerDetail(player.id);
    if (result.success) { setDetails(result); setSection('players'); }
    else setError(result.error || 'Unable to load player.');
  };

  const applyAction = async () => {
    if (!selected) return;
    const label = action.replace(/_/g, ' ');
    const expiry = (document.getElementById('admin-suspension-expiry') as HTMLInputElement | null)?.value;
    const characterName = (details?.characters || []).find((character: any) => character.id === actionCharacter)?.name || actionCharacter;
    const destructive = ['ban_player', 'suspend_player', 'remove_all_inventory', 'remove_character', 'reset_progression'].includes(action);
    const confirmation = `Confirm ${label} for ${selected.username}${characterName && action === 'remove_character' ? ` (${characterName})` : ''}${expiry && action === 'suspend_player' ? ` until ${expiry}` : ''}?${destructive ? ' THIS IS DESTRUCTIVE.' : ''} This action is recorded in the audit log.`;
    if (!window.confirm(confirmation)) return;
    if (action === 'suspend_player' && !expiry) { setActionMessage('Choose a suspension expiry first.'); return; }
    const result = await adminApplyPlayerAction(selected.id, action, Number(amount), actionCharacter || undefined, expiry || undefined);
    if (!result.success) { setActionMessage(result.error || 'Action failed.'); return; }
    setActionMessage('Action applied and recorded.');
    const detail = await fetchAdminPlayerDetail(selected.id);
    if (detail.success) setDetails(detail);
    await Promise.all([refresh(), loadPlayers(playerPage, playerSearch)]);
  };

  const createCode = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await createAdminCode({
      code: newCode.code || undefined,
      astraReward: Number(newCode.astraReward),
      rewardType: codeRewardType,
      rewardAmount: Number(newCode.astraReward),
      characterId: codeRewardType === 'CHARACTER' ? codeCharacter : codeRewardType === 'SHARD' ? codeShardCategory : undefined,
      crateType: codeRewardType === 'CRATE' ? codeCrateType : undefined,
      maxUses: Number(newCode.maxUses),
      expiresAt: newCode.expiresAt,
      isActive: true,
    });
    if (!result.success) setError(result.error || 'Unable to create code.');
    else { setNewCode({ ...newCode, code: '' }); await refresh(); }
  };

  const visibleCharacters = useMemo(() => {
    const needle = characterSearch.toLowerCase();
    return ALL_CHARACTERS.filter(character => !needle || character.name.toLowerCase().includes(needle) || character.id.toLowerCase().includes(needle));
  }, [characterSearch]);

  if (!isAdmin) {
    return <div className={`${card} mx-auto my-12 max-w-xl p-10 text-center`}><ShieldAlert className="mx-auto mb-4 h-12 w-12 text-rose-400" /><h2 className="text-2xl font-black text-rose-300">ACCESS DENIED</h2><p className="mt-2 text-sm text-slate-400">Owner authorization is required.</p></div>;
  }

  const nav: Array<{ id: Section; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'players', label: 'Players', icon: <Users className="h-4 w-4" /> },
    { id: 'characters', label: 'Characters', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'codes', label: 'Redeem Codes', icon: <Gift className="h-4 w-4" /> },
    { id: 'activity', label: 'Activity Log', icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-[720px] flex-col gap-5 text-slate-100 lg:flex-row">
      <aside className={`${card} h-fit w-full shrink-0 p-3 lg:w-60`}>
        <div className="mb-4 border-b border-white/10 px-3 pb-4"><div className="text-[10px] font-bold uppercase tracking-[.25em] text-amber-400">Owner clearance</div><h2 className="mt-1 text-lg font-black">ASCENSION OPS</h2></div>
        <nav className="space-y-1">{nav.map(item => <button key={item.id} onClick={() => setSection(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold uppercase tracking-wide transition ${section === item.id ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{item.icon}{item.label}</button>)}</nav>
        <button onClick={refresh} className="mt-4 w-full rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-slate-800">{loading ? 'SYNCING…' : 'SYNC LIVE DATA'}</button>
      </aside>

      <section className="min-w-0 flex-1 space-y-5">
        <header className={`${card} flex flex-wrap items-center justify-between gap-3 p-5`}><div><div className="text-xs font-bold uppercase tracking-[.25em] text-cyan-400">Marvel Ascension / Admin</div><h1 className="mt-1 text-2xl font-black">Massive Admin Panel 2.0</h1></div><div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">Signed in as {user?.username}</div></header>
        {error && <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 p-3 text-sm text-rose-300">{error}<button className="float-right" onClick={() => setError('')}><X className="h-4 w-4" /></button></div>}

        {section === 'dashboard' && <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
            ['Players', stats?.totalPlayers, 'text-cyan-300'], ['Astra circulation', stats?.totalAstraInCirculation?.toLocaleString(), 'text-amber-300'],
            ['Matches', stats?.totalMatches?.toLocaleString(), 'text-violet-300'], ['Active codes', stats?.totalRedeemCodes, 'text-emerald-300'],
          ].map(([label, value, color]) => <div key={String(label)} className={`${card} p-4`}><div className="text-xs uppercase text-slate-500">{label}</div><div className={`mt-2 text-2xl font-black ${color}`}>{value ?? '—'}</div></div>)}</div>
          <div className={`${card} p-5`}><div className="mb-3 flex items-center justify-between"><h3 className="font-black">Recent operations</h3><button onClick={() => setSection('activity')} className="text-xs text-cyan-300">View all</button></div><ActivityRows logs={logs.slice(0, 8)} /></div>
        </div>}

        {section === 'players' && <div className="space-y-5">
          <div className={`${card} flex flex-wrap gap-2 p-4`}><div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" /><input className={`${input} pl-9`} value={playerSearch} onChange={event => setPlayerSearch(event.target.value)} onKeyDown={event => event.key === 'Enter' && loadPlayers(1, playerSearch)} placeholder="Search username or display name" /></div><button onClick={() => loadPlayers(1, playerSearch)} className="rounded-xl bg-cyan-500 px-5 text-xs font-black text-slate-950">SEARCH</button></div>
          <div className={`${card} overflow-x-auto p-4`}><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-b border-white/10 text-[10px] uppercase text-slate-500"><tr><th className="p-3">Player</th><th className="p-3">Level</th><th className="p-3">Astra</th><th className="p-3">Matches</th><th className="p-3">Rank</th><th className="p-3" /></tr></thead><tbody className="divide-y divide-white/5">{players.map(player => <tr key={player.id} className="hover:bg-slate-800/40"><td className="p-3"><span className="mr-2 text-lg">{player.avatar}</span><b>{player.displayName}</b><span className="ml-2 text-slate-500">@{player.username}</span></td><td className="p-3">{player.level}</td><td className="p-3 text-amber-300">{player.astra?.toLocaleString()}</td><td className="p-3">{player.matchesPlayed}</td><td className="p-3">{player.rankedTier} {player.rankedRating ? `(${player.rankedRating})` : ''}</td><td className="p-3 text-right"><button onClick={() => openPlayer(player)} className="rounded-lg border border-cyan-500/40 px-3 py-1 text-cyan-300">Inspect</button></td></tr>)}</tbody></table><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Page {playerPage} / {playerTotalPages}</span><div className="space-x-2"><button disabled={playerPage <= 1} onClick={() => setPlayerPage(playerPage - 1)} className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40">Prev</button><button disabled={playerPage >= playerTotalPages} onClick={() => setPlayerPage(playerPage + 1)} className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40">Next</button></div></div></div>
          {details && selected && <PlayerDetail details={details} selected={selected} action={action} setAction={setAction} amount={amount} setAmount={setAmount} actionCharacter={actionCharacter} setActionCharacter={setActionCharacter} actionMessage={actionMessage} onApply={applyAction} onClose={() => { setDetails(null); setSelected(null); }} />}
        </div>}

        {section === 'characters' && <div className={`${card} p-5`}><div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-slate-500" /><input className={input} value={characterSearch} onChange={event => setCharacterSearch(event.target.value)} placeholder="Search the live character catalog" /></div>{characterMessage && <div className="mb-3 text-xs text-emerald-300">{characterMessage}</div>}<div className="grid max-h-[620px] grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2 xl:grid-cols-3">{(characterCatalog.length ? characterCatalog : visibleCharacters).filter(character => !characterSearch || character.name.toLowerCase().includes(characterSearch.toLowerCase()) || character.id.toLowerCase().includes(characterSearch.toLowerCase())).map((character: any) => <div key={character.id} className="rounded-xl border border-white/5 bg-slate-950/70 p-3"><div className="font-bold">{character.name}</div><div className="mt-1 text-[10px] uppercase text-cyan-300">{character.grade} · {character.id}</div><div className="text-xs text-slate-500">Base {character.baseStartingPrice ?? character.startingPrice}</div><div className="mt-2 flex gap-2"><input className={input} type="number" min={0} max={1000000} value={priceDrafts[character.id] ?? String(character.startingPrice)} onChange={event => setPriceDrafts({ ...priceDrafts, [character.id]: event.target.value })} /><button onClick={async () => { const value = Number(priceDrafts[character.id]); if (!Number.isInteger(value) || value < 0) { setError('Price must be a whole number from 0 to 1,000,000.'); return; } if (!window.confirm(`Save the starting price for ${character.name}?`)) return; const result = await updateAdminCharacterPrice(character.id, value); if (!result.success) setError(result.error || 'Unable to update price.'); else { setCharacterMessage('Character price updated and recorded.'); await refresh(); } }} className="rounded-xl bg-cyan-500 px-3 text-xs font-black text-slate-950">SAVE</button></div></div>)}</div></div>}

        {section === 'codes' && <div className="space-y-5"><form onSubmit={createCode} className={`${card} grid gap-3 p-5 md:grid-cols-4`}><input className={input} value={newCode.code} maxLength={10} onChange={event => setNewCode({ ...newCode, code: event.target.value.replace(/\D/g, '') })} placeholder="Optional 10-digit code" /><select className={input} value={codeRewardType} onChange={event => setCodeRewardType(event.target.value as typeof codeRewardType)}><option value="ASTRA">Astra</option><option value="CHARACTER">Character</option><option value="SHARD">Category shards</option><option value="CRATE">Crate</option></select><input className={input} type="number" min={1} max={1000000} value={newCode.astraReward} onChange={event => setNewCode({ ...newCode, astraReward: Number(event.target.value) })} placeholder="Reward amount" />{codeRewardType === 'CHARACTER' ? <select className={input} required value={codeCharacter} onChange={event => setCodeCharacter(event.target.value)}><option value="">Select character</option>{ALL_CHARACTERS.map(character => <option key={character.id} value={character.id}>{character.name}</option>)}</select> : codeRewardType === 'SHARD' ? <select className={input} value={codeShardCategory} onChange={event => setCodeShardCategory(event.target.value)}><option>RARE</option><option>EPIC</option><option>MYTHIC</option><option>HERO</option><option>VILLAIN</option><option>COSMIC</option></select> : codeRewardType === 'CRATE' ? <select className={input} value={codeCrateType} onChange={event => setCodeCrateType(event.target.value)}><option>SHARD_CRATE_RARE</option><option>SHARD_CRATE_EPIC</option><option>SHARD_CRATE_LEGENDARY</option><option>SHARD_CRATE_MYTHIC</option><option>CHARACTER_CRATE_RARE</option><option>CHARACTER_CRATE_EPIC</option><option>CHARACTER_CRATE_LEGENDARY</option><option>CHARACTER_CRATE_MYTHIC</option></select> : <span /> }<input className={input} type="number" min={1} max={100000} value={newCode.maxUses} onChange={event => setNewCode({ ...newCode, maxUses: Number(event.target.value) })} placeholder="Max uses" /><input className={input} type="date" value={newCode.expiresAt} onChange={event => setNewCode({ ...newCode, expiresAt: event.target.value })} /><button className="rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950">PUBLISH</button></form><div className={`${card} overflow-x-auto p-4`}><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-white/10 text-[10px] uppercase text-slate-500"><tr><th className="p-3">Code</th><th className="p-3">Reward</th><th className="p-3">Uses</th><th className="p-3">Expiry</th><th className="p-3">Status</th><th /></tr></thead><tbody className="divide-y divide-white/5">{codes.map(code => <tr key={code.code}><td className="p-3 font-mono font-bold text-amber-300">{code.code}</td><td className="p-3">{code.rewardType === 'CHARACTER' ? code.characterId : code.rewardType === 'CRATE' ? code.crateType : code.rewardType === 'SHARD' ? `${code.rewardAmount} shards` : `${code.astraReward.toLocaleString()} ASTRA`}</td><td className="p-3">{code.usedCount} / {code.maxUses}</td><td className="p-3">{code.expiresAt}</td><td className="p-3">{code.isActive ? 'ACTIVE' : 'INACTIVE'}</td><td className="space-x-2 p-3 text-right"><button onClick={() => toggleAdminCode(code.code, !code.isActive).then(refresh)} className="text-cyan-300">{code.isActive ? 'Disable' : 'Enable'}</button><button onClick={() => window.confirm(`Revoke ${code.code}?`) && deleteAdminCode(code.code).then(refresh)} className="text-rose-300">Revoke</button></td></tr>)}</tbody></table></div></div>}

        {section === 'activity' && <div className={`${card} p-5`}><h3 className="mb-4 font-black">Immutable owner audit stream</h3><ActivityRows logs={logs} /></div>}
      </section>
    </div>
  );
};

const ActivityRows = ({ logs }: { logs: AdminActionLog[] }) => logs.length ? <div className="space-y-2">{logs.map(log => <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-slate-950/70 p-3 text-xs"><span><b className="text-amber-300">{log.action}</b><span className="ml-2 text-slate-300">{log.details}</span></span><time className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</time></div>)}</div> : <div className="py-8 text-center text-sm text-slate-500">No admin operations recorded.</div>;

const PlayerDetail = ({ details, selected, action, setAction, amount, setAmount, actionCharacter, setActionCharacter, actionMessage, onApply, onClose }: any) => (
  <div className={`${card} relative p-5`}>
    <button onClick={onClose} className="absolute right-4 top-4 text-slate-500 hover:text-white"><X className="h-4 w-4" /></button>
    <h3 className="text-lg font-black">{details.player.displayName} <span className="text-sm font-normal text-slate-500">@{details.player.username}</span></h3>
    <div className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-5">{[['Level', details.player.level], ['XP', details.player.xp], ['Astra', details.player.astra], ['Wins', details.player.wins], ['Owned', details.characters?.length || 0]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-950 p-3"><div className="text-slate-500">{label}</div><b className="text-base">{value}</b></div>)}</div>
    <div className="mt-5 border-t border-white/10 pt-4"><div className="mb-2 text-xs font-bold uppercase text-rose-300">Danger Zone — confirmed operator action</div><div className="grid gap-2 md:grid-cols-4"><select className={input} value={action} onChange={event => setAction(event.target.value)}><option value="grant_astra">Grant Astra</option><option value="grant_xp">Grant XP</option><option value="grant_card_shards">Grant Card Shards</option><option value="grant_wheel_spins">Grant Wheel Spins</option><option value="set_level">Set Level</option><option value="grant_character">Grant Character</option><option value="ban_player">Ban player</option><option value="suspend_player">Temporary suspend</option><option value="remove_all_inventory">Remove all inventory</option><option value="remove_character">Remove selected character</option><option value="reset_progression">Reset progression</option></select><input className={input} type="number" min={0} value={amount} onChange={event => setAmount(Number(event.target.value))} disabled={['ban_player', 'suspend_player', 'remove_all_inventory', 'remove_character', 'reset_progression'].includes(action)} /><select className={input} value={actionCharacter} onChange={event => setActionCharacter(event.target.value)} disabled={!['grant_character', 'remove_character'].includes(action)}><option value="">Select character</option>{(action === 'remove_character' ? (details.characters || []) : ALL_CHARACTERS).map((character: any) => <option key={character.id} value={character.id}>{character.name}</option>)}</select>{action === 'suspend_player' && <input id="admin-suspension-expiry" className={input} type="datetime-local" min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} required />}{action !== 'suspend_player' && <span /> }<button onClick={onApply} className="rounded-xl bg-rose-500 px-4 text-xs font-black text-white">APPLY</button></div>{actionMessage && <div className="mt-2 text-xs text-emerald-300">{actionMessage}</div>}</div>
    <div className="mt-5"><div className="mb-2 text-xs font-bold uppercase text-slate-500">Owned characters</div><div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">{(details.characters || []).map((character: any) => <span key={character.id} className="rounded-lg border border-white/10 px-2 py-1 text-xs">{character.name} <span className="text-cyan-300">L{character.level}</span></span>)}</div></div>
  </div>
);

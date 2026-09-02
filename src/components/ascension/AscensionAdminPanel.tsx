import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RedeemCode, AdminActionLog } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';

export const AscensionAdminPanel: React.FC = () => {
  const { user, fetchAdminStats, fetchAdminCodes, createAdminCode, toggleAdminCode, deleteAdminCode } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [actionLogs, setActionLogs] = useState<AdminActionLog[]>([]);
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [newCodeInput, setNewCodeInput] = useState('');
  const [astraReward, setAstraReward] = useState<number>(5000);
  const [rewardType, setRewardType] = useState<'ASTRA' | 'CHARACTER' | 'SHARD' | 'CRATE'>('ASTRA');
  const [characterId, setCharacterId] = useState('');
  const [crateType, setCrateType] = useState<'SHARD_CRATE' | 'CHARACTER_CRATE'>('SHARD_CRATE');
  const [crateTier, setCrateTier] = useState<'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC'>('RARE');
  const [shardCategory, setShardCategory] = useState<'RARE' | 'EPIC' | 'MYTHIC' | 'HERO' | 'VILLAIN' | 'COSMIC'>('RARE');
  const [maxUses, setMaxUses] = useState<number>(1000);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createFeedback, setCreateFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  // Load Data
  const loadAdminData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const [statsRes, codesRes] = await Promise.all([
        fetchAdminStats(),
        fetchAdminCodes()
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        setActionLogs(statsRes.actionLogs || []);
      } else {
        setErrorMsg(statsRes.error || 'Failed to load admin statistics.');
      }

      if (codesRes.success) {
        setCodes(codesRes.codes || []);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error communicating with admin server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  // Let the server generate the authoritative secure 10-digit code.
  const generateRandomCode = () => {
    setNewCodeInput('');
    setCreateFeedback({ success: true, msg: 'A secure unique 10-digit code will be generated when you publish.' });
  };

  // Handle Create Code
  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateFeedback(null);

    const res = await createAdminCode({
      code: newCodeInput ? newCodeInput.toUpperCase() : undefined,
      astraReward: Number(astraReward) || 5000,
      rewardType,
      rewardAmount: Number(astraReward) || 0,
      characterId: rewardType === 'CHARACTER' ? characterId : rewardType === 'SHARD' ? shardCategory : undefined,
      crateType: rewardType === 'CRATE' ? `${crateType}_${crateTier}` : undefined,
      maxUses: Number(maxUses) || 1000,
      expiresAt: expiresAt || '2026-12-31',
      isActive
    });

    setIsCreating(false);

    if (res.success && res.code) {
      setCreateFeedback({
        success: true,
        msg: `🎉 Code ${res.code.code} successfully created and live in database!`
      });
      setNewCodeInput('');
      loadAdminData();
    } else {
      setCreateFeedback({
        success: false,
        msg: res.error || 'Failed to create code.'
      });
    }
  };

  // Handle Toggle Active/Inactive
  const handleToggleCode = async (code: string, currentStatus: boolean) => {
    const res = await toggleAdminCode(code, !currentStatus);
    if (res.success) {
      loadAdminData();
    } else {
      alert(res.error || 'Failed to toggle status.');
    }
  };

  // Handle Delete Code
  const handleDeleteCode = async (code: string) => {
    if (!window.confirm(`Are you sure you want to permanently revoke & delete code ${code}?`)) {
      return;
    }
    const res = await deleteAdminCode(code);
    if (res.success) {
      loadAdminData();
    } else {
      alert(res.error || 'Failed to delete code.');
    }
  };

  // Handle Copy
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // If unauthorized
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-rose-950/40 border border-rose-500/50 rounded-2xl text-center">
        <div className="text-5xl mb-4">⛔</div>
        <h2 className="text-2xl font-black text-rose-400 uppercase tracking-widest">
          ACCESS DENIED
        </h2>
        <p className="text-sm text-slate-300 mt-2">
          This portal is strictly reserved for the website owner. Normal player accounts do not possess administrative clearance.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Admin Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-mono font-bold rounded uppercase">
              👑 Owner Clearance
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Database Auth</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide mt-1">
            MARVEL ASCENSION ADMIN PORTAL
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time live economy monitor, database statistics, and dynamic promotional redeem code engine.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
        >
          <span>🔄</span>
          <span>{loading ? 'Syncing...' : 'Sync Live DB'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-950/70 border border-rose-500/50 rounded-xl text-rose-300 text-xs">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/80 border border-purple-500/20 rounded-xl">
            <div className="text-xs text-slate-400 font-bold uppercase">Total Players</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              👥 {stats.totalPlayers?.toLocaleString() || 0}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">
              ● {stats.onlinePlayers || 1} Online Now
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-amber-500/20 rounded-xl">
            <div className="text-xs text-slate-400 font-bold uppercase">Astra In Circulation</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              ✨ {(stats.totalAstraInCirculation || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across all player accounts</div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-cyan-500/20 rounded-xl">
            <div className="text-xs text-slate-400 font-bold uppercase">Total Matches</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1">
              ⚔️ {(stats.totalMatches || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">PvP, Ranked & Dungeon runs</div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-emerald-500/20 rounded-xl">
            <div className="text-xs text-slate-400 font-bold uppercase">Active Promo Codes</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              🎟️ {stats.totalRedeemCodes || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.totalCodeRedemptions || 0} Total Claims
            </div>
          </div>
        </div>
      )}

      {/* Main Split: Code Generator + Codes List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Code Generator Form */}
        <div className="p-6 bg-slate-900/90 border border-purple-500/30 rounded-2xl shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>🛠️</span>
              <span>Generate Live Redeem Code</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Newly created codes are saved to the live database immediately without redeployment.
            </p>
          </div>

          <form onSubmit={handleCreateCode} className="space-y-4">
            {/* Code string */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  10-Digit Code
                </label>
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-mono"
                >
                  ⚡ Auto-Generate
                </button>
              </div>
              <input
                type="text"
                maxLength={10}
                value={newCodeInput}
                onChange={(e) => setNewCodeInput(e.target.value.toUpperCase())}
                inputMode="numeric"
                placeholder="Leave blank for a secure random code"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-amber-300 uppercase tracking-widest placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Astra Reward */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Astra Reward Amount
              </label>
              <input
                type="number"
                min={0}
                max={1000000000}
                step={1}
                value={astraReward}
                onChange={(e) => setAstraReward(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400"
              />
              <div className="flex gap-2 mt-1.5">
                {[1000, 2500, 5000, 10000, 25000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAstraReward(val)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                      astraReward === val
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    +{val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reward Type</label>
                <select value={rewardType} onChange={e => setRewardType(e.target.value as typeof rewardType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400">
                  <option value="ASTRA">Coins / Astra</option>
                  <option value="CHARACTER">Specific Character</option>
                  <option value="SHARD">Category Shards</option>
                  <option value="CRATE">Crate</option>
                </select>
              </div>
              {rewardType === 'CHARACTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Character (350-character database)</label>
                  <select required value={characterId} onChange={e => setCharacterId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400">
                    <option value="">Select character…</option>
                    {ALL_CHARACTERS.map(character => <option key={character.id} value={character.id}>{character.name} ({character.grade})</option>)}
                  </select>
                </div>
              )}
              {rewardType === 'CRATE' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Crate Type</label>
                  <select value={crateType} onChange={e => setCrateType(e.target.value as typeof crateType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400">
                    <option value="CHARACTER_CRATE">Character Card Crate</option>
                    <option value="SHARD_CRATE">Shard Crate</option>
                  </select>
                  <select value={crateTier} onChange={e => setCrateTier(e.target.value as typeof crateTier)}
                    className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400">
                    <option value="RARE">Rare Crate</option>
                    <option value="EPIC">Epic Crate</option>
                    <option value="LEGENDARY">Legendary Crate</option>
                    <option value="MYTHIC">Mythic Crate</option>
                  </select>
                </div>
              )}
              {rewardType === 'SHARD' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Shard Category</label>
                  <select value={shardCategory} onChange={e => setShardCategory(e.target.value as typeof shardCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400">
                    <option value="RARE">Rare</option>
                    <option value="EPIC">Epic</option>
                    <option value="MYTHIC">Mythic</option>
                    <option value="HERO">Hero</option>
                    <option value="VILLAIN">Villain</option>
                    <option value="COSMIC">Cosmic Draft</option>
                  </select>
                </div>
              )}
            </div>

            {/* Max Uses */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Maximum Redemptions
              </label>
              <input
                type="number"
                min={1}
                max={100000}
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Initial Status</div>
                <div className="text-[11px] text-slate-400">
                  {isActive ? 'Available immediately' : 'Created as inactive'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {isActive ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>

            {/* Feedback */}
            {createFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  createFeedback.success
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                }`}
              >
                {createFeedback.msg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-purple-950/50 transition-all disabled:opacity-50"
            >
              {isCreating ? 'Saving to Database...' : '🚀 Publish Live Code'}
            </button>
          </form>
        </div>

        {/* Right: Codes Table & Action Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table Card */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>🎟️</span>
                <span>Active Redeem Codes ({codes.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Live Database Sync</span>
            </div>

            {codes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No redeem codes currently in database. Generate one on the left!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Reward</th>
                      <th className="p-3">Uses / Max</th>
                      <th className="p-3">Expiry</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {codes.map((c) => (
                      <tr key={c.code} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-bold text-amber-300 flex items-center gap-2">
                          <span>{c.code}</span>
                          <button
                            onClick={() => handleCopyCode(c.code)}
                            title="Copy code"
                            className="text-slate-500 hover:text-white text-xs"
                          >
                            {copiedCode === c.code ? '✓' : '📋'}
                          </button>
                        </td>
                        <td className="p-3 font-bold text-purple-300">
                          {c.rewardType === 'CHARACTER' ? `🦸 ${c.characterId}` : c.rewardType === 'CRATE' ? `📦 ${c.crateType}` : c.rewardType === 'SHARD' ? `🔷 ${c.rewardAmount} shards` : `✨ ${c.astraReward?.toLocaleString()} ASTRA`}
                        </td>
                        <td className="p-3 text-slate-400">
                          <span className={c.usedCount >= c.maxUses ? 'text-rose-400 font-bold' : ''}>
                            {c.usedCount}
                          </span>{' '}
                          / {c.maxUses}
                        </td>
                        <td className="p-3 text-slate-400">{c.expiresAt}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] rounded font-bold ${
                              c.isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleToggleCode(c.code, c.isActive)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-sans font-semibold border border-slate-700"
                          >
                            {c.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteCode(c.code)}
                            className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[10px] font-sans font-semibold border border-rose-800"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Log Card */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>📜</span>
              <span>Owner Audit Log</span>
            </h3>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-2">
              {actionLogs.length === 0 ? (
                <div className="text-slate-500 text-xs py-4 text-center">
                  No recorded admin actions yet.
                </div>
              ) : (
                actionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="text-amber-400 font-bold">[{log.action}]</span>{' '}
                      <span className="text-slate-300 font-sans">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

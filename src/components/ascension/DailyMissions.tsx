import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { CheckCircle, Clock, Sparkles, Target, Calendar, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const EVENT_LABELS: Record<string, string> = {
  battle_win: 'Win Battles',
  battle_play: 'Play Battles',
  ranked_play: 'Play Ranked',
  ranked_win: 'Win Ranked',
  dungeon_wave: 'Clear Dungeon Waves',
  dungeon_complete: 'Complete Dungeons',
  buy_char: 'Purchase Characters',
  open_crate: 'Open Crates',
  spin_wheel: 'Spin the Wheel',
  card_forge: 'Craft in Forge',
};

function MissionCard({ mission, onClaim, isClaiming }: { mission: any; onClaim: (id: string) => void; isClaiming: boolean }) {
  const progressPct = Math.min(100, Math.round((mission.progress / mission.target) * 100));
  const isCompleted = mission.progress >= mission.target;

  const rewardColors: Record<string, string> = {
    astra: 'text-cyan-400',
    cardShards: 'text-indigo-400',
    xp: 'text-green-400',
  };
  const rewardColor = rewardColors[mission.rewardType as string] || 'text-slate-300';

  const rewardIcons: Record<string, string> = {
    astra: '✨',
    cardShards: '🔷',
    xp: '⭐',
  };
  const rewardIcon = rewardIcons[mission.rewardType as string] || '🎁';

  return (
    <div className={`rounded-2xl border p-4 transition-all ${
      mission.isClaimed
        ? 'border-white/5 bg-white/2 opacity-50'
        : isCompleted
        ? 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
        : 'border-white/10 bg-[#0B0D1E]'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {mission.isClaimed ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : isCompleted ? (
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
            ) : (
              <Target className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
            <span className="font-heading font-black text-white text-sm truncate">{mission.title}</span>
          </div>
          <div className="text-xs text-slate-400 mb-3">{mission.description}</div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{EVENT_LABELS[mission.eventType] || mission.eventType}</span>
              <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                {mission.progress} / {mission.target}
              </span>
            </div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-slate-500 to-slate-400'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className={`text-sm font-black ${rewardColor}`}>
            {rewardIcon} {mission.rewardAmount.toLocaleString()}
          </div>
          {!mission.isClaimed && isCompleted && (
            <button
              onClick={() => onClaim(mission.missionId)}
              disabled={isClaiming}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer disabled:opacity-50"
            >
              {isClaiming ? '...' : 'Claim'}
            </button>
          )}
          {mission.isClaimed && (
            <span className="text-xs text-emerald-400 font-bold">Claimed ✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function DailyMissions() {
  const { user, getDailyMissions, claimDailyMission, getWeeklyChallenges, claimWeeklyChallenge } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const dailyMissions = user?.dailyMissions || [];
  const weeklyMissions = user?.weeklyMissions || [];

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    getDailyMissions();
    getWeeklyChallenges();
  }, []);

  const handleClaimDaily = async (missionId: string) => {
    setClaimingId(missionId);
    const data = await claimDailyMission(missionId);
    setClaimingId(null);
    if (data.success) {
      soundManager.playVictoryFanfare();
      const icon = data.rewardType === 'astra' ? '✨' : data.rewardType === 'cardShards' ? '🔷' : '⭐';
      showToast('success', `Mission claimed! +${data.rewardAmount?.toLocaleString()} ${icon}`);
    } else {
      soundManager.playAttackHit();
      showToast('error', data.error || 'Failed to claim.');
    }
  };

  const handleClaimWeekly = async (missionId: string) => {
    setClaimingId(missionId);
    const data = await claimWeeklyChallenge(missionId);
    setClaimingId(null);
    if (data.success) {
      soundManager.playVictoryFanfare();
      const icon = data.rewardType === 'astra' ? '✨' : data.rewardType === 'cardShards' ? '🔷' : '⭐';
      showToast('success', `Challenge claimed! +${data.rewardAmount?.toLocaleString()} ${icon}`);
    } else {
      soundManager.playAttackHit();
      showToast('error', data.error || 'Failed to claim.');
    }
  };

  // Progress counts
  const dailyCompleted = dailyMissions.filter(m => m.isClaimed).length;
  const weeklyCompleted = weeklyMissions.filter(m => m.isClaimed).length;

  // Time remaining until reset
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const hoursLeft = Math.floor((midnight.getTime() - now.getTime()) / 3600000);
  const minLeft = Math.floor(((midnight.getTime() - now.getTime()) % 3600000) / 60000);

  const dayOfWeek = now.getDay();
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
  const weekDaysLeft = daysUntilSunday;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl flex items-center gap-2 ${
          toastMsg.type === 'success' ? 'bg-emerald-900 border border-emerald-500 text-emerald-200' : 'bg-red-900 border border-red-500 text-red-200'
        }`}>
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#0D1A1A] to-[#0D1535] border border-cyan-500/20 overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Target className="w-6 h-6 text-cyan-400" /> Missions & Challenges
            </h1>
            <p className="text-slate-400 text-sm mt-1">Complete tasks to earn Astra, Card Shards, and XP</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-black text-cyan-400">{dailyCompleted}/{dailyMissions.length}</div>
              <div className="text-xs text-slate-500">Daily Done</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-purple-400">{weeklyCompleted}/{weeklyMissions.length}</div>
              <div className="text-xs text-slate-500">Weekly Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" /> Daily
            <span className="text-xs opacity-70">({hoursLeft}h {minLeft}m left)</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'weekly'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Weekly
            <span className="text-xs opacity-70">({weekDaysLeft}d left)</span>
          </span>
        </button>
      </div>

      {/* Missions */}
      <div className="space-y-3">
        {activeTab === 'daily' && (
          dailyMissions.length > 0 ? (
            dailyMissions.map(m => (
              <MissionCard
                key={m.missionId}
                mission={m}
                onClaim={handleClaimDaily}
                isClaiming={claimingId === m.missionId}
              />
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Loading daily missions...</p>
            </div>
          )
        )}

        {activeTab === 'weekly' && (
          weeklyMissions.length > 0 ? (
            weeklyMissions.map(m => (
              <MissionCard
                key={m.missionId}
                mission={m}
                onClaim={handleClaimWeekly}
                isClaiming={claimingId === m.missionId}
              />
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Loading weekly challenges...</p>
            </div>
          )
        )}
      </div>

      {/* Mission Tips */}
      <div className="rounded-2xl p-4 bg-[#0B0D1E] border border-white/5 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-400 mb-2">📖 How Missions Work</div>
        <p>• Daily missions refresh every midnight. Complete all 5 for bonus rewards!</p>
        <p>• Weekly challenges reset every Sunday. Higher rewards but harder targets.</p>
        <p>• Mission progress is tracked automatically as you play the game.</p>
        <p>• Unclaimed rewards expire when missions reset — claim them in time!</p>
      </div>
    </div>
  );
}

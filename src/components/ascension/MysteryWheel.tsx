import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { Sparkles, Zap, Gift, Star, ChevronRight, RotateCcw } from 'lucide-react';

const WHEEL_SEGMENTS = [
  { type: 'astra',      amount: 200,   label: '200 ASTRA',    color: '#06b6d4', emoji: '✨' },
  { type: 'astra',      amount: 500,   label: '500 ASTRA',    color: '#8b5cf6', emoji: '✨' },
  { type: 'astra',      amount: 1000,  label: '1K ASTRA',     color: '#f59e0b', emoji: '✨' },
  { type: 'astra',      amount: 2500,  label: '2.5K ASTRA',   color: '#ec4899', emoji: '✨' },
  { type: 'astra',      amount: 5000,  label: '5K ASTRA',     color: '#10b981', emoji: '✨' },
  { type: 'cardShards', amount: 25,    label: '25 SHARDS',    color: '#6366f1', emoji: '🔷' },
  { type: 'cardShards', amount: 75,    label: '75 SHARDS',    color: '#0ea5e9', emoji: '🔷' },
  { type: 'cardShards', amount: 150,   label: '150 SHARDS',   color: '#7c3aed', emoji: '🔷' },
  { type: 'xp',         amount: 500,   label: '500 XP',       color: '#22c55e', emoji: '⭐' },
  { type: 'xp',         amount: 1500,  label: '1.5K XP',      color: '#84cc16', emoji: '⭐' },
  { type: 'wheelSpin',  amount: 1,     label: '+1 SPIN',      color: '#f97316', emoji: '🎰' },
  { type: 'wheelSpin',  amount: 3,     label: '+3 SPINS',     color: '#ef4444', emoji: '🎰' },
];

export function MysteryWheel() {
  const { user, spinMysteryWheel } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const targetRotRef = useRef<number>(0);

  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0);
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntilReset(`${hours}h ${mins}m ${secs}s`);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const hasDailySpin = !!user && user.lastWheelSpinDate !== todayStr;
  const spins = (user?.wheelSpins ?? 0) + (hasDailySpin ? 1 : 0);
  const totalSpins = user?.totalWheelSpins ?? 0;

  // Draw wheel on canvas
  useEffect(() => {
    drawWheel(rotation);
  }, [rotation]);

  const drawWheel = (rot: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 10;
    const segCount = WHEEL_SEGMENTS.length;
    const segAngle = (2 * Math.PI) / segCount;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    WHEEL_SEGMENTS.forEach((seg, i) => {
      const startAngle = rot + i * segAngle;
      const endAngle = startAngle + segAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#000814';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(seg.label, radius - 8, 4);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#0f0a1e');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center icon
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎰', cx, cy);
  };

  const doSpin = async () => {
    if (isSpinning) return;
    if (spins <= 0) {
      setToastMsg('No spins available! Come back tomorrow for a free spin.');
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    setIsSpinning(true);
    setResult(null);
    soundManager.playClick();

    const data = await spinMysteryWheel();
    if (!data.success) {
      setToastMsg(data.error || 'Spin failed.');
      setTimeout(() => setToastMsg(null), 3000);
      setIsSpinning(false);
      return;
    }

    // Animate wheel to land on prize
    const prizeIdx = data.prizeIndex ?? 0;
    const segAngle = (2 * Math.PI) / WHEEL_SEGMENTS.length;
    const baseRotations = 5; // Full spins before landing
    const landAt = -(prizeIdx * segAngle + segAngle / 2); // pointer at top = -π/2, adjust
    const targetRot = rotation + baseRotations * 2 * Math.PI + landAt - rotation;
    targetRotRef.current = targetRot;

    const duration = 3500; // ms
    startTimeRef.current = performance.now();
    const startRot = rotation;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / duration);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      const currentRot = startRot + (targetRotRef.current - startRot) * ease;
      setRotation(currentRot);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(targetRotRef.current);
        setIsSpinning(false);
        setResult(data);
        soundManager.playVictoryFanfare();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const prize = result ? WHEEL_SEGMENTS[result.prizeIndex ?? 0] : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl bg-red-900 border border-red-500 text-red-200">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-[#1A0D2E] to-[#0D1535] border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.2)] overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-3">
              🎰 Mystery Wheel
            </h1>
            <p className="text-slate-400 text-sm mt-1">Spin to win Astra, Card Shards, XP, and bonus spins!</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase tracking-widest">Available Spins</div>
            <div className="text-4xl font-black text-orange-400">{spins}</div>
            <div className="text-xs text-slate-500">Total spun: {totalSpins}</div>
          </div>
        </div>
      </div>

      {/* Wheel + Spin */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Wheel Canvas */}
        <div className="relative flex-shrink-0">
          {/* Pointer */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
          </div>
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="rounded-full shadow-[0_0_50px_rgba(139,92,246,0.4)] border-4 border-purple-500/40"
          />
          {/* Glow ring */}
          {isSpinning && (
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping opacity-30" />
          )}
        </div>

        {/* Controls + Result */}
        <div className="flex-1 space-y-5">
          <button
            onClick={doSpin}
            disabled={isSpinning || spins <= 0}
            className={`w-full py-5 rounded-2xl text-xl font-black uppercase tracking-wider transition-all ${
              isSpinning
                ? 'bg-purple-800 text-white/60 cursor-not-allowed animate-pulse'
                : spins > 0
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center justify-center gap-3">
                <RotateCcw className="w-6 h-6 animate-spin" />
                Spinning...
              </span>
            ) : spins > 0 ? (
              `🎰 Spin! (${spins} left)`
            ) : (
              '🔒 No Spins — Come back tomorrow'
            )}
          </button>

          {/* Daily free spin notice */}
          {spins === 0 && (
            <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-950/70 to-slate-900 border border-purple-500/40 text-sm text-slate-300 text-center space-y-1">
              <div className="text-xs font-mono uppercase font-bold text-amber-400">
                🔒 Today's Daily Spin Used
              </div>
              <div className="text-xs text-slate-400">
                Next free spin resets in: <strong className="text-white font-mono">{timeUntilReset || 'Midnight UTC'}</strong>
              </div>
            </div>
          )}

          {/* Result */}
          {result && result.success && prize && (
            <div className="rounded-2xl p-5 border border-white/20 animate-fadeIn"
              style={{ background: `${prize.color}15`, borderColor: `${prize.color}40` }}>
              <div className="text-center space-y-2">
                <div className="text-5xl">{prize.emoji}</div>
                <div className="text-2xl font-heading font-black text-white">You Won!</div>
                <div className="text-xl font-bold" style={{ color: prize.color }}>{prize.label}</div>
                <div className="text-xs text-slate-400">
                  Remaining spins: {result.remainingSpins ?? 0}
                </div>
              </div>
            </div>
          )}

          {/* Prize List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Possible Prizes</div>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {WHEEL_SEGMENTS.map((seg, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                  style={{ background: `${seg.color}15`, border: `1px solid ${seg.color}30` }}>
                  <span className="text-sm">{seg.emoji}</span>
                  <span className="text-xs text-slate-300">{seg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How to get more spins */}
      <div className="rounded-2xl p-5 bg-[#0B0D1E] border border-white/5 space-y-2">
        <h3 className="text-sm font-heading font-black text-white uppercase tracking-wider">🎰 How to Get More Spins</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400">
          {[
            ['🌅 Daily Reset', '1 free spin every day'],
            ['🎰 Wheel Prize', 'Land on +1 or +3 SPIN'],
            ['🎯 Missions/Achievements', 'Spin rewards from tasks'],
          ].map(([icon, desc]) => (
            <div key={icon} className="flex items-center gap-2 p-2 rounded-lg bg-white/3">
              <span>{icon}</span><span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

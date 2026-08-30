import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundManager } from '../../audio/soundManager';
import { Shield, Lock, User, Key, X, Sparkles, Check, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

const AVATAR_OPTIONS = [
  '🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '⚡', '🛡️', '🕷️', '🦾', 
  '👑', '🔮', '🔥', '🏹', '🦅', '🪐', '🧪', '💎'
];

export function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: Props) {
  const { signin, signup, isLoading } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦸‍♂️');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    if (!cleanUser) {
      setError('Please enter your Commander username.');
      return;
    }

    if (cleanUser.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (tab === 'signup') {
      if (password.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setIsSubmitting(true);
    soundManager.playClick();

    if (tab === 'signup') {
      const res = await signup(cleanUser, password, selectedAvatar);
      setIsSubmitting(false);
      if (res.success) {
        soundManager.playVictory();
        onClose();
      } else {
        setError(res.error || 'Sign up failed.');
        soundManager.playAttackHit();
      }
    } else {
      const res = await signin(cleanUser, password);
      setIsSubmitting(false);
      if (res.success) {
        soundManager.playVictory();
        onClose();
      } else {
        setError(res.error || 'Invalid credentials.');
        soundManager.playAttackHit();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#141A2E] via-[#0D1220] to-[#060810] border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.35)] space-y-5 text-white">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F1A] rounded-[14px] flex items-center justify-center text-xl">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide uppercase">
              COMMANDER HQ
            </h2>
            <p className="text-xs text-cyan-400 font-mono">
              {tab === 'signin' ? 'Access your persistent profile & stats' : 'Create your verified Marvel account'}
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-xl bg-black/60 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setTab('signin');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'signin'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setTab('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-xs text-red-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Avatar Selection (Sign Up only) */}
          {tab === 'signup' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Choose Commander Avatar
              </label>
              <div className="grid grid-cols-8 gap-1.5 p-2 bg-black/50 border border-white/10 rounded-xl">
                {AVATAR_OPTIONS.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedAvatar(emoji);
                    }}
                    className={`h-8 rounded-lg flex items-center justify-center text-base transition-all cursor-pointer ${
                      selectedAvatar === emoji
                        ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110 shadow-glow-cyan'
                        : 'hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. DarkSenseify"
                maxLength={20}
                required
                className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl pl-9 pr-10 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {tab === 'signup' && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`w-full py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              tab === 'signin'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-cyan-500/25'
                : 'bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-red-500/25'
            }`}
          >
            {isSubmitting ? (
              <span>Connecting to Server...</span>
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In' : 'Create Account & Start'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security / Persistence Banner */}
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-slate-400 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Your Level, XP, Wins, Tournament Trophies, and Playtime are saved securely on the authoritative server.
          </span>
        </div>
      </div>
    </div>
  );
}

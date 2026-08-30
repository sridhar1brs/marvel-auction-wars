import React, { useState } from 'react';
import { useGameSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, Volume2, VolumeX, Sparkles, Eye, Shield, User, 
  LogOut, Save, X, RotateCcw, Check, AlertCircle, Sliders, Music, Zap
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

const MARVEL_AVATARS = [
  '🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '⚡', '🔥', '🛡️', '🤖', 
  '👑', '🌟', '🕷️', '🐺', '🔮', '🦾', '🏹', '🥋'
];

export function SettingsModal() {
  const { settings, isSettingsOpen, closeSettings, updateSettings, resetSettings } = useGameSettings();
  const { user, isAuthenticated, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'AUDIO' | 'GRAPHICS' | 'GAMEPLAY' | 'PROFILE'>('AUDIO');

  // Edit Profile States
  const [newUsername, setNewUsername] = useState(user?.displayName || user?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🦸‍♂️');
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsSavingProfile(true);
    setProfileMessage(null);

    const result = await updateProfile(newUsername.trim(), selectedAvatar);
    setIsSavingProfile(false);

    if (result.success) {
      soundManager.playVictory();
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMessage(null), 3000);
    } else {
      soundManager.playAttackHit();
      setProfileMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl bg-[#0C0E14] border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#1C1508] to-[#120E08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-white uppercase tracking-wider">
                GAME SETTINGS
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">
                Customize audio, visuals, and account preferences
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSettings}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Large Touch Targets for Mobile) */}
        <div className="flex border-b border-white/10 bg-black/40 p-1.5 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('AUDIO');
            }}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'AUDIO'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Sound</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('GRAPHICS');
            }}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'GRAPHICS'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Visuals</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('GAMEPLAY');
            }}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'GAMEPLAY'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Gameplay</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('PROFILE');
            }}
            className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'PROFILE'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-200 text-sm">
          
          {/* TAB 1: AUDIO & SOUND */}
          {activeTab === 'AUDIO' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Master Sound Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="space-y-0.5">
                  <div className="font-heading font-black text-white text-sm uppercase flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                    <span>MASTER SOUND</span>
                  </div>
                  <p className="text-xs text-slate-400">Toggle all in-game sound effects, music, and voices</p>
                </div>

                <button
                  type="button"
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer border ${
                    settings.soundEnabled ? 'bg-emerald-500 border-emerald-400' : 'bg-stone-800 border-stone-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Volume Sliders */}
              <div className="space-y-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                {/* Master Volume */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Master Volume</span>
                    </span>
                    <span className="text-amber-400 font-mono">{settings.masterVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.masterVolume}
                    onChange={e => updateSettings({ masterVolume: Number(e.target.value) })}
                    disabled={!settings.soundEnabled}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-900 rounded-lg"
                  />
                </div>

                {/* SFX Volume */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Sound Effects (SFX)</span>
                    </span>
                    <span className="text-yellow-400 font-mono">{settings.sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.sfxVolume}
                    onChange={e => updateSettings({ sfxVolume: Number(e.target.value) })}
                    disabled={!settings.soundEnabled}
                    className="w-full accent-yellow-400 cursor-pointer h-2 bg-stone-900 rounded-lg"
                  />
                </div>

                {/* Music Volume */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Music className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Background Music</span>
                    </span>
                    <span className="text-cyan-400 font-mono">{settings.musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.musicVolume}
                    onChange={e => updateSettings({ musicVolume: Number(e.target.value) })}
                    disabled={!settings.soundEnabled}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-stone-900 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISUALS & ANIMATIONS */}
          {activeTab === 'GRAPHICS' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Animations ON / OFF */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="space-y-0.5">
                  <div className="font-heading font-black text-white text-sm uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ANIMATIONS (ON / OFF)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Enable or disable particle bursts, holographic shine, and card flips
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer border ${
                    settings.animationsEnabled ? 'bg-amber-500 border-amber-400' : 'bg-stone-800 border-stone-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.animationsEnabled ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Screen Shake Effects */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="space-y-0.5">
                  <div className="font-heading font-black text-white text-sm uppercase flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>SCREEN SHAKE IMPACTS</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Camera shake when heavy strikes and mythic specials connect
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateSettings({ screenShakeEnabled: !settings.screenShakeEnabled })}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer border ${
                    settings.screenShakeEnabled ? 'bg-purple-500 border-purple-400' : 'bg-stone-800 border-stone-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.screenShakeEnabled ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="space-y-0.5">
                  <div className="font-heading font-black text-white text-sm uppercase flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>REDUCED MOTION</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Minimizes rapid UI transitions for motion sensitivity
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer border ${
                    settings.reducedMotion ? 'bg-cyan-500 border-cyan-400' : 'bg-stone-800 border-stone-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.reducedMotion ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: GAMEPLAY CONTROLS */}
          {activeTab === 'GAMEPLAY' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Confirm Discard Actions */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10">
                <div className="space-y-0.5">
                  <div className="font-heading font-black text-white text-sm uppercase flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>CONFIRM DISCARD ACTIONS</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Show confirmation modal before permanently discarding a card ($0 refund)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => updateSettings({ confirmDiscard: !settings.confirmDiscard })}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer border ${
                    settings.confirmDiscard ? 'bg-emerald-500 border-emerald-400' : 'bg-stone-800 border-stone-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.confirmDiscard ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reset All Settings Button */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    resetSettings();
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-slate-400 hover:text-white border border-white/10 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Settings to Default</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: PLAYER PROFILE & ACCOUNT */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-5 animate-fadeIn">
              {isAuthenticated && user ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  
                  {/* Status Notification */}
                  {profileMessage && (
                    <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                      profileMessage.type === 'success'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-red-950/80 border-red-500 text-red-300'
                    }`}>
                      {profileMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{profileMessage.text}</span>
                    </div>
                  )}

                  {/* Public Stats Overview Card */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-amber-950/80 border border-amber-500/40 rounded-2xl overflow-hidden flex items-center justify-center text-3xl shrink-0 bg-black">
                        {user.customAvatarUrl ? (
                          <img src={user.customAvatarUrl} alt={user.displayName || user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.avatar || '🦸‍♂️'}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">
                          Level {user.level} Commander
                        </span>
                        <h3 className="font-heading font-black text-white text-base truncate">
                          {user.displayName || user.username}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          {user.xp} Total XP • {user.playtimeFormatted} Playtime
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 font-bold block uppercase">
                        {user.wins}W - {user.losses}L
                      </span>
                      <span className="text-xs font-black text-white font-mono">
                        {user.winRate}% Win Rate
                      </span>
                    </div>
                  </div>

                  {/* Edit Username (Case-Insensitive Uniqueness Enforced) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-amber-300 uppercase tracking-wide">
                      Edit Username (Must be unique):
                    </label>
                    <input
                      type="text"
                      maxLength={24}
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 px-3.5 py-2 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-amber-400"
                      placeholder="Enter new unique username"
                    />
                  </div>

                  {/* Select Profile Avatar / Logo */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-amber-300 uppercase tracking-wide">
                      Choose Profile Avatar / Logo:
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {MARVEL_AVATARS.map(avatar => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          className={`p-2 rounded-xl border text-xl flex items-center justify-center transition-all cursor-pointer ${
                            selectedAvatar === avatar
                              ? 'bg-amber-500 border-amber-300 shadow-md scale-110'
                              : 'bg-black/40 border-white/10 hover:bg-stone-800'
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        logout();
                      }}
                      className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-heading font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                    </button>
                  </div>

                </form>
              ) : (
                <div className="p-6 text-center space-y-4 rounded-2xl bg-black/40 border border-white/10">
                  <User className="w-10 h-10 text-slate-500 mx-auto" />
                  <div>
                    <h3 className="font-heading font-black text-white text-base">GUEST COMMANDER</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Sign in or create a unique commander account to record permanent stats, level up, and customize your profile!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/60 flex justify-end">
          <button
            type="button"
            onClick={closeSettings}
            className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-heading font-black text-xs uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
}

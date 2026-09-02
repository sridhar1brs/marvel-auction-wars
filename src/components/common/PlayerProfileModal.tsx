import React, { useState, useRef } from 'react';
import { Player, PlayerProfile } from '../../types/game';
import { ALL_CHARACTERS } from '../../data/characters/index';
import { 
  Trophy, Award, Swords, Shield, Star, X, User, Zap, Flame, Crown, 
  Clock, Sparkles, LogOut, Skull, HeartHandshake, Compass, Layers, 
  Upload, Edit3, Check, Gift, Activity
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { useAuth, UserProfile } from '../../context/AuthContext';
import { getLevelFromXp, formatPlaytime } from '../../utils/progression';

interface Props {
  player?: Player | null;
  profile?: PlayerProfile | null;
  viewOnlyProfile?: any | null;
  isOpen?: boolean;
  onClose: () => void;
}

export function PlayerProfileModal({ player, profile: directProfile, viewOnlyProfile, isOpen = true, onClose }: Props) {
  const { user: authUser, logout, isAuthenticated, updateCustomAvatar, updateAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);
  const [isSelectingFavorite, setIsSelectingFavorite] = useState(false);
  const [favoriteHeroId, setFavoriteHeroId] = useState<string | undefined>(undefined);

  if (isOpen === false) return null;

  // Prefer viewOnlyProfile, then direct profile, then player.profile, then authUser if player matches, then fallback
  let profile: any;
  if (viewOnlyProfile) {
    profile = viewOnlyProfile;
  } else if (directProfile) {
    profile = directProfile;
  } else if (player?.profile) {
    profile = player.profile;
  } else if (authUser && (!player || player.id === authUser.id || player.name.toLowerCase() === authUser.username.toLowerCase())) {
    profile = authUser;
  } else {
    const safePlayer: Player = player || {
      id: 'guest',
      name: 'Guest Commander',
      avatar: '🦸‍♂️',
      money: 30,
      collection: [],
      isHost: false,
      isReady: false,
      isBot: false,
      level: 1,
      stats: { battlesWon: 0, moneySpent: 0, highestBid: 0 }
    };
    profile = {
      id: safePlayer.id,
      username: safePlayer.name,
      displayName: safePlayer.name,
      avatar: safePlayer.avatar || '🦸‍♂️',
      level: safePlayer.level || 1,
      xp: 0,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      charactersPurchased: safePlayer.collection?.length || 0,
      battlesWon: safePlayer.stats?.battlesWon || 0,
      mvpAwards: 0,
      tournamentWins: 0,
      playtimeSeconds: 0,
      playtimeFormatted: '0m',
      ascensionCoins: 0,
      rankedTier: 'BRONZE',
      rankedDivision: 3,
      rankedRating: 1000,
      currentWinStreak: 0,
      bestWinStreak: 0,
      totalDamageDealt: 0,
      bossesDefeated: 0,
      dungeonsCompleted: 0
    };
  }

  const levelInfo = getLevelFromXp(profile.xp || 0);
  const currentLevel = profile.level || levelInfo.level || 1;
  const currentLevelXp = profile.currentLevelXp ?? levelInfo.currentLevelXp;
  const xpForNextLevel = profile.xpForNextLevel ?? levelInfo.xpForNextLevel;
  const progressPercent = profile.progressPercent ?? levelInfo.progressPercent;
  const winRate = profile.matchesPlayed > 0 ? Math.round((profile.wins / profile.matchesPlayed) * 100) : 0;
  const playtime = profile.playtimeFormatted || formatPlaytime(profile.playtimeSeconds || 0);

  const activeFavId = favoriteHeroId ?? profile.favoriteCharacterId;
  const favoriteHero = activeFavId 
    ? ALL_CHARACTERS.find(c => c.id === activeFavId)
    : null;

  const isOwnProfile = authUser && (
    profile.id === authUser.id || 
    (profile.username && profile.username.toLowerCase() === authUser.username.toLowerCase())
  );

  const handleSelectFavoriteHero = async (charId: string) => {
    setFavoriteHeroId(charId);
    if (updateAvatar) {
      await updateAvatar(profile.avatar || '🦸‍♂️', charId);
      soundManager.playVictory();
    }
    setIsSelectingFavorite(false);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size exceeds 2MB limit.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCustomAvatarPreview(base64);
      if (updateCustomAvatar) {
        await updateCustomAvatar(base64);
        soundManager.playVictory();
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBio = async () => {
    if (updateCustomAvatar) {
      await updateCustomAvatar(undefined, bioInput);
      soundManager.playClick();
    }
    setIsEditingBio(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 animate-fadeIn select-none">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#141A2E] via-[#0D1222] to-[#070914] border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.4)] space-y-5 text-white">
        
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

        {/* Profile Header & Custom Avatar Upload */}
        <div className="flex items-center gap-3.5 sm:gap-4 border-b border-white/10 pb-4">
          <div className="relative shrink-0 group">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-cyan-400 shadow-cyan-500/30 overflow-hidden bg-black">
              {customAvatarPreview || profile.customAvatarUrl ? (
                <img
                  src={customAvatarPreview || profile.customAvatarUrl}
                  alt="Custom Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{profile.avatar || player?.avatar || '🦸‍♂️'}</span>
              )}
            </div>

            {/* Upload Button overlay for own profile */}
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                title="Upload Custom Profile Picture"
              >
                <Upload className="w-4 h-4 text-cyan-400 mb-0.5" />
                <span>Change</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileChange}
            />

            <div className="absolute -bottom-2 -right-1 bg-amber-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-200 shadow-md">
              LVL {currentLevel}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-wide truncate">
                {profile.displayName || profile.username || player?.name}
              </h2>
              {profile.rankedTier && (
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-purple-400 shadow-glow-cosmic">
                  {profile.rankedTier} {profile.rankedDivision || 1}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-400 font-mono mt-0.5">
              <span>COMMANDER</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">✨ {(profile.astra ?? profile.ascensionCoins ?? 0).toLocaleString()} ASTRA</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-400 text-purple-200 text-[10px] font-bold">
                {profile.rankedTier === 'ASCENDER'
                  ? '⚡ ASCENDER'
                  : !profile.isPlacementsCompleted || profile.rankedTier === 'UNRANKED'
                  ? 'UNRANKED'
                  : `${profile.rankedTier} ${profile.rankedDivision || ''}`} ({(profile.rankedRating ?? 0).toLocaleString()} MMR)
              </span>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-xs text-slate-300 italic mt-1 max-w-sm line-clamp-2">
                "{profile.bio}"
              </p>
            )}
          </div>
        </div>

        {/* XP Level & Progression Bar */}
        <div className="p-3.5 bg-black/60 border border-cyan-500/30 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-heading font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LEVEL {currentLevel} PROGRESSION</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold">
              {currentLevelXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP ({progressPercent}%)
            </span>
          </div>

          {/* Animated XP Bar */}
          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              style={{ width: `${Math.max(4, Math.min(100, progressPercent))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Total Career XP: {profile.xp?.toLocaleString() || 0}</span>
            <span>Next: Level {currentLevel + 1}</span>
          </div>
        </div>

        {/* Primary Career Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* 1. Wins */}
          <div className="bg-black/50 p-3 rounded-2xl border border-white/10 text-center">
            <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">VICTORIES</span>
            <span className="text-lg font-heading font-black text-amber-300">{profile.wins}</span>
          </div>

          {/* 2. Losses */}
          <div className="bg-black/50 p-3 rounded-2xl border border-white/10 text-center">
            <Skull className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">DEFEATS</span>
            <span className="text-lg font-heading font-black text-rose-300">{profile.losses}</span>
          </div>

          {/* 3. Win Rate */}
          <div className="bg-black/50 p-3 rounded-2xl border border-white/10 text-center">
            <Flame className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">WIN RATE</span>
            <span className="text-lg font-heading font-black text-emerald-400">{winRate}%</span>
          </div>

          {/* 4. Total Play Time */}
          <div className="bg-black/50 p-3 rounded-2xl border border-white/10 text-center">
            <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold block">PLAY TIME</span>
            <span className="text-base sm:text-lg font-heading font-black text-cyan-300 truncate block">
              {playtime}
            </span>
          </div>
        </div>

        {/* Ascension Multiverse Accolades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-center">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
            <span className="text-[9px] text-slate-400 block font-bold">WIN STREAK</span>
            <span className="font-heading font-black text-amber-300 text-sm">{profile.currentWinStreak || 0} (Best: {profile.bestWinStreak || 0})</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-center">
            <Award className="w-4 h-4 text-purple-400 mx-auto mb-0.5" />
            <span className="text-[9px] text-slate-400 block font-bold">MVP AWARDS</span>
            <span className="font-heading font-black text-purple-300 text-sm">{profile.mvpAwards || 0}</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-center">
            <Compass className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
            <span className="text-[9px] text-slate-400 block font-bold">DUNGEON PEAK</span>
            <span className="font-heading font-black text-emerald-300 text-sm">{profile.dungeonPeak || profile.dungeonMaxWave || 0} WAVES</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-center">
            <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-0.5" />
            <span className="text-[9px] text-slate-400 block font-bold">TOTAL DAMAGE</span>
            <span className="font-heading font-black text-cyan-300 text-sm">{(profile.totalDamageDealt || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Favourite Character Showcase */}
        {favoriteHero ? (
          <div className="bg-black/60 p-3 sm:p-3.5 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-cyan-400 shrink-0 bg-black">
                <img
                  src={`/images/characters/${favoriteHero.id}.jpg`}
                  alt={favoriteHero.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-widest block">
                  FAVOURITE CHARACTER
                </span>
                <h4 className="text-sm sm:text-base font-heading font-black text-white truncate">
                  {favoriteHero.name}
                </h4>
                <p className="text-[11px] text-slate-300 truncate">
                  {favoriteHero.grade} Grade • {favoriteHero.alignment} • Power {favoriteHero.overallPower}
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setIsSelectingFavorite(prev => !prev);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-heading font-black uppercase tracking-wider bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all cursor-pointer"
                >
                  {isSelectingFavorite ? 'Close' : 'Change'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFavoriteHero('')}
                  className="shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-heading font-black uppercase tracking-wider bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 transition-all cursor-pointer"
                  title="Remove Favourite"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-black/40 p-3.5 rounded-2xl border border-dashed border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-xl shrink-0">
                ⭐
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest block">
                  FAVOURITE CHARACTER
                </span>
                <p className="text-xs text-slate-300">
                  {isOwnProfile ? 'No favourite character selected.' : 'Commander has not selected a favourite character.'}
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsSelectingFavorite(prev => !prev);
                }}
                className="shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-heading font-black uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-black font-black shadow-glow-cyan transition-all cursor-pointer"
              >
                {isSelectingFavorite ? 'Close' : 'Select Character'}
              </button>
            )}
          </div>
        )}

        {/* Favorite Hero Picker Grid (when toggled open) */}
        {isOwnProfile && isSelectingFavorite && (
          <div className="p-3 bg-slate-950/90 rounded-2xl border border-cyan-500/40 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading font-black text-cyan-300 uppercase tracking-wide">
                Choose Favourite Character
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {authUser?.ownedCharacters?.length ? `${authUser.ownedCharacters.length} Owned` : 'All Characters'}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
              {(authUser?.ownedCharacters && authUser.ownedCharacters.length > 0
                ? ALL_CHARACTERS.filter(c => authUser.ownedCharacters.includes(c.id))
                : ALL_CHARACTERS.slice(0, 24)
              ).map(char => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => handleSelectFavoriteHero(char.id)}
                  className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                    (favoriteHeroId || profile.favoriteCharacterId) === char.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-glow-gold'
                      : 'bg-black/40 border-white/10 hover:border-cyan-400/60 text-slate-300'
                  }`}
                >
                  <img
                    src={`/images/characters/${char.id}.jpg`}
                    alt={char.name}
                    className="w-10 h-10 mx-auto rounded-lg object-cover mb-1"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div className="text-[10px] font-bold truncate text-white">{char.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bio Edit for own profile */}
        {isOwnProfile && (
          <div className="pt-2 border-t border-white/10">
            {isEditingBio ? (
              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={140}
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  placeholder="Enter commander bio..."
                  className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBio}
                    className="px-3 py-1 rounded-lg bg-cyan-500 text-black font-bold text-xs shadow-glow-cyan cursor-pointer"
                  >
                    Save Bio
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setBioInput(profile.bio || '');
                    setIsEditingBio(true);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{profile.bio ? 'Edit Commander Bio' : 'Add Commander Bio'}</span>
                </button>

                {logout && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

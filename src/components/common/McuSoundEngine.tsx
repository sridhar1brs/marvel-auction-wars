import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Play, Pause, Volume2, VolumeX, Music, ChevronDown, 
  SkipForward, SkipBack, Repeat, Disc, Sparkles
} from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export interface McuTrack {
  id: string;
  title: string;
  artist: string;
  movie: string;
  audioUrl: string;
}

export const MCU_TRACKS: McuTrack[] = [
  { id: 'avengers-theme', title: 'The Avengers Main Theme', artist: 'Alan Silvestri', movie: 'The Avengers (2012)', audioUrl: '/audio/marvel-music/avengers_theme.webm' },
  { id: 'portals-endgame', title: 'Portals (Endgame Assemble)', artist: 'Alan Silvestri', movie: 'Avengers: Endgame (2019)', audioUrl: '/audio/marvel-music/portals_endgame.webm' },
  { id: 'iron-man-driving', title: 'Driving with the Top Down', artist: 'Ramin Djawadi', movie: 'Iron Man (2008)', audioUrl: '/audio/marvel-music/iron_man_driving.webm' },
  { id: 'ragnarok-immigrant', title: 'Ragnarok Arena Battle', artist: 'Mark Mothersbaugh / Led Zeppelin', movie: 'Thor: Ragnarok (2017)', audioUrl: '/audio/marvel-music/thor_ragnarok.webm' },
  { id: 'wakanda-origins', title: 'Wakanda Royal Suite', artist: 'Ludwig Göransson', movie: 'Black Panther (2018)', audioUrl: '/audio/marvel-music/black_panther_wakanda.webm' },
  { id: 'cap-march', title: 'Captain America March', artist: 'Alan Silvestri', movie: 'Captain America: The First Avenger (2011)', audioUrl: '/audio/marvel-music/captain_america_march.webm' },
  { id: 'guardians-theme', title: 'Guardians of the Galaxy Suite', artist: 'Tyler Bates', movie: 'Guardians of the Galaxy (2014)', audioUrl: '/audio/marvel-music/guardians_suite.webm' },
  { id: 'doctor-strange', title: 'Master of the Mystic', artist: 'Michael Giacchino', movie: 'Doctor Strange (2016)', audioUrl: '/audio/marvel-music/doctor_strange_mystic.webm' },
  { id: 'spiderman-nowayhome', title: 'Shield of Pain & Web-Swing', artist: 'Michael Giacchino', movie: 'Spider-Man: No Way Home (2021)', audioUrl: '/audio/marvel-music/spiderman_nowayhome.webm' },
  { id: 'loki-tva', title: 'TVA Sacred Timeline Theme', artist: 'Natalie Holt', movie: 'Loki (2021–2023)', audioUrl: '/audio/marvel-music/loki_tva.webm' },
  { id: 'xmen-97', title: 'X-Men Animated Main Theme', artist: 'The Newton Brothers', movie: "X-Men '97 (2024)", audioUrl: '/audio/marvel-music/xmen_97.webm' },
  { id: 'infinity-war-forge', title: 'Forge of Nidavellir', artist: 'Alan Silvestri', movie: 'Avengers: Infinity War (2018)', audioUrl: '/audio/marvel-music/infinity_war_forge.webm' },
  { id: 'deadpool-maximum', title: 'Maximum Effort Clash', artist: 'Rob Simonsen / Junkie XL', movie: 'Deadpool & Wolverine (2024)', audioUrl: '/audio/marvel-music/deadpool_wolverine.webm' },
  { id: 'daredevil-theme', title: 'Hell’s Kitchen Theme', artist: 'John Paesano', movie: 'Daredevil: Born Again', audioUrl: '/audio/marvel-music/daredevil_theme.webm' },
  { id: 'what-if-multiverse', title: 'The Watcher Multi-Verse Suite', artist: 'Laura Karpman', movie: "Marvel's What If...? (2021–2024)", audioUrl: '/audio/marvel-music/what_if_multiverse.webm' }
];

export function McuSoundEngine() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.55);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTrack = MCU_TRACKS[currentIndex];

  // Initialize Audio Element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.volume = volume;
      audioRef.current = audio;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0);
      };

      const handleEnded = () => {
        if (isLooping) {
          audio.currentTime = 0;
          audio.play().catch(console.warn);
        } else {
          // Play Next Track automatically
          setCurrentIndex(prev => (prev + 1) % MCU_TRACKS.length);
        }
      };

      const handleError = (e: any) => {
        console.warn('[MCU Audio Engine Error]', e);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, []);

  // Update track source when currentIndex changes
  useEffect(() => {
    if (audioRef.current && activeTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = activeTrack.audioUrl;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('[MCU Audio Playback Notice]', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentIndex]);

  // Volume & Mute Updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlay = () => {
    soundManager.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || !audioRef.current.src.includes(activeTrack.audioUrl)) {
        audioRef.current.src = activeTrack.audioUrl;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('[MCU Audio Playback Error]', err);
      });
    }
  };

  const selectTrackByIndex = (idx: number) => {
    soundManager.playClick();
    if (idx === currentIndex) {
      togglePlay();
      return;
    }
    setCurrentIndex(idx);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = MCU_TRACKS[idx].audioUrl;
      audioRef.current.play().catch(console.warn);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    const nextIdx = (currentIndex + 1) % MCU_TRACKS.length;
    selectTrackByIndex(nextIdx);
  };

  const handlePrev = () => {
    soundManager.playClick();
    const prevIdx = (currentIndex - 1 + MCU_TRACKS.length) % MCU_TRACKS.length;
    selectTrackByIndex(prevIdx);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Trigger Pill in Navbar */}
      <button
        type="button"
        onClick={() => {
          soundManager.playClick();
          setIsOpen(prev => !prev);
        }}
        className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all border shadow-sm flex-shrink-0 whitespace-nowrap cursor-pointer select-none ${
          isPlaying
            ? 'bg-gradient-to-r from-red-950 via-cyan-950 to-blue-950 text-cyan-200 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.5)] animate-pulse'
            : 'bg-[#0D1624]/90 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 hover:text-white'
        }`}
        title="MCU Sound Engine - 15 Famous Marvel Soundtracks"
      >
        <Radio className={`w-3.5 h-3.5 flex-shrink-0 ${isPlaying ? 'text-cyan-300 animate-spin' : 'text-cyan-400'}`} />
        <span className="text-[11px] sm:text-xs tracking-wider uppercase whitespace-nowrap flex-shrink-0">
          {isPlaying ? activeTrack.title : '((•)) MCU SOUND ENGINE'}
        </span>
        <ChevronDown className={`w-3 h-3 text-cyan-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 15-Track Audio Player Dropdown */}
      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[#080D1A]/98 border-2 border-cyan-500/60 shadow-[0_0_45px_rgba(6,182,212,0.45)] backdrop-blur-2xl z-50 p-3.5 space-y-3 animate-fadeIn"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} />
              <div>
                <span className="font-heading font-black text-xs text-white uppercase tracking-wider block">
                  MCU SOUND ENGINE
                </span>
                <span className="text-[9px] text-cyan-300/80 font-mono block">
                  15 Iconic Original Soundtracks
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-[10px] text-cyan-300 font-mono">
              {currentIndex + 1} / {MCU_TRACKS.length}
            </span>
          </div>

          {/* Active Track Card & Controls */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900/90 via-cyan-950/40 to-slate-950 border border-cyan-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{activeTrack.title}</span>
                </div>
                <div className="text-[10px] text-cyan-300/90 truncate font-mono">
                  {activeTrack.artist} • {activeTrack.movie}
                </div>
              </div>

              {/* Animated Wave Equalizer when playing */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-4 flex-shrink-0">
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-3"></span>
                  <span className="w-1 bg-cyan-300 rounded-full animate-[bounce_0.8s_infinite_200ms] h-4"></span>
                  <span className="w-1 bg-cyan-500 rounded-full animate-[bounce_0.5s_infinite_50ms] h-2.5"></span>
                  <span className="w-1 bg-cyan-300 rounded-full animate-[bounce_0.7s_infinite_300ms] h-4"></span>
                </div>
              )}
            </div>

            {/* Time Seek Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Player Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setIsLooping(prev => !prev)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLooping ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                }`}
                title={isLooping ? 'Looping Current Song' : 'Auto-Next Enabled'}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className={`p-2.5 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-900/50' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-900/50'
                  }`}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider & Mute */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMuted(prev => !prev)}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-14 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* 15 Soundtracks Playlist Scrollable List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {MCU_TRACKS.map((track, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => selectTrackByIndex(idx)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className={`text-[10px] font-mono font-bold w-4 text-center ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {isActive && isPlaying ? (
                        <Play className="w-3 h-3 text-cyan-400 fill-cyan-400 inline" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-cyan-200 font-black' : 'text-slate-200'}`}>
                        {track.title}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {track.artist} • {track.movie}
                      </div>
                    </div>
                  </div>

                  {isActive && isPlaying && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 font-bold border border-cyan-400/50 flex-shrink-0 animate-pulse">
                      PLAYING
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

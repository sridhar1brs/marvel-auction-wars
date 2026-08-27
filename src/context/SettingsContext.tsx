import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { soundManager } from '../audio/soundManager';

export interface GameSettingsPreferences {
  animationsEnabled: boolean;
  soundEnabled: boolean;
  masterVolume: number; // 0 - 100
  sfxVolume: number; // 0 - 100
  musicVolume: number; // 0 - 100
  screenShakeEnabled: boolean;
  confirmDiscard: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: GameSettingsPreferences = {
  animationsEnabled: true,
  soundEnabled: true,
  masterVolume: 80,
  sfxVolume: 90,
  musicVolume: 70,
  screenShakeEnabled: true,
  confirmDiscard: true,
  reducedMotion: false,
};

const STORAGE_KEY = 'marvel_settings_v1';

interface SettingsContextType {
  settings: GameSettingsPreferences;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  updateSettings: (partial: Partial<GameSettingsPreferences>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettingsPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply settings to audio engine and DOM whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore quota error
    }

    // Sync sound engine
    soundManager.setSoundEnabled(settings.soundEnabled);

    // Apply reduced motion or animations class to document root
    if (!settings.animationsEnabled || settings.reducedMotion) {
      document.documentElement.classList.add('reduce-animations');
    } else {
      document.documentElement.classList.remove('reduce-animations');
    }
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<GameSettingsPreferences>) => {
    setSettings(prev => ({
      ...prev,
      ...partial,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const openSettings = useCallback(() => {
    soundManager.playClick();
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    soundManager.playClick();
    setIsSettingsOpen(false);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isSettingsOpen,
        openSettings,
        closeSettings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useGameSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within a SettingsProvider');
  }
  return context;
}

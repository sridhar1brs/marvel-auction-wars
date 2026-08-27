// Server-side XP and Level Progression System (Levels 1 to 100+)

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
}

export function getXpRequiredForNextLevel(level: number): number {
  if (level < 1) return 100;
  return Math.max(100, Math.floor(100 * Math.pow(level, 1.35)));
}

export function getLevelFromXp(totalXp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(totalXp || 0));
  let level = 1;
  let remainingXp = safeXp;

  while (true) {
    const requiredForNext = getXpRequiredForNextLevel(level);
    if (remainingXp < requiredForNext) {
      const progressPercent = Math.min(100, Math.max(0, Math.round((remainingXp / requiredForNext) * 100)));
      return {
        level,
        currentLevelXp: remainingXp,
        xpForNextLevel: requiredForNext,
        progressPercent,
        totalXp: safeXp
      };
    }
    remainingXp -= requiredForNext;
    level++;
    if (level >= 1000) {
      return {
        level: 1000,
        currentLevelXp: remainingXp,
        xpForNextLevel: getXpRequiredForNextLevel(1000),
        progressPercent: 100,
        totalXp: safeXp
      };
    }
  }
}

export interface MatchXpParams {
  isWin: boolean;
  matchType?: 'classic' | 'tournament' | 'dungeon' | 'sandbox' | 'chaos';
  battlesWon?: number;
  charactersPurchased?: number;
  isTournamentChampion?: boolean;
  isMvp?: boolean;
  dungeonWavesCleared?: number;
  isBossWave?: boolean;
  durationSeconds?: number;
}

export interface XpBreakdown {
  total: number;
  reasons: { label: string; xp: number }[];
}

export function calculateMatchXp(params: MatchXpParams): XpBreakdown {
  const reasons: { label: string; xp: number }[] = [];

  const duration = params.durationSeconds ?? 60;
  if (duration < 15) {
    return {
      total: 10,
      reasons: [{ label: 'Quick Skirmish Participation', xp: 10 }]
    };
  }

  if (params.isWin) {
    reasons.push({ label: 'Match Victory', xp: 250 });
  } else {
    reasons.push({ label: 'Match Participation', xp: 75 });
  }

  if (params.isTournamentChampion) {
    reasons.push({ label: 'Tournament Champion 🏆', xp: 500 });
  }

  if (params.isMvp) {
    reasons.push({ label: 'MVP Performance ⭐', xp: 150 });
  }

  if (params.battlesWon && params.battlesWon > 0) {
    const duelXp = params.battlesWon * 30;
    reasons.push({ label: `${params.battlesWon}x Battle Duels Won`, xp: duelXp });
  }

  if (params.charactersPurchased && params.charactersPurchased > 0) {
    const auctionXp = Math.min(200, params.charactersPurchased * 40);
    reasons.push({ label: `${params.charactersPurchased}x Heroes Drafted`, xp: auctionXp });
  }

  if (params.dungeonWavesCleared && params.dungeonWavesCleared > 0) {
    const waveXp = params.dungeonWavesCleared * 35;
    reasons.push({ label: `${params.dungeonWavesCleared}x Dungeon Waves Cleared`, xp: waveXp });
  }

  if (params.isBossWave) {
    reasons.push({ label: 'Ancient Boss Defeated 👑', xp: 200 });
  }

  const total = reasons.reduce((sum, r) => sum + r.xp, 0);
  return { total, reasons };
}

export function formatPlaytime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${Math.max(1, minutes)}m`;
}

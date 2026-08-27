// Shared XP and Level Progression System (Levels 1 to 100+)

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
}

/**
 * Calculates the exact XP required to advance from Level N to Level N + 1.
 * Non-linear progressive scaling:
 * - Level 1 -> 2: 100 XP (~1 match)
 * - Level 2 -> 3: 255 XP
 * - Level 5 -> 6: 880 XP
 * - Level 10 -> 11: 2,240 XP
 * - Level 25 -> 26: 7,720 XP
 * - Level 50 -> 51: 19,650 XP
 * - Level 100 -> 101: 50,000 XP
 */
export function getXpRequiredForNextLevel(level: number): number {
  if (level < 1) return 100;
  return Math.max(100, Math.floor(100 * Math.pow(level, 1.35)));
}

/**
 * Derives current level and XP progress from total accumulated XP.
 */
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
    // Safety clamp for level 1000
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

/**
 * Standard XP Awards across game modes:
 */
export interface XpBreakdown {
  total: number;
  reasons: { label: string; xp: number }[];
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

export function calculateMatchXp(params: MatchXpParams): XpBreakdown {
  const reasons: { label: string; xp: number }[] = [];

  // Minimum duration check to prevent instant quit farming
  const duration = params.durationSeconds ?? 60;
  if (duration < 15) {
    return {
      total: 10,
      reasons: [{ label: 'Quick Skirmish Participation', xp: 10 }]
    };
  }

  // Base Match XP
  if (params.isWin) {
    reasons.push({ label: 'Match Victory', xp: 250 });
  } else {
    reasons.push({ label: 'Match Participation', xp: 75 });
  }

  // Tournament Championship
  if (params.isTournamentChampion) {
    reasons.push({ label: 'Tournament Champion 🏆', xp: 500 });
  }

  // MVP Award
  if (params.isMvp) {
    reasons.push({ label: 'MVP Performance ⭐', xp: 150 });
  }

  // Individual Duels Won
  if (params.battlesWon && params.battlesWon > 0) {
    const duelXp = params.battlesWon * 30;
    reasons.push({ label: `${params.battlesWon}x Battle Duels Won`, xp: duelXp });
  }

  // Auction Heroes Acquired
  if (params.charactersPurchased && params.charactersPurchased > 0) {
    const auctionXp = Math.min(200, params.charactersPurchased * 40);
    reasons.push({ label: `${params.charactersPurchased}x Heroes Drafted`, xp: auctionXp });
  }

  // Dungeon Waves
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

/**
 * Format total playtime in seconds to human-friendly string (e.g., "42h 18m" or "45m")
 */
export function formatPlaytime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${Math.max(1, minutes)}m`;
}

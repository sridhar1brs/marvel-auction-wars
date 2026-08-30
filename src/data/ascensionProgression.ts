/**
 * Server and client shared progression definitions.
 *
 * Rewards are data, rather than UI-only values, so the API can validate every
 * claim without trusting values supplied by a browser.
 */
export type BattlePassRewardType =
  | 'COINS'
  | 'SHARD_CRATE'
  | 'CHARACTER_CRATE';

export interface BattlePassReward {
  level: number;
  rewardType: BattlePassRewardType;
  amount: number;
  label: string;
  icon: string;
}

export const BATTLE_PASS_LEVELS = 100;
export const BATTLE_PASS_XP_PER_LEVEL = 1000;

export function getBattlePassLevelForXp(xp: number): number {
  return Math.min(BATTLE_PASS_LEVELS, Math.max(1, Math.floor(Math.max(0, xp) / BATTLE_PASS_XP_PER_LEVEL) + 1));
}

export function getBattlePassXpInLevel(xp: number): number {
  return Math.max(0, Math.floor(Math.max(0, xp) % BATTLE_PASS_XP_PER_LEVEL));
}

export function getBattlePassReward(level: number): BattlePassReward {
  const safeLevel = Math.min(BATTLE_PASS_LEVELS, Math.max(1, Math.floor(level)));
  if (safeLevel % 25 === 0) {
    return {
      level: safeLevel,
      rewardType: 'CHARACTER_CRATE',
      amount: 1,
      label: 'Character Card Crate',
      icon: '🃏',
    };
  }
  if (safeLevel % 5 === 0) {
    return {
      level: safeLevel,
      rewardType: 'SHARD_CRATE',
      amount: 1,
      label: 'Random Shard Crate',
      icon: '📦',
    };
  }
  const amount = 100 + safeLevel * 15;
  return {
    level: safeLevel,
    rewardType: 'COINS',
    amount,
    label: `${amount.toLocaleString()} Coins`,
    icon: '🪙',
  };
}

export const BATTLE_PASS_REWARDS: BattlePassReward[] = Array.from(
  { length: BATTLE_PASS_LEVELS },
  (_, index) => getBattlePassReward(index + 1),
);

export interface RankDefinition {
  id: string;
  label: string;
  tier: string;
  division: number;
  requiredRating: number;
}

const RANK_TIERS: Array<{ tier: string; divisions: number }> = [
  { tier: 'BRONZE', divisions: 5 },
  { tier: 'SILVER', divisions: 5 },
  { tier: 'GOLD', divisions: 5 },
  { tier: 'PLATINUM', divisions: 5 },
  { tier: 'VIBRANIUM', divisions: 5 },
  { tier: 'COSMIC', divisions: 3 },
];

export const RANK_DEFINITIONS: RankDefinition[] = RANK_TIERS.flatMap(({ tier, divisions }, tierIndex) =>
  Array.from({ length: divisions }, (_, index) => {
    const division = index + 1;
    const roman = ['I', 'II', 'III', 'IV', 'V'][index] || String(division);
    return {
      id: `${tier}_${division}`,
      label: `${tier[0]}${tier.slice(1).toLowerCase()} ${roman}`,
      tier,
      division,
      requiredRating: tierIndex * 500 + index * Math.floor(500 / divisions),
    };
  }),
);

export const ASCENDER_RANK: RankDefinition = {
  id: 'ASCENDER',
  label: 'Ascender',
  tier: 'ASCENDER',
  division: 0,
  requiredRating: 4500,
};

export const ALL_RANK_DEFINITIONS = [...RANK_DEFINITIONS, ASCENDER_RANK];

export function getRankLabel(tier: string, division: number): string {
  if (tier === 'ASCENDER') return 'Ascender';
  const rank = RANK_DEFINITIONS.find(item => item.tier === tier && item.division === division);
  return rank?.label || tier;
}

export const CHARACTER_SHARD_CATEGORIES = ['C', 'B', 'A', 'MYTHIC', 'HERO', 'VILLAIN'] as const;
export type CharacterShardCategory = (typeof CHARACTER_SHARD_CATEGORIES)[number];

export function getCharacterShardCategory(characterOrGrade: string | { grade?: string; alignment?: string }): CharacterShardCategory {
  if (typeof characterOrGrade !== 'string') {
    const alignment = (characterOrGrade?.alignment || '').toString().toUpperCase();
    const grade = (characterOrGrade?.grade || 'C').toString().toUpperCase();

    if (alignment === 'HERO' || alignment === 'ANTI-HERO') return 'HERO';
    if (alignment === 'VILLAIN') return 'VILLAIN';

    if (grade === 'MYTHIC') return 'MYTHIC';
    if (grade === 'A') return 'A';
    if (grade === 'B') return 'B';
    return 'C';
  }

  const normalized = characterOrGrade.toUpperCase();
  if (normalized === 'MYTHIC') return 'MYTHIC';
  if (normalized === 'A') return 'A';
  if (normalized === 'B') return 'B';
  if (normalized === 'HERO') return 'HERO';
  if (normalized === 'VILLAIN') return 'VILLAIN';
  return 'C';
}

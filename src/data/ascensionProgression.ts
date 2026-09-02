/**
 * Server and client shared progression definitions.
 *
 * Rewards are data, rather than UI-only values, so the API can validate every
 * claim without trusting values supplied by a browser.
 */
export type BattlePassRewardType =
  | 'COINS'
  | 'SHARD_CRATE'
  | 'CHARACTER_CRATE'
  | 'RARE_CRATE'
  | 'EPIC_CRATE'
  | 'LEGENDARY_CRATE'
  | 'MYTHIC_CRATE'
  | 'TOKEN_SHARD_CRATE';

export interface BattlePassReward {
  level: number;
  rewardType: BattlePassRewardType;
  amount: number;
  label: string;
  icon: string;
  crateImage?: string;
}

export const BATTLE_PASS_LEVELS = 150;
export const BATTLE_PASS_XP_PER_LEVEL = 1000;

export function getBattlePassLevelForXp(xp: number): number {
  return Math.min(BATTLE_PASS_LEVELS, Math.max(1, Math.floor(Math.max(0, xp) / BATTLE_PASS_XP_PER_LEVEL) + 1));
}

export function getBattlePassXpInLevel(xp: number): number {
  return Math.max(0, Math.floor(Math.max(0, xp) % BATTLE_PASS_XP_PER_LEVEL));
}

export function getBattlePassReward(level: number): BattlePassReward {
  const safeLevel = Math.min(BATTLE_PASS_LEVELS, Math.max(1, Math.floor(level)));

  // Level 150 Grand Finale Ultimate Milestone
  if (safeLevel === 150) {
    return {
      level: 150,
      rewardType: 'MYTHIC_CRATE',
      amount: 1,
      label: '⚡ Grandmaster Mythic Apex Crate',
      icon: '🌌',
      crateImage: '/images/crates/mythic_crate.png',
    };
  }

  // Every 25th level is a Major Milestone
  if (safeLevel % 25 === 0) {
    if (safeLevel === 100) {
      return {
        level: safeLevel,
        rewardType: 'MYTHIC_CRATE',
        amount: 1,
        label: 'Mythic Relic Crate',
        icon: '🌌',
        crateImage: '/images/crates/mythic_crate.png',
      };
    } else if (safeLevel % 50 === 0) {
      return {
        level: safeLevel,
        rewardType: 'LEGENDARY_CRATE',
        amount: 1,
        label: 'Legendary Crate',
        icon: '👑',
        crateImage: '/images/crates/legendary_crate.png',
      };
    } else {
      return {
        level: safeLevel,
        rewardType: 'EPIC_CRATE',
        amount: 1,
        label: 'Epic Tier Crate',
        icon: '💎',
        crateImage: '/images/crates/epic_crate.png',
      };
    }
  }

  // Every 5th level is a Special Reward
  if (safeLevel % 5 === 0) {
    if (safeLevel % 10 === 0) {
      return {
        level: safeLevel,
        rewardType: 'TOKEN_SHARD_CRATE',
        amount: 1,
        label: 'Shard Chamber Crate',
        icon: '⚡',
        crateImage: '/images/crates/shard_crate.png',
      };
    } else {
      return {
        level: safeLevel,
        rewardType: 'RARE_CRATE',
        amount: 1,
        label: 'Rare Crate',
        icon: '📦',
        crateImage: '/images/crates/rare_crate.png',
      };
    }
  }

  // Normal levels: progressively increasing Astra Coins (Level 1: 1,000, Level 2: 1,100, Level 3: 1,200...)
  const amount = 1000 + (safeLevel - 1) * 100;
  return {
    level: safeLevel,
    rewardType: 'COINS',
    amount,
    label: `${amount.toLocaleString()} Astra`,
    icon: '✨',
  };
}

export const BATTLE_PASS_REWARDS: BattlePassReward[] = Array.from(
  { length: BATTLE_PASS_LEVELS },
  (_, index) => getBattlePassReward(index + 1),
);

export interface RankedTierReward {
  label: string;
  astra: number;
  cardShards: number;
  cratesCount?: number;
  crateType?: 'SHARD_CRATE' | 'CHARACTER_CRATE';
  tokenCategory?: CharacterShardCategory;
  tokensCount?: number;
  exclusiveTitle?: string;
  badgeIcon: string;
}

export interface RankDefinition {
  id: string;
  label: string;
  tier: string;
  division: number;
  requiredRating: number;
  reward: RankedTierReward;
}

const RANK_TIERS: Array<{ 
  tier: string; 
  divisions: number; 
  baseRating: number; 
  rewards: Array<(div: number) => RankedTierReward> 
}> = [
  { 
    tier: 'BRONZE', 
    divisions: 5, 
    baseRating: 0,
    rewards: [
      () => ({ label: '500 Coins + 25 Shards', astra: 500, cardShards: 25, badgeIcon: '🥉' }),
      () => ({ label: '700 Coins + 35 Shards', astra: 700, cardShards: 35, badgeIcon: '🥉' }),
      () => ({ label: '900 Coins + 50 Shards + 1x Shard Crate', astra: 900, cardShards: 50, cratesCount: 1, crateType: 'SHARD_CRATE', badgeIcon: '📦' }),
      () => ({ label: '1,100 Coins + 65 Shards + 1x Shard Crate', astra: 1100, cardShards: 65, cratesCount: 1, crateType: 'SHARD_CRATE', badgeIcon: '📦' }),
      () => ({ label: '1,500 Coins + 100 Shards + 1x Crate + Bronze Challenger Badge', astra: 1500, cardShards: 100, cratesCount: 1, crateType: 'SHARD_CRATE', exclusiveTitle: 'Bronze Challenger', badgeIcon: '🛡️' }),
    ]
  },
  { 
    tier: 'SILVER', 
    divisions: 5, 
    baseRating: 500,
    rewards: [
      () => ({ label: '1,800 Coins + 120 Shards + 1x Shard Crate', astra: 1800, cardShards: 120, cratesCount: 1, crateType: 'SHARD_CRATE', badgeIcon: '🥈' }),
      () => ({ label: '2,100 Coins + 150 Shards + 1x Shard Crate', astra: 2100, cardShards: 150, cratesCount: 1, crateType: 'SHARD_CRATE', badgeIcon: '🥈' }),
      () => ({ label: '2,500 Coins + 180 Shards + 1x Character Crate', astra: 2500, cardShards: 180, cratesCount: 1, crateType: 'CHARACTER_CRATE', badgeIcon: '🃏' }),
      () => ({ label: '2,900 Coins + 220 Shards + 1x Character Crate', astra: 2900, cardShards: 220, cratesCount: 1, crateType: 'CHARACTER_CRATE', badgeIcon: '🃏' }),
      () => ({ label: '3,500 Coins + 300 Shards + 1x Character Crate + Silver Guardian Title', astra: 3500, cardShards: 300, cratesCount: 1, crateType: 'CHARACTER_CRATE', exclusiveTitle: 'Silver Guardian', badgeIcon: '⚔️' }),
    ]
  },
  { 
    tier: 'GOLD', 
    divisions: 5, 
    baseRating: 1000,
    rewards: [
      () => ({ label: '4,000 Coins + 350 Shards + 1x Character Crate', astra: 4000, cardShards: 350, cratesCount: 1, crateType: 'CHARACTER_CRATE', badgeIcon: '🥇' }),
      () => ({ label: '4,500 Coins + 400 Shards + 1x Character Crate', astra: 4500, cardShards: 400, cratesCount: 1, crateType: 'CHARACTER_CRATE', badgeIcon: '🥇' }),
      () => ({ label: '5,200 Coins + 450 Shards + 1x Rare Token', astra: 5200, cardShards: 450, tokenCategory: 'B', tokensCount: 1, badgeIcon: '🔷' }),
      () => ({ label: '6,000 Coins + 500 Shards + 1x Rare Token + 1x Crate', astra: 6000, cardShards: 500, tokenCategory: 'B', tokensCount: 1, cratesCount: 1, crateType: 'CHARACTER_CRATE', badgeIcon: '🔷' }),
      () => ({ label: '7,500 Coins + 600 Shards + 1x Rare Token + Gold Champion Title', astra: 7500, cardShards: 600, tokenCategory: 'B', tokensCount: 1, exclusiveTitle: 'Gold Champion', badgeIcon: '🏆' }),
    ]
  },
  { 
    tier: 'PLATINUM', 
    divisions: 5, 
    baseRating: 1500,
    rewards: [
      () => ({ label: '8,500 Coins + 700 Shards + 1x Character Crate', astra: 8500, cardShards: 700, cratesCount: 1, crateType: 'CHARACTER_CRATE', badgeIcon: '💎' }),
      () => ({ label: '10,000 Coins + 800 Shards + 1x Character Crate', astra: 10000, cardShards: 800, cratesCount: 1, crateType: 'CHARACTER_CRATE', badgeIcon: '💎' }),
      () => ({ label: '11,500 Coins + 900 Shards + 1x Epic Token', astra: 11500, cardShards: 900, tokenCategory: 'A', tokensCount: 1, badgeIcon: '💜' }),
      () => ({ label: '13,000 Coins + 1,000 Shards + 1x Epic Token + 2x Crates', astra: 13000, cardShards: 1000, tokenCategory: 'A', tokensCount: 1, cratesCount: 2, crateType: 'CHARACTER_CRATE', badgeIcon: '💜' }),
      () => ({ label: '15,000 Coins + 1,200 Shards + 1x Epic Token + Platinum Warlord Title', astra: 15000, cardShards: 1200, tokenCategory: 'A', tokensCount: 1, exclusiveTitle: 'Platinum Warlord', badgeIcon: '👑' }),
    ]
  },
  { 
    tier: 'VIBRANIUM', 
    divisions: 5, 
    baseRating: 2000,
    rewards: [
      () => ({ label: '17,000 Coins + 1,400 Shards + 2x Character Crates', astra: 17000, cardShards: 1400, cratesCount: 2, crateType: 'CHARACTER_CRATE', badgeIcon: '💠' }),
      () => ({ label: '19,000 Coins + 1,600 Shards + 1x Epic Token', astra: 19000, cardShards: 1600, tokenCategory: 'A', tokensCount: 1, badgeIcon: '💠' }),
      () => ({ label: '21,000 Coins + 1,800 Shards + 2x Epic Tokens', astra: 21000, cardShards: 1800, tokenCategory: 'A', tokensCount: 2, badgeIcon: '💠' }),
      () => ({ label: '23,500 Coins + 2,000 Shards + 2x Epic Tokens + 2x Crates', astra: 23500, cardShards: 2000, tokenCategory: 'A', tokensCount: 2, cratesCount: 2, crateType: 'CHARACTER_CRATE', badgeIcon: '💠' }),
      () => ({ label: '26,000 Coins + 2,500 Shards + 2x Epic Tokens + Vibranium Titan Title', astra: 26000, cardShards: 2500, tokenCategory: 'A', tokensCount: 2, exclusiveTitle: 'Vibranium Titan', badgeIcon: '💠' }),
    ]
  },
  { 
    tier: 'COSMIC', 
    divisions: 3, 
    baseRating: 2500,
    rewards: [
      () => ({ label: '30,000 Coins + 3,000 Shards + 1x Mythic Token + 3x Crates', astra: 30000, cardShards: 3000, tokenCategory: 'MYTHIC', tokensCount: 1, cratesCount: 3, crateType: 'CHARACTER_CRATE', badgeIcon: '🪐' }),
      () => ({ label: '35,000 Coins + 3,500 Shards + 1x Mythic Token + 4x Crates', astra: 35000, cardShards: 3500, tokenCategory: 'MYTHIC', tokensCount: 1, cratesCount: 4, crateType: 'CHARACTER_CRATE', badgeIcon: '🪐' }),
      () => ({ label: '40,000 Coins + 4,000 Shards + 2x Mythic Tokens + Cosmic Sovereign Title', astra: 40000, cardShards: 4000, tokenCategory: 'MYTHIC', tokensCount: 2, exclusiveTitle: 'Cosmic Sovereign', badgeIcon: '🌌' }),
    ]
  },
];

export const RANK_DEFINITIONS: RankDefinition[] = RANK_TIERS.flatMap(({ tier, divisions, baseRating, rewards }, tierIndex) =>
  Array.from({ length: divisions }, (_, index) => {
    const division = index + 1;
    const roman = ['I', 'II', 'III', 'IV', 'V'][index] || String(division);
    const rewardFn = rewards[index] || rewards[rewards.length - 1];
    return {
      id: `${tier}_${division}`,
      label: `${tier[0]}${tier.slice(1).toLowerCase()} ${roman}`,
      tier,
      division,
      requiredRating: tierIndex * 500 + index * Math.floor(500 / divisions),
      reward: rewardFn(division),
    };
  }),
);

export const ASCENDER_RANK: RankDefinition = {
  id: 'ASCENDER',
  label: 'Ascender',
  tier: 'ASCENDER',
  division: 0,
  requiredRating: 4500,
  reward: {
    label: '250,000 Coins + 10,000 Shards + 3x Mythic Tokens + 10x Crates + ⚡ ASCENDER SUPREME Title',
    astra: 250000,
    cardShards: 10000,
    tokenCategory: 'MYTHIC',
    tokensCount: 3,
    cratesCount: 10,
    crateType: 'CHARACTER_CRATE',
    exclusiveTitle: '⚡ ASCENDER SUPREME',
    badgeIcon: '⚡',
  },
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

import { ArtifactItem } from '../types/game';

export const MARVEL_ARTIFACTS: ArtifactItem[] = [
  // $1 Tier
  {
    id: 'art-001-1',
    name: 'Tactical Strobe Flash',
    cost: 1,
    icon: '✨',
    description: 'High-lumen disorienting tactical burst. Grants +1 tactical initiative power on clash.',
    bonusPower: 1,
    effectType: 'stat_boost',
  },
  // $2 Tier
  {
    id: 'art-002-2',
    name: 'S.H.I.E.L.D. Combat Adrenaline',
    cost: 2,
    icon: '💉',
    description: 'Bio-chemical combat stimulant providing instant reflexes and +2 battle power.',
    bonusPower: 2,
    effectType: 'stat_boost',
  },
  // $3 Tier
  {
    id: 'art-003-3',
    name: 'Vibranium Throwing Daggers',
    cost: 3,
    icon: '🗡️',
    description: 'Razor-sharp Wakandan throwing blades. Inflicts +3 armor-piercing kinetic damage.',
    bonusPower: 3,
    effectType: 'stat_boost',
  },
  // $4 Tier
  {
    id: 'art-004-4',
    name: 'Pym Shrink Particles',
    cost: 4,
    icon: '🧪',
    description: 'Subatomic particle vials. Shrinks the opponent hero\'s total power by -4 for the duel.',
    bonusPower: 4,
    effectType: 'shrink_enemy',
  },
  // $5 Tier
  {
    id: 'art-005-5',
    name: 'Electro Web-Shooters',
    cost: 5,
    icon: '🕸️',
    description: 'High-tensile electrified webbing. Ensnare the enemy, reducing enemy speed and roll by -5.',
    bonusPower: 5,
    effectType: 'speed_slow',
  },
  // $6 Tier
  {
    id: 'art-006-6',
    name: 'Cloak of Levitation',
    cost: 6,
    icon: '🧣',
    description: 'Sentient mystic relic granting autonomous flight, acrobatic deflection, and +5 evasion power.',
    bonusPower: 5,
    effectType: 'speed_evasion',
  },
  // $7 Tier
  {
    id: 'art-007-7',
    name: 'Eye of Agamotto',
    cost: 7,
    icon: '👁️',
    description: 'Mystic talisman holding the Time Stone. Grants precognitive tactical superiority and +6 combat power.',
    bonusPower: 6,
    effectType: 'stat_boost',
  },
  // $8 Tier
  {
    id: 'art-008-8',
    name: 'Vibranium Shield',
    cost: 8,
    icon: '🛡️',
    description: 'Forged from pure Wakandan Vibranium. Absorbs kinetic energy and negates lethal damage differentials.',
    bonusPower: 6,
    effectType: 'shield_negate',
  },
  // $9 Tier
  {
    id: 'art-009-9',
    name: 'Ten Rings of Shang-Chi',
    cost: 9,
    icon: '💍',
    description: 'Ancient celestial rings granting matter manipulation, kinetic shockwaves, and +7 energy power.',
    bonusPower: 7,
    effectType: 'lightning_strike',
  },
  // $10 Tier
  {
    id: 'art-010-10',
    name: 'Mjolnir (Hammer of Thor)',
    cost: 10,
    icon: '⚡',
    description: 'Forged in the heart of a dying star. Strikes the enemy with +7 crackling thunderbolt damage.',
    bonusPower: 7,
    effectType: 'lightning_strike',
  },
  // $11 Tier
  {
    id: 'art-011-11',
    name: 'The Darkhold (Book of Sins)',
    cost: 11,
    icon: '📖',
    description: 'Ancient tome of dark chaos magic. Drains 25 HP from the opponent and restores 15 HP to your hero.',
    bonusPower: 8,
    effectType: 'life_drain',
  },
  // $12 Tier
  {
    id: 'art-012-12',
    name: 'Cosmic Cube (Tesseract)',
    cost: 12,
    icon: '🧊',
    description: 'Reality-altering containment vessel. Allows one complete re-roll of any battle clash roll with +8 power.',
    bonusPower: 8,
    effectType: 'reroll',
  },
  // $13 Tier
  {
    id: 'art-013-13',
    name: 'All-Black the Necrosword',
    cost: 13,
    icon: '⚔️',
    description: 'Forged by Knull from the primordial void. Slices through Titan defenses dealing +9 lethal damage.',
    bonusPower: 9,
    effectType: 'lethal_strike',
  },
  // $14 Tier (Revive Potion)
  {
    id: 'art-revive-001',
    name: 'Phoenix Resurrection Elixir',
    cost: 14,
    icon: '🧪',
    description: 'Infused with the eternal flame of the Phoenix. Instantly revives a fainted hero back to battle with 60% Max HP!',
    bonusPower: 5,
    effectType: 'revive_hero',
  },
  // $15 Tier
  {
    id: 'art-015-15',
    name: 'Infinity Gauntlet',
    cost: 15,
    icon: '💎',
    description: 'Channels all 6 Infinity Stones. Grants a 50% chance to instantly double your total battle roll power!',
    bonusPower: 12,
    effectType: 'double_roll',
  },
  // $16 Tier
  {
    id: 'art-016-16',
    name: 'Nega-Bands of the Kree',
    cost: 16,
    icon: '💫',
    description: 'Photonic dimensional gauntlets. Converts incoming mental and physical energy into +13 radiant power.',
    bonusPower: 13,
    effectType: 'all_stats',
  },
  // $17 Tier
  {
    id: 'art-017-17',
    name: 'Twilight Sword of Surtur',
    cost: 17,
    icon: '🔥',
    description: 'The Doom of Asgard. Bathes the arena in apocalyptic hellfire, dealing +14 unblockable damage.',
    bonusPower: 14,
    effectType: 'lethal_strike',
  },
  // $18 Tier
  {
    id: 'art-018-18',
    name: 'Heart of the Universe',
    cost: 18,
    icon: '🌌',
    description: 'The supreme multiversal energy nexus. Grants unconditional cosmic dominance and +15 battle power.',
    bonusPower: 15,
    effectType: 'cosmic_supremacy',
  },
  // $19 Tier
  {
    id: 'art-019-19',
    name: 'Ultimate Nullifier',
    cost: 19,
    icon: '💣',
    description: 'The universe’s most dreaded weapon. Erases opposing shields and delivers +16 absolute destructive force.',
    bonusPower: 16,
    effectType: 'cosmic_supremacy',
  },
  // $20 Tier
  {
    id: 'art-020-20',
    name: 'Astral Regulator',
    cost: 20,
    icon: '👑',
    description: 'Beyond-Infinity regulator. Absorbs the cosmic pantheon to deliver +18 supreme battle power.',
    bonusPower: 18,
    effectType: 'cosmic_supremacy',
  },
  // Additional Classic Relics
  {
    id: 'art-021',
    name: 'Extremis Nanotech Armor',
    cost: 8,
    icon: '🦾',
    description: 'Bio-electronic nanotechnology that reinforces hero cellular structure with +6 durability power.',
    bonusPower: 6,
    effectType: 'stat_boost',
  },
  {
    id: 'art-022',
    name: 'Crimson Gem of Cyttorak',
    cost: 10,
    icon: '🔴',
    description: 'Bound to the Juggernaut deity. Grants an unstoppable momentum shield that blocks 35 incoming damage.',
    bonusPower: 7,
    effectType: 'invulnerable',
  },
  {
    id: 'art-023',
    name: 'Casket of Ancient Winters',
    cost: 10,
    icon: '❄️',
    description: 'Frost Giant relic containing the fury of Jotunheim. Freezes the enemy, locking their special ability.',
    bonusPower: 7,
    effectType: 'freeze',
  },
  {
    id: 'art-024',
    name: 'Quantum Tunnel GPS Device',
    cost: 10,
    icon: '⏳',
    description: 'Hank Pym & Tony Stark time-space navigator. If your hero takes fatal damage, rewinds the round once.',
    bonusPower: 6,
    effectType: 'undo_round',
  }
];

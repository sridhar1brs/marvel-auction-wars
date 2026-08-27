import { ArtifactItem } from '../types/game';

export const MARVEL_ARTIFACTS: ArtifactItem[] = [
  // ==========================================
  // 🌟 1–10: COMMON & UNCOMMON TIER RELICS
  // ==========================================
  {
    id: 'art-001',
    name: 'Super Soldier Serum Vial',
    cost: 1,
    astraCost: 500,
    rarity: 'COMMON',
    icon: '🧪',
    description: 'Concentrated Vita-Ray enhanced formula. Boosts hero baseline physical attributes and grants +3 Battle Power.',
    bonusPower: 3,
    statModifiers: { power: 3, hp: 20, defense: 2, speed: 2 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-002',
    name: 'Tactical Strobe Flashbang',
    cost: 1,
    astraCost: 500,
    rarity: 'COMMON',
    icon: '✨',
    description: 'High-lumen disorienting tactical burst. Blinds the enemy, granting speed initiative and +2 Combat Strike.',
    bonusPower: 2,
    statModifiers: { power: 2, hp: 10, defense: 1, speed: 5 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-003',
    name: 'S.H.I.E.L.D. Combat Stimulant',
    cost: 2,
    astraCost: 750,
    rarity: 'COMMON',
    icon: '💉',
    description: 'Adrenaline-regulating micro-stimulant. Grants instant neural reflexes and +3 combat power.',
    bonusPower: 3,
    statModifiers: { power: 3, hp: 25, defense: 2, speed: 4 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-004',
    name: 'Vibranium Throwing Daggers',
    cost: 3,
    astraCost: 1000,
    rarity: 'UNCOMMON',
    icon: '🗡️',
    description: 'Forged from pure Wakandan Great Mound vibranium. Pierces enemy armor with +4 kinetic damage.',
    bonusPower: 4,
    statModifiers: { power: 4, hp: 20, defense: 3, speed: 3 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-005',
    name: 'Pym Particle Micro-Vials',
    cost: 4,
    astraCost: 1250,
    rarity: 'UNCOMMON',
    icon: '🔬',
    description: 'Subatomic particle regulator. Shrinks the opponent hero, reducing their total power by -5.',
    bonusPower: 5,
    statModifiers: { power: 5, hp: 20, defense: 3, speed: 4 },
    effectType: 'shrink_enemy'
  },
  {
    id: 'art-006',
    name: 'Electro-Magnetic Web-Shooters',
    cost: 5,
    astraCost: 1500,
    rarity: 'UNCOMMON',
    icon: '🕸️',
    description: 'Peter Parker\'s high-voltage web fluid. Ensnarez the opponent, slowing their attack speed.',
    bonusPower: 5,
    statModifiers: { power: 5, hp: 25, defense: 4, speed: 6 },
    effectType: 'speed_slow'
  },
  {
    id: 'art-007',
    name: 'Heart-Shaped Herb Elixir',
    cost: 6,
    astraCost: 1750,
    rarity: 'UNCOMMON',
    icon: '🍷',
    description: 'Sacred Wakandan elixir blessed by the Panther Goddess Bast. Grants +60 HP regenerative surge.',
    bonusPower: 6,
    statModifiers: { power: 6, hp: 60, defense: 5, speed: 4 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-008',
    name: 'Stark Arc Reactor Prototype',
    cost: 7,
    astraCost: 2000,
    rarity: 'UNCOMMON',
    icon: '🔋',
    description: 'Miniaturized clean fusion reactor. Overcharges hero energy systems with +7 bonus power.',
    bonusPower: 7,
    statModifiers: { power: 7, hp: 40, defense: 5, speed: 5 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-009',
    name: 'Adamantium Knuckle Spikes',
    cost: 8,
    astraCost: 2250,
    rarity: 'UNCOMMON',
    icon: '🥊',
    description: 'Indestructible metal alloy implants. Guaranteed critical laceration on physical contact.',
    bonusPower: 8,
    statModifiers: { power: 8, hp: 35, defense: 6, speed: 3 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-010',
    name: 'Asgardian Mead of Vitality',
    cost: 9,
    astraCost: 2500,
    rarity: 'UNCOMMON',
    icon: '🍺',
    description: 'Brewed in the golden halls of Valhalla. Heals 50 HP and grants unbreakable morale.',
    bonusPower: 8,
    statModifiers: { power: 8, hp: 50, defense: 6, speed: 4 },
    effectType: 'stat_boost'
  },

  // ==========================================
  // 🔷 11–20: RARE TIER RELICS
  // ==========================================
  {
    id: 'art-011',
    name: 'Captain America\'s Vibranium Shield',
    cost: 10,
    astraCost: 3500,
    rarity: 'RARE',
    icon: '🛡️',
    description: 'The iconic disc made of proto-adamantium and vibranium. Absorbs all kinetic impact and negates critical hits.',
    bonusPower: 10,
    statModifiers: { power: 10, hp: 75, defense: 15, speed: 5 },
    effectType: 'shield_negate'
  },
  {
    id: 'art-012',
    name: 'Hawkeye\'s Trick Arrow Quiver',
    cost: 10,
    astraCost: 3500,
    rarity: 'RARE',
    icon: '🏹',
    description: 'Contains explosive, EMP, and grappling arrows. Grants versatile range advantage in clash.',
    bonusPower: 10,
    statModifiers: { power: 10, hp: 45, defense: 8, speed: 10 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-013',
    name: 'Black Widow\'s Gauntlet Stingers',
    cost: 11,
    astraCost: 3800,
    rarity: 'RARE',
    icon: '⚡',
    description: 'Wrist electro-shock projectors discharging 30,000 volts to paralyze and pierce armor.',
    bonusPower: 11,
    statModifiers: { power: 11, hp: 50, defense: 8, speed: 9 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-014',
    name: 'Falcon\'s EXO-7 Redwing Drone',
    cost: 12,
    astraCost: 4000,
    rarity: 'RARE',
    icon: '🦅',
    description: 'Autonomous aerial reconnaissance and assault drone. Scans opponent weak points.',
    bonusPower: 12,
    statModifiers: { power: 12, hp: 55, defense: 9, speed: 11 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-015',
    name: 'Kree Nega-Bands Replica',
    cost: 13,
    astraCost: 4200,
    rarity: 'RARE',
    icon: '💍',
    description: 'Ancient Kree wristbands channeling negative zone quantum energy into concussive blasts.',
    bonusPower: 13,
    statModifiers: { power: 13, hp: 60, defense: 10, speed: 7 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-016',
    name: 'Nova Corps Centurion Helmet',
    cost: 14,
    astraCost: 4500,
    rarity: 'RARE',
    icon: '🪖',
    description: 'Direct link to the Xandarian Worldmind. Enhances tactical calculations and gravitational control.',
    bonusPower: 14,
    statModifiers: { power: 14, hp: 65, defense: 11, speed: 8 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-017',
    name: 'Extremis Nanotech Infusion',
    cost: 15,
    astraCost: 4800,
    rarity: 'RARE',
    icon: '🧬',
    description: 'Cybernetic bio-hack rewriting neural pathways. Grants rapid tissue regeneration and heat generation.',
    bonusPower: 15,
    statModifiers: { power: 15, hp: 80, defense: 10, speed: 6 },
    effectType: 'life_drain'
  },
  {
    id: 'art-018',
    name: 'Yondu\'s Yaka Arrow & Whistle Crest',
    cost: 15,
    astraCost: 5000,
    rarity: 'RARE',
    icon: '🎵',
    description: 'Centaurian sound-sensitive flying needle. Curves around defenses to strike lethally.',
    bonusPower: 15,
    statModifiers: { power: 15, hp: 50, defense: 8, speed: 14 },
    effectType: 'lethal_strike'
  },
  {
    id: 'art-019',
    name: 'Gorgon\'s Seismic Boots',
    cost: 16,
    astraCost: 5200,
    rarity: 'RARE',
    icon: '👢',
    description: 'Inhuman royal hoof armor. Stomps create localized 8.0 magnitude tectonic shockwaves.',
    bonusPower: 16,
    statModifiers: { power: 16, hp: 70, defense: 12, speed: 4 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-020',
    name: 'Sling Ring of Kamar-Taj',
    cost: 16,
    astraCost: 5500,
    rarity: 'RARE',
    icon: '🌀',
    description: 'Mystic brass ring opening portals across the multiverse. Evasively dodges enemy fatal strikes.',
    bonusPower: 16,
    statModifiers: { power: 16, hp: 60, defense: 10, speed: 12 },
    effectType: 'speed_evasion'
  },

  // ==========================================
  // 💜 21–35: EPIC TIER RELICS
  // ==========================================
  {
    id: 'art-021',
    name: 'Cloak of Levitation',
    cost: 17,
    astraCost: 6500,
    rarity: 'EPIC',
    icon: '🧣',
    description: 'Sentient mystical cloak worn by the Sorcerer Supreme. Flies, shields, and parries incoming damage.',
    bonusPower: 17,
    statModifiers: { power: 17, hp: 85, defense: 14, speed: 12 },
    effectType: 'speed_evasion'
  },
  {
    id: 'art-022',
    name: 'Bloodstone Talisman',
    cost: 18,
    astraCost: 7000,
    rarity: 'EPIC',
    icon: '🩸',
    description: 'Cursed gem fragment of the Helix Bloodstone. Siphons 40% of damage dealt back into commander health.',
    bonusPower: 18,
    statModifiers: { power: 18, hp: 90, defense: 12, speed: 8 },
    effectType: 'life_drain'
  },
  {
    id: 'art-023',
    name: 'Ten Rings of Shang-Chi',
    cost: 18,
    astraCost: 7500,
    rarity: 'EPIC',
    icon: '⭕',
    description: 'Millennia-old extraterrestrial bracelets emitting raw kinetic and energy projectiles with supreme longevity.',
    bonusPower: 18,
    statModifiers: { power: 18, hp: 100, defense: 16, speed: 10 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-024',
    name: 'Gungnir — Spear of Odin',
    cost: 19,
    astraCost: 8000,
    rarity: 'EPIC',
    icon: '🔱',
    description: 'Forged by Dwarves in Uru metal. Inscribed with sacred runes, never missing its intended target.',
    bonusPower: 19,
    statModifiers: { power: 19, hp: 95, defense: 15, speed: 9 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-025',
    name: 'Norn Stones of Karnilla',
    cost: 20,
    astraCost: 8500,
    rarity: 'EPIC',
    icon: '💎',
    description: 'Asgardian mystic catalysts. Allows one complete reroll of a disastrous combat turn.',
    bonusPower: 20,
    statModifiers: { power: 20, hp: 90, defense: 14, speed: 11 },
    effectType: 'reroll'
  },
  {
    id: 'art-026',
    name: 'Crimson Gem of Cyttorak',
    cost: 20,
    astraCost: 9000,
    rarity: 'EPIC',
    icon: '🔴',
    description: 'Channels the boundless destructive momentum of Cyttorak. Unstoppable physical powerhouse bonus.',
    bonusPower: 20,
    statModifiers: { power: 20, hp: 120, defense: 22, speed: 4 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-027',
    name: 'Dragonfang Sword of the Valkyrie',
    cost: 21,
    astraCost: 9500,
    rarity: 'EPIC',
    icon: '⚔️',
    description: 'Carved from an extra-dimensional dragon tooth. Absorbs magical energy on impact.',
    bonusPower: 21,
    statModifiers: { power: 21, hp: 90, defense: 15, speed: 11 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-028',
    name: 'Mandarin\'s Ten Makluan Rings',
    cost: 21,
    astraCost: 10000,
    rarity: 'EPIC',
    icon: '💍',
    description: 'Alien rings containing the trapped essences of dead space dragons. Commands ice, fire, and matter.',
    bonusPower: 21,
    statModifiers: { power: 21, hp: 105, defense: 16, speed: 10 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-029',
    name: 'Wand of Watoomb',
    cost: 22,
    astraCost: 10500,
    rarity: 'EPIC',
    icon: '🪄',
    description: 'Legendary talisman with two demonic heads. Absorbs mystic attacks and redirects them as offensive lightning.',
    bonusPower: 22,
    statModifiers: { power: 22, hp: 95, defense: 18, speed: 9 },
    effectType: 'lightning_strike'
  },
  {
    id: 'art-030',
    name: 'Casket of Ancient Winters',
    cost: 22,
    astraCost: 11000,
    rarity: 'EPIC',
    icon: '❄️',
    description: 'Frost Giant relic containing the fathomless fury of a thousand freezing winters. Freezes enemy actions.',
    bonusPower: 22,
    statModifiers: { power: 22, hp: 110, defense: 20, speed: 6 },
    effectType: 'freeze'
  },
  {
    id: 'art-031',
    name: 'Ebony Blade of the Black Knight',
    cost: 23,
    astraCost: 11500,
    rarity: 'EPIC',
    icon: '🗡️',
    description: 'Forged by Merlin from the Starstone meteorite. Cuts through all magical barriers, immune to curses.',
    bonusPower: 23,
    statModifiers: { power: 23, hp: 100, defense: 17, speed: 10 },
    effectType: 'shield_negate'
  },
  {
    id: 'art-032',
    name: 'Quantum Bands of Quasar',
    cost: 23,
    astraCost: 12000,
    rarity: 'EPIC',
    icon: '💫',
    description: 'Channel infinite energy from the Quantum Zone. Crafts solid-light constructs and forcefields.',
    bonusPower: 23,
    statModifiers: { power: 23, hp: 115, defense: 20, speed: 12 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-033',
    name: 'Eye of Agamotto',
    cost: 24,
    astraCost: 13000,
    rarity: 'EPIC',
    icon: '👁️',
    description: 'The all-revealing amulet of the First Sorcerer Supreme. Disperses all illusions and grants precognition.',
    bonusPower: 24,
    statModifiers: { power: 24, hp: 120, defense: 22, speed: 14 },
    effectType: 'double_roll'
  },
  {
    id: 'art-034',
    name: 'Mjolnir — Hammer of Thor',
    cost: 24,
    astraCost: 14000,
    rarity: 'EPIC',
    icon: '🔨',
    description: 'Forged in the heart of a dying star. Channels God of Thunder lightning strikes into the target.',
    bonusPower: 24,
    statModifiers: { power: 24, hp: 130, defense: 22, speed: 11 },
    effectType: 'lightning_strike'
  },
  {
    id: 'art-035',
    name: 'Stormbreaker — The King\'s Weapon',
    cost: 25,
    astraCost: 15000,
    rarity: 'EPIC',
    icon: '🪓',
    description: 'Heavy battleaxe forged on Nidavellir. Summons the Bifrost to cleave dimensions and annihilate armies.',
    bonusPower: 25,
    statModifiers: { power: 25, hp: 140, defense: 24, speed: 10 },
    effectType: 'stat_boost'
  },

  // ==========================================
  // 👑 36–45: LEGENDARY TIER RELICS
  // ==========================================
  {
    id: 'art-036',
    name: 'The Darkhold (Book of Sins)',
    cost: 25,
    astraCost: 16500,
    rarity: 'LEGENDARY',
    icon: '📖',
    description: 'Written by Elder God Chthon in indestructible dark matter. Unleashes terrifying chaos magic corruption.',
    bonusPower: 26,
    statModifiers: { power: 26, hp: 130, defense: 20, speed: 12 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-037',
    name: 'Book of Vishanti',
    cost: 25,
    astraCost: 17000,
    rarity: 'LEGENDARY',
    icon: '📜',
    description: 'The supreme grimoire of pure white magic. Bestows complete invulnerability to mystical curses and fatal strikes.',
    bonusPower: 26,
    statModifiers: { power: 26, hp: 150, defense: 28, speed: 10 },
    effectType: 'invulnerable'
  },
  {
    id: 'art-038',
    name: 'Cosmic Cube (Tesseract)',
    cost: 25,
    astraCost: 18000,
    rarity: 'LEGENDARY',
    icon: '🧊',
    description: 'Matrix of limitless reality-warping energy. Rewrites physical laws to double combat rolls.',
    bonusPower: 27,
    statModifiers: { power: 27, hp: 160, defense: 26, speed: 15 },
    effectType: 'double_roll'
  },
  {
    id: 'art-039',
    name: 'All-Black the Necrosword',
    cost: 25,
    astraCost: 19000,
    rarity: 'LEGENDARY',
    icon: '🗡️',
    description: 'The first symbiote, forged by Knull from the head of a dead Celestial. Instantly slays lesser beings.',
    bonusPower: 28,
    statModifiers: { power: 28, hp: 150, defense: 22, speed: 16 },
    effectType: 'lethal_strike'
  },
  {
    id: 'art-040',
    name: 'Black Vortex Mirror',
    cost: 25,
    astraCost: 20000,
    rarity: 'LEGENDARY',
    icon: '🪞',
    description: 'Ancient Celestial mirror submitting the soul to cosmic ascension. Multiplies all base stats by +30%.',
    bonusPower: 29,
    statModifiers: { power: 29, hp: 175, defense: 30, speed: 18 },
    effectType: 'all_stats'
  },
  {
    id: 'art-041',
    name: 'Evil Eye of Avalon',
    cost: 25,
    astraCost: 20500,
    rarity: 'LEGENDARY',
    icon: '🧿',
    description: 'Indestructible artifact capable of manipulating all matter, disintegrating matter, and shattering forcefields.',
    bonusPower: 29,
    statModifiers: { power: 29, hp: 165, defense: 28, speed: 14 },
    effectType: 'shield_negate'
  },
  {
    id: 'art-042',
    name: 'Twilight Sword of Surtur',
    cost: 25,
    astraCost: 21000,
    rarity: 'LEGENDARY',
    icon: '🔥',
    description: 'The Sword of Doom forged in the Burning Galaxy. Destroys dimensions and burns through cosmic shields.',
    bonusPower: 30,
    statModifiers: { power: 30, hp: 180, defense: 26, speed: 12 },
    effectType: 'stat_boost'
  },
  {
    id: 'art-043',
    name: 'Koranath — Cosmic Power Stone Core',
    cost: 25,
    astraCost: 22000,
    rarity: 'LEGENDARY',
    icon: '🟣',
    description: 'The raw unrestrained singularity of the Power Stone. Obliterates planets and grants infinite strength.',
    bonusPower: 31,
    statModifiers: { power: 31, hp: 190, defense: 30, speed: 15 },
    effectType: 'cosmic_supremacy'
  },
  {
    id: 'art-044',
    name: 'Chrono-Gateway of Kang',
    cost: 25,
    astraCost: 23000,
    rarity: 'LEGENDARY',
    icon: '⏳',
    description: '40th-century timeline dilation device. Completely rewinds time by 1 round if you took fatal damage.',
    bonusPower: 31,
    statModifiers: { power: 31, hp: 160, defense: 25, speed: 20 },
    effectType: 'undo_round'
  },
  {
    id: 'art-045',
    name: 'Phoenix Egg Relic',
    cost: 25,
    astraCost: 24000,
    rarity: 'LEGENDARY',
    icon: '🥚',
    description: 'Incubator of the cosmic entity of rebirth. Revives fallen hero with 100% full health once per match!',
    bonusPower: 32,
    statModifiers: { power: 32, hp: 200, defense: 30, speed: 16 },
    effectType: 'revive_hero'
  },

  // ==========================================
  // 🌌 46–50: MYTHIC GOD TIER RELICS
  // ==========================================
  {
    id: 'art-046',
    name: 'The Ultimate Nullifier',
    cost: 25,
    astraCost: 25000,
    rarity: 'MYTHIC',
    icon: '💣',
    description: 'The only weapon in the universe feared by Galactus. Completely erases targeted timeline threat from existence.',
    bonusPower: 35,
    statModifiers: { power: 35, hp: 220, defense: 35, speed: 20 },
    effectType: 'lethal_strike'
  },
  {
    id: 'art-047',
    name: 'Infinity Gauntlet (All 6 Stones)',
    cost: 25,
    astraCost: 25000,
    rarity: 'MYTHIC',
    icon: '🧤',
    description: 'Wields Power, Space, Reality, Soul, Time, and Mind. Omnipotent cosmic supremacy over the battle.',
    bonusPower: 38,
    statModifiers: { power: 38, hp: 250, defense: 40, speed: 25 },
    effectType: 'cosmic_supremacy'
  },
  {
    id: 'art-048',
    name: 'Heart of the Universe',
    cost: 25,
    astraCost: 25000,
    rarity: 'MYTHIC',
    icon: '💖',
    description: 'The omnipotent core of all Marvel creation. Transcends the Living Tribunal and all cosmic concepts.',
    bonusPower: 40,
    statModifiers: { power: 40, hp: 300, defense: 45, speed: 30 },
    effectType: 'all_stats'
  },
  {
    id: 'art-049',
    name: 'Siege Perilous Multiverse Portal',
    cost: 25,
    astraCost: 25000,
    rarity: 'MYTHIC',
    icon: '🚪',
    description: 'Otherworld diamond gateway. Resets fate, offering cosmic judgment and rebirth with ascended attributes.',
    bonusPower: 36,
    statModifiers: { power: 36, hp: 240, defense: 38, speed: 22 },
    effectType: 'revive_hero'
  },
  {
    id: 'art-050',
    name: 'Crown of the Living Tribunal',
    cost: 25,
    astraCost: 25000,
    rarity: 'MYTHIC',
    icon: '👑',
    description: 'Three-faced golden arbiter crown. Enforces absolute cosmic balance and eliminates enemy advantage.',
    bonusPower: 42,
    statModifiers: { power: 42, hp: 350, defense: 50, speed: 35 },
    effectType: 'cosmic_supremacy'
  }
];

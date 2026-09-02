import { Character, CharacterGrade } from '../types/game';
import {
  DungeonDifficultyMode,
  DungeonNode,
  DungeonNodeType,
  DungeonZoneTheme,
  DungeonHeroState,
  DungeonRelic,
  RelicSynergy,
  DungeonModifier,
  DungeonEvent,
  DungeonShopItem,
  DungeonBossPhase,
  DungeonCombatLog,
  TacticalActionMode,
  EnemyIntentInfo,
  EnemyIntentType,
  DungeonRunState,
  DungeonEncounterFormat,
  DungeonMilestoneReward,
  DungeonWaveEncounter,
} from '../types/dungeon';
import { ALL_CHARACTERS, CHARACTERS_BY_GRADE } from '../data/characters/index';
import { getSkillsForCharacter, CharacterSkill } from '../data/skills/characterSkills';
import { MARVEL_ARTIFACTS } from '../data/artifacts';

// ============================================================
// 1. ROGUELITE RELICS DATABASE (35+ RELICS ACROSS 5 SYNERGIES)
// ============================================================

export const ALL_DUNGEON_RELICS: DungeonRelic[] = [
  // --- OFFENSIVE SYNERGY ---
  {
    id: 'relic-off-01',
    name: 'Vibranium Power Core',
    description: 'Increases all team strike and ability damage by +20%.',
    rarity: 'COMMON',
    synergy: 'OFFENSIVE',
    icon: '⚔️',
    costAstra: 300,
    effectType: 'DAMAGE_PERCENT',
    value: 20,
  },
  {
    id: 'relic-off-02',
    name: 'Berserker Plasma Edge',
    description: 'Increases critical strike chance by +15% and critical damage by +35%.',
    rarity: 'RARE',
    synergy: 'OFFENSIVE',
    icon: '🗡️',
    costAstra: 450,
    effectType: 'CRIT_CHANCE',
    value: 15,
  },
  {
    id: 'relic-off-03',
    name: 'Executioner War Axe',
    description: 'Deals +45% extra damage against enemies below 40% HP.',
    rarity: 'EPIC',
    synergy: 'OFFENSIVE',
    icon: '🪓',
    costAstra: 600,
    effectType: 'FURY_LOW_HP_DAMAGE',
    value: 45,
  },
  {
    id: 'relic-off-04',
    name: 'Bloodrage Serum',
    description: 'When active hero falls below 50% HP, gain +35% damage.',
    rarity: 'RARE',
    synergy: 'OFFENSIVE',
    icon: '🩸',
    costAstra: 400,
    effectType: 'FURY_LOW_HP_DAMAGE',
    value: 35,
  },
  {
    id: 'relic-off-05',
    name: 'All-Black Blade Shard',
    description: 'Strikes pierce 30% enemy armor and deal +25% dark damage.',
    rarity: 'MYTHIC',
    synergy: 'OFFENSIVE',
    icon: '🖤',
    costAstra: 800,
    effectType: 'DAMAGE_PERCENT',
    value: 30,
  },
  {
    id: 'relic-off-06',
    name: 'Targeting HUD Matrix',
    description: 'Critical strikes deal an additional +50% critical damage.',
    rarity: 'RARE',
    synergy: 'OFFENSIVE',
    icon: '🎯',
    costAstra: 450,
    effectType: 'CRIT_DAMAGE',
    value: 50,
  },
  {
    id: 'relic-off-07',
    name: 'Mjolnir Lightning Spark',
    description: 'Every direct attack has a 25% chance to trigger an overload lightning bolt.',
    rarity: 'EPIC',
    synergy: 'OFFENSIVE',
    icon: '⚡',
    costAstra: 650,
    effectType: 'DAMAGE_PERCENT',
    value: 25,
  },

  // --- DEFENSIVE SYNERGY ---
  {
    id: 'relic-def-01',
    name: 'Kinetic Barrier Emitter',
    description: 'Reduces all incoming enemy damage by 15%.',
    rarity: 'COMMON',
    synergy: 'DEFENSIVE',
    icon: '🛡️',
    costAstra: 300,
    effectType: 'DAMAGE_REDUCTION_PERCENT',
    value: 15,
  },
  {
    id: 'relic-def-02',
    name: 'Vibranium Plating Weave',
    description: 'Reduces heavy boss and elite blows by 25%.',
    rarity: 'RARE',
    synergy: 'DEFENSIVE',
    icon: '🦺',
    costAstra: 450,
    effectType: 'DAMAGE_REDUCTION_PERCENT',
    value: 25,
  },
  {
    id: 'relic-def-03',
    name: 'Aegis Forcefield Ring',
    description: 'Reflects 20% of incoming damage back to the attacker.',
    rarity: 'EPIC',
    synergy: 'DEFENSIVE',
    icon: '🧿',
    costAstra: 550,
    effectType: 'THORNS_REFLECT_PERCENT',
    value: 20,
  },
  {
    id: 'relic-def-04',
    name: 'Adamantium Skeletal Brace',
    description: 'Increases hero maximum HP by +35% during the run.',
    rarity: 'EPIC',
    synergy: 'DEFENSIVE',
    icon: '🦴',
    costAstra: 600,
    effectType: 'DAMAGE_REDUCTION_PERCENT',
    value: 20,
  },
  {
    id: 'relic-def-05',
    name: 'Captain\'s Unbreakable Shield',
    description: 'Defending absorbs 85% damage and grants +30% counter strike damage.',
    rarity: 'MYTHIC',
    synergy: 'DEFENSIVE',
    icon: '⭐',
    costAstra: 800,
    effectType: 'DAMAGE_REDUCTION_PERCENT',
    value: 30,
  },
  {
    id: 'relic-def-06',
    name: 'Nanotech Hardlight Generator',
    description: 'Reduces all damage over time and status damage by 40%.',
    rarity: 'RARE',
    synergy: 'DEFENSIVE',
    icon: '🔷',
    costAstra: 400,
    effectType: 'DAMAGE_REDUCTION_PERCENT',
    value: 18,
  },
  {
    id: 'relic-def-07',
    name: 'Spikewall Defense Core',
    description: 'Reflects 30% of incoming physical damage.',
    rarity: 'RARE',
    synergy: 'DEFENSIVE',
    icon: '🦔',
    costAstra: 450,
    effectType: 'THORNS_REFLECT_PERCENT',
    value: 30,
  },

  // --- SUSTAIN SYNERGY ---
  {
    id: 'relic-sus-01',
    name: 'Heart of Bast Elixir',
    description: 'Restores +12% max HP to all living team members after every battle.',
    rarity: 'COMMON',
    synergy: 'SUSTAIN',
    icon: '🍷',
    costAstra: 350,
    effectType: 'POST_BATTLE_HEAL_PERCENT',
    value: 12,
  },
  {
    id: 'relic-sus-02',
    name: 'Nano-Regen Infuser',
    description: 'Regenerates +6% max HP at the start of every combat round.',
    rarity: 'RARE',
    synergy: 'SUSTAIN',
    icon: '💚',
    costAstra: 450,
    effectType: 'HP_REGEN_PER_ROUND',
    value: 6,
  },
  {
    id: 'relic-sus-03',
    name: 'Vampiric Lifesteal Fang',
    description: 'Attacks heal the hero for 15% of all damage dealt.',
    rarity: 'EPIC',
    synergy: 'SUSTAIN',
    icon: '🧛',
    costAstra: 600,
    effectType: 'LIFESTEAL_PERCENT',
    value: 15,
  },
  {
    id: 'relic-sus-04',
    name: 'Phoenix Feather of Rebirth',
    description: 'Once per dungeon run, automatically revives the first fallen hero at 75% HP.',
    rarity: 'MYTHIC',
    synergy: 'SUSTAIN',
    icon: '🔥',
    costAstra: 900,
    effectType: 'REVIVE_ONCE',
    value: 75,
  },
  {
    id: 'relic-sus-05',
    name: 'Wakandan Medical Beacon',
    description: 'Increases the healing potency of all Potions and Shrines by +50%.',
    rarity: 'RARE',
    synergy: 'SUSTAIN',
    icon: '🏥',
    costAstra: 400,
    effectType: 'POST_BATTLE_HEAL_PERCENT',
    value: 18,
  },
  {
    id: 'relic-sus-06',
    name: 'Cosmic Life-Force Spore',
    description: 'Restores +20% HP after clearing Elite and Boss encounters.',
    rarity: 'EPIC',
    synergy: 'SUSTAIN',
    icon: '🌱',
    costAstra: 550,
    effectType: 'POST_BATTLE_HEAL_PERCENT',
    value: 20,
  },

  // --- ABILITY SYNERGY ---
  {
    id: 'relic-abi-01',
    name: 'Arc Overclock Reactor',
    description: 'Increases all special ability damage and bonus effects by +30%.',
    rarity: 'COMMON',
    synergy: 'ABILITY',
    icon: '🔋',
    costAstra: 300,
    effectType: 'ABILITY_POWER',
    value: 30,
  },
  {
    id: 'relic-abi-02',
    name: 'Timestream Accelerator',
    description: 'Cooldowns behave 35% faster, enabling faster skill availability.',
    rarity: 'RARE',
    synergy: 'ABILITY',
    icon: '⏳',
    costAstra: 450,
    effectType: 'COOLDOWN_REDUCTION',
    value: 35,
  },
  {
    id: 'relic-abi-03',
    name: 'Cosmic Battery Prism',
    description: 'Heroes start every battle with +50 bonus Combat Energy.',
    rarity: 'EPIC',
    synergy: 'ABILITY',
    icon: '💎',
    costAstra: 550,
    effectType: 'ENERGY_START',
    value: 50,
  },
  {
    id: 'relic-abi-04',
    name: 'Eye of Agamotto Charm',
    description: 'Signature abilities deal +45% damage and have an extra 20% crit chance.',
    rarity: 'MYTHIC',
    synergy: 'ABILITY',
    icon: '👁️',
    costAstra: 850,
    effectType: 'ABILITY_POWER',
    value: 45,
  },
  {
    id: 'relic-abi-05',
    name: 'Quantum Reality Spark',
    description: 'Special Blast attacks bypass 40% of enemy shield barriers.',
    rarity: 'RARE',
    synergy: 'ABILITY',
    icon: '✨',
    costAstra: 400,
    effectType: 'ABILITY_POWER',
    value: 25,
  },

  // --- COSMIC / HYBRID SYNERGY ---
  {
    id: 'relic-cos-01',
    name: 'Infinity Shard Fragment',
    description: 'Grants +15% Damage, +10% Damage Reduction, and +5% round HP regen.',
    rarity: 'MYTHIC',
    synergy: 'COSMIC',
    icon: '🪐',
    costAstra: 950,
    effectType: 'COSMIC_BURST_CHANCE',
    value: 20,
  },
  {
    id: 'relic-cos-02',
    name: 'Collector\'s Golden Vault Ledger',
    description: 'Earn +35% additional Astra and double Shards from all dungeon victories.',
    rarity: 'RARE',
    synergy: 'COSMIC',
    icon: '💰',
    costAstra: 450,
    effectType: 'ASTRA_BONUS_PERCENT',
    value: 35,
  },
  {
    id: 'relic-cos-03',
    name: 'Darkhold Grimoire Fragment',
    description: 'Grants +35% Attack power, but hero takes 5% recoil damage on skills.',
    rarity: 'EPIC',
    synergy: 'COSMIC',
    icon: '📖',
    costAstra: 600,
    effectType: 'DAMAGE_PERCENT',
    value: 35,
  },
  {
    id: 'relic-cos-04',
    name: 'Chaos Magic Catalyst',
    description: '20% chance on turn to trigger a random cosmic devastation blast (+80% DMG).',
    rarity: 'EPIC',
    synergy: 'COSMIC',
    icon: '🌀',
    costAstra: 650,
    effectType: 'COSMIC_BURST_CHANCE',
    value: 20,
  },
  {
    id: 'relic-cos-05',
    name: 'Celestial Tuning Fork',
    description: 'Increases all synergy bonuses by +50%.',
    rarity: 'MYTHIC',
    synergy: 'COSMIC',
    icon: '🔱',
    costAstra: 900,
    effectType: 'DAMAGE_PERCENT',
    value: 25,
  },
];

export function mapArtifactToDungeonRelic(relicIdOrArtifact: string | any): DungeonRelic | null {
  if (!relicIdOrArtifact) return null;
  if (typeof relicIdOrArtifact === 'string') {
    const fromRoguelite = ALL_DUNGEON_RELICS.find(r => r.id === relicIdOrArtifact);
    if (fromRoguelite) return fromRoguelite;

    const fromArtifacts = MARVEL_ARTIFACTS.find(a => a.id === relicIdOrArtifact);
    if (fromArtifacts) {
      const effect = fromArtifacts.effectType;
      const syn: RelicSynergy = 
        fromArtifacts.rarity === 'MYTHIC' || effect === 'cosmic_supremacy' ? 'COSMIC' :
        effect === 'life_drain' || effect === 'revive_hero' ? 'SUSTAIN' :
        effect === 'invulnerable' || effect === 'shield_negate' || (fromArtifacts.statModifiers?.defense || 0) > 2 ? 'DEFENSIVE' :
        effect === 'lightning_strike' || effect === 'freeze' || effect === 'speed_evasion' || effect === 'double_roll' ? 'ABILITY' : 'OFFENSIVE';

      return {
        id: fromArtifacts.id,
        name: fromArtifacts.name,
        description: fromArtifacts.description,
        rarity: (fromArtifacts.rarity as any) || 'RARE',
        synergy: syn,
        icon: fromArtifacts.icon || '🔮',
        costAstra: fromArtifacts.astraCost || 1000,
        effectType: syn === 'OFFENSIVE' ? 'DAMAGE_PERCENT' : syn === 'DEFENSIVE' ? 'DAMAGE_REDUCTION_PERCENT' : syn === 'SUSTAIN' ? 'LIFESTEAL_PERCENT' : syn === 'ABILITY' ? 'ABILITY_POWER' : 'COSMIC_BURST_CHANCE',
        value: (fromArtifacts.bonusPower || 5) * 4,
      };
    }
    return null;
  }
  return relicIdOrArtifact;
}

// ============================================================
// 2. DUNGEON MODIFIERS
// ============================================================

export const ALL_DUNGEON_MODIFIERS: DungeonModifier[] = [
  {
    id: 'COSMIC_SURGE',
    name: 'Cosmic Surge',
    description: 'Cosmic & Mythic combatants gain +30% power, but all cosmic incoming damage is increased by +20%.',
    icon: '🌌',
    color: 'from-purple-600 to-indigo-700',
    badge: 'COSMIC +30%',
  },
  {
    id: 'ENDLESS_DARKNESS',
    name: 'Endless Darkness',
    description: 'Knull\'s shadow looms. Healing effectiveness across all sources is reduced by 35%.',
    icon: '🌑',
    color: 'from-slate-900 to-black',
    badge: 'HEALING -35%',
  },
  {
    id: 'OVERCHARGED_ENEMIES',
    name: 'Overcharged Guardians',
    description: 'Enemies start battles with fortified kinetic shields and high initial momentum.',
    icon: '⚡',
    color: 'from-amber-600 to-red-700',
    badge: 'ENEMY SHIELDS UP',
  },
  {
    id: 'BROKEN_TIMELINE',
    name: 'Broken Timeline',
    description: 'Temporal ripples cause unpredictability: abilities trigger with random critical bonuses.',
    icon: '⏳',
    color: 'from-teal-600 to-cyan-700',
    badge: 'CRIT VOLATILITY',
  },
  {
    id: 'BLOOD_MOON',
    name: 'Blood Moon Rising',
    description: 'Bloodlust surges. All critical strike damage is boosted by +50% for heroes and foes alike.',
    icon: '🩸',
    color: 'from-red-600 to-rose-900',
    badge: 'CRIT DMG +50%',
  },
  {
    id: 'VIBRANIUM_ARMOR',
    name: 'Vibranium Bastion',
    description: 'All duelists gain +25% physical damage reduction.',
    icon: '🛡️',
    color: 'from-emerald-700 to-teal-900',
    badge: 'PHYSICAL RESIST +25%',
  },
  {
    id: 'UNSTABLE_REALITY',
    name: 'Unstable Reality',
    description: 'Wanda\'s hex warp: tactical advantage counters deal +30% increased punishment.',
    icon: '🔮',
    color: 'from-pink-600 to-purple-800',
    badge: 'COUNTER BONUS +30%',
  },
];

// ============================================================
// 3. BOSS MECHANICS & PHASES
// ============================================================

export interface BossSpecialDefinition {
  name: string;
  title: string;
  themeZone: DungeonZoneTheme;
  characterId: string;
  phases: DungeonBossPhase[];
  introDialogue: string;
}

export const DUNGEON_BOSSES: Record<string, BossSpecialDefinition> = {
  knull: {
    name: 'Knull',
    title: 'God of the Symbiotes & Void Lord',
    themeZone: 'KNULL_VOID',
    characterId: 'knull',
    introDialogue: 'I was here before the Light. Your puny expedition ends in the Abyss.',
    phases: [
      {
        phaseNumber: 1,
        phaseName: 'All-Black Awakening',
        triggerHpPercent: 100,
        mechanicTitle: 'Necrosword Laceration',
        mechanicDescription: 'Strikes inflict stacking void bleed and bypass 15% armor.',
        specialAbilityName: 'All-Black Cleave',
        effect: 'DAMAGE_IMMUNITY',
      },
      {
        phaseNumber: 2,
        phaseName: 'Symbiote Horde Surge',
        triggerHpPercent: 60,
        mechanicTitle: 'Void Thrall Swarm',
        mechanicDescription: 'Summons darkness tendrils to absorb 30% of incoming damage.',
        specialAbilityName: 'Symbiote Swarm Tide',
        effect: 'SUMMON_THRALLS',
      },
      {
        phaseNumber: 3,
        phaseName: 'Absolute Void Annihilation',
        triggerHpPercent: 25,
        mechanicTitle: 'Total Eclipse of Light',
        mechanicDescription: 'Knull unleashes cosmic obliteration. Defend immediately or perish!',
        specialAbilityName: 'Void Worldfall',
        effect: 'COSMIC_NUKE',
      },
    ],
  },
  thanos: {
    name: 'Thanos',
    title: 'The Mad Titan & Infinity Wielder',
    themeZone: 'COSMIC_CRUCIBLE',
    characterId: 'thanos',
    introDialogue: 'Dread it. Run from it. Destiny arrives all the same.',
    phases: [
      {
        phaseNumber: 1,
        phaseName: 'Power & Space Assault',
        triggerHpPercent: 100,
        mechanicTitle: 'Power Stone Kinetic Blast',
        mechanicDescription: 'Unblockable kinetic blasts deal massive frontline strike damage.',
        specialAbilityName: 'Orbital Titan Slam',
        effect: 'DAMAGE_IMMUNITY',
      },
      {
        phaseNumber: 2,
        phaseName: 'Reality & Soul Inversion',
        triggerHpPercent: 65,
        mechanicTitle: 'Reality Stone Warp',
        mechanicDescription: 'Distorts combat reality: team healing is temporarily inverted into damage!',
        specialAbilityName: 'Reality Rend',
        effect: 'INVERT_HEALING',
      },
      {
        phaseNumber: 3,
        phaseName: 'The Decimation Snap',
        triggerHpPercent: 30,
        mechanicTitle: 'Full Gauntlet Overload',
        mechanicDescription: 'Thanos channels the full Gauntlet. Counter with EVADE or DEFEND to survive!',
        specialAbilityName: 'Cosmic Decimation Snap',
        effect: 'COSMIC_NUKE',
      },
    ],
  },
  doctor_doom: {
    name: 'Doctor Doom',
    title: 'Supreme Monarch of Latveria',
    themeZone: 'DOOM_BASTION',
    characterId: 'doctor-doom',
    introDialogue: 'You enter Latveria uninvited. Doom will dismantle you piece by piece.',
    phases: [
      {
        phaseNumber: 1,
        phaseName: 'Techno-Mystic Barrier',
        triggerHpPercent: 100,
        mechanicTitle: 'Doombot Decoy Redirection',
        mechanicDescription: 'Doombots absorb initial strikes. High magic and tech resilience.',
        specialAbilityName: 'Arcane Latverian Ray',
        effect: 'DAMAGE_IMMUNITY',
      },
      {
        phaseNumber: 2,
        phaseName: 'Sorcery & Tech Overdrive',
        triggerHpPercent: 55,
        mechanicTitle: 'Siphon Cosmic Power',
        mechanicDescription: 'Silences player character special skills for 2 rounds.',
        specialAbilityName: 'Cosmic Power Siphon',
        effect: 'SILENCE_SKILLS',
      },
      {
        phaseNumber: 3,
        phaseName: 'God Emperor Ascension',
        triggerHpPercent: 20,
        mechanicTitle: 'Monarch Final Judgment',
        mechanicDescription: 'Concentrated mystic plasma nuke. Extreme burst incoming!',
        specialAbilityName: 'Doom Above All',
        effect: 'COSMIC_NUKE',
      },
    ],
  },
  galactus: {
    name: 'Galactus',
    title: 'Devourer of Worlds',
    themeZone: 'CELESTIAL_MULTIVERSE',
    characterId: 'galactus',
    introDialogue: 'I am the hunger that consumes galaxies. You are mere cosmic dust.',
    phases: [
      {
        phaseNumber: 1,
        phaseName: 'Herald Vanguard',
        triggerHpPercent: 100,
        mechanicTitle: 'Cosmic Ray Bombardment',
        mechanicDescription: 'Constant cosmic radiation deals passive burn damage.',
        specialAbilityName: 'Cosmic Convergence',
        effect: 'DAMAGE_IMMUNITY',
      },
      {
        phaseNumber: 2,
        phaseName: 'Planetary Siphon',
        triggerHpPercent: 50,
        mechanicTitle: 'World Conversion',
        mechanicDescription: 'Drains energy and charges catastrophic Celestial Devastation.',
        specialAbilityName: 'World Extinction Beam',
        effect: 'COSMIC_NUKE',
      },
    ],
  },
};

// ============================================================
// 4. MYSTERY EVENTS (15+ DIVERSE MARVEL MULTIVERSE EVENTS)
// ============================================================

export const ALL_DUNGEON_EVENTS: DungeonEvent[] = [
  {
    id: 'event-collector',
    title: "The Collector's Secret Vault",
    subtitle: 'Tivan Museum Chamber',
    description:
      'Taneleer Tivan emerges from the gilded shadows, his crystalline eyes gleaming with fascination. "Ah, remarkable specimens! I will gladly trade cosmic treasures for a piece of your collection."',
    image: '/images/dungeons/event-collector.jpg',
    choices: [
      {
        id: 'choice-1',
        label: 'Trade 10% Team HP for a Rare Relic',
        description: 'Allow Tivan to extract a drop of heroic essence in exchange for an ancient combat relic.',
        costHpPercent: 10,
        actionType: 'GAIN_RELIC',
      },
      {
        id: 'choice-2',
        label: 'Spend 400 Astra for 25 Draft Shards',
        description: 'Purchase a locked archival canister containing valuable multiverse draft shards.',
        costAstra: 400,
        actionType: 'GAIN_SHARDS',
        rewardPayload: { shards: 25 },
      },
      {
        id: 'choice-3',
        label: 'Politely Decline and Move On',
        description: 'Leave the Collector\'s museum safely without risking resources.',
        actionType: 'LEAVE_SAFELY',
      },
    ],
  },
  {
    id: 'event-wanda',
    title: "Wanda's Reality Hex Rift",
    subtitle: 'Chaos Magic Distortion',
    description:
      'Crimson hex runes spiral across the stone floor. The fabric of reality pulses with unstable magical energy. You hear a gentle whisper: "What if you could rewrite your fate?"',
    image: '/images/dungeons/event-wanda.jpg',
    choices: [
      {
        id: 'choice-1',
        label: 'Embrace Chaos Magic (High Risk / High Reward)',
        description: 'Step into the hex flame: 60% chance to gain an Epic Relic + 500 Astra; 40% chance to lose 25% HP.',
        successRate: 0.6,
        actionType: 'RISK_GAMBLE',
      },
      {
        id: 'choice-2',
        label: 'Channel Hex to Restore Full Team HP',
        description: 'Spend 250 Astra to bathe the entire team in regenerative crimson aura.',
        costAstra: 250,
        actionType: 'HEAL_TEAM',
        rewardPayload: { healPercent: 60 },
      },
      {
        id: 'choice-3',
        label: 'Shield Eyes and Walk Away',
        description: 'Step around the anomaly without disturbing the hex field.',
        actionType: 'LEAVE_SAFELY',
      },
    ],
  },
  {
    id: 'event-vibranium-forge',
    title: 'Wakandan Great Mound Anvil',
    subtitle: 'Ancient Shuri Outpost',
    description:
      'You discover an automated Wakandan forge humming with pure vibranium resonators. Holographic blueprints offer tactical armor reinforcement.',
    image: '/images/dungeons/event-forge.jpg',
    choices: [
      {
        id: 'choice-1',
        label: 'Reinforce Roster Battle Suits (+15% Defense for the run)',
        description: 'Coat your team\'s gear with microscopic vibranium mesh.',
        costAstra: 300,
        actionType: 'UPGRADE_HERO_RUN_STATS',
      },
      {
        id: 'choice-2',
        label: 'Forge Kinetic Discharge Core (Relic)',
        description: 'Craft a specialized offensive kinetic relic.',
        costAstra: 450,
        actionType: 'GAIN_RELIC',
      },
      {
        id: 'choice-3',
        label: 'Harvest Vibranium Shards (+350 Astra)',
        description: 'Extract raw vibranium ore from the machinery.',
        actionType: 'GAIN_ASTRA',
        rewardPayload: { astra: 350 },
      },
    ],
  },
  {
    id: 'event-symbiote-pool',
    title: 'Symbiote Spawning Pool',
    subtitle: 'Knull\'s Black Slime Chamber',
    description:
      'A viscous black pool ripples in the center of the cavern. Tendrils reach toward your squad, promising overwhelming destructive power at a bodily cost.',
    image: '/images/dungeons/event-symbiote.jpg',
    choices: [
      {
        id: 'choice-1',
        label: 'Bond with Symbiote (+30% Team Attack, -20% Current HP)',
        description: 'Let the symbiote merge with your weapons for brutal power.',
        costHpPercent: 20,
        actionType: 'UPGRADE_HERO_RUN_STATS',
      },
      {
        id: 'choice-2',
        label: 'Incinerate the Pool (+400 Astra & Shards)',
        description: 'Burn the alien biomass with plasma fire to uncover scorched treasures.',
        actionType: 'GAIN_ASTRA',
        rewardPayload: { astra: 400, shards: 15 },
      },
      {
        id: 'choice-3',
        label: 'Bypass the Cavern',
        description: 'Move carefully past the biohazard.',
        actionType: 'LEAVE_SAFELY',
      },
    ],
  },
  {
    id: 'event-quantum-portal',
    title: 'Multiverse Quantum Gate',
    subtitle: 'Pym-Van Dyne Anomaly',
    description:
      'A temporal portal swirls with glimpses of alternative Marvel universes. A shadowy elite sentinel guards the control panel.',
    image: '/images/dungeons/event-portal.jpg',
    choices: [
      {
        id: 'choice-1',
        label: 'Defeat the Sentinel for Guaranteed Mythic Relic',
        description: 'Trigger a challenging combat clash against an elite guardian.',
        actionType: 'FIGHT_ELITE_FOR_LOOT',
      },
      {
        id: 'choice-2',
        label: 'Siphon Quantum Energy (+30% Team Heal + 200 Astra)',
        description: 'Tap the reactor safely without triggering the alarm.',
        actionType: 'HEAL_TEAM',
        rewardPayload: { healPercent: 30, astra: 200 },
      },
    ],
  },
  {
    id: 'event-deadpool',
    title: "Deadpool's Shady Taco Stand",
    subtitle: 'Fourth Wall Break Junction',
    description:
      'Wade Wilson is leaning on a taco truck inside the ancient ruins. "Hey buddy! You look like you\'re on floor 12 of a roguelite. Want some Chimichangas or a fresh revive kit?"',
    image: '/images/dungeons/event-deadpool.jpg',
    choices: [
      {
        id: 'choice-1',
        label: 'Buy Wade\'s Secret Chimichanga (+50% Team HP)',
        description: 'Costs 200 Astra. It tastes suspiciously spicy.',
        costAstra: 200,
        actionType: 'HEAL_TEAM',
        rewardPayload: { healPercent: 50 },
      },
      {
        id: 'choice-2',
        label: 'Buy Wade\'s Mystery Box (Random Relic or Crate)',
        description: 'Costs 350 Astra. Who knows what\'s inside?!',
        costAstra: 350,
        actionType: 'GAIN_RELIC',
      },
      {
        id: 'choice-3',
        label: 'Tell Wade to get back to his movie',
        description: 'Wade gives you 100 Astra just for being cool.',
        actionType: 'GAIN_ASTRA',
        rewardPayload: { astra: 100 },
      },
    ],
  },
];

// ============================================================
// 5. PROCEDURAL INFINITE WAVE & MILESTONE REWARD GENERATOR
// ============================================================

export function getZoneForWave(wave: number): DungeonZoneTheme {
  const cycle = Math.floor((wave - 1) / 10) % 6;
  switch (cycle) {
    case 0: return 'ANCIENT_RUINS';
    case 1: return 'KNULL_VOID';
    case 2: return 'DOOM_BASTION';
    case 3: return 'DARK_DIMENSION';
    case 4: return 'COSMIC_CRUCIBLE';
    default: return 'CELESTIAL_MULTIVERSE';
  }
}

export const getZoneForFloor = getZoneForWave; // Alias for backward compatibility

export function generateMilestoneReward(wave: number, seed: number = Date.now()): DungeonMilestoneReward {
  // Meaningful progression rewards scaling with wave depth
  const astra = Math.round(500 + wave * 140 + Math.pow(wave, 1.25) * 18);
  const cardShards = Math.round(15 + wave * 4);
  const draftShards = Math.round(10 + wave * 3);
  const crates = wave % 10 === 0 ? 2 : 1;
  const crateType: 'SHARD_CRATE' | 'CHARACTER_CRATE' = wave % 20 === 0 ? 'CHARACTER_CRATE' : 'SHARD_CRATE';

  // Draft 3 random distinct roguelite relics
  const shuffled = [...ALL_DUNGEON_RELICS].sort(() => Math.random() - 0.5);
  const relicChoices = shuffled.slice(0, 3);

  return {
    wave,
    astra,
    cardShards,
    draftShards,
    crates,
    crateType,
    characterTokenAmount: wave % 15 === 0 ? Math.floor(wave / 15) * 5 : undefined,
    characterTokenCategory: wave % 15 === 0 ? (wave >= 30 ? 'MYTHIC' : 'A') : undefined,
    relicChoices,
  };
}

export function generateInfiniteDungeonWave(
  wave: number,
  seed: number,
  recentEnemyIds: string[] = []
): DungeonWaveEncounter {
  // Run-specific deterministic PRNG per wave
  let pRand = Math.abs((seed * 48271 + wave * 9973 + 1337) % 2147483647);
  const nextRand = () => {
    pRand = (pRand * 16807) % 2147483647;
    return (pRand - 1) / 2147483646;
  };

  const isBoss = wave % 10 === 0;
  const isMilestone = wave % 5 === 0;
  const zone = getZoneForWave(wave);

  // Dynamic difficulty scaling
  const baseHpScale = 1 + (wave - 1) * 0.08 + Math.pow(Math.max(0, wave - 15), 1.14) * 0.022;
  const basePwrScale = 1 + (wave - 1) * 0.06 + Math.pow(Math.max(0, wave - 15), 1.1) * 0.016;

  // Modifiers on tough waves (elite waves)
  const activeMods: DungeonModifier[] = [];
  if (wave >= 4 && (wave % 4 === 0 || isBoss)) {
    const modIdx = Math.floor(nextRand() * ALL_DUNGEON_MODIFIERS.length);
    activeMods.push(ALL_DUNGEON_MODIFIERS[modIdx]);
  }

  // Handle Boss Encounters
  if (isBoss) {
    const bossKeys = ['knull', 'thanos', 'doctor_doom', 'galactus'];
    const bossKey = bossKeys[Math.floor((wave / 10 - 1) % bossKeys.length)];
    const bossDef = DUNGEON_BOSSES[bossKey] || DUNGEON_BOSSES.knull;
    const bossChar = ALL_CHARACTERS.find(c => c.id === bossDef.characterId) || ALL_CHARACTERS[0];

    const phaseIndex = Math.min(bossDef.phases.length - 1, Math.floor((wave / 10 - 1) / 4));
    const bossPhase = bossDef.phases[phaseIndex] || bossDef.phases[0];

    return {
      wave,
      title: `WAVE ${wave} BOSS: ${bossDef.name.toUpperCase()}`,
      subtitle: `${bossDef.title} • Phase ${bossPhase.phaseNumber}`,
      encounterFormat: 'BOSS_TITAN',
      enemies: [bossChar],
      enemyHpScaling: baseHpScale * 1.6,
      enemyPowerScaling: basePwrScale * 1.35,
      isMilestone: true,
      isBoss: true,
      bossKey,
      bossPhase,
      milestoneReward: generateMilestoneReward(wave, seed),
      modifiers: activeMods,
      backgroundTheme: bossDef.themeZone,
    };
  }

  // Variable Encounter Format Selection (1v1, 1v2, 1v3, 2v2, 2v3, 3v3)
  let format: DungeonEncounterFormat = '1v1';
  const roll = nextRand();

  if (wave <= 3) {
    format = '1v1';
  } else if (wave <= 7) {
    format = roll < 0.5 ? '1v1' : '1v2';
  } else if (wave <= 14) {
    format = roll < 0.3 ? '1v1' : roll < 0.75 ? '1v2' : '2v2';
  } else if (wave <= 25) {
    format = roll < 0.25 ? '1v2' : roll < 0.65 ? '1v3' : roll < 0.85 ? '2v2' : '2v3';
  } else {
    format = roll < 0.2 ? '1v2' : roll < 0.5 ? '1v3' : roll < 0.75 ? '2v3' : '3v3';
  }

  // Determine number of enemy fighters in this encounter
  const enemyCount = format === '1v1' ? 1 : (format === '1v2' || format === '2v2') ? 2 : 3;

  // Grade target based on wave progression
  let targetGrades: CharacterGrade[] = ['C'];
  if (wave >= 35) {
    targetGrades = ['MYTHIC', 'A'];
  } else if (wave >= 18) {
    targetGrades = ['A', 'MYTHIC', 'B'];
  } else if (wave >= 6) {
    targetGrades = ['B', 'A', 'C'];
  } else {
    targetGrades = ['C', 'B'];
  }

  // Filter pool excluding recent enemies to guarantee variety
  const recentSet = new Set(recentEnemyIds);
  const eligiblePool = ALL_CHARACTERS.filter(c => targetGrades.includes(c.grade) && !recentSet.has(c.id));
  const fallbackPool = ALL_CHARACTERS.filter(c => targetGrades.includes(c.grade));
  const finalPool = eligiblePool.length >= enemyCount ? eligiblePool : (fallbackPool.length >= enemyCount ? fallbackPool : ALL_CHARACTERS);

  // Pick distinct enemy combatants
  const pickedEnemies: Character[] = [];
  const poolCopy = [...finalPool];

  for (let i = 0; i < enemyCount; i++) {
    if (poolCopy.length === 0) poolCopy.push(...ALL_CHARACTERS);
    const pickIdx = Math.floor(nextRand() * poolCopy.length);
    pickedEnemies.push(poolCopy[pickIdx]);
    poolCopy.splice(pickIdx, 1);
  }

  // Balance multi-enemy stats (so 1v2 and 1v3 are challenging yet tactically surmountable)
  const enemyCountHpFactor = enemyCount === 1 ? 1.0 : enemyCount === 2 ? 0.85 : 0.75;
  const enemyCountPwrFactor = enemyCount === 1 ? 1.0 : enemyCount === 2 ? 0.88 : 0.78;

  const enemyNames = pickedEnemies.map(e => e.name).join(' & ');
  const title = `Wave ${wave}: ${enemyNames}`;
  const subtitle = format === '1v1' 
    ? 'Standard Vanguard Duel' 
    : format === '1v2' 
    ? '⚠️ Ambush Duo (1 vs 2)' 
    : format === '1v3' 
    ? '🔥 Triad Onslaught (1 vs 3)' 
    : `⚡ Squad Battle (${format})`;

  return {
    wave,
    title,
    subtitle,
    encounterFormat: format,
    enemies: pickedEnemies,
    enemyHpScaling: baseHpScale * enemyCountHpFactor,
    enemyPowerScaling: basePwrScale * enemyCountPwrFactor,
    isMilestone,
    isBoss: false,
    milestoneReward: isMilestone ? generateMilestoneReward(wave, seed) : undefined,
    modifiers: activeMods,
    backgroundTheme: zone,
  };
}

export function generateBranchingDungeonMap(
  totalFloors: number = 50,
  seed: number = Date.now()
): Record<string, DungeonNode> {
  const nodes: Record<string, DungeonNode> = {};
  let pseudoRandom = seed % 2147483647;
  const nextRand = () => {
    pseudoRandom = (pseudoRandom * 16807) % 2147483647;
    return (pseudoRandom - 1) / 2147483646;
  };

  const floorLayers: string[][] = [];

  for (let floor = 1; floor <= totalFloors; floor++) {
    const isBossFloor = floor % 10 === 0 || floor === totalFloors;
    const isMiniBossFloor = floor % 5 === 0 && !isBossFloor;
    const width = isBossFloor ? 1 : isMiniBossFloor ? 2 : Math.floor(nextRand() * 2) + 2; // 2 or 3 paths

    const currentLayerIds: string[] = [];

    for (let pos = 0; pos < width; pos++) {
      const nodeId = `node-f${floor}-p${pos}`;
      currentLayerIds.push(nodeId);

      let type: DungeonNodeType = 'BATTLE';
      let title = `Floor ${floor} Encounter`;
      let description = 'Enemy vanguard detected.';
      let icon = '⚔️';
      let color = 'from-red-600 to-amber-700';

      if (isBossFloor) {
        type = 'BOSS';
        const zone = getZoneForFloor(floor);
        const bossKey =
          zone === 'KNULL_VOID'
            ? 'knull'
            : zone === 'DOOM_BASTION'
            ? 'doctor_doom'
            : zone === 'COSMIC_CRUCIBLE'
            ? 'thanos'
            : 'galactus';
        const bossDef = DUNGEON_BOSSES[bossKey] || DUNGEON_BOSSES.knull;
        title = `BOSS: ${bossDef.name.toUpperCase()}`;
        description = bossDef.title;
        icon = '👹';
        color = 'from-red-600 via-purple-700 to-black';
      } else if (isMiniBossFloor) {
        type = 'MINI_BOSS';
        title = `Floor ${floor} Mini-Boss Trial`;
        description = 'A powerful champion and sub-commanders guard the gateway.';
        icon = '👑';
        color = 'from-amber-500 to-orange-700';
      } else if (floor % 7 === 0 && pos === 0) {
        type = 'SHOP';
        title = 'Dungeon Outpost Merchant';
        description = 'Restock relics, health potions, and draft shards.';
        icon = '🛒';
        color = 'from-cyan-600 to-blue-800';
      } else if (floor % 4 === 0 && pos === width - 1) {
        type = 'HEALING';
        title = 'Ancient Healing Sanctuary';
        description = 'Rest and restore HP or revive a fallen comrade.';
        icon = '❤️';
        color = 'from-emerald-600 to-teal-800';
      } else if (floor % 6 === 0 && pos === 1) {
        type = 'EVENT';
        title = 'Multiverse Mystery Anomaly';
        description = 'A strange rift opens with unpredictable consequences.';
        icon = '❓';
        color = 'from-purple-600 to-pink-800';
      } else if (floor % 8 === 0 && pos === 0) {
        type = 'TREASURE';
        title = 'Gilded Relic Vault';
        description = 'High Astra cache and ancient chest.';
        icon = '💎';
        color = 'from-yellow-500 to-amber-600';
      } else {
        const roll = nextRand();
        if (roll < 0.25 && floor >= 4) {
          type = 'ELITE';
          title = `Elite Floor ${floor} Clash`;
          description = 'High-threat elite combatants with guaranteed relic drops.';
          icon = '💀';
          color = 'from-rose-700 to-purple-900';
        } else if (roll < 0.35) {
          type = 'ASTRA_CACHE';
          title = 'Astra Crystal Vein';
          description = 'Rich cluster of raw Astra crystals.';
          icon = '💰';
          color = 'from-amber-400 to-yellow-600';
        } else if (roll < 0.45) {
          type = 'SHARD_RIFT';
          title = 'Quantum Shard Rift';
          description = 'Multiverse draft shards condensed in the rift.';
          icon = '🧩';
          color = 'from-indigo-500 to-blue-700';
        } else if (roll < 0.52) {
          type = 'CRATE_VAULT';
          title = 'Ancient Mystery Crate Chamber';
          description = 'A sealed crate from the ancient wars.';
          icon = '📦';
          color = 'from-purple-500 to-indigo-600';
        } else {
          type = 'BATTLE';
          title = `Floor ${floor} Encounter`;
          description = 'Hostile enemy unit blocking the corridor.';
          icon = '⚔️';
          color = 'from-red-600 to-slate-800';
        }
      }

      nodes[nodeId] = {
        id: nodeId,
        floor,
        type,
        title,
        description,
        icon,
        color,
        nextIds: [],
        isCompleted: false,
        isAvailable: floor === 1,
        isCurrent: false,
        isMultiWave: type === 'ELITE' || type === 'MINI_BOSS' || type === 'BOSS',
        totalWaves: type === 'BOSS' ? 3 : type === 'MINI_BOSS' ? 2 : type === 'ELITE' ? 2 : 1,
      };
    }

    floorLayers.push(currentLayerIds);
  }

  // Connect adjacent floor layers with realistic branching paths
  for (let f = 0; f < floorLayers.length - 1; f++) {
    const currentLayer = floorLayers[f];
    const nextLayer = floorLayers[f + 1];

    currentLayer.forEach((currId, cIdx) => {
      const node = nodes[currId];
      if (!node) return;

      if (nextLayer.length === 1) {
        node.nextIds = [nextLayer[0]];
      } else if (currentLayer.length === 1) {
        node.nextIds = [...nextLayer];
      } else {
        // Connect to same relative index and neighboring index
        const targetIdx1 = Math.min(nextLayer.length - 1, cIdx);
        const targetIdx2 = Math.min(nextLayer.length - 1, Math.max(0, cIdx + (cIdx % 2 === 0 ? 1 : -1)));
        node.nextIds = Array.from(new Set([nextLayer[targetIdx1], nextLayer[targetIdx2]].filter(Boolean)));
      }
    });
  }

  return nodes;
}

// ============================================================
// 6. SHOP INVENTORY GENERATORS
// ============================================================

export function generateShopInventory(floor: number): DungeonShopItem[] {
  const items: DungeonShopItem[] = [];

  // 1. Healing Potion (Restores 45% team HP)
  items.push({
    id: `shop-heal-${floor}-${Date.now()}`,
    type: 'HEAL_POTION',
    name: 'Nano-Medkit Ampoule',
    description: 'Instantly restores +45% HP to all living squad members.',
    icon: '🧪',
    rarity: 'COMMON',
    costAstra: Math.round(150 + floor * 5),
    isPurchased: false,
    healAmount: 45,
  });

  // 2. Revival Stimulant (Revives fallen comrade at 50% HP)
  items.push({
    id: `shop-revive-${floor}-${Date.now()}`,
    type: 'REVIVE_STIM',
    name: 'Defibrillator Stim Core',
    description: 'Revives 1 fallen team member back to life at 50% HP.',
    icon: '💉',
    rarity: 'RARE',
    costAstra: Math.round(350 + floor * 8),
    isPurchased: false,
  });

  // 3. Draft Shards Package
  const categories = ['B', 'A', 'MYTHIC', 'HERO', 'VILLAIN'];
  const chosenCategory = categories[Math.floor(Math.random() * categories.length)];
  items.push({
    id: `shop-shards-${floor}-${Date.now()}`,
    type: 'DRAFT_SHARD_PACK',
    name: `${chosenCategory} Draft Shards (x15)`,
    description: `Valuable ${chosenCategory} Category Draft Shards added directly to your Ascension collection.`,
    icon: '🧩',
    rarity: chosenCategory === 'MYTHIC' ? 'MYTHIC' : 'RARE',
    costAstra: chosenCategory === 'MYTHIC' ? 600 : 350,
    isPurchased: false,
    shardsAmount: 15,
    shardCategory: chosenCategory,
  });

  // 4. Random Roguelite Relics (2 or 3 relics)
  const shuffledRelics = [...ALL_DUNGEON_RELICS].sort(() => Math.random() - 0.5).slice(0, 3);
  shuffledRelics.forEach((relic, idx) => {
    items.push({
      id: `shop-relic-${relic.id}-${floor}-${idx}`,
      type: 'RELIC',
      name: relic.name,
      description: relic.description,
      icon: relic.icon,
      rarity: relic.rarity,
      costAstra: Math.round(relic.costAstra * (1 + floor * 0.02)),
      isPurchased: false,
      relic,
    });
  });

  return items;
}

export function generatePrepShopInventory(): DungeonShopItem[] {
  return [
    {
      id: 'prep-heal-1',
      type: 'HEAL_POTION',
      name: 'Standard Med-Kit',
      description: 'Provides +1 starting healing potion for the expedition.',
      icon: '🧪',
      rarity: 'COMMON',
      costAstra: 150,
      isPurchased: false,
      healAmount: 40,
    },
    {
      id: 'prep-stim-1',
      type: 'REVIVE_STIM',
      name: 'Emergency Revival Stim',
      description: 'Provides +1 field revival stimulant to restore a fallen hero.',
      icon: '💉',
      rarity: 'RARE',
      costAstra: 350,
      isPurchased: false,
    },
    {
      id: 'prep-core-power',
      type: 'STAT_CORE',
      name: 'Overcharge Power Matrix',
      description: 'Increases all team damage by +15% for the entire expedition.',
      icon: '⚔️',
      rarity: 'RARE',
      costAstra: 300,
      isPurchased: false,
      statBoost: { power: 15 },
    },
    {
      id: 'prep-core-shield',
      type: 'STAT_CORE',
      name: 'Kinetic Bastion Matrix',
      description: 'Grants +15% damage reduction for the entire team.',
      icon: '🛡️',
      rarity: 'RARE',
      costAstra: 300,
      isPurchased: false,
      statBoost: { defense: 15 },
    },
    {
      id: 'prep-core-regen',
      type: 'STAT_CORE',
      name: 'Vitality Infusion Core',
      description: 'Team recovers +5% HP after each round of combat.',
      icon: '💚',
      rarity: 'RARE',
      costAstra: 350,
      isPurchased: false,
      statBoost: { hp: 20 },
    },
  ];
}

// ============================================================
// 7. ENEMY & BOSS GENERATION
// ============================================================

export function selectDungeonEnemyTeam(
  floor: number,
  wave: number = 1,
  isElite: boolean = false,
  isMiniBoss: boolean = false
): Character[] {
  let targetGrade: CharacterGrade = 'C';

  if (floor >= 40 || (floor >= 25 && isElite)) {
    targetGrade = 'MYTHIC';
  } else if (floor >= 20 || (floor >= 12 && isElite) || isMiniBoss) {
    targetGrade = 'A';
  } else if (floor >= 8 || isElite) {
    targetGrade = 'B';
  } else {
    targetGrade = 'C';
  }

  const primaryPool =
    CHARACTERS_BY_GRADE[targetGrade] && CHARACTERS_BY_GRADE[targetGrade].length > 0
      ? CHARACTERS_BY_GRADE[targetGrade]
      : ALL_CHARACTERS;

  const teamSize = isMiniBoss ? 2 : isElite ? 2 : 1;
  const team: Character[] = [];

  for (let i = 0; i < teamSize; i++) {
    const picked = primaryPool[Math.floor(Math.random() * primaryPool.length)];
    team.push(picked);
  }

  return team;
}

export function generateEnemyIntentForTurn(
  enemy: Character,
  floor: number,
  isBoss: boolean = false,
  bossPhase?: DungeonBossPhase
): EnemyIntentInfo {
  if (isBoss && bossPhase) {
    return {
      type: 'BOSS_PHASE_SPECIAL',
      title: `${bossPhase.specialAbilityName.toUpperCase()}`,
      description: `${bossPhase.mechanicDescription}`,
      counterRecommendation: 'DEFEND & COUNTER or EVADE & AMBUSH immediately to avoid wipe!',
      icon: '👹',
    };
  }

  const stats = enemy.stats;
  const isCosmic = isBoss || enemy.grade === 'MYTHIC' || floor >= 35;

  if (isCosmic && Math.random() < 0.35) {
    return {
      type: 'COSMIC_ANNIHILATION',
      title: 'COSMIC ANNIHILATION BURST',
      description: 'Channeling a catastrophic multiversal energy beam. Extreme incoming damage!',
      counterRecommendation: 'DEFEND & COUNTER absorbs 75% or EVADE & AMBUSH to flank!',
      icon: '🌌',
    };
  }

  const possible: EnemyIntentType[] = [];
  if (stats.strength > 80 || stats.strength >= stats.energy) possible.push('HEAVY_SLUGGER');
  if (stats.durability > 80 || stats.durability > stats.speed) possible.push('IRON_FORTRESS');
  if (stats.energy > 80 || stats.energy > stats.strength) possible.push('ENERGY_SURGE');
  if (stats.speed > 75 || stats.combat > 80) possible.push('SHADOW_STRIKE');

  if (possible.length === 0) possible.push('HEAVY_SLUGGER', 'ENERGY_SURGE', 'IRON_FORTRESS', 'SHADOW_STRIKE');
  const chosen = possible[Math.floor(Math.random() * possible.length)];

  switch (chosen) {
    case 'HEAVY_SLUGGER':
      return {
        type: 'HEAVY_SLUGGER',
        title: 'HEAVY IMPACT SLUGGER',
        description: 'Telegraphing a massive physical power strike.',
        counterRecommendation: 'DEFEND & COUNTER absorbs 75% damage and reflects punishing counter!',
        icon: '🔨',
      };
    case 'IRON_FORTRESS':
      return {
        type: 'IRON_FORTRESS',
        title: 'IRON FORTRESS BARRIER',
        description: 'Hardening kinetic shield to deflect direct physical strikes.',
        counterRecommendation: 'SPECIAL BLAST pierces and shatters armor (+70% damage)!',
        icon: '🛡️',
      };
    case 'ENERGY_SURGE':
      return {
        type: 'ENERGY_SURGE',
        title: 'ENERGY CORE OVERCHARGE',
        description: 'Concentrating high-output plasma beam in charge stance.',
        counterRecommendation: 'DIRECT STRIKE interrupts charging or EVADE & AMBUSH flanks!',
        icon: '⚡',
      };
    case 'SHADOW_STRIKE':
      return {
        type: 'SHADOW_STRIKE',
        title: 'AGILE SHADOW AMBUSH',
        description: 'Maneuvering for an evasion strike.',
        counterRecommendation: 'DEFEND & COUNTER traps high-speed assault!',
        icon: '💨',
      };
    default:
      return {
        type: 'HEAVY_SLUGGER',
        title: 'DIRECT STRIKE',
        description: 'Telegraphing standard assault.',
        counterRecommendation: 'DEFEND & COUNTER recommended.',
        icon: '⚔️',
      };
  }
}

// ============================================================
// 8. TACTICAL COMBAT SIMULATOR WITH REAL STATS & RELIC SYNERGIES
// ============================================================

export function calculateDungeonHeroBaseStats(
  character: Character,
  ascensionLevel: number = 1,
  boosts?: { power?: number; hp?: number; defense?: number; speed?: number }
): {
  maxHp: number;
  basePower: number;
  defense: number;
  speed: number;
  role: 'TANK' | 'DPS' | 'SUPPORT' | 'HEALER' | 'CONTROL' | 'BURST' | 'BALANCED';
} {
  const pStats = character.stats;
  const lvl = Math.max(1, Math.min(50, ascensionLevel));
  const lvlScale = 1 + (lvl - 1) * 0.04; // Level 50 = nearly 3x base stats

  const bPower = boosts?.power || 0;
  const bHp = boosts?.hp || 0;
  const bDef = boosts?.defense || 0;
  const bSpd = boosts?.speed || 0;

  const rawHp = Math.round((pStats.durability * 1.4 + character.overallPower * 0.8 + 120 + bHp) * lvlScale);
  const rawPower = Math.round(((pStats.strength * 0.35 + pStats.energy * 0.35 + pStats.combat * 0.3) + character.overallPower * 0.3 + bPower) * lvlScale);
  const rawDefense = Math.round((pStats.durability * 0.4 + bDef) * lvlScale);
  const rawSpeed = Math.round((pStats.speed * 0.5 + bSpd) * lvlScale);

  let role: 'TANK' | 'DPS' | 'SUPPORT' | 'HEALER' | 'CONTROL' | 'BURST' | 'BALANCED' = 'BALANCED';
  if (pStats.durability >= 85) role = 'TANK';
  else if (pStats.energy >= 85) role = 'BURST';
  else if (pStats.strength >= 85 || pStats.combat >= 85) role = 'DPS';
  else if (pStats.speed >= 85) role = 'CONTROL';

  return {
    maxHp: rawHp,
    basePower: rawPower,
    defense: rawDefense,
    speed: rawSpeed,
    role,
  };
}

export function executeRogueliteCombatTurn(
  heroState: DungeonHeroState,
  heroSkill: CharacterSkill | null,
  enemy: Character,
  enemyIntent: EnemyIntentInfo,
  actionMode: TacticalActionMode,
  runRelics: DungeonRelic[],
  runModifiers: DungeonModifier[],
  teamSize: number = 1,
  currentRound: number = 1,
  currentWave: number = 1,
  isBoss: boolean = false,
  bossPhase?: DungeonBossPhase
): {
  playerDamageDealt: number;
  enemyDamageDealt: number;
  playerHealed: number;
  isPlayerCrit: boolean;
  isEnemyDefeated: boolean;
  combatLogs: DungeonCombatLog[];
} {
  const pStats = heroState.character.stats;
  const eStats = enemy.stats;

  // Grade Base Multiplier
  const gradeScale: Record<string, number> = { C: 1.0, B: 1.25, A: 1.55, MYTHIC: 2.1 };
  const pGradeMult = gradeScale[heroState.character.grade] || 1.0;
  const eGradeMult = gradeScale[enemy.grade] || 1.0;

  // Level & Ascension scaling
  const lvlMult = 1 + (heroState.ascensionLevel - 1) * 0.04;
  let heroPwr = Math.round(((pStats.strength * 0.3 + pStats.energy * 0.3 + pStats.combat * 0.4) * pGradeMult * lvlMult + heroState.bonusPower));
  
  // Wave difficulty scaling
  const wavePwrScale = 1 + (currentWave - 1) * 0.045 + Math.pow(Math.max(0, currentWave - 15), 1.1) * 0.015;
  let enemyPwr = Math.round(((eStats.strength * 0.28 + eStats.energy * 0.28 + eStats.combat * 0.35) * eGradeMult + enemy.overallPower * 0.32) * wavePwrScale);

  // Small team concentrated focus buff
  if (teamSize === 1) {
    heroPwr = Math.round(heroPwr * 1.3); // +30% concentrated boost for solo
  } else if (teamSize === 2) {
    heroPwr = Math.round(heroPwr * 1.2); // +20% for duo
  } else if (teamSize === 3) {
    heroPwr = Math.round(heroPwr * 1.1);
  }

  // Evaluate Relic Multipliers
  let relicDmgBonusPercent = 0;
  let relicDrPercent = 0;
  let relicCritBonus = 0;
  let relicLifesteal = 0;
  let relicRegen = 0;

  runRelics.forEach(relic => {
    switch (relic.effectType) {
      case 'DAMAGE_PERCENT':
        relicDmgBonusPercent += relic.value;
        break;
      case 'DAMAGE_REDUCTION_PERCENT':
        relicDrPercent += relic.value;
        break;
      case 'CRIT_CHANCE':
        relicCritBonus += relic.value / 100;
        break;
      case 'LIFESTEAL_PERCENT':
        relicLifesteal += relic.value / 100;
        break;
      case 'HP_REGEN_PER_ROUND':
        relicRegen += relic.value / 100;
        break;
      case 'FURY_LOW_HP_DAMAGE':
        if (heroState.currentHp / heroState.maxHp < 0.5) {
          relicDmgBonusPercent += relic.value;
        }
        break;
    }
  });

  // Evaluate Modifiers
  runModifiers.forEach(mod => {
    if (mod.id === 'BLOOD_MOON') relicCritBonus += 0.2;
    if (mod.id === 'COSMIC_SURGE' && (heroState.character.grade === 'MYTHIC' || heroState.character.alignment === 'Cosmic')) {
      relicDmgBonusPercent += 30;
    }
    if (mod.id === 'VIBRANIUM_ARMOR') relicDrPercent += 25;
  });

  let pTacticalMult = 1.0;
  let eTacticalMult = 1.0;
  let tacticalAdvantageMsg = '';

  // Evaluate Stance vs Intent
  const intentType = enemyIntent.type;

  if (intentType === 'HEAVY_SLUGGER') {
    if (actionMode === 'DEFEND_COUNTER') {
      eTacticalMult = 0.25;
      pTacticalMult = 1.6;
      tacticalAdvantageMsg = '🛡️ TACTICAL COUNTER! Kinetic guard absorbed 75% damage and punished with a crushing counter!';
    } else if (actionMode === 'EVADE_AMBUSH') {
      eTacticalMult = 0.35;
      pTacticalMult = 1.45;
      tacticalAdvantageMsg = '💨 EVASIVE FLANK! Slid past the heavy hammer swing and struck from behind!';
    } else if (actionMode === 'STRIKE') {
      pTacticalMult = 1.1;
      eTacticalMult = 1.0;
      tacticalAdvantageMsg = '⚔️ Direct trade of heavy physical blows!';
    } else {
      pTacticalMult = 0.9;
      eTacticalMult = 1.25;
      tacticalAdvantageMsg = '⚠️ Caught vulnerable while charging Special Blast!';
    }
  } else if (intentType === 'IRON_FORTRESS') {
    if (actionMode === 'SPECIAL_BLAST') {
      pTacticalMult = 1.75;
      eTacticalMult = 0.6;
      tacticalAdvantageMsg = '⚡ BARRIER BREAKER! Concentrated Special Blast shattered the guardian\'s shield for +75% bonus!';
    } else if (actionMode === 'STRIKE') {
      pTacticalMult = 0.5;
      eTacticalMult = 0.8;
      tacticalAdvantageMsg = '❌ DEFLECTED! Physical strike clanged off fortified vibranium plating!';
    } else if (actionMode === 'DEFEND_COUNTER') {
      pTacticalMult = 0.85;
      eTacticalMult = 0.3;
      tacticalAdvantageMsg = '🛡️ Both duelists maintained defensive postures in a tense standoff.';
    } else {
      pTacticalMult = 1.35;
      eTacticalMult = 0.5;
      tacticalAdvantageMsg = '💨 Acrobatic leap vaulted over the shield wall!';
    }
  } else if (intentType === 'ENERGY_SURGE') {
    if (actionMode === 'STRIKE') {
      pTacticalMult = 1.65;
      eTacticalMult = 0.45;
      tacticalAdvantageMsg = '⚔️ STRIKE INTERRUPT! Direct physical assault broke the enemy\'s charging beam!';
    } else if (actionMode === 'EVADE_AMBUSH') {
      pTacticalMult = 1.6;
      eTacticalMult = 0.25;
      tacticalAdvantageMsg = '💨 HYPERSPACE DODGE! Slipped beneath the energy beam with precision counter!';
    } else if (actionMode === 'DEFEND_COUNTER') {
      eTacticalMult = 0.6;
      pTacticalMult = 1.1;
      tacticalAdvantageMsg = '🛡️ Deflected core energy beam with forward guard.';
    } else {
      pTacticalMult = 1.3;
      eTacticalMult = 1.2;
      tacticalAdvantageMsg = '⚡ Epic energy beam clash illuminated the chamber!';
    }
  } else if (intentType === 'SHADOW_STRIKE') {
    if (actionMode === 'DEFEND_COUNTER') {
      pTacticalMult = 1.7;
      eTacticalMult = 0.25;
      tacticalAdvantageMsg = '🛡️ AMBUSH INTERCEPTED! Caught the high-speed leap and smashed the ambusher!';
    } else if (actionMode === 'SPECIAL_BLAST') {
      pTacticalMult = 1.5;
      eTacticalMult = 0.65;
      tacticalAdvantageMsg = '⚡ Wide-area radial blast caught the agile stalker!';
    } else if (actionMode === 'STRIKE') {
      pTacticalMult = 0.7;
      eTacticalMult = 1.2;
      tacticalAdvantageMsg = '⚠️ Whiffed against the agile target\'s high-speed maneuver!';
    } else {
      pTacticalMult = 1.2;
      eTacticalMult = 0.6;
      tacticalAdvantageMsg = '💨 High-speed duel of reflexes and acrobatics!';
    }
  } else if (intentType === 'COSMIC_ANNIHILATION' || intentType === 'BOSS_PHASE_SPECIAL') {
    if (actionMode === 'DEFEND_COUNTER') {
      eTacticalMult = 0.3;
      pTacticalMult = 1.45;
      tacticalAdvantageMsg = '🛡️ HEROIC FORTITUDE! Withstood the Cosmic Ultimate and held the line!';
    } else if (actionMode === 'EVADE_AMBUSH') {
      eTacticalMult = 0.35;
      pTacticalMult = 1.5;
      tacticalAdvantageMsg = '💨 QUANTUM EVASION! Slipped out of ground zero of the cosmic devastation!';
    } else {
      eTacticalMult = 1.6;
      pTacticalMult = 1.0;
      tacticalAdvantageMsg = '💥 DEVASTATING IMPACT! Suffered the full unrestrained cosmic cataclysm!';
    }
  }

  // Skill Modifiers
  let isPlayerCrit = Math.random() < 0.15 + relicCritBonus;
  let skillBonus = 0;
  let playerHealed = Math.round(heroState.maxHp * relicRegen);

  if (heroSkill) {
    skillBonus = (heroSkill.bonusPower || 10) * 2.5;
    if (heroSkill.effectType === 'critical') isPlayerCrit = true;
    if (heroSkill.effectType === 'lifesteal') playerHealed += Math.round(heroPwr * 0.4);
    if (heroSkill.effectType === 'shield') relicDrPercent += 25;
  }

  // Calculate final damage with variance
  const pVariance = 0.92 + Math.random() * 0.16;
  const eVariance = 0.92 + Math.random() * 0.16;

  let totalPlayerPwr = (heroPwr + skillBonus) * (1 + relicDmgBonusPercent / 100);
  if (isPlayerCrit) totalPlayerPwr *= 1.6;

  const playerDmg = Math.max(12, Math.round(totalPlayerPwr * pTacticalMult * pVariance));

  // Enemy damage reduction from hero defense and relics
  const totalDr = Math.min(0.85, (heroState.bonusDefense * 0.003) + (relicDrPercent / 100));
  let finalEnemyDmg = Math.round(enemyPwr * eTacticalMult * eVariance * (1 - totalDr));
  if (eTacticalMult <= 0.25 && actionMode === 'EVADE_AMBUSH' && Math.random() < 0.4) {
    finalEnemyDmg = 0; // Complete clean dodge!
  }

  if (relicLifesteal > 0 && playerDmg > 0) {
    playerHealed += Math.round(playerDmg * relicLifesteal);
  }

  const logs: DungeonCombatLog[] = [];
  const actionLabels: Record<TacticalActionMode, string> = {
    STRIKE: 'Direct Strike',
    SPECIAL_BLAST: 'Special Blast',
    DEFEND_COUNTER: 'Defend & Counter',
    EVADE_AMBUSH: 'Evade & Ambush',
  };

  logs.push({
    round: currentRound,
    wave: currentWave,
    attackerName: heroState.character.name,
    defenderName: enemy.name,
    actionUsed: heroSkill ? `${heroSkill.name} (${actionLabels[actionMode]})` : actionLabels[actionMode],
    damage: playerDmg,
    isCrit: isPlayerCrit,
    message: `${heroState.character.name} executed [${actionLabels[actionMode]}]${
      heroSkill ? ` + ${heroSkill.name}` : ''
    }, dealing ${playerDmg} DMG! ${tacticalAdvantageMsg}`,
    type: heroSkill ? 'SKILL' : 'ATTACK',
  });

  if (finalEnemyDmg > 0) {
    logs.push({
      round: currentRound,
      wave: currentWave,
      attackerName: enemy.name,
      defenderName: heroState.character.name,
      actionUsed: enemyIntent.title,
      damage: finalEnemyDmg,
      isCrit: false,
      message: `${enemy.name} unleashed [${enemyIntent.title}], dealing ${finalEnemyDmg} DMG!`,
      type: 'ATTACK',
    });
  } else {
    logs.push({
      round: currentRound,
      wave: currentWave,
      attackerName: enemy.name,
      defenderName: heroState.character.name,
      actionUsed: enemyIntent.title,
      damage: 0,
      isCrit: false,
      message: `${enemy.name}'s attack was completely evaded/nullified by ${heroState.character.name}!`,
      type: 'DEFEND',
    });
  }

  if (playerHealed > 0) {
    logs.push({
      round: currentRound,
      wave: currentWave,
      attackerName: heroState.character.name,
      defenderName: heroState.character.name,
      actionUsed: 'Nano-Regen',
      damage: 0,
      isCrit: false,
      message: `💚 ${heroState.character.name} restored +${playerHealed} HP from sustain synergy!`,
      type: 'HEAL',
    });
  }

  return {
    playerDamageDealt: playerDmg,
    enemyDamageDealt: finalEnemyDmg,
    playerHealed,
    isPlayerCrit,
    isEnemyDefeated: false,
    combatLogs: logs,
  };
}

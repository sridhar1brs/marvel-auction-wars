import { Character } from '../../types/game';

export interface CharacterSkill {
  id: string;
  name: string;
  description: string;
  cost: number; // $6 - $15 (Auction Wars)
  astraCost: number; // 500 - 10,000 Astra (Ascension Mode)
  requiredLevel: number; // Character Level requirement (5, 10, 20, 30, 40)
  characterId: string;
  icon: string;
  bonusPower: number;
  triggerRate: number;
  effectType: 'attack' | 'shield' | 'lifesteal' | 'speed_evasion' | 'critical' | 'tactical';
}

// Tailored custom skills for iconic characters
const ICONIC_CHARACTER_SKILLS_RAW: Record<string, Omit<CharacterSkill, 'characterId' | 'requiredLevel' | 'astraCost'>[]> = {
  // Iron Man
  'char-b-002': [
    { id: 'sk-im-1', name: 'Unibeam Overcharge', description: 'Discharges 100% chest reactor output for searing direct energy impact.', cost: 8, icon: '⚡', bonusPower: 8, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-im-2', name: 'Nanotech Kinetic Barrier', description: 'Deploys interlocking nanite hexagonal energy shield absorbing incoming blow.', cost: 10, icon: '🛡️', bonusPower: 6, triggerRate: 0.5, effectType: 'shield' },
    { id: 'sk-im-3', name: 'Micro-Missile Salvo', description: 'Fires shoulder-mounted smart micro-projectiles across the enemy flank.', cost: 7, icon: '🚀', bonusPower: 7, triggerRate: 0.55, effectType: 'attack' },
    { id: 'sk-im-4', name: 'Veronica Orbital Supply', description: 'Calibrates tactical targeting sensors and restores armor integrity.', cost: 9, icon: '🛰️', bonusPower: 5, triggerRate: 0.5, effectType: 'tactical' },
    { id: 'sk-im-5', name: 'Arc Reactor Meltdown', description: 'Overclocks repulsor coils for a devastating critical power surge.', cost: 13, icon: '💥', bonusPower: 12, triggerRate: 0.4, effectType: 'critical' }
  ],
  // Captain America
  'char-b-003': [
    { id: 'sk-cap-1', name: 'Shield Ricochet Vortex', description: 'Hurls the proto-vibranium disc bouncing off angular trajectories.', cost: 7, icon: '🛡️', bonusPower: 7, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-cap-2', name: 'Super Soldier Morale', description: 'Rallies fighting spirit to resist fear, demoralization, and debuffs.', cost: 8, icon: '⭐', bonusPower: 6, triggerRate: 0.55, effectType: 'shield' },
    { id: 'sk-cap-3', name: 'Vibranium Guard Stance', description: 'Plants feet behind the shock-absorbent shield, negating heavy blows.', cost: 10, icon: '🔰', bonusPower: 8, triggerRate: 0.5, effectType: 'shield' },
    { id: 'sk-cap-4', name: 'Tactical Command Blitz', description: 'Analyzes enemy weak points and dictates the tempo of combat.', cost: 9, icon: '🎯', bonusPower: 7, triggerRate: 0.5, effectType: 'tactical' },
    { id: 'sk-cap-5', name: 'Freedom\'s Final Charge', description: 'Charges forward with an unstoppable shield bash dealing critical kinetic force.', cost: 12, icon: '🇺🇸', bonusPower: 11, triggerRate: 0.45, effectType: 'critical' }
  ],
  // Wolverine
  'char-b-005': [
    { id: 'sk-wolv-1', name: 'Adamantium Frenzy', description: 'Unleashes a rapid triple-claw evisceration shredding through steel.', cost: 8, icon: '🩸', bonusPower: 8, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-wolv-2', name: 'Cellular Regeneration', description: 'Mutant healing factor rapidly knits damaged tissue, restoring HP.', cost: 11, icon: '💉', bonusPower: 6, triggerRate: 0.65, effectType: 'lifesteal' },
    { id: 'sk-wolv-3', name: 'Berserker Rage', description: 'Animalistic fury grants ferocious strength bonus at low health.', cost: 10, icon: '🐺', bonusPower: 9, triggerRate: 0.5, effectType: 'attack' },
    { id: 'sk-wolv-4', name: 'Predatory Instincts', description: 'Heightened feral senses detect stealth and incoming strikes.', cost: 7, icon: '👃', bonusPower: 6, triggerRate: 0.55, effectType: 'speed_evasion' },
    { id: 'sk-wolv-5', name: 'Weapon X Execution', description: 'Lethal lunging execution strike dealing overwhelming critical damage.', cost: 14, icon: '⚔️', bonusPower: 13, triggerRate: 0.4, effectType: 'critical' }
  ],
  // Spider-Man
  'char-b-001': [
    { id: 'sk-sp-1', name: 'Impact Web Netting', description: 'Pins opponent limbs in tensile webbing, reducing their speed and attack.', cost: 7, icon: '🕸️', bonusPower: 7, triggerRate: 0.6, effectType: 'tactical' },
    { id: 'sk-sp-2', name: 'Spider-Sense Dodge', description: 'Precognitive danger sense triggers fluid acrobatic evasion.', cost: 10, icon: '🕷️', bonusPower: 8, triggerRate: 0.55, effectType: 'speed_evasion' },
    { id: 'sk-sp-3', name: 'Slingshot Web Kick', description: 'Catapults across the battlefield for a high-velocity aerial kick.', cost: 8, icon: '👟', bonusPower: 8, triggerRate: 0.5, effectType: 'attack' },
    { id: 'sk-sp-4', name: 'Acrobatic Taunt', description: 'Disorients opponent focus with relentless wisecracks.', cost: 6, icon: '🎭', bonusPower: 5, triggerRate: 0.6, effectType: 'tactical' },
    { id: 'sk-sp-5', name: 'Maximum Spider Flurry', description: 'Zigzags with dizzying speed delivering devastating web-assisted strikes.', cost: 13, icon: '💥', bonusPower: 12, triggerRate: 0.45, effectType: 'critical' }
  ],
  // Thanos
  'char-m-010': [
    { id: 'sk-than-1', name: 'Titan Armor Fortification', description: 'Dense celestial armor absorbs raw energy and physical impacts.', cost: 10, icon: '🛡️', bonusPower: 9, triggerRate: 0.55, effectType: 'shield' },
    { id: 'sk-than-2', name: 'Power Stone Obliteration', description: 'Harnesses raw purple cosmic singularity to atomize enemy vanguard.', cost: 12, icon: '🟣', bonusPower: 11, triggerRate: 0.6, effectType: 'attack' },
    { id: 'sk-than-3', name: 'Space Stone Singularity', description: 'Manipulates space-time coordinates to distort enemy attack trajectories.', cost: 11, icon: '🌌', bonusPower: 8, triggerRate: 0.5, effectType: 'speed_evasion' },
    { id: 'sk-than-4', name: 'Reality Stone Transmutation', description: 'Warps opponent matter into bubbles, reducing incoming strike power.', cost: 13, icon: '🔴', bonusPower: 10, triggerRate: 0.45, effectType: 'tactical' },
    { id: 'sk-than-5', name: 'Inevitable Decimation Snap', description: 'Channels all six Infinity Stones into an absolute reality-ending snap.', cost: 15, icon: '🧤', bonusPower: 15, triggerRate: 0.35, effectType: 'critical' }
  ]
};

const LEVEL_REQUIREMENTS = [5, 10, 20, 30, 40];
const ASTRA_COSTS = [500, 1000, 2500, 5000, 10000];

export function getSkillsForCharacter(char: Character): CharacterSkill[] {
  if (!char) return [];

  // Check iconic preset
  if (ICONIC_CHARACTER_SKILLS_RAW[char.id]) {
    return ICONIC_CHARACTER_SKILLS_RAW[char.id].map((skill, idx) => ({
      ...skill,
      characterId: char.id,
      requiredLevel: LEVEL_REQUIREMENTS[idx] || 5,
      astraCost: ASTRA_COSTS[idx] || 500
    }));
  }

  const name = char.name;
  const isMythic = char.grade === 'MYTHIC';
  const isA = char.grade === 'A';
  const isB = char.grade === 'B';

  const baseCost = isMythic ? 10 : isA ? 8 : isB ? 7 : 6;
  const pwrTier = isMythic ? 4 : isA ? 3 : isB ? 2 : 1;

  // Extract first ability name or build thematic skill names
  const ab1 = char.specialAbilities?.[0]?.name || `${name} Strike`;
  const ab2 = char.specialAbilities?.[1]?.name || `${name} Defense`;

  return [
    {
      id: `sk-${char.id}-1`,
      name: `${ab1} Mastery`,
      description: `Channels signature offensive prowess for a heightened strike.`,
      cost: baseCost,
      astraCost: ASTRA_COSTS[0],
      requiredLevel: LEVEL_REQUIREMENTS[0], // Level 5
      characterId: char.id,
      icon: '⚔️',
      bonusPower: 6 + pwrTier,
      triggerRate: 0.6,
      effectType: 'attack'
    },
    {
      id: `sk-${char.id}-2`,
      name: `${name} Kinetic Ward`,
      description: `Erects a protective kinetic aura absorbing incoming damage.`,
      cost: baseCost + 2,
      astraCost: ASTRA_COSTS[1],
      requiredLevel: LEVEL_REQUIREMENTS[1], // Level 10
      characterId: char.id,
      icon: '🛡️',
      bonusPower: 5 + pwrTier,
      triggerRate: 0.5,
      effectType: 'shield'
    },
    {
      id: `sk-${char.id}-3`,
      name: `${name} Acrobatic Evasion`,
      description: `Performs fluid evasive maneuvers to dodge enemy offensive bursts.`,
      cost: baseCost + 3,
      astraCost: ASTRA_COSTS[2],
      requiredLevel: LEVEL_REQUIREMENTS[2], // Level 20
      characterId: char.id,
      icon: '⚡',
      bonusPower: 6 + pwrTier,
      triggerRate: 0.55,
      effectType: 'speed_evasion'
    },
    {
      id: `sk-${char.id}-4`,
      name: `${ab2 || `${name} Vitality Surge`}`,
      description: `Recovers combat vitality and siphons opponent stamina.`,
      cost: baseCost + 4,
      astraCost: ASTRA_COSTS[3],
      requiredLevel: LEVEL_REQUIREMENTS[3], // Level 30
      characterId: char.id,
      icon: '💉',
      bonusPower: 6 + pwrTier,
      triggerRate: 0.5,
      effectType: 'lifesteal'
    },
    {
      id: `sk-${char.id}-5`,
      name: `Prime ${name} Overdrive`,
      description: `Unleashes maximum unlocked potential for a devastating critical blow.`,
      cost: Math.min(15, baseCost + 6),
      astraCost: ASTRA_COSTS[4],
      requiredLevel: LEVEL_REQUIREMENTS[4], // Level 40
      characterId: char.id,
      icon: '💥',
      bonusPower: 10 + pwrTier,
      triggerRate: 0.4,
      effectType: 'critical'
    }
  ];
}

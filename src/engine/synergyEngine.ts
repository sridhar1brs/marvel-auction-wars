import { Character, Faction, SynergyBonus } from '../types/game';

// Comprehensive Marvel Character Faction Mapping
export const FACTION_MEMBERS: Record<Faction, string[]> = {
  'Avengers': [
    'Iron Man', 'Captain America', 'Thor', 'Thor Odinson', 'Hulk', 'Hawkeye', 'Black Widow', 
    'Scarlet Witch', 'Vision', 'War Machine', 'Falcon', 'Ant-Man', 'Janet Van Dyne', 'Hank Pym',
    'Captain Marvel', 'Spider-Man', 'Doctor Strange', 'Black Panther', 'Quicksilver', 
    'Wonder Man', 'She-Hulk', 'Shang-Chi', 'Hercules', 'Tigra', 'Mockingbird', 'Wasp'
  ],
  'Spider-Verse': [
    'Spider-Man', 'Miles Morales', 'Ghost-Spider', 'Silk', 'Spider-Woman', 'Spider-Man 2099', 
    'Scarlet Spider', 'Kaine Parker', 'Symbiote Spider-Man', 'Cosmic Spider-Man', 'Black Cat'
  ],
  'X-Men': [
    'Wolverine', 'Cyclops', 'Jean Grey', 'Storm', 'Gambit', 'Rogue', 'Nightcrawler', 'Colossus', 
    'Beast', 'Iceman', 'Professor X', 'Emma Frost', 'Psylocke', 'Havok', 'Polaris', 'Jubilee', 
    'Bishop', 'Archangel', 'Shadowcat', 'Sunfire', 'Dazzler', 'Armor', 'Cannonball', 'Boom-Boom',
    'Forge', 'Banshee', 'Warpath', 'Longshot', 'Shatterstar', 'Magik', 'Cable', 'X-23', 'Old Man Logan'
  ],
  'Midnight Sons': [
    'Blade', 'Moon Knight', 'Morbius', 'Ghost Rider', 'Doctor Strange', 'Doctor Voodoo', 
    'Clea', 'Magik', 'Black Knight', 'Elsa Bloodstone', 'Werewolf by Night'
  ],
  'Black Order': [
    'Thanos', 'Cull Obsidian', 'Corvus Glaive', 'Proxima Midnight', 'Ebony Maw'
  ],
  'Guardians': [
    'Star-Lord', 'Gamora', 'Drax', 'Groot', 'Rocket Raccoon', 'Mantis', 'Nebula', 
    'Yondu', 'Cosmo', 'Adam Warlock'
  ],
  'Brotherhood': [
    'Magneto', 'Mystique', 'Sabretooth', 'Toad', 'Blob', 'Pyro', 'Avalanche', 
    'Mastermind', 'Destiny', 'Juggernaut'
  ],
  'Sinister Six': [
    'Green Goblin', 'Doctor Octopus', 'Venom', 'Carnage', 'Kraven', 'Mysterio', 
    'Sandman', 'Electro', 'Rhino', 'Vulture', 'Scorpion', 'Shocker', 'Lizard', 'Hobgoblin'
  ],
  'Defenders': [
    'Daredevil', 'Luke Cage', 'Iron Fist', 'Jessica Jones', 'The Punisher', 'Punisher', 
    'Elektra', 'Misty Knight', 'Colleen Wing', 'Echo', 'Bullseye'
  ],
  'Cosmic Entities': [
    'Knull', 'Galactus', 'Silver Surfer', 'Living Tribunal', 'Beyonder', 'Eternity', 
    'Phoenix Force', 'Odin', 'Celestials', 'Gorr', 'Surtur', 'The Void', 'Oblivion', 
    'Shuma-Gorath', 'King in Black Venom', 'Chthon', 'Cyttorak'
  ]
};

export function getCharacterFactions(characterName: string): Faction[] {
  const nameLower = characterName.toLowerCase();
  const matchedFactions: Faction[] = [];

  for (const [faction, members] of Object.entries(FACTION_MEMBERS) as [Faction, string[]][]) {
    if (members.some(m => nameLower.includes(m.toLowerCase()) || m.toLowerCase().includes(nameLower))) {
      matchedFactions.push(faction);
    }
  }

  return matchedFactions;
}

export function calculatePlayerSynergies(collection: Character[]): SynergyBonus[] {
  const factionCounts: Record<Faction, number> = {
    'Avengers': 0,
    'Spider-Verse': 0,
    'X-Men': 0,
    'Midnight Sons': 0,
    'Black Order': 0,
    'Guardians': 0,
    'Brotherhood': 0,
    'Sinister Six': 0,
    'Defenders': 0,
    'Cosmic Entities': 0,
  };

  collection.forEach(char => {
    const factions = getCharacterFactions(char.name);
    factions.forEach(f => {
      factionCounts[f] = (factionCounts[f] || 0) + 1;
    });
  });

  const activeSynergies: SynergyBonus[] = [];

  if (factionCounts['Avengers'] >= 2) {
    activeSynergies.push({
      faction: 'Avengers',
      title: 'Avengers Assemble!',
      count: factionCounts['Avengers'],
      bonusPower: 4,
      description: `+4 Combat Power to all Avengers (${factionCounts['Avengers']} fielded)`,
    });
  }

  if (factionCounts['Spider-Verse'] >= 2) {
    activeSynergies.push({
      faction: 'Spider-Verse',
      title: 'Spider-Verse Link',
      count: factionCounts['Spider-Verse'],
      bonusPower: 5,
      description: `+5 Agility & Evasion Power to all Web-Warriors (${factionCounts['Spider-Verse']} fielded)`,
    });
  }

  if (factionCounts['X-Men'] >= 2) {
    activeSynergies.push({
      faction: 'X-Men',
      title: 'X-Men Strike Force',
      count: factionCounts['X-Men'],
      bonusPower: 5,
      description: `+5 Critical Combat Power to all Mutants (${factionCounts['X-Men']} fielded)`,
    });
  }

  if (factionCounts['Midnight Sons'] >= 2) {
    activeSynergies.push({
      faction: 'Midnight Sons',
      title: 'Midnight Sons Dark Pact',
      count: factionCounts['Midnight Sons'],
      bonusPower: 5,
      description: `+5 Armor-Piercing Dark Magic Power (${factionCounts['Midnight Sons']} fielded)`,
    });
  }

  if (factionCounts['Black Order'] >= 2) {
    activeSynergies.push({
      faction: 'Black Order',
      title: 'Black Order Cosmic Terror',
      count: factionCounts['Black Order'],
      bonusPower: 6,
      description: `+6 Dominance Power for Thanos and his generals (${factionCounts['Black Order']} fielded)`,
    });
  }

  if (factionCounts['Guardians'] >= 2) {
    activeSynergies.push({
      faction: 'Guardians',
      title: 'Guardians of the Galaxy',
      count: factionCounts['Guardians'],
      bonusPower: 4,
      description: `+4 Outlaw Synergy Power (${factionCounts['Guardians']} fielded)`,
    });
  }

  if (factionCounts['Sinister Six'] >= 2) {
    activeSynergies.push({
      faction: 'Sinister Six',
      title: 'Sinister Syndicate',
      count: factionCounts['Sinister Six'],
      bonusPower: 5,
      description: `+5 Villainous Chaos Strike Power (${factionCounts['Sinister Six']} fielded)`,
    });
  }

  if (factionCounts['Defenders'] >= 2) {
    activeSynergies.push({
      faction: 'Defenders',
      title: 'Defenders of the Street',
      count: factionCounts['Defenders'],
      bonusPower: 4,
      description: `+4 Unbreakable Willpower (${factionCounts['Defenders']} fielded)`,
    });
  }

  if (factionCounts['Cosmic Entities'] >= 2) {
    activeSynergies.push({
      faction: 'Cosmic Entities',
      title: 'Cosmic Pantheon',
      count: factionCounts['Cosmic Entities'],
      bonusPower: 6,
      description: `+6 Universal Reality-Warping Power (${factionCounts['Cosmic Entities']} fielded)`,
    });
  }

  return activeSynergies;
}

export function getSynergyBonusForCharacter(character: Character, synergies: SynergyBonus[]): number {
  let totalBonus = 0;
  const factions = getCharacterFactions(character.name);

  synergies.forEach(syn => {
    if (factions.includes(syn.faction)) {
      totalBonus += syn.bonusPower;
    }
  });

  return totalBonus;
}

// 12 Iconic Marvel Tag-Team Dual Combos
export interface TagTeamCombo {
  id: string;
  hero1Name: string;
  hero2Name: string;
  comboTitle: string;
  comboDescription: string;
  bonusDualDamage: number;
  bannerColor: string;
  auraType: 'cosmic' | 'lightning' | 'gamma' | 'chaos' | 'symbiote' | 'fire';
}

export const TAG_TEAM_COMBOS: TagTeamCombo[] = [
  {
    id: 'combo-avengers-trinity',
    hero1Name: 'Iron Man',
    hero2Name: 'Captain America',
    comboTitle: 'AVENGERS ASSEMBLE: SHIELD REPULSOR OVERLOAD',
    comboDescription: 'Iron Man fires unibeams directly off Captain America\'s Vibranium Shield, creating a 360-degree refracted energy super-blast!',
    bonusDualDamage: 22,
    bannerColor: '#DC2626',
    auraType: 'lightning',
  },
  {
    id: 'combo-weapon-x',
    hero1Name: 'Wolverine',
    hero2Name: 'Deadpool',
    comboTitle: 'WEAPON X: MAXIMUM BERSERKER BARRAGE',
    comboDescription: 'Wolverine and Deadpool unleash an unstoppable whirlwind of dual adamantium katanas and claws with dual healing factors!',
    bonusDualDamage: 24,
    bannerColor: '#E11D48',
    auraType: 'chaos',
  },
  {
    id: 'combo-asgardian-gods',
    hero1Name: 'Thor',
    hero2Name: 'Loki',
    comboTitle: 'ASGARDIAN THUNDER & ILLUSION GOD-STRIKE',
    comboDescription: 'Loki confuses the foe with 10 mirrored illusions while Thor drops a catastrophic Mjolnir lightning bolt from above!',
    bonusDualDamage: 22,
    bannerColor: '#0284C7',
    auraType: 'lightning',
  },
  {
    id: 'combo-lethal-protectors',
    hero1Name: 'Spider-Man',
    hero2Name: 'Venom',
    comboTitle: 'MAXIMUM CARNAGE: SYMBIOTE WEB LAUNCH',
    comboDescription: 'Venom catapults Spider-Man wrapped in dense symbiote webbing for a supersonic concussive dropkick!',
    bonusDualDamage: 20,
    bannerColor: '#334155',
    auraType: 'symbiote',
  },
  {
    id: 'combo-chaos-mystics',
    hero1Name: 'Doctor Strange',
    hero2Name: 'Scarlet Witch',
    comboTitle: 'CHAOS MYSTIC REALITY TEAR',
    comboDescription: 'Doctor Strange opens the Mirror Dimension while Wanda floods it with raw Chaos Magic, warping space-time to crush the target!',
    bonusDualDamage: 26,
    bannerColor: '#7C3AED',
    auraType: 'chaos',
  },
  {
    id: 'combo-cosmic-annihilation',
    hero1Name: 'Thanos',
    hero2Name: 'Knull',
    comboTitle: 'COSMIC MULTIVERSE OBLIVION',
    comboDescription: 'The Mad Titan channels the Infinity Gauntlet alongside the All-Black Necrosword, severing the fabric of existence!',
    bonusDualDamage: 30,
    bannerColor: '#881337',
    auraType: 'cosmic',
  },
  {
    id: 'combo-gamma-titans',
    hero1Name: 'Hulk',
    hero2Name: 'She-Hulk',
    comboTitle: 'GAMMA WORLD-BREAKER EARTHQUAKE',
    comboDescription: 'Bruce and Jennifer smash the tectonic plates simultaneously, triggering a Richter-10 gamma shockwave across the arena!',
    bonusDualDamage: 24,
    bannerColor: '#15803D',
    auraType: 'gamma',
  },
  {
    id: 'combo-mutant-genesis',
    hero1Name: 'Magneto',
    hero2Name: 'Professor X',
    comboTitle: 'MUTANT GENESIS: PSY-MAGNETIC PULSE',
    comboDescription: 'Charles paralyzes the opponent\'s mind while Magneto collapses dense magnetic iron filings into a crushing singularity!',
    bonusDualDamage: 25,
    bannerColor: '#9333EA',
    auraType: 'chaos',
  },
  {
    id: 'combo-guardians-blaster',
    hero1Name: 'Star-Lord',
    hero2Name: 'Rocket Raccoon',
    comboTitle: 'HADRON ENFORCER MOON-SHATTER CANNON',
    comboDescription: 'Rocket mounts Peter\'s shoulders wielding a customized Hadron Enforcer particle cannon with double plasma yield!',
    bonusDualDamage: 21,
    bannerColor: '#EA580C',
    auraType: 'cosmic',
  },
  {
    id: 'combo-hells-kitchen',
    hero1Name: 'Daredevil',
    hero2Name: 'The Punisher',
    comboTitle: 'HELL\'S KITCHEN SUPREME RETRIBUTION',
    comboDescription: 'Daredevil disarms the enemy at close quarters while Frank Castle unloads high-caliber armor-piercing artillery!',
    bonusDualDamage: 18,
    bannerColor: '#991B1B',
    auraType: 'fire',
  },
  {
    id: 'combo-wakandan-royalty',
    hero1Name: 'Black Panther',
    hero2Name: 'Storm',
    comboTitle: 'WAKANDAN ROYAL TEMPEST',
    comboDescription: 'Ororo calls down hurricane gale winds while T\'Challa detonates an overcharged kinetic vibranium energy pulse!',
    bonusDualDamage: 23,
    bannerColor: '#6366F1',
    auraType: 'lightning',
  },
  {
    id: 'combo-midnight-knights',
    hero1Name: 'Ghost Rider',
    hero2Name: 'Blade',
    comboTitle: 'DAMNATION HELLFIRE BLADE',
    comboDescription: 'Ghost Rider ignites Blade\'s titanium broadsword with eternal Hellfire, delivering an unholy soul-scorching slice!',
    bonusDualDamage: 22,
    bannerColor: '#F97316',
    auraType: 'fire',
  }
];

export function getActiveTagTeamCombos(collection: Character[]): TagTeamCombo[] {
  const active: TagTeamCombo[] = [];
  if (!collection || !Array.isArray(collection)) return active;
  const names = collection.filter(Boolean).map(c => (c.name || '').toLowerCase());

  TAG_TEAM_COMBOS.forEach(combo => {
    const hasH1 = names.some(n => n.includes(combo.hero1Name.toLowerCase()) || combo.hero1Name.toLowerCase().includes(n));
    const hasH2 = names.some(n => n.includes(combo.hero2Name.toLowerCase()) || combo.hero2Name.toLowerCase().includes(n));
    if (hasH1 && hasH2) {
      active.push(combo);
    }
  });

  return active;
}

export function getFighterTagTeamCombo(fighter: Character, team: Character[]): TagTeamCombo | null {
  if (!fighter || !fighter.name || !team || !Array.isArray(team)) return null;
  const fighterName = fighter.name.toLowerCase();
  const teamNames = team.filter(Boolean).map(c => (c.name || '').toLowerCase());

  for (const combo of TAG_TEAM_COMBOS) {
    const h1 = combo.hero1Name.toLowerCase();
    const h2 = combo.hero2Name.toLowerCase();

    const isH1 = fighterName.includes(h1) || h1.includes(fighterName);
    const isH2 = fighterName.includes(h2) || h2.includes(fighterName);

    if (isH1) {
      // Check if partner h2 is on the team
      if (teamNames.some(n => n.includes(h2) || h2.includes(n))) {
        return combo;
      }
    } else if (isH2) {
      // Check if partner h1 is on the team
      if (teamNames.some(n => n.includes(h1) || h1.includes(n))) {
        return combo;
      }
    }
  }

  return null;
}


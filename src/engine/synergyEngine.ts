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

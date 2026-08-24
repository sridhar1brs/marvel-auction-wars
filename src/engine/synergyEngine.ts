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

// 80 Iconic Marvel Tag-Team Dual Combos Engine (Original 12 + 68 New Combos)
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
  // 1. Classic Trinity & Original 12
  {
    id: 'combo-avengers-trinity',
    hero1Name: 'Iron Man',
    hero2Name: 'Captain America',
    comboTitle: 'AVENGERS ASSEMBLE: SHIELD REPULSOR OVERLOAD',
    comboDescription: 'Iron Man fires maximum unibeams directly off Captain America\'s Vibranium Shield, creating a 360-degree refracted energy super-blast!',
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
  },

  // 2. Spider-Verse & Web-Warriors (Combos 13-20)
  {
    id: 'combo-spider-generations',
    hero1Name: 'Spider-Man',
    hero2Name: 'Miles Morales',
    comboTitle: 'BROOKLYN VENOM-WEB THWIP-STRIKE',
    comboDescription: 'Peter wraps the target in high-tensile impact webbing while Miles channels a 50,000-volt bio-electric Venom Blast!',
    bonusDualDamage: 23,
    bannerColor: '#EF4444',
    auraType: 'lightning',
  },
  {
    id: 'combo-ghost-silk',
    hero1Name: 'Ghost-Spider',
    hero2Name: 'Silk',
    comboTitle: 'MULTIVERSE DRUMBEAT SILK ENTANGLEMENT',
    comboDescription: 'Gwen executes acrobatic aerial kicks while Cindy Moon spins organic barbed silk ribbons binding the target immobilized!',
    bonusDualDamage: 20,
    bannerColor: '#EC4899',
    auraType: 'symbiote',
  },
  {
    id: 'combo-spider-2099',
    hero1Name: 'Spider-Man 2099',
    hero2Name: 'Spider-Man',
    comboTitle: 'CHRONO-TALON MULTIVERSE SLAM',
    comboDescription: 'Miguel O\'Hara dives with futuristic solid-light antigravity claws while Peter swings in for a devastating double-heel drop!',
    bonusDualDamage: 22,
    bannerColor: '#1E40AF',
    auraType: 'cosmic',
  },
  {
    id: 'combo-black-cat-spidey',
    hero1Name: 'Spider-Man',
    hero2Name: 'Black Cat',
    comboTitle: 'BAD LUCK CAT BURGLAR DIVE',
    comboDescription: 'Felicia hexes the target with bad-luck probability shifts right as Peter delivers a blinding swing-kick!',
    bonusDualDamage: 19,
    bannerColor: '#475569',
    auraType: 'chaos',
  },
  {
    id: 'combo-scarlet-spiders',
    hero1Name: 'Scarlet Spider',
    hero2Name: 'Kaine Parker',
    comboTitle: 'CLONE CONSPIRACY: STINGER IMPALEMENT',
    comboDescription: 'Ben Reilly blinds with impact web clusters while Kaine pops razor-sharp arm bone stingers for brutal piercing damage!',
    bonusDualDamage: 21,
    bannerColor: '#B91C1C',
    auraType: 'fire',
  },
  {
    id: 'combo-maximum-symbiosis',
    hero1Name: 'Venom',
    hero2Name: 'Carnage',
    comboTitle: 'ABSOLUTE CARNAGE: RED & BLACK SANGUINE MAELSTROM',
    comboDescription: 'Venom and Carnage merge their tendrils into an apocalyptic blood-axe tsunami slashing through all shields!',
    bonusDualDamage: 26,
    bannerColor: '#991B1B',
    auraType: 'symbiote',
  },
  {
    id: 'combo-symbiote-king',
    hero1Name: 'King in Black Venom',
    hero2Name: 'Knull',
    comboTitle: 'NECRO-VOID APOCALYPSE BLADE',
    comboDescription: 'The Symbiote God and Eddie Brock summon a billion necro-tendrils blotting out the sun and eviscerating the target!',
    bonusDualDamage: 32,
    bannerColor: '#0F172A',
    auraType: 'symbiote',
  },
  {
    id: 'combo-spider-woman-captain-marvel',
    hero1Name: 'Spider-Woman',
    hero2Name: 'Captain Marvel',
    comboTitle: 'VENOM BLAST BINARY BOMBARDMENT',
    comboDescription: 'Jessica Drew shocks with bio-electric venom blasts while Carol Danvers descends in blazing Binary cosmic fury!',
    bonusDualDamage: 24,
    bannerColor: '#F59E0B',
    auraType: 'cosmic',
  },

  // 3. X-Men & Mutant Powerhouses (Combos 21-35)
  {
    id: 'combo-fastball-special',
    hero1Name: 'Colossus',
    hero2Name: 'Wolverine',
    comboTitle: 'CLASSIC FASTBALL SPECIAL!',
    comboDescription: 'Colossus hurls Wolverine at Mach-2 speeds with fully unsheathed adamantium claws slicing through armored titans!',
    bonusDualDamage: 25,
    bannerColor: '#B45309',
    auraType: 'gamma',
  },
  {
    id: 'combo-cyclops-jean',
    hero1Name: 'Cyclops',
    hero2Name: 'Jean Grey',
    comboTitle: 'TELEPATHIC OPTIC MEGABLAST',
    comboDescription: 'Jean guides Scott\'s uninhibited dimensional Optic Blast with telekinetic precision directly to vital pressure points!',
    bonusDualDamage: 24,
    bannerColor: '#DC2626',
    auraType: 'chaos',
  },
  {
    id: 'combo-gambit-rogue',
    hero1Name: 'Gambit',
    hero2Name: 'Rogue',
    comboTitle: 'KINETIC SOUTHERN BELLE DETONATION',
    comboDescription: 'Remy supercharges Rogue\'s bare fist with pure kinetic explosive energy as she lands a supersonic haymaker!',
    bonusDualDamage: 23,
    bannerColor: '#16A34A',
    auraType: 'lightning',
  },
  {
    id: 'combo-nightcrawler-colossus',
    hero1Name: 'Nightcrawler',
    hero2Name: 'Colossus',
    comboTitle: 'BAMF! TITANIUM METEOR DROP',
    comboDescription: 'Kurt teleports Colossus 5,000 feet into the upper atmosphere, dropping a 500-ton organic steel missile onto the foe!',
    bonusDualDamage: 22,
    bannerColor: '#4338CA',
    auraType: 'chaos',
  },
  {
    id: 'combo-cable-deadpool',
    hero1Name: 'Cable',
    hero2Name: 'Deadpool',
    comboTitle: 'CHRONO-ARMED MERCENARY MASSACRE',
    comboDescription: 'Nathan Summers locks the target in a temporal telekinetic stasis field while Wade empties every rocket and magazine!',
    bonusDualDamage: 23,
    bannerColor: '#D97706',
    auraType: 'fire',
  },
  {
    id: 'combo-iceman-firestar',
    hero1Name: 'Iceman',
    hero2Name: 'Sunfire',
    comboTitle: 'THERMAL SHOCKWAVE: ABSOLUTE ZERO & SOLAR FLARE',
    comboDescription: 'Bobby Drake flashes freezes the target to 0 Kelvin before Sunfire detonates atomic solar plasma, fracturing armor instantly!',
    bonusDualDamage: 25,
    bannerColor: '#06B6D4',
    auraType: 'fire',
  },
  {
    id: 'combo-magik-colossus',
    hero1Name: 'Magik',
    hero2Name: 'Colossus',
    comboTitle: 'RASPUTIN LIMBO SOULSWORD STRIKE',
    comboDescription: 'Illyana teleports her brother through the demonic realm of Limbo, empowering his steel fists with raw eldritch Soulsword magic!',
    bonusDualDamage: 24,
    bannerColor: '#9333EA',
    auraType: 'chaos',
  },
  {
    id: 'combo-psylocke-wolverine',
    hero1Name: 'Psylocke',
    hero2Name: 'Wolverine',
    comboTitle: 'PSYCHIC ADAMANTIUM CEREBRAL FLURRY',
    comboDescription: 'Betsy pierces the mind with a glowing psychic katana while Logan eviscerates the physical shell with adamantium slashes!',
    bonusDualDamage: 23,
    bannerColor: '#A855F7',
    auraType: 'chaos',
  },
  {
    id: 'combo-bishop-cable',
    hero1Name: 'Bishop',
    hero2Name: 'Cable',
    comboTitle: 'TIME-DISPLACED PLASMA ONSLAUGHT',
    comboDescription: 'Bishop absorbs incoming kinetic blast energy to overload Cable\'s futuristic heavy plasma artillery cannon!',
    bonusDualDamage: 22,
    bannerColor: '#2563EB',
    auraType: 'lightning',
  },
  {
    id: 'combo-phoenix-jean',
    hero1Name: 'Jean Grey',
    hero2Name: 'Phoenix Force',
    comboTitle: 'COSMIC RENAISSANCE: PHOENIX FIRE CLEAVE',
    comboDescription: 'The cosmic entity of life and destruction immolates the entire arena in white-hot psychic flame, disintegrating matter!',
    bonusDualDamage: 32,
    bannerColor: '#F97316',
    auraType: 'fire',
  },
  {
    id: 'combo-magneto-mystique',
    hero1Name: 'Magneto',
    hero2Name: 'Mystique',
    comboTitle: 'BROTHERHOOD SHAPE-SHIFTING AMBUSH',
    comboDescription: 'Raven infiltrates the enemy blind spot to plant magnetic metallic beacons, allowing Magneto to crush the target with railgun velocity!',
    bonusDualDamage: 22,
    bannerColor: '#6B21A8',
    auraType: 'chaos',
  },
  {
    id: 'combo-emma-frost-cyclops',
    hero1Name: 'Emma Frost',
    hero2Name: 'Cyclops',
    comboTitle: 'DIAMOND REFRACTION OPTIC CANNON',
    comboDescription: 'Scott fires a full-power Optic Blast into Emma\'s flawless organic diamond form, scattering hundreds of lethal focused laser beams!',
    bonusDualDamage: 24,
    bannerColor: '#E2E8F0',
    auraType: 'lightning',
  },
  {
    id: 'combo-x23-wolverine',
    hero1Name: 'X-23',
    hero2Name: 'Wolverine',
    comboTitle: 'HEREDITARY ODYSSEY ADAMANTIUM WHIRLWIND',
    comboDescription: 'Logan and Laura attack in tandem with arm and foot talons, creating an inescapable cross-slash blender of slicing metal!',
    bonusDualDamage: 23,
    bannerColor: '#E11D48',
    auraType: 'chaos',
  },
  {
    id: 'combo-juggernaut-blob',
    hero1Name: 'Juggernaut',
    hero2Name: 'Blob',
    comboTitle: 'UNSTOPPABLE GRAVITATIONAL CRUSH',
    comboDescription: 'Blob roots the foe in an immovable gravitational anchor while the Cyttorak-empowered Juggernaut charges like a freight train!',
    bonusDualDamage: 23,
    bannerColor: '#78350F',
    auraType: 'gamma',
  },
  {
    id: 'combo-apocalypse-archangel',
    hero1Name: 'Apocalypse',
    hero2Name: 'Archangel',
    comboTitle: 'HORSEMEN OF DEATH TECHNO-ORGANIC RAIN',
    comboDescription: 'En Sabah Nur enhances Warren\'s metallic razor-wings, firing a million poisonous razor-fletchettes from high orbit!',
    bonusDualDamage: 26,
    bannerColor: '#3B82F6',
    auraType: 'chaos',
  },

  // 4. Avengers & Earth's Mightiest Heroes (Combos 36-50)
  {
    id: 'combo-thunder-and-metal',
    hero1Name: 'Iron Man',
    hero2Name: 'Thor',
    comboTitle: 'MJOLNIR LIGHTNING OVERCHARGED REPULSORS',
    comboDescription: 'Thor channels 1.21 Gigawatts of lightning straight into Tony Stark\'s Arc Reactor, unleashing a 400% overcharged chest beam!',
    bonusDualDamage: 25,
    bannerColor: '#0284C7',
    auraType: 'lightning',
  },
  {
    id: 'combo-cap-thor',
    hero1Name: 'Captain America',
    hero2Name: 'Thor',
    comboTitle: 'WORTHY VIBRANIUM THUNDERCLAP',
    comboDescription: 'Cap hurls his shield as Thor strikes it mid-flight with Mjolnir, projecting a sonic thunder shockwave flattening the arena!',
    bonusDualDamage: 24,
    bannerColor: '#3B82F6',
    auraType: 'lightning',
  },
  {
    id: 'combo-hulk-wolverine',
    hero1Name: 'Hulk',
    hero2Name: 'Wolverine',
    comboTitle: 'GAMMA RAGE & ADAMANTIUM RUPTURE',
    comboDescription: 'Hulk batters the enemy into paste while Logan dives in from above to drive his claws through the ruptured armor!',
    bonusDualDamage: 25,
    bannerColor: '#16A34A',
    auraType: 'gamma',
  },
  {
    id: 'combo-iron-man-war-machine',
    hero1Name: 'Iron Man',
    hero2Name: 'War Machine',
    comboTitle: 'FULL SALVO: BUNKER BUSTER BARRAGE',
    comboDescription: 'Tony and Rhodey lock targeting systems to unload micro-missiles, smart-mines, shoulder miniguns, and dual unibeams!',
    bonusDualDamage: 23,
    bannerColor: '#64748B',
    auraType: 'fire',
  },
  {
    id: 'combo-cap-bucky',
    hero1Name: 'Captain America',
    hero2Name: 'Winter Soldier',
    comboTitle: 'HOWLING COMMANDOS CYBERNETIC CROSSFIRE',
    comboDescription: 'Steve and Bucky pass the Vibranium Shield between seamless boxing combinations and high-impact bionic arm punches!',
    bonusDualDamage: 21,
    bannerColor: '#1E3A8A',
    auraType: 'lightning',
  },
  {
    id: 'combo-falcon-winter-soldier',
    hero1Name: 'Falcon',
    hero2Name: 'Winter Soldier',
    comboTitle: 'AERIAL REDWING & BIONIC OVERRIDE',
    comboDescription: 'Sam swoops in with vibranium wings and Redwing drones to stagger the foe for Bucky\'s crushing bionic haymaker!',
    bonusDualDamage: 20,
    bannerColor: '#DC2626',
    auraType: 'fire',
  },
  {
    id: 'combo-vision-wanda',
    hero1Name: 'Vision',
    hero2Name: 'Scarlet Witch',
    comboTitle: 'SOLAR GEM & CHAOS REALITY TEAR',
    comboDescription: 'Vision increases mass to diamond density while firing the Solar Mind Gem alongside Wanda\'s reality-altering hex rifts!',
    bonusDualDamage: 26,
    bannerColor: '#E11D48',
    auraType: 'chaos',
  },
  {
    id: 'combo-antman-wasp',
    hero1Name: 'Ant-Man',
    hero2Name: 'Wasp',
    comboTitle: 'PYM PARTICLE QUANTUM STINGER STORM',
    comboDescription: 'Scott grows into Giant-Man to swat down the enemy while Janet shrinks to subatomic scale firing stinging bio-lasers from within!',
    bonusDualDamage: 22,
    bannerColor: '#CA8A04',
    auraType: 'cosmic',
  },
  {
    id: 'combo-hawkeye-black-widow',
    hero1Name: 'Hawkeye',
    hero2Name: 'Black Widow',
    comboTitle: 'BUDAPEST TACTICAL TRICK-ARROW AMBUSH',
    comboDescription: 'Natasha restrains the enemy with electric Widow\'s Bite cables while Clint fires a thermite vibranium trick-arrow into the heart!',
    bonusDualDamage: 19,
    bannerColor: '#111827',
    auraType: 'lightning',
  },
  {
    id: 'combo-thor-beta-ray-bill',
    hero1Name: 'Thor',
    hero2Name: 'Beta Ray Bill',
    comboTitle: 'MJOLNIR & STORMBREAKER TWIN GALAXY STORM',
    comboDescription: 'The two worthy warriors clash Mjolnir and Stormbreaker together, calling down an all-father cosmic tempest shattering planets!',
    bonusDualDamage: 27,
    bannerColor: '#0284C7',
    auraType: 'lightning',
  },
  {
    id: 'combo-shang-chi-iron-fist',
    hero1Name: 'Shang-Chi',
    hero2Name: 'Iron Fist',
    comboTitle: 'TEN RINGS & SHOU-LAO DRAGON FIST',
    comboDescription: 'Shang-Chi commands the mythical Ten Rings to corral the enemy into Danny Rand\'s blazing chi-infused dragon fist!',
    bonusDualDamage: 24,
    bannerColor: '#EAB308',
    auraType: 'fire',
  },
  {
    id: 'combo-scarlet-quicksilver',
    hero1Name: 'Scarlet Witch',
    hero2Name: 'Quicksilver',
    comboTitle: 'MAXIMOFF TWIN SUPERSONIC HEX CYCLONE',
    comboDescription: 'Pietro runs at Mach-10 creating a vacuum vortex while Wanda fills the center with crushing chaos hex spheres!',
    bonusDualDamage: 24,
    bannerColor: '#84CC16',
    auraType: 'chaos',
  },
  {
    id: 'combo-black-widow-yelena',
    hero1Name: 'Black Widow',
    hero2Name: 'Yelena Belova',
    comboTitle: 'RED ROOM SISTERHOOD EXCLUSION',
    comboDescription: 'Natasha and Yelena perform flawless synchronized acrobatic takedowns, detonating dual electro-shock stun batons!',
    bonusDualDamage: 20,
    bannerColor: '#DC2626',
    auraType: 'lightning',
  },
  {
    id: 'combo-hercules-thor',
    hero1Name: 'Hercules',
    hero2Name: 'Thor',
    comboTitle: 'GODS OF OLYMPUS & ASGARD BATTLE CRY',
    comboDescription: 'The Prince of Power and God of Thunder deliver a dual god-strength uppercut launching the titan into the stratosphere!',
    bonusDualDamage: 25,
    bannerColor: '#F59E0B',
    auraType: 'lightning',
  },
  {
    id: 'combo-captain-marvel-ms-marvel',
    hero1Name: 'Captain Marvel',
    hero2Name: 'Ms. Marvel',
    comboTitle: 'BINARY EMBIGGENED HARD-LIGHT PUNCH',
    comboDescription: 'Kamala enlarges her fist with crystalline hard-light armor as Carol charges it with raw Binary cosmic photon energy!',
    bonusDualDamage: 23,
    bannerColor: '#0284C7',
    auraType: 'cosmic',
  },

  // 5. Fantastic Four & Cosmic Entities (Combos 51-65)
  {
    id: 'combo-fantastic-duo',
    hero1Name: 'Mister Fantastic',
    hero2Name: 'Invisible Woman',
    comboTitle: 'FORCEFIELD COMPRESSION & ELASTIC SLINGSHOT',
    comboDescription: 'Sue Storm encases the foe in an unbreakable microscopic forcefield while Reed wraps around to catapult a supersonic slam!',
    bonusDualDamage: 24,
    bannerColor: '#2563EB',
    auraType: 'cosmic',
  },
  {
    id: 'combo-torch-thing',
    hero1Name: 'Human Torch',
    hero2Name: 'The Thing',
    comboTitle: 'SUPERNOVA CLOBBERIN\' TIME!',
    comboDescription: 'Johnny Storm unleashes Nova-level heat to superheat the target before Ben Grimm delivers a shattering haymaker punch!',
    bonusDualDamage: 23,
    bannerColor: '#EA580C',
    auraType: 'fire',
  },
  {
    id: 'combo-silver-surfer-galactus',
    hero1Name: 'Silver Surfer',
    hero2Name: 'Galactus',
    comboTitle: 'HERALD OF THE END: POWER COSMIC CATACLYSM',
    comboDescription: 'Norrin Radd opens a cosmic cosmic conduit while Galactus siphons the lifeforce of entire star systems to annihilate the foe!',
    bonusDualDamage: 34,
    bannerColor: '#9333EA',
    auraType: 'cosmic',
  },
  {
    id: 'combo-warlock-thanos',
    hero1Name: 'Adam Warlock',
    hero2Name: 'Thanos',
    comboTitle: 'INFINITY WATCH: SOUL GEM & TIME REVERSAL',
    comboDescription: 'Adam traps the enemy\'s soul in the Soul World while Thanos freezes their physical matter in endless temporal loops!',
    bonusDualDamage: 28,
    bannerColor: '#F59E0B',
    auraType: 'cosmic',
  },
  {
    id: 'combo-nova-surfer',
    hero1Name: 'Nova',
    hero2Name: 'Silver Surfer',
    comboTitle: 'NOVA CORPS & POWER COSMIC CONVERGENCE',
    comboDescription: 'Richard Rider channels the entire Xandarian Worldmind into Silver Surfer\'s board for a lightspeed galaxy-cleaving strike!',
    bonusDualDamage: 26,
    bannerColor: '#38BDF8',
    auraType: 'cosmic',
  },
  {
    id: 'combo-groot-rocket',
    hero1Name: 'Groot',
    hero2Name: 'Rocket Raccoon',
    comboTitle: 'WE ARE GROOT: ROTARY CANNON ROOT TRAP',
    comboDescription: 'Groot roots the enemy in unbreakable wooden tendrils while Rocket rides his head firing micro-missile Gatling cannons!',
    bonusDualDamage: 22,
    bannerColor: '#15803D',
    auraType: 'gamma',
  },
  {
    id: 'combo-gamora-nebula',
    hero1Name: 'Gamora',
    hero2Name: 'Nebula',
    comboTitle: 'DAUGHTERS OF THANOS GODSLAYER BLADES',
    comboDescription: 'Gamora executes lethal acrobatic Godslayer sword strikes while Nebula unleashes overcharged cybernetic energy blasters!',
    bonusDualDamage: 22,
    bannerColor: '#059669',
    auraType: 'cosmic',
  },
  {
    id: 'combo-drax-mantis',
    hero1Name: 'Drax',
    hero2Name: 'Mantis',
    comboTitle: 'EMPATHIC SLEEP & DESTROYER DUAL BLADES',
    comboDescription: 'Mantis touches the target\'s forehead forcing instant catatonic sleep as Drax drives dual daggers deep into their chest!',
    bonusDualDamage: 21,
    bannerColor: '#10B981',
    auraType: 'chaos',
  },
  {
    id: 'combo-thanos-ebony-maw',
    hero1Name: 'Thanos',
    hero2Name: 'Ebony Maw',
    comboTitle: 'BLACK ORDER PSYCHIC DECONSTRUCTION',
    comboDescription: 'Ebony Maw lifts thousands of razor-sharp stone shards telekinetically while Thanos pulverizes the target with the Power Stone!',
    bonusDualDamage: 27,
    bannerColor: '#475569',
    auraType: 'cosmic',
  },
  {
    id: 'combo-gorr-knull',
    hero1Name: 'Gorr',
    hero2Name: 'Knull',
    comboTitle: 'ALL-BLACK GOD-SLAYER ECLIPSE',
    comboDescription: 'The God Butcher and the Void King summon a primordial black hole that slaughters gods and tears through all dimensions!',
    bonusDualDamage: 32,
    bannerColor: '#020617',
    auraType: 'symbiote',
  },
  {
    id: 'combo-sentry-void',
    hero1Name: 'Sentry',
    hero2Name: 'The Void',
    comboTitle: 'ONE MILLION EXPLODING SUNS & VOID SHADOWS',
    comboDescription: 'Robert Reynolds channels the blinding power of a million exploding suns while the Void tears the target apart from inside!',
    bonusDualDamage: 32,
    bannerColor: '#FACC15',
    auraType: 'cosmic',
  },
  {
    id: 'combo-black-bolt-medusa',
    hero1Name: 'Black Bolt',
    hero2Name: 'Medusa',
    comboTitle: 'INHUMAN ROYAL SCREAM & LIVING TENDRILS',
    comboDescription: 'Medusa restrains the target with steel-hard tensile red hair while Black Bolt utters a quasi-sonic whisper leveling mountains!',
    bonusDualDamage: 28,
    bannerColor: '#6366F1',
    auraType: 'lightning',
  },
  {
    id: 'combo-namor-black-panther',
    hero1Name: 'Namor',
    hero2Name: 'Black Panther',
    comboTitle: 'IMPERIUS REX & VIBRANIUM TRIDENT SURGE',
    comboDescription: 'Namor summons a tidal wave of oceanic pressure while T\'Challa detonates vibranium kinetic shock charges beneath the surface!',
    bonusDualDamage: 24,
    bannerColor: '#0D9488',
    auraType: 'lightning',
  },
  {
    id: 'combo-doom-kang',
    hero1Name: 'Doctor Doom',
    hero2Name: 'Kang the Conqueror',
    comboTitle: 'CHRONO-SORCERY OMNIVERSE EXTINCTION',
    comboDescription: 'Doom weaves dark Latverian sorcery while Kang summons armies from across 1,000 timelines to erase the target from history!',
    bonusDualDamage: 30,
    bannerColor: '#059669',
    auraType: 'cosmic',
  },
  {
    id: 'combo-infinity-ultron-thanos',
    hero1Name: 'Infinity Ultron',
    hero2Name: 'Thanos',
    comboTitle: 'TWELVE INFINITY STONES MULTIVERSAL CLEAVE',
    comboDescription: 'The two ultimate conquerors unite twelve Infinity Stones, eradicating the target across all parallel realities simultaneously!',
    bonusDualDamage: 34,
    bannerColor: '#06B6D4',
    auraType: 'cosmic',
  },

  // 6. Midnight Sons & Street Level Champions (Combos 66-80)
  {
    id: 'combo-heroes-for-hire',
    hero1Name: 'Luke Cage',
    hero2Name: 'Iron Fist',
    comboTitle: 'HEROES FOR HIRE: UNBREAKABLE DRAGON IMPACT',
    comboDescription: 'Luke Cage absorbs the brunt of all attacks with impenetrable skin while Danny Rand unleashes the blazing Iron Fist through his back!',
    bonusDualDamage: 22,
    bannerColor: '#EAB308',
    auraType: 'fire',
  },
  {
    id: 'combo-jessica-luke',
    hero1Name: 'Jessica Jones',
    hero2Name: 'Luke Cage',
    comboTitle: 'HARLEM & HELL\'S KITCHEN SEISMIC SLAM',
    comboDescription: 'Jessica lifts the target 50 feet into the air and powerbombs them into Luke Cage\'s titanium-solid waiting uppercut!',
    bonusDualDamage: 21,
    bannerColor: '#334155',
    auraType: 'gamma',
  },
  {
    id: 'combo-moon-knight-blade',
    hero1Name: 'Moon Knight',
    hero2Name: 'Blade',
    comboTitle: 'KHONSHU CRESCENT & SILVER VAMPIRE BANE',
    comboDescription: 'Marc Spector hurls adamantium crescent darts into vital arteries as Blade slices through with silver-plated katana speed!',
    bonusDualDamage: 22,
    bannerColor: '#E2E8F0',
    auraType: 'chaos',
  },
  {
    id: 'combo-strange-clea',
    hero1Name: 'Doctor Strange',
    hero2Name: 'Clea',
    comboTitle: 'DARK DIMENSION FLAMES OF THE FALTORINE',
    comboDescription: 'Strange and Clea combine the Eye of Agamotto with Dark Dimension royal flames, incinerating mystical defenses!',
    bonusDualDamage: 25,
    bannerColor: '#A855F7',
    auraType: 'chaos',
  },
  {
    id: 'combo-strange-wong',
    hero1Name: 'Doctor Strange',
    hero2Name: 'Wong',
    comboTitle: 'KAMAR-TAJ ELDRITCH SLING-RING TRAP',
    comboDescription: 'Wong opens twin sling-ring portals looping the opponent\'s own attacks back at them as Strange unleashes the Vishanti!',
    bonusDualDamage: 22,
    bannerColor: '#D97706',
    auraType: 'chaos',
  },
  {
    id: 'combo-morbius-blade',
    hero1Name: 'Morbius',
    hero2Name: 'Blade',
    comboTitle: 'MIDNIGHT BLOODLINE SANGUINE ASSAULT',
    comboDescription: 'The Living Vampire paralyzes the foe with hypersonic screams while the Daywalker delivers an executioner decaptitation slice!',
    bonusDualDamage: 21,
    bannerColor: '#881337',
    auraType: 'symbiote',
  },
  {
    id: 'combo-she-hulk-daredevil',
    hero1Name: 'She-Hulk',
    hero2Name: 'Daredevil',
    comboTitle: 'LEGAL JUSTICIARS: BILLIE CLUB SMASH',
    comboDescription: 'Daredevil disorients the enemy with sonic ricocheting billy clubs while Jennifer Walters delivers a 100-ton gavel smash!',
    bonusDualDamage: 22,
    bannerColor: '#16A34A',
    auraType: 'gamma',
  },
  {
    id: 'combo-domino-deadpool',
    hero1Name: 'Domino',
    hero2Name: 'Deadpool',
    comboTitle: 'PROBABILITY OVERLOAD: 100% HEADSHOT ACCURACY',
    comboDescription: 'Domino bends the laws of probability so every wild ricochet from Deadpool\'s dual pistols lands as an impossible critical hit!',
    bonusDualDamage: 21,
    bannerColor: '#475569',
    auraType: 'chaos',
  },
  {
    id: 'combo-sabretooth-wolverine',
    hero1Name: 'Sabretooth',
    hero2Name: 'Wolverine',
    comboTitle: 'FERAL RIVALRY BLOODLUST EXECUTION',
    comboDescription: 'The ancient rivals put aside their blood feud for a split second, shredding the target into ribboned meat with dual feral pounces!',
    bonusDualDamage: 25,
    bannerColor: '#9A3412',
    auraType: 'fire',
  },
  {
    id: 'combo-punisher-ghost-rider',
    hero1Name: 'The Punisher',
    hero2Name: 'Ghost Rider',
    comboTitle: 'HELLFIRE GATLING PENANCE STARE',
    comboDescription: 'Frank Castle empties Hellfire-charged miniguns into the target before Johnny Blaze locks eyes for an agonizing Penance Stare!',
    bonusDualDamage: 26,
    bannerColor: '#EA580C',
    auraType: 'fire',
  },
  {
    id: 'combo-cosmic-ghost-rider',
    hero1Name: 'Cosmic Ghost Rider',
    hero2Name: 'Thanos',
    comboTitle: 'BABY THANOS TIMELINE PUNISHMENT',
    comboDescription: 'The Cosmic Ghost Rider unleashes Power Cosmic Hellfire chains while the Mad Titan crushes the target with raw cosmic might!',
    bonusDualDamage: 30,
    bannerColor: '#F97316',
    auraType: 'cosmic',
  },
  {
    id: 'combo-doc-ock-goblin',
    hero1Name: 'Doctor Octopus',
    hero2Name: 'Green Goblin',
    comboTitle: 'SINISTER MASTERMINDS: PUMPKIN TENTACLE CRUSH',
    comboDescription: 'Otto binds the target with titanium mechanical tentacles while Norman flies in on the Goblin Glider dropping a cluster of Pumpkin Bombs!',
    bonusDualDamage: 24,
    bannerColor: '#16A34A',
    auraType: 'fire',
  },
  {
    id: 'combo-moon-knight-mr-knight',
    hero1Name: 'Moon Knight',
    hero2Name: 'Mr. Knight',
    comboTitle: 'FISTS OF KHONSHU DUAL PERSONALITY BLUDGEON',
    comboDescription: 'Marc Spector and Steven Grant strike in synchronized martial arts harmony, channeling the ancient wrath of the Egyptian Moon God!',
    bonusDualDamage: 22,
    bannerColor: '#F8FAFC',
    auraType: 'chaos',
  },
  {
    id: 'combo-captain-marvel-spectrum',
    hero1Name: 'Captain Marvel',
    hero2Name: 'Spectrum',
    comboTitle: 'ELECTROMAGNETIC PHOTON SUPERNOVA',
    comboDescription: 'Monica Rambeau transforms into pure gamma-wave radiation as Carol Danvers magnifies her output into a blinding solar beam!',
    bonusDualDamage: 25,
    bannerColor: '#38BDF8',
    auraType: 'cosmic',
  },
  {
    id: 'combo-daredevil-elektra',
    hero1Name: 'Daredevil',
    hero2Name: 'Elektra',
    comboTitle: 'THE HAND\'S DEMISE: DUAL SAI EXECUTION',
    comboDescription: 'Elektra drives twin razor sais through vulnerable pressure points while Daredevil lands a shattering blind acrobat kick!',
    bonusDualDamage: 21,
    bannerColor: '#B91C1C',
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



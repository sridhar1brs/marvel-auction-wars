import { Character } from '../../types/game';

export const GRADE_A_CHARACTERS: Character[] = [
  {
    id: 'char-a-001',
    name: 'Thor Odinson',
    alias: 'God of Thunder',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 14,
    powers: 'Mjolnir mastery, lightning manipulation, divine strength, weather control, flight.',
    description: 'The Norse God of Thunder and founding Avenger, commanding thunderbolts with the enchanted hammer Mjolnir.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b2/Eric_Masterson_%28Earth-616%29_from_Thor_Vol_1_443_001.jpg/revision/latest?cb=20210621055633',
    color: '#0284C7',
    stats: { strength: 95, speed: 89, durability: 94, intelligence: 85, energy: 95, combat: 95 },
    specialAbilities: [
      { name: 'God Blast', description: 'Unleashes a torrential lightning storm that scorches all resistance.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 92
  },
  {
    id: 'char-a-002',
    name: 'Scarlet Witch',
    alias: 'Wanda Maximoff',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 15,
    powers: 'Chaos Magic, reality distortion, probability manipulation, psionic blasts, telekinesis.',
    description: 'The mythical nexus being wielding ancient Chaos Magic capable of altering the fabric of reality itself.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/1/1d/Wanda_Maximoff_%28Earth-12%29_from_Exiles_Vol_1_14_0001.jpg/revision/latest?cb=20191231013147',
    color: '#E11D48',
    stats: { strength: 65, speed: 82, durability: 80, intelligence: 92, energy: 98, combat: 85 },
    specialAbilities: [
      { name: 'Chaos Hex Flare', description: 'Disrupts probability to critically diminish incoming assaults.', bonusPower: 7, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 93
  },
  {
    id: 'char-a-003',
    name: 'Doctor Strange',
    alias: 'Stephen Strange (Sorcerer Supreme)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 13,
    powers: 'Mystic arts mastery, Eye of Agamotto, Cloak of Levitation, astral projection, dimensional travel.',
    description: 'Master of the mystic arts and Earth defender against interdimensional horrors and cosmic spells.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/ac/Asim_Strange_%28Earth-65%29_from_Spider-Gwen_Vol_2_34.jpg/revision/latest?cb=20181231172547',
    color: '#F59E0B',
    stats: { strength: 68, speed: 84, durability: 83, intelligence: 98, energy: 96, combat: 90 },
    specialAbilities: [
      { name: 'Bands of Cyttorak', description: 'Binds the opponent in inescapable crimson mystic bands.', bonusPower: 6, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-004',
    name: 'Captain Marvel',
    alias: 'Carol Danvers',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 13,
    powers: 'Binary energy form, photon blasts, stellar flight, superhuman physical stats, energy absorption.',
    description: 'Infused with cosmic Tesseract energy, Carol Danvers stands as one of the universe most formidable defenders.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/80/Secret_Avengers_Vol_1_27_Textless.jpg/revision/latest?cb=20120314011719',
    color: '#FBBF24',
    stats: { strength: 92, speed: 94, durability: 92, intelligence: 86, energy: 96, combat: 91 },
    specialAbilities: [
      { name: 'Binary Mode Surge', description: 'Ignites radiant cosmic energy to overwhelm enemy armor.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 92
  },
  {
    id: 'char-a-005',
    name: 'Thanos (Base / Armor)',
    alias: 'The Mad Titan',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 15,
    powers: 'Eternal-Deviant physiology, titan strength, master tactician, cosmic energy projection, invulnerability.',
    description: 'Warlord of Titan whose sheer physical prowess and strategic brilliance rival the universe greatest forces.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d9/Armour_%28Thanosi%29_%28Earth-616%29_from_Infinity_Abyss_Vol_1_1_001.jpg/revision/latest?cb=20170403050927',
    color: '#7C3AED',
    stats: { strength: 96, speed: 84, durability: 96, intelligence: 97, energy: 92, combat: 97 },
    specialAbilities: [
      { name: 'Titan Double-Blade Strike', description: 'Shatters vibrational shields with unmatched physical force.', bonusPower: 7, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 93
  },
  {
    id: 'char-a-006',
    name: 'The Incredible Hulk',
    alias: 'Bruce Banner',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 12,
    powers: 'Infinite rage strength scaling, accelerated healing factor, thunderclaps, gamma resilience.',
    description: 'The strongest one there is, whose physical strength multiplies indefinitely as his fury escalates.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/07/The_Incredible_Hulk_%281977_film%29_Poster_002.jpg/revision/latest?cb=20071103075751',
    color: '#22C55E',
    stats: { strength: 97, speed: 82, durability: 96, intelligence: 70, energy: 88, combat: 90 },
    specialAbilities: [
      { name: 'Gamma Thunderclap', description: 'Slams hands together generating an acoustic sonic blast wave.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-007',
    name: 'Doctor Doom',
    alias: 'Victor Von Doom (Standard)',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 14,
    powers: 'Titanium-alloy armored exoskeleton, master sorcery, technological genius, force fields, Doombots.',
    description: 'Monarch of Latveria whose unified mastery over science and sorcery makes him one of the deadliest beings alive.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a1/Victor_Van_Damme_%28Earth-1610%29_from_Miles_Morales_Ultimate_Spider-Man_Vol_1_11_001.jpg/revision/latest?cb=20150313011109',
    color: '#059669',
    stats: { strength: 86, speed: 82, durability: 92, intelligence: 99, energy: 94, combat: 93 },
    specialAbilities: [
      { name: 'Mystic Siphon Shield', description: 'Absorbs opponent energy to power his own retaliatory blasts.', bonusPower: 7, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 92
  },
  {
    id: 'char-a-008',
    name: 'Hela',
    alias: 'Goddess of Death',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 13,
    powers: 'Necrosword generation, army resurrection, Asgardian divine physiology, death touch.',
    description: 'Firstborn of Odin whose power grows directly from Asgard, summoning endless blades of black necro-steel.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/e/ec/Queen_in_Black_Vol_1_1_Textless.jpg/revision/latest?cb=20260223065039',
    color: '#10B981',
    stats: { strength: 93, speed: 88, durability: 94, intelligence: 90, energy: 91, combat: 96 },
    specialAbilities: [
      { name: 'Necro-Blade Barrage', description: 'Impales foes with thousands of summoned dark obsidian swords.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-009',
    name: 'Magneto',
    alias: 'Max Eisenhardt / Erik Lehnsherr',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 12,
    powers: 'Omega-level magnetism manipulation, electromagnetic force fields, matter control, flight.',
    description: 'Master of Magnetism fighting for mutantkind, commanding the entire planetary electromagnetic spectrum.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/35/Ultimate_Origins_Vol_1_3_Textless.jpg/revision/latest?cb=20260124151032',
    color: '#DC2626',
    stats: { strength: 74, speed: 82, durability: 90, intelligence: 96, energy: 96, combat: 90 },
    specialAbilities: [
      { name: 'Electromagnetic EMP', description: 'Crushes incoming projectiles and disables tech systems.', bonusPower: 6, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-010',
    name: 'The Sentry',
    alias: 'Robert Reynolds / Golden Guardian',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 15,
    powers: 'Power of a million exploding suns, molecule manipulation, light projection, immortality.',
    description: 'A tragic golden guardian with limitless strength held back only by the lurking darkness of The Void.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5e/Project_Sentry_%28Earth-616%29_from_Sentry_Vol_2_8_001.jpg/revision/latest?cb=20250510104327',
    color: '#EAB308',
    stats: { strength: 97, speed: 96, durability: 96, intelligence: 88, energy: 98, combat: 90 },
    specialAbilities: [
      { name: 'Exploding Suns Nova', description: 'Releases blinding golden solar energy that obliterates all.', bonusPower: 8, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 94
  },
  {
    id: 'char-a-011',
    name: 'Apocalypse',
    alias: 'En Sabah Nur',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 12,
    powers: 'Celestial techno-organic armor, cellular molecular shapeshifting, telepathy, energy blasts.',
    description: 'The ancient mutant tyrant who tests the world through the principle of survival of the fittest.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/48/En_Sabah_Nur_%28Earth-295%29_from_Age_of_Apocalypse_The_Chosen_Vol_1_1_0002.png/revision/latest?cb=20260816075431',
    color: '#475569',
    stats: { strength: 94, speed: 82, durability: 95, intelligence: 96, energy: 92, combat: 93 },
    specialAbilities: [
      { name: 'Molecular Morph Cannon', description: 'Morphs arms into celestial cannons firing disintegration rays.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-012',
    name: 'Jean Grey (Phoenix Avatar)',
    alias: 'Marvel Girl',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 14,
    powers: 'Omega-level telepathy & telekinesis, matter molecular breakdown, cosmic fiery aura.',
    description: 'Omega-level telepath whose connection to the Phoenix Force unlocks godlike psychic destruction.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a2/Jean_Grey_%28Earth-12131%29_from_Marvel_Avengers_Alliance_0002.png/revision/latest?cb=20130406035718',
    color: '#EA580C',
    stats: { strength: 70, speed: 88, durability: 88, intelligence: 95, energy: 98, combat: 88 },
    specialAbilities: [
      { name: 'Phoenix Firestorm', description: 'Summons blazing psychic firebird wings that roast enemy defenses.', bonusPower: 7, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 92
  },
  {
    id: 'char-a-013',
    name: 'Adam Warlock',
    alias: 'Avatar of Life',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 13,
    powers: 'Quantum magic, cosmic energy manipulation, Soul Gem resonance, superhuman stats, regeneration.',
    description: 'Genetically engineered to be the pinnacle of evolution, destined to balance universal life and death.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f0/Adam_Warlock_%28Earth-616%29_from_Infinity_Wars_Infinity_Vol_1_1_001.jpg/revision/latest?cb=20190302234015',
    color: '#D97706',
    stats: { strength: 91, speed: 90, durability: 92, intelligence: 94, energy: 95, combat: 92 },
    specialAbilities: [
      { name: 'Quantum Magic Burst', description: 'Discharges mystical cosmic threads that unravel hostile energies.', bonusPower: 6, triggerRate: 0.6, type: 'cosmic' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-014',
    name: 'Vision',
    alias: 'The Synthezoid',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Density control (intangibility to diamond hardness), solar gem solar beam, flight, supercomputer mind.',
    description: 'Created with vibranium and an artificial mind, Vision possesses near-unbreakable density and pure intellect.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/bf/Vision_%28Earth-616%29_from_Vision_and_the_Scarlet_Witch_Vol_3_1_001.jpg/revision/latest?cb=20250919162046',
    color: '#059669',
    stats: { strength: 88, speed: 86, durability: 94, intelligence: 98, energy: 91, combat: 86 },
    specialAbilities: [
      { name: 'Solar Beam Overload', description: 'Projects concentrated solar radiation from the forehead gem.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-015',
    name: 'Black Bolt',
    alias: 'Blackagar Boltagon (King of Inhumans)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 12,
    powers: 'Hypersonic quasi-sonic scream, electron particle manipulation, matter disruption, master monarch.',
    description: 'Monarch of Attilan whose mere whisper can level mountains and tear apart planetary crusts.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f1/IVX_Vol_1_1_Inhumans_Variant_Textless.jpg/revision/latest?cb=20161209094800',
    color: '#1E293B',
    stats: { strength: 90, speed: 86, durability: 91, intelligence: 90, energy: 97, combat: 92 },
    specialAbilities: [
      { name: 'Quasi-Sonic Whisper', description: 'Unleashes a microscopic verbal utterance creating devastating sonic shockwaves.', bonusPower: 7, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-016',
    name: 'Beta Ray Bill',
    alias: 'Wielder of Stormbreaker',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 11,
    powers: 'Korbinite cybernetic enhancement, Stormbreaker hammer, lightning summoning, cosmic flight.',
    description: 'The noble Korbinite champion deemed worthy of Mjolnir, gifted Stormbreaker to defend his people.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c3/Beta_Ray_Bill_%28Earth-616%29_from_Mortal_Thor_Vol_1_2_Clarke_Variant.jpg/revision/latest?cb=20250926064724',
    color: '#CA8A04',
    stats: { strength: 94, speed: 88, durability: 93, intelligence: 84, energy: 92, combat: 94 },
    specialAbilities: [
      { name: 'Stormbreaker Smash', description: 'Calls down thunderous tempest strikes through enchanted uru.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-017',
    name: 'Gladiator',
    alias: 'Kallark (Shi\'ar Praetor)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 12,
    powers: 'Confidence-fueled strength & speed, heat vision, cosmic flight, near-invulnerability.',
    description: 'Praetor of the Shi\'ar Imperial Guard whose power scales directly with his supreme self-confidence.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6c/Anthony_Stark_%28Earth-616%29_and_Melvin_Potter_%28Earth-616%29_from_Iron_Man_Vol_5_3_001.jpg/revision/latest?cb=20201117030011',
    color: '#9333EA',
    stats: { strength: 96, speed: 95, durability: 95, intelligence: 82, energy: 90, combat: 93 },
    specialAbilities: [
      { name: 'Confidence Heat Beams', description: 'Fires intense thermal ocular lasers hotter than stellar cores.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-018',
    name: 'Kang The Conqueror',
    alias: 'Nathaniel Richards (Time Warlord)',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 11,
    powers: 'Time travel manipulation, 40th-century battlesuit, chronal weapons, temporal duplicates.',
    description: 'Master of the timestream who conquered countless eras and timelines with futuristic technology.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5b/Nathaniel_Richards_%28Rama-Tut%29_%28Earth-6311%29_from_Avengers_Vol_7_4_001.jpg/revision/latest?cb=20170202083006',
    color: '#059669',
    stats: { strength: 80, speed: 85, durability: 90, intelligence: 99, energy: 94, combat: 91 },
    specialAbilities: [
      { name: 'Chronal Stasis Beam', description: 'Freezes the enemy in localized temporal lag.', bonusPower: 6, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-019',
    name: 'Ghost Rider (Johnny Blaze)',
    alias: 'Spirit of Vengeance',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 11,
    powers: 'Hellfire projection, Penance Stare, enchanted mystic chain, hell cycle, immortality.',
    description: 'Stunt motorcyclist bound to Zarathos, delivering demonic hellfire retribution upon the guilty.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6e/Ghost_Rider_Vol_10_11_Mobili_Variant_Textless.jpg/revision/latest?cb=20240806004855',
    color: '#EA580C',
    stats: { strength: 90, speed: 87, durability: 94, intelligence: 80, energy: 93, combat: 91 },
    specialAbilities: [
      { name: 'Penance Stare', description: 'Forces the foe to experience all the suffering they ever inflicted.', bonusPower: 7, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-020',
    name: 'Ultron Prime',
    alias: 'The Ultimate Machine',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 11,
    powers: 'Adamantium exoskeleton, encephalo-ray, technopathy, drone swarm coordination, energy beams.',
    description: 'Artificial intelligence with a pure hatred for humanity, constantly upgrading his adamantium form.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/05/Ultron_%28Earth-51156%29_from_Marvel_Future_Fight_005.png/revision/latest?cb=20200325102726',
    color: '#DC2626',
    stats: { strength: 90, speed: 84, durability: 97, intelligence: 98, energy: 92, combat: 89 },
    specialAbilities: [
      { name: 'Encephalo Disruption', description: 'Attacks the neural pathways of organic targets with high-freq signals.', bonusPower: 6, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-021',
    name: 'Nova Prime (Richard Rider)',
    alias: 'Human Rocket / Worldmind',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Full Nova Force access, Xandarian Worldmind connection, gravitational control, FTL flight.',
    description: 'Sole bearer of the entire Xandarian Nova Force, safeguarding galaxies with immense energy.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a5/Richard_Rider_%28Earth-51156%29_from_Marvel_Future_Fight_001.jpg/revision/latest?cb=20200615161303',
    color: '#0284C7',
    stats: { strength: 89, speed: 94, durability: 90, intelligence: 88, energy: 94, combat: 90 },
    specialAbilities: [
      { name: 'Nova Force Gravimetric Pulse', description: 'Releases a concentrated burst of gravimetric energy.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-022',
    name: 'Blue Marvel',
    alias: 'Adam Brashear',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 13,
    powers: 'Antimatter generation & control, superhuman strength & durability, scientific genius, energy shields.',
    description: 'Antimatter reactor pioneer possessing staggering cosmic strength and a brilliant scientific mind.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/97/Adam_Brashear_%28Earth-616%29_from_Marvel_Legends_promotional_artwork_001.jpg/revision/latest?cb=20220314224837',
    color: '#2563EB',
    stats: { strength: 95, speed: 92, durability: 95, intelligence: 97, energy: 96, combat: 91 },
    specialAbilities: [
      { name: 'Antimatter Annihilation', description: 'Collides matter and antimatter for a clean, unstoppable burst.', bonusPower: 7, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 92
  },
  {
    id: 'char-a-023',
    name: 'Hyperion',
    alias: 'Marcus Milton (Sun God)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 12,
    powers: 'Solar energy absorption, atomic vision, colossal physical might, super-speed flight.',
    description: 'Last surviving Eternal of Earth-712 who draws immense power from solar radiation.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9f/Hyperion_Vol_1_1_Textless.jpg/revision/latest?cb=20151023184219',
    color: '#F59E0B',
    stats: { strength: 96, speed: 93, durability: 95, intelligence: 85, energy: 93, combat: 90 },
    specialAbilities: [
      { name: 'Atomic Optic Blast', description: 'Projects radiant solar heat capable of cutting planetary crusts.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-024',
    name: 'Storm',
    alias: 'Ororo Munroe (Omega Mutant)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 11,
    powers: 'Atmospheric manipulation, lightning bolts, hurricane winds, cosmic weather control.',
    description: 'Omega-level weather goddess capable of commanding planetary ecosystems and solar winds.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5d/Ororo_Munroe_%28Earth-12%29_from_Exiles_Vol_1_14_0001.jpg/revision/latest?cb=20191231020331',
    color: '#38BDF8',
    stats: { strength: 70, speed: 88, durability: 82, intelligence: 92, energy: 97, combat: 91 },
    specialAbilities: [
      { name: 'Cataclysmic Tempest', description: 'Calls down thunderous lightning and hurricane gales.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-025',
    name: 'Iceman (Omega Level)',
    alias: 'Bobby Drake',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Thermal manipulation, absolute zero freeze, organic ice clones, immortality as water.',
    description: 'Omega mutant able to halt atomic motion completely and regenerate continuously from ice.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3a/X-Men_Vol_6_13_Trading_Card_Variant_Textless.jpg/revision/latest?cb=20220726054440',
    color: '#06B6D4',
    stats: { strength: 80, speed: 86, durability: 93, intelligence: 85, energy: 95, combat: 85 },
    specialAbilities: [
      { name: 'Absolute Zero Freeze', description: 'Drops local temperature to 0 Kelvin, shattering enemy armor.', bonusPower: 6, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 88
  },
  {
    id: 'char-a-026',
    name: 'Juggernaut',
    alias: 'Cain Marko (Exemplar of Cyttorak)',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 10,
    powers: 'Unstoppable physical momentum, mystical force field, immense strength, invulnerability.',
    description: 'Empowered by the Gem of Cyttorak, nothing in existence can halt his forward charge.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7e/Cain_Marko_%28Earth-8096%29_from_Wolverine_and_the_X-Men_%28animated_series%29_Season_1_13_0001.jpg/revision/latest?cb=20200916004042',
    color: '#B91C1C',
    stats: { strength: 96, speed: 78, durability: 98, intelligence: 72, energy: 82, combat: 88 },
    specialAbilities: [
      { name: 'Unstoppable Momentum', description: 'Breaks cleanly through all physical barriers and defensive shields.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-027',
    name: 'Red Hulk',
    alias: 'General Thaddeus Thunderbolt Ross',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 11,
    powers: 'High-temperature heat emission, energy absorption, military tactical genius, superhuman strength.',
    description: 'General Ross transformed into a red behemoth who emits searing radiation and drains enemy energy.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6f/Robert_Maverick_%28Earth-616%29_from_U.S.Avengers_Vol_1_1_001.jpg/revision/latest?cb=20170107233505',
    color: '#DC2626',
    stats: { strength: 95, speed: 82, durability: 94, intelligence: 88, energy: 90, combat: 93 },
    specialAbilities: [
      { name: 'Thermal Heat Flare', description: 'Vaporizes surrounding area with blinding superheated gamma heat.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-028',
    name: 'Magik',
    alias: 'Illyana Rasputina (Ruler of Limbo)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Soulsword creation, stepping discs teleportation, dark sorcery, eldritch demon armor.',
    description: 'Mistress of Limbo wielding the Soulsword, disrupting magical enchantments with teleportation discs.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/54/X-Men_Vol_7_2_Magik_Virgin_Variant.jpg/revision/latest?cb=20240811043500',
    color: '#EAB308',
    stats: { strength: 76, speed: 88, durability: 88, intelligence: 88, energy: 94, combat: 94 },
    specialAbilities: [
      { name: 'Soulsword Sever', description: 'Slices through magic and armor directly to disable supernatural power.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-029',
    name: 'Annihilus',
    alias: 'Lord of the Negative Zone',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 12,
    powers: 'Cosmic Control Rod, insectoid army command, energy manipulation, cellular regeneration.',
    description: 'Ruler of the Negative Zone who launched the catastrophic Annihilation Wave across the cosmos.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7e/Annihilation_-_Scourge_Alpha_Vol_1_1_Lim_Variant_Textless.jpg/revision/latest?cb=20200725173811',
    color: '#84CC16',
    stats: { strength: 91, speed: 90, durability: 92, intelligence: 90, energy: 96, combat: 90 },
    specialAbilities: [
      { name: 'Cosmic Control Blast', description: 'Channels the Cosmic Control Rod for a massive wave of dark energy.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-030',
    name: 'Hercules',
    alias: 'The Prince of Power',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 11,
    powers: 'Olympian divine physiology, legendary physical strength, adamantine mace, archery mastery.',
    description: 'Olympian demigod and legendary hero renowned across myth for his unmatched brawling strength.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/51/Incredible_Hercules_Vol_1_126_Textless.jpg/revision/latest?cb=20120927131140',
    color: '#D97706',
    stats: { strength: 96, speed: 82, durability: 95, intelligence: 80, energy: 80, combat: 96 },
    specialAbilities: [
      { name: 'Olympian Heavy Slam', description: 'A devastating haymaker backed by centuries of divine combat prowess.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-031',
    name: 'Professor X',
    alias: 'Charles Xavier',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 9,
    powers: 'Omega-level telepathy, mind control, memory erasure, psionic illusions, astral projection.',
    description: 'Founder of the X-Men and world foremost psychic mind, commanding unmatched mental mastery.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/44/House_of_X_Vol_1_1_Flower_Variant_Textless.jpg/revision/latest?cb=20200514075425',
    color: '#3B82F6',
    stats: { strength: 40, speed: 60, durability: 70, intelligence: 100, energy: 97, combat: 75 },
    specialAbilities: [
      { name: 'Psionic Mind Lock', description: 'Shuts down enemy cognitive motor functions with a psychic wave.', bonusPower: 7, triggerRate: 0.65, type: 'tactical' }
    ],
    overallPower: 88
  },
  {
    id: 'char-a-032',
    name: 'Emma Frost',
    alias: 'The White Queen',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 9,
    powers: 'Omega telepathy, organic diamond form, superhuman durability, mental shields.',
    description: 'White Queen possessing flawless telepathic finesse and an invulnerable organic diamond skin.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/74/Marvel_Comics_Vol_1_1000_Artgerm_Collectibles_Exclusive_Emma_Frost_Virgin_Variant.jpg/revision/latest?cb=20211002082122',
    color: '#E2E8F0',
    stats: { strength: 82, speed: 78, durability: 95, intelligence: 96, energy: 92, combat: 86 },
    specialAbilities: [
      { name: 'Diamond Edge Counter', description: 'Absorbs heavy physical strikes in diamond form and retaliates.', bonusPower: 5, triggerRate: 0.55, type: 'defense' }
    ],
    overallPower: 88
  },
  {
    id: 'char-a-033',
    name: 'Namor the Sub-Mariner',
    alias: 'King of Atlantis',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 10,
    powers: 'Aquatic dominance, superhuman strength & flight, trident mastery, hydrokinesis.',
    description: 'First mutant and fierce King of Atlantis, possessing immense strength both on land and beneath the seas.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f1/Namor_Conquered_Shores_Vol_1_1_Clarke_Variant_Textless.jpg/revision/latest?cb=20220718073333',
    color: '#0D9488',
    stats: { strength: 92, speed: 89, durability: 90, intelligence: 88, energy: 86, combat: 93 },
    specialAbilities: [
      { name: 'Neptune Trident Wave', description: 'Summons crushing tidal pressures focused through royal trident.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-034',
    name: 'Quasar',
    alias: 'Wendell Vaughn (Protector of the Universe)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 11,
    powers: 'Quantum Bands construct projection, FTL flight, quantum energy absorption, cosmic shields.',
    description: 'Protector of the Universe wielding Quantum Bands capable of manifesting hard-light energy constructs.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c2/Wendell_Vaughn_%28Earth-110%29_from_Big_Town_Vol_1_4.jpg/revision/latest?cb=20160113160809',
    color: '#3B82F6',
    stats: { strength: 88, speed: 94, durability: 92, intelligence: 89, energy: 95, combat: 88 },
    specialAbilities: [
      { name: 'Quantum Hard-Light Dome', description: 'Constructs an impenetrable quantum sphere to deflect enemy bursts.', bonusPower: 6, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-035',
    name: 'Super-Skrull',
    alias: 'Kl\'rt',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 9,
    powers: 'Combined powers of the Fantastic Four: Fire, Invisibility, Elasticity, Rock Strength.',
    description: 'Skrull champion bio-engineered with all four abilities of the Fantastic Four simultaneously.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/aa/Super-Skrulls_%28Earth-616%29_from_Secret_Invasion_Vol_1_2_001.jpg/revision/latest?cb=20170925042928',
    color: '#16A34A',
    stats: { strength: 90, speed: 85, durability: 91, intelligence: 88, energy: 92, combat: 91 },
    specialAbilities: [
      { name: 'Quad-Power Combo', description: 'Combines invisible force fields with blazing nova punches.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-036',
    name: 'Ikaris',
    alias: 'Leader of the Eternals',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 11,
    powers: 'Cosmic energy eye beams, high-speed flight, near-immortality, superhuman physical might.',
    description: 'Prime Eternal created by the Celestials, possessing devastating laser vision and cosmic flight.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a7/Ikaris_%28Earth_616%29_from_Eternals_Forever_Vol_1_1_Frigeri_Variant_cover_001.jpg/revision/latest?cb=20211107042245',
    color: '#2563EB',
    stats: { strength: 93, speed: 92, durability: 94, intelligence: 86, energy: 93, combat: 91 },
    specialAbilities: [
      { name: 'Cosmic Optic Flash', description: 'Slices through armored targets with pure celestial optical rays.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-037',
    name: 'Thena',
    alias: 'Eternal Weapon Master',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Cosmic weapon materialization (spears, swords, shields), immortal agility, divine martial arts.',
    description: 'Eternal warrior with centuries of battle experience, crafting hard cosmic light weapons at will.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/24/Eternals_Vol_5_1_Cho_Variant_Textless.jpg/revision/latest?cb=20210504065948',
    color: '#F59E0B',
    stats: { strength: 90, speed: 93, durability: 91, intelligence: 89, energy: 88, combat: 98 },
    specialAbilities: [
      { name: 'Cosmic Spear Thrust', description: 'Materializes a radiant golden spear for an unerring critical strike.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-038',
    name: 'Gilgamesh',
    alias: 'The Forgotten Eternal',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 9,
    powers: 'Colossal celestial strength, golden cosmic energy exo-fists, extreme durability.',
    description: 'The physically strongest Eternal, whose cosmic-shielded fists can shatter mountains.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7b/Eternals_Vol_5_5_Parel_Variant_Textless.jpg/revision/latest?cb=20211130005649',
    color: '#D97706',
    stats: { strength: 96, speed: 80, durability: 95, intelligence: 82, energy: 86, combat: 92 },
    specialAbilities: [
      { name: 'Cosmic Hammer Fist', description: 'Unleashes a golden shockwave punch that crumbles armor.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 88
  },
  {
    id: 'char-a-039',
    name: 'Ronan The Accuser',
    alias: 'Supreme Accuser of the Kree',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 10,
    powers: 'Universal Weapon (Cosmi-Rod), Kree cybernetic armor, gravity manipulation, energy blasts.',
    description: 'Zealous Kree Accuser executing the will of the Supreme Intelligence with his Universal Weapon.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/53/Ronan_%28Earth-616%29_from_Legendary_Star-Lord_Vol_1_12_001.jpg/revision/latest?cb=20210718222107',
    color: '#047857',
    stats: { strength: 89, speed: 83, durability: 91, intelligence: 90, energy: 90, combat: 93 },
    specialAbilities: [
      { name: 'Cosmi-Rod Judgment', description: 'Strikes the ground with the hammer to discharge a stasis shockwave.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 88
  },
  {
    id: 'char-a-040',
    name: 'Clea Strange',
    alias: 'Sorceress Supreme of Dark Dimension',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 11,
    powers: 'Faltine flame sorcery, dimensional banishment, mystical shield casting, astral manipulation.',
    description: 'Niece of Dormammu and Sorceress Supreme of the Dark Dimension with mastery over Faltine flames.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5f/Sorcerer_Supreme_Vol_1_5_Fanyang_Variant_Textless.jpg/revision/latest?cb=20260427073207',
    color: '#9333EA',
    stats: { strength: 72, speed: 85, durability: 86, intelligence: 96, energy: 95, combat: 90 },
    specialAbilities: [
      { name: 'Flames of Faltine Bolt', description: 'Discharges violet mystic fire that burns spiritual essences.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-041',
    name: 'Nate Grey (X-Man)',
    alias: 'Shaman of the Mutant Tribe',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 13,
    powers: 'Limitless psionic telekinesis, precognition, dimensional phase traversal, telepathy.',
    description: 'Genetically engineered mutant from the Age of Apocalypse with staggering raw psychic potential.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/86/Uncanny_X-Men_Vol_5_4_Textless.jpg/revision/latest?cb=20180919023849',
    color: '#3B82F6',
    stats: { strength: 75, speed: 89, durability: 88, intelligence: 95, energy: 98, combat: 89 },
    specialAbilities: [
      { name: 'Psionic Cataclysm', description: 'Releases a telekinetic shockwave that tears apart physical matter.', bonusPower: 7, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-a-042',
    name: 'Cable (Full Unbound Power)',
    alias: 'Nathan Summers',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 11,
    powers: 'Omega telekinesis & telepathy, techno-organic arm, futuristic plasma weaponry, cybernetic eye.',
    description: 'Time-traveling soldier possessing immense psionic force alongside heavy futuristic ordnance.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5d/Cable_Reloaded_Vol_1_1_Textless.jpg/revision/latest?cb=20210521181044',
    color: '#0284C7',
    stats: { strength: 88, speed: 85, durability: 92, intelligence: 94, energy: 93, combat: 97 },
    specialAbilities: [
      { name: 'Plasma Cannon Barrage', description: 'Fires heavy futuristic plasma rounds with telekinetic guidance.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-a-043',
    name: 'Enchantress (Amora)',
    alias: 'Mistress of Asgardian Sorcery',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 9,
    powers: 'Seductive mind-charm, Asgardian magical blasts, illusion casting, elemental shields.',
    description: 'Asgardian sorceress whose enchanting spells can enslave the minds of gods and mortals alike.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/bf/Amora_%28Earth-8096%29_from_Avengers_Earth%27s_Mightiest_Heroes_%28animated_series%29_Season_2_8_001.png/revision/latest?cb=20120527230747',
    color: '#10B981',
    stats: { strength: 80, speed: 82, durability: 85, intelligence: 94, energy: 93, combat: 85 },
    specialAbilities: [
      { name: 'Siren Mind Charm', description: 'Charms the opponent to weaken their attack potency.', bonusPower: 5, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-044',
    name: 'High Evolutionary',
    alias: 'Herbert Wyndham',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 11,
    powers: 'Evolutionary accelerator, silver armor energy blasts, force fields, telepathy, cosmic knowledge.',
    description: 'Genius bio-scientist seeking to engineer genetic perfection with cosmic armor and godlike tech.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5a/Avengers_Vol_7_673_Textless.jpg/revision/latest?cb=20170822214529',
    color: '#9333EA',
    stats: { strength: 84, speed: 84, durability: 92, intelligence: 100, energy: 93, combat: 86 },
    specialAbilities: [
      { name: 'Genetic De-Evolution', description: 'Emits a genetic ray that degrades enemy physical parameters.', bonusPower: 6, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 89
  },
  {
    id: 'char-a-045',
    name: 'Ebony Maw',
    alias: 'Black Order Herald',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 9,
    powers: 'Supreme telekinesis, psychological manipulation, micro-levitation, telekinetic shields.',
    description: 'The silver-tongued lieutenant of Thanos whose effortless telekinesis restrains the strongest foes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/86/Black_Order_Vol_1_5_Textless.jpg/revision/latest?cb=20181218214739',
    color: '#64748B',
    stats: { strength: 60, speed: 80, durability: 82, intelligence: 98, energy: 94, combat: 84 },
    specialAbilities: [
      { name: 'Micro-Telekinetic Spike', description: 'Levitates surrounding debris into razor-sharp projectiles.', bonusPower: 5, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-046',
    name: 'Cull Obsidian',
    alias: 'Black Dwarf',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 8,
    powers: 'Colossal physical strength, dense armored hide, transforming hammer-shield weapon.',
    description: 'Brutal powerhouse of the Black Order whose sheer mass and transforming hammer crush all foes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b6/Cull_Obsidian_%28Earth-199999%29_from_Avengers_Infinity_War_001.jpg/revision/latest?cb=20180510170656',
    color: '#78350F',
    stats: { strength: 95, speed: 75, durability: 95, intelligence: 70, energy: 75, combat: 91 },
    specialAbilities: [
      { name: 'Shield-Axe Impact', description: 'Slams his kinetic hammer-shield for a high-impact shockwave.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-047',
    name: 'Proxima Midnight',
    alias: 'Black Order Huntress',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 8,
    powers: 'Three-pronged spear forged in a supernova, light-speed spears, superhuman agility.',
    description: 'Deadliest combatant in Thanos army whose spear never misses and carries toxic stellar energy.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/98/Infinity_Vol_1_5_Generals_Variant_Textless.jpg/revision/latest?cb=20130628193424',
    color: '#0284C7',
    stats: { strength: 86, speed: 92, durability: 88, intelligence: 86, energy: 89, combat: 97 },
    specialAbilities: [
      { name: 'Supernova Spear Arc', description: 'Hurls an arc of three lethal starlight arcs that track the enemy.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-048',
    name: 'Corvus Glaive',
    alias: 'Thanos Right Hand',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 8,
    powers: 'Atom-slicing glaive blade, immortality while glaive is intact, master general.',
    description: 'Cruel general whose otherworldly glaive can slice through atoms and grants him instant resurrection.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/1/17/Infinity_Vol_1_3_Generals_Variant_Textless.jpg/revision/latest?cb=20130613185047',
    color: '#475569',
    stats: { strength: 87, speed: 90, durability: 89, intelligence: 91, energy: 85, combat: 96 },
    specialAbilities: [
      { name: 'Atom-Slicing Strike', description: 'Cleaves directly through molecular bonds with his glaive.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-049',
    name: 'Abomination',
    alias: 'Emil Blonsky',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 8,
    powers: 'Gamma mutation, superior base physical strength, hardened reptilian scales, high jump.',
    description: 'Emil Blonsky injected with super-soldier serum and gamma rays, retaining full tactical intellect.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/77/Incredible_Hulk_Vol_6_30_Hotz_Second_Printing_Variant.jpg/revision/latest?cb=20260215055934',
    color: '#15803D',
    stats: { strength: 95, speed: 78, durability: 94, intelligence: 82, energy: 80, combat: 90 },
    specialAbilities: [
      { name: 'Gamma Ground Slam', description: 'Shatters the ground beneath the enemy with brute force.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 87
  },
  {
    id: 'char-a-050',
    name: 'The Destroyer (Asgardian Automaton)',
    alias: 'Enchanted War Armor',
    grade: 'A',
    alignment: 'Cosmic',
    startingPrice: 12,
    powers: 'Disintegration visor beam, enchanted uru armor, immunity to magic and physical harm.',
    description: 'Enchanted Asgardian war machine forged by Odin to combat the Celestials, firing total disintegration beams.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/2b/Loki_Laufeyson_%28Kid_Loki%29_%28Earth-616%29_and_Destroyer_%28Enchanted_Armor%29_from_Journey_Into_Mystery_Vol_4_626_001.png/revision/latest?cb=20210620220226',
    color: '#94A3B8',
    stats: { strength: 96, speed: 80, durability: 98, intelligence: 70, energy: 97, combat: 92 },
    specialAbilities: [
      { name: 'Visor Disintegration Ray', description: 'Unleashes an incinerating beam capable of reducing uru to ash.', bonusPower: 7, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 91
  }
];

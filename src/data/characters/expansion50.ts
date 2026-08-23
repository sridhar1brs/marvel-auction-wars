import { Character } from '../../types/game';

export const EXPANSION_50_CHARACTERS: Character[] = [
  {
    id: 'char-exp-001',
    name: 'Miles Morales',
    alias: 'Spider-Man of Brooklyn',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 8,
    powers: 'Bio-electric Venom Strike, camouflage invisibility, spider-sense, wall crawling, web sling.',
    description: 'Brooklyn teenager carrying the Spider-Man mantle with bio-electric venom blasts and optical camouflage.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/34/Spider-Man_Across_the_Spider-Verse_poster_030_textless.jpg/revision/latest?cb=20230705133551',
    color: '#E62429',
    stats: { strength: 78, speed: 92, durability: 76, intelligence: 88, energy: 86, combat: 85 },
    specialAbilities: [
      { name: 'Venom Blast Burst', description: 'Releases a concentrated bio-electric shock that bypasses armor.', bonusPower: 5, triggerRate: 0.6, type: 'attack' },
      { name: 'Camo Ambush', description: 'Fades into invisible camouflage to evade the next incoming blow.', bonusPower: 4, triggerRate: 0.55, type: 'defense' }
    ],
    overallPower: 85
  },
  {
    id: 'char-exp-002',
    name: 'Ghost-Spider',
    alias: 'Gwen Stacy (Spider-Gwen)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Superhuman agility, spider-sense, web-shooters, acrobatic rhythm fighting, multiversal travel.',
    description: 'Gwen Stacy from Earth-65 wielding spider abilities with rock-drummer rhythm and balletic grace.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/07/All-New_Spider-Gwen_The_Ghost-Spider_Vol_1_1_Textless.jpg/revision/latest?cb=20250726091838',
    color: '#EC4899',
    stats: { strength: 76, speed: 93, durability: 75, intelligence: 86, energy: 60, combat: 88 },
    specialAbilities: [
      { name: 'Rhythmic Spider Kick', description: 'Delivers a high-tempo flurry of acrobatic web kicks.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-003',
    name: 'Blade',
    alias: 'Eric Brooks (The Daywalker)',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 7,
    powers: 'Vampiric superhuman strength, titanium sword, silver stakes, immunity to vampire bites, sunlight walk.',
    description: 'Half-mortal half-immortal vampire hunter armed with a silver-edged sword and customized firearms.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/29/Blade_Vol_6_1_Textless.jpg/revision/latest?cb=20230726001943',
    color: '#BE123C',
    stats: { strength: 82, speed: 86, durability: 85, intelligence: 82, energy: 50, combat: 96 },
    specialAbilities: [
      { name: 'Daywalker Sword Cleave', description: 'Slices through enemy defenses with a titanium broadsword.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-exp-004',
    name: 'Black Cat',
    alias: 'Felicia Hardy',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 5,
    powers: 'Subconscious probability manipulation (bad luck for foes), grappling hook, razor claws, cat burglary.',
    description: 'Expert master cat burglar whose proximity inflicts severe misfortune and bad luck upon opponents.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a8/Walter_Hardy_%28Earth-6160%29_from_Ultimate_Spider-Man_Vol_3_8_Vecchio_Variant_cover_001.png/revision/latest?cb=20240821182119',
    color: '#E2E8F0',
    stats: { strength: 68, speed: 88, durability: 72, intelligence: 86, energy: 75, combat: 90 },
    specialAbilities: [
      { name: 'Bad Luck Hex', description: 'Causes the opponent weapon or strike to malfunction critically.', bonusPower: 4, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 82
  },
  {
    id: 'char-exp-005',
    name: 'Mystique',
    alias: 'Raven Darkholme',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Flawless molecular cellular shapeshifting, decelerated aging, dual pistol marksmanship, stealth.',
    description: 'Lethal mutant assassin who can flawlessly mimic the voice, appearance, and retina of any person.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/27/Raven_Darkh%C3%B6lme_%28Earth-1610%29_from_Ultimate_X-Men_Vol_1_81_001.jpg/revision/latest?cb=20210803051803',
    color: '#2563EB',
    stats: { strength: 72, speed: 84, durability: 80, intelligence: 92, energy: 50, combat: 95 },
    specialAbilities: [
      { name: 'Infiltration Backstab', description: 'Shapeshifts into an ally before landing a surprise critical strike.', bonusPower: 5, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 83
  },
  {
    id: 'char-exp-006',
    name: 'Sabretooth',
    alias: 'Victor Creed',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 7,
    powers: 'Hyper-accelerated healing factor, razor adamantium-laced fangs & claws, feral senses, predator rage.',
    description: 'Wolverine savage archenemy driven by bloodlust, possessing ferocious claws and feral healing.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f6/Sabretooth_%28Creed%29_%28Earth-1912%29_from_Wolverine_Vol_7_45_001.jpg/revision/latest?cb=20240419222338',
    color: '#D97706',
    stats: { strength: 86, speed: 82, durability: 92, intelligence: 76, energy: 40, combat: 94 },
    specialAbilities: [
      { name: 'Feral Claw Frenzy', description: 'Tears into the foe with savage relentless claw strikes.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-007',
    name: 'Mister Sinister',
    alias: 'Nathaniel Essex',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 11,
    powers: 'Genetic manipulation, telepathy, telekinesis, cellular regeneration, energy projection, force shields.',
    description: 'Victorian geneticist obsessed with mutant DNA who bio-engineered himself with dozens of stolen powers.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b4/Hellions_Vol_1_5_Unknown_Comic_Books_Exclusive_Virgin_Variant.jpg/revision/latest?cb=20201010035934',
    color: '#DC2626',
    stats: { strength: 85, speed: 80, durability: 93, intelligence: 99, energy: 92, combat: 88 },
    specialAbilities: [
      { name: 'Genetic Force Blast', description: 'Channels concentrated telekinetic beams through his chest gem.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-exp-008',
    name: 'Morbius',
    alias: 'Dr. Michael Morbius (The Living Vampire)',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 6,
    powers: 'Pseudo-vampirism, night vision, echolocation, gliding, razor fangs, superhuman strength.',
    description: 'Nobel-winning biochemist afflicted with pseudo-vampirism after attempting to cure a rare blood disease.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6c/Morbius_Vol_1_1_Textless.jpg/revision/latest?cb=20211102194828',
    color: '#475569',
    stats: { strength: 82, speed: 88, durability: 82, intelligence: 90, energy: 60, combat: 84 },
    specialAbilities: [
      { name: 'Echolocation Pounce', description: 'Tracks the enemy in total darkness to land a vicious pounce.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-exp-009',
    name: 'Spider-Man 2099',
    alias: 'Miguel O\'Hara',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 8,
    powers: 'Accelerated vision (decoy illusions), talons on fingers/toes, paralytic venom fangs, organic webbing.',
    description: 'Genius geneticist from year 2099 fighting megacorporations with high-tech suit and venomous fangs.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c8/Spider-Man_2099_Vol_4_1_Textless.jpg/revision/latest?cb=20200825010122',
    color: '#1E3A8A',
    stats: { strength: 82, speed: 94, durability: 80, intelligence: 94, energy: 70, combat: 88 },
    specialAbilities: [
      { name: 'Accelerated Decoy Dash', description: 'Leaves a holographic optical decoy while striking from behind.', bonusPower: 5, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 85
  },
  {
    id: 'char-exp-010',
    name: 'Silver Samurai',
    alias: 'Keniuchio Harada',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Tachyon energy field katana charging (cuts almost anything), samurai armor, shuriken mastery.',
    description: 'Master swordsman able to envelop his katana in a tachyon field capable of cleaving steel and stone.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/05/Kenuichio_Harada_%28Earth-616%29_from_Marvel_War_of_Heroes_001.jpg/revision/latest?cb=20140304223852',
    color: '#94A3B8',
    stats: { strength: 78, speed: 82, durability: 85, intelligence: 82, energy: 84, combat: 96 },
    specialAbilities: [
      { name: 'Tachyon Field Cleave', description: 'Charges katana blade to slice directly through thick armor.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-011',
    name: 'J. Jonah Jameson',
    alias: 'Daily Bugle Publisher',
    grade: 'C',
    alignment: 'Neutral',
    startingPrice: 2,
    powers: 'Spider-Slayer remote pilot, front-page tabloid defamation, cigar-chomping sheer rage.',
    description: 'Bombastic newspaper publisher who finances Spider-Slayer war mechs to capture photos.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/96/John_Jonah_Jameson_%28Earth-616%29_from_Marvel_Knights_Spider-Man_Vol_1_4_001.jpg/revision/latest?cb=20161214062419',
    color: '#78350F',
    stats: { strength: 48, speed: 52, durability: 60, intelligence: 88, energy: 30, combat: 62 },
    specialAbilities: [
      { name: 'Spider-Slayer Drone Call', description: 'Deploys a remote-controlled mechanical Spider-Slayer robot.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 68
  },
  {
    id: 'char-exp-012',
    name: 'Spider-Woman',
    alias: 'Jessica Drew',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Bio-electric Venom Blasts, pheromone manipulation, wall-crawling, glider wings flight.',
    description: 'Avenger and private investigator weaponizing bio-electric venom blasts and glider flight.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9d/Spider-Woman_Vol_7_11_Textless.jpg/revision/latest?cb=20210116123553',
    color: '#DC2626',
    stats: { strength: 80, speed: 86, durability: 80, intelligence: 86, energy: 86, combat: 91 },
    specialAbilities: [
      { name: 'Bio-Electric Venom Blast', description: 'Unleashes a concentrated blast of bio-electricity.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-013',
    name: 'Silk',
    alias: 'Cindy Moon',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Hyper-sensitive Silk-Sense, organic fingertip spinnerets, superhuman speed & agility.',
    description: 'Bitten by the same spider as Peter Parker, possessing an even sharper danger sense and organic silk.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/aa/Silk_Vol_2_7_Campbell_Connecting_Variant_C_Textless.jpg/revision/latest?cb=20160707021313',
    color: '#06B6D4',
    stats: { strength: 76, speed: 95, durability: 74, intelligence: 85, energy: 60, combat: 86 },
    specialAbilities: [
      { name: 'Silk-Sense Evasion', description: 'Dojos around attacks with hyper-acute sensory reflexes.', bonusPower: 4, triggerRate: 0.65, type: 'defense' }
    ],
    overallPower: 83
  },
  {
    id: 'char-exp-014',
    name: 'Captain Britain',
    alias: 'Brian Braddock',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 9,
    powers: 'Amulet of Right magic conduit, superhuman strength & flight, mystical force fields.',
    description: 'Champion of the British Isles empowered by Merlyn with magical strength that scales with confidence.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/79/Marvel_Tales_Captain_Britain_Vol_1_1_Virgin_Variant.jpg/revision/latest?cb=20200830223644',
    color: '#1E3A8A',
    stats: { strength: 90, speed: 86, durability: 91, intelligence: 86, energy: 88, combat: 90 },
    specialAbilities: [
      { name: 'Excalibur Light Thrust', description: 'Channels Otherworld mystic energy into a glowing heavy punch.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 88
  },
  {
    id: 'char-exp-015',
    name: 'Black Knight',
    alias: 'Dane Whitman',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'The Ebony Blade (cleaves all magic and metal), Valinor winged steed, swordsmanship.',
    description: 'Wielder of the cursed Ebony Blade, capable of slicing through spells and impervious shields.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/80/Nathan_Garrett_%28Earth-616%29_and_Elendil_%28Earth-616%29from_Avengers_Earth%27s_Mightiest_Heroes_Vol_1_3_001.jpg/revision/latest?cb=20231004094707',
    color: '#0F172A',
    stats: { strength: 78, speed: 80, durability: 84, intelligence: 86, energy: 80, combat: 95 },
    specialAbilities: [
      { name: 'Ebony Blade Magic Cleave', description: 'Slices directly through enemy magic shields and armor.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-016',
    name: 'Skaar',
    alias: 'Son of Hulk (Sakaarson)',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 9,
    powers: 'Old Power geomancy (magma/earth bending), gamma strength, broadsword combat.',
    description: 'Son of Hulk and Caiera the Oldstrong, commanding both gamma rage and the planet-bending Old Power.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c9/Skaar_%28Earth-616%29_from_Gamma_Flight_Vol_1_2_cover_001.jpg/revision/latest?cb=20250427013549',
    color: '#15803D',
    stats: { strength: 95, speed: 78, durability: 94, intelligence: 74, energy: 86, combat: 91 },
    specialAbilities: [
      { name: 'Old Power Earthquake', description: 'Strikes the ground summoning volcanic magma geysers.', bonusPower: 5, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-exp-017',
    name: 'Wonder Man',
    alias: 'Simon Williams (Ionic Titan)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Ionic energy body, near-limitless strength, invulnerability, flight, energy blasts.',
    description: 'Avenger composed of pure living ionic energy, possessing immense physical strength and resilience.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a8/Wonder_Man_Vol_4_1_Besch_Virgin_Variant.jpg/revision/latest?cb=20260407030016',
    color: '#DC2626',
    stats: { strength: 94, speed: 86, durability: 95, intelligence: 82, energy: 91, combat: 86 },
    specialAbilities: [
      { name: 'Ionic Overcharge Strike', description: 'Releases a blinding red pulse of ionic destructive force.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-exp-018',
    name: 'Tigra',
    alias: 'Greer Grant Nelson',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Cat People warrior blessing, razor claws, feline night senses, acrobatics, super speed.',
    description: 'Champion of the Cat People imbued with feline agility, razor-sharp claws, and predatory instincts.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f3/Blood_Hunt_Vol_1_1_Artgerm_Virgin_Variant.jpg/revision/latest?cb=20240430061153',
    color: '#EA580C',
    stats: { strength: 78, speed: 89, durability: 78, intelligence: 80, energy: 45, combat: 91 },
    specialAbilities: [
      { name: 'Feline Pounce Flurry', description: 'Leaps from high vantage point delivering lightning claw rakes.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-exp-019',
    name: 'Quake',
    alias: 'Daisy Johnson (Inhuman Agent)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Vibrational seismic wave emission, internal organ disruption, S.H.I.E.L.D. tactical director.',
    description: 'Inhuman agent capable of generating pinpoint targeted seismic shockwaves that rupture steel.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/38/Daisy_Johnson_%28Earth-1610%29_from_Ultimate_Comics_Ultimates_Vol_1_22_001.jpg/revision/latest?cb=20210216064224',
    color: '#0284C7',
    stats: { strength: 68, speed: 80, durability: 78, intelligence: 90, energy: 92, combat: 91 },
    specialAbilities: [
      { name: 'Pinpoint Seismic Blast', description: 'Directs focused vibrational pulses into enemy structural joints.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-020',
    name: 'Mockingbird',
    alias: 'Bobbi Morse',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Battle staves (extend to bo staff), Super Soldier + Infinity formula, master acrobat.',
    description: 'Top S.H.I.E.L.D. operative wielding twin electrified battle staves with Olympic gymnastics.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/64/Barbara_Morse_%28Earth-110%29_from_Big_Town_Vol_1_1_002.jpg/revision/latest?cb=20160111002721',
    color: '#EAB308',
    stats: { strength: 66, speed: 80, durability: 72, intelligence: 90, energy: 40, combat: 92 },
    specialAbilities: [
      { name: 'Twin Stave Vault Strike', description: 'Vaults into the air delivering dual electrified baton strikes.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-exp-021',
    name: 'Dazzler',
    alias: 'Alison Blaire (Light Matrix)',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Acoustic sound conversion into solid light/lasers/holograms, disco agility, roller skates.',
    description: 'Mutant pop star who absorbs sound vibrations and converts them into blinding, concussive laser light.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e0/Alison_Blaire_%28Earth-65%29_from_Spider-Gwen_Smash_Vol_1_2_Cover.jpg/revision/latest?cb=20231213172532',
    color: '#06B6D4',
    stats: { strength: 65, speed: 82, durability: 74, intelligence: 82, energy: 91, combat: 82 },
    specialAbilities: [
      { name: 'Solid Light Laser Cascade', description: 'Transmutes arena noise into piercing hard-light laser bursts.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-exp-022',
    name: 'Armor',
    alias: 'Hisako Ichiki',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Ancestral psionic exo-armor projection, superhuman strength, concussive energy shields.',
    description: 'X-Man who manifests a towering translucent red psionic samurai armor powered by ancestral memory.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b8/Hisako_Ichiki_%28Earth-616%29_from_Secret_X-Men_Vol_1_1_002.jpg/revision/latest?cb=20250327234000',
    color: '#DC2626',
    stats: { strength: 86, speed: 74, durability: 92, intelligence: 80, energy: 84, combat: 85 },
    specialAbilities: [
      { name: 'Psionic Armor Slam', description: 'Slams colossal glowing psionic fist into the ground.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 83
  },
  {
    id: 'char-exp-023',
    name: 'Longshot',
    alias: 'Mojoworld Rebel',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Probability luck field, psychometry, leather-cleaving throwing daggers, hollow bones agility.',
    description: 'Four-fingered Mojoworld freedom fighter blessed with pure good fortune when his motives are pure.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/62/Longshot_%28Mojoverse%29_from_X-Men_Blue_Vol_1_13_001.jpg/revision/latest?cb=20180613015218',
    color: '#F59E0B',
    stats: { strength: 70, speed: 88, durability: 74, intelligence: 80, energy: 82, combat: 88 },
    specialAbilities: [
      { name: 'Pure Heart Lucky Strike', description: 'A lucky bounce causes thrown daggers to strike vulnerable armor seams.', bonusPower: 4, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 82
  },
  {
    id: 'char-exp-024',
    name: 'Shatterstar',
    alias: 'Gaveedra-Seven',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Dual bio-electric channeling broadswords, teleportation portals, Mojoworld gladiator training.',
    description: 'Genetically engineered warrior from Mojoworld wielding dual swords capable of firing bio-shockwaves.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a7/Gaveedra_Seven_%28Mojoverse%29_from_X-Men_Unlimited_Infinity_Comic_Vol_1_123_001.jpg/revision/latest?cb=20250717212424',
    color: '#E2E8F0',
    stats: { strength: 82, speed: 88, durability: 84, intelligence: 80, energy: 82, combat: 96 },
    specialAbilities: [
      { name: 'Bio-Shock Sword Wave', description: 'Channels bio-energy down twin blades for a slicing energy wave.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-025',
    name: 'Cannonball',
    alias: 'Sam Guthrie',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 5,
    powers: 'Thermo-chemical propulsion, nigh-invulnerable kinetic blast field while flying, team leader.',
    description: 'Kentucky mutant who rockets through the sky wrapped in an impenetrable kinetic blast field.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/96/Samuel_Guthrie_%28Earth-161%29_from_X-Men_Forever_Vol_2_10_001.jpg/revision/latest?cb=20091101201359',
    color: '#EAB308',
    stats: { strength: 78, speed: 91, durability: 95, intelligence: 80, energy: 85, combat: 85 },
    specialAbilities: [
      { name: 'Nigh-Invulnerable Ram', description: 'Rockets headfirst into the opponent with impenetrable kinetic shield.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-026',
    name: 'Boom-Boom',
    alias: 'Tabitha Smith',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Plasma time bombs, concussion detonation control, wrist flick accuracy.',
    description: 'Energetic mutant who manifests glowing plasma energy orbs that detonate on timed command.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/0d/Tabitha_Smith_%28Earth-616%29_from_X-Men_Vol_7_10_001.jpg/revision/latest?cb=20250203014233',
    color: '#EC4899',
    stats: { strength: 56, speed: 74, durability: 65, intelligence: 76, energy: 85, combat: 78 },
    specialAbilities: [
      { name: 'Time Bomb Cluster', description: 'Tosses a trio of ticking plasma bombs that explode in sync.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 74
  },
  {
    id: 'char-exp-027',
    name: 'Lady Deathstrike',
    alias: 'Yuriko Oyama',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: '12-inch extending adamantium finger claws, cybernetic healing factor, martial arts mastery.',
    description: 'Cyborg assassin seeking revenge against Wolverine with razor-sharp extending adamantium finger claws.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/61/Death_of_Wolverine_The_Logan_Legacy_Vol_1_4_Textless.jpg/revision/latest?cb=20140819215859',
    color: '#7F1D1D',
    stats: { strength: 80, speed: 88, durability: 88, intelligence: 82, energy: 40, combat: 96 },
    specialAbilities: [
      { name: 'Adamantium Finger Rake', description: 'Extends razor finger claws in a blinding flurry of slashes.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-028',
    name: 'Omega Red',
    alias: 'Arkady Rossovich',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 8,
    powers: 'Carbonadium tentacles in wrists, death spore pheromones, superhuman strength, Soviet conditioning.',
    description: 'Soviet super-soldier armed with retractable carbonadium tentacles that drain the life force of foes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/99/Wolverine_Vol_7_11_Unknown_Comic_Books_Exclusive_Virgin_Variant.jpg/revision/latest?cb=20210403195047',
    color: '#991B1B',
    stats: { strength: 88, speed: 82, durability: 92, intelligence: 82, energy: 88, combat: 91 },
    specialAbilities: [
      { name: 'Death Spore Life Drain', description: 'Envelops the target in carbonadium coils, sapping their vitality.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 87
  },
  {
    id: 'char-exp-029',
    name: 'Mastermind',
    alias: 'Jason Wyngarde',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Complete sensory psionic illusions, psychological deception, Brotherhood member.',
    description: 'Illusionist mutant capable of casting vivid hallucinations that fool all five senses.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/bd/Hellions_Vol_1_9_Textless.jpg/revision/latest?cb=20260813001743',
    color: '#6D28D9',
    stats: { strength: 50, speed: 60, durability: 62, intelligence: 92, energy: 85, combat: 70 },
    specialAbilities: [
      { name: 'Phantom Mirage Stun', description: 'Casts a terrifying illusion that freezes the opponent in confusion.', bonusPower: 3, triggerRate: 0.55, type: 'tactical' }
    ],
    overallPower: 73
  },
  {
    id: 'char-exp-030',
    name: 'Destiny',
    alias: 'Irene Adler',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Absolute precognitive vision, timeline navigation, crossbow marksmanship.',
    description: 'Blind mutant precognitive who foresees diverging future timelines with eerie pinpoint clarity.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/75/Destiny_%28Overspace%29_%28Earth-616%29_from_Marvel_Two-In-One_Vol_1_6_0001.jpg/revision/latest?cb=20200304071637',
    color: '#F59E0B',
    stats: { strength: 50, speed: 60, durability: 64, intelligence: 98, energy: 75, combat: 76 },
    specialAbilities: [
      { name: 'Precognitive Crossbow Shot', description: 'Fires a crossbow bolt exactly where the opponent will dodge.', bonusPower: 3, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 74
  },
  {
    id: 'char-exp-031',
    name: 'Selene Gallio',
    alias: 'The Black Queen (Immortal Vampire)',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 11,
    powers: 'Life-force drainage, shadow manipulation, ancient sorcery, pyrokinesis, telepathy.',
    description: '17,000-year-old mutant psychic vampire and High Priestess who absorbs life to maintain eternal youth.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/a6/Selene_Gallio_%28Earth-616%29_from_Immortal_X-Men_Vol_1_1_001.jpg/revision/latest?cb=20220401041713',
    color: '#4C1D95',
    stats: { strength: 84, speed: 84, durability: 90, intelligence: 98, energy: 96, combat: 89 },
    specialAbilities: [
      { name: 'Life Siphon Curse', description: 'Drains vitality from the opponent to boost her own power.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 90
  },
  {
    id: 'char-exp-032',
    name: 'Madelyne Pryor',
    alias: 'The Goblin Queen',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 10,
    powers: 'Demon magic sorcery, clone of Jean Grey telekinesis/telepathy, Limbo goblin legions.',
    description: 'Clone of Jean Grey corrupted by demonic pacts, ruling over Limbo demons and dark psionics.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/98/Madelyne_Pryor_%28Earth-91240%29_from_Dark_X-Men_Vol_2_2_003.jpg/revision/latest?cb=20240713222439',
    color: '#DC2626',
    stats: { strength: 74, speed: 82, durability: 86, intelligence: 94, energy: 96, combat: 88 },
    specialAbilities: [
      { name: 'Goblin Flame Incantation', description: 'Calls down hellfire pyrotechnics from the demonic realm.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 89
  },
  {
    id: 'char-exp-033',
    name: 'Mojo',
    alias: 'Spineless Ruler of Mojoworld',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Anti-life mystical field, mechanical spider hover-chair, reality television distortion.',
    description: 'Obese alien tyrant ruling the television-obsessed Mojoworld from a mechanical spider chair.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/42/X-Men_Black_-_Mojo_Vol_1_1_Virgin_Variant.jpg/revision/latest?cb=20180814040513',
    color: '#CA8A04',
    stats: { strength: 78, speed: 65, durability: 86, intelligence: 92, energy: 88, combat: 75 },
    specialAbilities: [
      { name: 'Anti-Life Magic Surge', description: 'Discharges a corrupting field of anti-life mystical energy.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 81
  },
  {
    id: 'char-exp-034',
    name: 'Spiral',
    alias: 'Rita Wayword',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 6,
    powers: 'Six-armed swordsmanship, spellcasting dance, interdimensional teleportation, cybernetic augments.',
    description: 'Six-armed cybernetic sorceress who casts devastating temporal spells through intricate dances.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/aa/Spiral_%28Earth-1610%29_from_Ultimate_X-Men_Vol_1_55_0001.png/revision/latest?cb=20191201063049',
    color: '#9333EA',
    stats: { strength: 78, speed: 88, durability: 84, intelligence: 90, energy: 90, combat: 97 },
    specialAbilities: [
      { name: 'Six-Sword Spiral Dance', description: 'Attacks in a whirlwind of 6 swords combined with spell wards.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-exp-035',
    name: 'Arcade',
    alias: 'Architect of Murderworld',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Pinball death traps, lethal theme parks, robot doppelgangers, sadistic engineering.',
    description: 'Eccentric assassin dressed in a bow tie who traps heroes in deadly custom Murderworld pinball arenas.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/da/Arcade_%28Earth-616%29_from_Elektra_Vol_5_1_0001.jpg/revision/latest?cb=20180323192721',
    color: '#EA580C',
    stats: { strength: 52, speed: 60, durability: 64, intelligence: 96, energy: 60, combat: 68 },
    specialAbilities: [
      { name: 'Murderworld Trap Door', description: 'Drops the opponent into a mechanized pinball acid pit.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 72
  },
  {
    id: 'char-exp-036',
    name: 'Sauron',
    alias: 'Dr. Karl Lykos',
    grade: 'B',
    alignment: 'Villain',
    startingPrice: 5,
    powers: 'Pteranodon dinosaur transformation, life energy siphon, hypnotic eye gaze, flight.',
    description: 'Mutated into a humanoid pterodactyl in the Savage Land, draining life force through skin contact.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f2/Karl_Lykos_%28Earth-616%29_from_X-Men_Unlimited_Infinity_Comic_Vol_1_8_001.jpg/revision/latest?cb=20211018153810',
    color: '#16A34A',
    stats: { strength: 80, speed: 86, durability: 82, intelligence: 84, energy: 75, combat: 82 },
    specialAbilities: [
      { name: 'Hypnotic Gaze Dive', description: 'Hypnotizes the foe before diving with razor talons.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 82
  },
  {
    id: 'char-exp-037',
    name: 'Doctor Voodoo',
    alias: 'Jericho Drumm (Houngan Supreme)',
    grade: 'A',
    alignment: 'Hero',
    startingPrice: 10,
    powers: 'Loa spirit channeling, brother Daniel ghost possession, voodoo pyrokinesis, staff mastery.',
    description: 'Houngan Supreme wielding ancient Loa spirits and mystic staff to dispel supernatural evils.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b6/Jericho_Drumm_%28Earth-616%29_from_Storm_Earth%27s_Mightiest_Mutant_Vol_1_3_001.jpg/revision/latest?cb=20260423111055',
    color: '#059669',
    stats: { strength: 74, speed: 82, durability: 84, intelligence: 95, energy: 95, combat: 90 },
    specialAbilities: [
      { name: 'Loa Spirit Possession', description: 'Sends brother ghost to possess and stun the enemy combatant.', bonusPower: 5, triggerRate: 0.6, type: 'tactical' }
    ],
    overallPower: 89
  },
  {
    id: 'char-exp-038',
    name: 'Nova (Sam Alexander)',
    alias: 'The Kid Nova',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Black Nova helmet, Nova Force energy blasts, sub-orbital flight, force shields.',
    description: 'Youthful Nova Corps centurion wielding his father Black Nova helmet across the cosmos.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/9/9b/Samuel_Alexander_%28Earth-TRN1451%29_from_Marvel_Avengers_Assembly_Vol_1_1_001.png/revision/latest?cb=20251220185723',
    color: '#0284C7',
    stats: { strength: 82, speed: 92, durability: 84, intelligence: 82, energy: 90, combat: 84 },
    specialAbilities: [
      { name: 'Nova Helm Pulse', description: 'Discharges a concussive golden beam from the Black Nova helmet.', bonusPower: 4, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-039',
    name: 'The Void',
    alias: 'Dark Half of the Sentry',
    grade: 'MYTHIC',
    alignment: 'Villain',
    startingPrice: 27,
    powers: 'Limitless dark tendril manipulation, reality unmaking, darkness projection, immortality.',
    description: 'The terrifying shadow manifestation born from the Sentry mind capable of consuming worlds.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/ac/Void_%28Dark_Sentry%29_%28Earth-616%29_from_Sentry_Vol_5_3_cover_detail.jpg/revision/latest?cb=20260422102048',
    color: '#0F172A',
    stats: { strength: 98, speed: 95, durability: 99, intelligence: 90, energy: 99, combat: 94 },
    specialAbilities: [
      { name: 'Void Tendril Impalement', description: 'Pierces through all matter with pitch-black primordial darkness.', bonusPower: 9, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 96
  },
  {
    id: 'char-exp-040',
    name: 'Old Man Logan',
    alias: 'Wasteland Berserker',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 7,
    powers: 'Adamantium claws, veteran survival instincts, healing factor, relentless willpower.',
    description: 'Grizzled elder Wolverine from a dystopian future ruled by villains, pushed past his limits.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/57/James_Howlett_%28Earth-807128%29_from_Fantastic_Force_Vol_2_4.jpg/revision/latest?cb=20201011221014',
    color: '#78350F',
    stats: { strength: 82, speed: 80, durability: 92, intelligence: 85, energy: 40, combat: 98 },
    specialAbilities: [
      { name: 'Wasteland Retribution', description: 'Snarls and pops adamantium claws for a fatal counter-slash.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-exp-041',
    name: 'Red Goblin',
    alias: 'Norman Osborn + Carnage Symbiote',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 13,
    powers: 'Carnage symbiote + Goblin Formula, Carnage bombs, immune to fire and sound, glider.',
    description: 'Norman Osborn bonded with the Carnage symbiote, immune to traditional symbiote weaknesses.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/db/Norman_Osborn_%28Red_Goblin%29_%28Earth-517%29_from_Marvel_Contest_of_Champions_004.jpg/revision/latest?cb=20201103170325',
    color: '#B91C1C',
    stats: { strength: 92, speed: 90, durability: 91, intelligence: 95, energy: 80, combat: 93 },
    specialAbilities: [
      { name: 'Carnage Pumpkin Bomb', description: 'Hurls organic symbiote bombs with lethal incendiary spikes.', bonusPower: 6, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 91
  },
  {
    id: 'char-exp-042',
    name: 'Symbiote Spider-Man',
    alias: 'Black Suit Peter Parker',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 8,
    powers: 'Enhanced alien symbiote strength, unlimited organic webbing, stealth camouflage, aggression.',
    description: 'Spider-Man amplified by the living alien symbiote, granting brutal strength and faster reflexes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/77/Absolute_Carnage_Scream_Vol_1_3_Codex_Variant_Textless.jpg/revision/latest?cb=20200823015853',
    color: '#1E293B',
    stats: { strength: 85, speed: 93, durability: 84, intelligence: 92, energy: 65, combat: 89 },
    specialAbilities: [
      { name: 'Symbiote Web Slam', description: 'Slams the foe against walls with heavy black tendril webbing.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 86
  },
  {
    id: 'char-exp-043',
    name: 'Cosmic Spider-Man',
    alias: 'Captain Universe Peter Parker',
    grade: 'MYTHIC',
    alignment: 'Hero',
    startingPrice: 26,
    powers: 'Enigma Force (Uni-Power), matter transmutation, cosmic energy blasts, light-speed flight.',
    description: 'Spider-Man empowered by the cosmic Enigma Force, capable of rearranging atoms with a thought.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/03/Peter_Parker_%28Earth-13%29_from_Amazing_Spider-Man_Vol_3_11.jpg/revision/latest?cb=20141219232810',
    color: '#3B82F6',
    stats: { strength: 96, speed: 98, durability: 96, intelligence: 95, energy: 99, combat: 94 },
    specialAbilities: [
      { name: 'Uni-Power Cosmic Web', description: 'Entangles target in stellar matter that dissolves hostile attacks.', bonusPower: 8, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 96
  },
  {
    id: 'char-exp-044',
    name: 'Maestro Hulk',
    alias: 'Dystopian Warlord Bruce Banner',
    grade: 'A',
    alignment: 'Villain',
    startingPrice: 13,
    powers: 'Banner intellect + Hulk ultimate physical strength, trophy weapon mastery, tyrannical combat.',
    description: 'Future Hulk who absorbed decades of nuclear fallout, possessing Banner mind and merciless fury.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/aa/Maestro_Future_Imperfect_-_Marvel_Tales_Vol_1_1_Virgin_Variant.jpg/revision/latest?cb=20200924140549',
    color: '#15803D',
    stats: { strength: 98, speed: 84, durability: 97, intelligence: 96, energy: 88, combat: 94 },
    specialAbilities: [
      { name: 'Trophy Arsenal Crush', description: 'Wields relics of fallen Avengers in a devastating combined strike.', bonusPower: 6, triggerRate: 0.65, type: 'attack' }
    ],
    overallPower: 93
  },
  {
    id: 'char-exp-045',
    name: 'Scarlet Spider',
    alias: 'Ben Reilly',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 6,
    powers: 'Impact webbing pellets, stingers, spider-agility, wall-crawling, clone of Peter Parker.',
    description: 'Clone of Peter Parker wearing his iconic sleeveless blue hoodie and firing impact webbing.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d7/Ben_Reilly_Scarlet_Spider_Vol_1_3_Textless.jpg/revision/latest?cb=20170321191425',
    color: '#DC2626',
    stats: { strength: 78, speed: 91, durability: 76, intelligence: 90, energy: 60, combat: 85 },
    specialAbilities: [
      { name: 'Impact Webbing Burst', description: 'Fires explosive expanding web pellets that encase the opponent.', bonusPower: 4, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 84
  },
  {
    id: 'char-exp-046',
    name: 'Kaine Parker',
    alias: 'Scarlet Spider II / The Other',
    grade: 'B',
    alignment: 'Anti-Hero',
    startingPrice: 7,
    powers: 'Retractable bone wrist stingers, organic webbing, mark of Kaine corrosive touch, super strength.',
    description: 'Imperfect clone of Spider-Man who embraces lethal force and retractable forearm bone stingers.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/2b/Kaine_Parker_%28Earth-14110%29_from_Nova_Vol_5_10_0001.jpg/revision/latest?cb=20200317235630',
    color: '#991B1B',
    stats: { strength: 84, speed: 90, durability: 82, intelligence: 82, energy: 65, combat: 90 },
    specialAbilities: [
      { name: 'Bone Stinger Thrust', description: 'Extends deadly bone stingers through wrists in a lethal stab.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-exp-047',
    name: 'Anti-Venom',
    alias: 'Eddie Brock (Cleansing Symbiote)',
    grade: 'A',
    alignment: 'Anti-Hero',
    startingPrice: 9,
    powers: 'Symbiote healing/cleansing touch, immune to fire/sound, shapeshifting white tendrils.',
    description: 'Created when Eddie Brock mutated antibodies bonded with symbiote remnants, burning toxins.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/5b/Amazing_Spider-Man_Presents_Anti-Venom_-_New_Ways_To_Live_Vol_1_1_Textless.jpg/revision/latest?cb=20160406162532',
    color: '#F8FAFC',
    stats: { strength: 89, speed: 86, durability: 92, intelligence: 80, energy: 84, combat: 89 },
    specialAbilities: [
      { name: 'Cleansing Tendril Touch', description: 'White tendrils purge foreign energy and heal damage.', bonusPower: 5, triggerRate: 0.6, type: 'defense' }
    ],
    overallPower: 88
  },
  {
    id: 'char-exp-048',
    name: 'Agent Venom',
    alias: 'Flash Thompson',
    grade: 'B',
    alignment: 'Hero',
    startingPrice: 7,
    powers: 'Military firearm arsenal, multi-arm symbiote tendril shooting, wall crawling, combat training.',
    description: 'Decorated war hero Flash Thompson bonded with the Venom symbiote on covert military missions.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/77/Eugene_Thompson_%28Earth-138%29_from_Spider-Punk_Vol_1_4_001.jpg/revision/latest?cb=20220917235811',
    color: '#334155',
    stats: { strength: 84, speed: 86, durability: 86, intelligence: 85, energy: 65, combat: 94 },
    specialAbilities: [
      { name: 'Multi-Tendril Firestorm', description: 'Symbiote sprouts 4 arms firing automatic weapons simultaneously.', bonusPower: 5, triggerRate: 0.6, type: 'attack' }
    ],
    overallPower: 85
  },
  {
    id: 'char-exp-049',
    name: 'King in Black Venom',
    alias: 'Eddie Brock (God of Symbiotes)',
    grade: 'MYTHIC',
    alignment: 'Hero',
    startingPrice: 28,
    powers: 'Symbiote hive mind sovereignty, Enigma Force mastery, cosmic battleaxe, flight.',
    description: 'Eddie Brock after defeating Knull and claiming the title of King in Black with cosmic wings.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/e/e5/King_in_Black_Vol_1_1_Darkness_Reigns_Variant_Textless.jpg/revision/latest?cb=20201227201036',
    color: '#A855F7',
    stats: { strength: 97, speed: 94, durability: 98, intelligence: 92, energy: 98, combat: 96 },
    specialAbilities: [
      { name: 'Hive Mind Cosmic Axe', description: 'Summons an axe made of living symbiote darkness and cosmic flame.', bonusPower: 9, triggerRate: 0.65, type: 'cosmic' }
    ],
    overallPower: 97
  },
  {
    id: 'char-exp-050',
    name: 'Howard the Duck (Prime Hero)',
    alias: 'Master of Quack-Fu',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Quack-Fu martial arts, Big Freaking Gun, fourth wall quips, duck cynicism.',
    description: 'Trapped in a world he never made, Howard uses Quack-Fu and heavy blasters with unflinching swagger.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f3/Howard_Duckson_%28Earth-982%29_from_S.H.I.E.L.D._Vol_3_10_001.jpg/revision/latest?cb=20200920065937',
    color: '#D97706',
    stats: { strength: 55, speed: 64, durability: 68, intelligence: 86, energy: 40, combat: 78 },
    specialAbilities: [
      { name: 'Quack-Fu Combo', description: 'Lands a surprising series of duck martial arts kicks to the shins.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  }
];

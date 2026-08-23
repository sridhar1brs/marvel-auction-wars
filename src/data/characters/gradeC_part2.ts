import { Character } from '../../types/game';

export const GRADE_C_PART2: Character[] = [
  {
    id: 'char-c-041',
    name: 'Fandral the Dashing',
    alias: 'Warriors Three',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Asgardian fencing agility, enchanted rapier, chivalric swordsmanship.',
    description: 'Dashing Asgardian fencer wielding an enchanted rapier with lightning reflexes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/74/Fandral_%28Earth-616%29_from_Thor_Vol_3_4_0001.jpg/revision/latest?cb=20191230224641',
    color: '#16A34A',
    stats: { strength: 72, speed: 82, durability: 74, intelligence: 76, energy: 35, combat: 91 },
    specialAbilities: [
      { name: 'Dashing Rapier Thrust', description: 'Lunges with pinpoint precision through enemy armor defenses.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-042',
    name: 'Hogun the Grim',
    alias: 'Warriors Three',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Spiked Asgardian mace, tactical battlefield stoicism, heavy striking power.',
    description: 'Grim warrior of Vanaheim wielding a heavy spiked war mace with crushing impact.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/45/Hogun_%28Earth-616%29_from_Thor_Vol_3_4_0001.png/revision/latest?cb=20191230224612',
    color: '#475569',
    stats: { strength: 76, speed: 68, durability: 78, intelligence: 78, energy: 35, combat: 88 },
    specialAbilities: [
      { name: 'Spiked Mace Crush', description: 'Brings down heavy spiked mace in an armor-cracking blow.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-043',
    name: 'Cassie Lang',
    alias: 'Stinger / Stature',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Pym Particle suit, shrinking/growing agility, bio-synthetic stingers.',
    description: 'Daughter of Ant-Man equipped with her own purple Pym particle suit and wrist stingers.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/fc/Cassandra_Lang_%28Earth-616%29_from_Astonishing_Ant-Man_Vol_1_6_001.jpg/revision/latest?cb=20160318001649',
    color: '#9333EA',
    stats: { strength: 66, speed: 76, durability: 70, intelligence: 82, energy: 65, combat: 76 },
    specialAbilities: [
      { name: 'Stinger Blast Flurry', description: 'Shrinks into micro-size before firing dual plasma wrist stingers.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-044',
    name: 'Katy Chen',
    alias: 'Ta Lo Dragon Archer',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Dragon scale bow, wind-guided archery, fast stunt driving reflexes.',
    description: 'Brave friend of Shang-Chi who mastered the dragon scale bow in Ta Lo during the Great Protector battle.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/57/Katy_Chen_%28Earth-51156%29_fromMarvel_Future_Fight_001.jpg/revision/latest?cb=20210921185812',
    color: '#EA580C',
    stats: { strength: 52, speed: 70, durability: 60, intelligence: 78, energy: 40, combat: 78 },
    specialAbilities: [
      { name: 'Dragon Scale Arrow', description: 'Looses a wind-guided dragon scale arrow with uncanny accuracy.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 71
  },
  {
    id: 'char-c-045',
    name: 'Ned Leeds',
    alias: 'Guy in the Chair / Sling Ring Novice',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Sling ring portal opening, cybersecurity hacking, Peter Parker support.',
    description: 'Peter Parker best friend whose natural mystical aptitude allows him to open sling ring portals.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d5/Edward_Leeds_%28Earth-616%29_from_Amazing_Spider-Man_Vol_6_11_001.jpg/revision/latest?cb=20230706013547',
    color: '#F59E0B',
    stats: { strength: 50, speed: 56, durability: 60, intelligence: 88, energy: 60, combat: 60 },
    specialAbilities: [
      { name: 'Accidental Portal Trap', description: 'Summons a sputtering sling ring portal that drops heavy objects.', bonusPower: 2, triggerRate: 0.45, type: 'tactical' }
    ],
    overallPower: 69
  },
  {
    id: 'char-c-046',
    name: 'Everett K. Ross',
    alias: 'CIA Special Agent',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Air Force pilot reflexes, tactical firearm accuracy, Wakandan diplomatic ally.',
    description: 'Honorable CIA operative and Air Force veteran who piloted remote aircraft against Killmonger.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c5/Black_Panther_Wakanda_Forever_poster_014_Textless.jpg/revision/latest?cb=20221110153327',
    color: '#2563EB',
    stats: { strength: 58, speed: 66, durability: 64, intelligence: 86, energy: 25, combat: 76 },
    specialAbilities: [
      { name: 'Remote Royal Talon Drone', description: 'Pilots a remote drone to fire an air-to-ground plasma missile.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-047',
    name: 'Jane Foster (Astrophysicist)',
    alias: 'Dr. Jane Foster',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Einstein-Rosen bridge theory, graviton meter gadgets, scientific deduction.',
    description: 'Nobel-tier astrophysicist who mapped the Nine Realms and wormhole convergence mechanics.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/4/4c/Thor_Love_and_Thunder_poster_005_textless.jpg/revision/latest?cb=20220826120610',
    color: '#0284C7',
    stats: { strength: 50, speed: 60, durability: 60, intelligence: 98, energy: 40, combat: 60 },
    specialAbilities: [
      { name: 'Graviton Disruption Pulse', description: 'Activates a scientific sensor pod that destabilizes gravity.', bonusPower: 2, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 70
  },
  {
    id: 'char-c-048',
    name: 'Erik Selvig',
    alias: 'Dr. Selvig',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Gravitational phase spikes, cosmic portal physics, Tesseract researcher.',
    description: 'Astrophysicist who built the graviton spikes that defeated Malekith across dimensions.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/6e/Erik_Selvig_%28Earth-616%29_from_Avengers_Standoff_Welcome_to_Pleasant_Hill_Vol_1_1_001.jpg/revision/latest?cb=20160218012151',
    color: '#0D9488',
    stats: { strength: 50, speed: 56, durability: 60, intelligence: 96, energy: 45, combat: 58 },
    specialAbilities: [
      { name: 'Graviton Spike Banishment', description: 'Plants a science spike that teleports enemy projectiles away.', bonusPower: 2, triggerRate: 0.5, type: 'defense' }
    ],
    overallPower: 70
  },
  {
    id: 'char-c-049',
    name: 'Hank Pym (Elder)',
    alias: 'Original Ant-Man / Inventor',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Pym Particle discs (grow/shrink), robotic ant communication EMP, scientific genius.',
    description: 'Inventor of the Pym Particle and original Ant-Man using discs to alter object scales in combat.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/c6/Henry_Pym_%28Earth-1610%29_from_Ultimates_Vol_1_3_001.jpg/revision/latest?cb=20260102230635',
    color: '#DC2626',
    stats: { strength: 56, speed: 60, durability: 64, intelligence: 99, energy: 65, combat: 72 },
    specialAbilities: [
      { name: 'Enlarging Disc Throw', description: 'Throws a blue disc that turns a microscopic gear into a giant battering ram.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-050',
    name: 'Janet Van Dyne (Quantum Veteran)',
    alias: 'Original Wasp',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Quantum realm energy touch, survivalist martial arts, quantum bio-healing.',
    description: 'Original Wasp who survived 30 years in the Quantum Realm evolving strange energy powers.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/26/Ant-Man_and_the_Wasp_Quantumania_poster_013_textless.png/revision/latest?cb=20230213215053',
    color: '#F59E0B',
    stats: { strength: 60, speed: 72, durability: 68, intelligence: 92, energy: 75, combat: 80 },
    specialAbilities: [
      { name: 'Quantum Energy Infusion', description: 'Releases a soothing quantum shockwave that calms hostile energy.', bonusPower: 3, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-051',
    name: 'Grandmaster',
    alias: 'Ruler of Sakaar',
    grade: 'C',
    alignment: 'Neutral',
    startingPrice: 3,
    powers: 'Melt stick disintegration weapon, obedience disk controller, Elder of Universe longevity.',
    description: 'Eccentric ruler of Sakaar Contest of Champions wielding his horrifying liquefied Melt Stick.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/0/07/Avengers_Vol_7_689_Textless.jpg/revision/latest?cb=20180123211112',
    color: '#0284C7',
    stats: { strength: 55, speed: 62, durability: 70, intelligence: 94, energy: 70, combat: 65 },
    specialAbilities: [
      { name: 'Melt Stick Tap', description: 'Threatens the target with the liquefied melting rod.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-052',
    name: 'Topaz',
    alias: 'Grandmaster Bodyguard',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Sakaaran shock staff, stern combat discipline, starship cannon gunner.',
    description: 'No-nonsense Sakaaran enforcer wielding a high-voltage shock staff with ruthless loyalty.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/3c/Topaz_%28Earth-616%29_from_Marvel_War_of_Heroes_001.jpg/revision/latest?cb=20140812003111',
    color: '#334155',
    stats: { strength: 66, speed: 70, durability: 70, intelligence: 76, energy: 40, combat: 84 },
    specialAbilities: [
      { name: 'Shock Staff Prod', description: 'Prods the enemy with high-voltage Sakaaran stun charges.', bonusPower: 2, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-053',
    name: 'Stakar Ogord',
    alias: 'Starhawk / Original Ravager',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 4,
    powers: 'Ravager plasma blasters, light energy manipulation, veteran fleet commander.',
    description: 'High-ranking legendary Ravager captain revered by clans across all galaxies.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/24/Stakar_Ogord_%28Earth-691%29_from_Guardians_3000_0001.jpg/revision/latest?cb=20200323084031',
    color: '#EAB308',
    stats: { strength: 70, speed: 76, durability: 74, intelligence: 88, energy: 72, combat: 86 },
    specialAbilities: [
      { name: 'Ravager Fleet Salvo', description: 'Signals a coordinated laser barrage from clan starships.', bonusPower: 3, triggerRate: 0.55, type: 'attack' }
    ],
    overallPower: 76
  },
  {
    id: 'char-c-054',
    name: 'Martinex T\'Naga',
    alias: 'Pluvian Crystal Warrior',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Solid silicon crystal body, thermal blast hands, extreme temperature resistance.',
    description: 'Crystal-skinned Ravager from Pluto capable of firing intense heat or freezing cold from his hands.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/a/ad/Martinex_T%27Naga_%28Earth-691%29_from_Guardians_3000_Vol_1_2_0001.png/revision/latest/scale-to-width-down/323?cb=20141118072854',
    color: '#38BDF8',
    stats: { strength: 74, speed: 68, durability: 80, intelligence: 82, energy: 70, combat: 80 },
    specialAbilities: [
      { name: 'Thermal Crystal Ray', description: 'Projects alternating extreme freezing and boiling thermal beams.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-055',
    name: 'Charlie-27',
    alias: 'Jovian Super-Soldier',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: '11x Earth gravity dense muscle mass, heavy plasma cannon, military tactical pilot.',
    description: 'Genetically engineered Jovian soldier possessing eleven times normal human muscular density.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/52/Charlie-27_%28Earth-13122%29_from_LEGO_Marvel_Super_Heroes_2_001.png/revision/latest/scale-to-width-down/500?cb=20180114221319',
    color: '#B45309',
    stats: { strength: 80, speed: 62, durability: 82, intelligence: 76, energy: 40, combat: 84 },
    specialAbilities: [
      { name: 'Jovian Body Slam', description: 'Hurls his massive dense frame into the enemy like an artillery shell.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-056',
    name: 'Aleta Ogord',
    alias: 'Solid Light Construct Master',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Solid light energy shield casting, light disc projection, acrobatic combat.',
    description: 'Arcturian warrior wielding solid light energy constructs as impenetrable shields and blades.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/c/cd/Aleta_Ogord_%28Earth-691%29_from_Guardians_3000_Vol_1_4_001.jpg/revision/latest?cb=20150117002618',
    color: '#EC4899',
    stats: { strength: 64, speed: 76, durability: 74, intelligence: 82, energy: 78, combat: 82 },
    specialAbilities: [
      { name: 'Solid Light Shield Ram', description: 'Projects a hard light disc that deflects strikes and rams the foe.', bonusPower: 3, triggerRate: 0.55, type: 'defense' }
    ],
    overallPower: 75
  },
  {
    id: 'char-c-057',
    name: 'Krugarr',
    alias: 'Lem Sorcerer of Ravagers',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Eldritch magic mandalas, tao mandalas shields, levitation, interdimensional signs.',
    description: 'Worm-like alien sorcerer casting complex glowing Tao Mandalas and mystic spells.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/7b/Krugarr_%28Earth-691%29_from_Doctor_Strange_and_the_Sorcerers_Supreme_Vol_1_12_001.jpeg/revision/latest?cb=20220117232340',
    color: '#D97706',
    stats: { strength: 58, speed: 68, durability: 68, intelligence: 88, energy: 82, combat: 78 },
    specialAbilities: [
      { name: 'Tao Mandala Ward', description: 'Constructs twin orange eldritch shields to block and reflect attacks.', bonusPower: 3, triggerRate: 0.55, type: 'defense' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-058',
    name: 'Mainframe',
    alias: 'Operating System of the Ravagers',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Shipborne AI interface, laser turret control, electronic countermeasures.',
    description: 'Sentient cybernetic operating system commanding automated Ravager defenses.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/fb/Mainframe_%28Earth-982%29_from_Last_Planet_Standing_Vol_1_4_001.png/revision/latest?cb=20190614220512',
    color: '#06B6D4',
    stats: { strength: 45, speed: 60, durability: 72, intelligence: 96, energy: 70, combat: 60 },
    specialAbilities: [
      { name: 'Automated Turret Burst', description: 'Activates ceiling laser turrets in a targeted triangulation.', bonusPower: 2, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 70
  },
  {
    id: 'char-c-059',
    name: 'Sonny Burch',
    alias: 'Black Market Tech Smuggler',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Mercenary hired muscle, truth serum weapons, corporate extortion.',
    description: 'Southern black market dealer hunting quantum technology with hired goons.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/76/Sonny_Burch_%28Earth-199999%29_from_Ant-Man_and_the_Wasp_%28film%29_001.png/revision/latest?cb=20190110154842',
    color: '#CA8A04',
    stats: { strength: 52, speed: 58, durability: 60, intelligence: 82, energy: 20, combat: 62 },
    specialAbilities: [
      { name: 'Hired Goon Ambush', description: 'Calls three heavily armed muscle goons to surround the opponent.', bonusPower: 2, triggerRate: 0.45, type: 'tactical' }
    ],
    overallPower: 68
  },
  {
    id: 'char-c-060',
    name: 'Tracksuit Mafia Enforcer',
    alias: 'Ivan & the Bros',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Tracksuit solidarity, baseball bats, molotov cocktails, numbers advantage.',
    description: 'Russian street hoodlum shouting Bro while swarming enemies with baseball bats.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/2c/Hawkeye_%28TV_series%29_poster_008.jpg/revision/latest?cb=20211130090940',
    color: '#BE123C',
    stats: { strength: 60, speed: 62, durability: 64, intelligence: 60, energy: 20, combat: 72 },
    specialAbilities: [
      { name: 'Bro Mob Swarm', description: 'Rushes the target with multiple tracksuited henchmen swinging bats.', bonusPower: 2, triggerRate: 0.45, type: 'attack' }
    ],
    overallPower: 69
  },
  {
    id: 'char-c-061',
    name: 'Kingpin Heavy Enforcer',
    alias: 'Fisk Syndicate Muscle',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Crowbar, kevlar vest, heavy boxing, ruthless underground loyalty.',
    description: 'Handpicked syndicate heavy dispatched to intimidate and pulverize street heroes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/5/58/Ultimate_Spider-Man_Vol_1_12_page_02-03_Enforcers_%28Earth-1610%29.jpg/revision/latest?cb=20091009191404',
    color: '#1E293B',
    stats: { strength: 70, speed: 60, durability: 70, intelligence: 65, energy: 20, combat: 76 },
    specialAbilities: [
      { name: 'Crowbar Knee Strike', description: 'Swings a heavy steel crowbar targeting lower joint weaknesses.', bonusPower: 2, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 71
  },
  {
    id: 'char-c-062',
    name: 'Hammer Drone (Tactical Model)',
    alias: 'Hammer Industries Warbot',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Armored titanium chassis, Gatling cannon, shoulder rockets, remote auto-targeting.',
    description: 'Mass-produced militarized robot designed by Justin Hammer with heavy Gatling guns.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f7/Hammer_Drones_Expo_from_Iron_Man_2_%28film%29_0001.jpg/revision/latest?cb=20130418143608',
    color: '#64748B',
    stats: { strength: 72, speed: 64, durability: 76, intelligence: 70, energy: 72, combat: 74 },
    specialAbilities: [
      { name: 'Gatling Gun Sweep', description: 'Unloads a 100-round high-velocity lead storm in an arc.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-063',
    name: 'HYDRA Cyber-Trooper',
    alias: 'HYDRA Elite Guard',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 3,
    powers: 'Tesseract energy rifle, body armor, fanatical indoctrination, stun baton.',
    description: 'Elite soldier armed with blue energy blasters engineered from secret HYDRA labs.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/71/Silas_Burr_%28Earth-616%29_from_Wolverine_Vol_8_1_001.jpg/revision/latest?cb=20240911223017',
    color: '#047857',
    stats: { strength: 65, speed: 68, durability: 70, intelligence: 74, energy: 70, combat: 80 },
    specialAbilities: [
      { name: 'Tesseract Beam Shot', description: 'Fires a glowing blue beam that disintegrates obstacles.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-064',
    name: 'Ravager Brahl',
    alias: 'Achernian Ravager Sniper',
    grade: 'C',
    alignment: 'Villain',
    startingPrice: 2,
    powers: 'Intangibility shifting, sniper rifle, Ravager stealth knives.',
    description: 'Achernian alien capable of phasing through matter to set up sniper ambushes.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/2/20/Brahl_%28Earth-199999%29_from_Guardians_of_the_Galaxy_Vol._2_%28film%29_0001.jpg/revision/latest?cb=20180411041827',
    color: '#475569',
    stats: { strength: 60, speed: 72, durability: 66, intelligence: 76, energy: 60, combat: 78 },
    specialAbilities: [
      { name: 'Phase-Shift Shot', description: 'Phases rifle barrel through a barrier to fire an unobstructed round.', bonusPower: 2, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-065',
    name: 'Karen Page',
    alias: 'Bulletin Investigative Reporter',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Investigative tenacity, concealed handgun defense, fearless pursuit of truth.',
    description: 'Fearless investigative reporter who uncovers underworld conspiracies and defends herself.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/b7/Karen_Page_%28Earth-616%29_from_Official_Handbook_of_the_Marvel_Universe_A_to_Z_Vol_1_8_0001.png/revision/latest?cb=20250520152343',
    color: '#2563EB',
    stats: { strength: 50, speed: 62, durability: 60, intelligence: 90, energy: 20, combat: 68 },
    specialAbilities: [
      { name: 'Exposé Insight', description: 'Identifies the critical weakness in the opponent strategy through research.', bonusPower: 2, triggerRate: 0.5, type: 'tactical' }
    ],
    overallPower: 69
  },
  {
    id: 'char-c-066',
    name: 'Howard Stark (Prime)',
    alias: 'Founder of Stark Industries',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Vibranium metallurgy, SSR super-soldier lab, flying car prototype, genius inventor.',
    description: 'Industrial genius who forged Captain America shield and built the SSR war machines.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/7/74/Howard_Stark_%28Earth-161%29_from_X-Men_Forever_Vol_2_21_001.jpg/revision/latest?cb=20100427025109',
    color: '#CA8A04',
    stats: { strength: 54, speed: 62, durability: 64, intelligence: 98, energy: 50, combat: 68 },
    specialAbilities: [
      { name: 'Vibranium Prototype Field', description: 'Deploys an experimental vibrational shielding device.', bonusPower: 3, triggerRate: 0.5, type: 'defense' }
    ],
    overallPower: 73
  },
  {
    id: 'char-c-067',
    name: 'Blind Al',
    alias: 'Althea (Wade\'s Roommate)',
    grade: 'C',
    alignment: 'Anti-Hero',
    startingPrice: 2,
    powers: 'Concealed 12-gauge shotgun, devastating verbal insults, IKEA assembly endurance.',
    description: 'Blind elderly roommate of Deadpool who keeps a shotgun loaded and a sharp tongue ready.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/61/Blind_Al_%28Althea%29_%28Earth-616%29_from_Deadpool_Corps_Rank_and_Foul_Vol_1_1_0001.jpg/revision/latest?cb=20170126093540',
    color: '#DC2626',
    stats: { strength: 45, speed: 52, durability: 60, intelligence: 82, energy: 20, combat: 70 },
    specialAbilities: [
      { name: 'Blind Shotgun Blast', description: 'Fires a deafening shotgun spread in the general direction of hostility.', bonusPower: 2, triggerRate: 0.45, type: 'attack' }
    ],
    overallPower: 68
  },
  {
    id: 'char-c-068',
    name: 'Weasel',
    alias: 'Jack Hammer (Merc Bartender)',
    grade: 'C',
    alignment: 'Neutral',
    startingPrice: 2,
    powers: 'Mercenary contract intelligence, shotgun under the counter, cynical survival instinct.',
    description: 'Bartender at Sister Margaret School for Wayward Girls brokering mercenary contracts.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/e/eb/Jack_Hammer_%28Earth-616%29_from_Deadpool_Vol_3_23_001.jpg/revision/latest?cb=20160329183901',
    color: '#D97706',
    stats: { strength: 50, speed: 58, durability: 60, intelligence: 84, energy: 20, combat: 64 },
    specialAbilities: [
      { name: 'Barroom Distraction', description: 'Smashes a bottle and ducks behind the bar to avoid retaliation.', bonusPower: 2, triggerRate: 0.45, type: 'defense' }
    ],
    overallPower: 68
  },
  {
    id: 'char-c-069',
    name: 'Dopinder',
    alias: 'The Dedicated Cabbie',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Yellow cab vehicular ramming, ruthless mercenary ambition, trunk storage.',
    description: 'Enthusiastic taxi driver eager to serve as Deadpool official getaway wheelman.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/1/16/Dopinder_%28Earth-10005%29_from_Deadpool_%26_Wolverine_002.png/revision/latest?cb=20241014104115',
    color: '#EAB308',
    stats: { strength: 52, speed: 64, durability: 62, intelligence: 78, energy: 20, combat: 66 },
    specialAbilities: [
      { name: 'Cab Accelerator Ram', description: 'Floors the accelerator of his yellow taxi for a direct vehicular strike.', bonusPower: 2, triggerRate: 0.45, type: 'attack' }
    ],
    overallPower: 69
  },
  {
    id: 'char-c-070',
    name: 'Peter W.',
    alias: 'X-Force Sugar Dad',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Type 1 and 2 diabetes resilience, high-visibility jacket, sincere encouragement.',
    description: 'Ordinary guy with no powers who saw the X-Force ad and decided to give it a shot.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/6/68/Peter_W._%28Earth-41633%29_from_Deadpool_2_poster_027.jpeg/revision/latest?cb=20200731132607',
    color: '#16A34A',
    stats: { strength: 50, speed: 52, durability: 62, intelligence: 76, energy: 15, combat: 58 },
    specialAbilities: [
      { name: 'Wholesome Pep Talk', description: 'Offers genuine kind encouragement that somehow flusters the opponent.', bonusPower: 2, triggerRate: 0.45, type: 'tactical' }
    ],
    overallPower: 67
  },
  {
    id: 'char-c-071',
    name: 'Dum Dum Dugan',
    alias: 'Howling Commandos Veteran',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Bowler hat grit, Winchester shotgun mastery, heavy boxing, Howling Commandos morale.',
    description: 'Iconic Howling Commando wielding his signature shotgun and bowler hat across WW2 frontlines.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/b/bb/Timothy_Dugan_%28Earth-6160%29_from_Ultimate_Universe_One_Year_In_Vol_1_1_001.jpg/revision/latest?cb=20241215175820',
    color: '#78350F',
    stats: { strength: 70, speed: 64, durability: 74, intelligence: 78, energy: 30, combat: 85 },
    specialAbilities: [
      { name: 'Winchester Heavy Blast', description: 'Pumps double shells into close quarters with veteran swagger.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 74
  },
  {
    id: 'char-c-072',
    name: 'Gabe Jones',
    alias: 'Howling Commandos Heavy Gunner',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Browning M1919 machine gunner, tactical battlefield suppressive fire.',
    description: 'Howling Commando providing heavy machine gun fire support to breach fortified positions.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/f/f3/Gabriel_Jones_%28Earth-616%29_from_Secret_Warriors_Vol_1_4_003.jpg/revision/latest?cb=20241014031840',
    color: '#475569',
    stats: { strength: 66, speed: 64, durability: 70, intelligence: 78, energy: 25, combat: 82 },
    specialAbilities: [
      { name: 'Suppressive Lead Stream', description: 'Lays down continuous heavy suppressing machine gun fire.', bonusPower: 2, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-073',
    name: 'Jim Morita',
    alias: 'Howling Commandos Comm Officer',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Radio warfare, combat rifle marksmanship, trench warfare survival.',
    description: 'Howling Commando communications specialist and lethal trench rifle marksman.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/3/38/James_Morita_%28Earth-199999%29_from_Marvel%27s_Agents_of_S.H.I.E.L.D._Season_2_1.png/revision/latest?cb=20190125120850',
    color: '#334155',
    stats: { strength: 62, speed: 66, durability: 68, intelligence: 82, energy: 25, combat: 80 },
    specialAbilities: [
      { name: 'Precision Trench Shot', description: 'Fires an accurate rifle shot from behind fortified cover.', bonusPower: 2, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-074',
    name: 'Jacques Dernier',
    alias: 'French Resistance Demolitions',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 2,
    powers: 'Dynamite & plastic explosives, guerilla sabotage, submachine gun.',
    description: 'French Resistance fighter in the Howling Commandos specializing in demolitions and traps.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/d/d9/Jacques_Dernier_%28Earth-616%29_from_Sgt._Fury_Vol_1_21_001.jpg/revision/latest?cb=20210807204103',
    color: '#B91C1C',
    stats: { strength: 62, speed: 66, durability: 66, intelligence: 84, energy: 30, combat: 80 },
    specialAbilities: [
      { name: 'Dynamite Trap Detonation', description: 'Sets off a hidden charge of explosives beneath the target.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 72
  },
  {
    id: 'char-c-075',
    name: 'James Montgomery Falsworth',
    alias: 'Union Jack (Howling Commandos)',
    grade: 'C',
    alignment: 'Hero',
    startingPrice: 3,
    powers: 'Webley revolver precision, British special forces infiltration, commando knife.',
    description: 'Noble British commando wielding twin revolvers and lethal trench knife combat skills.',
    imageUrl: 'https://static.wikia.nocookie.net/marveldatabase/images/8/88/James_Falsworth_%28Earth-199999%29_from_Captain_America_The_First_Avenger_0002.jpg/revision/latest?cb=20190125120403',
    color: '#1E3A8A',
    stats: { strength: 65, speed: 72, durability: 68, intelligence: 82, energy: 25, combat: 86 },
    specialAbilities: [
      { name: 'Webley Double Tap', description: 'Fires two rapid heavy-caliber rounds into vital armor points.', bonusPower: 3, triggerRate: 0.5, type: 'attack' }
    ],
    overallPower: 74
  }
];

export interface MarvelFunFact {
  id: number;
  category: 'Comic Lore' | 'MCU Easter Egg' | 'Creator Secrets' | 'Hero Trivia' | 'Cosmic Mystery';
  title: string;
  fact: string;
  source: string;
  icon: string;
  color: string;
}

export const MARVEL_FUN_FACTS: MarvelFunFact[] = [
  {
    "id": 1,
    "category": "Hero Trivia",
    "title": "Spider-Man Was Almost A Fly",
    "fact": "Stan Lee originally brainstormed a hero who could stick to walls and considered \"Fly-Man\" and \"Insect-Man\" before settling on \"Spider-Man\". Publisher Martin Goodman initially hated the idea, claiming people despise spiders!",
    "source": "Amazing Fantasy #15 (1962)",
    "icon": "🕷️",
    "color": "#EF4444"
  },
  {
    "id": 2,
    "category": "Creator Secrets",
    "title": "Wolverine Was Originally A Literal Wolverine Mutant",
    "fact": "Writer Len Wein and artist John Romita Sr. originally envisioned Wolverine not as a human mutant, but as an actual biological wolverine animal mutated into human form by the High Evolutionary!",
    "source": "Incredible Hulk #181 (1974)",
    "icon": "🐺",
    "color": "#F59E0B"
  },
  {
    "id": 3,
    "category": "MCU Easter Egg",
    "title": "Tony Stark's J.A.R.V.I.S. Is An Acronym",
    "fact": "In Marvel lore, J.A.R.V.I.S. officially stands for \"Just A Rather Very Intelligent System\", named after Edwin Jarvis, the legendary family butler who raised Tony Stark.",
    "source": "Iron Man (2008) / Tales of Suspense #59",
    "icon": "🤖",
    "color": "#06B6D4"
  },
  {
    "id": 4,
    "category": "Comic Lore",
    "title": "Deadpool's Real Name Is A DC Parody",
    "fact": "Deadpool's alter ego, Wade Wilson, was created by Fabian Nicieza and Rob Liefeld as an affectionate parody of DC Comics assassin Slade Wilson (Deathstroke)!",
    "source": "The New Mutants #98 (1991)",
    "icon": "⚔️",
    "color": "#DC2626"
  },
  {
    "id": 5,
    "category": "Cosmic Mystery",
    "title": "Thanos Sits In A Sanctuary Floating Chair",
    "fact": "Thanos built a cosmic hovering throne capable of faster-than-light interstellar travel, force field generation, and dimension hopping long before collecting the Infinity Stones.",
    "source": "Iron Man #55 (1973)",
    "icon": "🌌",
    "color": "#8B5CF6"
  },
  {
    "id": 6,
    "category": "Creator Secrets",
    "title": "The Incredible Hulk Was Originally Grey",
    "fact": "In his 1962 debut, the Hulk had grey skin. However, the color printing press struggled with consistent grey tones, creating shades of green. Stan Lee loved the green look and changed it permanently in Issue #2!",
    "source": "The Incredible Hulk #1-2 (1962)",
    "icon": "🧪",
    "color": "#10B981"
  },
  {
    "id": 7,
    "category": "Hero Trivia",
    "title": "Captain America's First Shield Was Triangular",
    "fact": "In Captain America Comics #1 (1941), Cap carried a traditional triangular kite shield. MLJ Comics complained it resembled their hero \"The Shield\", so Marvel gave him the iconic circular Vibranium disc in Issue #2!",
    "source": "Captain America Comics #1-2 (1941)",
    "icon": "🛡️",
    "color": "#3B82F6"
  },
  {
    "id": 8,
    "category": "MCU Easter Egg",
    "title": "Thor Once Turned Into A Frog (Throg)",
    "fact": "In comic canon, Loki turned Thor into a literal frog in Central Park. He fought rats alongside Puddlegulp and eventually lifted a sliver of Mjolnir to become \"Frog of Thunder\"!",
    "source": "Thor #364 (1986) / Loki Series Easter Egg",
    "icon": "⚡",
    "color": "#FBBF24"
  },
  {
    "id": 9,
    "category": "Comic Lore",
    "title": "Black Panther Was The First Mainstream Black Superhero",
    "fact": "Created by Stan Lee & Jack Kirby in 1966, T'Challa debuted in Fantastic Four #52, predating Falcon (1969), Luke Cage (1972), and Green Lantern John Stewart (1971).",
    "source": "Fantastic Four #52 (1966)",
    "icon": "🐾",
    "color": "#9333EA"
  },
  {
    "id": 10,
    "category": "Hero Trivia",
    "title": "Daredevil's Radar Sense Is Stronger Than Sight",
    "fact": "Matt Murdock's radar sense can detect heartbeats through concrete walls to act as a human lie detector, read printed text by feeling ink indents with his fingertips, and sense changes in air pressure!",
    "source": "Daredevil #1 (1964)",
    "icon": "🦯",
    "color": "#EF4444"
  },
  {
    "id": 11,
    "category": "Cosmic Mystery",
    "title": "The Infinity Stones Were Originally Called Soul Gems",
    "fact": "When first introduced in 1972, the Infinity Stones were all collectively called \"Soul Gems\" and were green before Thanos collected all six and renamed them the Infinity Stones in 1990.",
    "source": "Marvel Premiere #1 / Thanos Quest (1990)",
    "icon": "💎",
    "color": "#EC4899"
  },
  {
    "id": 12,
    "category": "Creator Secrets",
    "title": "Stan Lee's Famous Catchphrase \"Excelsior!\"",
    "fact": "Stan Lee started signing his comic columns with \"Excelsior!\" (Latin for \"ever upward\") because rival publishers kept copying his other sign-offs like \"Face Front\" and \"Nuff Said\"!",
    "source": "Stan's Soapbox (1968)",
    "icon": "✍️",
    "color": "#F59E0B"
  },
  {
    "id": 13,
    "category": "Hero Trivia",
    "title": "Doctor Strange Was A Surgeon Before Sorcerer Supreme",
    "fact": "Stephen Strange was one of the world's top neurosurgeons before a devastating car accident crushed the nerve endings in his hands, driving his global journey to Kamar-Taj.",
    "source": "Strange Tales #110 (1963)",
    "icon": "🔮",
    "color": "#06B6D4"
  },
  {
    "id": 14,
    "category": "MCU Easter Egg",
    "title": "Stan Lee Has A Guinness World Record For Marvel Cameos",
    "fact": "Stan Lee made over 60 on-screen cameo appearances across Marvel movies, TV series, video games, and animated shows, making him the most prolific cameo actor in cinema history.",
    "source": "Guinness World Records (2018)",
    "icon": "🎬",
    "color": "#E11D48"
  },
  {
    "id": 15,
    "category": "Comic Lore",
    "title": "Groot Once Spoke Full Grammatical Sentences",
    "fact": "In his first appearance in Tales to Astonish #13 (1960), Groot was an invading alien monster who spoke fluent English, shouting \"I am Groot, Monarch of Planet X!\" before his vocabulary was retconned.",
    "source": "Tales to Astonish #13 (1960)",
    "icon": "🌳",
    "color": "#10B981"
  },
  {
    "id": 16,
    "category": "Cosmic Mystery",
    "title": "The One-Above-All Represents The Comic Creator",
    "fact": "The supreme omnipotent deity of the Marvel Multiverse, The One-Above-All, often manifests in the appearance of legendary Marvel creator Jack Kirby.",
    "source": "Fantastic Four #511 (2004)",
    "icon": "👑",
    "color": "#F59E0B"
  },
  {
    "id": 17,
    "category": "Hero Trivia",
    "title": "Iron Man Built Armor Out Of Pure Vibranium & Uru Metal",
    "fact": "Tony Stark created the \"Thorbuster\" armor powered by an Asgardian crystal, and later the \"Bleeding Edge\" armor composed entirely of microscopic nanobots stored inside his own bone marrow.",
    "source": "Iron Man Vol. 3 #64 / Invincible Iron Man #25",
    "icon": "🦾",
    "color": "#EF4444"
  },
  {
    "id": 18,
    "category": "MCU Easter Egg",
    "title": "Captain Marvel's Cat \"Chewie\" (Goose) Is A Flerken",
    "fact": "Carol Danvers' pet cat is actually a rare alien Flerken containing pocket dimensions inside its mouth, capable of spawning massive tentacles and swallowing Infinity Stones!",
    "source": "Giant-Size Ms. Marvel #1 (2006)",
    "icon": "🐱",
    "color": "#F59E0B"
  },
  {
    "id": 19,
    "category": "Creator Secrets",
    "title": "Magneto and Professor X Were Inspired By Real History",
    "fact": "Stan Lee modeled the philosophical dynamic between Charles Xavier and Magneto after civil rights leaders Martin Luther King Jr. and Malcolm X, reflecting two contrasting approaches to mutant freedom.",
    "source": "X-Men #1 (1963) / Stan Lee Interviews",
    "icon": "🧲",
    "color": "#8B5CF6"
  },
  {
    "id": 20,
    "category": "Hero Trivia",
    "title": "Deadpool Knows He Is In A Comic Book",
    "fact": "Deadpool possesses \"Medium Awareness\" (breaking the fourth wall), allowing him to read past comic issues, reference writers and artists, and even use comic panels as weapons in battles!",
    "source": "Deadpool #1 (1997)",
    "icon": "💬",
    "color": "#DC2626"
  },
  {
    "id": 21,
    "category": "Comic Lore",
    "title": "Venom Was Originally Created By A Fan For $220",
    "fact": "In 1982, Marvel fan Randy Schueller submitted the idea of Spider-Man wearing a stealth black costume. Marvel Editor-in-Chief Jim Shooter bought the concept for $220, which later evolved into Venom!",
    "source": "Marvel Age #12 (1984)",
    "icon": "🕷️",
    "color": "#1E293B"
  },
  {
    "id": 22,
    "category": "Hero Trivia",
    "title": "Magneto Can Manipulate The Entire Earth's Electromagnetic Field",
    "fact": "At peak power, Magneto can bend light, create wormholes, rip iron directly out of human blood, and reverse the Earth's geomagnetic poles, causing global blackouts.",
    "source": "X-Men #25 / Ultimatum #1",
    "icon": "🧲",
    "color": "#7C3AED"
  },
  {
    "id": 23,
    "category": "Cosmic Mystery",
    "title": "Galactus Eats Planets Because He Must Maintain Universal Balance",
    "fact": "Galactus is not inherently evil. In cosmic canon, he consumes planet energies to prevent the cosmic devourer Abraxas from awakening and destroying the entire multiverse.",
    "source": "Fantastic Four #262 (1983)",
    "icon": "🪐",
    "color": "#8B5CF6"
  },
  {
    "id": 24,
    "category": "MCU Easter Egg",
    "title": "Loki Was The Very First Villain The Avengers Fought",
    "fact": "In Avengers #1 (1963), Loki tricked the Hulk into destroying a train track, forcing Thor, Iron Man, Ant-Man, and Wasp to band together for the first time in history.",
    "source": "The Avengers #1 (1963)",
    "icon": "👑",
    "color": "#10B981"
  },
  {
    "id": 25,
    "category": "Creator Secrets",
    "title": "Jack Kirby Created Over 300 Marvel Characters",
    "fact": "Legendary artist Jack \"The King\" Kirby co-created Captain America, Thor, Iron Man, Hulk, Fantastic Four, X-Men, Black Panther, Silver Surfer, Galactus, and Doctor Doom!",
    "source": "Marvel Comics History Archive",
    "icon": "👑",
    "color": "#F59E0B"
  },
  {
    "id": 26,
    "category": "Hero Trivia",
    "title": "Hawkeye Has 100% Accuracy Even While Blindfolded",
    "fact": "Clint Barton has trained his muscle memory to extraordinary extremes—he can flick coins to knock enemies out, throw toothpicks through windows, and calculate ricochet trajectories in fractions of a second.",
    "source": "Hawkeye #1-4 / Tales of Suspense #57",
    "icon": "🏹",
    "color": "#8B5CF6"
  },
  {
    "id": 27,
    "category": "Comic Lore",
    "title": "Doctor Strange Passed A Test Of Death To Become Sorcerer Supreme",
    "fact": "The Ancient One and the cosmic entity Eternity tested Stephen Strange by killing him spiritually. He embraced death without fear, conquering his mortality and earning the Sorcerer Supreme mantle.",
    "source": "Doctor Strange #10 (1974)",
    "icon": "👁️",
    "color": "#06B6D4"
  },
  {
    "id": 28,
    "category": "MCU Easter Egg",
    "title": "The Wakandan Language Is Real-World isiXhosa",
    "fact": "The fictional African nation of Wakanda speaks isiXhosa, one of the official languages of South Africa, chosen by actor John Kani (King T'Chaka) and adopted for the MCU.",
    "source": "Captain America: Civil War (2016) / Black Panther (2018)",
    "icon": "🐾",
    "color": "#9333EA"
  },
  {
    "id": 29,
    "category": "Cosmic Mystery",
    "title": "The Living Tribunal Has Three Faces Representing The Multiverse",
    "fact": "The Living Tribunal possesses three distinct faces: Equity (front), Necessity (right), and Vengeance (left), all of which must reach full consensus before rendering cosmic judgment on an entire universe.",
    "source": "Strange Tales #157 (1967)",
    "icon": "⚖️",
    "color": "#F59E0B"
  },
  {
    "id": 30,
    "category": "Hero Trivia",
    "title": "Black Widow Received A Russian Super Soldier Serum Variant",
    "fact": "In Marvel comics, Natasha Romanoff was enhanced by the Soviet Red Room with biochemical treatments that slowed her aging, gave her peak agility, and enhanced her immune system.",
    "source": "Black Widow: The Coldest War (1990)",
    "icon": "🕷️",
    "color": "#EF4444"
  },
  {
    "id": 31,
    "category": "Hero Trivia",
    "title": "Doctor Doom Rules Latveria With Diplomatic Immunity",
    "fact": "Victor Von Doom has sovereign immunity as monarch of Latveria, meaning the Avengers cannot arrest him on US soil unless he initiates act of war!",
    "source": "Fantastic Four #5 (1962)",
    "icon": "👑",
    "color": "#10B981"
  },
  {
    "id": 32,
    "category": "Hero Trivia",
    "title": "Cyclops Visor Is Made Of Pure Ruby-Quartz",
    "fact": "Scott Summers' optic blasts emit continuous concussive solar energy from a non-Einsteinian dimension. Only ruby-quartz crystals can safely resonate and contain the beam.",
    "source": "X-Men #1 (1963)",
    "icon": "🕶️",
    "color": "#EF4444"
  },
  {
    "id": 33,
    "category": "Hero Trivia",
    "title": "Captain America Can Never Get Drunk",
    "fact": "Due to the Super Soldier Serum running through Steve Rogers' veins, his metabolic rate operates at 400% human efficiency, burning through alcohol toxins before they can affect his nervous system.",
    "source": "Captain America #109 (1969)",
    "icon": "🛡️",
    "color": "#3B82F6"
  },
  {
    "id": 34,
    "category": "Comic Lore",
    "title": "Nightcrawler Can Teleport Through The Brimstone Dimension",
    "fact": "When Kurt Wagner disappears in a puff of purple smoke (BAMF), he physically passes through the Brimstone Dimension, leaving behind a brief smell of sulfur.",
    "source": "Giant-Size X-Men #1 (1975)",
    "icon": "💨",
    "color": "#8B5CF6"
  },
  {
    "id": 35,
    "category": "Hero Trivia",
    "title": "Thor's Belt Megingjord Doubles His Strength",
    "fact": "When facing cosmic cataclysms, Thor equips his magical Asgardian belt Megingjord, which instantly multiplies his godlike strength and vitality by two-fold.",
    "source": "Journey into Mystery #91 (1963)",
    "icon": "⚡",
    "color": "#F59E0B"
  },
  {
    "id": 36,
    "category": "Creator Secrets",
    "title": "Namor Was Marvel's Very First Superhero in 1939",
    "fact": "Debuting in Motion Picture Funnies Weekly #1 in April 1939, Namor the Sub-Mariner is historically the first official superhero created for Marvel Comics (Timely Comics).",
    "source": "Motion Picture Funnies Weekly #1 (1939)",
    "icon": "🔱",
    "color": "#06B6D4"
  },
  {
    "id": 37,
    "category": "Hero Trivia",
    "title": "Punisher's Skull Logo Has A Psychological Tactical Purpose",
    "fact": "Frank Castle wears the stark white skull on his chest specifically to draw enemy gunfire toward his armored Kevlar chest plate instead of his unprotected head.",
    "source": "The Punisher #1 (1986)",
    "icon": "💀",
    "color": "#E2E8F0"
  },
  {
    "id": 38,
    "category": "Comic Lore",
    "title": "Scarlet Witch Erased 98% Of All Mutants With 3 Words",
    "fact": "In House of M #7 (2005), Wanda Maximoff altered reality by uttering \"No More Mutants\", instantly stripping millions of mutants across the globe of their X-genes.",
    "source": "House of M #7 (2005)",
    "icon": "🪄",
    "color": "#E11D48"
  },
  {
    "id": 39,
    "category": "Hero Trivia",
    "title": "Black Panther Once Defeated Mephisto In Hell With Science",
    "fact": "T'Challa allowed Mephisto to tear his heart out in Hell, but used nanotech inhibitors in his bloodstream to short-circuit Mephisto's demonic realm connection, subduing the devil!",
    "source": "Black Panther #5 (1998)",
    "icon": "🐾",
    "color": "#9333EA"
  },
  {
    "id": 40,
    "category": "Creator Secrets",
    "title": "The Daily Bugle Was Created By Stan Lee & Steve Ditko",
    "fact": "J. Jonah Jameson's newspaper debut occurred in The Amazing Spider-Man #1 (1963), named after the loud bugle horn used in historic military announcements.",
    "source": "The Amazing Spider-Man #1 (1963)",
    "icon": "📰",
    "color": "#64748B"
  },
  {
    "id": 41,
    "category": "Creator Secrets",
    "title": "Rocket Raccoon Was Inspired By A Beatles Song",
    "fact": "Bill Mantlo and Keith Giffen created Rocket Raccoon in 1976, naming him after the 1968 Beatles song \"Rocky Raccoon\".",
    "source": "Marvel Preview #7 (1976)",
    "icon": "🦝",
    "color": "#F59E0B"
  },
  {
    "id": 42,
    "category": "Hero Trivia",
    "title": "Gamora Is Known Across The Galaxy As The Deadliest Woman",
    "fact": "Enhanced cybernetically by Thanos, Gamora possesses martial arts knowledge of 83% of all known alien species, allowing her to paralyze opponents with single pressure strikes.",
    "source": "Strange Tales #180 (1975)",
    "icon": "🗡️",
    "color": "#10B981"
  },
  {
    "id": 43,
    "category": "Comic Lore",
    "title": "Moon Knight Beat Thor By Controlling The Moon Rock In Mjolnir",
    "fact": "In Avengers (2020) \"Age of Khonshu\", Moon Knight realized Mjolnir is made of Uru (moon rock) and used his avatar deity powers to seize control of Thor's hammer!",
    "source": "Avengers Vol. 8 #33 (2020)",
    "icon": "🌙",
    "color": "#F8FAFC"
  },
  {
    "id": 44,
    "category": "Hero Trivia",
    "title": "Miles Morales Has An Invisibility Camouflage Cloak",
    "fact": "Unlike Peter Parker, Miles Morales can blend his bio-chromatic pigmentation seamlessly into any background, rendering him completely invisible to both optical sight and night vision.",
    "source": "Ultimate Comics Spider-Man #1 (2011)",
    "icon": "🕷️",
    "color": "#DC2626"
  },
  {
    "id": 45,
    "category": "Creator Secrets",
    "title": "Silver Surfer Was Added Without Stan Lee's Permission",
    "fact": "Jack Kirby drew the Silver Surfer on a flying cosmic surfboard into Fantastic Four #48 on a whim because he was tired of drawing spaceships. Stan Lee loved it instantly!",
    "source": "Fantastic Four #48 (1966)",
    "icon": "🏄‍♂️",
    "color": "#38BDF8"
  },
  {
    "id": 46,
    "category": "Comic Lore",
    "title": "Juggernaut Is Mystically Empowered, Not A Mutant",
    "fact": "Cain Marko's unstoppable momentum comes from the mystical Crimson Gem of Cyttorak, which wraps him in an unyielding cosmic avatar field that defies earthly inertia.",
    "source": "X-Men #12 (1965)",
    "icon": "🛑",
    "color": "#EF4444"
  },
  {
    "id": 47,
    "category": "Hero Trivia",
    "title": "Quicksilver Can Think and React at Sub-Millisecond Speeds",
    "fact": "Pietro Maximoff experiences normal human life in extreme slow motion. He once explained that talking to normal humans feels like standing behind someone at an ATM who doesn't know how to use it.",
    "source": "X-Factor #87 (1993)",
    "icon": "⚡",
    "color": "#38BDF8"
  },
  {
    "id": 48,
    "category": "Cosmic Mystery",
    "title": "The Beyonder Was An Entire Sentient Universe",
    "fact": "In Secret Wars (1984), the Beyonder was not just an entity—he was the conscious manifestation of an entire omnipotent multiverse beyond the Marvel Prime reality.",
    "source": "Secret Wars #1 (1984)",
    "icon": "🌌",
    "color": "#F59E0B"
  },
  {
    "id": 49,
    "category": "Hero Trivia",
    "title": "Emma Frost's Secondary Mutation Is Flawless Diamond Skin",
    "fact": "In addition to Omega-level telepathy, Emma Frost can transmute her biological body into indestructible organic diamond, granting superhuman durability and immunity to telepathy.",
    "source": "New X-Men #116 (2001)",
    "icon": "💎",
    "color": "#06B6D4"
  },
  {
    "id": 50,
    "category": "Hero Trivia",
    "title": "Iron Man's First Armor Was Crafted Out Of Scrap Metal & Spare Transistors",
    "fact": "Trapped in a bunker by warlord Wong-Chu, Tony Stark and Ho Yinsen built the Model 1 Mark I armor using scrap iron, crude solder, and a repurposed car battery.",
    "source": "Tales of Suspense #39 (1963)",
    "icon": "🦾",
    "color": "#94A3B8"
  },
  {
    "id": 51,
    "category": "Creator Secrets",
    "title": "Doctor Strange Has A Sanctum Sanctorum Address In Real Life",
    "fact": "177A Bleecker Street in Greenwich Village, New York is a real-world address that writers Roy Thomas and Gary Friedrich once lived in as roommates in the 1960s!",
    "source": "Strange Tales #110 / Marvel Historical Tour",
    "icon": "🏛️",
    "color": "#8B5CF6"
  },
  {
    "id": 52,
    "category": "Hero Trivia",
    "title": "Magneto Helmet Protects Him From Professor X's Telepathy",
    "fact": "Magneto forged his iconic helmet using specialized electromagnetic alloys lined with telepathic dampeners, preventing any psychic mind-control attempts.",
    "source": "X-Men #1 (1963)",
    "icon": "🪖",
    "color": "#7C3AED"
  },
  {
    "id": 53,
    "category": "Cosmic Mystery",
    "title": "Ego The Living Planet Traveled The Cosmos For Billions Of Years",
    "fact": "Ego is a planetary-sized super-organism with a conscious brain, capable of planetary digestion, atmospheric manipulation, and psionic energy blast projection.",
    "source": "Thor #132 (1966)",
    "icon": "🪐",
    "color": "#9333EA"
  },
  {
    "id": 54,
    "category": "Comic Lore",
    "title": "Nick Fury Fought in World War II With The Howling Commandos",
    "fact": "In original Marvel canon, Sergeant Nick Fury commanded the elite Howling Commandos in WWII and stays youthful due to regular doses of the Infinity Formula.",
    "source": "Sgt. Fury and his Howling Commandos #1 (1963)",
    "icon": "🎖️",
    "color": "#64748B"
  },
  {
    "id": 55,
    "category": "Hero Trivia",
    "title": "Captain Marvel Absorbs Nuclear Energy Like A Battery",
    "fact": "Carol Danvers can absorb virtually infinite amounts of ambient radiation, magic, and cosmic plasma, channeling it into her devastating Binary white hole form.",
    "source": "Uncanny X-Men #164 (1982)",
    "icon": "💫",
    "color": "#F59E0B"
  },
  {
    "id": 56,
    "category": "Hero Trivia",
    "title": "Winter Soldier Has A Bionic Arm Made Of Russian Titanium & Cybernetics",
    "fact": "Bucky Barnes survived the explosion of Baron Zemo's rocket and was revived by Department X, who replaced his amputated left arm with an EMP-emitting bionic limb.",
    "source": "Captain America Vol. 5 #1 (2005)",
    "icon": "🦾",
    "color": "#94A3B8"
  },
  {
    "id": 57,
    "category": "Comic Lore",
    "title": "The Sentinels Were Created By Anthropologist Bolivar Trask",
    "fact": "Bolivar Trask engineered the mutant-hunting robotic Sentinels out of fear of Homo superior, only for Master Mold to turn against its creator to control humanity.",
    "source": "X-Men #14 (1965)",
    "icon": "🤖",
    "color": "#8B5CF6"
  },
  {
    "id": 58,
    "category": "Hero Trivia",
    "title": "Luke Cage's Skin Is Impenetrable Titanium-Steel Hard",
    "fact": "Subjected to an experimental Super Soldier cellular regeneration procedure in Seagate Prison, Luke Cage's skin can withstand point-blank rifle bullets and 1,000°F heat.",
    "source": "Hero for Hire #1 (1972)",
    "icon": "👊",
    "color": "#F59E0B"
  },
  {
    "id": 59,
    "category": "Hero Trivia",
    "title": "Iron Fist Channeled The Chi Of Shou-Lao The Undying",
    "fact": "Danny Rand earned the Iron Fist by plunging his hands into the molten brazier containing the fiery heart of the dragon Shou-Lao in the mystical city of K'un-Lun.",
    "source": "Marvel Premiere #15 (1974)",
    "icon": "🐉",
    "color": "#10B981"
  },
  {
    "id": 60,
    "category": "Comic Lore",
    "title": "Nebula Once Stole The Infinity Gauntlet Directly From Thanos",
    "fact": "In the climax of Infinity Gauntlet #5, while Thanos ascended to become an abstract cosmic entity, Nebula grabbed the Gauntlet from his comatose physical body and undid his snap!",
    "source": "The Infinity Gauntlet #5 (1991)",
    "icon": "💎",
    "color": "#06B6D4"
  },
  {
    "id": 61,
    "category": "Cosmic Mystery",
    "title": "Odin Sacrificed His Right Eye For Infinite Cosmic Wisdom",
    "fact": "All-Father Odin sacrificed his eye to the Well of Mimir and hung from the World Tree Yggdrasil for nine days to master the arcane mysteries of the Runes.",
    "source": "Thor #274 / Norse Mythology Lore",
    "icon": "👁️",
    "color": "#F59E0B"
  },
  {
    "id": 62,
    "category": "Hero Trivia",
    "title": "Ghost Rider's Penance Stare Burns The Soul With All Past Sins",
    "fact": "When Ghost Rider locks eyes with an enemy, the Penance Stare forces them to experience every ounce of emotional and physical pain they have ever inflicted on others simultaneously.",
    "source": "Ghost Rider #15 (1991)",
    "icon": "🔥",
    "color": "#EF4444"
  },
  {
    "id": 63,
    "category": "Hero Trivia",
    "title": "Rogue Can Absorb Powers, Memories & Life Force Through Touch",
    "fact": "Rogue's mutant touch absorbs the psyches and superhuman capabilities of anyone she touches. If she holds contact too long, the absorption can become permanent.",
    "source": "Avengers Annual #10 (1981)",
    "icon": "🧤",
    "color": "#10B981"
  },
  {
    "id": 64,
    "category": "Hero Trivia",
    "title": "Colossus Does Not Need To Breathe Or Eat In Armored Form",
    "fact": "When Piotr Rasputin transmutes his skin into organic Osmium steel, his internal organs become pure energy, eliminating the biological need for oxygen, food, or water.",
    "source": "Giant-Size X-Men #1 (1975)",
    "icon": "🛡️",
    "color": "#E2E8F0"
  },
  {
    "id": 65,
    "category": "Hero Trivia",
    "title": "Blade Is A Dhampir (Immune to Vampire Bites)",
    "fact": "Because Eric Brooks' mother was bitten by Deacon Frost while in labor, Blade was born with vampire strength, night vision, and speed, but remains completely immune to vampire bites and sunlight!",
    "source": "The Tomb of Dracula #10 (1973)",
    "icon": "🧛‍♂️",
    "color": "#DC2626"
  },
  {
    "id": 66,
    "category": "Comic Lore",
    "title": "Doctor Octopus Formed The First Sinister Six In 1964",
    "fact": "Otto Octavius recruited Vulture, Electro, Kraven the Hunter, Mysterio, and Sandman in Amazing Spider-Man Annual #1 to systematically ambush Spider-Man in sequence.",
    "source": "The Amazing Spider-Man Annual #1 (1964)",
    "icon": "🐙",
    "color": "#10B981"
  },
  {
    "id": 67,
    "category": "Comic Lore",
    "title": "Loki Created The Absorbing Man Using Asgardian Potions",
    "fact": "Loki poisoned criminal Crusher Creel with a potion brewed from mystical Norn roots, granting Creel the ability to absorb the physical properties of anything he touches.",
    "source": "Journey into Mystery #114 (1965)",
    "icon": "🪨",
    "color": "#F59E0B"
  },
  {
    "id": 68,
    "category": "Cosmic Mystery",
    "title": "The Watcher Uatu Broke His Non-Interference Oath Hundreds Of Times",
    "fact": "Despite swearing a sacred cosmic oath of passive observation, Uatu has warned the Fantastic Four against Galactus, assisted against Over-Mind, and guided humanity through multiverse crises.",
    "source": "Fantastic Four #13 / What If? #1",
    "icon": "👁️",
    "color": "#38BDF8"
  },
  {
    "id": 69,
    "category": "Cosmic Mystery",
    "title": "Dormammu Rules The Dark Dimension Composed Of Pure Mystic Flames",
    "fact": "Dormammu is an immortal Faltine entity composed entirely of raw mystical energy who conquers extra-dimensional realms and hungers to merge Earth into the Dark Dimension.",
    "source": "Strange Tales #126 (1964)",
    "icon": "🔥",
    "color": "#EF4444"
  },
  {
    "id": 70,
    "category": "Creator Secrets",
    "title": "Stan Lee Almost Quit Comics Before Creating The Fantastic Four",
    "fact": "Frustrated by generic monster and romance comics in 1961, Stan Lee's wife Joan advised him to write one comic he truly believed in. The result was Fantastic Four #1, launching the Marvel Universe!",
    "source": "Origins of Marvel Comics",
    "icon": "📖",
    "color": "#3B82F6"
  },
  {
    "id": 71,
    "category": "Hero Trivia",
    "title": "Doctor Doom Rules Latveria With Diplomatic Immunity",
    "fact": "Victor Von Doom has sovereign immunity as monarch of Latveria, meaning the Avengers cannot arrest him on US soil unless he initiates act of war!",
    "source": "Fantastic Four #5 (1962)",
    "icon": "👑",
    "color": "#10B981"
  },
  {
    "id": 72,
    "category": "Hero Trivia",
    "title": "Cyclops Visor Is Made Of Pure Ruby-Quartz",
    "fact": "Scott Summers' optic blasts emit continuous concussive solar energy from a non-Einsteinian dimension. Only ruby-quartz crystals can safely resonate and contain the beam.",
    "source": "X-Men #1 (1963)",
    "icon": "🕶️",
    "color": "#EF4444"
  },
  {
    "id": 73,
    "category": "Hero Trivia",
    "title": "Captain America Can Never Get Drunk",
    "fact": "Due to the Super Soldier Serum running through Steve Rogers' veins, his metabolic rate operates at 400% human efficiency, burning through alcohol toxins before they can affect his nervous system.",
    "source": "Captain America #109 (1969)",
    "icon": "🛡️",
    "color": "#3B82F6"
  },
  {
    "id": 74,
    "category": "Comic Lore",
    "title": "Nightcrawler Can Teleport Through The Brimstone Dimension",
    "fact": "When Kurt Wagner disappears in a puff of purple smoke (BAMF), he physically passes through the Brimstone Dimension, leaving behind a brief smell of sulfur.",
    "source": "Giant-Size X-Men #1 (1975)",
    "icon": "💨",
    "color": "#8B5CF6"
  },
  {
    "id": 75,
    "category": "Hero Trivia",
    "title": "Thor's Belt Megingjord Doubles His Strength",
    "fact": "When facing cosmic cataclysms, Thor equips his magical Asgardian belt Megingjord, which instantly multiplies his godlike strength and vitality by two-fold.",
    "source": "Journey into Mystery #91 (1963)",
    "icon": "⚡",
    "color": "#F59E0B"
  },
  {
    "id": 76,
    "category": "Creator Secrets",
    "title": "Namor Was Marvel's Very First Superhero in 1939",
    "fact": "Debuting in Motion Picture Funnies Weekly #1 in April 1939, Namor the Sub-Mariner is historically the first official superhero created for Marvel Comics (Timely Comics).",
    "source": "Motion Picture Funnies Weekly #1 (1939)",
    "icon": "🔱",
    "color": "#06B6D4"
  },
  {
    "id": 77,
    "category": "Hero Trivia",
    "title": "Punisher's Skull Logo Has A Psychological Tactical Purpose",
    "fact": "Frank Castle wears the stark white skull on his chest specifically to draw enemy gunfire toward his armored Kevlar chest plate instead of his unprotected head.",
    "source": "The Punisher #1 (1986)",
    "icon": "💀",
    "color": "#E2E8F0"
  },
  {
    "id": 78,
    "category": "Comic Lore",
    "title": "Scarlet Witch Erased 98% Of All Mutants With 3 Words",
    "fact": "In House of M #7 (2005), Wanda Maximoff altered reality by uttering \"No More Mutants\", instantly stripping millions of mutants across the globe of their X-genes.",
    "source": "House of M #7 (2005)",
    "icon": "🪄",
    "color": "#E11D48"
  },
  {
    "id": 79,
    "category": "Hero Trivia",
    "title": "Black Panther Once Defeated Mephisto In Hell With Science",
    "fact": "T'Challa allowed Mephisto to tear his heart out in Hell, but used nanotech inhibitors in his bloodstream to short-circuit Mephisto's demonic realm connection, subduing the devil!",
    "source": "Black Panther #5 (1998)",
    "icon": "🐾",
    "color": "#9333EA"
  },
  {
    "id": 80,
    "category": "Creator Secrets",
    "title": "The Daily Bugle Was Created By Stan Lee & Steve Ditko",
    "fact": "J. Jonah Jameson's newspaper debut occurred in The Amazing Spider-Man #1 (1963), named after the loud bugle horn used in historic military announcements.",
    "source": "The Amazing Spider-Man #1 (1963)",
    "icon": "📰",
    "color": "#64748B"
  },
  {
    "id": 81,
    "category": "Creator Secrets",
    "title": "Rocket Raccoon Was Inspired By A Beatles Song",
    "fact": "Bill Mantlo and Keith Giffen created Rocket Raccoon in 1976, naming him after the 1968 Beatles song \"Rocky Raccoon\".",
    "source": "Marvel Preview #7 (1976)",
    "icon": "🦝",
    "color": "#F59E0B"
  },
  {
    "id": 82,
    "category": "Hero Trivia",
    "title": "Gamora Is Known Across The Galaxy As The Deadliest Woman",
    "fact": "Enhanced cybernetically by Thanos, Gamora possesses martial arts knowledge of 83% of all known alien species, allowing her to paralyze opponents with single pressure strikes.",
    "source": "Strange Tales #180 (1975)",
    "icon": "🗡️",
    "color": "#10B981"
  },
  {
    "id": 83,
    "category": "Comic Lore",
    "title": "Moon Knight Beat Thor By Controlling The Moon Rock In Mjolnir",
    "fact": "In Avengers (2020) \"Age of Khonshu\", Moon Knight realized Mjolnir is made of Uru (moon rock) and used his avatar deity powers to seize control of Thor's hammer!",
    "source": "Avengers Vol. 8 #33 (2020)",
    "icon": "🌙",
    "color": "#F8FAFC"
  },
  {
    "id": 84,
    "category": "Hero Trivia",
    "title": "Miles Morales Has An Invisibility Camouflage Cloak",
    "fact": "Unlike Peter Parker, Miles Morales can blend his bio-chromatic pigmentation seamlessly into any background, rendering him completely invisible to both optical sight and night vision.",
    "source": "Ultimate Comics Spider-Man #1 (2011)",
    "icon": "🕷️",
    "color": "#DC2626"
  },
  {
    "id": 85,
    "category": "Creator Secrets",
    "title": "Silver Surfer Was Added Without Stan Lee's Permission",
    "fact": "Jack Kirby drew the Silver Surfer on a flying cosmic surfboard into Fantastic Four #48 on a whim because he was tired of drawing spaceships. Stan Lee loved it instantly!",
    "source": "Fantastic Four #48 (1966)",
    "icon": "🏄‍♂️",
    "color": "#38BDF8"
  },
  {
    "id": 86,
    "category": "Comic Lore",
    "title": "Juggernaut Is Mystically Empowered, Not A Mutant",
    "fact": "Cain Marko's unstoppable momentum comes from the mystical Crimson Gem of Cyttorak, which wraps him in an unyielding cosmic avatar field that defies earthly inertia.",
    "source": "X-Men #12 (1965)",
    "icon": "🛑",
    "color": "#EF4444"
  },
  {
    "id": 87,
    "category": "Hero Trivia",
    "title": "Quicksilver Can Think and React at Sub-Millisecond Speeds",
    "fact": "Pietro Maximoff experiences normal human life in extreme slow motion. He once explained that talking to normal humans feels like standing behind someone at an ATM who doesn't know how to use it.",
    "source": "X-Factor #87 (1993)",
    "icon": "⚡",
    "color": "#38BDF8"
  },
  {
    "id": 88,
    "category": "Cosmic Mystery",
    "title": "The Beyonder Was An Entire Sentient Universe",
    "fact": "In Secret Wars (1984), the Beyonder was not just an entity—he was the conscious manifestation of an entire omnipotent multiverse beyond the Marvel Prime reality.",
    "source": "Secret Wars #1 (1984)",
    "icon": "🌌",
    "color": "#F59E0B"
  },
  {
    "id": 89,
    "category": "Hero Trivia",
    "title": "Emma Frost's Secondary Mutation Is Flawless Diamond Skin",
    "fact": "In addition to Omega-level telepathy, Emma Frost can transmute her biological body into indestructible organic diamond, granting superhuman durability and immunity to telepathy.",
    "source": "New X-Men #116 (2001)",
    "icon": "💎",
    "color": "#06B6D4"
  },
  {
    "id": 90,
    "category": "Hero Trivia",
    "title": "Iron Man's First Armor Was Crafted Out Of Scrap Metal & Spare Transistors",
    "fact": "Trapped in a bunker by warlord Wong-Chu, Tony Stark and Ho Yinsen built the Model 1 Mark I armor using scrap iron, crude solder, and a repurposed car battery.",
    "source": "Tales of Suspense #39 (1963)",
    "icon": "🦾",
    "color": "#94A3B8"
  },
  {
    "id": 91,
    "category": "Creator Secrets",
    "title": "Doctor Strange Has A Sanctum Sanctorum Address In Real Life",
    "fact": "177A Bleecker Street in Greenwich Village, New York is a real-world address that writers Roy Thomas and Gary Friedrich once lived in as roommates in the 1960s!",
    "source": "Strange Tales #110 / Marvel Historical Tour",
    "icon": "🏛️",
    "color": "#8B5CF6"
  },
  {
    "id": 92,
    "category": "Hero Trivia",
    "title": "Magneto Helmet Protects Him From Professor X's Telepathy",
    "fact": "Magneto forged his iconic helmet using specialized electromagnetic alloys lined with telepathic dampeners, preventing any psychic mind-control attempts.",
    "source": "X-Men #1 (1963)",
    "icon": "🪖",
    "color": "#7C3AED"
  },
  {
    "id": 93,
    "category": "Cosmic Mystery",
    "title": "Ego The Living Planet Traveled The Cosmos For Billions Of Years",
    "fact": "Ego is a planetary-sized super-organism with a conscious brain, capable of planetary digestion, atmospheric manipulation, and psionic energy blast projection.",
    "source": "Thor #132 (1966)",
    "icon": "🪐",
    "color": "#9333EA"
  },
  {
    "id": 94,
    "category": "Comic Lore",
    "title": "Nick Fury Fought in World War II With The Howling Commandos",
    "fact": "In original Marvel canon, Sergeant Nick Fury commanded the elite Howling Commandos in WWII and stays youthful due to regular doses of the Infinity Formula.",
    "source": "Sgt. Fury and his Howling Commandos #1 (1963)",
    "icon": "🎖️",
    "color": "#64748B"
  },
  {
    "id": 95,
    "category": "Hero Trivia",
    "title": "Captain Marvel Absorbs Nuclear Energy Like A Battery",
    "fact": "Carol Danvers can absorb virtually infinite amounts of ambient radiation, magic, and cosmic plasma, channeling it into her devastating Binary white hole form.",
    "source": "Uncanny X-Men #164 (1982)",
    "icon": "💫",
    "color": "#F59E0B"
  },
  {
    "id": 96,
    "category": "Hero Trivia",
    "title": "Winter Soldier Has A Bionic Arm Made Of Russian Titanium & Cybernetics",
    "fact": "Bucky Barnes survived the explosion of Baron Zemo's rocket and was revived by Department X, who replaced his amputated left arm with an EMP-emitting bionic limb.",
    "source": "Captain America Vol. 5 #1 (2005)",
    "icon": "🦾",
    "color": "#94A3B8"
  },
  {
    "id": 97,
    "category": "Comic Lore",
    "title": "The Sentinels Were Created By Anthropologist Bolivar Trask",
    "fact": "Bolivar Trask engineered the mutant-hunting robotic Sentinels out of fear of Homo superior, only for Master Mold to turn against its creator to control humanity.",
    "source": "X-Men #14 (1965)",
    "icon": "🤖",
    "color": "#8B5CF6"
  },
  {
    "id": 98,
    "category": "Hero Trivia",
    "title": "Luke Cage's Skin Is Impenetrable Titanium-Steel Hard",
    "fact": "Subjected to an experimental Super Soldier cellular regeneration procedure in Seagate Prison, Luke Cage's skin can withstand point-blank rifle bullets and 1,000°F heat.",
    "source": "Hero for Hire #1 (1972)",
    "icon": "👊",
    "color": "#F59E0B"
  },
  {
    "id": 99,
    "category": "Hero Trivia",
    "title": "Iron Fist Channeled The Chi Of Shou-Lao The Undying",
    "fact": "Danny Rand earned the Iron Fist by plunging his hands into the molten brazier containing the fiery heart of the dragon Shou-Lao in the mystical city of K'un-Lun.",
    "source": "Marvel Premiere #15 (1974)",
    "icon": "🐉",
    "color": "#10B981"
  },
  {
    "id": 100,
    "category": "Comic Lore",
    "title": "Nebula Once Stole The Infinity Gauntlet Directly From Thanos",
    "fact": "In the climax of Infinity Gauntlet #5, while Thanos ascended to become an abstract cosmic entity, Nebula grabbed the Gauntlet from his comatose physical body and undid his snap!",
    "source": "The Infinity Gauntlet #5 (1991)",
    "icon": "💎",
    "color": "#06B6D4"
  },
  {
    "id": 101,
    "category": "Cosmic Mystery",
    "title": "Odin Sacrificed His Right Eye For Infinite Cosmic Wisdom",
    "fact": "All-Father Odin sacrificed his eye to the Well of Mimir and hung from the World Tree Yggdrasil for nine days to master the arcane mysteries of the Runes.",
    "source": "Thor #274 / Norse Mythology Lore",
    "icon": "👁️",
    "color": "#F59E0B"
  },
  {
    "id": 102,
    "category": "Hero Trivia",
    "title": "Ghost Rider's Penance Stare Burns The Soul With All Past Sins",
    "fact": "When Ghost Rider locks eyes with an enemy, the Penance Stare forces them to experience every ounce of emotional and physical pain they have ever inflicted on others simultaneously.",
    "source": "Ghost Rider #15 (1991)",
    "icon": "🔥",
    "color": "#EF4444"
  },
  {
    "id": 103,
    "category": "Hero Trivia",
    "title": "Rogue Can Absorb Powers, Memories & Life Force Through Touch",
    "fact": "Rogue's mutant touch absorbs the psyches and superhuman capabilities of anyone she touches. If she holds contact too long, the absorption can become permanent.",
    "source": "Avengers Annual #10 (1981)",
    "icon": "🧤",
    "color": "#10B981"
  },
  {
    "id": 104,
    "category": "Hero Trivia",
    "title": "Colossus Does Not Need To Breathe Or Eat In Armored Form",
    "fact": "When Piotr Rasputin transmutes his skin into organic Osmium steel, his internal organs become pure energy, eliminating the biological need for oxygen, food, or water.",
    "source": "Giant-Size X-Men #1 (1975)",
    "icon": "🛡️",
    "color": "#E2E8F0"
  },
  {
    "id": 105,
    "category": "Hero Trivia",
    "title": "Blade Is A Dhampir (Immune to Vampire Bites)",
    "fact": "Because Eric Brooks' mother was bitten by Deacon Frost while in labor, Blade was born with vampire strength, night vision, and speed, but remains completely immune to vampire bites and sunlight!",
    "source": "The Tomb of Dracula #10 (1973)",
    "icon": "🧛‍♂️",
    "color": "#DC2626"
  },
  {
    "id": 106,
    "category": "Comic Lore",
    "title": "Doctor Octopus Formed The First Sinister Six In 1964",
    "fact": "Otto Octavius recruited Vulture, Electro, Kraven the Hunter, Mysterio, and Sandman in Amazing Spider-Man Annual #1 to systematically ambush Spider-Man in sequence.",
    "source": "The Amazing Spider-Man Annual #1 (1964)",
    "icon": "🐙",
    "color": "#10B981"
  },
  {
    "id": 107,
    "category": "Comic Lore",
    "title": "Loki Created The Absorbing Man Using Asgardian Potions",
    "fact": "Loki poisoned criminal Crusher Creel with a potion brewed from mystical Norn roots, granting Creel the ability to absorb the physical properties of anything he touches.",
    "source": "Journey into Mystery #114 (1965)",
    "icon": "🪨",
    "color": "#F59E0B"
  },
  {
    "id": 108,
    "category": "Cosmic Mystery",
    "title": "The Watcher Uatu Broke His Non-Interference Oath Hundreds Of Times",
    "fact": "Despite swearing a sacred cosmic oath of passive observation, Uatu has warned the Fantastic Four against Galactus, assisted against Over-Mind, and guided humanity through multiverse crises.",
    "source": "Fantastic Four #13 / What If? #1",
    "icon": "👁️",
    "color": "#38BDF8"
  },
  {
    "id": 109,
    "category": "Cosmic Mystery",
    "title": "Dormammu Rules The Dark Dimension Composed Of Pure Mystic Flames",
    "fact": "Dormammu is an immortal Faltine entity composed entirely of raw mystical energy who conquers extra-dimensional realms and hungers to merge Earth into the Dark Dimension.",
    "source": "Strange Tales #126 (1964)",
    "icon": "🔥",
    "color": "#EF4444"
  },
  {
    "id": 110,
    "category": "Creator Secrets",
    "title": "Stan Lee Almost Quit Comics Before Creating The Fantastic Four",
    "fact": "Frustrated by generic monster and romance comics in 1961, Stan Lee's wife Joan advised him to write one comic he truly believed in. The result was Fantastic Four #1, launching the Marvel Universe!",
    "source": "Origins of Marvel Comics",
    "icon": "📖",
    "color": "#3B82F6"
  },
  {
    "id": 111,
    "category": "Hero Trivia",
    "title": "Doctor Doom Rules Latveria With Diplomatic Immunity",
    "fact": "Victor Von Doom has sovereign immunity as monarch of Latveria, meaning the Avengers cannot arrest him on US soil unless he initiates act of war!",
    "source": "Fantastic Four #5 (1962)",
    "icon": "👑",
    "color": "#10B981"
  },
  {
    "id": 112,
    "category": "Hero Trivia",
    "title": "Cyclops Visor Is Made Of Pure Ruby-Quartz",
    "fact": "Scott Summers' optic blasts emit continuous concussive solar energy from a non-Einsteinian dimension. Only ruby-quartz crystals can safely resonate and contain the beam.",
    "source": "X-Men #1 (1963)",
    "icon": "🕶️",
    "color": "#EF4444"
  },
  {
    "id": 113,
    "category": "Hero Trivia",
    "title": "Captain America Can Never Get Drunk",
    "fact": "Due to the Super Soldier Serum running through Steve Rogers' veins, his metabolic rate operates at 400% human efficiency, burning through alcohol toxins before they can affect his nervous system.",
    "source": "Captain America #109 (1969)",
    "icon": "🛡️",
    "color": "#3B82F6"
  },
  {
    "id": 114,
    "category": "Comic Lore",
    "title": "Nightcrawler Can Teleport Through The Brimstone Dimension",
    "fact": "When Kurt Wagner disappears in a puff of purple smoke (BAMF), he physically passes through the Brimstone Dimension, leaving behind a brief smell of sulfur.",
    "source": "Giant-Size X-Men #1 (1975)",
    "icon": "💨",
    "color": "#8B5CF6"
  },
  {
    "id": 115,
    "category": "Hero Trivia",
    "title": "Thor's Belt Megingjord Doubles His Strength",
    "fact": "When facing cosmic cataclysms, Thor equips his magical Asgardian belt Megingjord, which instantly multiplies his godlike strength and vitality by two-fold.",
    "source": "Journey into Mystery #91 (1963)",
    "icon": "⚡",
    "color": "#F59E0B"
  },
  {
    "id": 116,
    "category": "Creator Secrets",
    "title": "Namor Was Marvel's Very First Superhero in 1939",
    "fact": "Debuting in Motion Picture Funnies Weekly #1 in April 1939, Namor the Sub-Mariner is historically the first official superhero created for Marvel Comics (Timely Comics).",
    "source": "Motion Picture Funnies Weekly #1 (1939)",
    "icon": "🔱",
    "color": "#06B6D4"
  },
  {
    "id": 117,
    "category": "Hero Trivia",
    "title": "Punisher's Skull Logo Has A Psychological Tactical Purpose",
    "fact": "Frank Castle wears the stark white skull on his chest specifically to draw enemy gunfire toward his armored Kevlar chest plate instead of his unprotected head.",
    "source": "The Punisher #1 (1986)",
    "icon": "💀",
    "color": "#E2E8F0"
  },
  {
    "id": 118,
    "category": "Comic Lore",
    "title": "Scarlet Witch Erased 98% Of All Mutants With 3 Words",
    "fact": "In House of M #7 (2005), Wanda Maximoff altered reality by uttering \"No More Mutants\", instantly stripping millions of mutants across the globe of their X-genes.",
    "source": "House of M #7 (2005)",
    "icon": "🪄",
    "color": "#E11D48"
  },
  {
    "id": 119,
    "category": "Hero Trivia",
    "title": "Black Panther Once Defeated Mephisto In Hell With Science",
    "fact": "T'Challa allowed Mephisto to tear his heart out in Hell, but used nanotech inhibitors in his bloodstream to short-circuit Mephisto's demonic realm connection, subduing the devil!",
    "source": "Black Panther #5 (1998)",
    "icon": "🐾",
    "color": "#9333EA"
  },
  {
    "id": 120,
    "category": "Creator Secrets",
    "title": "The Daily Bugle Was Created By Stan Lee & Steve Ditko",
    "fact": "J. Jonah Jameson's newspaper debut occurred in The Amazing Spider-Man #1 (1963), named after the loud bugle horn used in historic military announcements.",
    "source": "The Amazing Spider-Man #1 (1963)",
    "icon": "📰",
    "color": "#64748B"
  },
  {
    "id": 121,
    "category": "Creator Secrets",
    "title": "Rocket Raccoon Was Inspired By A Beatles Song",
    "fact": "Bill Mantlo and Keith Giffen created Rocket Raccoon in 1976, naming him after the 1968 Beatles song \"Rocky Raccoon\".",
    "source": "Marvel Preview #7 (1976)",
    "icon": "🦝",
    "color": "#F59E0B"
  },
  {
    "id": 122,
    "category": "Hero Trivia",
    "title": "Gamora Is Known Across The Galaxy As The Deadliest Woman",
    "fact": "Enhanced cybernetically by Thanos, Gamora possesses martial arts knowledge of 83% of all known alien species, allowing her to paralyze opponents with single pressure strikes.",
    "source": "Strange Tales #180 (1975)",
    "icon": "🗡️",
    "color": "#10B981"
  },
  {
    "id": 123,
    "category": "Comic Lore",
    "title": "Moon Knight Beat Thor By Controlling The Moon Rock In Mjolnir",
    "fact": "In Avengers (2020) \"Age of Khonshu\", Moon Knight realized Mjolnir is made of Uru (moon rock) and used his avatar deity powers to seize control of Thor's hammer!",
    "source": "Avengers Vol. 8 #33 (2020)",
    "icon": "🌙",
    "color": "#F8FAFC"
  },
  {
    "id": 124,
    "category": "Hero Trivia",
    "title": "Miles Morales Has An Invisibility Camouflage Cloak",
    "fact": "Unlike Peter Parker, Miles Morales can blend his bio-chromatic pigmentation seamlessly into any background, rendering him completely invisible to both optical sight and night vision.",
    "source": "Ultimate Comics Spider-Man #1 (2011)",
    "icon": "🕷️",
    "color": "#DC2626"
  },
  {
    "id": 125,
    "category": "Creator Secrets",
    "title": "Silver Surfer Was Added Without Stan Lee's Permission",
    "fact": "Jack Kirby drew the Silver Surfer on a flying cosmic surfboard into Fantastic Four #48 on a whim because he was tired of drawing spaceships. Stan Lee loved it instantly!",
    "source": "Fantastic Four #48 (1966)",
    "icon": "🏄‍♂️",
    "color": "#38BDF8"
  },
  {
    "id": 126,
    "category": "Comic Lore",
    "title": "Juggernaut Is Mystically Empowered, Not A Mutant",
    "fact": "Cain Marko's unstoppable momentum comes from the mystical Crimson Gem of Cyttorak, which wraps him in an unyielding cosmic avatar field that defies earthly inertia.",
    "source": "X-Men #12 (1965)",
    "icon": "🛑",
    "color": "#EF4444"
  },
  {
    "id": 127,
    "category": "Hero Trivia",
    "title": "Quicksilver Can Think and React at Sub-Millisecond Speeds",
    "fact": "Pietro Maximoff experiences normal human life in extreme slow motion. He once explained that talking to normal humans feels like standing behind someone at an ATM who doesn't know how to use it.",
    "source": "X-Factor #87 (1993)",
    "icon": "⚡",
    "color": "#38BDF8"
  },
  {
    "id": 128,
    "category": "Cosmic Mystery",
    "title": "The Beyonder Was An Entire Sentient Universe",
    "fact": "In Secret Wars (1984), the Beyonder was not just an entity—he was the conscious manifestation of an entire omnipotent multiverse beyond the Marvel Prime reality.",
    "source": "Secret Wars #1 (1984)",
    "icon": "🌌",
    "color": "#F59E0B"
  },
  {
    "id": 129,
    "category": "Hero Trivia",
    "title": "Emma Frost's Secondary Mutation Is Flawless Diamond Skin",
    "fact": "In addition to Omega-level telepathy, Emma Frost can transmute her biological body into indestructible organic diamond, granting superhuman durability and immunity to telepathy.",
    "source": "New X-Men #116 (2001)",
    "icon": "💎",
    "color": "#06B6D4"
  },
  {
    "id": 130,
    "category": "Hero Trivia",
    "title": "Iron Man's First Armor Was Crafted Out Of Scrap Metal & Spare Transistors",
    "fact": "Trapped in a bunker by warlord Wong-Chu, Tony Stark and Ho Yinsen built the Model 1 Mark I armor using scrap iron, crude solder, and a repurposed car battery.",
    "source": "Tales of Suspense #39 (1963)",
    "icon": "🦾",
    "color": "#94A3B8"
  },
  {
    "id": 131,
    "category": "Creator Secrets",
    "title": "Doctor Strange Has A Sanctum Sanctorum Address In Real Life",
    "fact": "177A Bleecker Street in Greenwich Village, New York is a real-world address that writers Roy Thomas and Gary Friedrich once lived in as roommates in the 1960s!",
    "source": "Strange Tales #110 / Marvel Historical Tour",
    "icon": "🏛️",
    "color": "#8B5CF6"
  },
  {
    "id": 132,
    "category": "Hero Trivia",
    "title": "Magneto Helmet Protects Him From Professor X's Telepathy",
    "fact": "Magneto forged his iconic helmet using specialized electromagnetic alloys lined with telepathic dampeners, preventing any psychic mind-control attempts.",
    "source": "X-Men #1 (1963)",
    "icon": "🪖",
    "color": "#7C3AED"
  },
  {
    "id": 133,
    "category": "Cosmic Mystery",
    "title": "Ego The Living Planet Traveled The Cosmos For Billions Of Years",
    "fact": "Ego is a planetary-sized super-organism with a conscious brain, capable of planetary digestion, atmospheric manipulation, and psionic energy blast projection.",
    "source": "Thor #132 (1966)",
    "icon": "🪐",
    "color": "#9333EA"
  },
  {
    "id": 134,
    "category": "Comic Lore",
    "title": "Nick Fury Fought in World War II With The Howling Commandos",
    "fact": "In original Marvel canon, Sergeant Nick Fury commanded the elite Howling Commandos in WWII and stays youthful due to regular doses of the Infinity Formula.",
    "source": "Sgt. Fury and his Howling Commandos #1 (1963)",
    "icon": "🎖️",
    "color": "#64748B"
  },
  {
    "id": 135,
    "category": "Hero Trivia",
    "title": "Captain Marvel Absorbs Nuclear Energy Like A Battery",
    "fact": "Carol Danvers can absorb virtually infinite amounts of ambient radiation, magic, and cosmic plasma, channeling it into her devastating Binary white hole form.",
    "source": "Uncanny X-Men #164 (1982)",
    "icon": "💫",
    "color": "#F59E0B"
  },
  {
    "id": 136,
    "category": "Hero Trivia",
    "title": "Winter Soldier Has A Bionic Arm Made Of Russian Titanium & Cybernetics",
    "fact": "Bucky Barnes survived the explosion of Baron Zemo's rocket and was revived by Department X, who replaced his amputated left arm with an EMP-emitting bionic limb.",
    "source": "Captain America Vol. 5 #1 (2005)",
    "icon": "🦾",
    "color": "#94A3B8"
  },
  {
    "id": 137,
    "category": "Comic Lore",
    "title": "The Sentinels Were Created By Anthropologist Bolivar Trask",
    "fact": "Bolivar Trask engineered the mutant-hunting robotic Sentinels out of fear of Homo superior, only for Master Mold to turn against its creator to control humanity.",
    "source": "X-Men #14 (1965)",
    "icon": "🤖",
    "color": "#8B5CF6"
  },
  {
    "id": 138,
    "category": "Hero Trivia",
    "title": "Luke Cage's Skin Is Impenetrable Titanium-Steel Hard",
    "fact": "Subjected to an experimental Super Soldier cellular regeneration procedure in Seagate Prison, Luke Cage's skin can withstand point-blank rifle bullets and 1,000°F heat.",
    "source": "Hero for Hire #1 (1972)",
    "icon": "👊",
    "color": "#F59E0B"
  },
  {
    "id": 139,
    "category": "Hero Trivia",
    "title": "Iron Fist Channeled The Chi Of Shou-Lao The Undying",
    "fact": "Danny Rand earned the Iron Fist by plunging his hands into the molten brazier containing the fiery heart of the dragon Shou-Lao in the mystical city of K'un-Lun.",
    "source": "Marvel Premiere #15 (1974)",
    "icon": "🐉",
    "color": "#10B981"
  },
  {
    "id": 140,
    "category": "Comic Lore",
    "title": "Nebula Once Stole The Infinity Gauntlet Directly From Thanos",
    "fact": "In the climax of Infinity Gauntlet #5, while Thanos ascended to become an abstract cosmic entity, Nebula grabbed the Gauntlet from his comatose physical body and undid his snap!",
    "source": "The Infinity Gauntlet #5 (1991)",
    "icon": "💎",
    "color": "#06B6D4"
  },
  {
    "id": 141,
    "category": "Cosmic Mystery",
    "title": "Odin Sacrificed His Right Eye For Infinite Cosmic Wisdom",
    "fact": "All-Father Odin sacrificed his eye to the Well of Mimir and hung from the World Tree Yggdrasil for nine days to master the arcane mysteries of the Runes.",
    "source": "Thor #274 / Norse Mythology Lore",
    "icon": "👁️",
    "color": "#F59E0B"
  },
  {
    "id": 142,
    "category": "Hero Trivia",
    "title": "Ghost Rider's Penance Stare Burns The Soul With All Past Sins",
    "fact": "When Ghost Rider locks eyes with an enemy, the Penance Stare forces them to experience every ounce of emotional and physical pain they have ever inflicted on others simultaneously.",
    "source": "Ghost Rider #15 (1991)",
    "icon": "🔥",
    "color": "#EF4444"
  },
  {
    "id": 143,
    "category": "Hero Trivia",
    "title": "Rogue Can Absorb Powers, Memories & Life Force Through Touch",
    "fact": "Rogue's mutant touch absorbs the psyches and superhuman capabilities of anyone she touches. If she holds contact too long, the absorption can become permanent.",
    "source": "Avengers Annual #10 (1981)",
    "icon": "🧤",
    "color": "#10B981"
  },
  {
    "id": 144,
    "category": "Hero Trivia",
    "title": "Colossus Does Not Need To Breathe Or Eat In Armored Form",
    "fact": "When Piotr Rasputin transmutes his skin into organic Osmium steel, his internal organs become pure energy, eliminating the biological need for oxygen, food, or water.",
    "source": "Giant-Size X-Men #1 (1975)",
    "icon": "🛡️",
    "color": "#E2E8F0"
  },
  {
    "id": 145,
    "category": "Hero Trivia",
    "title": "Blade Is A Dhampir (Immune to Vampire Bites)",
    "fact": "Because Eric Brooks' mother was bitten by Deacon Frost while in labor, Blade was born with vampire strength, night vision, and speed, but remains completely immune to vampire bites and sunlight!",
    "source": "The Tomb of Dracula #10 (1973)",
    "icon": "🧛‍♂️",
    "color": "#DC2626"
  },
  {
    "id": 146,
    "category": "Comic Lore",
    "title": "Doctor Octopus Formed The First Sinister Six In 1964",
    "fact": "Otto Octavius recruited Vulture, Electro, Kraven the Hunter, Mysterio, and Sandman in Amazing Spider-Man Annual #1 to systematically ambush Spider-Man in sequence.",
    "source": "The Amazing Spider-Man Annual #1 (1964)",
    "icon": "🐙",
    "color": "#10B981"
  },
  {
    "id": 147,
    "category": "Comic Lore",
    "title": "Loki Created The Absorbing Man Using Asgardian Potions",
    "fact": "Loki poisoned criminal Crusher Creel with a potion brewed from mystical Norn roots, granting Creel the ability to absorb the physical properties of anything he touches.",
    "source": "Journey into Mystery #114 (1965)",
    "icon": "🪨",
    "color": "#F59E0B"
  },
  {
    "id": 148,
    "category": "Cosmic Mystery",
    "title": "The Watcher Uatu Broke His Non-Interference Oath Hundreds Of Times",
    "fact": "Despite swearing a sacred cosmic oath of passive observation, Uatu has warned the Fantastic Four against Galactus, assisted against Over-Mind, and guided humanity through multiverse crises.",
    "source": "Fantastic Four #13 / What If? #1",
    "icon": "👁️",
    "color": "#38BDF8"
  },
  {
    "id": 149,
    "category": "Cosmic Mystery",
    "title": "Dormammu Rules The Dark Dimension Composed Of Pure Mystic Flames",
    "fact": "Dormammu is an immortal Faltine entity composed entirely of raw mystical energy who conquers extra-dimensional realms and hungers to merge Earth into the Dark Dimension.",
    "source": "Strange Tales #126 (1964)",
    "icon": "🔥",
    "color": "#EF4444"
  },
  {
    "id": 150,
    "category": "Creator Secrets",
    "title": "Stan Lee Almost Quit Comics Before Creating The Fantastic Four",
    "fact": "Frustrated by generic monster and romance comics in 1961, Stan Lee's wife Joan advised him to write one comic he truly believed in. The result was Fantastic Four #1, launching the Marvel Universe!",
    "source": "Origins of Marvel Comics",
    "icon": "📖",
    "color": "#3B82F6"
  }
];

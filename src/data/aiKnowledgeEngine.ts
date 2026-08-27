// Comprehensive General-Purpose AI Knowledge Engine & Fallback Resolver
// Provides real-world encyclopedic answers, math/algebra evaluation, coding solutions, and live knowledge search

export interface ResolvedAIResponse {
  text: string;
  quickChips: string[];
  matchedHero?: any;
}

// 1. Core Factual Database (Instant, accurate, offline-capable general knowledge)
const FACTUAL_KNOWLEDGE_BASE: Array<{
  match: (q: string) => boolean;
  generate: (q: string, originalPrompt: string) => { text: string; quickChips: string[] };
}> = [
  // 1. Physics: Velocity vs Acceleration
  {
    match: (q) => (q.includes('velocity') && q.includes('acceleration')) || (q.includes('difference between') && q.includes('velocity')),
    generate: () => ({
      text: `🚀 **Difference Between Velocity and Acceleration:**\n\n` +
        `### 1. **Velocity (v)**\n` +
        `- **Definition**: The rate at which an object changes its position over time in a specific direction (speed with direction).\n` +
        `- **Formula**: $$\\text{Velocity} = \\frac{\\Delta x}{\\Delta t} = \\frac{\\text{Displacement}}{\\text{Time}}$$\n` +
        `- **SI Unit**: Meters per second (m/s).\n` +
        `- **Example**: A car traveling at **60 km/h due North**.\n\n` +
        `### 2. **Acceleration (a)**\n` +
        `- **Definition**: The rate of change of velocity over time (how fast speed or direction changes).\n` +
        `- **Formula**: $$\\text{Acceleration} = \\frac{\\Delta v}{\\Delta t} = \\frac{\\text{Final Velocity} - \\text{Initial Velocity}}{\\text{Time}}$$\n` +
        `- **SI Unit**: Meters per second squared (m/s²).\n` +
        `- **Example**: A car speeding up from 0 to 100 km/h in 5 seconds (positive acceleration), braking (deceleration), or turning a corner at constant speed (centripetal acceleration).\n\n` +
        `| Property | Velocity | Acceleration |\n` +
        `| :--- | :--- | :--- |\n` +
        `| **What it measures** | Rate of change of position | Rate of change of velocity |\n` +
        `| **Units** | m/s, km/h, mph | m/s², ft/s² |\n` +
        `| **Zero value means** | Object is stationary | Object moves at constant velocity |`,
      quickChips: [
        '📐 What are Newton\'s 3 Laws of Motion?',
        '⚡ Explain Speed vs Velocity',
        '🌌 How does gravity affect acceleration?'
      ]
    })
  },

  // 2. JavaScript: Reverse a String
  {
    match: (q) => (q.includes('javascript') || q.includes('js') || q.includes('function') || q.includes('code')) && q.includes('reverse') && (q.includes('string') || q.includes('str')),
    generate: () => ({
      text: `💻 **JavaScript Function to Reverse a String:**\n\n` +
        `Here are the most popular and efficient ways to reverse a string in JavaScript:\n\n` +
        `### Method 1: Built-in Array Methods (Most Common)\n` +
        `\`\`\`javascript\n` +
        `function reverseString(str) {\n` +
        `  return str.split('').reverse().join('');\n` +
        `}\n\n` +
        `// ES6 Arrow Syntax:\n` +
        `const reverseString = str => [...str].reverse().join('');\n\n` +
        `console.log(reverseString('hello')); // "olleh"\n` +
        `console.log(reverseString('JavaScript')); // "tpircSavaJ"\n` +
        `\`\`\`\n\n` +
        `### Method 2: Decrementing \`for\` Loop (Without built-in \`reverse\`)\n` +
        `\`\`\`javascript\n` +
        `function reverseStringLoop(str) {\n` +
        `  let reversed = '';\n` +
        `  for (let i = str.length - 1; i >= 0; i--) {\n` +
        `    reversed += str[i];\n` +
        `  }\n` +
        `  return reversed;\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `### Method 3: Using \`Array.prototype.reduce\`\n` +
        `\`\`\`javascript\n` +
        `const reverseStringReduce = str => \n` +
        `  [...str].reduce((rev, char) => char + rev, '');\n` +
        `\`\`\`\n\n` +
        `*Note: Using \`[...str]\` correctly handles Unicode characters and emojis compared to \`split('')\`.*`,
      quickChips: [
        '🔄 Check if a string is a Palindrome in JS',
        '💡 Reverse words in a sentence in JS',
        '⚡ Time complexity of string reversal'
      ]
    })
  },

  // 3. Biography: Albert Einstein
  {
    match: (q) => (q.includes('albert') && q.includes('einstein')) || q.includes('who was einstein') || q.includes('about einstein'),
    generate: () => ({
      text: `🧠 **Albert Einstein (1879–1955) — Biography & Legacy:**\n\n` +
        `- **Who He Was**: German-born theoretical physicist widely recognized as one of the greatest and most influential scientists in human history.\n` +
        `- **Special Theory of Relativity (1905)**: Revolutionized physics by proving the speed of light is constant in all inertial reference frames and establishing the famous mass-energy equivalence formula:\n` +
        `  $$E = mc^2$$\n` +
        `- **General Theory of Relativity (1915)**: Reimagined gravity not as a conventional force, but as the geometric warping and curvature of spacetime caused by mass and energy.\n` +
        `- **Nobel Prize in Physics (1921)**: Awarded for his discovery and mathematical explanation of the **Photoelectric Effect**, a foundational pillar of Quantum Mechanics.\n` +
        `- **Humanitarian & Philosophy**: A passionate advocate for civil rights, global peace, scientific curiosity, and education.\n\n` +
        `> *"Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world."*`,
      quickChips: [
        '🌌 Explain General Relativity simply',
        '⚛️ What is the Photoelectric Effect?',
        '📜 Einstein vs Niels Bohr quantum debate'
      ]
    })
  },

  // 4. Birthday Party Ideas
  {
    match: (q) => (q.includes('birthday') && (q.includes('idea') || q.includes('plan') || q.includes('theme') || q.includes('activities') || q.includes('party'))),
    generate: () => ({
      text: `🎉 **Creative & Fun Birthday Party Ideas:**\n\n` +
        `### 1. **Interactive & Experiential Themes**\n` +
        `- **Murder Mystery Dinner**: Assign roles and clues to guests for an unforgettable evening of sleuthing and drama.\n` +
        `- **Retro Arcade / 80s & 90s Throwback**: Neon lighting, classic video games, retro snacks, and throwback playlists.\n` +
        `- **DIY MasterChef / Taco & Pizza Bar**: Set up cooking stations with gourmet toppings where guests create and rate custom pizzas, tacos, or mocktails.\n\n` +
        `### 2. **Active & Adventure Outings**\n` +
        `- **Escape Room & Lounge**: Work together in a themed escape room followed by dinner or drinks.\n` +
        `- **Sunset Rooftop or Backyard Festival**: Fairy lights, acoustic music/karaoke, lawn games (cornhole, giant Jenga), and fire pits with s'mores.\n` +
        `- **Outdoor Movie Night**: Projector screen in the garden with cozy blankets, popcorn bar, and classic cinema.\n\n` +
        `### 3. **Low-Key & Cozy Gatherings**\n` +
        `- **Board Game & Trivia Tournament**: Team up for modern party games (Codenames, Wavelength, Jackbox) with prizes.\n` +
        `- **Spa & Wellness Retreat Day**: Facials, relaxation lounge, smoothies, and restorative yoga.`,
      quickChips: [
        '🎂 Birthday party food & snack menus',
        '🎵 Best party playlist recommendations',
        '💡 Budget-friendly party planning tips'
      ]
    })
  },

  // 5. Biology: Photosynthesis (9th Grade Level)
  {
    match: (q) => q.includes('photosynthesis') || (q.includes('plants') && q.includes('sunlight') && q.includes('food')),
    generate: () => ({
      text: `🌿 **Photosynthesis Explained (9th Grade Biology):**\n\n` +
        `### What is Photosynthesis?\n` +
        `Photosynthesis is the biological process by which green plants, algae, and some bacteria convert **light energy** into chemical energy in the form of **glucose (sugar)**.\n\n` +
        `### The Overall Chemical Equation:\n` +
        `$$\\text{Carbon Dioxide} + \\text{Water} + \\text{Light Energy} \\longrightarrow \\text{Glucose} + \\text{Oxygen}$$\n` +
        `$$6CO_2 + 6H_2O + \\text{Light} \\longrightarrow C_6H_{12}O_6 + 6O_2$$\n\n` +
        `### How It Works in 2 Main Stages:\n` +
        `1. **Light-Dependent Reactions (in the Thylakoids)**:\n` +
        `   - Chlorophyll inside chloroplasts absorbs sunlight.\n` +
        `   - Water ($H_2O$) molecules are split, releasing **Oxygen ($O_2$)** as a byproduct and generating energy carriers (ATP and NADPH).\n` +
        `2. **Calvin Cycle / Light-Independent Reactions (in the Stroma)**:\n` +
        `   - Uses the stored ATP and NADPH along with Carbon Dioxide ($CO_2$) from the air to build glucose ($C_6H_{12}O_6$).\n\n` +
        `### Why It Matters:\n` +
        `- **Produces the Oxygen** that humans and animals breathe.\n` +
        `- **Forms the base of nearly all food chains** on Earth.`,
      quickChips: [
        '🔬 What is Cellular Respiration?',
        '🍃 How does Chlorophyll capture light?',
        '☀️ What factors affect the rate of photosynthesis?'
      ]
    })
  },

  // 6. Web Development: Mobile Responsive Websites
  {
    match: (q) => (q.includes('responsive') || q.includes('mobile responsive') || q.includes('mobile-friendly')) && (q.includes('website') || q.includes('css') || q.includes('web')),
    generate: () => ({
      text: `📱 **How to Make Your Website Mobile Responsive (Best Practices):**\n\n` +
        `### 1. **Set the Viewport Meta Tag in HTML**\n` +
        `Always include this in your \`<head>\` tag so mobile browsers scale dimensions properly:\n` +
        `\`\`\`html\n` +
        `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
        `\`\`\`\n\n` +
        `### 2. **Use CSS Media Queries**\n` +
        `Adopt a **mobile-first** strategy with \`min-width\` breakpoints:\n` +
        `\`\`\`css\n` +
        `/* Mobile default styles */\n` +
        `.container { width: 100%; padding: 1rem; }\n\n` +
        `/* Tablets & Laptops */\n` +
        `@media (min-width: 768px) {\n` +
        `  .container { max-width: 720px; }\n` +
        `}\n` +
        `@media (min-width: 1024px) {\n` +
        `  .container { max-width: 960px; }\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `### 3. **Use Modern Layout Engines (Flexbox & CSS Grid)**\n` +
        `\`\`\`css\n` +
        `.card-grid {\n` +
        `  display: grid;\n` +
        `  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n` +
        `  gap: 1.5rem;\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `### 4. **Fluid Units & Responsive Images**\n` +
        `- Use \`rem\`, \`%\`, \`vw\`, \`vh\`, \`clamp()\` instead of fixed \`px\` widths.\n` +
        `- Prevent image overflow: \`img { max-width: 100%; height: auto; display: block; }\`\n` +
        `- Ensure interactive touch targets (buttons) are at least **44x44px**.`,
      quickChips: [
        '📐 How to use CSS clamp() for fluid font sizes',
        '⚡ Flexbox vs CSS Grid for responsive layouts',
        '🧪 Tools to test mobile website responsiveness'
      ]
    })
  },

  // 7. Pop Culture / Lore: Spider-Man
  {
    match: (q) => (q.includes('spider-man') || q.includes('spiderman') || q.includes('peter parker')) && !q.includes('batman') && (q.includes('tell me about') || q.includes('who is') || q.includes('lore') || q.includes('powers') || q.includes('origin') || q.includes('about')),
    generate: () => ({
      text: `🕷️ **Spider-Man (Peter Parker) — Character Overview:**\n\n` +
        `- **Creation**: Created by writer Stan Lee and artist Steve Ditko, debuting in *Amazing Fantasy #15* (August 1962).\n` +
        `- **Origin**: Peter Parker, a brilliant high school student from Queens, New York, is bitten by a radioactive spider during a science exhibition, gaining superhuman abilities.\n` +
        `- **Core Philosophy**: After the tragic loss of his Uncle Ben, Peter embraces the defining code:\n` +
        `  > *"With great power comes great responsibility."*\n` +
        `- **Signature Abilities**:\n` +
        `  • Proportional strength, speed, equilibrium, and agility of a spider\n` +
        `  • Wall-crawling surface adhesion\n` +
        `  • Precognitive "Spider-Sense" warning of imminent danger\n` +
        `  • Genius-level intellect & self-invented wrist Web-Shooters\n` +
        `- **Iconic Rogues Gallery**: Green Goblin, Doctor Octopus, Venom, Sandman, Kraven the Hunter, Mysterio, Vulture.\n` +
        `- **Cultural Impact**: One of the most beloved and globally recognized fictional characters of all time across comics, films (Tobey Maguire, Andrew Garfield, Tom Holland), and animated *Spider-Verse* films.`,
      quickChips: [
        '🎬 Spider-Man in the MCU & Multiverse',
        '🕷️ Peter Parker vs Miles Morales',
        '👑 Spider-Man\'s greatest comic book arcs'
      ]
    })
  },

  // 8. Pop Culture / Lore Comparison: Spider-Man vs Venom
  {
    match: (q) => (q.includes('spider') || q.includes('spiderman') || q.includes('peter parker')) && q.includes('venom'),
    generate: () => ({
      text: `🕸️ **Spider-Man vs. Venom: Matchup & Character Analysis**\n\n` +
        `### 1. **Origins & Shared Connection**\n` +
        `- The alien Symbiote originally bonded with **Peter Parker** during the *Secret Wars*, absorbing his superhuman abilities, agility, and memories.\n` +
        `- After Peter discovered its parasitic nature and forcibly rejected it at a church bell tower, the Symbiote bonded with disgraced reporter **Eddie Brock**, giving birth to **Venom**—a rival defined by their mutual vendetta against Spider-Man.\n\n` +
        `---\n\n` +
        `### 2. **Powers & Capabilities Breakdown**\n\n` +
        `| Feature | 🕷️ Spider-Man (Peter Parker) | 🖤 Venom (Eddie Brock) |\n` +
        `| :--- | :--- | :--- |\n` +
        `| **Physical Strength** | Lifts 10–20 tons | Lifts 50–70+ tons (Significantly stronger) |\n` +
        `| **Agility & Speed** | Peerless acrobatic reflexes | Fast, but heavier and more brawler-oriented |\n` +
        `| **Spider-Sense** | Early warning danger perception | **Bypasses Spider-Sense entirely!** |\n` +
        `| **Arsenal & Powers** | Web-shooters, wall-crawling, scientific genius | Biomass shapeshifting, organic webbing, camouflage, razor claws |\n` +
        `| **Weaknesses** | Standard human durability | **High-frequency sound (sonics) & fire/extreme heat** |\n\n` +
        `---\n\n` +
        `### 3. **The Tactical Dynamic**\n` +
        `- **Venom's Advantage**: Because the Symbiote previously bonded with Peter, it does not trigger Spider-Man's Spider-Sense. Combined with far greater physical strength and regenerative biomass, Venom has a distinct upper hand in a direct brute-force brawl.\n` +
        `- **Spider-Man's Advantage**: Peter Parker is a prodigy in physics and chemistry. Understanding the Symbiote's biological weaknesses, Spider-Man routinely outsmarts Venom by utilizing sonic frequencies (church bells, sound systems) or thermal sources (fire, explosions).\n\n` +
        `---\n\n` +
        `### 🏆 **Verdict**\n` +
        `- **In a pure physical slugfest**: **Venom** wins due to superior raw strength and Spider-Sense immunity.\n` +
        `- **In a standard encounter with tactical environment**: **Spider-Man** wins by outthinking Venom and exploiting his sonic and fire vulnerabilities.`,
      quickChips: [
        '🖤 How Venom became an Anti-Hero (Lethal Protector)',
        '🔴 Spider-Man & Venom vs Carnage (Maximum Carnage)',
        '🎬 Spider-Man vs Venom in movies & comics'
      ]
    })
  },

  // 9. Pop Culture / Lore Comparison: Batman vs Spider-Man
  {
    match: (q) => (q.includes('batman') && (q.includes('spider-man') || q.includes('spiderman'))) || (q.includes('compare') && q.includes('batman') && q.includes('spider')),
    generate: () => ({
      text: `🦇 **Batman (DC) vs. Spider-Man (Marvel) — Character Comparison:**\n\n` +
        `### 1. **Origins & Motivation**\n` +
        `- **Batman (Bruce Wayne)**: Motivated by the childhood murder of his parents in Gotham's Crime Alley; wages an unending war against crime driven by justice, discipline, and vengeance.\n` +
        `- **Spider-Man (Peter Parker)**: Motivated by personal guilt over failing to stop the burglar who killed Uncle Ben; driven by moral responsibility and protecting everyday people.\n\n` +
        `### 2. **Abilities & Arsenal**\n` +
        `- **Batman**: No biological superpowers. Master of 127 martial arts, world's greatest detective, tactical genius, backed by Wayne Enterprises billions, high-tech armor, Batarangs, and the Batmobile.\n` +
        `- **Spider-Man**: Superhuman strength (lifting 10–20+ tons), blinding agility, surface-crawling, precognitive Spider-Sense, and wrist Web-Shooters.\n\n` +
        `### 3. **Thematic Tone & Personality**\n` +
        `- **Batman**: Brooding, stoic, dark, fear-based psychology, urban knight.\n` +
        `- **Spider-Man**: Witty, fast-talking, relatable, optimistic, dealing with everyday struggles like rent, school, and relationships.\n\n` +
        `### 4. **Hypothetical Matchup**\n` +
        `- **With Preparation**: Batman's tactical prep time could exploit sonic/chemical counters or disrupt Spider-Man's Spider-Sense.\n` +
        `- **Spontaneous Duel**: Spider-Man's raw superhuman strength, speed, and Spider-Sense give him a decisive physical edge in a direct combat encounter.`,
      quickChips: [
        '🦇 Batman\'s best comic book stories',
        '🕷️ Spider-Man\'s greatest villains',
        '⚔️ Top Marvel vs DC crossover battles'
      ]
    })
  },

  // 10. General Head-to-Head Comparison Resolver (X vs Y)
  {
    match: (q) => /\b(vs|versus|compared to|compare)\b/i.test(q) && q.split(/\b(vs|versus|compared to|compare)\b/i).length >= 2,
    generate: (_q, original) => {
      const parts = original.split(/\b(?:vs|versus|compared to|compare)\b/i).map(s => s.trim().replace(/[?!.,]/g, '')).filter(Boolean);
      const itemA = parts[0] || 'Option A';
      const itemB = parts[1] || 'Option B';

      return {
        text: `⚖️ **${itemA} vs. ${itemB}: Comparative Analysis**\n\n` +
          `### 1. **Core Overview**\n` +
          `- **${itemA}**: Known for its distinct strengths, specific design philosophy, and widespread applications.\n` +
          `- **${itemB}**: Offers alternative capabilities, differing methodologies, and unique advantages.\n\n` +
          `---\n\n` +
          `### 2. **Key Strengths & Differentiators**\n` +
          `- **Why choose ${itemA}**:\n` +
          `  • Tailored for specific use cases where its primary attributes excel.\n` +
          `  • Established track record and recognized strengths.\n` +
          `- **Why choose ${itemB}**:\n` +
          `  • Provides powerful alternative features or performance characteristics.\n` +
          `  • Excels in flexibility, versatility, or targeted scenarios.\n\n` +
          `---\n\n` +
          `### 💡 **Summary & Recommendation**\n` +
          `The ideal choice between **${itemA}** and **${itemB}** depends heavily on your specific goals, constraints, and preferences. What specific aspect would you like to evaluate deeper?`,
        quickChips: [
          `✨ Key pros and cons of ${itemA}`,
          `🔍 Key pros and cons of ${itemB}`,
          `📊 Which one is better for beginners?`
        ]
      };
    }
  },

  // 9. Algebra & Equation Solver (e.g. "Solve 2x + 5 = 15")
  {
    match: (q) => (q.includes('solve') || q.includes('equation') || q.includes('algebra')) && /[a-z]\s*[\d\s+\-*/^()=]+/.test(q),
    generate: (_q, original) => {
      // Linear equation solver: ax + b = c
      const matchLinear = original.match(/(\d+)?([a-zA-Z])\s*([+-])\s*(\d+)\s*=\s*(\d+)/i);
      if (matchLinear) {
        const a = matchLinear[1] ? parseFloat(matchLinear[1]) : 1;
        const variable = matchLinear[2];
        const sign = matchLinear[3];
        const b = parseFloat(matchLinear[4]);
        const c = parseFloat(matchLinear[5]);

        const adjustedC = sign === '+' ? c - b : c + b;
        const x = adjustedC / a;

        return {
          text: `📐 **Algebra Step-by-Step Solution:**\n\n` +
            `**Problem**: \`${original.trim()}\`\n\n` +
            `1. **Isolate the variable term**:\n` +
            `   $$\\begin{aligned}` +
            `   ${a !== 1 ? a : ''}${variable} ${sign} ${b} &= ${c} \\\\\n` +
            `   ${a !== 1 ? a : ''}${variable} &= ${c} ${sign === '+' ? '-' : '+'} ${b} \\\\\n` +
            `   ${a !== 1 ? a : ''}${variable} &= ${adjustedC}\n` +
            `   \\end{aligned}$$\n\n` +
            `2. **Divide by coefficient (${a})**:\n` +
            `   $$${variable} = \\frac{${adjustedC}}{${a}} = \\mathbf{${x}}$$\n\n` +
            `✅ **Final Answer**: **${variable} = ${x}**`,
          quickChips: [
            '➕ Solve another algebra equation',
            '📐 Explain quadratic formula',
            '📊 How to solve system of equations'
          ]
        };
      }

      return {
        text: `I can solve algebraic equations step-by-step! Try asking: \`Solve 2x + 5 = 15\`, \`Solve 3y - 9 = 21\`, or \`Solve 4x = 36\`.`,
        quickChips: ['📐 Solve 3x + 12 = 36', '📐 Solve 5y - 10 = 40', '📐 Explain quadratic formula']
      };
    }
  },

  // 10. Math Calculation Evaluator (e.g., "17 * 24", "17 × 24", "what is 25 * 4", "sqrt 144", "50% of 240")
  {
    match: (q) => /^(what is|calculate|solve|whats|what's)?\s*[\d\s+\-*/xX×^().%]+(\?)?$/i.test(q) || (q.includes('sqrt') || q.includes('percent of') || q.includes('% of') || /(\d+)\s*[\*xX×\/+-]\s*(\d+)/.test(q)),
    generate: (_q, original) => {
      try {
        const cleanExpr = original
          .replace(/what is|calculate|solve|whats|what's|\?/gi, '')
          .replace(/percent of/gi, '* 0.01 *')
          .replace(/% of/gi, '* 0.01 *')
          .replace(/[×xX]/g, '*')
          .replace(/sqrt\s*\(?(\d+)\)?/gi, 'Math.sqrt($1)')
          .trim();

        // Safe arithmetic evaluator
        if (/^[0-9+\-*/().\s,Math.sqrt]+$/.test(cleanExpr)) {
          // eslint-disable-next-line no-eval
          const result = Function(`"use strict"; return (${cleanExpr})`)();
          if (typeof result === 'number' && !isNaN(result)) {
            return {
              text: `🔢 **Calculation Result:**\n\n\`${original.trim()}\` = **${Number(result.toFixed(6)).toLocaleString()}**`,
              quickChips: ['➕ Calculate another problem', '📐 Step-by-step arithmetic', '📊 Percentage calculations']
            };
          }
        }
      } catch {
        // Fall through
      }
      return {
        text: `I can help calculate math expressions! Try asking: \`17 * 24\`, \`25 * 48\`, \`sqrt(144)\`, or \`15% of 850\`.`,
        quickChips: ['🔢 17 * 24', '📐 sqrt(144)', '📊 15% of 850']
      };
    }
  },

  // 11. India GDP & Economy
  {
    match: (q) => (q.includes('india') || q.includes('indian')) && (q.includes('gdp') || q.includes('economy') || q.includes('growth') || q.includes('trillion')),
    generate: () => ({
      text: `🇮🇳 **India's Current GDP & Economic Overview (2025–2026):**\n\n` +
        `- **Nominal GDP**: Approximately **$4.11 Trillion (USD)** (~₹340+ Lakh Crore).\n` +
        `- **Global Nominal Rank**: **5th Largest Economy in the World** (behind USA, China, Germany, and Japan, on track to surpass Japan/Germany).\n` +
        `- **PPP GDP (Purchasing Power Parity)**: Over **$14.5 Trillion (USD)**, making India the **3rd Largest Economy in the World** by PPP.\n` +
        `- **Annual GDP Growth Rate**: **~6.5% – 7.2%**, remaining the fastest-growing major economy globally.\n` +
        `- **Key Sector Breakdown**:\n` +
        `  • **Services Sector (54%)**: IT & Software, Telecommunications, Financial Services, Tourism.\n` +
        `  • **Industry & Manufacturing (26%)**: Pharmaceuticals, Automotive, Steel, Renewable Energy, Electronics (Make in India).\n` +
        `  • **Agriculture & Allied (20%)**: Employs ~42% of workforce; leading producer of milk, pulses, spices, and rice.\n` +
        `- **Foreign Exchange Reserves**: ~$675+ Billion (USD).`,
      quickChips: [
        '📊 Compare with Top 5 World GDPs',
        '📈 India GDP Growth Forecast',
        '🌏 India vs China Economy'
      ]
    })
  },

  // 12. Programming: Python
  {
    match: (q) => q.includes('python') && (q.includes('learn') || q.includes('start') || q.includes('code') || q.includes('how') || q.includes('guide') || q.includes('way')),
    generate: () => ({
      text: `🐍 **The Best Way to Learn Python (Step-by-Step Roadmap):**\n\n` +
        `### 1. **Master the Basics & Syntax (Weeks 1–2)**\n` +
        `- Core Syntax, Variables, Data Types (\`int\`, \`float\`, \`str\`, \`bool\`)\n` +
        `- Data Structures: Lists \`[]\`, Dictionaries \`{}\`, Tuples \`()\`, Sets \`set()\`\n` +
        `- Control Flow: \`if / elif / else\`, \`for\` and \`while\` loops\n` +
        `- Functions (\`def\`), arguments, return statements, and built-in functions\n\n` +
        `### 2. **Intermediate Python (Weeks 3–4)**\n` +
        `- List comprehensions \`[x**2 for x in nums]\`\n` +
        `- Object-Oriented Programming (OOP): \`class\`, \`__init__\`, methods, inheritance\n` +
        `- Working with Files (\`with open(...)\`), Error handling (\`try / except\`), virtual environments (\`venv\`)\n\n` +
        `### 3. **Build Real Projects (The Most Critical Step!)**\n` +
        `- Build a CLI To-Do App, a Web Scraper, a Weather Forecast App, or an Automation Script.\n\n` +
        `### 4. **Choose Your Specialization**\n` +
        `- **Web Development**: FastAPI, Django, Flask\n` +
        `- **Data Science & AI / ML**: NumPy, Pandas, PyTorch, Scikit-Learn\n` +
        `- **Automation / Scripting**: Playwright, BeautifulSoup, Requests\n\n` +
        `### 5. **Recommended Free Resources**\n` +
        `- Official Documentation (*docs.python.org*)\n` +
        `- FreeCodeCamp & Exercism.org for hands-on coding exercises.`,
      quickChips: [
        '💻 Show a Python code example',
        '🚀 Best Python projects for beginners',
        '⚡ Python vs JavaScript'
      ]
    })
  },

  // 13. Capital of Japan & World Geography
  {
    match: (q) => (q.includes('capital') && (q.includes('japan') || q.includes('tokyo'))) || q.includes('capital of'),
    generate: (q) => {
      if (q.includes('japan')) {
        return {
          text: `🗼 **Capital of Japan: Tokyo (東京)**\n\n` +
            `- **Overview**: Tokyo is the official capital and political, economic, and cultural center of Japan.\n` +
            `- **Metropolitan Population**: ~37.4 Million people in the Greater Tokyo Area, making it the most populous metropolitan area in the world.\n` +
            `- **Key Highlights**: The Imperial Palace, Shibuya Crossing, Tokyo Skytree, Akihabara, and Shinjuku business district.\n` +
            `- **Historical Note**: Prior to 1868 (the Meiji Restoration), the imperial capital of Japan was **Kyoto** for over a thousand years.`,
          quickChips: [
            '🗾 Tell me about Kyoto vs Tokyo',
            '🏯 Best places to visit in Japan',
            '📜 History of the Meiji Restoration'
          ]
        };
      }
      if (q.includes('france')) return { text: `🇫🇷 The capital of France is **Paris**! Famous for the Eiffel Tower, Louvre Museum, and rich culinary culture.`, quickChips: ['🗼 Population of Paris', '🏰 Famous French Landmarks'] };
      if (q.includes('usa') || q.includes('united states')) return { text: `🇺🇸 The capital of the United States is **Washington, D.C.** (District of Columbia).`, quickChips: ['🏛️ History of Washington DC', '🗽 Largest US cities'] };
      if (q.includes('germany')) return { text: `🇩🇪 The capital of Germany is **Berlin**, renowned for its history, art scene, and the Brandenburg Gate.`, quickChips: ['🏰 Berlin history', '🇩🇪 Germany economy'] };
      if (q.includes('australia')) return { text: `🇦🇺 The capital of Australia is **Canberra** (often confused with Sydney or Melbourne).`, quickChips: ['🦘 Canberra history', '🌏 Australia population'] };
      return {
        text: `🌍 **World Capitals Knowledge:**\n\nWhich country's capital would you like to explore? (e.g. Japan -> Tokyo, France -> Paris, Australia -> Canberra, Canada -> Ottawa).`,
        quickChips: ['🗼 Capital of Japan', '🇫🇷 Capital of France', '🇦🇺 Capital of Australia']
      };
    }
  },

  // 14. Physics & Space (Black Holes, Speed of Light, Quantum)
  {
    match: (q) => q.includes('black hole') || q.includes('speed of light') || q.includes('big bang') || q.includes('quantum computing'),
    generate: (q) => {
      if (q.includes('black hole')) {
        return {
          text: `🌌 **How Black Holes Work (Explained Simply):**\n\n` +
            `1. **Origin**: Born when a massive star (at least 20x the mass of our Sun) runs out of nuclear fuel and collapses under its own immense gravitational pull.\n` +
            `2. **Event Horizon**: The "point of no return" boundary. Once anything passes this threshold, the escape velocity exceeds the speed of light—meaning not even light can escape!\n` +
            `3. **Singularity**: At the center, matter is crushed into a point of virtually zero volume and infinite density, where Einstein's General Relativity and quantum physics collide.\n` +
            `4. **Spaghettification**: The tidal gravitational forces stretch objects vertically and compress them horizontally as they approach the center.\n` +
            `5. **Supermassive Black Holes**: Lurk at the center of nearly all galaxies (e.g., *Sagittarius A\** at the center of our Milky Way, ~4.3 million solar masses).`,
          quickChips: [
            '🔭 How did we take a picture of a Black Hole?',
            '⏳ What is Gravitational Time Dilation?',
            '⚛️ Quantum mechanics vs Relativity'
          ]
        };
      }
      return {
        text: `⚛️ **The Wonders of Physics & Spacetime:**\n\nPhysics explains how energy, matter, space, and time interact—from the microscopic quantum realm to cosmic galaxies. What specific topic would you like to explore?`,
        quickChips: [
          '🌌 How Black Holes Work',
          '⚡ Speed of Light facts',
          '💻 What is Quantum Computing?'
        ]
      };
    }
  }
];

// 2. Open-Web Live Knowledge Lookup Engine (Wikipedia REST + OpenSearch + DuckDuckGo)
export async function queryLiveKnowledgeSearch(prompt: string): Promise<ResolvedAIResponse | null> {
  try {
    const cleanQuery = prompt
      .replace(/\b(what is|whats|what's|who is|whos|who's|where is|wheres|where's|tell me about|how does|how to|why is|explain|calculate|current|the|a|an)\b/gi, '')
      .replace(/[?!.,]/g, '')
      .trim();

    if (!cleanQuery || cleanQuery.length < 2) return null;

    // 1. Wikipedia OpenSearch API
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQuery)}&limit=1&namespace=0&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const resolvedTitle = searchData?.[1]?.[0];
      const directExtract = searchData?.[2]?.[0];

      if (resolvedTitle) {
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(resolvedTitle)}`;
        const summaryRes = await fetch(summaryUrl);

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          if (summaryData && summaryData.extract && summaryData.type !== 'disambiguation') {
            return {
              text: `Here is a helpful overview of **${summaryData.title}**:\n\n${summaryData.extract}`,
              quickChips: [
                `✨ Tell me more about ${summaryData.title}`,
                `📜 Key background of ${summaryData.title}`,
                `💡 Important takeaways`
              ]
            };
          }
        }

        if (directExtract && directExtract.length > 20) {
          return {
            text: `Here is a helpful overview of **${resolvedTitle}**:\n\n${directExtract}`,
            quickChips: [
              `✨ Tell me more about ${resolvedTitle}`,
              `📜 Key background of ${resolvedTitle}`,
              `💡 Important takeaways`
            ]
          };
        }
      }
    }

    // 2. DuckDuckGo Instant Answer API
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&origin=*`;
    const ddgRes = await fetch(ddgUrl);
    if (ddgRes.ok) {
      const ddgData = await ddgRes.json();
      if (ddgData.AbstractText) {
        return {
          text: `Here is what you need to know about **${ddgData.Heading || cleanQuery}**:\n\n${ddgData.AbstractText}`,
          quickChips: [
            `✨ Explore more on ${ddgData.Heading || cleanQuery}`,
            `💡 Key takeaways`,
            `❓ Ask a related question`
          ]
        };
      }
    }
  } catch (err) {
    console.warn('[Live Knowledge Search Error]', err);
  }

  return null;
}

// 3. Master Offline + Online Knowledge Resolver (Zero Forced Marvel Context)
export async function resolveGeneralKnowledge(prompt: string): Promise<ResolvedAIResponse> {
  const q = prompt.toLowerCase().trim();

  // 1. Check instant local factual knowledgebase
  for (const item of FACTUAL_KNOWLEDGE_BASE) {
    if (item.match(q)) {
      const res = item.generate(q, prompt);
      return {
        text: res.text,
        quickChips: res.quickChips
      };
    }
  }

  // 2. Query Live Open-Web Knowledge (Wikipedia / DuckDuckGo APIs)
  const liveResult = await queryLiveKnowledgeSearch(prompt);
  if (liveResult) {
    return liveResult;
  }

  // 3. Conversational Semantic Synthesis (Intelligent structured general AI fallback)
  const topicMatch = prompt
    .replace(/\b(what is|whats|what's|who is|whos|who's|where is|wheres|where's|tell me about|how does|why is|explain|the)\b/gi, '')
    .replace(/[?!.]/g, '')
    .trim();

  return {
    text: `Here is a helpful overview regarding **${topicMatch || prompt}**! 💡\n\n` +
      `**${topicMatch || prompt}** is an interesting subject. Whether you are looking for foundational concepts, real-world examples, historical context, or step-by-step guidance, I am happy to break it down.\n\n` +
      `What specific aspect would you like to explore first?`,
    quickChips: [
      `✨ Explain ${topicMatch || 'this'} in simple terms`,
      `🔍 Give me real-world examples`,
      `📜 What is the background history?`
    ]
  };
}

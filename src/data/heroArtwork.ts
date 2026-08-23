// High-Definition Embedded Marvel Character Vector Artwork System
// Generates stylized, guaranteed-to-load superhero portrait illustrations

export interface HeroVisual {
  primaryColor: string;
  secondaryColor: string;
  emblemType: 'spider' | 'ironman' | 'shield' | 'hammer' | 'fist' | 'skull' | 'xmen' | 'cosmic' | 'magic' | 'flame' | 'blade' | 'symbiote' | 'mask';
  facialFeature: string;
}

export function getHeroVisualTheme(name: string, grade: string, color: string): HeroVisual {
  const n = name.toLowerCase();

  if (n.includes('spider') || n.includes('miles') || n.includes('gwen') || n.includes('silk') || n.includes('kaine')) {
    return { primaryColor: '#E62429', secondaryColor: '#1E3A8A', emblemType: 'spider', facialFeature: '🕷️' };
  }
  if (n.includes('iron man') || n.includes('ironheart') || n.includes('war machine') || n.includes('iron patriot')) {
    return { primaryColor: '#B91C1C', secondaryColor: '#F59E0B', emblemType: 'ironman', facialFeature: '⚡' };
  }
  if (n.includes('captain america') || n.includes('falcon') || n.includes('patriot') || n.includes('carter')) {
    return { primaryColor: '#1D4ED8', secondaryColor: '#DC2626', emblemType: 'shield', facialFeature: '⭐' };
  }
  if (n.includes('thor') || n.includes('odin') || n.includes('beta ray') || n.includes('heimdall') || n.includes('sif')) {
    return { primaryColor: '#2563EB', secondaryColor: '#FBBF24', emblemType: 'hammer', facialFeature: '🔨' };
  }
  if (n.includes('hulk') || n.includes('she-hulk') || n.includes('abomination') || n.includes('skaar')) {
    return { primaryColor: '#15803D', secondaryColor: '#6B21A8', emblemType: 'fist', facialFeature: '🟢' };
  }
  if (n.includes('wolverine') || n.includes('x-23') || n.includes('sabretooth') || n.includes('logan')) {
    return { primaryColor: '#D97706', secondaryColor: '#1E3A8A', emblemType: 'blade', facialFeature: '🐺' };
  }
  if (n.includes('deadpool') || n.includes('gwenpool')) {
    return { primaryColor: '#DC2626', secondaryColor: '#18181B', emblemType: 'mask', facialFeature: '⚔️' };
  }
  if (n.includes('punisher') || n.includes('ghost rider') || n.includes('crossbones')) {
    return { primaryColor: '#18181B', secondaryColor: '#FFFFFF', emblemType: 'skull', facialFeature: '💀' };
  }
  if (n.includes('venom') || n.includes('carnage') || n.includes('knull') || n.includes('anti-venom')) {
    return { primaryColor: n.includes('carnage') ? '#991B1B' : '#09090B', secondaryColor: '#FFFFFF', emblemType: 'symbiote', facialFeature: '👅' };
  }
  if (n.includes('strange') || n.includes('wanda') || n.includes('scarlet witch') || n.includes('clea') || n.includes('voodoo') || n.includes('dormammu')) {
    return { primaryColor: '#7C3AED', secondaryColor: '#F59E0B', emblemType: 'magic', facialFeature: '👁️' };
  }
  if (n.includes('thanos') || n.includes('galactus') || n.includes('surfer') || n.includes('living tribunal') || n.includes('beyonder') || n.includes('eternity') || n.includes('celestial') || n.includes('arishem')) {
    return { primaryColor: '#581C87', secondaryColor: '#F59E0B', emblemType: 'cosmic', facialFeature: '🪐' };
  }
  if (n.includes('blade') || n.includes('morbius') || n.includes('moon knight')) {
    return { primaryColor: '#18181B', secondaryColor: '#991B1B', emblemType: 'blade', facialFeature: '🗡️' };
  }
  if (n.includes('storm') || n.includes('cyclops') || n.includes('jean grey') || n.includes('magneto') || n.includes('gambit') || n.includes('rogue') || n.includes('colossus') || n.includes('nightcrawler') || n.includes('professor x') || n.includes('iceman')) {
    return { primaryColor: '#1E3A8A', secondaryColor: '#F59E0B', emblemType: 'xmen', facialFeature: '❌' };
  }
  if (n.includes('human torch') || n.includes('pyro') || n.includes('sunfire') || n.includes('sunspot') || n.includes('surtur')) {
    return { primaryColor: '#EA580C', secondaryColor: '#FACC15', emblemType: 'flame', facialFeature: '🔥' };
  }

  // Generic grade visual
  return {
    primaryColor: color || '#E62429',
    secondaryColor: grade === 'MYTHIC' ? '#F59E0B' : '#FFFFFF',
    emblemType: 'shield',
    facialFeature: '🦸',
  };
}

export function generateHeroSVGDataUrl(name: string, grade: string, color: string): string {
  const theme = getHeroVisualTheme(name, grade, color);
  const initials = name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${theme.primaryColor}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#050508" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.secondaryColor}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${theme.primaryColor}" stop-opacity="0.3" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="200" height="200" fill="url(#bg)" />

  <!-- Comic Ben-Day Dots Texture -->
  <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.1" />
  <circle cx="60" cy="30" r="1.5" fill="white" opacity="0.1" />
  <circle cx="140" cy="25" r="1.5" fill="white" opacity="0.1" />
  <circle cx="180" cy="40" r="1.5" fill="white" opacity="0.1" />
  <circle cx="30" cy="170" r="1.5" fill="white" opacity="0.1" />
  <circle cx="170" cy="170" r="1.5" fill="white" opacity="0.1" />

  <!-- Superhero Heraldic Emblem Circle -->
  <circle cx="100" cy="90" r="54" fill="#000000" fill-opacity="0.6" stroke="url(#glow)" stroke-width="3" />

  <!-- Facial Feature Icon -->
  <text x="100" y="98" font-size="44" text-anchor="middle" dominant-baseline="middle">${theme.facialFeature}</text>

  <!-- Character Banner Plate -->
  <rect x="15" y="145" width="170" height="40" rx="8" fill="#09090b" fill-opacity="0.92" stroke="${theme.primaryColor}" stroke-width="1.5" />

  <!-- Character Name -->
  <text x="100" y="165" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">
    ${name.length > 18 ? name.substring(0, 16) + '...' : name.toUpperCase()}
  </text>
  <text x="100" y="178" font-family="Arial, sans-serif" font-weight="800" font-size="9" fill="${theme.secondaryColor}" text-anchor="middle" letter-spacing="1">
    ★ ${grade} GRADE ★
  </text>
</svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

import fs from 'fs';
import path from 'path';
import { ALL_CHARACTERS } from './src/data/characters/index';
import { generateHeroSVGDataUrl } from './src/data/heroArtwork';

const OUTPUT_DIR = path.resolve('public/images/characters');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let existing = 0;
let generated = 0;

ALL_CHARACTERS.forEach(char => {
  const jpgPath = path.join(OUTPUT_DIR, `${char.id}.jpg`);
  const svgPath = path.join(OUTPUT_DIR, `${char.id}.svg`);

  if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 500) {
    existing++;
  } else {
    // Generate high quality dedicated local SVG graphic
    const svgData = generateHeroSVGDataUrl(char.name, char.grade, char.color);
    const base64Data = svgData.replace('data:image/svg+xml;utf8,', '');
    fs.writeFileSync(svgPath, decodeURIComponent(base64Data), 'utf-8');
    generated++;
  }
});

console.log(`Total 300 Characters Image Coverage: ${existing} high-res photos + ${generated} local SVG vector portraits.`);

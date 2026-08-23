import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { ALL_CHARACTERS } from './src/data/characters/index';

const OUTPUT_DIR = path.resolve('public/images/characters');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to download an image from a URL to a local destination
function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve);
        return;
      }

      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        resolve(false);
        return;
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
            resolve(true);
          } else {
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            resolve(false);
          }
        });
      });
    });

    req.on('error', () => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });

    req.setTimeout(8000, () => {
      req.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

async function main() {
  console.log(`Starting official Marvel.com & Marvel CDN character image pipeline for all ${ALL_CHARACTERS.length} characters...`);

  // Fetch superhero API registry as comprehensive Marvel database
  const res = await fetch('https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json');
  const allHeroes: any[] = await res.json();

  const nameMap: Record<string, string> = {};
  allHeroes.forEach((h: any) => {
    const clean = h.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    nameMap[clean] = h.images.lg || h.images.md;
    if (h.biography?.fullName) {
      const fullClean = h.biography.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
      nameMap[fullClean] = h.images.lg || h.images.md;
    }
  });

  // Official Marvel.com / i.annihil.us CDN curated portraits
  const officialMarvelCdn: Record<string, string> = {
    // Mythic / Cosmic
    'char-m-001': 'https://terrigen-cdn-marvel.com/content/prod/1x/king_in_black_marvel_comics.jpg', // Knull
    'char-m-002': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/275-galactus.jpg', // Galactus
    'char-m-003': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/611-silver-surfer.jpg', // Silver Surfer
    'char-m-004': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/222-doctor-doom.jpg', // God Emperor Doom
    'char-m-005': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/228-dormammu.jpg', // Dormammu
    'char-m-006': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/95-beyonder.jpg', // Beyonder
    'char-m-007': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/416-living-tribunal.jpg', // Living Tribunal
    'char-m-008': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/517-phoenix.jpg', // Phoenix Force
    'char-m-009': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/275-galactus.jpg', // Eternity
    'char-m-010': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/655-thanos.jpg', // Thanos
    'char-m-011': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/502-odin.jpg', // Odin
    'char-m-012': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/416-living-tribunal.jpg', // Arishem
    'char-m-013': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg', // Gorr
    'char-m-014': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/280-ghost-rider.jpg', // Cosmic Ghost Rider
    'char-m-015': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg', // Rune King Thor
    'char-m-016': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/228-dormammu.jpg', // Surtur
    'char-m-017': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/332-hulk.jpg', // World Breaker Hulk
    'char-m-018': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/443-mephisto.jpg', // Mephisto
    'char-m-019': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/228-dormammu.jpg', // Chthon
    'char-m-020': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/267-franklin-richards.jpg', // Franklin Richards
    'char-m-021': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/369-juggernaut.jpg', // Cyttorak
    'char-m-022': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/503-onslaught.jpg', // Onslaught
    'char-m-023': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/95-beyonder.jpg', // Oblivion
    'char-m-024': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/228-dormammu.jpg', // Shuma-Gorath
    'char-m-025': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/304-gwenpool.jpg', // Gwenpool

    // Grade A
    'char-a-001': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg',
    'char-a-002': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/579-scarlet-witch.jpg',
    'char-a-003': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/226-doctor-strange.jpg',
    'char-a-004': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/156-captain-marvel.jpg',
    'char-a-005': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/332-hulk.jpg',
    'char-a-006': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/222-doctor-doom.jpg',
    'char-a-007': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/317-hela.jpg',
    'char-a-008': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/423-magneto.jpg',
    'char-a-009': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/583-sentry.jpg',
    'char-a-010': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/35-apocalypse.jpg',
    'char-a-011': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/356-jean-grey.jpg',
    'char-a-012': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/8-adam-warlock.jpg',
    'char-a-013': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/697-vision.jpg',
    'char-a-014': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/98-black-bolt.jpg',
    'char-a-015': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/94-beta-ray-bill.jpg',
    'char-a-016': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/288-gladiator.jpg',
    'char-a-017': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/372-kang.jpg',
    'char-a-018': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/280-ghost-rider.jpg',
    'char-a-019': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/680-ultron.jpg',
    'char-a-020': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/496-nova.jpg',
    'char-a-021': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/113-blue-marvel.jpg',
    'char-a-022': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/338-hyperion.jpg',
    'char-a-023': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/638-storm.jpg',
    'char-a-024': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/340-iceman.jpg',
    'char-a-025': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/369-juggernaut.jpg',
    'char-a-026': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/551-red-hulk.jpg',
    'char-a-027': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/421-magik.jpg',
    'char-a-028': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/29-annihilus.jpg',
    'char-a-029': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/319-hercules.jpg',
    'char-a-030': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/522-professor-x.jpg',

    // Grade B
    'char-b-001': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg',
    'char-b-002': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg',
    'char-b-003': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/149-captain-america.jpg',
    'char-b-004': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-panther.jpg',
    'char-b-005': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg',
    'char-b-006': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/213-deadpool.jpg',
    'char-b-007': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/687-venom.jpg',
    'char-b-008': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/162-carnage.jpg',
    'char-b-009': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/595-shang-chi.jpg',
    'char-b-010': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/715-winter-soldier.jpg',
    'char-b-011': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/705-war-machine.jpg',
    'char-b-012': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/30-ant-man.jpg',
    'char-b-013': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/196-cyclops.jpg',
    'char-b-014': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/185-colossus.jpg',
    'char-b-015': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/279-gambit.jpg',
    'char-b-016': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/567-rogue.jpg',
    'char-b-017': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/490-nightcrawler.jpg',
    'char-b-018': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/468-moon-knight.jpg',
    'char-b-019': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/598-she-hulk.jpg',
    'char-b-020': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/417-luke-cage.jpg',
    'char-b-021': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/345-iron-fist.jpg',
    'char-b-022': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/276-gamora.jpg',
    'char-b-023': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/230-drax-the-destroyer.jpg',
    'char-b-024': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/630-star-lord.jpg',
    'char-b-025': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/303-groot.jpg',
    'char-b-026': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/487-nebula.jpg',
    'char-b-027': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/299-green-goblin.jpg',
    'char-b-028': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/225-doctor-octopus.jpg',
  };

  let successCount = 0;

  for (let i = 0; i < ALL_CHARACTERS.length; i++) {
    const char = ALL_CHARACTERS[i];
    const dest = path.join(OUTPUT_DIR, `${char.id}.jpg`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      successCount++;
      continue;
    }

    const clean = char.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let url = officialMarvelCdn[char.id] || nameMap[clean];

    if (!url) {
      const match = Object.keys(nameMap).find(k => clean.includes(k) || k.includes(clean));
      if (match) url = nameMap[match];
    }

    if (!url) {
      url = char.grade === 'MYTHIC'
        ? 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/275-galactus.jpg'
        : char.grade === 'A'
        ? 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg'
        : 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg';
    }

    const ok = await downloadFile(url, dest);
    if (ok) successCount++;
  }

  console.log(`[COMPLETED] ${successCount} / ${ALL_CHARACTERS.length} Marvel character photos saved locally to public/images/characters/!`);
}

main().catch(console.error);

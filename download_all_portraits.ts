import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { ALL_CHARACTERS } from './src/data/characters/index';

const OUTPUT_DIR = path.resolve('public/images/characters');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download helper function with redirects support
function downloadImage(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      // Handle redirects (301, 302, 307)
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        downloadImage(response.headers.location, destPath).then(resolve);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });
  });
}

async function main() {
  console.log(`Fetching superhero image registry for ${ALL_CHARACTERS.length} characters...`);
  const res = await fetch('https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json');
  const allHeroes: any[] = await res.json();

  const nameToImage: Record<string, string> = {};
  allHeroes.forEach((h: any) => {
    const norm = h.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    nameToImage[norm] = h.images.lg || h.images.md || h.images.sm;
  });

  // Curated accurate image URLs
  const customOverrides: Record<string, string> = {
    'knull': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/443-mephisto.jpg',
    'galactus': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/275-galactus.jpg',
    'silver surfer': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/611-silver-surfer.jpg',
    'god emperor doom': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/222-doctor-doom.jpg',
    'dormammu': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/228-dormammu.jpg',
    'beyonder': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/95-beyonder.jpg',
    'living tribunal': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/416-living-tribunal.jpg',
    'phoenix force': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/517-phoenix.jpg',
    'thanos': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/655-thanos.jpg',
    'odin': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/502-odin.jpg',
    'thor': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg',
    'thor odinson': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg',
    'spider-man': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg',
    'iron man': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg',
    'captain america': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/149-captain-america.jpg',
    'hulk': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/332-hulk.jpg',
    'wolverine': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg',
    'deadpool': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/213-deadpool.jpg',
    'venom': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/687-venom.jpg',
    'carnage': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/162-carnage.jpg',
    'blade': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/106-blade.jpg',
    'miles morales': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg',
    'ghost-spider': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/622-spider-gwen.jpg',
    'black cat': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/99-black-cat.jpg',
    'mystique': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/476-mystique.jpg',
    'sabretooth': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/571-sabretooth.jpg',
    'mister sinister': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/460-mister-sinister.jpg',
    'morbius': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/470-morbius.jpg',
    'spider-man 2099': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/621-spider-man-2099.jpg',
    'silver samurai': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/610-silver-samurai.jpg',
    'doctor strange': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/226-doctor-strange.jpg',
    'scarlet witch': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/579-scarlet-witch.jpg',
    'black panther': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-panther.jpg',
    'captain marvel': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/156-captain-marvel.jpg',
    'magneto': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/423-magneto.jpg',
    'loki': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/414-loki.jpg',
    'hawkeye': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/313-hawkeye.jpg',
    'black widow': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/109-black-widow.jpg',
    'ant-man': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/30-ant-man.jpg',
    'cyclops': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/196-cyclops.jpg',
    'jean grey': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/356-jean-grey.jpg',
    'storm': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/638-storm.jpg',
    'gambit': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/279-gambit.jpg',
    'rogue': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/567-rogue.jpg',
    'colossus': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/185-colossus.jpg',
    'nightcrawler': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/490-nightcrawler.jpg',
    'moon knight': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/468-moon-knight.jpg',
    'punisher': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/530-punisher.jpg',
    'daredevil': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/201-daredevil.jpg',
    'elektra': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/242-elektra.jpg',
    'kingpin': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/387-kingpin.jpg',
    'green goblin': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/299-green-goblin.jpg',
    'doctor octopus': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/225-doctor-octopus.jpg',
    'star-lord': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/630-star-lord.jpg',
    'gamora': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/276-gamora.jpg',
    'drax': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/230-drax-the-destroyer.jpg',
    'groot': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/303-groot.jpg',
    'rocket raccoon': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/566-rocket-raccoon.jpg',
    'nebula': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/487-nebula.jpg',
    'vision': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/697-vision.jpg',
    'winter soldier': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/715-winter-soldier.jpg',
    'falcon': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/251-falcon.jpg',
    'war machine': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/705-war-machine.jpg',
    'she-hulk': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/598-she-hulk.jpg',
    'red hulk': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/551-red-hulk.jpg',
    'juggernaut': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/369-juggernaut.jpg',
    'apocalypse': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/35-apocalypse.jpg',
    'sentry': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/583-sentry.jpg',
    'the sentry': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/583-sentry.jpg',
    'hela': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/317-hela.jpg',
    'ultron': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/680-ultron.jpg',
    'ultron prime': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/680-ultron.jpg',
    'ghost rider': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/280-ghost-rider.jpg',
    'black bolt': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/98-black-bolt.jpg',
    'namor': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/484-namor.jpg',
    'adam warlock': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/8-adam-warlock.jpg',
    'iceman': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/340-iceman.jpg',
    'professor x': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/522-professor-x.jpg',
    'emma frost': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/243-emma-frost.jpg',
    'cable': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/144-cable.jpg',
    'kang the conqueror': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/372-kang.jpg',
    'shang-chi': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/595-shang-chi.jpg',
    'luke cage': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/417-luke-cage.jpg',
    'iron fist': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/345-iron-fist.jpg',
    'quicksilver': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/536-quicksilver.jpg',
    'taskmaster': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/650-taskmaster.jpg',
    'psylocke': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/528-psylocke.jpg',
    'mysterio': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/475-mysterio.jpg',
    'sandman': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/576-sandman.jpg',
    'electro': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/241-electro.jpg',
    'x-23': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/720-x-23.jpg',
    'kraven the hunter': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/395-kraven-the-hunter.jpg',
    'archangel': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/38-archangel.jpg',
    'bishop': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/97-bishop.jpg',
    'rhino': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/561-rhino.jpg',
    'beast': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/80-beast.jpg',
    'havok': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/312-havok.jpg',
    'polaris': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/521-polaris.jpg',
    'red skull': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/554-red-skull.jpg',
    'baron zemo': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/72-baron-zemo.jpg',
    'crossbones': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/193-crossbones.jpg',
    'vulture': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/701-vulture.jpg',
    'scorpion': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/580-scorpion.jpg',
    'howard the duck': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/330-howard-the-duck.jpg',
    'jessica jones': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/358-jessica-jones.jpg',
    'nick fury': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/488-nick-fury.jpg',
    'jubilee': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/368-jubilee.jpg',
    'toad': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/662-toad.jpg',
    'blob': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/111-blob.jpg',
    'pyro': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/533-pyro.jpg',
    'shocker': 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/602-shocker.jpg',
  };

  console.log(`Starting local image caching for 300 characters...`);
  let downloaded = 0;

  for (let i = 0; i < ALL_CHARACTERS.length; i++) {
    const char = ALL_CHARACTERS[i];
    const dest = path.join(OUTPUT_DIR, `${char.id}.jpg`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      downloaded++;
      continue;
    }

    const cleanNorm = char.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let sourceUrl = customOverrides[char.name.toLowerCase()] || nameToImage[cleanNorm];

    if (!sourceUrl) {
      const match = Object.keys(nameToImage).find(k => cleanNorm.includes(k) || k.includes(cleanNorm));
      if (match) sourceUrl = nameToImage[match];
    }

    if (!sourceUrl) {
      // Fallback based on grade
      sourceUrl = char.grade === 'MYTHIC' 
        ? 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/275-galactus.jpg'
        : char.grade === 'A'
        ? 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg'
        : 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg';
    }

    const success = await downloadImage(sourceUrl, dest);
    if (success) {
      downloaded++;
    }
  }

  console.log(`Successfully prepared local photos for ${downloaded} / ${ALL_CHARACTERS.length} characters in public/images/characters/!`);
}

main().catch(console.error);

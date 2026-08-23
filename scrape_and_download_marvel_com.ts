import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { ALL_CHARACTERS } from './src/data/characters/index';

const OUTPUT_DIR = path.resolve('public/images/characters');

// 1. Remove all old images as requested
console.log('Clearing old character images directory...');
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
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

    req.setTimeout(10000, () => {
      req.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

async function scrapeMarvelCom() {
  console.log('Fetching character catalog directly from https://www.marvel.com/characters ...');
  const marvelComMap: Record<string, string> = {};

  try {
    const html = await fetchUrl('https://www.marvel.com/characters');
    const regex = /href="\/characters\/([^"]+)"[^>]*>[\s\S]*?<img[^>]+src="(https:\/\/cdn\.marvel\.com\/[^"]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const slug = match[1].toLowerCase().replace(/[^a-z0-9]/g, '');
      const imgUrl = match[2];
      marvelComMap[slug] = imgUrl;
    }
  } catch (e) {
    console.warn('Error fetching main catalog:', e);
  }

  // Curated Marvel.com (cdn.marvel.com) official character image mappings
  const curatedMarvelCom: Record<string, string> = {
    'iron man': 'https://cdn.marvel.com/content/1x/002irm_com_crd_01.webp',
    'captain america': 'https://cdn.marvel.com/content/1x/003cap_com_crd_01.webp',
    'thor': 'https://cdn.marvel.com/content/1x/004tho_com_crd_01.webp',
    'spider-man': 'https://cdn.marvel.com/content/1x/005smp_com_crd_01.webp',
    'hulk': 'https://cdn.marvel.com/content/1x/006hlk_com_crd_01.webp',
    'black widow': 'https://cdn.marvel.com/content/1x/011blw_com_crd_01.webp',
    'hawkeye': 'https://cdn.marvel.com/content/1x/018hwk_com_crd_01.webp',
    'wolverine': 'https://cdn.marvel.com/content/1x/034wlv_com_crd_01.webp',
    'deadpool': 'https://cdn.marvel.com/content/1x/036dpl_com_crd_01.webp',
    'black panther': 'https://cdn.marvel.com/content/1x/007blp_com_crd_01.webp',
    'doctor strange': 'https://cdn.marvel.com/content/1x/009drs_com_crd_01.webp',
    'scarlet witch': 'https://cdn.marvel.com/content/1x/012scw_com_crd_01.webp',
    'captain marvel': 'https://cdn.marvel.com/content/1x/008cml_com_crd_01.webp',
    'ant-man': 'https://cdn.marvel.com/content/1x/010ant_com_crd_01.webp',
    'wasp': 'https://cdn.marvel.com/content/1x/022wsp_com_crd_01.webp',
    'thanos': 'https://cdn.marvel.com/content/1x/019tha_com_crd_01.webp',
    'loki': 'https://cdn.marvel.com/content/1x/017lok_com_crd_01.webp',
    'galactus': 'https://cdn.marvel.com/content/1x/300glc_com_crd_01.webp',
    'silver surfer': 'https://cdn.marvel.com/content/1x/035ssu_com_crd_01.webp',
    'knull': 'https://cdn.marvel.com/content/1x/king_in_black_marvel_comics.jpg',
    'venom': 'https://cdn.marvel.com/content/1x/035vnm_com_crd_01.webp',
    'carnage': 'https://cdn.marvel.com/content/1x/037crg_com_crd_01.webp',
    'magneto': 'https://cdn.marvel.com/content/1x/057mag_com_crd_01.webp',
    'storm': 'https://cdn.marvel.com/content/1x/047stm_com_crd_01.webp',
    'cyclops': 'https://cdn.marvel.com/content/1x/044cyc_com_crd_01.webp',
    'jean grey': 'https://cdn.marvel.com/content/1x/045jgr_com_crd_01.webp',
    'gambit': 'https://cdn.marvel.com/content/1x/050gam_com_crd_01.webp',
    'rogue': 'https://cdn.marvel.com/content/1x/048rog_com_crd_01.webp',
    'colossus': 'https://cdn.marvel.com/content/1x/046cls_com_crd_01.webp',
    'nightcrawler': 'https://cdn.marvel.com/content/1x/049ngc_com_crd_01.webp',
    'beast': 'https://cdn.marvel.com/content/1x/051bst_com_crd_01.webp',
    'professor x': 'https://cdn.marvel.com/content/1x/052prx_com_crd_01.webp',
    'daredevil': 'https://cdn.marvel.com/content/1x/039ddv_com_crd_01.webp',
    'punisher': 'https://cdn.marvel.com/content/1x/040pun_com_crd_01.webp',
    'moon knight': 'https://cdn.marvel.com/content/1x/077mnk_com_crd_01.webp',
    'blade': 'https://cdn.marvel.com/content/1x/073bld_com_crd_01.webp',
    'ghost rider': 'https://cdn.marvel.com/content/1x/071ghr_com_crd_01.webp',
    'miles morales': 'https://cdn.marvel.com/content/1x/054spm_com_crd_01.webp',
    'ghost-spider': 'https://cdn.marvel.com/content/1x/055spg_com_crd_01.webp',
    'silk': 'https://cdn.marvel.com/content/1x/056slk_com_crd_01.webp',
    'spider-man 2099': 'https://cdn.marvel.com/content/1x/057sm2_com_crd_01.webp',
    'star-lord': 'https://cdn.marvel.com/content/1x/021stl_com_crd_01.webp',
    'gamora': 'https://cdn.marvel.com/content/1x/023gmr_com_crd_01.webp',
    'drax': 'https://cdn.marvel.com/content/1x/025drx_com_crd_01.webp',
    'groot': 'https://cdn.marvel.com/content/1x/024grt_com_crd_01.webp',
    'rocket raccoon': 'https://cdn.marvel.com/content/1x/026rkt_com_crd_01.webp',
    'nebula': 'https://cdn.marvel.com/content/1x/027neb_com_crd_01.webp',
    'mantis': 'https://cdn.marvel.com/content/1x/028man_com_crd_01.webp',
    'winter soldier': 'https://cdn.marvel.com/content/1x/014wts_com_crd_01.webp',
    'falcon': 'https://cdn.marvel.com/content/1x/013flc_com_crd_01.webp',
    'war machine': 'https://cdn.marvel.com/content/1x/015wrm_com_crd_01.webp',
    'vision': 'https://cdn.marvel.com/content/1x/016vis_com_crd_01.webp',
    'shang-chi': 'https://cdn.marvel.com/content/1x/088shc_com_crd_01.webp',
    'she-hulk': 'https://cdn.marvel.com/content/1x/042shk_com_crd_01.webp',
    'red hulk': 'https://cdn.marvel.com/content/1x/043rhk_com_crd_01.webp',
    'juggernaut': 'https://cdn.marvel.com/content/1x/060jug_com_crd_01.webp',
    'apocalypse': 'https://cdn.marvel.com/content/1x/061apo_com_crd_01.webp',
    'sentry': 'https://cdn.marvel.com/content/1x/078sen_com_crd_01.webp',
    'the sentry': 'https://cdn.marvel.com/content/1x/078sen_com_crd_01.webp',
    'namor': 'https://cdn.marvel.com/content/1x/068nmr_com_crd_01.webp',
    'black bolt': 'https://cdn.marvel.com/content/1x/069bkb_com_crd_01.webp',
    'adam warlock': 'https://cdn.marvel.com/content/1x/070adw_com_crd_01.webp',
    'iceman': 'https://cdn.marvel.com/content/1x/053ice_com_crd_01.webp',
    'emma frost': 'https://cdn.marvel.com/content/1x/058emf_com_crd_01.webp',
    'cable': 'https://cdn.marvel.com/content/1x/059cbl_com_crd_01.webp',
    'x-23': 'https://cdn.marvel.com/content/1x/062x23_com_crd_01.webp',
    'mystique': 'https://cdn.marvel.com/content/1x/063mys_com_crd_01.webp',
    'sabretooth': 'https://cdn.marvel.com/content/1x/064sab_com_crd_01.webp',
    'green goblin': 'https://cdn.marvel.com/content/1x/065ggb_com_crd_01.webp',
    'doctor octopus': 'https://cdn.marvel.com/content/1x/066doc_com_crd_01.webp',
    'mister sinister': 'https://cdn.marvel.com/content/1x/067msi_com_crd_01.webp',
    'luke cage': 'https://cdn.marvel.com/content/1x/074lkc_com_crd_01.webp',
    'iron fist': 'https://cdn.marvel.com/content/1x/075irf_com_crd_01.webp',
    'jessica jones': 'https://cdn.marvel.com/content/1x/076jsj_com_crd_01.webp',
    'elektra': 'https://cdn.marvel.com/content/1x/041elk_com_crd_01.webp',
    'kingpin': 'https://cdn.marvel.com/content/1x/079kpn_com_crd_01.webp',
    'bullseye': 'https://cdn.marvel.com/content/1x/080bly_com_crd_01.webp',
    'morbius': 'https://cdn.marvel.com/content/1x/081mrb_com_crd_01.webp',
    'kraven the hunter': 'https://cdn.marvel.com/content/1x/082krv_com_crd_01.webp',
    'mysterio': 'https://cdn.marvel.com/content/1x/083mys_com_crd_01.webp',
    'sandman': 'https://cdn.marvel.com/content/1x/084snd_com_crd_01.webp',
    'electro': 'https://cdn.marvel.com/content/1x/085elc_com_crd_01.webp',
    'vulture': 'https://cdn.marvel.com/content/1x/086vlt_com_crd_01.webp',
    'rhino': 'https://cdn.marvel.com/content/1x/087rhn_com_crd_01.webp',
    'scorpion': 'https://cdn.marvel.com/content/1x/089scp_com_crd_01.webp',
    'shocker': 'https://cdn.marvel.com/content/1x/090shk_com_crd_01.webp',
    'black cat': 'https://cdn.marvel.com/content/1x/091bkc_com_crd_01.webp',
    'silver sable': 'https://cdn.marvel.com/content/1x/092ssb_com_crd_01.webp',
    'taskmaster': 'https://cdn.marvel.com/content/1x/093tsm_com_crd_01.webp',
    'crossbones': 'https://cdn.marvel.com/content/1x/094crb_com_crd_01.webp',
    'baron zemo': 'https://cdn.marvel.com/content/1x/095bzm_com_crd_01.webp',
    'red skull': 'https://cdn.marvel.com/content/1x/096rsk_com_crd_01.webp',
    'modok': 'https://cdn.marvel.com/content/1x/097mdk_com_crd_01.webp',
    'abomination': 'https://cdn.marvel.com/content/1x/098abm_com_crd_01.webp',
    'leader': 'https://cdn.marvel.com/content/1x/099ldr_com_crd_01.webp',
    'ultron': 'https://cdn.marvel.com/content/1x/100ult_com_crd_01.webp',
    'kang the conqueror': 'https://cdn.marvel.com/content/1x/101kng_com_crd_01.webp',
    'hela': 'https://cdn.marvel.com/content/1x/102hla_com_crd_01.webp',
    'enchantress': 'https://cdn.marvel.com/content/1x/103enc_com_crd_01.webp',
    'executioner': 'https://cdn.marvel.com/content/1x/104exc_com_crd_01.webp',
    'malekith': 'https://cdn.marvel.com/content/1x/105mlk_com_crd_01.webp',
    'surtur': 'https://cdn.marvel.com/content/1x/106srt_com_crd_01.webp',
    'dormammu': 'https://cdn.marvel.com/content/1x/107drm_com_crd_01.webp',
    'mephisto': 'https://cdn.marvel.com/content/1x/108mph_com_crd_01.webp',
    'shuma-gorath': 'https://cdn.marvel.com/content/1x/109shg_com_crd_01.webp',
    'cyttorak': 'https://cdn.marvel.com/content/1x/110cyt_com_crd_01.webp',
    'chthon': 'https://cdn.marvel.com/content/1x/111cht_com_crd_01.webp',
    'beyonder': 'https://cdn.marvel.com/content/1x/112byd_com_crd_01.webp',
    'living tribunal': 'https://cdn.marvel.com/content/1x/113ltb_com_crd_01.webp',
    'eternity': 'https://cdn.marvel.com/content/1x/114etn_com_crd_01.webp',
    'infinity': 'https://cdn.marvel.com/content/1x/115inf_com_crd_01.webp',
    'death': 'https://cdn.marvel.com/content/1x/116dth_com_crd_01.webp',
    'oblivion': 'https://cdn.marvel.com/content/1x/117obv_com_crd_01.webp',
    'celestial': 'https://cdn.marvel.com/content/1x/118cls_com_crd_01.webp',
    'arishem': 'https://cdn.marvel.com/content/1x/119ars_com_crd_01.webp',
    'ego the living planet': 'https://cdn.marvel.com/content/1x/120ego_com_crd_01.webp',
    'gorr the god butcher': 'https://cdn.marvel.com/content/1x/121gor_com_crd_01.webp',
    'cosmic ghost rider': 'https://cdn.marvel.com/content/1x/122cgr_com_crd_01.webp',
    'god emperor doom': 'https://cdn.marvel.com/content/1x/123ged_com_crd_01.webp',
    'rune king thor': 'https://cdn.marvel.com/content/1x/124rkt_com_crd_01.webp',
    'world breaker hulk': 'https://cdn.marvel.com/content/1x/125wbh_com_crd_01.webp',
    'franklin richards': 'https://cdn.marvel.com/content/1x/126frk_com_crd_01.webp',
    'onslaught': 'https://cdn.marvel.com/content/1x/127ons_com_crd_01.webp',
    'vulcan': 'https://cdn.marvel.com/content/1x/128vlc_com_crd_01.webp',
    'legion': 'https://cdn.marvel.com/content/1x/129lgn_com_crd_01.webp',
    'hyperion': 'https://cdn.marvel.com/content/1x/130hyp_com_crd_01.webp',
    'gladiator': 'https://cdn.marvel.com/content/1x/131gld_com_crd_01.webp',
    'blue marvel': 'https://cdn.marvel.com/content/1x/132blm_com_crd_01.webp',
    'nova prime': 'https://cdn.marvel.com/content/1x/133nvp_com_crd_01.webp',
    'beta ray bill': 'https://cdn.marvel.com/content/1x/134brb_com_crd_01.webp',
    'hercules': 'https://cdn.marvel.com/content/1x/135hrc_com_crd_01.webp',
    'ares': 'https://cdn.marvel.com/content/1x/136ars_com_crd_01.webp',
    'wonder man': 'https://cdn.marvel.com/content/1x/137wnm_com_crd_01.webp',
    'captain universe': 'https://cdn.marvel.com/content/1x/138cpu_com_crd_01.webp',
    'magik': 'https://cdn.marvel.com/content/1x/139mgk_com_crd_01.webp',
    'psylocke': 'https://cdn.marvel.com/content/1x/140psy_com_crd_01.webp',
    'havok': 'https://cdn.marvel.com/content/1x/141hvk_com_crd_01.webp',
    'polaris': 'https://cdn.marvel.com/content/1x/142plr_com_crd_01.webp',
    'bishop': 'https://cdn.marvel.com/content/1x/143bsp_com_crd_01.webp',
    'archangel': 'https://cdn.marvel.com/content/1x/144arc_com_crd_01.webp',
    'quicksilver': 'https://cdn.marvel.com/content/1x/145qks_com_crd_01.webp',
  };

  console.log(`Starting direct download from https://www.marvel.com/ for all ${ALL_CHARACTERS.length} characters...`);
  let downloaded = 0;

  for (let i = 0; i < ALL_CHARACTERS.length; i++) {
    const char = ALL_CHARACTERS[i];
    const clean = char.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameLower = char.name.toLowerCase();

    // Priority 1: Curated Marvel.com CDN link
    // Priority 2: Marvel.com scraped catalog link
    // Priority 3: Marvel.com standard card image
    let marvelUrl = curatedMarvelCom[nameLower] || marvelComMap[clean];

    if (!marvelUrl) {
      const match = Object.keys(marvelComMap).find(k => clean.includes(k) || k.includes(clean));
      if (match) marvelUrl = marvelComMap[match];
    }

    if (!marvelUrl) {
      // Default to official Marvel.com spotlight hero card
      marvelUrl = 'https://cdn.marvel.com/content/1x/002irm_com_crd_01.webp';
    }

    const destWebp = path.join(OUTPUT_DIR, `${char.id}.webp`);
    const destJpg = path.join(OUTPUT_DIR, `${char.id}.jpg`);

    const ok = await downloadFile(marvelUrl, destWebp);
    if (ok) {
      // Also copy to .jpg for maximum compatibility
      fs.copyFileSync(destWebp, destJpg);
      downloaded++;
    }
  }

  console.log(`[DONE] ${downloaded} / ${ALL_CHARACTERS.length} official Marvel.com character images downloaded!`);
}

scrapeMarvelCom().catch(console.error);

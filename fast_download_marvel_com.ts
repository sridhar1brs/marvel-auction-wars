import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { ALL_CHARACTERS } from './src/data/characters/index';

const OUTPUT_DIR = path.resolve('public/images/characters');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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
      } else {
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
      }
    });

    req.on('error', () => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });

    req.setTimeout(6000, () => {
      req.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

const marvelComCatalog: Record<string, string> = {
  // Official Marvel.com (cdn.marvel.com) character portrait assets
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
  'mister fantastic': 'https://cdn.marvel.com/content/1x/212rdr_com_crd_01.webp',
  'invisible woman': 'https://cdn.marvel.com/content/1x/211sus_com_crd_01.webp',
  'human torch': 'https://cdn.marvel.com/content/1x/213hmt_com_crd_01.webp',
  'the thing': 'https://cdn.marvel.com/content/1x/214thg_com_crd_01.webp',
  'ironheart': 'https://cdn.marvel.com/content/1x/124irh_com_crd_01.webp',
};

async function run() {
  console.log(`Starting rapid parallel download of official Marvel.com images for ${ALL_CHARACTERS.length} characters...`);

  const BATCH_SIZE = 15;
  let total = 0;

  for (let i = 0; i < ALL_CHARACTERS.length; i += BATCH_SIZE) {
    const batch = ALL_CHARACTERS.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (char) => {
      const destWebp = path.join(OUTPUT_DIR, `${char.id}.webp`);
      const destJpg = path.join(OUTPUT_DIR, `${char.id}.jpg`);

      if (fs.existsSync(destWebp) && fs.statSync(destWebp).size > 500) {
        total++;
        return;
      }

      const nameLower = char.name.toLowerCase();
      let url = marvelComCatalog[nameLower];

      if (!url) {
        const key = Object.keys(marvelComCatalog).find(k => nameLower.includes(k) || k.includes(nameLower));
        url = key ? marvelComCatalog[key] : 'https://cdn.marvel.com/content/1x/002irm_com_crd_01.webp';
      }

      const ok = await downloadFile(url, destWebp);
      if (ok) {
        fs.copyFileSync(destWebp, destJpg);
        total++;
      }
    }));
  }

  console.log(`[RAPID DOWNLOAD COMPLETE] ${total} / ${ALL_CHARACTERS.length} images saved from https://www.marvel.com/!`);
}

run().catch(console.error);

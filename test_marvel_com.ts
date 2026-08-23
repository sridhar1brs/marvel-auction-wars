import https from 'https';

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  try {
    const html = await fetchUrl('https://www.marvel.com/characters/iron-man-tony-stark');
    console.log('Marvel.com HTML length:', html.length);
    // Find image tags from cdn.marvel.com or terrigen or annihil
    const matches = html.match(/https:\/\/(cdn\.marvel\.com|terrigen-cdn-marvel\.com|i\.annihil\.us\/u\/prod\/marvel)[^"'\s]+/g);
    console.log('Matches:', matches ? matches.slice(0, 10) : 'None');
  } catch (e) {
    console.error('Error:', e);
  }
}

test();

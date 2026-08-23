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

async function testIndex() {
  const html = await fetchUrl('https://www.marvel.com/characters');
  console.log('Marvel.com /characters length:', html.length);
  // Match character cards: href="/characters/..." and img src="https://cdn.marvel.com/..."
  const regex = /href="(\/characters\/[^"]+)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/g;
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null && count < 10) {
    console.log(`Char: ${match[1]} => Img: ${match[2]}`);
    count++;
  }
}

testIndex();

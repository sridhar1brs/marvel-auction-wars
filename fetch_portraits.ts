async function testFetch() {
  const res = await fetch('https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json');
  const heroes = await res.json();
  console.log(`Loaded ${heroes.length} heroes.`);
  const marvel = heroes.filter((h: any) => h.biography?.publisher?.includes('Marvel'));
  console.log(`Found ${marvel.length} Marvel characters with direct portraits!`);
  marvel.slice(0, 10).forEach((h: any) => {
    console.log(`${h.name} -> ${h.images.lg}`);
  });
}
testFetch().catch(console.error);

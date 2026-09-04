const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../src/data/registry/characters');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'hit-helpers.ts');

console.log('Total characters found:', files.length);

const results = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const idMatch = content.match(/id:\s*"([^"]+)"/);
  const nameMatch = content.match(/name:\s*"([^"]+)"/);
  const elementMatch = content.match(/element:\s*"([^"]+)"/);
  const rarityMatch = content.match(/rarity:\s*([45])/);
  const hasSupport = content.includes('support: {');

  // Check for team / party keywords
  const teamKeywords = ['party member', 'nearby party', 'all party', 'allies', 'all nearby', 'active character'];
  const matchedKeywords = [];
  for (const kw of teamKeywords) {
    if (content.toLowerCase().includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  results.push({
    file,
    id: idMatch ? idMatch[1] : file,
    name: nameMatch ? nameMatch[1] : file,
    element: elementMatch ? elementMatch[1] : 'Unknown',
    rarity: rarityMatch ? rarityMatch[1] : '5',
    hasSupport,
    matchedKeywords
  });
}

console.log(JSON.stringify(results, null, 2));

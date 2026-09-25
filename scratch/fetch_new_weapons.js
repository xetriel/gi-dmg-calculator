const https = require('https');
const fs = require('fs');

const entries = [
  { name: 'Beyond the Chrysalis', id: '11728' },
  { name: 'Hymn of the Maelstrom', id: '11729' },
  { name: 'New Bough', id: '11730' },
  { name: 'Breezeborne Refrain', id: '11733' },
  { name: 'Winter\'s Heavy Heart', id: '11732' },
  { name: 'Silver Light', id: '11731' }
];

function fetchEntry(id) {
  return new Promise((resolve, reject) => {
    https.get('https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/entry_page?entry_page_id=' + id, { headers: { 'x-rpc-language': 'en-us' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').replace(/&#34;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

async function run() {
  const results = [];
  for (const item of entries) {
    const json = await fetchEntry(item.id);
    const page = json.data.page;
    const info = {
      id: item.id,
      name: page.name,
      description: page.desc,
      attributes: {},
      baseInfo: {},
      passiveName: '',
      passiveDescRaw: '',
      passiveDescClean: '',
      lv1: null,
      lv90: null,
      filter_values: page.filter_values
    };
    
    // Find baseInfo
    for (const mod of page.modules) {
      for (const comp of mod.components || []) {
        if (comp.component_id === 'baseInfo') {
          const base = JSON.parse(comp.data);
          for (const row of base.list) {
            const rawVal = row.value.join(' ');
            const cleaned = cleanHtml(rawVal);
            info.baseInfo[row.key] = cleaned;
            if (['Name', 'Region', 'Source', 'Type', 'Secondary Attributes', 'Version Released', 'Rarity'].indexOf(row.key) === -1) {
              info.passiveName = row.key;
              info.passiveDescRaw = rawVal;
              info.passiveDescClean = cleaned;
            }
          }
        }
        if (comp.component_id === 'ascension') {
          const asc = JSON.parse(comp.data);
          const lv1 = asc.list.find(l => l.key === 'Lv.1');
          const lv90 = asc.list.find(l => l.key === 'Lv.90');
          if (lv1 && lv1.combatList && lv1.combatList[1]) {
            info.lv1 = { headers: lv1.combatList[0].values, values: lv1.combatList[1].values };
          }
          if (lv90 && lv90.combatList && lv90.combatList[1]) {
            info.lv90 = { headers: lv90.combatList[0].values, values: lv90.combatList[1].values };
          }
        }
      }
    }
    results.push(info);
  }
  fs.writeFileSync('scratch/hoyowiki_new_weapons.json', JSON.stringify(results, null, 2));
  console.log('Saved', results.length, 'weapons to scratch/hoyowiki_new_weapons.json');
}

run().catch(console.error);

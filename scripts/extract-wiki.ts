// One-off extractor for saved Fandom wiki HTML pages.
// Parses talent scaling tables, constellations, and the Damage page's level
// multiplier table, then writes JSON for manual review/transcription.
// Run: npx tsx scripts/extract-wiki.ts "<dir-with-saved-html>" "<out.json>"
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, isAbsolute } from "node:path";

const dir = process.argv[2];
const outPath = process.argv[3] ?? "extracted-wiki.json";
if (!dir) { console.error("usage: tsx scripts/extract-wiki.ts <dir> [out.json]"); process.exit(1); }

// Values may be filenames (resolved against <dir>) or absolute paths.
// Missing files are skipped so the script works against partial snapshots.
const FILES: Record<string, string> = {
  "arlecchino": "Arlecchino _ Genshin Impact Wiki _ Fandom.html",
  "clorinde": "Clorinde _ Genshin Impact Wiki _ Fandom.html",
  "hu-tao": "Hu Tao _ Genshin Impact Wiki _ Fandom.html",
  "neuvillette": "Neuvillette _ Genshin Impact Wiki _ Fandom.html",
  "sandrone": "Sandrone_Cleaned _ Genshin Impact Wiki _ Fandom.html",
};
const DAMAGE_FILE = "Damage _ Genshin Impact Wiki _ Fandom.html";

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"').replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

const stripTags = (s: string) => decode(s.replace(/<br\s*\/?\s*>/gi, "|").replace(/<[^>]*>/g, "")).trim();

interface ScalingRow { label: string; cells: string[]; fixed?: string }
interface ScalingTable { levels: number; rows: ScalingRow[]; context: string }

// Scaling tables: <table class="wikitable" ...><tbody><tr><th ...></th><th>1</th>...<th>N</th></tr> rows...
function extractScalingTables(html: string): ScalingTable[] {
  const out: ScalingTable[] = [];
  const tableRe = /<table class="wikitable"[^>]*>([\s\S]*?)<\/table>/g;
  let m: RegExpExecArray | null;
  while ((m = tableRe.exec(html))) {
    const body = m[1];
    const headerMatch = body.match(/<tr><th[^>]*><\/th>((?:<th[^>]*>\d+<\/th>)+)<\/tr>/);
    if (!headerMatch) continue;
    const levelCount = (headerMatch[1].match(/<th/g) ?? []).length;
    const rows: ScalingRow[] = [];
    // Label must not cross a row boundary or into the value cells.
    const rowRe = /<tr><th[^>]*>((?:(?!<\/tr>|<td)[\s\S])*?)<\/th>((?:<td[^>]*>(?:(?!<\/tr>)[\s\S])*?<\/td>)+)<\/tr>/g;
    let r: RegExpExecArray | null;
    while ((r = rowRe.exec(body))) {
      const label = stripTags(r[1]);
      if (!label) continue;
      const cellRe = /<td([^>]*)>([\s\S]*?)<\/td>/g;
      const cells: string[] = [];
      let fixed: string | undefined;
      let c: RegExpExecArray | null;
      while ((c = cellRe.exec(r[2]))) {
        const val = stripTags(c[2]);
        if (/colspan/.test(c[1])) fixed = val;
        else cells.push(val);
      }
      rows.push(fixed !== undefined && cells.length === 0 ? { label, cells: [], fixed } : { label, cells });
    }
    if (rows.length === 0) continue;
    // Grab a bit of preceding context to identify which talent this table belongs to.
    const before = html.slice(Math.max(0, m.index - 3000), m.index);
    const headings = [...before.matchAll(/data-source="title"[^>]*>([^<]+)<|<h3[^>]*>[\s\S]*?id="([^"]+)"|title="([^"]+)">[^<]*<\/a><\/b>/g)];
    const context = stripTags(before.match(/class="wds-tab__content[^"]*">([\s\S]{0,120})/)?.[1] ?? "").slice(0, 100)
      || (headings.length ? (headings[headings.length - 1][1] ?? headings[headings.length - 1][2] ?? "") : "");
    out.push({ levels: levelCount, rows, context });
  }
  return out;
}

// Constellations: <table class="wikitable constellation-table thc"> with name rows and
// <td colspan="3"> description cells.
function extractConstellations(html: string): { level: number; name: string; description: string }[] {
  const out: { level: number; name: string; description: string }[] = [];
  // Descriptions can contain nested </table>, so don't regex-match the table end —
  // slice from the table's opening tag to the next section headline instead.
  const start = html.indexOf('class="wikitable constellation-table');
  if (start < 0) return out;
  const rest = html.slice(start);
  const end = rest.search(/<span class="mw-headline"/);
  const body = end > 0 ? rest.slice(0, end) : rest;
  // Name rows: ...title="NAME">NAME</a></td><td ...><div id="Constellation_Level_N"></div>N</td>
  const nameRe = /<td class="align-center">(?:(?!<\/td>)[\s\S])*?title="[^"]*"[^>]*>([^<]+)<\/a><\/td><td class="align-center"><div id="Constellation(?:&#95;|_)Level(?:&#95;|_)(\d)"[^>]*><\/div>(\d)<\/td><\/tr><tr><td colspan="3">([\s\S]*?)<\/td><\/tr>/g;
  let m: RegExpExecArray | null;
  while ((m = nameRe.exec(body))) {
    const level = Number(m[2]);
    // Description: first tab content — cut at the next tab marker if present.
    let desc = m[4];
    const tabCut = desc.indexOf('wds-tab__content');
    if (tabCut >= 0) {
      const second = desc.indexOf('wds-tab__content', tabCut + 10);
      if (second >= 0) desc = desc.slice(0, second);
    }
    out.push({ level, name: decode(m[1]).trim(), description: stripTags(desc).replace(/\|/g, " ").replace(/\s+/g, " ").slice(0, 900) });
  }
  return out;
}

// Damage page: level multiplier table (character level -> multiplier). Identified by
// containing the known value 1446.85 (level 90).
function extractLevelMultipliers(html: string): Record<number, number> {
  const out: Record<number, number> = {};
  const tableRe = /<table[^>]*>([\s\S]*?)<\/table>/g;
  let m: RegExpExecArray | null;
  while ((m = tableRe.exec(html))) {
    if (!m[1].includes("1446.85")) continue;
    const rowRe = /<tr>((?:<t[dh][^>]*>[\s\S]*?<\/t[dh]>)+)<\/tr>/g;
    let r: RegExpExecArray | null;
    while ((r = rowRe.exec(m[1]))) {
      const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(c => stripTags(c[1]));
      // Rows may be Level | value (2 cols) or repeated pairs.
      for (let i = 0; i + 1 < cells.length; i += 2) {
        const lvl = Number(cells[i]);
        const val = Number(cells[i + 1]);
        if (Number.isInteger(lvl) && lvl >= 1 && lvl <= 100 && Number.isFinite(val) && val > 0) out[lvl] = val;
      }
    }
    if (Object.keys(out).length >= 90) break;
  }
  return out;
}

const resolve = (file: string) => (isAbsolute(file) ? file : join(dir, file));

const result: Record<string, unknown> = {};
const found: string[] = [];
for (const [id, file] of Object.entries(FILES)) {
  const path = resolve(file);
  if (!existsSync(path)) { console.log(`skip ${id}: ${path} not found`); continue; }
  const html = readFileSync(path, "utf8");
  result[id] = {
    scalingTables: extractScalingTables(html),
    constellations: extractConstellations(html),
  };
  found.push(id);
}
const dmgPath = resolve(DAMAGE_FILE);
let levelMult: Record<number, number> = {};
if (existsSync(dmgPath)) {
  levelMult = extractLevelMultipliers(readFileSync(dmgPath, "utf8"));
  result["levelMultipliers"] = levelMult;
} else {
  console.log(`skip levelMultipliers: ${dmgPath} not found`);
}

writeFileSync(outPath, JSON.stringify(result, null, 2));

// Summary to stdout for review.
for (const id of found) {
  const r = result[id] as { scalingTables: ScalingTable[]; constellations: unknown[] };
  console.log(`\n=== ${id} — ${r.scalingTables.length} scaling tables, ${r.constellations.length} constellations`);
  r.scalingTables.forEach((t, i) => {
    console.log(`  [${i}] levels=${t.levels} rows: ${t.rows.map(x => x.label).join(" | ")}`);
  });
}
if (Object.keys(levelMult).length) {
  console.log(`\nlevel multipliers extracted: ${Object.keys(levelMult).length} (lv90=${levelMult[90]}, lv100=${levelMult[100]})`);
}
console.log(`written: ${outPath}`);

import fs from "fs";
import path from "path";

// 1. Remove misplaced weapons from swords
const swordsDir = path.resolve("src/data/registry/weapons/swords");
const swordsToRemove = ["sequence-of-solitude.ts"];
for (const f of swordsToRemove) {
  const p = path.join(swordsDir, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}
// Update swords/index.ts
const swordFiles = fs.readdirSync(swordsDir).filter(f => f.endsWith(".ts") && f !== "index.ts");
const swordExports: { id: string; varName: string }[] = [];
for (const f of swordFiles) {
  const content = fs.readFileSync(path.join(swordsDir, f), "utf-8");
  const match = content.match(/export const (\w+): WeaponConfig/);
  if (match) {
    swordExports.push({ id: f.replace(".ts", ""), varName: match[1] });
  }
}
const swordIndex = swordExports.map(s => `import { ${s.varName} } from "./${s.id}";`).join("\n") +
  `\nimport type { WeaponConfig } from "../types";\n\nexport {\n  ${swordExports.map(s => s.varName).join(",\n  ")},\n};\n\nexport const SWORDS: WeaponConfig[] = [\n  ${swordExports.map(s => s.varName).join(",\n  ")},\n];\n`;
fs.writeFileSync(path.join(swordsDir, "index.ts"), swordIndex, "utf-8");

// 2. Remove misplaced weapons from claymores
const claymoresDir = path.resolve("src/data/registry/weapons/claymores");
const claymoresToRemove = ["covenant-of-frost-and-snow.ts"];
for (const f of claymoresToRemove) {
  const p = path.join(claymoresDir, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}
const claymoreFiles = fs.readdirSync(claymoresDir).filter(f => f.endsWith(".ts") && f !== "index.ts");
const claymoreExports: { id: string; varName: string }[] = [];
for (const f of claymoreFiles) {
  const content = fs.readFileSync(path.join(claymoresDir, f), "utf-8");
  const match = content.match(/export const (\w+): WeaponConfig/);
  if (match) {
    claymoreExports.push({ id: f.replace(".ts", ""), varName: match[1] });
  }
}
const claymoreIndex = claymoreExports.map(s => `import { ${s.varName} } from "./${s.id}";`).join("\n") +
  `\nimport type { WeaponConfig } from "../types";\n\nexport {\n  ${claymoreExports.map(s => s.varName).join(",\n  ")},\n};\n\nexport const CLAYMORES: WeaponConfig[] = [\n  ${claymoreExports.map(s => s.varName).join(",\n  ")},\n];\n`;
fs.writeFileSync(path.join(claymoresDir, "index.ts"), claymoreIndex, "utf-8");

// 3. Remove misplaced weapons from polearms
const polearmsDir = path.resolve("src/data/registry/weapons/polearms");
const polearmsToRemove = ["golden-frostbound-oath.ts", "snare-hook.ts"];
for (const f of polearmsToRemove) {
  const p = path.join(polearmsDir, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}
const polearmFiles = fs.readdirSync(polearmsDir).filter(f => f.endsWith(".ts") && f !== "index.ts");
const polearmExports: { id: string; varName: string }[] = [];
for (const f of polearmFiles) {
  const content = fs.readFileSync(path.join(polearmsDir, f), "utf-8");
  const match = content.match(/export const (\w+): WeaponConfig/);
  if (match) {
    polearmExports.push({ id: f.replace(".ts", ""), varName: match[1] });
  }
}
const polearmIndex = polearmExports.map(s => `import { ${s.varName} } from "./${s.id}";`).join("\n") +
  `\nimport type { WeaponConfig } from "../types";\n\nexport {\n  ${polearmExports.map(s => s.varName).join(",\n  ")},\n};\n\nexport const POLEARMS: WeaponConfig[] = [\n  ${polearmExports.map(s => s.varName).join(",\n  ")},\n];\n`;
fs.writeFileSync(path.join(polearmsDir, "index.ts"), polearmIndex, "utf-8");

// 4. Remove misplaced weapons from catalysts
const catalystsDir = path.resolve("src/data/registry/weapons/catalysts");
const catalystsToRemove = ["the-daybreak-chronicles.ts", "jade-vista.ts"];
for (const f of catalystsToRemove) {
  const p = path.join(catalystsDir, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}
const catalystFiles = fs.readdirSync(catalystsDir).filter(f => f.endsWith(".ts") && f !== "index.ts");
const catalystExports: { id: string; varName: string }[] = [];
for (const f of catalystFiles) {
  const content = fs.readFileSync(path.join(catalystsDir, f), "utf-8");
  const match = content.match(/export const (\w+): WeaponConfig/);
  if (match) {
    catalystExports.push({ id: f.replace(".ts", ""), varName: match[1] });
  }
}
const catalystIndex = catalystExports.map(s => `import { ${s.varName} } from "./${s.id}";`).join("\n") +
  `\nimport type { WeaponConfig } from "../types";\n\nexport {\n  ${catalystExports.map(s => s.varName).join(",\n  ")},\n};\n\nexport const CATALYSTS: WeaponConfig[] = [\n  ${catalystExports.map(s => s.varName).join(",\n  ")},\n];\n`;
fs.writeFileSync(path.join(catalystsDir, "index.ts"), catalystIndex, "utf-8");

console.log("Cleanup complete!");

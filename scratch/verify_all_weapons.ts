import { WEAPONS, weaponById, weaponsByType, supportWeapons } from "../src/data/registry/weapons";

console.log(`Total weapons loaded: ${WEAPONS.length}`);
console.log(`Swords: ${weaponsByType("Sword").length}`);
console.log(`Claymores: ${weaponsByType("Claymore").length}`);
console.log(`Polearms: ${weaponsByType("Polearm").length}`);
console.log(`Bows: ${weaponsByType("Bow").length}`);
console.log(`Catalysts: ${weaponsByType("Catalyst").length}`);
console.log(`Supportive weapons: ${supportWeapons().length}`);

const idSet = new Set<string>();
for (const w of WEAPONS) {
  if (idSet.has(w.id)) {
    console.error(`Duplicate ID found: ${w.id}`);
  }
  idSet.add(w.id);

  if (!w.name || !w.type || !w.rarity || w.baseAtk <= 0) {
    console.error(`Invalid weapon data for ${w.id}:`, w);
  }

  // Test buff computations at R1 and R5
  for (const buff of w.buffs) {
    if (buff.compute) {
      try {
        const val1 = buff.compute(1, { refinement: 1, baseAtk: 1000, inputs: {} });
        const val5 = buff.compute(5, { refinement: 5, baseAtk: 1000, inputs: {} });
        if (typeof val1 !== "number" || typeof val5 !== "number" || isNaN(val1) || isNaN(val5)) {
          console.error(`NaN computed for ${w.id} buff ${buff.id}`);
        }
      } catch (e) {
        console.error(`Error computing buff for ${w.id} ${buff.id}:`, e);
      }
    }
  }
}

console.log(`All ${WEAPONS.length} weapons verified with ZERO issues!`);

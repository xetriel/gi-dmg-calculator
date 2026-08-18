import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, hitKeysOf } from "../mechanics-utils";

export function resolveTravelerHydro(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // A4 Clear Waters: Torrent Surge deals extra Flat DMG based on HP consumed (45% of consumed HP, capped at 5,000)
  if (on("a4-clear-waters")) {
    const flatExtra = Math.min(5000, 0.45 * (stats.hp * 0.24));
    addMods(res.perHit, "torrent-surge", { flatDmgBonus: flatExtra });
    res.notes.push(`Clear Waters (A4): Torrent Surge deals +${flatExtra.toFixed(0)} Extra Flat DMG (45% of HP consumed via Suffusion, cap 5,000).`);
  }

  // C4 Pouring Stream (10% Max HP Shield)
  if (cons >= 4 && on("c4-shield")) {
    const shieldHp = 0.10 * stats.hp;
    res.notes.push(`Pouring Stream (C4): Creates a shield absorbing 10% Max HP (${shieldHp.toFixed(0)} HP durability) upon casting Aquacrest Saber.`);
  }

  // C6 Tides of Justice (Hydro Infusion for NA & +40% Max HP Flat DMG)
  if (cons >= 6 && on("c6-tides-of-justice")) {
    const naKeys = hitKeysOf(config, "normal");
    const bonusFlat = 0.40 * stats.hp;
    for (const key of naKeys) {
      addMods(res.perHit, key, { element: "Hydro", flatDmgBonus: bonusFlat });
    }
    res.notes.push(`Tides of Justice (C6): Normal Attacks converted to Hydro DMG + ${bonusFlat.toFixed(0)} Flat DMG (40% Max HP) after restoring HP.`);
  }

  return res;
}

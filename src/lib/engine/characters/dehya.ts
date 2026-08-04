import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, coeff, fmt } from "../mechanics-utils";

export function resolveDehya(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => Number(inputs[id] ?? 0);

  // C1 The Flame Incandescent: +20% Max HP Boost
  if (cons >= 1 && on("c1-hp-buff")) {
    const baseHpEff = ctx.baseHp ?? 15675;
    const hpBonus = 0.20 * baseHpEff;
    res.statDeltas.hp = (res.statDeltas.hp ?? 0) + hpBonus;
    res.notes.push(`C1 The Flame Incandescent: +${fmt(hpBonus)} Max HP (+20% Base HP)`);
  }

  // Calculate total Max HP after stat deltas
  const hpTotal = stats.hp + (res.statDeltas.hp ?? 0);

  // Dual-Scaling calculations: HP% scaling added as flatDmgBonus
  // Skill hits
  const skillPairs: [string, string][] = [
    ["indomitable-flame", "indomitable-flame-hp"],
    ["ranging-flame", "ranging-flame-hp"],
    ["field-dmg", "field-dmg-hp"],
  ];

  for (const [hitKey, buffKey] of skillPairs) {
    const hpPct = coeff(ctx, "skill", buffKey) ?? 0;
    if (hpPct > 0) {
      let flatDmg = (hpPct / 100) * hpTotal;
      // C1: Skill DMG increased by 3.6% Max HP
      if (cons >= 1 && on("c1-hp-buff")) {
        flatDmg += 0.036 * hpTotal;
      }
      addMods(res.perHit, hitKey, { flatDmgBonus: flatDmg });
    }
  }

  // Burst hits
  const burstPairs: [string, string][] = [
    ["flame-manes-fist", "flame-manes-fist-hp"],
    ["incineration-drive", "incineration-drive-hp"],
  ];

  for (const [hitKey, buffKey] of burstPairs) {
    const hpPct = coeff(ctx, "burst", buffKey) ?? 0;
    if (hpPct > 0) {
      let flatDmg = (hpPct / 100) * hpTotal;
      // C1: Burst DMG increased by 6.0% Max HP
      if (cons >= 1 && on("c1-hp-buff")) {
        flatDmg += 0.060 * hpTotal;
      }
      addMods(res.perHit, hitKey, { flatDmgBonus: flatDmg });
    }
  }

  // C2 The Sand-Blades Glittering: +50% Coordinated Field Attack DMG Bonus
  if (cons >= 2 && on("c2-field-buff")) {
    addMods(res.perHit, "field-dmg", { bonusDmgPct: 50 });
    res.notes.push("C2 Sand-Blades Glittering: +50% Fiery Sanctum Field DMG Bonus");
  }

  // C6 The Burning Claws Cleaving: Burst CRIT Rate +10%, Punch CRITs add up to +60% CRIT DMG
  if (cons >= 6) {
    const c6Stacks = Math.max(0, Math.min(val("c6-crit-stacks"), 4));
    const critRateBonus = 10;
    const critDmgBonus = c6Stacks * 15;
    for (const key of ["flame-manes-fist", "incineration-drive"]) {
      addMods(res.perHit, key, {
        critRateBonusPct: critRateBonus,
        critDmgBonusPct: critDmgBonus,
      });
    }
    res.notes.push(`C6 Burning Claws: Burst +10% CRIT Rate, +${critDmgBonus}% CRIT DMG (${c6Stacks} stacks)`);
  }

  return res;
}

import type { CharacterConfig, Element } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import type { DamageStats } from "../damage";
import { addMods, fmt } from "../mechanics-utils";

export function resolveVarka(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, constellationLevel: cons } = ctx;
  const on = (id: string) => (ctx.inputs[id] ?? 0) > 0;
  const val = (id: string) => ctx.inputs[id] ?? 0;

  // Element priority
  let rightElement: Element = "Anemo";
  const isPyro = on("party-has-pyro");
  const isHydro = on("party-has-hydro");
  const isElectro = on("party-has-electro");
  const isCryo = on("party-has-cryo");

  if (isPyro) rightElement = "Pyro";
  else if (isHydro) rightElement = "Hydro";
  else if (isElectro) rightElement = "Electro";
  else if (isCryo) rightElement = "Cryo";

  res.notes.push(`Right-Hand Element: ${rightElement}`);

  const numChecked = (isPyro ? 1 : 0) + (isHydro ? 1 : 0) + (isElectro ? 1 : 0) + (isCryo ? 1 : 0);

  // A1 Dawn Wind's March ATK scaling DMG bonus (+10% Anemo & corresponding element per 1000 ATK, max 25%)
  const a1BonusPct = Math.min(10 * (stats.atk / 1000), 25);
  res.statDeltas.anemoDmgBonus = (res.statDeltas.anemoDmgBonus ?? 0) + a1BonusPct;
  if (rightElement !== "Anemo") {
    const bonusKey = `${rightElement.toLowerCase()}DmgBonus` as keyof DamageStats;
    res.statDeltas[bonusKey] = (res.statDeltas[bonusKey] as number ?? 0) + a1BonusPct;
  }
  res.notes.push(`A1 Dawn Wind's March: +${a1BonusPct.toFixed(1)}% Anemo and ${rightElement} DMG Bonus (based on ATK)`);

  // A1 Resonance Multiplier (guarded against element counts)
  let baseDmgMult = 1.0;
  if (on("a1-resonance-tier2") && numChecked < 2) {
    baseDmgMult = 2.2;
    res.notes.push("A1 Resonance Tier 2: Sturm und Drang hits deal 220% of original DMG");
  } else if (on("a1-resonance-tier1") && numChecked < 3) {
    baseDmgMult = 1.4;
    res.notes.push("A1 Resonance Tier 1: Sturm und Drang hits deal 140% of original DMG");
  }

  // A4 Wind's Vanguard stacks (+7.5% Normal/Charged/Special DMG per stack, max 4 stacks)
  const a4Stacks = val("azure-oath-stacks");
  const a4DmgBonusPct = 7.5 * a4Stacks;
  if (a4Stacks > 0) {
    res.notes.push(`A4 Wind's Vanguard: +${a4DmgBonusPct.toFixed(1)}% DMG Bonus on Normal/Charged/Special attacks (${a4Stacks} stacks)`);
  }

  // C6 CRIT DMG buff (+20% per stack, max 80%)
  if (cons >= 6 && a4Stacks > 0) {
    const c6CritDmgPct = 20 * a4Stacks;
    res.statDeltas.critDmg = (res.statDeltas.critDmg ?? 0) + c6CritDmgPct;
    res.notes.push(`C6: +${c6CritDmgPct}% CRIT DMG (${a4Stacks} Azure Fang's Oath stacks)`);
  }

  // C1 Lyrical Libation multiplier (+100% / 2.0x multiplier)
  const c1Mult = (cons >= 1 && on("lyrical-libation")) ? 2.0 : 1.0;
  if (cons >= 1 && on("lyrical-libation")) {
    res.notes.push("C1 Lyrical Libation: Four Winds' Ascension & Azure Devour deal 200% DMG");
  }

  // C4 Swirl Buff: +20% Anemo & Element DMG
  if (cons >= 4 && on("c4-swirl-buff")) {
    res.statDeltas.anemoDmgBonus = (res.statDeltas.anemoDmgBonus ?? 0) + 20;
    if (rightElement !== "Anemo") {
      const bonusKey = `${rightElement.toLowerCase()}DmgBonus` as keyof DamageStats;
      res.statDeltas[bonusKey] = (res.statDeltas[bonusKey] as number ?? 0) + 20;
    }
    res.notes.push(`C4 Swirl: +20% Anemo & ${rightElement} DMG Bonus`);
  }

  // Regular NA/CA/Plunge element physical & override multipliers (always active)
  const regularKeys = [
    "1-hit", "2-hit-a", "2-hit-b", "3-hit-a", "3-hit-b",
    "4-hit-a", "4-hit-b", "5-hit-a", "5-hit-b",
    "charged-a", "charged-b", "plunge", "low-plunge", "high-plunge"
  ];
  for (const key of regularKeys) {
    addMods(res.perHit, key, {
      element: "Physical",
      baseDmgMultiplier: 1.0,
    });
  }

  // Right hand Sturm und Drang hits: rightElement & baseDmgMult (always active)
  const rightHandKeys = [
    "sd-1-hit", "sd-2-hit-b", "sd-3-hit-b", "sd-4-hit-a", "sd-5-hit-a",
    "sd-charged-a", "azure-devour-a", "four-winds-ascension-a"
  ];
  for (const key of rightHandKeys) {
    addMods(res.perHit, key, {
      element: rightElement,
      baseDmgMultiplier: baseDmgMult,
      bonusDmgPct: a4DmgBonusPct,
    });
  }

  // Left hand Sturm und Drang hits: Anemo & baseDmgMult (always active)
  const leftHandKeys = [
    "sd-2-hit-a", "sd-3-hit-a", "sd-4-hit-b", "sd-5-hit-b",
    "sd-charged-b", "azure-devour-b", "four-winds-ascension-b"
  ];
  for (const key of leftHandKeys) {
    addMods(res.perHit, key, {
      element: "Anemo",
      baseDmgMultiplier: baseDmgMult,
      bonusDmgPct: a4DmgBonusPct,
    });
  }

  // Special skill/burst hits
  // C1 Lyrical Libation multiplier applies on Four Winds and Azure Devour
  // Also Azure Devour deals 2 hits, so we double it
  addMods(res.perHit, "four-winds-ascension-a", {
    element: rightElement,
    baseDmgMultiplier: baseDmgMult * c1Mult,
    bonusDmgPct: a4DmgBonusPct,
  });
  addMods(res.perHit, "four-winds-ascension-b", {
    element: "Anemo",
    baseDmgMultiplier: baseDmgMult * c1Mult,
    bonusDmgPct: a4DmgBonusPct,
  });

  addMods(res.perHit, "azure-devour-a", {
    element: rightElement,
    baseDmgMultiplier: baseDmgMult * c1Mult * 2,
    bonusDmgPct: a4DmgBonusPct,
  });
  addMods(res.perHit, "azure-devour-b", {
    element: "Anemo",
    baseDmgMultiplier: baseDmgMult * c1Mult * 2,
    bonusDmgPct: a4DmgBonusPct,
  });

  // C2 Additional Strike (800% ATK Anemo flat damage)
  const c2Active = cons >= 2;
  addMods(res.perHit, "c2-strike", {
    element: "Anemo",
    baseDmgMultiplier: c2Active ? 1.0 : 0,
  });

  // Elemental Burst elements
  addMods(res.perHit, "burst-1-hit", {
    element: rightElement,
  });
  addMods(res.perHit, "burst-2-hit", {
    element: "Anemo",
  });

  // Regular elemental skill is Anemo DMG, only active if not Sturm (or just standard skill DMG)
  // Actually standard Windbound Execution deals AoE Anemo DMG upon cast, so it's always Anemo.
  addMods(res.perHit, "skill-dmg", {
    element: "Anemo",
  });

  return res;
}

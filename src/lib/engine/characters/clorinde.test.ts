import { describe, it, expect } from "vitest";
import { resolveClorinde } from "./clorinde";
import { clorinde } from "../../../data/registry/characters";
import { ctxFor, baseStats } from "./test-helpers";
import { resolveMechanics } from "../mechanics";

describe("mechanics: Clorinde", () => {
  it("Dark-Shattering Flame: 20% ATK per stack, cap 1800", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { inputs: { "dark-flame-stacks": 3 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBeCloseTo(1200, 0); // 3 × 0.2 × 2000
    const capped = resolveMechanics(clorinde, ctxFor("clorinde", { stats: { ...baseStats, atk: 4000 }, inputs: { "dark-flame-stacks": 3 } }));
    expect(capped.perHit["skill-dmg-x5"].flatDmgBonus).toBe(1800);
  });
  it("C2 upgrades to 30% per stack, cap 2700", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { stats: { ...baseStats, atk: 4000 }, constellationLevel: 2, inputs: { "dark-flame-stacks": 3 } }));
    expect(r.perHit["1-hit"].flatDmgBonus).toBe(2700); // 3 × 0.3 × 4000 = 3600 -> cap
  });
  it("C4: +2% Last Lightfall DMG per 1% BoL, max 200", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { constellationLevel: 4, inputs: { "bond-of-life": 150 } }));
    expect(r.perHit["skill-dmg-x5"].bonusDmgPct).toBe(200); // 300 -> cap
  });
  it("A4 crit stacks and C6 crit buffs", () => {
    const r = resolveMechanics(clorinde, ctxFor("clorinde", { constellationLevel: 6, inputs: { "a4-crit-stacks": 2 } }));
    expect(r.statDeltas.critRate).toBe(30); // 2×10 + C6 10
    expect(r.statDeltas.critDmg).toBe(70);
  });
});

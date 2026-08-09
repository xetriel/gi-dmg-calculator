import { describe, it, expect } from "vitest";
import { resolveTeamBuffs, type SupportInstance } from "./team-buffs";

function makeIneffa(overrides: Partial<SupportInstance> = {}): SupportInstance {
  return {
    supportId: "ineffa-support",
    stats: {
      "atk.base": "700",
      "atk.percent": "40",
      "atk.flat": "1200",
      "critRate": "70",
      "critDmg": "140",
    },
    mechanicInputs: {
      "a4-burst-active": "1",
      "c1-carrier-flow": "1",
    },
    constellationLevel: 1,
    enabled: true,
    ...overrides,
  };
}

// Default Ineffa ATK: 700 * (1 + 40/100) + 1200 = 700 * 1.4 + 1200 = 980 + 1200 = 2180

describe("team-buffs resolver", () => {
  // ── Ineffa EM buff (A4) ──────────────────────────────────────────────
  it("Ineffa A4: EM = 6% of ATK", () => {
    const r = resolveTeamBuffs([makeIneffa()]);
    // ATK = 2180, EM = 0.06 * 2180 = 130.8
    expect(r.statDeltas.em).toBeCloseTo(130.8, 1);
    expect(r.sources.some(s => s.label === "EM (Ineffa A4)" && Math.abs(s.value - 130.8) < 0.1)).toBe(true);
  });

  it("Ineffa A4 off: no EM buff", () => {
    const r = resolveTeamBuffs([makeIneffa({
      mechanicInputs: { "a4-burst-active": "0", "c1-carrier-flow": "1" },
    })]);
    expect(r.statDeltas.em ?? 0).toBe(0);
  });

  // ── Ineffa Lunar Base DMG (Moonsign) ─────────────────────────────────
  it("Ineffa Moonsign: Lunar Base DMG = min(0.7 * ATK/100, 14)", () => {
    const r = resolveTeamBuffs([makeIneffa()]);
    // ATK = 2180, Lunar = min(0.7 * 2180/100, 14) = min(15.26, 14) = 14 (capped)
    expect(r.lunarBaseBonusPct).toBe(14);
  });

  it("Ineffa Moonsign: uncapped with lower ATK", () => {
    const r = resolveTeamBuffs([makeIneffa({
      stats: { "atk.base": "300", "atk.percent": "0", "atk.flat": "0", "critRate": "70", "critDmg": "140" },
    })]);
    // ATK = 300, Lunar = 0.7 * 300/100 = 2.1
    expect(r.lunarBaseBonusPct).toBeCloseTo(2.1, 1);
  });

  // ── Ineffa C1 Lunar-Charged DMG ──────────────────────────────────────
  it("Ineffa C1: Lunar-Charged DMG = min(2.5 * ATK/100, 50)", () => {
    const r = resolveTeamBuffs([makeIneffa()]);
    // ATK = 2180, LC = min(2.5 * 2180/100, 50) = min(54.5, 50) = 50 (capped)
    expect(r.statDeltas.lunarChargedDmgBonus).toBe(50);
  });

  it("Ineffa C1 uncapped with lower ATK", () => {
    const r = resolveTeamBuffs([makeIneffa({
      stats: { "atk.base": "500", "atk.percent": "0", "atk.flat": "0", "critRate": "70", "critDmg": "140" },
    })]);
    // ATK = 500, LC = min(2.5 * 500/100, 50) = min(12.5, 50) = 12.5
    expect(r.statDeltas.lunarChargedDmgBonus).toBeCloseTo(12.5, 1);
  });

  it("Ineffa C0: no C1 buff", () => {
    const r = resolveTeamBuffs([makeIneffa({ constellationLevel: 0 })]);
    expect(r.statDeltas.lunarChargedDmgBonus ?? 0).toBe(0);
  });

  it("Ineffa C1 toggle off: no C1 buff", () => {
    const r = resolveTeamBuffs([makeIneffa({
      mechanicInputs: { "a4-burst-active": "1", "c1-carrier-flow": "0" },
    })]);
    expect(r.statDeltas.lunarChargedDmgBonus ?? 0).toBe(0);
  });

  // ── Toggle behavior ──────────────────────────────────────────────────
  it("per-support disabled: no buffs from that support", () => {
    const r = resolveTeamBuffs([makeIneffa({ enabled: false })]);
    expect(r.statDeltas.em ?? 0).toBe(0);
    expect(r.lunarBaseBonusPct).toBe(0);
    expect(r.sources).toHaveLength(0);
  });

  it("master disabled: no buffs at all", () => {
    const r = resolveTeamBuffs([makeIneffa()], false);
    expect(r.statDeltas.em ?? 0).toBe(0);
    expect(r.lunarBaseBonusPct).toBe(0);
    expect(r.sources).toHaveLength(0);
  });

  // ── Edge cases ────────────────────────────────────────────────────────
  it("ATK = 0: all buffs are 0", () => {
    const r = resolveTeamBuffs([makeIneffa({
      stats: { "atk.base": "0", "atk.percent": "0", "atk.flat": "0", "critRate": "0", "critDmg": "0" },
    })]);
    expect(r.statDeltas.em ?? 0).toBe(0);
    expect(r.lunarBaseBonusPct).toBe(0);
    expect(r.statDeltas.lunarChargedDmgBonus ?? 0).toBe(0);
  });

  it("empty supports array: zero result", () => {
    const r = resolveTeamBuffs([]);
    expect(r.statDeltas).toEqual({});
    expect(r.lunarBaseBonusPct).toBe(0);
    expect(r.sources).toHaveLength(0);
  });

  // ── Multiple supports stacking ────────────────────────────────────────
  it("two Ineffa supports stack additively", () => {
    const ineffa1 = makeIneffa({
      stats: { "atk.base": "500", "atk.percent": "0", "atk.flat": "0", "critRate": "70", "critDmg": "140" },
    });
    const ineffa2 = makeIneffa({
      stats: { "atk.base": "600", "atk.percent": "0", "atk.flat": "0", "critRate": "80", "critDmg": "160" },
    });
    const r = resolveTeamBuffs([ineffa1, ineffa2]);

    // EM: 0.06 * 500 + 0.06 * 600 = 30 + 36 = 66
    expect(r.statDeltas.em).toBeCloseTo(66, 1);

    // Lunar Base: min(0.7*5,14) + min(0.7*6,14) = 3.5 + 4.2 = 7.7
    expect(r.lunarBaseBonusPct).toBeCloseTo(7.7, 1);

    // Lunar-Charged DMG: min(2.5*5,50) + min(2.5*6,50) = 12.5 + 15 = 27.5
    expect(r.statDeltas.lunarChargedDmgBonus).toBeCloseTo(27.5, 1);

    // Team CRIT: average of (70,80) = 75, (140,160) = 150
    expect(r.teamCrit.critRate).toBe(75);
    expect(r.teamCrit.critDmg).toBe(150);
  });

  // ── Source attribution ────────────────────────────────────────────────
  it("sources correctly attributed", () => {
    const r = resolveTeamBuffs([makeIneffa()]);
    // Should have: EM (A4), Lunar-Charged DMG (C1), Lunar Base DMG (Moonsign)
    expect(r.sources.length).toBe(3);
    expect(r.sources.some(s => s.supportName === "Ineffa" && s.stat === "em")).toBe(true);
    expect(r.sources.some(s => s.supportName === "Ineffa" && s.stat === "lunarChargedDmgBonus")).toBe(true);
    expect(r.sources.some(s => s.supportName === "Ineffa" && s.stat === "lunarBaseBonusPct")).toBe(true);
  });

  // ── Team CRIT passthrough ─────────────────────────────────────────────
  it("team CRIT reflects support CRIT stats", () => {
    const r = resolveTeamBuffs([makeIneffa()]);
    expect(r.teamCrit.critRate).toBe(70);
    expect(r.teamCrit.critDmg).toBe(140);
  });
});

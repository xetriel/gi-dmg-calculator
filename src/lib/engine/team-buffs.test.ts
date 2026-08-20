import { describe, it, expect } from "vitest";
import { resolveTeamBuffs, resolveSupportCtx, type SupportInstance } from "./team-buffs";
import { supportById } from "../../data/registry/characters";

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

  // ── Bennett Support Tests ─────────────────────────────────────────────
  function makeBennett(overrides: Partial<SupportInstance> = {}): SupportInstance {
    return {
      supportId: "bennett-support",
      stats: {
        baseAtk: "800",
        critRate: "60",
        critDmg: "120",
      },
      mechanicInputs: {
        "fantastic-voyage-active": "1",
        "c6-pyro-bonus": "1",
      },
      constellationLevel: 1,
      enabled: true,
      ...overrides,
    };
  }

  it("Bennett C0: ATK = 100.8% of Base ATK at Lv10", () => {
    const r = resolveTeamBuffs([makeBennett({ constellationLevel: 0 })]);
    // 100.8% * 800 = 806.4
    expect(r.statDeltas.atk).toBeCloseTo(806.4, 1);
    expect(r.sources.some(s => s.supportName === "Bennett" && s.stat === "atk" && Math.abs(s.value - 806.4) < 0.1)).toBe(true);
  });

  it("Bennett C1: ATK = 120.8% of Base ATK at Lv10", () => {
    const r = resolveTeamBuffs([makeBennett({ constellationLevel: 1 })]);
    // (100.8% + 20%) * 800 = 120.8% * 800 = 966.4
    expect(r.statDeltas.atk).toBeCloseTo(966.4, 1);
  });

  it("Bennett C5: ATK = 139.0% of Base ATK at Lv13 (with C1)", () => {
    const r = resolveTeamBuffs([makeBennett({ constellationLevel: 5 })]);
    // (119.0% + 20%) * 800 = 139.0% * 800 = 1112.0
    expect(r.statDeltas.atk).toBeCloseTo(1112.0, 1);
  });

  it("Bennett Fantastic Voyage toggle off: no ATK buff", () => {
    const r = resolveTeamBuffs([makeBennett({
      mechanicInputs: { "fantastic-voyage-active": "0", "c6-pyro-bonus": "1" },
    })]);
    expect(r.statDeltas.atk ?? 0).toBe(0);
  });

  it("Bennett C6: grants 15% Pyro DMG Bonus", () => {
    const r = resolveTeamBuffs([makeBennett({ constellationLevel: 6 })]);
    expect(r.statDeltas.pyroDmgBonus).toBe(15);
    expect(r.sources.some(s => s.supportName === "Bennett" && s.stat === "pyroDmgBonus" && s.value === 15)).toBe(true);
  });

  it("Bennett C6 toggle off: no Pyro DMG Bonus", () => {
    const r = resolveTeamBuffs([makeBennett({
      constellationLevel: 6,
      mechanicInputs: { "fantastic-voyage-active": "1", "c6-pyro-bonus": "0" },
    })]);
    expect(r.statDeltas.pyroDmgBonus ?? 0).toBe(0);
  });

  it("Bennett C5 (below C6): no Pyro DMG Bonus", () => {
    const r = resolveTeamBuffs([makeBennett({ constellationLevel: 5 })]);
    expect(r.statDeltas.pyroDmgBonus ?? 0).toBe(0);
  });

  it("Bennett Base ATK = 0: ATK buff is 0", () => {
    const r = resolveTeamBuffs([makeBennett({
      stats: { baseAtk: "0", critRate: "0", critDmg: "0" },
    })]);
    expect(r.statDeltas.atk ?? 0).toBe(0);
  });

  it("Bennett + Ineffa stack together additively", () => {
    const bennett = makeBennett({ constellationLevel: 1 }); // 966.4 ATK, 60 CR, 120 CD
    const ineffa = makeIneffa(); // 130.8 EM, 14 Lunar Base, 50 LC, 70 CR, 140 CD
    const r = resolveTeamBuffs([bennett, ineffa]);

    expect(r.statDeltas.atk).toBeCloseTo(966.4, 1);
    expect(r.statDeltas.em).toBeCloseTo(130.8, 1);
    expect(r.lunarBaseBonusPct).toBe(14);
    expect(r.statDeltas.lunarChargedDmgBonus).toBe(50);
    // Team CRIT: average of (60, 70) = 65, (120, 140) = 130
    expect(r.teamCrit.critRate).toBe(65);
    expect(r.teamCrit.critDmg).toBe(130);
  });
});

// ── Remastered: resolveSupportCtx export & formatBriefStats ─────────────
describe("remastered support system", () => {
  it("resolveSupportCtx is exported and resolves full stat dictionaries", () => {
    expect(typeof resolveSupportCtx).toBe("function");

    // Full stat dictionary from character calculator (has atk.base, atk.percent, atk.flat)
    const inst: SupportInstance = {
      supportId: "ineffa-support",
      stats: {
        "atk.base": "900",
        "atk.percent": "50",
        "atk.flat": "500",
        critRate: "80",
        critDmg: "200",
      },
      mechanicInputs: { "a4-burst-active": "1", "c1-carrier-flow": "0" },
      constellationLevel: 0,
      enabled: true,
    };

    const ctx = resolveSupportCtx(inst);
    expect(ctx).not.toBeNull();
    // ATK = 900 * (1 + 50/100) + 500 = 1350 + 500 = 1850
    expect(ctx!.atk).toBeCloseTo(1850, 1);
    expect(ctx!.baseAtk).toBe(900);
    expect(ctx!.critRate).toBe(80);
    expect(ctx!.critDmg).toBe(200);
  });

  it("SupportInstance supports selectedSetupId and selectedSetupName", () => {
    const inst: SupportInstance = {
      supportId: "ineffa-support",
      stats: { "atk.base": "700", "atk.percent": "0", "atk.flat": "0", critRate: "70", critDmg: "140" },
      mechanicInputs: { "a4-burst-active": "1" },
      constellationLevel: 0,
      enabled: true,
      selectedSetupId: "2",
      selectedSetupName: "Setup 2",
      sourceBuildId: "build-abc",
      sourceBuildName: "My Build",
    };

    // Fields exist and hold values
    expect(inst.selectedSetupId).toBe("2");
    expect(inst.selectedSetupName).toBe("Setup 2");
    expect(inst.sourceBuildId).toBe("build-abc");
    expect(inst.sourceBuildName).toBe("My Build");

    // Engine still resolves buffs correctly
    const r = resolveTeamBuffs([inst]);
    // ATK = 700 * 1 + 0 = 700, EM = 0.06 * 700 = 42
    expect(r.statDeltas.em).toBeCloseTo(42, 1);
  });

  it("formatBriefStats produces pills for Ineffa", () => {
    const config = supportById("ineffa-support");
    expect(config).toBeDefined();
    expect(typeof config?.formatBriefStats).toBe("function");

    const inst: SupportInstance = {
      supportId: "ineffa-support",
      stats: { "atk.base": "700", "atk.percent": "40", "atk.flat": "1200", critRate: "70", critDmg: "140" },
      mechanicInputs: {},
      constellationLevel: 0,
      enabled: true,
    };

    const ctx = resolveSupportCtx(inst);
    const pills = config!.formatBriefStats!(ctx!);
    expect(pills.length).toBeGreaterThanOrEqual(2);
    expect(pills[0].label).toBe("Total ATK");
    expect(pills[0].value).toContain("2,180");
    expect(pills[1].label).toBe("CRIT");
  });

  it("formatBriefStats produces pills for Bennett", () => {
    const config = supportById("bennett-support");
    expect(config).toBeDefined();
    expect(typeof config?.formatBriefStats).toBe("function");

    const inst: SupportInstance = {
      supportId: "bennett-support",
      stats: { baseAtk: "800", critRate: "60", critDmg: "120" },
      mechanicInputs: {},
      constellationLevel: 0,
      enabled: true,
    };

    const ctx = resolveSupportCtx(inst);
    const pills = config!.formatBriefStats!(ctx!);
    expect(pills.length).toBeGreaterThanOrEqual(2);
    expect(pills[0].label).toBe("Base ATK");
    expect(pills[0].value).toBe("800");
    expect(pills[1].label).toBe("CRIT");
  });
});

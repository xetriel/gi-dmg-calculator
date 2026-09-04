import { describe, it, expect } from "vitest";
import { resolveTeamBuffs, resolveSupportCtx, type SupportInstance } from "./team-buffs";
import { supportById, byId, SUPPORT_CONFIGS, CHARACTERS } from "../../data/registry/characters";

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

  it("Bennett C5 with stats from character calculator (atk.base = 865): ATK buff = ~1202.4", () => {
    const r = resolveTeamBuffs([
      {
        supportId: "bennett-support",
        stats: {
          "atk.base": "865",
          "atk.percent": "0",
          "atk.flat": "0",
          critRate: "60",
          critDmg: "120",
        },
        mechanicInputs: {
          "fantastic-voyage-active": "1",
        },
        constellationLevel: 5,
        enabled: true,
      },
    ]);
    // 865 * (119% + 20%) = 865 * 139% = 1202.35
    expect(r.statDeltas.atk).toBeCloseTo(1202.35, 1);
    expect(r.sources.some(s => s.supportName === "Bennett" && s.stat === "atk" && Math.abs(s.value - 1202.35) < 0.1)).toBe(true);
  });

  it("Bennett C5 with talentLevels burst = 13 and atk.base = 865 resolves full buff", () => {
    const r = resolveTeamBuffs([
      {
        supportId: "bennett-support",
        stats: {
          "atk.base": "865",
          "atk.percent": "0",
          "atk.flat": "0",
          critRate: "60",
          critDmg: "120",
        },
        mechanicInputs: {
          "fantastic-voyage-active": "1",
        },
        constellationLevel: 5,
        talentLevels: { burst: "13" },
        enabled: true,
      },
    ]);
    expect(r.statDeltas.atk).toBeCloseTo(1202.35, 1);
  });

  it("Bennett C5 with base talentLevels burst = 10 automatically adds +3 -> Lv13 (139% total ratio) = ~1202.4 ATK", () => {
    const r = resolveTeamBuffs([
      {
        supportId: "bennett-support",
        stats: {
          "atk.base": "865",
          "atk.percent": "0",
          "atk.flat": "0",
          critRate: "60",
          critDmg: "120",
        },
        mechanicInputs: {
          "fantastic-voyage-active": "1",
        },
        constellationLevel: 5,
        talentLevels: { burst: "10" },
        enabled: true,
      },
    ]);
    // 865 * (119% [Lv13 from 10+3] + 20% [C1]) = 865 * 139% = 1202.35
    expect(r.statDeltas.atk).toBeCloseTo(1202.35, 1);
  });

  it("Bennett C2 with base talentLevels burst = 10 stays at Lv10 (120.8% total ratio) = ~1044.9 ATK", () => {
    const r = resolveTeamBuffs([
      {
        supportId: "bennett-support",
        stats: {
          "atk.base": "865",
          "atk.percent": "0",
          "atk.flat": "0",
          critRate: "60",
          critDmg: "120",
        },
        mechanicInputs: {
          "fantastic-voyage-active": "1",
        },
        constellationLevel: 2,
        talentLevels: { burst: "10" },
        enabled: true,
      },
    ]);
    // 865 * (100.8% [Lv10] + 20% [C1]) = 865 * 120.8% = 1044.92
    expect(r.statDeltas.atk).toBeCloseTo(1044.92, 1);
  });

  it("Bennett C0 with base talentLevels burst = 10 (100.8% total ratio, no C1) = ~871.9 ATK", () => {
    const r = resolveTeamBuffs([
      {
        supportId: "bennett-support",
        stats: {
          "atk.base": "865",
          "atk.percent": "0",
          "atk.flat": "0",
          critRate: "60",
          critDmg: "120",
        },
        mechanicInputs: {
          "fantastic-voyage-active": "1",
        },
        constellationLevel: 0,
        talentLevels: { burst: "10" },
        enabled: true,
      },
    ]);
    // 865 * 100.8% = 871.92
    expect(r.statDeltas.atk).toBeCloseTo(871.92, 1);
  });

  it("Bennett formatBriefStats with atk.base = 865 produces Base ATK: 865", () => {
    const config = supportById("bennett-support");
    expect(config).toBeDefined();

    const inst: SupportInstance = {
      supportId: "bennett-support",
      stats: { "atk.base": "865", "atk.percent": "0", "atk.flat": "0", critRate: "60", critDmg: "120" },
      mechanicInputs: {},
      constellationLevel: 5,
      enabled: true,
    };

    const ctx = resolveSupportCtx(inst);
    expect(ctx).not.toBeNull();
    expect(ctx!.baseAtk).toBe(865);
    const pills = config!.formatBriefStats!(ctx!);
    expect(pills[0].label).toBe("Base ATK");
    expect(pills[0].value).toBe("865");
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

  describe("RSC serialization safety (Next.js Server -> Client boundary)", () => {
    it("byId(bennett) has no functions and is 100% JSON-serializable", () => {
      const char = byId("bennett");
      expect(char).toBeDefined();
      // Must not have function-bearing support property
      expect((char as unknown as Record<string, unknown>).support).toBeUndefined();

      // Deep serialization check: must serialize without errors
      const serialized = JSON.stringify(char);
      expect(serialized).toBeDefined();
      const parsed = JSON.parse(serialized);
      expect(parsed.id).toBe("bennett");

      // Verify no remaining functions on any key
      for (const [k, v] of Object.entries(char!)) {
        expect(typeof v).not.toBe("function");
      }
    });

    it("byId(ineffa) has no functions and is 100% JSON-serializable", () => {
      const char = byId("ineffa");
      expect(char).toBeDefined();
      expect((char as unknown as Record<string, unknown>).support).toBeUndefined();

      const serialized = JSON.stringify(char);
      expect(serialized).toBeDefined();
      const parsed = JSON.parse(serialized);
      expect(parsed.id).toBe("ineffa");

      for (const [k, v] of Object.entries(char!)) {
        expect(typeof v).not.toBe("function");
      }
    });

    it("supportById retains all functions and calculation logic for client/engine usage", () => {
      const bennettSupport = supportById("bennett");
      expect(bennettSupport).toBeDefined();
      expect(bennettSupport?.buffs.length).toBeGreaterThan(0);
      expect(typeof bennettSupport?.buffs[0].compute).toBe("function");
      expect(typeof bennettSupport?.formatBriefStats).toBe("function");

      const ineffaSupport = supportById("ineffa");
      expect(ineffaSupport).toBeDefined();
      expect(ineffaSupport?.buffs.length).toBeGreaterThan(0);
      expect(typeof ineffaSupport?.buffs[0].compute).toBe("function");
      expect(typeof ineffaSupport?.lunarBaseBonusCompute).toBe("function");
      expect(typeof ineffaSupport?.formatBriefStats).toBe("function");
    });

    it("all 46 characters in CHARACTERS are clean and 100% JSON-serializable", () => {
      expect(CHARACTERS.length).toBe(46);
      for (const char of CHARACTERS) {
        expect((char as unknown as Record<string, unknown>).support).toBeUndefined();
        const serialized = JSON.stringify(char);
        expect(serialized).toBeDefined();
        const parsed = JSON.parse(serialized);
        expect(parsed.id).toBe(char.id);
      }
    });
  });

  // ── 46-Character Support Roster Coverage ────────────────────────────────
  describe("46-Character Support Roster Completeness & Mechanics", () => {
    it("has exactly 46 support characters registered", () => {
      expect(SUPPORT_CONFIGS.length).toBe(46);
      for (const char of CHARACTERS) {
        const sup = supportById(char.id);
        expect(sup, `Missing support for ${char.id}`).toBeDefined();
        expect(sup?.name).toBe(char.name);
        expect(sup?.statFields?.length).toBeGreaterThanOrEqual(1);
        expect(typeof sup?.formatBriefStats).toBe("function");
      }
    });

    it("Columbina: Moonsign Base DMG, C2 HP-share, C6 CRIT DMG", () => {
      const sup = supportById("columbina");
      expect(sup).toBeDefined();
      const inst: SupportInstance = {
        supportId: "columbina-support",
        stats: { hp: "40000", critRate: "70", critDmg: "180" },
        mechanicInputs: { "lunar-brilliance": "1", "c6-crit-dmg-buff": "1" },
        constellationLevel: 6,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      // Moonsign: min(7, (40000 / 1000) * 0.2) = min(7, 8) = 7
      expect(res.lunarBaseBonusPct).toBe(7);
      // C2: (40000 / 100) * 0.15 = 60 ATK
      expect(res.statDeltas.atk).toBe(60);
      // C6: +80% CRIT DMG in Lunar Domain
      expect(res.statDeltas.critDmg).toBe(80);
      // C6 total elevation: 1.5 + 7.0 + 1.5 + 7.0 = 17.0%
      expect(res.statDeltas.lunarChargedElevation).toBe(17);
    });

    it("Mavuika: Kiongozi DMG + C2 DEF shred", () => {
      const inst: SupportInstance = {
        supportId: "mavuika-support",
        stats: { baseAtk: "900", critRate: "70", critDmg: "180" },
        mechanicInputs: { "burst-kiongozi": "1", "c2-def-shred": "1" },
        constellationLevel: 2,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      expect(res.statDeltas.dmgBonus).toBe(40);
      expect(res.statDeltas.defReduction).toBe(20);
    });

    it("Zibai: Moonsign Lunar Base DMG + C2 Reaction DMG", () => {
      const inst: SupportInstance = {
        supportId: "zibai-support",
        stats: { def: "2000", critRate: "60", critDmg: "140" },
        mechanicInputs: { "c2-reaction-dmg": "1" },
        constellationLevel: 2,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      // Moonsign: min(14, (2000 / 100) * 0.7) = 14
      expect(res.lunarBaseBonusPct).toBe(14);
      expect(res.statDeltas.lunarCrystallizeDmgBonus).toBe(30);
    });

    it("Klee: C2 DEF shred + C6 Pyro DMG", () => {
      const inst: SupportInstance = {
        supportId: "klee-support",
        stats: { baseAtk: "800", critRate: "60", critDmg: "120" },
        mechanicInputs: { "c2-def-shred": "1", "c6-pyro-buff": "1" },
        constellationLevel: 6,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      expect(res.statDeltas.defReduction).toBe(23);
      expect(res.statDeltas.pyroDmgBonus).toBe(10);
    });

    it("Hu Tao: A1 CRIT Rate", () => {
      const inst: SupportInstance = {
        supportId: "hu-tao-support",
        stats: { hp: "32000", critRate: "60", critDmg: "120" },
        mechanicInputs: { "a1-flutter-by": "1" },
        constellationLevel: 0,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      expect(res.statDeltas.critRate).toBe(12);
    });

    it("Ayaka: C4 DEF shred", () => {
      const inst: SupportInstance = {
        supportId: "ayaka-support",
        stats: { baseAtk: "800", critRate: "60", critDmg: "200" },
        mechanicInputs: {},
        constellationLevel: 4,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      expect(res.statDeltas.defReduction).toBe(30);
    });

    it("Eula: Icetide Vortex Hold Phys/Cryo RES shred", () => {
      const inst: SupportInstance = {
        supportId: "eula-support",
        stats: { baseAtk: "900", critRate: "60", critDmg: "160" },
        mechanicInputs: {},
        constellationLevel: 0,
        talentLevels: { skill: "10" },
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      // Lv 10: -(15 + 10) = -25
      expect(res.statDeltas.enemyRes).toBe(-25);
    });

    it("Aloy: A1 Combat Override party ATK%", () => {
      const inst: SupportInstance = {
        supportId: "aloy-support",
        stats: { baseAtk: "700", critRate: "60", critDmg: "120" },
        mechanicInputs: { "a1-combat-override": "1" },
        constellationLevel: 0,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      expect(res.statDeltas.atk).toBe(56);
    });

    it("Durin: A1 RES shred & C6 DEF shred", () => {
      const inst: SupportInstance = {
        supportId: "durin-support",
        stats: { baseAtk: "800", critRate: "60", critDmg: "140" },
        mechanicInputs: { "purity-res-shred": "1", "hexerei-party-members": "1", "c6-def-shred": "1" },
        constellationLevel: 6,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      expect(res.statDeltas.enemyRes).toBe(-35);
      expect(res.statDeltas.defReduction).toBe(30);
    });

    it("Dendro MC: A1 EM + C6 Dendro DMG", () => {
      const inst: SupportInstance = {
        supportId: "traveler-dendro-support",
        stats: { baseAtk: "700", critRate: "60", critDmg: "120" },
        mechanicInputs: { "a1-lotus-light-stacks": "10", "c6-dendro-buff": "1" },
        constellationLevel: 6,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      expect(res.statDeltas.em).toBe(60);
      expect(res.statDeltas.dendroDmgBonus).toBe(12);
    });

    it("Cryo MC: Stellar Base DMG + C2 EM + C6 Stellar reaction DMG", () => {
      const inst: SupportInstance = {
        supportId: "traveler-cryo-support",
        stats: { "atk.base": "800", "atk.percent": "100", "atk.flat": "400", critRate: "60", critDmg: "120" },
        mechanicInputs: { "c2-stellar-em": "1", "frostglow-stacks": "8" },
        constellationLevel: 6,
        enabled: true,
      };
      const res = resolveTeamBuffs([inst]);
      // ATK = 800 * 2 + 400 = 2000
      // Stellar Base = min(14, 20 * 0.7) = 14
      expect(res.lunarBaseBonusPct).toBe(14);
      expect(res.statDeltas.em).toBe(120);
      expect(res.statDeltas.stellarGlimmerDmgBonus).toBe(40);
    });

    it("Pure Hypercarries (Arlecchino, Xiao, Cyno, etc.) resolve with 0 buffs and non-throwing formatBriefStats", () => {
      const hypercarries = [
        "arlecchino", "diluc", "xiao", "cyno", "clorinde",
        "neuvillette", "gaming", "keqing", "mualani", "alhaitham", "varesa",
      ];
      for (const hid of hypercarries) {
        const sup = supportById(hid);
        expect(sup, `Missing support for ${hid}`).toBeDefined();
        expect(sup?.buffs).toHaveLength(0);

        const inst: SupportInstance = {
          supportId: `${hid}-support`,
          stats: { baseAtk: "800", hp: "30000", em: "100", critRate: "60", critDmg: "120" },
          mechanicInputs: {},
          constellationLevel: 0,
          enabled: true,
        };

        const res = resolveTeamBuffs([inst]);
        expect(res.sources).toHaveLength(0);

        const ctx = resolveSupportCtx(inst);
        expect(ctx).toBeDefined();
        const pills = sup!.formatBriefStats!(ctx!);
        expect(pills.length).toBeGreaterThanOrEqual(2);
      }
    });
  });
});

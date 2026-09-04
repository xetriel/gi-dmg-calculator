import { describe, it, expect } from "vitest";
import { resolveAllEffectiveStats, EFFECTIVE_ROW_DEFINITIONS } from "./effective-stats";
import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { CalcInstance } from "@/components/calculator/types";
import type { DamageStats } from "./damage";

const dummyConfig: CharacterConfig = {
  id: "test-ineffa",
  name: "Ineffa",
  element: "Electro",
  weapon: "Polearm",
  scalingSource: "atk",
  ascensionStat: { label: "CRIT Rate%", maxValue: 19.2 },
  dmgBonusLabel: "Electro DMG Bonus%",
  rarity: 5,
  stats: [
    { key: "atk", label: "ATK", unit: "flat", group: "base" },
    { key: "em", label: "Elemental Mastery", unit: "flat", group: "base" },
  ],
  talents: [],
  constellations: [
    {
      level: 1,
      name: "C1 Test",
      description: "+25% Lunar-Charged Elevation",
      effects: [
        {
          type: "stat_bonus",
          statKey: "lunarChargedElevation",
          statValue: 25,
        },
      ],
    },
  ],
};

const dummyScaling: TalentScalingData = {};

const defaultInputStats: DamageStats = {
  atk: 1000,
  hp: 20000,
  def: 800,
  em: 200,
  critRate: 50,
  critDmg: 100,
  energyRecharge: 100,
  healingBonus: 0,
  dmgBonus: 0,
  normalDmgBonus: 0,
  chargedDmgBonus: 0,
  plungeDmgBonus: 0,
  skillDmgBonus: 0,
  burstDmgBonus: 0,
  pyroDmgBonus: 0,
  hydroDmgBonus: 0,
  dendroDmgBonus: 0,
  electroDmgBonus: 0,
  anemoDmgBonus: 0,
  cryoDmgBonus: 0,
  geoDmgBonus: 0,
  physicalDmgBonus: 0,
  lunarChargedElevation: 0,
  lunarBloomElevation: 0,
  lunarCrystallizeElevation: 0,
  lunarChargedDmgBonus: 0,
  stellarSwirlDmgBonus: 0,
  stellarGlimmerDmgBonus: 0,
  dmgReduction: 0,
  enemyRes: 10,
  levelChar: 90,
  levelEnemy: 90,
  defReduction: 0,
  defIgnore: 0,
};

describe("resolveAllEffectiveStats", () => {
  it("includes all core definitions and resolves basic attributes", () => {
    const inst: CalcInstance = {
      id: "setup-1",
      stats: { "atk.base": "800", "atk.flat": "200" },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: {},
      reaction: "none",
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
    };

    const breakdowns = resolveAllEffectiveStats(dummyConfig, dummyScaling, inst, defaultInputStats, defaultInputStats);
    
    expect(breakdowns.length).toBeGreaterThan(0);
    const atkRow = breakdowns.find(b => b.key === "atk");
    expect(atkRow).toBeDefined();
    expect(atkRow?.raw).toBe(1000);
    expect(atkRow?.total).toBe(1000);
    expect(atkRow?.hasExternalBuffs).toBe(false);
  });

  it("detects constellation additions and leaves hasExternalBuffs false", () => {
    const inst: CalcInstance = {
      id: "setup-1",
      stats: {},
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: {},
      reaction: "none",
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 1, // C1 gives +25% lunarChargedElevation
    };

    const effectiveWithC1: DamageStats = {
      ...defaultInputStats,
      lunarChargedElevation: 25,
    };

    const breakdowns = resolveAllEffectiveStats(dummyConfig, dummyScaling, inst, defaultInputStats, effectiveWithC1);
    const elevationRow = breakdowns.find(b => b.key === "lunarChargedElevation");
    expect(elevationRow).toBeDefined();
    expect(elevationRow?.total).toBe(25);
    expect(elevationRow?.additions.some(a => a.source.includes("C1"))).toBe(true);
    expect(elevationRow?.hasExternalBuffs).toBe(false);
  });

  it("identifies external team support buffs and flags hasExternalBuffs: true with rarity", () => {
    const inst: CalcInstance = {
      id: "setup-1",
      stats: {},
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: {},
      reaction: "none",
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
      teamBuffsEnabled: true,
      teamSupports: [
        {
          supportId: "bennett",
          enabled: true,
          stats: { "atk.base": "865" },
          constellationLevel: 5,
          talentLevels: { burst: "13" },
          mechanicInputs: {},
        },
      ],
    };

    const effectiveWithBennett: DamageStats = {
      ...defaultInputStats,
      atk: 1000 + 1202.35,
    };

    const breakdowns = resolveAllEffectiveStats(dummyConfig, dummyScaling, inst, defaultInputStats, effectiveWithBennett);
    const atkRow = breakdowns.find(b => b.key === "atk");
    expect(atkRow).toBeDefined();
    expect(atkRow?.hasExternalBuffs).toBe(true);
    const externalAddition = atkRow?.additions.find(a => a.type === "external");
    expect(externalAddition).toBeDefined();
    expect(externalAddition?.source).toContain("Bennett");
    expect(externalAddition?.category).toBe("team");
    expect(externalAddition?.rarity).toBe(4); // Bennett is 4-star
  });

  it("identifies external weapon buffs and external artifact buffs", () => {
    const inst: CalcInstance = {
      id: "setup-1",
      stats: { "atk.base": "800" },
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: {},
      reaction: "none",
      reactionBonus: "0",
      reactionPanelBonus: "0",
      lunarBaseBonus: "0",
      constellationLevel: 0,
      externalWeaponBuffsEnabled: true,
      externalWeapons: [
        {
          id: "w1",
          weaponId: "a-thousand-floating-dreams",
          refinement: 1,
          enabled: true,
        },
      ],
      externalArtifactBuffsEnabled: true,
      externalArtifacts: [
        {
          id: "a1",
          artifactId: "noblesse-oblige",
          pieceCount: 4,
          slot: "support",
          enabled: true,
        },
      ],
    };

    const effectiveWithBuffs: DamageStats = {
      ...defaultInputStats,
      em: defaultInputStats.em + 40,
      atk: defaultInputStats.atk + 160,
    };

    const breakdowns = resolveAllEffectiveStats(dummyConfig, dummyScaling, inst, defaultInputStats, effectiveWithBuffs);
    
    // Check EM row for Floating Dreams weapon buff
    const emRow = breakdowns.find(b => b.key === "em");
    expect(emRow).toBeDefined();
    expect(emRow?.hasExternalBuffs).toBe(true);
    const weaponAdd = emRow?.additions.find(a => a.category === "weapon");
    expect(weaponAdd).toBeDefined();
    expect(weaponAdd?.source).toContain("A Thousand Floating Dreams");
    expect(weaponAdd?.rarity).toBe(5); // 5-star weapon

    // Check ATK row for Noblesse artifact buff
    const atkRow = breakdowns.find(b => b.key === "atk");
    expect(atkRow).toBeDefined();
    expect(atkRow?.hasExternalBuffs).toBe(true);
    const artifactAdd = atkRow?.additions.find(a => a.category === "artifact");
    expect(artifactAdd).toBeDefined();
    expect(artifactAdd?.source).toContain("Noblesse Oblige");
    expect(artifactAdd?.rarity).toBe(5); // 5-star artifact
  });

  it("computes transformative reaction bonus and reaction multipliers properly", () => {
    const inst: CalcInstance = {
      id: "setup-1",
      stats: {},
      hits: {},
      levels: { normal: "10", skill: "10", burst: "10" },
      mechanicInputs: {},
      reaction: "none",
      reactionBonus: "15",
      reactionPanelBonus: "20",
      lunarBaseBonus: "10",
      constellationLevel: 0,
    };

    const breakdowns = resolveAllEffectiveStats(dummyConfig, dummyScaling, inst, defaultInputStats, defaultInputStats);
    
    const transRow = breakdowns.find(b => b.key === "transformativeBonus");
    expect(transRow).toBeDefined();
    expect(transRow?.total).toBeGreaterThan(0);

    const lunarBaseRow = breakdowns.find(b => b.key === "lunarBaseBonus");
    expect(lunarBaseRow).toBeDefined();
    expect(lunarBaseRow?.total).toBe(10);
  });
});

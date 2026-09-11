import { describe, it, expect, beforeEach } from "vitest";
import {
  getDefaultEquipmentSetup,
  getSupportEquipmentSetups,
  saveSupportEquipmentSetup,
  deleteSupportEquipmentSetup,
  resolveSupportEquipmentBuffs,
  getActiveSupportEquippedWeapons,
  getActiveSupportEquippedArtifacts,
  type SupportEquipmentSetup,
} from "./support-equipment";
import { resolveTeamBuffs, type SupportInstance } from "./team-buffs";
import { resolveExternalArtifactBuffs } from "./artifact-buffs";
import { resolveExternalWeaponBuffs } from "./weapon-buffs";
import { byId as characterById } from "../../data/registry/characters";

describe("Support Character Equipment System", () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  describe("Default Presets & Persistence", () => {
    it("provides canonical default presets for popular support characters", () => {
      const xilonenDef = getDefaultEquipmentSetup("xilonen");
      expect(xilonenDef.characterId).toBe("xilonen");
      expect(xilonenDef.weapon?.weaponId).toBe("peak-patrol-song");
      expect(xilonenDef.artifact?.artifactId).toBe("scroll-of-the-hero-of-cinder-city");
      expect(xilonenDef.artifact?.pieceCount).toBe(4);

      const bennettDef = getDefaultEquipmentSetup("bennett");
      expect(bennettDef.characterId).toBe("bennett");
      expect(bennettDef.weapon?.weaponId).toBe("freedom-sworn");
      expect(bennettDef.artifact?.artifactId).toBe("noblesse-oblige");
    });

    it("saves and retrieves setups per character in localStorage", () => {
      const setup: SupportEquipmentSetup = {
        id: "test-setup-1",
        name: "Custom Support Bennett",
        characterId: "bennett",
        weapon: {
          weaponId: "sapwood-blade",
          refinement: 5,
          enabled: true,
        },
        artifact: {
          artifactId: "instructor",
          pieceCount: 4,
          inputs: { "instructor-reaction": "1" },
          enabled: true,
        },
      };

      saveSupportEquipmentSetup("bennett", setup);
      const retrieved = getSupportEquipmentSetups("bennett");
      expect(retrieved.length).toBeGreaterThanOrEqual(1);
      const found = retrieved.find((s) => s.id === "test-setup-1");
      expect(found).toBeDefined();
      expect(found?.name).toBe("Custom Support Bennett");
      expect(found?.weapon?.weaponId).toBe("sapwood-blade");
      expect(found?.artifact?.artifactId).toBe("instructor");

      // Delete setup
      deleteSupportEquipmentSetup("bennett", "test-setup-1");
      const afterDelete = getSupportEquipmentSetups("bennett");
      expect(afterDelete.find((s) => s.id === "test-setup-1")).toBeUndefined();
    });
  });

  describe("Active Supporting Character Scaling Buff Resolution", () => {
    it("scales Peak Patrol Song party DMG bonus off the support character's DEF", () => {
      // Xilonen with 3,200 DEF equipping Peak Patrol Song (R1: 8% per 1,000 DEF, max 25.6%)
      const res = resolveSupportEquipmentBuffs({
        supportCharacterId: "xilonen",
        supportCtx: {
          atk: 1200,
          baseAtk: 600,
          def: 3200,
          baseDef: 900,
          hp: 20000,
          baseHp: 12000,
          em: 0,
          critRate: 0.05,
          critDmg: 0.5,
          constellationLevel: 0,
          talentLevels: {},
          inputs: {},
        },
        weaponState: {
          weaponId: "peak-patrol-song",
          refinement: 1,
          inputs: { "peak-patrol-ode": "1" },
          enabled: true,
        },
        activeCharElement: "Pyro",
        activeCharBaseAtk: 1000,
      });

      // At 3,200 DEF: (3200 / 1000) * 8 = 25.6% (hits cap)
      const dmgBonusSource = res.partySources.find((s) => s.stat === "dmgBonus");
      expect(dmgBonusSource).toBeDefined();
      expect(dmgBonusSource?.value).toBe(25.6);
      expect(dmgBonusSource?.label).toContain("Peak Patrol Song [Xilonen]");
      expect(res.scalingExplainers.some((e) => e.includes("Peak Patrol Song"))).toBe(true);
    });

    it("scales Scroll of the Hero of Cinder City based on Xilonen's Geo Crystallize reactions", () => {
      const res = resolveSupportEquipmentBuffs({
        supportCharacterId: "xilonen",
        artifactState: {
          artifactId: "scroll-of-the-hero-of-cinder-city",
          pieceCount: 4,
          inputs: {
            "cinder-nightsoul-active": "1",
            "cinder-crystallize-pyro": "1",
          },
          enabled: true,
        },
        activeCharElement: "Pyro",
        activeCharBaseAtk: 1000,
      });

      // Nightsoul active (+28% + 12% = 40%) for Pyro and Geo
      const pyroBuff = res.partySources.find((s) => s.stat === "pyroDmgBonus");
      expect(pyroBuff).toBeDefined();
      expect(pyroBuff?.value).toBe(40);
      expect(pyroBuff?.label).toContain("Scroll of the Hero of Cinder City [Xilonen]");

      const geoBuff = res.partySources.find((s) => s.stat === "geoDmgBonus");
      expect(geoBuff).toBeDefined();
      expect(geoBuff?.value).toBe(40);
    });
  });

  describe("Integration into resolveTeamBuffs with Exclusive Labelling", () => {
    it("incorporates support-equipped weapon and artifact buffs with exclusive labelling", () => {
      const arlecchino = characterById("arlecchino")!;

      const supportInstance: SupportInstance = {
        supportId: "xilonen-support",
        stats: {
          "def.base": "900",
          "def.percent": "150",
          "def.flat": "200",
        },
        mechanicInputs: {},
        constellationLevel: 0,
        enabled: true,
        equippedWeapon: {
          weaponId: "peak-patrol-song",
          refinement: 1,
          inputs: { "peak-patrol-ode": "1" },
          enabled: true,
        },
        equippedArtifact: {
          artifactId: "scroll-of-the-hero-of-cinder-city",
          pieceCount: 4,
          inputs: {
            "cinder-nightsoul-active": "1",
            "cinder-crystallize-pyro": "1",
          },
          enabled: true,
        },
      };

      const teamResult = resolveTeamBuffs(
        [supportInstance],
        true,
        arlecchino,
        1000, // dpsBaseAtk
        800,  // dpsBaseDef
        15000 // dpsBaseHp
      );

      // Verify that equipped items are tracked
      expect(teamResult.equippedArtifactIds).toContain("scroll-of-the-hero-of-cinder-city");
      expect(teamResult.equippedWeaponIds).toContain("peak-patrol-song");

      // Verify that buffs were added to statDeltas
      expect(teamResult.statDeltas.pyroDmgBonus).toBeGreaterThanOrEqual(40);
      expect(teamResult.statDeltas.dmgBonus).toBeGreaterThanOrEqual(19);

      // Verify exclusive labelling on emitted sources
      const weaponSource = teamResult.sources.find((s) => s.sourceType === "weapon");
      expect(weaponSource).toBeDefined();
      expect(weaponSource?.label).toContain("[Xilonen]");

      const artifactSource = teamResult.sources.find((s) => s.sourceType === "artifact");
      expect(artifactSource).toBeDefined();
      expect(artifactSource?.label).toContain("[Xilonen]");
    });
  });

  describe("Standalone Override and Clean Removal Rules", () => {
    it("overrides duplicate standalone external artifact when equipped by active support", () => {
      const arlecchino = characterById("arlecchino")!;

      // Active support has Scroll of Cinder City equipped
      const supportInstance: SupportInstance = {
        supportId: "xilonen-support",
        stats: {},
        mechanicInputs: {},
        constellationLevel: 0,
        enabled: true,
        equippedArtifact: {
          artifactId: "scroll-of-the-hero-of-cinder-city",
          pieceCount: 4,
          inputs: { "cinder-nightsoul-active": "1", "cinder-crystallize-pyro": "1" },
          enabled: true,
        },
      };

      const teamResult = resolveTeamBuffs([supportInstance], true, arlecchino, 1000);
      expect(teamResult.equippedArtifactIds).toContain("scroll-of-the-hero-of-cinder-city");

      // Standalone external artifacts has a duplicate Scroll of Cinder City
      const standaloneArtifacts = [
        {
          id: "art-1",
          artifactId: "scroll-of-the-hero-of-cinder-city",
          pieceCount: 4 as const,
          slot: "support" as const,
          enabled: true,
          inputs: { "cinder-nightsoul-active": "1", "cinder-crystallize-pyro": "1" },
        },
      ];

      // Resolve standalone artifacts passing the overridden IDs from teamResult
      const standaloneRes = resolveExternalArtifactBuffs(
        standaloneArtifacts,
        1000,
        arlecchino,
        true,
        800,
        15000,
        teamResult.equippedArtifactIds
      );

      // Standalone entry should be completely bypassed (overridden)
      expect(standaloneRes.sources.length).toBe(0);
      expect(standaloneRes.statDeltas.pyroDmgBonus ?? 0).toBe(0);
    });

    it("cleanly removes equipment buffs when the supporting character is removed from the party", () => {
      const arlecchino = characterById("arlecchino")!;

      const supportInstance: SupportInstance = {
        supportId: "bennett-support",
        stats: { baseAtk: "800" },
        mechanicInputs: {},
        constellationLevel: 5,
        enabled: true,
        equippedArtifact: {
          artifactId: "noblesse-oblige",
          pieceCount: 4,
          inputs: { "noblesse-burst": "1" },
          enabled: true,
        },
      };

      // 1. With Bennett active: ATK buffs include Bennett kit + Noblesse 4pc
      const activeRes = resolveTeamBuffs([supportInstance], true, arlecchino, 1000);
      expect(activeRes.statDeltas.atk).toBeGreaterThan(0);
      expect(activeRes.sources.some((s) => s.label.includes("Noblesse Oblige [Bennett]"))).toBe(true);

      // 2. Remove Bennett from supports array (simulating removeSupport)
      const emptySupports: SupportInstance[] = [];
      const removedRes = resolveTeamBuffs(emptySupports, true, arlecchino, 1000);

      // All buffs from Bennett and his Noblesse equipment are cleanly removed
      expect(removedRes.sources.length).toBe(0);
      expect(removedRes.statDeltas.atk).toBeUndefined();
      expect(removedRes.equippedArtifactIds.length).toBe(0);
      expect(removedRes.equippedWeaponIds.length).toBe(0);
    });
  });

  describe("Use Character Build Toggle (Option 1 vs Option 2)", () => {
    it("Option 1: ignores equipped weapon/artifact when useCharacterBuild is false", () => {
      const arlecchino = characterById("arlecchino")!;

      const supportInstance: SupportInstance = {
        supportId: "xilonen-support",
        stats: { "def.base": "900", "def.percent": "150", "def.flat": "200" },
        mechanicInputs: {},
        constellationLevel: 0,
        enabled: true,
        useCharacterBuild: false, // Option 1: disabled
        equippedWeapon: {
          weaponId: "peak-patrol-song",
          refinement: 1,
          inputs: { "peak-patrol-ode": "1" },
          enabled: true,
        },
        equippedArtifact: {
          artifactId: "scroll-of-the-hero-of-cinder-city",
          pieceCount: 4,
          inputs: { "cinder-nightsoul-active": "1", "cinder-crystallize-pyro": "1" },
          enabled: true,
        },
      };

      const res = resolveTeamBuffs([supportInstance], true, arlecchino, 1000);

      // Neither Peak Patrol Song nor Scroll of Cinder City should be tracked or applied
      expect(res.equippedWeaponIds).toEqual([]);
      expect(res.equippedArtifactIds).toEqual([]);
      expect(res.sources.some((s) => s.sourceType === "weapon")).toBe(false);
      expect(res.sources.some((s) => s.sourceType === "artifact")).toBe(false);

      // Standalone items with matching IDs are NOT overridden
      const standaloneWeapons = [
        {
          id: "wep-1",
          weaponId: "peak-patrol-song",
          refinement: 1,
          enabled: true,
          inputs: { "patrol-wielder-def": 3200, "patrol-ode-stacks": "2" },
        },
      ];
      const standaloneRes = resolveExternalWeaponBuffs(standaloneWeapons, 1000, arlecchino, true, res.equippedWeaponIds);
      expect(standaloneRes.sources.length).toBeGreaterThan(0);
      expect(standaloneRes.statDeltas.dmgBonus).toBeGreaterThanOrEqual(25.6);
    });

    it("Option 2: deploys equipped weapon/artifact when useCharacterBuild is true", () => {
      const arlecchino = characterById("arlecchino")!;

      const supportInstance: SupportInstance = {
        supportId: "xilonen-support",
        stats: { "def.base": "900", "def.percent": "150", "def.flat": "200" },
        mechanicInputs: {},
        constellationLevel: 0,
        enabled: true,
        useCharacterBuild: true, // Option 2: enabled
        equippedWeapon: {
          weaponId: "peak-patrol-song",
          refinement: 1,
          inputs: { "peak-patrol-ode": "1" },
          enabled: true,
        },
        equippedArtifact: {
          artifactId: "scroll-of-the-hero-of-cinder-city",
          pieceCount: 4,
          inputs: { "cinder-nightsoul-active": "1", "cinder-crystallize-pyro": "1" },
          enabled: true,
        },
      };

      const res = resolveTeamBuffs([supportInstance], true, arlecchino, 1000);

      expect(res.equippedWeaponIds).toContain("peak-patrol-song");
      expect(res.equippedArtifactIds).toContain("scroll-of-the-hero-of-cinder-city");
      expect(res.sources.some((s) => s.sourceType === "weapon")).toBe(true);
      expect(res.sources.some((s) => s.sourceType === "artifact")).toBe(true);
    });
  });

  describe("Custom Refinement and Equipment Preservation (Anti-Hydration Mismatch)", () => {
    it("preserves Freedom-Sworn R2 on Kazuha and scales buffs to R2 without being overwritten by default R1", () => {
      const arlecchino = characterById("arlecchino")!;

      const kazuhaSupport: SupportInstance = {
        supportId: "kazuha-support",
        stats: { em: "1000" },
        mechanicInputs: { "kazuha-swirl-pyro": "1" },
        constellationLevel: 0,
        enabled: true,
        useCharacterBuild: true,
        equipmentSetupId: "1",
        equippedWeapon: {
          weaponId: "freedom-sworn",
          refinement: 2, // Explicitly R2!
          inputs: { "freedom-sigils-active": "1" },
          enabled: true,
        },
      };

      // 1. Verify getActiveSupportEquippedWeapons preserves refinement 2
      const activeWeps = getActiveSupportEquippedWeapons([kazuhaSupport], true, "Pyro", "Polearm", 1000);
      expect(activeWeps.length).toBe(1);
      expect(activeWeps[0].weapon.refinement).toBe(2);
      expect(activeWeps[0].weapon.weaponId).toBe("freedom-sworn");

      // 2. Verify resolveTeamBuffs calculates R2 values (+20% Normal DMG, +25% ATK)
      const res = resolveTeamBuffs([kazuhaSupport], true, arlecchino, 1000);
      expect(res.equippedWeaponIds).toContain("freedom-sworn");

      // Normal DMG bonus should be 20% (R2) rather than 16% (R1)
      const normalDmgSource = res.sources.find((s) => s.stat === "normalDmgBonus" && s.sourceType === "weapon");
      expect(normalDmgSource).toBeDefined();
      expect(normalDmgSource?.value).toBe(20);

      // ATK bonus should be 25% of 1000 = 250 (R2) rather than 20% = 200 (R1)
      const atkSource = res.sources.find((s) => s.stat === "atk" && s.sourceType === "weapon");
      expect(atkSource).toBeDefined();
      expect(atkSource?.value).toBe(250);
    });

    it("falls back cleanly to default equipment preset if equippedWeapon is omitted", () => {
      const kazuhaSupport: SupportInstance = {
        supportId: "kazuha-support",
        stats: { em: "1000" },
        mechanicInputs: {},
        constellationLevel: 0,
        enabled: true,
        useCharacterBuild: true,
        equipmentSetupId: "1",
        // equippedWeapon is omitted
      };

      const activeWeps = getActiveSupportEquippedWeapons([kazuhaSupport], true, "Pyro", "Polearm", 1000);
      expect(activeWeps.length).toBe(1);
      expect(activeWeps[0].weapon.weaponId).toBe("freedom-sworn");
      expect(activeWeps[0].weapon.refinement).toBe(1);
    });

    it("preserves 2-Piece artifact customization without being overwritten by 4-Piece default", () => {
      const kazuhaSupport: SupportInstance = {
        supportId: "kazuha-support",
        stats: { em: "1000" },
        mechanicInputs: {},
        constellationLevel: 0,
        enabled: true,
        useCharacterBuild: true,
        equipmentSetupId: "1",
        equippedArtifact: {
          artifactId: "viridescent-venerer",
          pieceCount: 2, // Explicit 2-piece set
          enabled: true,
        },
      };

      const activeArts = getActiveSupportEquippedArtifacts([kazuhaSupport], true, "Pyro", 1000);
      expect(activeArts.length).toBe(1);
      expect(activeArts[0].artifact.pieceCount).toBe(2);
    });

    it("Viridescent Venerer 4-Pc applies -40% Elemental RES shred when equipped on Kazuha support", () => {
      const res = resolveSupportEquipmentBuffs({
        supportCharacterId: "kazuha",
        artifactState: {
          artifactId: "viridescent-venerer",
          pieceCount: 4,
          inputs: { "vv-res-shred-active": "1" },
          enabled: true,
        },
        activeCharElement: "Pyro",
        activeCharBaseAtk: 1000,
      });

      expect(res.partyStatDeltas.enemyPyroRes).toBe(-40);
      const vvBuff = res.partySources.find((s) => s.stat === "enemyPyroRes");
      expect(vvBuff).toBeDefined();
      expect(vvBuff?.value).toBe(-40);
      // Clean non-redundant label without repeated set name
      expect(vvBuff?.label).toBe("4-Piece Pyro RES Shred (Viridescent Venerer [Kaedehara Kazuha])");
      expect(res.scalingExplainers.some((e) => e.includes("Viridescent Venerer"))).toBe(true);
    });

    it("Viridescent Venerer applies -40% Elemental RES shred even with unpopulated inputs defaulting to DPS element", () => {
      const res = resolveSupportEquipmentBuffs({
        supportCharacterId: "kazuha",
        artifactState: {
          artifactId: "viridescent-venerer",
          pieceCount: 4,
          inputs: {},
          enabled: true,
        },
        activeCharElement: "Pyro",
        activeCharBaseAtk: 1000,
      });

      expect(res.partyStatDeltas.enemyPyroRes).toBe(-40);
    });

    it("Viridescent Venerer supports Cinder City style multi-swirl toggles (Hydro and Electro)", () => {
      const res = resolveSupportEquipmentBuffs({
        supportCharacterId: "kazuha",
        artifactState: {
          artifactId: "viridescent-venerer",
          pieceCount: 4,
          inputs: {
            "vv-swirl-hydro": "1",
            "vv-swirl-electro": "1",
          },
          enabled: true,
        },
        activeCharElement: "Hydro",
        activeCharBaseAtk: 1000,
      });

      expect(res.partyStatDeltas.enemyHydroRes).toBe(-40);
      expect(res.partyStatDeltas.enemyElectroRes).toBe(-40);
      expect(res.partyStatDeltas.enemyPyroRes).toBeUndefined();
      expect(res.partySources.some((s) => s.label === "4-Piece Hydro RES Shred (Viridescent Venerer [Kaedehara Kazuha])")).toBe(true);
      expect(res.partySources.some((s) => s.label === "4-Piece Electro RES Shred (Viridescent Venerer [Kaedehara Kazuha])")).toBe(true);
    });

    it("integrates Kazuha VV 4-Piece -40% RES shred into resolveTeamBuffs", () => {
      const kazuhaSupport: SupportInstance = {
        supportId: "kazuha-support",
        stats: { em: "1000" },
        mechanicInputs: { "a4-pyro-swirl": "1" },
        constellationLevel: 0,
        enabled: true,
        useCharacterBuild: true,
        equipmentSetupId: "1",
        equippedArtifact: {
          artifactId: "viridescent-venerer",
          pieceCount: 4,
          inputs: { "vv-res-shred-active": "1" },
          enabled: true,
        },
      };

      const arlecchino = characterById("arlecchino")!;
      const teamRes = resolveTeamBuffs([kazuhaSupport], true, arlecchino, 1000, 800, 15000);

      expect(teamRes.statDeltas.enemyPyroRes).toBe(-40);
      expect(teamRes.sources.some((s) => s.stat === "enemyPyroRes" && s.value === -40)).toBe(true);
    });
  });
});

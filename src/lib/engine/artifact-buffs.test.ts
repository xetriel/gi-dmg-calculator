import { describe, it, expect } from "vitest";
import { resolveExternalArtifactBuffs } from "./artifact-buffs";
import { ARTIFACTS, artifactById, supportArtifacts, wielderArtifacts } from "../../data/registry/artifacts";
import { byId } from "../../data/registry/characters";

const mockMizuki = byId("mizuki")!;
const mockArlecchino = byId("arlecchino")!;
const mockAyaka = byId("ayaka")!;

describe("External Artifact Buffs Engine & Complete 64-Set Registry", () => {
  describe("Registry Integrity", () => {
    it("contains exactly 64 unique artifact sets", () => {
      expect(ARTIFACTS.length).toBe(64);

      const idSet = new Set<string>();
      for (const a of ARTIFACTS) {
        expect(idSet.has(a.id)).toBe(false);
        idSet.add(a.id);

        expect(a.name.length).toBeGreaterThan(0);
        expect(a.twoPieceDesc.length).toBeGreaterThan(0);
        expect(a.fourPieceDesc.length).toBeGreaterThan(0);
        expect([1, 2, 3, 4, 5]).toContain(a.rarity);
        expect(["team", "self", "both"]).toContain(a.buffType);
      }
    });

    it("has supportive and wielder subsets partitioned correctly", () => {
      expect(supportArtifacts.length).toBeGreaterThanOrEqual(13);
      expect(wielderArtifacts.length).toBeGreaterThanOrEqual(50);
      expect(artifactById("noblesse-oblige")?.isSupport).toBe(true);
      expect(artifactById("tenacity-of-the-millelith")?.isSupport).toBe(true);
      expect(artifactById("viridescent-venerer")?.isSupport).toBe(true);
      expect(artifactById("gladiators-finale")?.isSupport).toBe(false);
    });
  });

  describe("Party Support Artifact Sets", () => {
    it("Noblesse Oblige: applies +20% ATK to party from Support slot", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "noblesse-oblige",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "noblesse-burst": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.atk).toBeCloseTo(200);
      expect(res.statDeltas.burstDmgBonus).toBeUndefined(); // 2pc self burst DMG does not leak from support slot
      expect(res.sources.length).toBe(1);
    });

    it("Tenacity of the Millelith: applies +20% ATK to party from Support slot", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "tenacity-of-the-millelith",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "totm-skill-hit": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.atk).toBeCloseTo(200);
      expect(res.statDeltas.hp).toBeUndefined(); // 2pc self HP does not leak from support slot
    });

    it("Viridescent Venerer: applies -40% Elemental RES shred to party", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "viridescent-venerer",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "vv-res-shred-active": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.enemyRes).toBe(-40);
    });

    it("Deepwood Memories: applies -30% Dendro RES shred to party", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "deepwood-memories",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "deepwood-res-shred": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.enemyRes).toBe(-30);
    });

    it("Instructor: applies +120 Elemental Mastery to party", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "instructor",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "instructor-reaction": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.em).toBe(120);
    });

    it("Scroll of the Hero of Cinder City: applies +40% Elemental DMG with Nightsoul", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "scroll-of-the-hero-of-cinder-city",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "cinder-reaction-active": "1", "cinder-nightsoul-active": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.dmgBonus).toBe(40);
    });

    it("Celestial Gift: applies +40% Elemental DMG with Hexerei Secret Rite", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "celestial-gift",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "celestial-skill-guidance": "1", "celestial-hexerei-active": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.dmgBonus).toBe(40);
    });
  });

  describe("Dynamic Scaling & Wielder Sets", () => {
    it("Emblem of Severed Fate: scales 25% of ER (200% ER -> +50% Burst DMG)", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "emblem-of-severed-fate",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "emblem-er-input": 200 },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.energyRecharge).toBe(20);
      expect(res.statDeltas.burstDmgBonus).toBe(50);
    });

    it("Marechaussee Hunter: grants +36% CRIT Rate at 3 HP change stacks", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "marechaussee-hunter",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "marechaussee-stacks": 3 },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.normalDmgBonus).toBe(15);
      expect(res.statDeltas.chargedDmgBonus).toBe(15);
      expect(res.statDeltas.critRate).toBe(36);
    });

    it("Crimson Witch of Flames: applies 2pc +15% Pyro and 3 stacks (+22.5% Pyro = total +37.5% Pyro)", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "crimson-witch-of-flames",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "witch-stacks": 3 },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.pyroDmgBonus).toBeCloseTo(37.5);
    });

    it("Gladiator's Finale: grants +35% Normal Attack DMG to Sword/Claymore/Polearm", () => {
      const resArlecchino = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "gladiators-finale",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
          },
        ],
        1000,
        mockArlecchino, // Polearm
        true
      );
      expect(resArlecchino.statDeltas.atk).toBeCloseTo(180);
      expect(resArlecchino.statDeltas.normalDmgBonus).toBe(35);

      const resMizuki = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "gladiators-finale",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
          },
        ],
        1000,
        mockMizuki, // Catalyst
        true
      );
      expect(resMizuki.statDeltas.atk).toBeCloseTo(180);
      expect(resMizuki.statDeltas.normalDmgBonus ?? 0).toBe(0); // Ineligible weapon class
    });

    it("Wanderer's Troupe: grants +35% Charged Attack DMG to Bow/Catalyst", () => {
      const resMizuki = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "wanderers-troupe",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
          },
        ],
        1000,
        mockMizuki, // Catalyst
        true
      );
      expect(resMizuki.statDeltas.em).toBe(80);
      expect(resMizuki.statDeltas.chargedDmgBonus).toBe(35);

      const resAyaka = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "wanderers-troupe",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
          },
        ],
        1000,
        mockAyaka, // Sword
        true
      );
      expect(resAyaka.statDeltas.em).toBe(80);
      expect(resAyaka.statDeltas.chargedDmgBonus ?? 0).toBe(0); // Ineligible weapon class
    });

    it("Blizzard Strayer: applies +20% CRIT against Cryo and additional +20% against Frozen", () => {
      const resCryo = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "blizzard-strayer",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "target-cryo": "1", "target-frozen": "0" },
          },
        ],
        1000,
        mockAyaka,
        true
      );
      expect(resCryo.statDeltas.critRate).toBe(20);

      const resFrozen = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "blizzard-strayer",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "target-cryo": "1", "target-frozen": "1" },
          },
        ],
        1000,
        mockAyaka,
        true
      );
      expect(resFrozen.statDeltas.critRate).toBe(40);
    });

    it("Obsidian Codex: applies +40% CRIT Rate when Nightsoul point is consumed", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "obsidian-codex",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "obsidian-on-field-nightsoul": "1", "obsidian-consumed-point": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );
      expect(res.statDeltas.dmgBonus).toBe(15);
      expect(res.statDeltas.critRate).toBe(40);
    });
  });

  describe("Non-Stacking Rules & Limit Constraints", () => {
    it("enforces non-stacking for duplicate Noblesse Oblige sets on support characters", () => {
      const res = resolveExternalArtifactBuffs(
        [
          { id: "a-1", artifactId: "noblesse-oblige", pieceCount: 4, slot: "support", enabled: true, inputs: { "noblesse-burst": "1" } },
          { id: "a-2", artifactId: "noblesse-oblige", pieceCount: 4, slot: "support", enabled: true, inputs: { "noblesse-burst": "1" } },
        ],
        1000,
        mockArlecchino,
        true
      );

      // Only applied once (200 ATK, not 400)
      expect(res.statDeltas.atk).toBeCloseTo(200);
      expect(res.sources.length).toBe(1);
    });

    it("stacks different party support artifact sets together (Noblesse + Tenacity + Instructor + Scroll)", () => {
      const res = resolveExternalArtifactBuffs(
        [
          { id: "a-1", artifactId: "noblesse-oblige", pieceCount: 4, slot: "support", enabled: true, inputs: { "noblesse-burst": "1" } },
          { id: "a-2", artifactId: "tenacity-of-the-millelith", pieceCount: 4, slot: "support", enabled: true, inputs: { "totm-skill-hit": "1" } },
          { id: "a-3", artifactId: "instructor", pieceCount: 4, slot: "support", enabled: true, inputs: { "instructor-reaction": "1" } },
          { id: "a-4", artifactId: "scroll-of-the-hero-of-cinder-city", pieceCount: 4, slot: "support", enabled: true, inputs: { "cinder-reaction-active": "1", "cinder-nightsoul-active": "1" } },
        ],
        1000,
        mockArlecchino,
        true
      );

      // Noblesse (20%) + ToTM (20%) = 40% of 1000 = 400 ATK
      expect(res.statDeltas.atk).toBeCloseTo(400);
      expect(res.statDeltas.em).toBe(120);
      expect(res.statDeltas.dmgBonus).toBe(40);
      expect(res.sources.length).toBe(4);
    });
  });

  describe("Audit & Formula Correction Tests", () => {
    it("scales Defender's Will 2pc DEF% with baseDef, NOT baseAtk", () => {
      const res = resolveExternalArtifactBuffs(
        [
          { id: "a-1", artifactId: "defenders-will", pieceCount: 2, slot: "wielder", enabled: true },
        ],
        1000, // baseAtk
        mockArlecchino,
        true,
        800,  // baseDef
        15000 // baseHp
      );

      // 30% of 800 Base DEF = 240 DEF (NOT 30% of 1000 Base ATK = 300)
      expect(res.statDeltas.def).toBeCloseTo(240);
      expect(res.statDeltas.atk).toBeUndefined();
    });

    it("scales Husk of Opulent Dreams 2pc and 4pc Curiosity stacks with baseDef", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "husk-of-opulent-dreams",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "curiosity-stacks": 4 },
          },
        ],
        1000, // baseAtk
        mockArlecchino,
        true,
        800,  // baseDef
        15000 // baseHp
      );

      // 2pc: 30% of 800 = 240 DEF. 4pc: 4 * 6% = 24% of 800 = 192 DEF. Total = 432 DEF.
      expect(res.statDeltas.def).toBeCloseTo(432);
      expect(res.statDeltas.geoDmgBonus).toBe(24);
    });

    it("scales Tenacity of the Millelith 2pc HP% with baseHp, NOT baseAtk", () => {
      const res = resolveExternalArtifactBuffs(
        [
          { id: "a-1", artifactId: "tenacity-of-the-millelith", pieceCount: 2, slot: "wielder", enabled: true },
        ],
        1000, // baseAtk
        mockArlecchino,
        true,
        800,  // baseDef
        15000 // baseHp
      );

      // 20% of 15,000 Base HP = 3,000 HP (NOT 20% of 1000 Base ATK = 200)
      expect(res.statDeltas.hp).toBeCloseTo(3000);
      expect(res.statDeltas.atk).toBeUndefined();
    });

    it("scales Vourukasha's Glow 2pc HP% with baseHp, NOT baseAtk", () => {
      const res = resolveExternalArtifactBuffs(
        [
          { id: "a-1", artifactId: "vourukashas-glow", pieceCount: 2, slot: "wielder", enabled: true },
        ],
        1000, // baseAtk
        mockArlecchino,
        true,
        800,  // baseDef
        15000 // baseHp
      );

      // 20% of 15,000 Base HP = 3,000 HP
      expect(res.statDeltas.hp).toBeCloseTo(3000);
      expect(res.statDeltas.atk).toBeUndefined();
    });

    it("resolves Song of Days Past 4pc Waves of Days Past flat DMG bonus up to 1,200", () => {
      const resSupport = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "song-of-days-past",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "days-past-healing": 15000 },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      // 8% of 15,000 healing = 1,200 Flat DMG
      expect(resSupport.statDeltas.flatDmgBonus).toBe(1200);

      const resPartial = resolveExternalArtifactBuffs(
        [
          {
            id: "a-2",
            artifactId: "song-of-days-past",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "days-past-healing": 10000 },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      // 8% of 10,000 healing = 800 Flat DMG
      expect(resPartial.statDeltas.flatDmgBonus).toBe(800);
    });

    it("resolves Echoes of an Offering 4pc Valley Rite Normal Attack DMG buff", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "echoes-of-an-offering",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "valley-rite-active": "1" },
          },
        ],
        1000, // baseAtk
        mockArlecchino,
        true
      );

      // 2pc: 18% of 1000 = 180 ATK. 4pc: 70% of 1000 = 700 Flat DMG
      expect(res.statDeltas.atk).toBeCloseTo(180);
      expect(res.statDeltas.flatDmgBonus).toBeCloseTo(700);
    });

    it("resolves Tiny Miracle 2pc and 4pc RES bonuses", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "tiny-miracle",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "tiny-miracle-hit": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      // 2pc: 20 All RES. 4pc: 30 Elemental RES. Total = 50.
      expect(res.statDeltas.allRes).toBe(50);
    });

    it("resolves Maiden Beloved 4pc party healing bonus from support slot", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "maiden-beloved",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "maiden-skill-burst": "1" },
          },
        ],
        1000,
        mockArlecchino,
        true
      );

      expect(res.statDeltas.healingBonus).toBe(20);
    });

    it("verifies accurate 2pc bonuses for recent/corrected artifact sets", () => {
      // Long Night's Oath: 25% Plunge DMG
      const rPlunge = resolveExternalArtifactBuffs(
        [{ id: "a-1", artifactId: "long-nights-oath", pieceCount: 2, slot: "wielder", enabled: true }],
        1000, mockArlecchino, true
      );
      expect(rPlunge.statDeltas.plungeDmgBonus).toBe(25);

      // Finale of the Deep Galleries: 15% Cryo DMG
      const rCryo = resolveExternalArtifactBuffs(
        [{ id: "a-2", artifactId: "finale-of-the-deep-galleries", pieceCount: 2, slot: "wielder", enabled: true }],
        1000, mockArlecchino, true
      );
      expect(rCryo.statDeltas.cryoDmgBonus).toBe(15);

      // Night of the Sky's Unveiling: 80 EM
      const rSky = resolveExternalArtifactBuffs(
        [{ id: "a-3", artifactId: "night-of-the-skys-unveiling", pieceCount: 2, slot: "wielder", enabled: true }],
        1000, mockArlecchino, true
      );
      expect(rSky.statDeltas.em).toBe(80);

      // Aubade of Morningstar and Moon: 80 EM
      const rAubade = resolveExternalArtifactBuffs(
        [{ id: "a-4", artifactId: "aubade-of-morningstar-and-moon", pieceCount: 2, slot: "wielder", enabled: true }],
        1000, mockArlecchino, true
      );
      expect(rAubade.statDeltas.em).toBe(80);

      // Disenchantment in Deep Shadow: 18% ATK
      const rDis = resolveExternalArtifactBuffs(
        [{ id: "a-5", artifactId: "disenchantment-in-deep-shadow", pieceCount: 2, slot: "wielder", enabled: true }],
        1000, mockArlecchino, true
      );
      expect(rDis.statDeltas.atk).toBeCloseTo(180);
    });
  });
});

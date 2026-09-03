import { describe, it, expect } from "vitest";
import { resolveExternalArtifactBuffs } from "./artifact-buffs";
import type { CharacterConfig } from "../../data/registry/types";
import { ARTIFACTS, artifactById, supportArtifacts, wielderArtifacts } from "../../data/registry/artifacts";

const mockMizuki: CharacterConfig = {
  id: "mizuki",
  name: "Mizuki",
  rarity: 5,
  element: "Anemo",
  weapon: "Catalyst",
  region: "Nod-Krai",
  dmgBonusLabel: "Anemo DMG Bonus%",
  talents: [],
  constellations: [],
};

const mockArlecchino: CharacterConfig = {
  id: "arlecchino",
  name: "Arlecchino",
  rarity: 5,
  element: "Pyro",
  weapon: "Polearm",
  region: "Fontaine",
  dmgBonusLabel: "Pyro DMG Bonus%",
  talents: [],
  constellations: [],
};

const mockAyaka: CharacterConfig = {
  id: "ayaka",
  name: "Kamisato Ayaka",
  rarity: 5,
  element: "Cryo",
  weapon: "Sword",
  region: "Inazuma",
  dmgBonusLabel: "Cryo DMG Bonus%",
  talents: [],
  constellations: [],
};

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
});

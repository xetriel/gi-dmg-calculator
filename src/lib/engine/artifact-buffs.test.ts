import { describe, it, expect } from "vitest";
import { resolveExternalArtifactBuffs } from "./artifact-buffs";
import type { CharacterConfig } from "../../data/registry/types";
import { ARTIFACTS, artifactById } from "../../data/registry/artifacts";

const mockMizuki: CharacterConfig = {
  id: "mizuki",
  name: "Mizuki",
  rarity: 5,
  element: "Anemo",
  weapon: "Catalyst",
  region: "Nod-Khadar",
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

describe("External Artifact Buffs Engine", () => {
  it("verifies initial artifacts exist in registry", () => {
    expect(ARTIFACTS.length).toBe(2);
    expect(artifactById("scarlet-proof")).toBeDefined();
    expect(artifactById("heart-of-the-furnace")).toBeDefined();
  });

  describe("Scarlet Proof", () => {
    it("applies 2-Piece 18% ATK on Wielder slot", () => {
      const baseAtk = 1000;
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "scarlet-proof",
            pieceCount: 2,
            slot: "wielder",
            enabled: true,
          },
        ],
        baseAtk,
        mockMizuki,
        true
      );

      expect(res.statDeltas.atk).toBeCloseTo(180);
      expect(res.statDeltas.critRate).toBeUndefined();
      expect(res.statDeltas.stellarSwirlDmgBonus).toBeUndefined();
      expect(res.sources.length).toBe(1);
    });

    it("applies 4-Piece +16% CRIT Rate and +40% Stellar Swirl DMG when condition is ON", () => {
      const baseAtk = 1000;
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "scarlet-proof",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "trigger-stellar-swirl": "1" },
          },
        ],
        baseAtk,
        mockMizuki,
        true
      );

      expect(res.statDeltas.atk).toBeCloseTo(180);
      expect(res.statDeltas.critRate).toBe(16);
      expect(res.statDeltas.stellarSwirlDmgBonus).toBe(40);
      expect(res.sources.length).toBe(3);
    });

    it("disables 4-Piece bonuses when condition is toggled OFF", () => {
      const baseAtk = 1000;
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "scarlet-proof",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "trigger-stellar-swirl": "0" },
          },
        ],
        baseAtk,
        mockMizuki,
        true
      );

      // 2pc ATK still applies
      expect(res.statDeltas.atk).toBeCloseTo(180);
      // 4pc conditional buffs do not apply
      expect(res.statDeltas.critRate).toBeUndefined();
      expect(res.statDeltas.stellarSwirlDmgBonus).toBeUndefined();
    });

    it("does NOT apply to active DPS when equipped in Support slot (since it has no party buffs)", () => {
      const baseAtk = 1000;
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "scarlet-proof",
            pieceCount: 4,
            slot: "support",
            enabled: true,
          },
        ],
        baseAtk,
        mockMizuki,
        true
      );

      expect(res.statDeltas.atk).toBeUndefined();
      expect(res.statDeltas.critRate).toBeUndefined();
      expect(res.statDeltas.stellarSwirlDmgBonus).toBeUndefined();
      expect(res.sources.length).toBe(0);
    });
  });

  describe("Heart of the Furnace", () => {
    it("applies 2-Piece 18% ATK and 4-Piece self 12% ATK on Wielder slot (Total +30% ATK)", () => {
      const baseAtk = 1000;
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "heart-of-the-furnace",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
            inputs: { "trigger-stellar-glimmer": "1" },
          },
        ],
        baseAtk,
        mockArlecchino,
        true
      );

      // 18% + 12% = 30% of 1000 = 300 ATK
      expect(res.statDeltas.atk).toBeCloseTo(300);
      expect(res.statDeltas.stellarGlimmerDmgBonus).toBe(50);
      expect(res.sources.length).toBe(3);
    });

    it("applies 4-Piece +50% Stellar Glimmer DMG to party when equipped on Support slot", () => {
      const baseAtk = 1000;
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "heart-of-the-furnace",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "trigger-stellar-glimmer": "1" },
          },
        ],
        baseAtk,
        mockArlecchino,
        true
      );

      // Self ATK buffs do not apply to DPS from a support character's artifact
      expect(res.statDeltas.atk).toBeUndefined();
      // Party Stellar Glimmer DMG applies
      expect(res.statDeltas.stellarGlimmerDmgBonus).toBe(50);
      expect(res.sources.length).toBe(1);
    });

    it("enforces non-stacking rule for multiple Heart of the Furnace sets on party supports", () => {
      const baseAtk = 1000;
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "heart-of-the-furnace",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "trigger-stellar-glimmer": "1" },
          },
          {
            id: "a-2",
            artifactId: "heart-of-the-furnace",
            pieceCount: 4,
            slot: "support",
            enabled: true,
            inputs: { "trigger-stellar-glimmer": "1" },
          },
        ],
        baseAtk,
        mockArlecchino,
        true
      );

      // Should only apply once (50%, not 100%)
      expect(res.statDeltas.stellarGlimmerDmgBonus).toBe(50);
      expect(res.sources.length).toBe(1);
    });
  });

  describe("General Constraints & Toggles", () => {
    it("bypasses all buffs when masterEnabled is false", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "scarlet-proof",
            pieceCount: 4,
            slot: "wielder",
            enabled: true,
          },
        ],
        1000,
        mockMizuki,
        false
      );

      expect(res.statDeltas).toEqual({});
      expect(res.sources).toEqual([]);
    });

    it("respects individual disabled artifact toggles", () => {
      const res = resolveExternalArtifactBuffs(
        [
          {
            id: "a-1",
            artifactId: "scarlet-proof",
            pieceCount: 4,
            slot: "wielder",
            enabled: false,
          },
        ],
        1000,
        mockMizuki,
        true
      );

      expect(res.statDeltas).toEqual({});
      expect(res.sources).toEqual([]);
    });

    it("caps evaluated artifacts to a maximum of 4", () => {
      const res = resolveExternalArtifactBuffs(
        [
          { id: "a-1", artifactId: "scarlet-proof", pieceCount: 4, slot: "wielder", enabled: true },
          { id: "a-2", artifactId: "heart-of-the-furnace", pieceCount: 4, slot: "support", enabled: true },
          { id: "a-3", artifactId: "scarlet-proof", pieceCount: 4, slot: "support", enabled: true },
          { id: "a-4", artifactId: "scarlet-proof", pieceCount: 4, slot: "support", enabled: true },
          { id: "a-5", artifactId: "scarlet-proof", pieceCount: 4, slot: "support", enabled: true }, // 5th ignored
        ],
        1000,
        mockMizuki,
        true
      );

      expect(res.statDeltas.atk).toBeCloseTo(180);
      expect(res.statDeltas.critRate).toBe(16);
      expect(res.statDeltas.stellarSwirlDmgBonus).toBe(40);
      expect(res.statDeltas.stellarGlimmerDmgBonus).toBe(50);
    });
  });
});

import { describe, it, expect } from "vitest";
import { getArtifactRarityRange, matchesArtifactRarity } from "./types";
import { blizzardStrayer } from "./blizzard-strayer";
import { berserker } from "./berserker";
import { adventurer } from "./adventurer";
import { initiate } from "./initiate";

describe("Artifact Rarity Range System", () => {
  it("derives canonical 4★–5★ drop range for 5-star sets (e.g. Blizzard Strayer)", () => {
    const range = getArtifactRarityRange(blizzardStrayer);
    expect(range).toEqual([4, 5]);
  });

  it("derives canonical 3★–4★ drop range for 4-star sets (e.g. Berserker)", () => {
    const range = getArtifactRarityRange(berserker);
    expect(range).toEqual([3, 4]);
  });

  it("derives canonical 1★–3★ drop range for 3-star sets (e.g. Adventurer)", () => {
    const range = getArtifactRarityRange(adventurer);
    expect(range).toEqual([1, 3]);
  });

  it("derives canonical 1★ drop range for 1-star sets (e.g. Initiate)", () => {
    const range = getArtifactRarityRange(initiate);
    expect(range).toEqual([1, 1]);
  });

  it("filters with 'range' mode properly overlapping 4★ pieces", () => {
    // 4★ in range mode should match both Berserker (3-4★) and Blizzard Strayer (4-5★)
    expect(matchesArtifactRarity(blizzardStrayer, 4, "range")).toBe(true);
    expect(matchesArtifactRarity(berserker, 4, "range")).toBe(true);
    expect(matchesArtifactRarity(adventurer, 4, "range")).toBe(false);

    // 5★ in range mode should match Blizzard Strayer, but not Berserker
    expect(matchesArtifactRarity(blizzardStrayer, 5, "range")).toBe(true);
    expect(matchesArtifactRarity(berserker, 5, "range")).toBe(false);

    // 1★ in range mode should match Adventurer and Initiate
    expect(matchesArtifactRarity(adventurer, 1, "range")).toBe(true);
    expect(matchesArtifactRarity(initiate, 1, "range")).toBe(true);
    expect(matchesArtifactRarity(berserker, 1, "range")).toBe(false);
  });

  it("filters with 'max' mode strictly matching maximum rarity only", () => {
    expect(matchesArtifactRarity(blizzardStrayer, 5, "max")).toBe(true);
    expect(matchesArtifactRarity(blizzardStrayer, 4, "max")).toBe(false);
    expect(matchesArtifactRarity(berserker, 4, "max")).toBe(true);
  });
});

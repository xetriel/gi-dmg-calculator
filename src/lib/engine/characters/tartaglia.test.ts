import { describe, it, expect } from "vitest";
import { resolveTartaglia } from "./tartaglia";
import { tartaglia } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

describe("tartaglia mechanics", () => {
  it("Master of Weaponry party passive note", () => {
    const r1 = resolveTartaglia(tartaglia, ctxFor("tartaglia", {
      inputs: { "master-of-weaponry": 1 },
    }));
    expect(r1.notes.some(n => n.includes("Master of Weaponry"))).toBe(true);
  });

  it("Riptide active status note", () => {
    const r1 = resolveTartaglia(tartaglia, ctxFor("tartaglia", {
      inputs: { "riptide-active": 1 },
    }));
    expect(r1.notes.some(n => n.includes("Riptide Active"))).toBe(true);
  });

  it("talent seed row count", () => {
    const rows = flattenSeed(TALENT_SEED.filter(x => x.characterId === "tartaglia"));
    expect(rows.length).toBe(378); // 27 hit definitions * 14 levels = 378 rows
  });
});

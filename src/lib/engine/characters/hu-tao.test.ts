import { describe, it, expect } from "vitest";
import { resolveHuTao } from "./hu-tao";
import { huTao } from "../../../data/registry/characters";
import { ctxFor } from "./test-helpers";

describe("mechanics: Hu Tao", () => {
  it("Paramita adds skill% of Max HP as ATK (uncapped case)", () => {
    // skill lv10 atk-increase = 6.26 (% Max HP) -> 6.26% × 20000 = 1252 < 4×800
    const r = resolveHuTao(huTao, ctxFor("hu-tao", { inputs: { paramita: 1 } }));
    expect(r.statDeltas.atk).toBeCloseTo(1252, 1);
  });
  it("Paramita caps at 400% Base ATK", () => {
    const r = resolveHuTao(huTao, ctxFor("hu-tao", { baseAtk: 200, inputs: { paramita: 1 } }));
    expect(r.statDeltas.atk).toBeCloseTo(800, 6); // 4 × 200
  });
  it("Sanguine Rouge adds +33 Pyro DMG Bonus", () => {
    const r = resolveHuTao(huTao, ctxFor("hu-tao", { inputs: { "low-hp": 1 } }));
    expect(r.statDeltas.dmgBonus).toBe(33);
  });
});

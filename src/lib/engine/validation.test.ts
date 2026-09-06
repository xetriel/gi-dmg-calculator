import { describe, it, expect } from "vitest";
import { getRequiredConstellation } from "./validation";
import { xilonen, diluc, alhaitham, varka, linnea } from "../../data/registry/characters";
import { resolveSupportCtx } from "./team-buffs";

describe("getRequiredConstellation", () => {
  it("detects constellation requirements from mechanic ID prefix or word boundaries", () => {
    expect(getRequiredConstellation({ id: "c1-high-hp-buff", label: "C1 Conviction" })).toBe(1);
    expect(getRequiredConstellation({ id: "c2-chiucue-mix", label: "C2 Chiucue Mix Active (+50% Geo DMG)" })).toBe(2);
    expect(getRequiredConstellation({ id: "c4-blooming-blessing", label: "C4 Suchitl's Trance: Blooming Blessing (+65% DEF Flat DMG)" })).toBe(4);
    expect(getRequiredConstellation({ id: "c6-imperishable-night", label: "C6 Imperishable Night Carnival (+300% DEF Flat DMG)" })).toBe(6);
    expect(getRequiredConstellation({ id: "alhaitham-c2-stacks", label: "C2 Rhetoric EM Stacks" })).toBe(2);
    expect(getRequiredConstellation({ id: "alhaitham-c4-dmg-bonus-stacks", label: "C4 Elucidation Dendro DMG Stacks" })).toBe(4);
  });

  it("detects constellation requirements from mechanic label parentheticals", () => {
    expect(getRequiredConstellation({ id: "field-catalog-stacks", label: "Field Catalog stacks (C1)" })).toBe(1);
    expect(getRequiredConstellation({ id: "lyrical-libation", label: "C1 Lyrical Libation (2x DMG)" })).toBe(1);
    expect(getRequiredConstellation({ id: "c4-diligent-refinement", label: "Diligent Refinement (C4)" })).toBe(4);
  });

  it("respects explicit minConstellation field override", () => {
    expect(getRequiredConstellation({ id: "custom-mechanic", label: "Custom Buff", minConstellation: 3 })).toBe(3);
  });

  it("returns 0 for non-constellation mechanics", () => {
    expect(getRequiredConstellation({ id: "nightsoul-state", label: "Nightsoul's Blessing State" })).toBe(0);
    expect(getRequiredConstellation({ id: "source-samples-geo-dps", label: "Geo DPS Mode" })).toBe(0);
    expect(getRequiredConstellation({ id: "a4-nightsoul-burst", label: "A4 Portable Armored Sheath" })).toBe(0);
    expect(getRequiredConstellation({ id: "bond-of-life", label: "Bond of Life" })).toBe(0);
    expect(getRequiredConstellation({ id: "paramita", label: "Paramita Papilio" })).toBe(0);
  });

  it("accurately identifies all constellation mechanics in Xilonen", () => {
    const c2 = xilonen.mechanicDefs?.find(m => m.id === "c2-chiucue-mix");
    const c4 = xilonen.mechanicDefs?.find(m => m.id === "c4-blooming-blessing");
    const c6 = xilonen.mechanicDefs?.find(m => m.id === "c6-imperishable-night");
    const a4 = xilonen.mechanicDefs?.find(m => m.id === "a4-nightsoul-burst");

    expect(c2).toBeDefined();
    expect(getRequiredConstellation(c2!)).toBe(2);

    expect(c4).toBeDefined();
    expect(getRequiredConstellation(c4!)).toBe(4);

    expect(c6).toBeDefined();
    expect(getRequiredConstellation(c6!)).toBe(6);

    expect(a4).toBeDefined();
    expect(getRequiredConstellation(a4!)).toBe(0);
  });

  it("zeroes out gated constellation mechanics in resolveSupportCtx when constellation level is insufficient", () => {
    // Xilonen support with C2 toggles checked, but constellationLevel = 0
    const ctxC0 = resolveSupportCtx({
      supportId: "xilonen-support",
      stats: { def: "3000" },
      mechanicInputs: {
        "source-samples-active": "1",
        "c2-geo": "1",
        "c4-blooming-blessing": "1",
      },
      constellationLevel: 0,
      enabled: true,
    });

    expect(ctxC0).not.toBeNull();
    // Non-constellation mechanic remains active
    expect(ctxC0!.inputs["source-samples-active"]).toBe(1);
    // C2 and C4 mechanics are gated and zeroed out
    expect(ctxC0!.inputs["c2-geo"]).toBe(0);
    expect(ctxC0!.inputs["c4-blooming-blessing"]).toBe(0);

    // When constellationLevel = 2: C2 is active, C4 remains gated
    const ctxC2 = resolveSupportCtx({
      supportId: "xilonen-support",
      stats: { def: "3000" },
      mechanicInputs: {
        "source-samples-active": "1",
        "c2-geo": "1",
        "c4-blooming-blessing": "1",
      },
      constellationLevel: 2,
      enabled: true,
    });

    expect(ctxC2!.inputs["c2-geo"]).toBe(1);
    expect(ctxC2!.inputs["c4-blooming-blessing"]).toBe(0);

    // When constellationLevel = 4: C2 and C4 are both active
    const ctxC4 = resolveSupportCtx({
      supportId: "xilonen-support",
      stats: { def: "3000" },
      mechanicInputs: {
        "source-samples-active": "1",
        "c2-geo": "1",
        "c4-blooming-blessing": "1",
      },
      constellationLevel: 4,
      enabled: true,
    });

    expect(ctxC4!.inputs["c2-geo"]).toBe(1);
    expect(ctxC4!.inputs["c4-blooming-blessing"]).toBe(1);
  });
});

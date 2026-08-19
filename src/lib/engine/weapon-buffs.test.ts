import { describe, it, expect } from "vitest";
import { resolveExternalWeaponBuffs } from "./weapon-buffs";
import { getWeaponsForCharacter, WEAPONS, weaponById } from "../../data/registry/weapons";
import { arlecchino } from "../../data/registry/characters/arlecchino";
import { neuvillette } from "../../data/registry/characters/neuvillette";


describe("Full Weapon Registry Integrity (246 Released Weapons)", () => {
  it("contains exactly 246 unique released weapons across all 5 weapon classes", () => {
    expect(WEAPONS.length).toBe(246);

    const idSet = new Set<string>();
    for (const w of WEAPONS) {
      expect(idSet.has(w.id)).toBe(false); // No duplicate IDs
      idSet.add(w.id);

      expect(w.name.length).toBeGreaterThan(0);
      expect(["Sword", "Claymore", "Polearm", "Bow", "Catalyst"]).toContain(w.type);
      expect([1, 2, 3, 4, 5]).toContain(w.rarity);
      expect(w.baseAtk).toBeGreaterThan(0);
      expect(w.lvl1BaseAtk).toBeGreaterThan(0);
    }
  });

  it("has correct category distribution matching all released weapons", () => {
    const swords = WEAPONS.filter(w => w.type === "Sword");
    const claymores = WEAPONS.filter(w => w.type === "Claymore");
    const polearms = WEAPONS.filter(w => w.type === "Polearm");
    const bows = WEAPONS.filter(w => w.type === "Bow");
    const catalysts = WEAPONS.filter(w => w.type === "Catalyst");

    expect(swords.length).toBe(58);
    expect(claymores.length).toBe(48);
    expect(polearms.length).toBe(45);
    expect(bows.length).toBe(45);
    expect(catalysts.length).toBe(50);
  });
});

describe("Weapon Registry & Filtering (getWeaponsForCharacter)", () => {
  it("filters weapons correctly for Arlecchino (Polearm user)", () => {
    const available = getWeaponsForCharacter(arlecchino, WEAPONS);


    // Should include Arlecchino's specific polearms
    expect(available.some(w => w.id === "crimson-moons-semblance")).toBe(true);
    expect(available.some(w => w.id === "staff-of-homa")).toBe(true);
    expect(available.some(w => w.id === "deathmatch")).toBe(true);
    expect(available.some(w => w.id === "moonpiercer")).toBe(true);

    // Should include all supportive weapons across other classes
    expect(available.some(w => w.id === "a-thousand-floating-dreams")).toBe(true); // Catalyst support
    expect(available.some(w => w.id === "freedom-sworn")).toBe(true); // Sword support
    expect(available.some(w => w.id === "elegy-for-the-end")).toBe(true); // Bow support
    expect(available.some(w => w.id === "song-of-broken-pines")).toBe(true); // Claymore support
    expect(available.some(w => w.id === "thrilling-tales-of-dragon-slayers")).toBe(true); // Catalyst support
    expect(available.some(w => w.id === "key-of-khaj-nisut")).toBe(true); // Sword support
    expect(available.some(w => w.id === "peak-patrol-song")).toBe(true); // Sword support

    // Should EXCLUDE non-support weapons of other classes
    expect(available.some(w => w.id === "tome-of-the-eternal-flow")).toBe(false); // Catalyst self-only
  });

  it("filters weapons correctly for Neuvillette (Catalyst user)", () => {
    const available = getWeaponsForCharacter(neuvillette, WEAPONS);

    // Should include Neuvillette's catalyst
    expect(available.some(w => w.id === "tome-of-the-eternal-flow")).toBe(true);
    expect(available.some(w => w.id === "a-thousand-floating-dreams")).toBe(true);
    expect(available.some(w => w.id === "thrilling-tales-of-dragon-slayers")).toBe(true);

    // Should include external support weapons of other classes
    expect(available.some(w => w.id === "freedom-sworn")).toBe(true);
    expect(available.some(w => w.id === "elegy-for-the-end")).toBe(true);
    expect(available.some(w => w.id === "key-of-khaj-nisut")).toBe(true);

    // Should EXCLUDE non-support polearms like Crimson Moon's Semblance
    expect(available.some(w => w.id === "crimson-moons-semblance")).toBe(false);
  });
});

describe("A Thousand Floating Dreams Buff Resolver", () => {
  it("provides +40 EM at R1 to party members as a team buff", () => {
    const result = resolveExternalWeaponBuffs(
      [{ id: "1", weaponId: "a-thousand-floating-dreams", refinement: 1, enabled: true }],
      1000,
      arlecchino,
      true
    );

    expect(result.statDeltas.em).toBe(40);
    expect(result.sources.some(s => s.stat === "em" && s.value === 40)).toBe(true);
  });

  it("provides +48 EM at R5 to party members as a team buff", () => {
    const result = resolveExternalWeaponBuffs(
      [{ id: "1", weaponId: "a-thousand-floating-dreams", refinement: 5, enabled: true }],
      1000,
      arlecchino,
      true
    );

    expect(result.statDeltas.em).toBe(48);
    expect(result.sources.some(s => s.stat === "em" && s.value === 48)).toBe(true);
  });
});

describe("Crimson Moon's Semblance Buff Resolver", () => {
  it("provides +36% All DMG Bonus (12% base + 24% BoL >= 30%) at R1 for Arlecchino", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "crimson-moons-semblance",
        refinement: 1,
        enabled: true,
        inputs: { "has-bol": "1", "bol-ge-30": "1" },
      }],
      1016,
      arlecchino,
      true
    );

    expect(result.statDeltas.dmgBonus).toBe(36);
    expect(result.sources.length).toBe(2);
  });

  it("provides +84% All DMG Bonus (28% base + 56% BoL >= 30%) at R5 for Arlecchino", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "crimson-moons-semblance",
        refinement: 5,
        enabled: true,
        inputs: { "has-bol": "1", "bol-ge-30": "1" },
      }],
      1016,
      arlecchino,
      true
    );

    expect(result.statDeltas.dmgBonus).toBe(84);
  });

  it("does not apply self buffs if equipped externally on non-matching character", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "crimson-moons-semblance",
        refinement: 1,
        enabled: true,
        inputs: { "has-bol": "1", "bol-ge-30": "1" },
      }],
      1000,
      neuvillette, // Catalyst user
      true
    );

    expect(result.statDeltas.dmgBonus).toBeUndefined();
    expect(result.sources.length).toBe(0);
  });
});

describe("Freedom-Sworn Buff Resolver", () => {
  it("provides +16% NA/CA/Plunge DMG and +20% ATK at R1", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{ id: "1", weaponId: "freedom-sworn", refinement: 1, enabled: true }],
      baseAtk,
      arlecchino,
      true
    );

    expect(result.statDeltas.normalDmgBonus).toBe(16);
    expect(result.statDeltas.chargedDmgBonus).toBe(16);
    expect(result.statDeltas.plungeDmgBonus).toBe(16);
    expect(result.statDeltas.atk).toBe(200); // 20% of 1000
  });

  it("provides +32% NA/CA/Plunge DMG and +40% ATK at R5", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{ id: "1", weaponId: "freedom-sworn", refinement: 5, enabled: true }],
      baseAtk,
      arlecchino,
      true
    );

    expect(result.statDeltas.normalDmgBonus).toBe(32);
    expect(result.statDeltas.chargedDmgBonus).toBe(32);
    expect(result.statDeltas.plungeDmgBonus).toBe(32);
    expect(result.statDeltas.atk).toBe(400); // 40% of 1000
  });
});

describe("Elegy for the End & TTDS Buff Resolvers", () => {
  it("Elegy for the End provides +100 EM and +20% ATK at R1", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{ id: "1", weaponId: "elegy-for-the-end", refinement: 1, enabled: true }],
      baseAtk,
      arlecchino,
      true
    );

    expect(result.statDeltas.em).toBe(100);
    expect(result.statDeltas.atk).toBe(200);
  });

  it("TTDS provides +48% ATK at R5", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{ id: "1", weaponId: "thrilling-tales-of-dragon-slayers", refinement: 5, enabled: true }],
      baseAtk,
      arlecchino,
      true
    );

    expect(result.statDeltas.atk).toBe(480); // 48% of 1000
  });

  it("Key of Khaj-Nisut scales EM from wielder Max HP", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "key-of-khaj-nisut",
        refinement: 1,
        enabled: true,
        inputs: { "wielder-max-hp": "70000" },
      }],
      1000,
      arlecchino,
      true
    );

    // 0.2% of 70,000 = 140 EM
    expect(result.statDeltas.em).toBe(140);
  });
});

describe("Stacking and Master Toggle Control", () => {
  it("stacks multiple external supportive weapons additively", () => {
    const baseAtk = 1000;
    const weapons = [
      { id: "1", weaponId: "a-thousand-floating-dreams", refinement: 1, enabled: true }, // +40 EM
      { id: "2", weaponId: "elegy-for-the-end", refinement: 1, enabled: true }, // +100 EM, +200 ATK
      { id: "3", weaponId: "thrilling-tales-of-dragon-slayers", refinement: 5, enabled: true }, // +480 ATK
    ];

    const result = resolveExternalWeaponBuffs(weapons, baseAtk, arlecchino, true);
    expect(result.statDeltas.em).toBe(140); // 40 + 100
    expect(result.statDeltas.atk).toBe(680); // 200 + 480
    expect(result.sources.length).toBe(4);
  });

  it("bypasses all buffs when master toggle is disabled", () => {
    const weapons = [
      { id: "1", weaponId: "a-thousand-floating-dreams", refinement: 1, enabled: true },
      { id: "2", weaponId: "elegy-for-the-end", refinement: 1, enabled: true },
    ];

    const result = resolveExternalWeaponBuffs(weapons, 1000, arlecchino, false);
    expect(result.statDeltas.em).toBeUndefined();
    expect(result.sources.length).toBe(0);
  });

  it("ignores disabled weapons", () => {
    const weapons = [
      { id: "1", weaponId: "a-thousand-floating-dreams", refinement: 1, enabled: false },
      { id: "2", weaponId: "elegy-for-the-end", refinement: 1, enabled: true },
    ];

    const result = resolveExternalWeaponBuffs(weapons, 1000, arlecchino, true);
    expect(result.statDeltas.em).toBe(100);
  });
});

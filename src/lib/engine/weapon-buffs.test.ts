import { describe, it, expect } from "vitest";
import { resolveExternalWeaponBuffs } from "./weapon-buffs";
import { getWeaponsForCharacter, WEAPONS, weaponById } from "../../data/registry/weapons";
import { arlecchino } from "../../data/registry/characters/arlecchino";
import { neuvillette } from "../../data/registry/characters/neuvillette";
import { xilonen } from "../../data/registry/characters/xilonen";
import { flins } from "../../data/registry/characters/flins";


describe("Full Weapon Registry Integrity (Released Weapons)", () => {
  it("contains unique released weapons across all 5 weapon classes", () => {
    expect(WEAPONS.length).toBeGreaterThanOrEqual(240);

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

    expect(swords.length).toBe(59);
    expect(claymores.length).toBe(45);
    expect(polearms.length).toBe(43);
    expect(bows.length).toBe(50);
    expect(catalysts.length).toBe(55);
    expect(WEAPONS.length).toBe(252);
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
        inputs: { "wielder-max-hp": "70000", "key-hymn-stacks": "3" },
      }],
      1000,
      arlecchino,
      true
    );

    // 0.2% of 70,000 = 140 EM
    expect(result.statDeltas.em).toBe(140);
  });

  it("Athame Artis provides team ATK% and Hexerei bonus", () => {
    const baseAtk = 1000;
    const resultR1 = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "athame-artis",
        refinement: 1,
        enabled: true,
        inputs: { "athame-burst-hit": "1" },
      }],
      baseAtk,
      arlecchino,
      true
    );

    // +16% ATK at R1 (16% of 1000 = 160)
    expect(resultR1.statDeltas.atk).toBe(160);

    // With Hexerei: Secret Rite (+75% effect = 28% ATK = 280)
    const resultHex = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "athame-artis",
        refinement: 1,
        enabled: true,
        inputs: { "athame-burst-hit": "1", "athame-hexerei-active": "1" },
      }],
      baseAtk,
      arlecchino,
      true
    );
    expect(resultHex.statDeltas.atk).toBe(280);
  });

  it("Freedom-Sworn provides team NA/CA/Plunge DMG and ATK%", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "freedom-sworn",
        refinement: 1,
        enabled: true,
        inputs: { "freedom-sigils-active": "1" },
      }],
      baseAtk,
      arlecchino,
      true
    );

    // +16% NA/CA/Plunge DMG and +20% ATK
    expect(result.statDeltas.normalDmgBonus).toBe(16);
    expect(result.statDeltas.chargedDmgBonus).toBe(16);
    expect(result.statDeltas.plungeDmgBonus).toBe(16);
    expect(result.statDeltas.atk).toBe(200); // 20% of 1000
  });

  it("Sapwood Blade grants team EM upon leaf pickup", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "sapwood-blade",
        refinement: 5,
        enabled: true,
        inputs: { "sapwood-leaf-picked": "1" },
      }],
      1000,
      arlecchino,
      true
    );

    // R5 gives +120 EM
    expect(result.statDeltas.em).toBe(120);
  });

  it("Xiphos' Moonlight grants team Energy Recharge based on wielder EM", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "xiphos-moonlight",
        refinement: 5,
        enabled: true,
        inputs: { "xiphos-wielder-em": "1000" },
      }],
      1000,
      arlecchino,
      true
    );

    // R5: 1000 * 0.00072 * 0.3 * 100 = 21.6% ER
    expect(result.statDeltas.energyRecharge).toBeCloseTo(21.6, 1);
  });

  it("Song of Broken Pines provides party NA/CA/Plunge DMG and ATK% on banner trigger", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "song-of-broken-pines",
        refinement: 1,
        enabled: true,
        inputs: { "pines-banner-active": "1" },
      }],
      baseAtk,
      arlecchino,
      true
    );

    // +16% NA/CA/Plunge DMG and +20% ATK
    expect(result.statDeltas.normalDmgBonus).toBe(16);
    expect(result.statDeltas.atk).toBe(200); // 20% of 1000
  });

  it("Wolf's Gravestone grants +40~80% ATK to team when target HP < 30%", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "wolfs-gravestone",
        refinement: 5,
        enabled: true,
        inputs: { "wgs-party-buff-active": "1" },
      }],
      baseAtk,
      arlecchino,
      true
    );

    // R5 gives +80% ATK = 800
    expect(result.statDeltas.atk).toBe(800);
  });

  it("Makhaira Aquamarine shares 30% of wielder EM-based ATK to party", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "makhaira-aquamarine",
        refinement: 1,
        enabled: true,
        inputs: { "makhaira-wielder-em": "1000" },
      }],
      1000,
      arlecchino,
      true
    );

    // R1: 1000 * 0.24 * 0.3 = 72 flat ATK
    expect(result.statDeltas.atk).toBe(72);
  });

  it("Forest Regalia grants +60~120 EM on Leaf of Consciousness pickup", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "forest-regalia",
        refinement: 5,
        enabled: true,
        inputs: { "regalia-leaf-picked": "1" },
      }],
      1000,
      arlecchino,
      true
    );

    // R5 gives +120 EM
    expect(result.statDeltas.em).toBe(120);
  });

  it("Moonpiercer grants +16~32% ATK to team on Leaf of Revival pickup", () => {
    const baseAtk = 1000;
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "moonpiercer",
        refinement: 5,
        enabled: true,
        inputs: { "moonpiercer-leaf-picked": "1" },
      }],
      baseAtk,
      neuvillette,
      true
    );

    // R5 gives +32% ATK = 320 to Neuvillette (Catalyst wielder)
    expect(result.statDeltas.atk).toBe(320);
  });

  it("Crane's Echoing Call grants party +28~56% Plunging Attack DMG", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "cranes-echoing-call",
        refinement: 5,
        enabled: true,
        inputs: { "cranes-plunge-hit": "1" },
      }],
      1000,
      arlecchino,
      true
    );

    // R5 gives +56% Plunging Attack DMG to Arlecchino
    expect(result.statDeltas.plungeDmgBonus).toBe(56);
  });

  it("Hakushin Ring grants party +10~20% Elemental DMG on Electro reaction", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "hakushin-ring",
        refinement: 5,
        enabled: true,
        inputs: { "hakushin-reaction-active": "1" },
      }],
      1000,
      neuvillette,
      true
    );

    // R5 gives +20% Elemental DMG Bonus
    expect(result.statDeltas.dmgBonus).toBe(20);
  });

  it("Wandering Evenstar shares 30% of wielder EM-based ATK to party", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "wandering-evenstar",
        refinement: 1,
        enabled: true,
        inputs: { "evenstar-wielder-em": "1000" },
      }],
      1000,
      arlecchino,
      true
    );

    // R1: 1000 * 0.24 * 0.3 = 72 flat ATK
    expect(result.statDeltas.atk).toBe(72);
  });

  it("Golden Frostbound Oath grants party +20~40% Geo DMG when Moondrifts are active", () => {
    const result = resolveExternalWeaponBuffs(
      [{
        id: "1",
        weaponId: "golden-frostbound-oath",
        refinement: 5,
        enabled: true,
        inputs: { "frost-fae-moondrifts-active": "1" },
      }],
      1000,
      neuvillette,
      true
    );

    // R5 gives +40% Geo DMG to party members
    expect(result.statDeltas.geoDmgBonus).toBe(40);
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

  it("enforces maximum of 4 external weapons (ignores 5th weapon and beyond)", () => {
    const baseAtk = 1000;
    const weapons = [
      { id: "1", weaponId: "a-thousand-floating-dreams", refinement: 1, enabled: true }, // +40 EM
      { id: "2", weaponId: "elegy-for-the-end", refinement: 1, enabled: true }, // +100 EM, +200 ATK
      { id: "3", weaponId: "thrilling-tales-of-dragon-slayers", refinement: 5, enabled: true }, // +480 ATK
      { id: "4", weaponId: "freedom-sworn", refinement: 1, enabled: true }, // +200 ATK, +16% NA/CA/Plunge DMG
      { id: "5", weaponId: "forest-regalia", refinement: 1, enabled: true, inputs: { "leaf-of-consciousness": 1 } }, // +60 EM, should be IGNORED
    ];

    const result = resolveExternalWeaponBuffs(weapons, baseAtk, arlecchino, true);
    // Weapons 1 to 4 applied:
    // EM: 40 (ATFD) + 100 (Elegy) = 140. (Forest Regalia +60 is NOT applied)
    expect(result.statDeltas.em).toBe(140);
    // ATK: 200 (Elegy) + 480 (TTDS) + 200 (Freedom-Sworn) = 880
    expect(result.statDeltas.atk).toBe(880);
    // Normal DMG: 16% (Freedom-Sworn)
    expect(result.statDeltas.normalDmgBonus).toBe(16);

    // Only sources from the first 4 weapons exist
    const sourceWeaponIds = new Set(result.sources.map((s) => s.weaponId));
    expect(sourceWeaponIds.has("a-thousand-floating-dreams")).toBe(true);
    expect(sourceWeaponIds.has("elegy-for-the-end")).toBe(true);
    expect(sourceWeaponIds.has("thrilling-tales-of-dragon-slayers")).toBe(true);
    expect(sourceWeaponIds.has("freedom-sworn")).toBe(true);
    expect(sourceWeaponIds.has("forest-regalia")).toBe(false);
  });
});

describe("Refined Weapon Buffs Scaling & Mechanics", () => {
  it("A Thousand Blazing Suns scales Scorching Brilliance and Nightsoul bonus across R1-R5", () => {
    const weapon = weaponById("a-thousand-blazing-suns")!;
    expect(weapon).toBeDefined();

    const critBuff = weapon.buffs.find((b) => b.id === "blazing-suns-crit-dmg")!;
    const atkBuff = weapon.buffs.find((b) => b.id === "blazing-suns-atk")!;

    // Base Scorching Brilliance (without Nightsoul)
    expect(critBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "0" } })).toBe(20);
    expect(critBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "0" } })).toBe(40);
    expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "0" } })).toBe(280); // 28% of 1000
    expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "0" } })).toBe(560); // 56% of 1000

    // With Nightsoul's Blessing (+75% effect)
    expect(critBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "1" } })).toBe(35); // 20 * 1.75
    expect(critBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "1" } })).toBe(70); // 40 * 1.75
    expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "1" } })).toBe(490); // 28% * 1.75 * 1000
    expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "blazing-suns-nightsoul": "1" } })).toBe(980); // 56% * 1.75 * 1000
  });

  it("Blade of Atonement scales reaction EM (64..128) and Stellar Glimmer ATK% (16..32%) across R1-R5", () => {
    const weapon = weaponById("blade-of-atonement")!;
    expect(weapon).toBeDefined();

    const emBuff = weapon.buffs.find((b) => b.id === "atonement-reaction-em")!;
    const atkBuff = weapon.buffs.find((b) => b.id === "atonement-stellar-atk")!;

    expect(emBuff.refinementValues).toEqual([64, 80, 96, 112, 128]);
    expect(atkBuff.refinementValues).toEqual([16, 20, 24, 28, 32]);

    expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "atonement-reaction-active": "1" } })).toBe(64);
    expect(emBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "atonement-reaction-active": "1" } })).toBe(128);

    expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "atonement-stellar-glimmer-active": "1" } })).toBe(160); // 16% of 1000
    expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "atonement-stellar-glimmer-active": "1" } })).toBe(320); // 32% of 1000
  });

  it("Fang of the Mountain King scales Canopy's Favor stacks (10..20% per stack, up to 60..120% at 6 stacks)", () => {
    const weapon = weaponById("fang-of-the-mountain-king")!;
    expect(weapon).toBeDefined();

    const skillBuff = weapon.buffs.find((b) => b.id === "mountain-king-skill-dmg")!;
    const burstBuff = weapon.buffs.find((b) => b.id === "mountain-king-burst-dmg")!;

    expect(skillBuff.refinementValues).toEqual([60, 75, 90, 105, 120]);
    expect(burstBuff.refinementValues).toEqual([60, 75, 90, 105, 120]);

    // 1 stack at R1 and R5
    expect(skillBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "mountain-king-stacks": 1 } })).toBe(10);
    expect(skillBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "mountain-king-stacks": 1 } })).toBe(20);

    // 6 stacks at R1 and R5
    expect(skillBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "mountain-king-stacks": 6 } })).toBe(60);
    expect(skillBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "mountain-king-stacks": 6 } })).toBe(120);
    expect(burstBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "mountain-king-stacks": 6 } })).toBe(60);
    expect(burstBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "mountain-king-stacks": 6 } })).toBe(120);
  });
});

describe("Independent Weapon Damage Procs & Buff Refinements", () => {
  const PROC_WEAPON_IDS = [
    "ash-graven-drinking-horn",
    "eye-of-perception",
    "frostbearer",
    "skyward-atlas",
    "aquila-favonia",
    "sword-of-narzissenkreuz",
    "sword-of-descension",
    "fillet-blade",
    "the-flute",
    "kagotsurube-isshin",
    "skyward-spine",
    "crescent-pike",
    "dragonspine-spear",
    "halberd",
    "debate-club",
    "prototype-archaic",
    "snow-tombed-starsilver",
    "skyward-pride",
    "luxurious-sea-lord",
    "end-of-the-line",
    "messenger",
    "sequence-of-solitude",
    "skyward-harp",
    "the-viridescent-hunt",
  ];

  it("all 24 tracked proc-damage weapons have valid damageInstances with 5 refinement multipliers", () => {
    for (const id of PROC_WEAPON_IDS) {
      const w = weaponById(id);
      expect(w, `Weapon ${id} should exist`).toBeDefined();
      expect(w!.damageInstances, `Weapon ${id} should have damageInstances`).toBeDefined();
      expect(w!.damageInstances!.length).toBeGreaterThanOrEqual(1);

      for (const d of w!.damageInstances!) {
        expect(d.refinementMultipliers.length).toBe(5);
        expect(d.scaling).toMatch(/^(atk|hp|def)$/);
        expect(d.refinementMultipliers[0]).toBeGreaterThan(0);
        expect(d.refinementMultipliers[4]).toBeGreaterThanOrEqual(d.refinementMultipliers[0]);

        if (d.conditionKey) {
          expect(d.conditionMultipliers?.length).toBe(5);
          expect(d.conditionMultipliers![4]).toBeGreaterThan(d.refinementMultipliers[4]);
        }
      }
    }
  });

  it("Ash-Graven Drinking Horn scales 40~80% Max HP as AoE Physical DMG", () => {
    const w = weaponById("ash-graven-drinking-horn")!;
    const proc = w.damageInstances![0];
    expect(proc.scaling).toBe("hp");
    expect(proc.element).toBe("Physical");
    expect(proc.refinementMultipliers).toEqual([40, 50, 60, 70, 80]);
  });

  it("Eye of Perception scales 240~360% ATK as Physical DMG", () => {
    const w = weaponById("eye-of-perception")!;
    const proc = w.damageInstances![0];
    expect(proc.scaling).toBe("atk");
    expect(proc.element).toBe("Physical");
    expect(proc.refinementMultipliers).toEqual([240, 270, 300, 330, 360]);
  });

  it("Frostbearer has base icicle (80~140%) and Cryo-affected condition (200~360%)", () => {
    const w = weaponById("frostbearer")!;
    const proc = w.damageInstances![0];
    expect(proc.refinementMultipliers).toEqual([80, 95, 110, 125, 140]);
    expect(proc.conditionMultipliers).toEqual([200, 240, 280, 320, 360]);
    expect(proc.conditionKey).toBe("frostbearer-cryo");
  });

  it("Messenger has weakspot proc with guaranteedCrit flag", () => {
    const w = weaponById("messenger")!;
    const proc = w.damageInstances![0];
    expect(proc.refinementMultipliers).toEqual([100, 125, 150, 175, 200]);
    expect(proc.guaranteedCrit).toBe(true);
  });

  it("Golden Majesty series weapons have Shield Strength buffs (20~40%)", () => {
    const gmWeapons = ["summit-shaper", "vortex-vanquisher", "memory-of-dust", "the-unforged"];
    for (const id of gmWeapons) {
      const w = weaponById(id)!;
      expect(w).toBeDefined();
      const shieldBuff = w.buffs.find(b => b.stat === "shieldStrength");
      expect(shieldBuff, `${id} should have shieldStrength buff`).toBeDefined();
      expect(shieldBuff!.refinementValues).toEqual([20, 25, 30, 35, 40]);
      expect(shieldBuff!.isPercent).toBe(true);
    }
  });

  it("Sword of Descension sets isPercent: false on flat ATK for Traveler", () => {
    const w = weaponById("sword-of-descension")!;
    const flatAtkBuff = w.buffs.find(b => b.id === "descension-traveler-atk")!;
    expect(flatAtkBuff.isPercent).toBe(false);
    expect(flatAtkBuff.refinementValues).toEqual([66, 66, 66, 66, 66]);
  });

  it("Angelos' Heptades has party DMG bonus conditioned on shield active", () => {
    const w = weaponById("angelos-heptades")!;
    const partyBuff = w.buffs.find(b => b.id === "angelos-party-dmg")!;
    expect(partyBuff).toBeDefined();
    expect(partyBuff.isTeamBuff).toBe(true);
    expect(partyBuff.refinementValues).toEqual([26, 34, 42, 50, 58]);
  });

  it("Fractured Halo has party Lunar-Charged DMG bonus conditioned on shield active", () => {
    const w = weaponById("fractured-halo")!;
    const partyBuff = w.buffs.find(b => b.id === "halo-lunar-charged")!;
    expect(partyBuff).toBeDefined();
    expect(partyBuff.isTeamBuff).toBe(true);
    expect(partyBuff.refinementValues).toEqual([40, 50, 60, 70, 80]);
  });
});

describe("Peak Patrol Song Role Routing & Slot Resolution", () => {
  it("does NOT provide DEF% or self DMG bonus when equipped in 'support' slot on a Sword character", () => {
    const result = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "peak-patrol-song",
          refinement: 1,
          slot: "support",
          enabled: true,
          inputs: { "patrol-ode-stacks": "2", "patrol-wielder-def": "3200" },
        },
      ],
      1000,
      xilonen,
      true
    );

    // Self DEF% bonus (16% at R1) must NOT be applied to active character
    expect(result.statDeltas.def).toBeUndefined();

    // Only party Elemental DMG bonus (25.6% at R1) is applied; self DMG bonus (20%) is excluded
    expect(result.statDeltas.dmgBonus).toBe(25.6);
    expect(result.sources.length).toBe(1);
    expect(result.sources[0].buffId).toBe("patrol-party-elem-dmg");
    expect(result.sources[0].slot).toBe("support");
  });

  it("provides DEF% and self DMG bonus when equipped in 'wielder' slot on a Sword character", () => {
    const result = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "peak-patrol-song",
          refinement: 1,
          slot: "wielder",
          enabled: true,
          inputs: { "patrol-ode-stacks": "2", "patrol-wielder-def": "3200" },
        },
      ],
      1000,
      xilonen,
      true
    );

    // Self DEF% bonus is applied at R1 (16%)
    expect(result.statDeltas.def).toBe(16);

    // Both party Elemental DMG (25.6%) and self DMG (20%) are applied = 45.6%
    expect(result.statDeltas.dmgBonus).toBe(45.6);
    expect(result.sources.length).toBe(3);
    expect(result.sources.some(s => s.buffId === "patrol-self-def")).toBe(true);
    expect(result.sources.some(s => s.buffId === "patrol-self-dmg")).toBe(true);
    expect(result.sources.some(s => s.buffId === "patrol-party-elem-dmg")).toBe(true);
  });

  it("scales correctly at R5 when equipped in 'wielder' slot", () => {
    const result = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "peak-patrol-song",
          refinement: 5,
          slot: "wielder",
          enabled: true,
          inputs: { "patrol-ode-stacks": "2", "patrol-wielder-def": "3200" },
        },
      ],
      1000,
      xilonen,
      true
    );

    // Self DEF% bonus at R5 is 32%
    expect(result.statDeltas.def).toBe(32);

    // Party DMG (51.2%) + self DMG (40%) = 91.2%
    expect(result.statDeltas.dmgBonus).toBe(91.2);
  });

  it("provides only party DMG bonus to non-Sword characters (e.g. Arlecchino) even if slot is set to support", () => {
    const result = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "peak-patrol-song",
          refinement: 1,
          slot: "support",
          enabled: true,
          inputs: { "patrol-ode-stacks": "2", "patrol-wielder-def": "3200" },
        },
      ],
      1000,
      arlecchino,
      true
    );

    expect(result.statDeltas.def).toBeUndefined();
    expect(result.statDeltas.dmgBonus).toBe(25.6);
  });

  it("defaults to 'support' slot when slot property is omitted for supportive weapons", () => {
    const result = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "peak-patrol-song",
          refinement: 1,
          enabled: true,
          inputs: { "patrol-ode-stacks": "2", "patrol-wielder-def": "3200" },
        },
      ],
      1000,
      xilonen,
      true
    );

    // Must default to support so teammate's Peak Patrol Song doesn't pollute active character's stats
    expect(result.statDeltas.def).toBeUndefined();
    expect(result.statDeltas.dmgBonus).toBe(25.6);
  });
});

describe("Prospector's Shovel Buff Resolver", () => {
  it("provides base Electro-Charged DMG and Lunar-Charged DMG at R1 with Ascendant Gleam active", () => {
    const result = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "prospectors-shovel",
          refinement: 1,
          slot: "wielder",
          enabled: true,
          inputs: { "prospector-moonsign-active": "1" },
        },
      ],
      1000,
      flins,
      true
    );

    // R1: +48% Electro-Charged DMG
    expect(result.statDeltas.electroChargedDmgBonus).toBe(48);
    // R1: +12% base Lunar-Charged DMG + 12% Ascendant Gleam = 24%
    expect(result.statDeltas.lunarChargedDmgBonus).toBe(24);
  });

  it("provides scaled bonuses at R5 and respects Moonsign toggle", () => {
    // Test R5 with Ascendant Gleam ON
    const r5On = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "prospectors-shovel",
          refinement: 5,
          slot: "wielder",
          enabled: true,
          inputs: { "prospector-moonsign-active": "1" },
        },
      ],
      1000,
      flins,
      true
    );

    expect(r5On.statDeltas.electroChargedDmgBonus).toBe(96);
    // R5: +24% base + 24% Ascendant Gleam = 48%
    expect(r5On.statDeltas.lunarChargedDmgBonus).toBe(48);

    // Test R5 with Ascendant Gleam OFF
    const r5Off = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "prospectors-shovel",
          refinement: 5,
          slot: "wielder",
          enabled: true,
          inputs: { "prospector-moonsign-active": "0" },
        },
      ],
      1000,
      flins,
      true
    );

    expect(r5Off.statDeltas.electroChargedDmgBonus).toBe(96);
    // Base only: 24%
    expect(r5Off.statDeltas.lunarChargedDmgBonus).toBe(24);
  });
});

describe("Bloodsoaked Ruins Buff Resolver", () => {
  it("provides Lunar-Charged DMG after Burst and CRIT DMG on Requiem of Ruin at R1", () => {
    const result = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "bloodsoaked-ruins",
          refinement: 1,
          slot: "wielder",
          enabled: true,
          inputs: {
            "bloodsoaked-burst-active": "1",
            "bloodsoaked-requiem-active": "1",
          },
        },
      ],
      1000,
      flins,
      true
    );

    // R1: +36% Lunar-Charged DMG, +28% CRIT DMG
    expect(result.statDeltas.lunarChargedDmgBonus).toBe(36);
    expect(result.statDeltas.critDmg).toBe(28);
  });

  it("scales correctly to R5 and respects condition toggles", () => {
    // Both toggles ON at R5
    const r5BothOn = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "bloodsoaked-ruins",
          refinement: 5,
          slot: "wielder",
          enabled: true,
          inputs: {
            "bloodsoaked-burst-active": "1",
            "bloodsoaked-requiem-active": "1",
          },
        },
      ],
      1000,
      flins,
      true
    );

    expect(r5BothOn.statDeltas.lunarChargedDmgBonus).toBe(84);
    expect(r5BothOn.statDeltas.critDmg).toBe(56);

    // Burst OFF, Requiem ON
    const r5BurstOff = resolveExternalWeaponBuffs(
      [
        {
          id: "1",
          weaponId: "bloodsoaked-ruins",
          refinement: 5,
          slot: "wielder",
          enabled: true,
          inputs: {
            "bloodsoaked-burst-active": "0",
            "bloodsoaked-requiem-active": "1",
          },
        },
      ],
      1000,
      flins,
      true
    );

    expect(r5BurstOff.statDeltas.lunarChargedDmgBonus).toBeUndefined();
    expect(r5BurstOff.statDeltas.critDmg).toBe(56);
  });

  it("verifies Bloodsoaked Ruins config and signatureFor attribute", () => {
    const config = weaponById("bloodsoaked-ruins");
    expect(config).toBeDefined();
    expect(config?.passiveName).toBe("Mournful Tribute");
    expect(config?.signatureFor).toContain("flins");
  });

  describe("HoYoWiki Snezhnaya & Battle Pass Weapon Updates", () => {
    it("Whitelake Frostfeather has accurate HoYoWiki data, ATK stacks and Stellar Glimmer CRIT DMG", () => {
      const w = weaponById("whitelake-frostfeather")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Whitelake Frostfeather");
      expect(w.type).toBe("Sword");
      expect(w.rarity).toBe(5);
      expect(w.baseAtk).toBe(674);
      expect(w.subStat?.type).toBe("critRate");
      expect(w.subStat?.value).toBe(22.1);
      expect(w.description).toBe(
        "A longsword light as the feathers of a snow swan, and which stays pure and untainted at all times."
      );
      expect(w.passiveName).toBe("Snow Swan's Finale");
      expect(w.passiveDesc).toContain("Lake-Hued Lament");

      const atkBuff = w.buffs.find((b) => b.id === "whitelake-atk-stack")!;
      const critBuff = w.buffs.find((b) => b.id === "whitelake-stellar-crit-dmg")!;

      // 3 stacks R1: 3 * 8% = 24% of 1000 = 240
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "lake-hued-lament-stacks": 3 } })).toBe(240);
      // 3 stacks R5: 3 * 16% = 48% of 1000 = 480
      expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "lake-hued-lament-stacks": 3 } })).toBe(480);

      // Stellar Glimmer CRIT DMG at 3 stacks
      expect(critBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "lake-hued-lament-stacks": 3 } })).toBe(50);
      expect(critBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "lake-hued-lament-stacks": 3 } })).toBe(110);
      // < 3 stacks gives 0
      expect(critBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "lake-hued-lament-stacks": 2 } })).toBe(0);
    });

    it("Emberwell has accurate HoYoWiki data, ATK% and Stellar Glimmer DMG", () => {
      const w = weaponById("emberwell")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Emberwell");
      expect(w.type).toBe("Sword");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("em");
      expect(w.subStat?.value).toBe(165);
      expect(w.description).toBe(
        "A longsword that is entirely gemstone, said to be crafted for the path of righteousness. When unsheathed, it glows with the luster of blue flame."
      );
      expect(w.passiveName).toBe("Starfire Upon the Snowplains");

      const atkBuff = w.buffs.find((b) => b.id === "emberwell-reaction-atk")!;
      const glimmerBuff = w.buffs.find((b) => b.id === "emberwell-stellar-glimmer-dmg")!;

      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "emberwell-reaction-active": "1" } })).toBe(160);
      expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "emberwell-reaction-active": "1" } })).toBe(320);

      expect(glimmerBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "emberwell-stellar-glimmer-active": "1" } })).toBe(16);
      expect(glimmerBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "emberwell-stellar-glimmer-active": "1" } })).toBe(32);
    });

    it("Covenant of Frost and Snow has accurate HoYoWiki data and EM buff", () => {
      const w = weaponById("covenant-of-frost-and-snow")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Covenant of Frost and Snow");
      expect(w.type).toBe("Bow");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("defPct");
      expect(w.subStat?.value).toBe(51.7);
      expect(w.description).toBe(
        "A longbow crafted to preserve order. Its cold radiance perfectly emanates the ideals of absolute fairness and justice."
      );
      expect(w.passiveName).toBe("The Law's Equilibrium");

      const emBuff = w.buffs.find((b) => b.id === "covenant-em")!;
      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "covenant-skill-active": "1" } })).toBe(120);
      expect(emBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "covenant-skill-active": "1" } })).toBe(240);
    });

    it("Echoes of the Heart has accurate HoYoWiki data, EM and Stellar Glimmer DMG", () => {
      const w = weaponById("echoes-of-the-heart")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Echoes of the Heart");
      expect(w.type).toBe("Catalyst");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(565);
      expect(w.subStat?.type).toBe("atkPct");
      expect(w.subStat?.value).toBe(27.6);
      expect(w.description).toBe(
        "A Catalyst said to crystallize voice. Within it lies a sealed oath of loyalty, as well as a heart long since forgotten by mankind."
      );
      expect(w.passiveName).toBe("Echo of a Vow");

      const emBuff = w.buffs.find((b) => b.id === "echoes-heart-reaction-em")!;
      const glimmerBuff = w.buffs.find((b) => b.id === "echoes-heart-stellar-glimmer-dmg")!;

      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "echoes-heart-reaction-active": "1" } })).toBe(60);
      expect(emBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "echoes-heart-reaction-active": "1" } })).toBe(120);

      expect(glimmerBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "echoes-heart-stellar-glimmer-active": "1" } })).toBe(16);
      expect(glimmerBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "echoes-heart-stellar-glimmer-active": "1" } })).toBe(32);
    });

    it("Song of the Vigil has accurate HoYoWiki data and Stellar Glimmer ATK%", () => {
      const w = weaponById("song-of-the-vigil")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Song of the Vigil");
      expect(w.type).toBe("Polearm");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(565);
      expect(w.subStat?.type).toBe("em");
      expect(w.subStat?.value).toBe(110);
      expect(w.description).toBe(
        "A long spear that once stood guard over all. Today, it has found a new purpose with children and their games of make-believe."
      );
      expect(w.passiveName).toBe("Cadence of Days Gone By");

      const atkBuff = w.buffs.find((b) => b.id === "song-vigil-stellar-atk")!;
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "song-vigil-stellar-glimmer-active": "1" } })).toBe(200);
      expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "song-vigil-stellar-glimmer-active": "1" } })).toBe(400);
    });

    it("Blade of Atonement has accurate HoYoWiki description and passive", () => {
      const w = weaponById("blade-of-atonement")!;
      expect(w).toBeDefined();
      expect(w.description).toBe(
        "A greatsword passed down by the Luchkin. It is said that only the bravest warrior is qualified to wield it."
      );
      expect(w.passiveName).toBe("Repentance and Redemption");
    });

    it("Heretic's Molten Blade has accurate HoYoWiki data and Gleam distance scaling ATK%", () => {
      const w = weaponById("heretics-molten-blade")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Heretic's Molten Blade");
      expect(w.type).toBe("Sword");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("critRate");
      expect(w.subStat?.value).toBe(27.6);
      expect(w.description).toBe(
        "He drew this weapon once more when he first met that God of Flame, revered by all, but it had been too long since he had last used it."
      );
      expect(w.passiveName).toBe("Lone Light's Blessing");

      const atkBuff = w.buffs.find((b) => b.id === "heretics-gleam-atk")!;
      // Max distance R1: 36% of 1000 = 360
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "heretics-gleam-active": "1", "heretics-gleam-max": "1" } })).toBe(360);
      // Min distance R1: 18% of 1000 = 180
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "heretics-gleam-active": "1", "heretics-gleam-max": "0" } })).toBe(180);
      // Max distance R5: 72% of 1000 = 720
      expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "heretics-gleam-active": "1", "heretics-gleam-max": "1" } })).toBe(720);
      // Min distance R5: 36% of 1000 = 360
      expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "heretics-gleam-active": "1", "heretics-gleam-max": "0" } })).toBe(360);
    });

    it("Jade Vista has accurate HoYoWiki data and 3-stack priority resolution", () => {
      const w = weaponById("jade-vista")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Jade Vista");
      expect(w.type).toBe("Bow");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("critRate");
      expect(w.subStat?.value).toBe(27.6);
      expect(w.description).toBe(
        "A longbow of immense strength. It shines with the radiance of dreams even in the darkest of nights."
      );
      expect(w.passiveName).toBe("A Candle Woven From the Night");

      const emBuff = w.buffs.find((b) => b.id === "jade-vista-em")!;
      const atkBuff = w.buffs.find((b) => b.id === "jade-vista-atk")!;

      // 1 same, 2 diff at R1
      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "jade-vista-same-count": 1, "jade-vista-diff-count": 2 } })).toBe(64);
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "jade-vista-same-count": 1, "jade-vista-diff-count": 2 } })).toBe(240); // 2 * 12% = 24% of 1000

      // Priority cap: 2 same, 2 diff -> diff capped to 1 (3 total stacks)
      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "jade-vista-same-count": 2, "jade-vista-diff-count": 2 } })).toBe(128);
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "jade-vista-same-count": 2, "jade-vista-diff-count": 2 } })).toBe(120); // 1 * 12% = 12% of 1000
    });

    it("Forged by the Golden Melody has accurate HoYoWiki movements and Contrapuntal doubling", () => {
      const w = weaponById("forged-by-the-golden-melody")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Forged by the Golden Melody");
      expect(w.type).toBe("Claymore");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("critRate");
      expect(w.subStat?.value).toBe(27.6);
      expect(w.description).toBe(
        "A greatsword decorated in gold. Legend has it that it was the favored weapon of a certain exalted Harmost back in the distant past."
      );
      expect(w.passiveName).toBe("Day and Night in Counterpoint");

      const atkBuff = w.buffs.find((b) => b.id === "golden-melody-atk")!;
      const emBuff = w.buffs.find((b) => b.id === "golden-melody-em")!;
      const glimmerBuff = w.buffs.find((b) => b.id === "golden-melody-glimmer")!;

      // ATK movement R1 without Contrapuntal: 18% of 1000 = 180
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "golden-melody-atk-movement": "1", "golden-melody-contrapuntal": "0" } })).toBe(180);
      // ATK movement R1 with Contrapuntal: 36% of 1000 = 360
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "golden-melody-atk-movement": "1", "golden-melody-contrapuntal": "1" } })).toBe(360);

      // EM movement R5 with Contrapuntal: 240 * 2 = 480
      expect(emBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "golden-melody-em-movement": "1", "golden-melody-contrapuntal": "1" } })).toBe(480);

      // Stellar Glimmer movement R5 with Contrapuntal: 56 * 2 = 112%
      expect(glimmerBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "golden-melody-glimmer-movement": "1", "golden-melody-contrapuntal": "1" } })).toBe(112);
    });

    it("Clash of Kings has accurate HoYoWiki data, ATK% and EM from Laws of the Board", () => {
      const w = weaponById("clash-of-kings")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Clash of Kings");
      expect(w.type).toBe("Catalyst");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("critRate");
      expect(w.subStat?.value).toBe(27.6);
      expect(w.description).toBe(
        "A golden box lavishly inlaid with precious jewels. It houses a game much beloved by the kings of the sands."
      );
      expect(w.passiveName).toBe("Without Heed for Day nor Night");

      const atkBuff = w.buffs.find((b) => b.id === "clash-laws-atk")!;
      const emBuff = w.buffs.find((b) => b.id === "clash-laws-em")!;

      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "clash-laws-active": "1" } })).toBe(200);
      expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "clash-laws-active": "1" } })).toBe(400);

      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "clash-laws-active": "1" } })).toBe(100);
      expect(emBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "clash-laws-active": "1" } })).toBe(200);
    });

    it("Frostbreath has accurate HoYoWiki data and ATK% on reaction", () => {
      const w = weaponById("frostbreath")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Frostbreath");
      expect(w.type).toBe("Polearm");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("energyRecharge");
      expect(w.subStat?.value).toBe(45.9);
      expect(w.description).toBe(
        "A spear of solid ice imbued with an icy chill. It is said that it once belonged to the Belyi Tsar who ruled Snezhnaya in the distant past."
      );
      expect(w.passiveName).toBe("A Cast Real Far");

      const atkBuff = w.buffs.find((b) => b.id === "frostbreath-wielder-atk")!;
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "frostbreath-reaction-active": "1" } })).toBe(200);
      expect(atkBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "frostbreath-reaction-active": "1" } })).toBe(400);
    });

    it("Beyond the Chrysalis has accurate HoYoWiki data, CRIT DMG and Stellar Swirl DMG", () => {
      const w = weaponById("beyond-the-chrysalis")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Beyond the Chrysalis");
      expect(w.type).toBe("Sword");
      expect(w.rarity).toBe(5);
      expect(w.baseAtk).toBe(674);
      expect(w.subStat?.type).toBe("critDmg");
      expect(w.subStat?.value).toBe(44.1);
      expect(w.description).toBe(
        "A longsword brimming with light and color, and as weightless as a butterfly when brandished. It was once used by a certain individual to break bonds."
      );
      expect(w.passiveName).toBe("Dance of Wings Unbound");

      const critDmgBuff = w.buffs.find((b) => b.id === "chrysalis-crit-dmg")!;
      const swirlDmgBuff = w.buffs.find((b) => b.id === "chrysalis-stellar-swirl-dmg")!;

      expect(critDmgBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "chrysalis-winds-devotion": "1" } })).toBe(56);
      expect(critDmgBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "chrysalis-winds-devotion": "1" } })).toBe(120);

      expect(swirlDmgBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "chrysalis-winds-defiance": "1" } })).toBe(36);
      expect(swirlDmgBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "chrysalis-winds-defiance": "1" } })).toBe(72);
    });

    it("Hymn of the Maelstrom has accurate HoYoWiki data, self HP/Healing and party ATK% based on HP > 40k", () => {
      const w = weaponById("hymn-of-the-maelstrom")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Hymn of the Maelstrom");
      expect(w.type).toBe("Catalyst");
      expect(w.rarity).toBe(5);
      expect(w.baseAtk).toBe(542);
      expect(w.subStat?.type).toBe("hpPct");
      expect(w.subStat?.value).toBe(66.2);
      expect(w.description).toBe(
        "An exquisite lamp crafted out of blue chalcedony which looks like a treasure right out of a fairy tale. It is said that a song of praise, forgotten by all, slumbers sealed inside this lamp."
      );
      expect(w.passiveName).toBe("Rondo of Slumber");

      const hpBuff = w.buffs.find((b) => b.id === "maelstrom-self-hp")!;
      const healBuff = w.buffs.find((b) => b.id === "maelstrom-healing-bonus")!;
      const partyAtkBuff = w.buffs.find((b) => b.id === "maelstrom-active-atk")!;

      // 2 stacks R1 HP%: 2 * 4% = 8%
      expect(hpBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "maelstrom-healing-stacks": 2, "maelstrom-reaction-boost": "0" } })).toBe(8);
      expect(hpBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "maelstrom-healing-stacks": 2, "maelstrom-reaction-boost": "0" } })).toBe(16);

      // R1 Healing Bonus: 4%
      expect(healBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: {} })).toBe(4);

      // Party ATK%: HP = 50,000, exceed = 10,000 -> 10 * 0.4% = 4%. On baseAtk 1000 -> 40
      expect(partyAtkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "maelstrom-healing-stacks": 3, "wielder-max-hp": 50000, "maelstrom-reaction-boost": "0" } })).toBe(40);
      // With reaction boost: 40 * 1.75 = 70
      expect(partyAtkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "maelstrom-healing-stacks": 3, "wielder-max-hp": 50000, "maelstrom-reaction-boost": "1" } })).toBe(70);
    });

    it("New Bough has accurate HoYoWiki data, normal mode and Radiance mode bonuses", () => {
      const w = weaponById("new-bough")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("New Bough");
      expect(w.type).toBe("Sword");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("critDmg");
      expect(w.subStat?.value).toBe(55.1);
      expect(w.description).toBe(
        "A sword made from sacred wood, said to have once turned the tide of battle."
      );
      expect(w.passiveName).toBe("Wildgrowth");

      const atkBuff = w.buffs.find((b) => b.id === "new-bough-atk")!;
      const emBuff = w.buffs.find((b) => b.id === "new-bough-em")!;
      const glimmerBuff = w.buffs.find((b) => b.id === "new-bough-stellar-glimmer")!;

      // Normal mode 3 stacks R1: 3 * 4% = 12% of 1000 = 120
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "new-bough-verdant-stacks": 3, "new-bough-radiance-glimmer": "0" } })).toBe(120);
      // Radiance mode 3 stacks R1: 3 * 6% = 18% of 1000 = 180
      expect(atkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "new-bough-verdant-stacks": 3, "new-bough-radiance-glimmer": "1" } })).toBe(180);

      // Normal mode 3 stacks R1 EM: 3 * 20 = 60
      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "new-bough-verdant-stacks": 3, "new-bough-radiance-glimmer": "0" } })).toBe(60);
      // Radiance mode EM is 0
      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "new-bough-verdant-stacks": 3, "new-bough-radiance-glimmer": "1" } })).toBe(0);

      // Radiance mode 3 stacks R1 Glimmer: 3 * 8% = 24%
      expect(glimmerBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "new-bough-verdant-stacks": 3, "new-bough-radiance-glimmer": "1" } })).toBe(24);
      expect(glimmerBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "new-bough-verdant-stacks": 3, "new-bough-radiance-glimmer": "1" } })).toBe(48);
    });

    it("Breezeborne Refrain has accurate HoYoWiki data, ER% and party Stellar Glimmer DMG", () => {
      const w = weaponById("breezeborne-refrain")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Breezeborne Refrain");
      expect(w.type).toBe("Bow");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("critRate");
      expect(w.subStat?.value).toBe(27.6);
      expect(w.description).toBe(
        "A dark green bow string made out of pure and flawless gemstone. It never fails to summon a warm spring breeze whenever it is drawn."
      );
      expect(w.passiveName).toBe("Viper's Ballad");

      const erBuff = w.buffs.find((b) => b.id === "breezeborne-er")!;
      const glimmerBuff = w.buffs.find((b) => b.id === "breezeborne-party-stellar-glimmer")!;

      expect(erBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: {} })).toBe(20);
      expect(erBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: {} })).toBe(40);

      expect(glimmerBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "breezeborne-viper-active": "1" } })).toBe(24);
      expect(glimmerBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "breezeborne-viper-active": "1" } })).toBe(48);
    });

    it("Winter's Heavy Heart has accurate HoYoWiki data, team element scaling and Radiance mode", () => {
      const w = weaponById("winters-heavy-heart")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Winter's Heavy Heart");
      expect(w.type).toBe("Catalyst");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("critDmg");
      expect(w.subStat?.value).toBe(55.1);
      expect(w.description).toBe(
        "A ceremonial artifact formed from the purest ice and snow. Legend has it that generations of Snegovik lords used it in coronation ceremonies until five hundred years ago."
      );
      expect(w.passiveName).toBe("Secrets of Frost");

      const cryoEmBuff = w.buffs.find((b) => b.id === "winters-heart-em")!;
      const electroAtkBuff = w.buffs.find((b) => b.id === "winters-heart-atk")!;
      const radGlimmerBuff = w.buffs.find((b) => b.id === "winters-heart-stellar-glimmer")!;

      // Normal mode with 2 Cryo and 1 Electro
      expect(cryoEmBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "winters-heart-cryo-count": 2, "winters-heart-electro-count": 1, "winters-heart-radiance-glimmer": "0" } })).toBe(48);
      expect(electroAtkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "winters-heart-cryo-count": 2, "winters-heart-electro-count": 1, "winters-heart-radiance-glimmer": "0" } })).toBe(48);

      // Radiance mode disables Electro ATK, activates Radiance EM & Glimmer (2 Cryo + 1 Electro = 3 characters)
      expect(electroAtkBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "winters-heart-cryo-count": 2, "winters-heart-electro-count": 1, "winters-heart-radiance-glimmer": "1" } })).toBe(0);
      expect(cryoEmBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "winters-heart-cryo-count": 2, "winters-heart-electro-count": 1, "winters-heart-radiance-glimmer": "1" } })).toBe(60);
      expect(cryoEmBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "winters-heart-cryo-count": 2, "winters-heart-electro-count": 1, "winters-heart-radiance-glimmer": "1" } })).toBe(120);
      expect(radGlimmerBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "winters-heart-cryo-count": 2, "winters-heart-electro-count": 1, "winters-heart-radiance-glimmer": "1" } })).toBe(18);
      expect(radGlimmerBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "winters-heart-cryo-count": 2, "winters-heart-electro-count": 1, "winters-heart-radiance-glimmer": "1" } })).toBe(36);
    });

    it("Silver Light has accurate HoYoWiki data and EM stack scaling", () => {
      const w = weaponById("silver-light")!;
      expect(w).toBeDefined();
      expect(w.name).toBe("Silver Light");
      expect(w.type).toBe("Sword");
      expect(w.rarity).toBe(4);
      expect(w.baseAtk).toBe(510);
      expect(w.subStat?.type).toBe("atkPct");
      expect(w.subStat?.value).toBe(41.4);
      expect(w.description).toBe(
        "A longsword left behind by Wind Reader, one of the Three Hermits of Guizang in Liyue. Legend has it that it was forged out of sacred silver descended from the heavens, and that it once cleaved flowing sea water into two."
      );
      expect(w.passiveName).toBe("Radiance on the Water");

      const emBuff = w.buffs.find((b) => b.id === "silver-light-em")!;
      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "silver-light-stacks": 1 } })).toBe(52);
      expect(emBuff.compute!(1, { refinement: 1, baseAtk: 1000, inputs: { "silver-light-stacks": 2 } })).toBe(104);
      expect(emBuff.compute!(5, { refinement: 5, baseAtk: 1000, inputs: { "silver-light-stacks": 2 } })).toBe(208);
    });
  });
});



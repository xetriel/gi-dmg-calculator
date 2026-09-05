import { describe, it, expect } from "vitest";
import { resolveExternalWeaponBuffs } from "./weapon-buffs";
import { getWeaponsForCharacter, WEAPONS, weaponById } from "../../data/registry/weapons";
import { arlecchino } from "../../data/registry/characters/arlecchino";
import { neuvillette } from "../../data/registry/characters/neuvillette";


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

    expect(swords.length).toBe(56);
    expect(claymores.length).toBe(45);
    expect(polearms.length).toBe(43);
    expect(bows.length).toBe(49);
    expect(catalysts.length).toBe(53);
    expect(WEAPONS.length).toBe(246);
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

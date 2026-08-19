import type { WeaponConfig } from "./types";

export const WEAPON_REGISTRY: WeaponConfig[] = [
  // ==========================================
  // CATALYSTS
  // ==========================================
  {
    id: "a-thousand-floating-dreams",
    name: "A Thousand Floating Dreams",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: {
      type: "em",
      label: "Elemental Mastery",
      value: 265,
      baseValue: 58,
    },
    passiveName: "A Thousand Nights' Dawnsong",
    passiveDesc:
      "Party members other than the equipping character will provide the equipping character with buffs based on whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase Elemental Mastery by 32~64. If not, increase the equipping character's DMG Bonus from their Elemental Type by 10~26%. Each of the aforementioned effects can have up to 3 stacks. Additionally, all nearby party members other than the equipping character will have their Elemental Mastery increased by 40~48. Multiple such effects from multiple such weapons can stack.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "element-match-stacks",
        label: "Same-Element Party Members (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 0,
        hint: "Increases EM by 32~64 per matching element member (for equipping wielder)",
      },
      {
        id: "element-diff-stacks",
        label: "Diff-Element Party Members (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "Increases Elemental DMG Bonus by 10~26% per different element member (for equipping wielder)",
      },
    ],
    buffs: [
      {
        id: "party-em",
        label: "Party EM (A Thousand Floating Dreams)",
        description: "Increases all other nearby party members' Elemental Mastery by 40~48",
        stat: "em",
        refinementValues: [40, 42, 44, 46, 48],
        isTeamBuff: true,
        compute: (r) => [40, 42, 44, 46, 48][r - 1],
      },
      {
        id: "same-element-em",
        label: "Same Element EM (A Thousand Floating Dreams)",
        description: "+32~64 EM per same-element party member",
        stat: "em",
        refinementValues: [32, 40, 48, 56, 64],
        isTeamBuff: false,
        conditionKey: "element-match-stacks",
        compute: (r, ctx) => {
          const stacks = Number(ctx.inputs?.["element-match-stacks"] ?? 0);
          const perStack = [32, 40, 48, 56, 64][r - 1];
          return stacks * perStack;
        },
      },
      {
        id: "diff-element-dmg-bonus",
        label: "Diff Element DMG Bonus (A Thousand Floating Dreams)",
        description: "+10~26% Elemental DMG Bonus per diff-element party member",
        stat: "dmgBonus",
        refinementValues: [10, 14, 18, 22, 26],
        isTeamBuff: false,
        conditionKey: "element-diff-stacks",
        compute: (r, ctx) => {
          const stacks = Number(ctx.inputs?.["element-diff-stacks"] ?? 3);
          const perStack = [10, 14, 18, 22, 26][r - 1];
          return stacks * perStack;
        },
      },
    ],
    signatureFor: ["nahida"],
  },
  {
    id: "thrilling-tales-of-dragon-slayers",
    name: "Thrilling Tales of Dragon Slayers",
    type: "Catalyst",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: {
      type: "hpPct",
      label: "HP%",
      value: 35.2,
      baseValue: 7.7,
    },
    passiveName: "Heritage",
    passiveDesc:
      "When switching characters, the new character taking the field has their ATK increased by 24~48% for 10s. This effect can only occur once every 20s.",
    isSupport: true,
    buffType: "team",
    buffs: [
      {
        id: "ttds-atk",
        label: "ATK% (Thrilling Tales of Dragon Slayers)",
        description: "Active character on-field gains +24~48% ATK",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: true,
        isPercent: true,
        compute: (r, ctx) => {
          const pct = [24, 30, 36, 42, 48][r - 1];
          return (pct / 100) * ctx.baseAtk;
        },
      },
    ],
  },
  {
    id: "hakushin-ring",
    name: "Hakushin Ring",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: {
      type: "energyRecharge",
      label: "Energy Recharge%",
      value: 30.6,
      baseValue: 6.7,
    },
    passiveName: "Sakura Saiguu",
    passiveDesc:
      "After the character equipping this weapon triggers an Electro-based reaction, nearby party members of an Elemental Type involved in the reaction gain a 10~20% Elemental DMG Bonus for their respective Elemental Type for 6s.",
    isSupport: true,
    buffType: "team",
    buffs: [
      {
        id: "hakushin-elem-dmg",
        label: "Elemental DMG Bonus (Hakushin Ring)",
        description: "Party members involved in Electro reaction gain +10~20% Elemental DMG Bonus",
        stat: "dmgBonus",
        refinementValues: [10, 12.5, 15, 17.5, 20],
        isTeamBuff: true,
        compute: (r) => [10, 12.5, 15, 17.5, 20][r - 1],
      },
    ],
  },
  {
    id: "prototype-amber",
    name: "Prototype Amber",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: {
      type: "hpPct",
      label: "HP%",
      value: 41.3,
      baseValue: 9.0,
    },
    passiveName: "Gilding",
    passiveDesc:
      "Using an Elemental Burst regenerates 4~6 Energy every 2s for 6s. All party members will regenerate 4~6% HP every 2s for this duration.",
    isSupport: true,
    buffType: "team",
    buffs: [
      {
        id: "amber-healing",
        label: "Team HP Regen% (Prototype Amber)",
        stat: "healingBonus",
        refinementValues: [12, 13.5, 15, 16.5, 18],
        isTeamBuff: true,
        compute: (r) => [12, 13.5, 15, 16.5, 18][r - 1],
      },
    ],
  },
  {
    id: "tome-of-the-eternal-flow",
    name: "Tome of the Eternal Flow",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: {
      type: "critDmg",
      label: "CRIT DMG%",
      value: 88.2,
      baseValue: 19.2,
    },
    passiveName: "Aeon Wave",
    passiveDesc:
      "HP is increased by 16~32%. When current HP increases or decreases, Charged Attack DMG is increased by 14~30% for 4s. Max 3 stacks. At 3 stacks, restores 8~12 Energy.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "aeon-wave-stacks",
        label: "Aeon Wave HP Change Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+14~30% Charged Attack DMG per stack",
      },
    ],
    buffs: [
      {
        id: "tome-hp",
        label: "HP% (Tome of the Eternal Flow)",
        stat: "hp",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
      },
      {
        id: "tome-ca-dmg",
        label: "Charged Attack DMG Bonus (Tome of the Eternal Flow)",
        stat: "chargedDmgBonus",
        refinementValues: [14, 17.5, 21, 24.5, 28],
        isTeamBuff: false,
        conditionKey: "aeon-wave-stacks",
        compute: (r, ctx) => {
          const stacks = Number(ctx.inputs?.["aeon-wave-stacks"] ?? 3);
          const perStack = [14, 17.5, 21, 24.5, 28][r - 1];
          return stacks * perStack;
        },
      },
    ],
    signatureFor: ["neuvillette"],
  },

  // ==========================================
  // SWORDS
  // ==========================================
  {
    id: "freedom-sworn",
    name: "Freedom-Sworn",
    type: "Sword",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: {
      type: "em",
      label: "Elemental Mastery",
      value: 198,
      baseValue: 43,
    },
    passiveName: "Revolutionary Chorale",
    passiveDesc:
      "A part of the 'Millennial Movement' that wanders amidst the winds. Increases DMG by 10~20%. When triggering Elemental Reactions, the wielder gains Sigils of Rebellion. When you possess 2 Sigils, all nearby party members gain 'Millennial Movement: Song of Resistance': Normal, Charged, and Plunging Attack DMG is increased by 16~32% and ATK is increased by 20~40% for 12s.",
    isSupport: true,
    buffType: "both",
    buffs: [
      {
        id: "freedom-self-dmg",
        label: "All DMG Bonus (Freedom-Sworn Wielder)",
        stat: "dmgBonus",
        refinementValues: [10, 12.5, 15, 17.5, 20],
        isTeamBuff: false,
        compute: (r) => [10, 12.5, 15, 17.5, 20][r - 1],
      },
      {
        id: "freedom-party-na-ca-plunge",
        label: "NA/CA/Plunge DMG Bonus (Freedom-Sworn Millennial Movement)",
        description: "All party members gain +16~32% Normal, Charged, and Plunging Attack DMG",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        compute: (r) => [16, 20, 24, 28, 32][r - 1],
      },
      {
        id: "freedom-party-charged",
        label: "Charged Attack DMG Bonus (Freedom-Sworn Millennial Movement)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        compute: (r) => [16, 20, 24, 28, 32][r - 1],
      },
      {
        id: "freedom-party-plunge",
        label: "Plunging Attack DMG Bonus (Freedom-Sworn Millennial Movement)",
        stat: "plungeDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        compute: (r) => [16, 20, 24, 28, 32][r - 1],
      },
      {
        id: "freedom-party-atk",
        label: "ATK% (Freedom-Sworn Millennial Movement)",
        description: "All party members gain +20~40% ATK",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: true,
        isPercent: true,
        compute: (r, ctx) => {
          const pct = [20, 25, 30, 35, 40][r - 1];
          return (pct / 100) * ctx.baseAtk;
        },
      },
    ],
    signatureFor: ["kazuha"],
  },
  {
    id: "key-of-khaj-nisut",
    name: "Key of Khaj-Nisut",
    type: "Sword",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: {
      type: "hpPct",
      label: "HP%",
      value: 66.2,
      baseValue: 14.4,
    },
    passiveName: "Sunken Song of the Sands",
    passiveDesc:
      "HP increased by 20~40%. When an Elemental Skill hits opponents, gains the Grand Hymn effect for 20s. This effect increases the equipping character's Elemental Mastery by 0.12~0.24% of their Max HP. This effect can trigger once every 0.3s. Max 3 stacks. When 3 stacks are gained, the Elemental Mastery of all nearby party members will be increased by 0.2~0.4% of the equipping character's Max HP for 20s.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "wielder-max-hp",
        label: "Key Wielder Max HP",
        control: "stacks",
        max: 100000,
        defaultValue: 65000,
        hint: "Max HP of the Key of Khaj-Nisut wielder (e.g. Nilou / Furina / Kuki)",
      },
    ],
    buffs: [
      {
        id: "key-party-em",
        label: "Party EM (Key of Khaj-Nisut 3 Stacks)",
        description: "+0.2~0.4% of wielder's Max HP shared to party",
        stat: "em",
        refinementValues: [0.2, 0.25, 0.3, 0.35, 0.4],
        isTeamBuff: true,
        compute: (r, ctx) => {
          const hp = Number(ctx.inputs?.["wielder-max-hp"] ?? 65000);
          const ratio = [0.002, 0.0025, 0.003, 0.0035, 0.004][r - 1];
          return hp * ratio;
        },
      },
    ],
    signatureFor: ["nilou"],
  },
  {
    id: "xiphos-moonlight",
    name: "Xiphos' Moonlight",
    type: "Sword",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: {
      type: "em",
      label: "Elemental Mastery",
      value: 165,
      baseValue: 36,
    },
    passiveName: "Jinni's Whisper",
    passiveDesc:
      "The equipping character will gain 0.036~0.072% Energy Recharge for each point of Elemental Mastery they possess for 12s. Nearby party members will gain 30% of this buff for the same duration.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "wielder-em",
        label: "Wielder EM",
        control: "stacks",
        max: 2000,
        defaultValue: 900,
        hint: "EM of the character equipping Xiphos (e.g. Kazuha)",
      },
    ],
    buffs: [
      {
        id: "xiphos-party-er",
        label: "Party Energy Recharge% (Xiphos' Moonlight)",
        stat: "energyRecharge",
        refinementValues: [0.0108, 0.0135, 0.0162, 0.0189, 0.0216],
        isTeamBuff: true,
        compute: (r, ctx) => {
          const wielderEm = Number(ctx.inputs?.["wielder-em"] ?? 900);
          const perEm = [0.00036 * 0.3, 0.00045 * 0.3, 0.00054 * 0.3, 0.00063 * 0.3, 0.00072 * 0.3][r - 1];
          return wielderEm * perEm * 100;
        },
      },
    ],
  },
  {
    id: "sapwood-blade",
    name: "Sapwood Blade",
    type: "Sword",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: {
      type: "energyRecharge",
      label: "Energy Recharge%",
      value: 30.6,
      baseValue: 6.7,
    },
    passiveName: "Forest Sanctuary",
    passiveDesc:
      "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for up to 10s. When picked up, the Leaf will grant the character 60~120 Elemental Mastery for 12s.",
    isSupport: true,
    buffType: "team",
    buffs: [
      {
        id: "sapwood-leaf-em",
        label: "Leaf of Consciousness EM (Sapwood Blade)",
        description: "Active character picks up Leaf of Consciousness for +60~120 EM",
        stat: "em",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: true,
        compute: (r) => [60, 75, 90, 105, 120][r - 1],
      },
    ],
  },
  {
    id: "peak-patrol-song",
    name: "Peak Patrol Song",
    type: "Sword",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: {
      type: "defPct",
      label: "DEF%",
      value: 82.7,
      baseValue: 18.0,
    },
    passiveName: "Ode to Flowers",
    passiveDesc:
      "Hitting opponents with Normal or Plunging Attacks grants 1 stack of Ode to Flowers: +8~16% DEF for 6s. At 2 stacks or when hitting with Nightsoul-aligned attacks, all nearby party members gain 8~16% All Elemental DMG Bonus for 15s. Additionally, every 1,000 DEF of the wielder increases this bonus by 8~16%, up to 25.6~51.2%.",
    isSupport: true,
    buffType: "both",
    buffs: [
      {
        id: "peak-party-elem-dmg",
        label: "All Elemental DMG Bonus (Peak Patrol Song)",
        description: "Nearby party members gain +8~16% (up to +25.6~51.2%) All Elemental DMG Bonus",
        stat: "dmgBonus",
        refinementValues: [25.6, 32, 38.4, 44.8, 51.2],
        isTeamBuff: true,
        compute: (r) => [25.6, 32, 38.4, 44.8, 51.2][r - 1],
      },
    ],
    signatureFor: ["xilonen"],
  },

  // ==========================================
  // BOWS
  // ==========================================
  {
    id: "elegy-for-the-end",
    name: "Elegy for the End",
    type: "Bow",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: {
      type: "energyRecharge",
      label: "Energy Recharge%",
      value: 55.1,
      baseValue: 12.0,
    },
    passiveName: "The Parting Refrain",
    passiveDesc:
      "A part of the 'Millennial Movement' that wanders amidst the winds. Increases Elemental Mastery by 60~120. When the Elemental Skills or Elemental Bursts of the character wielding this weapon hit opponents, the character gains a Sigil of Remembrance. When you possess 4 Sigils, all nearby party members gain 'Millennial Movement: Banner of Command': Elemental Mastery is increased by 100~200 and ATK is increased by 20~40% for 12s.",
    isSupport: true,
    buffType: "both",
    buffs: [
      {
        id: "elegy-party-em",
        label: "Party EM (Elegy for the End Millennial Movement)",
        description: "All party members gain +100~200 Elemental Mastery",
        stat: "em",
        refinementValues: [100, 125, 150, 175, 200],
        isTeamBuff: true,
        compute: (r) => [100, 125, 150, 175, 200][r - 1],
      },
      {
        id: "elegy-party-atk",
        label: "ATK% (Elegy for the End Millennial Movement)",
        description: "All party members gain +20~40% ATK",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: true,
        isPercent: true,
        compute: (r, ctx) => {
          const pct = [20, 25, 30, 35, 40][r - 1];
          return (pct / 100) * ctx.baseAtk;
        },
      },
    ],
    signatureFor: ["venti"],
  },
  {
    id: "favonius-warbow",
    name: "Favonius Warbow",
    type: "Bow",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: {
      type: "energyRecharge",
      label: "Energy Recharge%",
      value: 61.3,
      baseValue: 13.3,
    },
    passiveName: "Windfall",
    passiveDesc:
      "CRIT hits have a 60~100% chance to generate 1 Elemental Orb, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },

  // ==========================================
  // CLAYMORES
  // ==========================================
  {
    id: "song-of-broken-pines",
    name: "Song of Broken Pines",
    type: "Claymore",
    rarity: 5,
    baseAtk: 741,
    lvl1BaseAtk: 49,
    subStat: {
      type: "physicalDmgBonus",
      label: "Physical DMG Bonus%",
      value: 20.7,
      baseValue: 4.5,
    },
    passiveName: "Rebel's Banner-Hymn",
    passiveDesc:
      "A part of the 'Millennial Movement' that wanders amidst the winds. Increases ATK by 16~32%. Hitting opponents with Normal or Charged Attacks grants Sigils of Whispers. At 4 Sigils, all nearby party members gain 'Millennial Movement: Banner-Hymn': Normal ATK SPD is increased by 12~24% and ATK is increased by 20~40% for 12s.",
    isSupport: true,
    buffType: "both",
    buffs: [
      {
        id: "pines-party-atk",
        label: "ATK% (Song of Broken Pines Millennial Movement)",
        description: "All party members gain +20~40% ATK",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: true,
        isPercent: true,
        compute: (r, ctx) => {
          const pct = [20, 25, 30, 35, 40][r - 1];
          return (pct / 100) * ctx.baseAtk;
        },
      },
    ],
    signatureFor: ["eula"],
  },
  {
    id: "wolfs-gravestone",
    name: "Wolf's Gravestone",
    type: "Claymore",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: {
      type: "atkPct",
      label: "ATK%",
      value: 49.6,
      baseValue: 10.8,
    },
    passiveName: "Wolfish Tracker",
    passiveDesc:
      "Increases ATK by 20~40%. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by 40~80% for 12s. Can only occur once every 30s.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "wgs-low-hp-proc",
        label: "Opponent HP < 30% (WGS Buff Active)",
        control: "toggle",
        defaultValue: 1,
        hint: "+40~80% party ATK buff active",
      },
    ],
    buffs: [
      {
        id: "wgs-party-atk",
        label: "ATK% (Wolf's Gravestone Party Buff)",
        description: "All party members gain +40~80% ATK vs low HP enemies",
        stat: "atk",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "wgs-low-hp-proc",
        compute: (r, ctx) => {
          const on = (ctx.inputs?.["wgs-low-hp-proc"] ?? "1") === "1" || Number(ctx.inputs?.["wgs-low-hp-proc"] ?? 1) > 0;
          if (!on) return 0;
          const pct = [40, 50, 60, 70, 80][r - 1];
          return (pct / 100) * ctx.baseAtk;
        },
      },
    ],
    signatureFor: ["diluc"],
  },
  {
    id: "forest-regalia",
    name: "Forest Regalia",
    type: "Claymore",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: {
      type: "energyRecharge",
      label: "Energy Recharge%",
      value: 30.6,
      baseValue: 6.7,
    },
    passiveName: "Forest Sanctuary",
    passiveDesc:
      "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for up to 10s. When picked up, the Leaf will grant the character 60~120 Elemental Mastery for 12s.",
    isSupport: true,
    buffType: "team",
    buffs: [
      {
        id: "forest-leaf-em",
        label: "Leaf of Consciousness EM (Forest Regalia)",
        description: "Active character picks up Leaf of Consciousness for +60~120 EM",
        stat: "em",
        refinementValues: [60, 75, 90, 105, 120],
        isTeamBuff: true,
        compute: (r) => [60, 75, 90, 105, 120][r - 1],
      },
    ],
  },

  // ==========================================
  // POLEARMS
  // ==========================================
  {
    id: "crimson-moons-semblance",
    name: "Crimson Moon's Semblance",
    type: "Polearm",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: {
      type: "critRate",
      label: "CRIT Rate%",
      value: 22.1,
      baseValue: 4.8,
    },
    passiveName: "Ashen Sun's Shadow",
    passiveDesc:
      "Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. This effect can be triggered up to once every 14s. In addition, when the equipping character has a Bond of Life, they gain a 12~28% DMG Bonus; if the value of the Bond of Life is greater than or equal to 30% of Max HP, then gain an additional 24~56% DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "has-bol",
        label: "Has Bond of Life",
        control: "toggle",
        defaultValue: 1,
        hint: "Grants +12~28% DMG Bonus while Bond of Life is active",
      },
      {
        id: "bol-ge-30",
        label: "Bond of Life >= 30% Max HP",
        control: "toggle",
        defaultValue: 1,
        hint: "Grants additional +24~56% DMG Bonus (Total +36~84% All DMG Bonus)",
      },
    ],
    buffs: [
      {
        id: "semblance-bol-dmg",
        label: "Bond of Life DMG Bonus (Crimson Moon's Semblance)",
        description: "+12~28% DMG Bonus when equipping character has Bond of Life",
        stat: "dmgBonus",
        refinementValues: [12, 16, 20, 24, 28],
        isTeamBuff: false,
        conditionKey: "has-bol",
        compute: (r, ctx) => {
          const on = (ctx.inputs?.["has-bol"] ?? "1") === "1" || Number(ctx.inputs?.["has-bol"] ?? 1) > 0;
          if (!on) return 0;
          return [12, 16, 20, 24, 28][r - 1];
        },
      },
      {
        id: "semblance-bol-30-dmg",
        label: "High BoL DMG Bonus (Crimson Moon's Semblance)",
        description: "+24~56% additional DMG Bonus when Bond of Life >= 30%",
        stat: "dmgBonus",
        refinementValues: [24, 32, 40, 48, 56],
        isTeamBuff: false,
        conditionKey: "bol-ge-30",
        compute: (r, ctx) => {
          const on = (ctx.inputs?.["bol-ge-30"] ?? "1") === "1" || Number(ctx.inputs?.["bol-ge-30"] ?? 1) > 0;
          if (!on) return 0;
          return [24, 32, 40, 48, 56][r - 1];
        },
      },
    ],
    signatureFor: ["arlecchino"],
  },
  {
    id: "moonpiercer",
    name: "Moonpiercer",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: {
      type: "em",
      label: "Elemental Mastery",
      value: 110,
      baseValue: 24,
    },
    passiveName: "Stillwood Moonshadow",
    passiveDesc:
      "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be created around the character for up to 10s. When picked up, the Leaf will grant the character 16~32% ATK for 12s.",
    isSupport: true,
    buffType: "team",
    buffs: [
      {
        id: "moonpiercer-leaf-atk",
        label: "Leaf of Revival ATK% (Moonpiercer)",
        description: "Active character picks up Leaf of Revival for +16~32% ATK",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        isPercent: true,
        compute: (r, ctx) => {
          const pct = [16, 20, 24, 28, 32][r - 1];
          return (pct / 100) * ctx.baseAtk;
        },
      },
    ],
  },
  {
    id: "staff-of-homa",
    name: "Staff of Homa",
    type: "Polearm",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: {
      type: "critDmg",
      label: "CRIT DMG%",
      value: 66.2,
      baseValue: 14.4,
    },
    passiveName: "Reckless Cinnabar",
    passiveDesc:
      "HP increased by 20~40%. Additionally, provides an ATK Bonus based on 0.8~1.6% of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional 1~2% of Max HP.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "homa-low-hp",
        label: "HP < 50% (Staff of Homa Bonus)",
        control: "toggle",
        defaultValue: 1,
        hint: "+1.0~2.0% Max HP as additional flat ATK",
      },
      {
        id: "wielder-hp",
        label: "Character Max HP",
        control: "stacks",
        max: 100000,
        defaultValue: 35000,
        hint: "Max HP used for Homa ATK conversion",
      },
    ],
    buffs: [
      {
        id: "homa-hp-pct",
        label: "HP% (Staff of Homa)",
        stat: "hp",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
      },
      {
        id: "homa-atk-from-hp",
        label: "ATK from Max HP (Staff of Homa)",
        stat: "atk",
        refinementValues: [0.8, 1.0, 1.2, 1.4, 1.6],
        isTeamBuff: false,
        compute: (r, ctx) => {
          const hp = Number(ctx.inputs?.["wielder-hp"] ?? 35000);
          const ratio = [0.008, 0.01, 0.012, 0.014, 0.016][r - 1];
          const isLowHp = (ctx.inputs?.["homa-low-hp"] ?? "1") === "1" || Number(ctx.inputs?.["homa-low-hp"] ?? 1) > 0;
          const lowHpRatio = isLowHp ? [0.01, 0.0125, 0.015, 0.0175, 0.02][r - 1] : 0;
          return hp * (ratio + lowHpRatio);
        },
      },
    ],
    signatureFor: ["hu-tao"],
  },
  {
    id: "deathmatch",
    name: "Deathmatch",
    type: "Polearm",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: {
      type: "critRate",
      label: "CRIT Rate%",
      value: 36.8,
      baseValue: 8.0,
    },
    passiveName: "Gladiator",
    passiveDesc:
      "If there are at least 2 opponents nearby, ATK is increased by 16~32% and DEF is increased by 16~32%. If there are fewer than 2 opponents nearby, ATK is increased by 24~48%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "deathmatch-single-target",
        label: "Fewer than 2 opponents (<2 targets)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases ATK by 24~48% (instead of 16~32% ATK/DEF)",
      },
    ],
    buffs: [
      {
        id: "deathmatch-atk",
        label: "ATK% (Deathmatch Gladiator)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        compute: (r, ctx) => {
          const single = (ctx.inputs?.["deathmatch-single-target"] ?? "1") === "1" || Number(ctx.inputs?.["deathmatch-single-target"] ?? 1) > 0;
          const pct = single ? [24, 30, 36, 42, 48][r - 1] : [16, 20, 24, 28, 32][r - 1];
          return (pct / 100) * ctx.baseAtk;
        },
      },
    ],
  },
  {
    id: "calamity-queller",
    name: "Calamity Queller",
    type: "Polearm",
    rarity: 5,
    baseAtk: 741,
    lvl1BaseAtk: 49,
    subStat: {
      type: "atkPct",
      label: "ATK%",
      value: 16.5,
      baseValue: 3.6,
    },
    passiveName: "Extinguishing Precept",
    passiveDesc:
      "Gain 12~24% All Elemental DMG Bonus. Obtain Consummation for 20s after utilizing an Elemental Skill, causing ATK to increase by 3.2~6.4% per second. This ATK increase has a maximum of 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "consummation-stacks",
        label: "Consummation Stacks (0-6)",
        control: "stacks",
        max: 6,
        defaultValue: 6,
        hint: "+3.2~6.4% ATK per stack",
      },
    ],
    buffs: [
      {
        id: "calamity-elem-dmg",
        label: "All Elemental DMG Bonus (Calamity Queller)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        compute: (r) => [12, 15, 18, 21, 24][r - 1],
      },
      {
        id: "calamity-atk",
        label: "ATK% (Calamity Queller Consummation)",
        stat: "atk",
        refinementValues: [19.2, 24, 28.8, 33.6, 38.4],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "consummation-stacks",
        compute: (r, ctx) => {
          const stacks = Number(ctx.inputs?.["consummation-stacks"] ?? 6);
          const perStack = [3.2, 4.0, 4.8, 5.6, 6.4][r - 1];
          return ((stacks * perStack) / 100) * ctx.baseAtk;
        },
      },
    ],
    signatureFor: ["shenhe"],
  },
  {
    id: "primordial-jade-winged-spear",
    name: "Primordial Jade Winged-Spear",
    type: "Polearm",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: {
      type: "critRate",
      label: "CRIT Rate%",
      value: 22.1,
      baseValue: 4.8,
    },
    passiveName: "Eagle Spear of Justice",
    passiveDesc:
      "On hit, increases ATK by 3.2~6.0% for 6s. Max 7 stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks, DMG dealt is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "pjws-stacks",
        label: "Jade Spear On-Hit Stacks (0-7)",
        control: "stacks",
        max: 7,
        defaultValue: 7,
        hint: "+3.2~6.0% ATK per stack. +12~24% DMG bonus at 7 stacks.",
      },
    ],
    buffs: [
      {
        id: "pjws-atk",
        label: "ATK% (Primordial Jade Winged-Spear Stacks)",
        stat: "atk",
        refinementValues: [22.4, 27.3, 32.2, 37.1, 42.0],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "pjws-stacks",
        compute: (r, ctx) => {
          const stacks = Number(ctx.inputs?.["pjws-stacks"] ?? 7);
          const perStack = [3.2, 3.9, 4.6, 5.3, 6.0][r - 1];
          return ((stacks * perStack) / 100) * ctx.baseAtk;
        },
      },
      {
        id: "pjws-dmg-bonus",
        label: "All DMG Bonus (PJWS Max Stacks)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "pjws-stacks",
        compute: (r, ctx) => {
          const stacks = Number(ctx.inputs?.["pjws-stacks"] ?? 7);
          return stacks >= 7 ? [12, 15, 18, 21, 24][r - 1] : 0;
        },
      },
    ],
    signatureFor: ["xiao"],
  },
  {
    id: "ballad-of-the-fjords",
    name: "Ballad of the Fjords",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: {
      type: "critRate",
      label: "CRIT Rate%",
      value: 27.6,
      baseValue: 6.0,
    },
    passiveName: "Tales of the Tundra",
    passiveDesc:
      "When there are at least 3 different Elemental Types in your party, Elemental Mastery is increased by 120~240.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "fjords-3-elements",
        label: ">= 3 Different Elements in Party",
        control: "toggle",
        defaultValue: 1,
        hint: "+120~240 Elemental Mastery",
      },
    ],
    buffs: [
      {
        id: "fjords-em",
        label: "EM (Ballad of the Fjords)",
        stat: "em",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "fjords-3-elements",
        compute: (r, ctx) => {
          const on = (ctx.inputs?.["fjords-3-elements"] ?? "1") === "1" || Number(ctx.inputs?.["fjords-3-elements"] ?? 1) > 0;
          if (!on) return 0;
          return [120, 150, 180, 210, 240][r - 1];
        },
      },
    ],
  },
  {
    id: "the-catch",
    name: "\"The Catch\"",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: {
      type: "energyRecharge",
      label: "Energy Recharge%",
      value: 45.9,
      baseValue: 10.0,
    },
    passiveName: "Shanty",
    passiveDesc:
      "Increases Elemental Burst DMG by 16~32% and Elemental Burst CRIT Rate by 6~12%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "catch-burst-dmg",
        label: "Burst DMG Bonus (\"The Catch\")",
        stat: "burstDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        compute: (r) => [16, 20, 24, 28, 32][r - 1],
      },
      {
        id: "catch-burst-crit",
        label: "Burst CRIT Rate (\"The Catch\")",
        stat: "critRate",
        refinementValues: [6, 7.5, 9, 10.5, 12],
        isTeamBuff: false,
        compute: (r) => [6, 7.5, 9, 10.5, 12][r - 1],
      },
    ],
  },
  {
    id: "dragons-bane",
    name: "Dragon's Bane",
    type: "Polearm",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: {
      type: "em",
      label: "Elemental Mastery",
      value: 221,
      baseValue: 48,
    },
    passiveName: "Bane of Flame and Water",
    passiveDesc:
      "Increases DMG against opponents affected by Hydro or Pyro by 20~36%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "dragons-bane-target",
        label: "Target Affected by Pyro/Hydro",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~36% DMG bonus vs Pyro/Hydro affected targets",
      },
    ],
    buffs: [
      {
        id: "dragons-bane-dmg",
        label: "All DMG Bonus (Dragon's Bane)",
        stat: "dmgBonus",
        refinementValues: [20, 24, 28, 32, 36],
        isTeamBuff: false,
        conditionKey: "dragons-bane-target",
        compute: (r, ctx) => {
          const on = (ctx.inputs?.["dragons-bane-target"] ?? "1") === "1" || Number(ctx.inputs?.["dragons-bane-target"] ?? 1) > 0;
          if (!on) return 0;
          return [20, 24, 28, 32, 36][r - 1];
        },
      },
    ],
  },
  {
    id: "favonius-lance",
    name: "Favonius Lance",
    type: "Polearm",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: {
      type: "energyRecharge",
      label: "Energy Recharge%",
      value: 30.6,
      baseValue: 6.7,
    },
    passiveName: "Windfall",
    passiveDesc:
      "CRIT hits have a 60~100% chance to generate 1 Elemental Orb, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },
];

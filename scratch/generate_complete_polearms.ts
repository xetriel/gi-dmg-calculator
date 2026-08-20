import fs from "fs";
import path from "path";

export interface PolearmDefinition {
  id: string;
  varName: string;
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  baseAtk: number;
  lvl1BaseAtk: number;
  subStat?: {
    type: string;
    label: string;
    value: number;
    baseValue?: number;
  };
  passiveName: string;
  passiveDesc: string;
  isSupport: boolean;
  buffType: "team" | "self" | "both";
  mechanicDefs?: any[];
  buffs: any[];
  signatureFor?: string[];
}

export const COMPLETE_POLEARMS: PolearmDefinition[] = [
  // ==========================================
  // 5-STAR POLEARMS (12)
  // ==========================================
  {
    id: "calamity-queller",
    varName: "calamityQueller",
    name: "Calamity Queller",
    rarity: 5,
    baseAtk: 741,
    lvl1BaseAtk: 49,
    subStat: { type: "atkPct", label: "ATK%", value: 16.5, baseValue: 3.6 },
    passiveName: "Extinguishing Precept",
    passiveDesc:
      "Gain 12~24% All Elemental DMG Bonus. Obtain Consummation for 20s after utilizing an Elemental Skill, causing ATK to increase by 3.2~6.4% per second. This ATK increase has a maximum of 6 stacks. When the character equipping this weapon is not on the field, Consummation's ATK increase is doubled.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "consummation-stacks",
        label: "Consummation Stacks (0-6)",
        control: "stacks",
        max: 6,
        defaultValue: 6,
        hint: "+3.2~6.4% ATK per second/stack (up to +19.2~38.4%)",
      },
      {
        id: "consummation-offfield",
        label: "Equipping Character Off-Field (2x ATK)",
        control: "toggle",
        defaultValue: 0,
        hint: "Doubles Consummation ATK bonus when off-field (up to +38.4~76.8%)",
      },
    ],
    buffs: [
      {
        id: "calamity-elem-dmg",
        label: "All Elemental DMG Bonus (Calamity Queller)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "calamity-consummation-atk",
        label: "ATK% (Consummation Stacks)",
        stat: "atk",
        refinementValues: [19.2, 24.0, 28.8, 33.6, 38.4],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "consummation-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['consummation-stacks'] ?? 6); const off = (ctx.inputs?.['consummation-offfield'] ?? '0') === '1' || Number(ctx.inputs?.['consummation-offfield'] ?? 0) > 0; const mult = off ? 2 : 1; const perStack = [3.2, 4.0, 4.8, 5.6, 6.4][r - 1]; return ((s * perStack * mult) / 100) * ctx.baseAtk; }",
      },
    ],
    signatureFor: ["shenhe"],
  },
  {
    id: "crimson-moons-semblance",
    varName: "crimsonMoonsSemblance",
    name: "Crimson Moon's Semblance",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Ashen Sun's Shadow",
    passiveDesc:
      "Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. When the equipping character has a Bond of Life, they gain a 12~28% DMG Bonus; if the value of the Bond of Life is >= 30% of Max HP, gain an additional 24~56% DMG (total 36~84%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "crimson-bol-tier",
        label: "Bond of Life Level",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "0: None, 1: Has BoL (+12~28% DMG), 2: BoL >= 30% Max HP (+36~84% DMG)",
      },
    ],
    buffs: [
      {
        id: "crimson-moon-dmg",
        label: "All DMG Bonus (Crimson Moon's Semblance)",
        stat: "dmgBonus",
        refinementValues: [36, 48, 60, 72, 84],
        isTeamBuff: false,
        conditionKey: "crimson-bol-tier",
        computeCode:
          "(r, ctx) => { const tier = Number(ctx.inputs?.['crimson-bol-tier'] ?? 2); if (tier === 2) return [36, 48, 60, 72, 84][r - 1]; if (tier === 1) return [12, 16, 20, 24, 28][r - 1]; return 0; }",
      },
    ],
    signatureFor: ["arlecchino"],
  },
  {
    id: "disaster-and-remorse",
    varName: "disasterAndRemorse",
    name: "Disaster and Remorse",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Remorseful Cry",
    passiveDesc:
      "Increases All Elemental DMG Bonus by 12~24%. Using an Elemental Skill or Elemental Burst increases ATK by 16~32% for 12s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "disaster-skill-burst-active",
        label: "Skill/Burst Used (+16~32% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 12s",
      },
    ],
    buffs: [
      {
        id: "disaster-elem-dmg",
        label: "All Elemental DMG Bonus (Disaster and Remorse)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "disaster-atk",
        label: "ATK% (Disaster and Remorse)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "disaster-skill-burst-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['disaster-skill-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['disaster-skill-burst-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "engulfing-lightning",
    varName: "engulfingLightning",
    name: "Engulfing Lightning",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 55.1, baseValue: 12.0 },
    passiveName: "Timeless Dream: Eternal Stove",
    passiveDesc:
      "ATK increased by 28~56% of Energy Recharge over the base 100%. You can gain a maximum bonus of 80~120% ATK. Gain 30~50% Energy Recharge for 12s after using an Elemental Burst.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "engulfing-total-er",
        label: "Character Total Energy Recharge% (e.g. 250)",
        control: "stacks",
        max: 400,
        defaultValue: 250,
        hint: "Total ER used to compute ATK bonus",
      },
      {
        id: "engulfing-burst-active",
        label: "Post-Burst Active (+30~50% ER)",
        control: "toggle",
        defaultValue: 1,
        hint: "+30~50% Energy Recharge for 12s",
      },
    ],
    buffs: [
      {
        id: "engulfing-er-buff",
        label: "Post-Burst Energy Recharge% (Engulfing Lightning)",
        stat: "energyRecharge",
        refinementValues: [30, 35, 40, 45, 50],
        isTeamBuff: false,
        conditionKey: "engulfing-burst-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['engulfing-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['engulfing-burst-active'] ?? 1) > 0; return on ? [30, 35, 40, 45, 50][r - 1] : 0; }",
      },
      {
        id: "engulfing-atk-from-er",
        label: "ATK% from ER (Engulfing Lightning)",
        stat: "atk",
        refinementValues: [28, 35, 42, 49, 56],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "engulfing-total-er",
        computeCode:
          "(r, ctx) => { const totalER = Number(ctx.inputs?.['engulfing-total-er'] ?? 250); const postBurst = (ctx.inputs?.['engulfing-burst-active'] ?? '1') === '1' || Number(ctx.inputs?.['engulfing-burst-active'] ?? 1) > 0; const effectiveER = totalER + (postBurst ? [30, 35, 40, 45, 50][r - 1] : 0); const over100 = Math.max(0, effectiveER - 100); const ratio = [0.28, 0.35, 0.42, 0.49, 0.56][r - 1]; const cap = [80, 90, 100, 110, 120][r - 1]; const pct = Math.min(over100 * ratio, cap); return (pct / 100) * ctx.baseAtk; }",
      },
    ],
    signatureFor: ["raiden-shogun"],
  },
  {
    id: "fractured-halo",
    varName: "fracturedHalo",
    name: "Fractured Halo",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 44.1, baseValue: 9.6 },
    passiveName: "Halo Fracture",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. Normal and Charged Attack DMG is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "halo-elem-dmg",
        label: "All Elemental DMG Bonus (Fractured Halo)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "halo-na-dmg",
        label: "Normal Attack DMG Bonus (Fractured Halo)",
        stat: "normalDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "halo-ca-dmg",
        label: "Charged Attack DMG Bonus (Fractured Halo)",
        stat: "chargedDmgBonus",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "golden-frostbound-oath",
    varName: "goldenFrostboundOath",
    name: "Golden Frostbound Oath",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Frostbound Oath",
    passiveDesc:
      "All Elemental DMG Bonus is increased by 12~24%. CRIT DMG is increased by 20~40%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "frostbound-elem-dmg",
        label: "All Elemental DMG Bonus (Golden Frostbound Oath)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
      {
        id: "frostbound-crit-dmg",
        label: "CRIT DMG% (Golden Frostbound Oath)",
        stat: "critDmg",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
    ],
  },
  {
    id: "lumidouce-elegy",
    varName: "lumidouceElegy",
    name: "Lumidouce Elegy",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 33.1, baseValue: 7.2 },
    passiveName: "Bright Dawn Song",
    passiveDesc:
      "ATK is increased by 15~31%. After the equipping character triggers Burning on opponents or deals Dendro DMG to Burning opponents, the DMG dealt is increased by 18~36%. Max 2 stacks (up to +36~72% DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "lumidouce-scents-stacks",
        label: "Scents Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+18~36% All DMG bonus per stack (up to +36~72%)",
      },
    ],
    buffs: [
      {
        id: "lumidouce-atk",
        label: "ATK% (Lumidouce Elegy)",
        stat: "atk",
        refinementValues: [15, 19, 23, 27, 31],
        isTeamBuff: false,
        isPercent: true,
        computeCode: "(r, ctx) => ([15, 19, 23, 27, 31][r - 1] / 100) * ctx.baseAtk",
      },
      {
        id: "lumidouce-dmg",
        label: "All DMG Bonus from Scents (Lumidouce Elegy)",
        stat: "dmgBonus",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        conditionKey: "lumidouce-scents-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['lumidouce-scents-stacks'] ?? 2); return s * [18, 22.5, 27, 31.5, 36][r - 1]; }",
      },
    ],
    signatureFor: ["emilie"],
  },
  {
    id: "primordial-jade-winged-spear",
    varName: "primordialJadeWingedSpear",
    name: "Primordial Jade Winged-Spear",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 22.1, baseValue: 4.8 },
    passiveName: "Eagle Spear of Justice",
    passiveDesc:
      "On hit, increases ATK by 3.2~6.0% for 6s. Max 7 stacks. At 7 stacks, DMG dealt is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "pjws-hit-stacks",
        label: "Eagle Spear Stacks (0-7)",
        control: "stacks",
        max: 7,
        defaultValue: 7,
        hint: "+3.2~6.0% ATK per stack. At 7 stacks, +12~24% All DMG bonus.",
      },
    ],
    buffs: [
      {
        id: "pjws-atk",
        label: "ATK% from Stacks (PJWS)",
        stat: "atk",
        refinementValues: [22.4, 27.3, 32.2, 37.1, 42.0],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "pjws-hit-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['pjws-hit-stacks'] ?? 7); const perStack = [3.2, 3.9, 4.6, 5.3, 6.0][r - 1]; return ((s * perStack) / 100) * ctx.baseAtk; }",
      },
      {
        id: "pjws-max-dmg",
        label: "All DMG Bonus at 7 Stacks (PJWS)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "pjws-hit-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['pjws-hit-stacks'] ?? 7); return s >= 7 ? [12, 15, 18, 21, 24][r - 1] : 0; }",
      },
    ],
    signatureFor: ["xiao"],
  },
  {
    id: "skyward-spine",
    varName: "skywardSpine",
    name: "Skyward Spine",
    rarity: 5,
    baseAtk: 674,
    lvl1BaseAtk: 48,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 36.8, baseValue: 8.0 },
    passiveName: "Black Wing",
    passiveDesc:
      "Increases CRIT Rate by 8~16% and increases Normal ATK SPD by 12%. Normal and Charged Attacks have a 50% chance to trigger a vacuum blade dealing 40~100% ATK as DMG.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "skyward-spine-crit",
        label: "CRIT Rate% (Skyward Spine)",
        stat: "critRate",
        refinementValues: [8, 10, 12, 14, 16],
        isTeamBuff: false,
        computeCode: "(r) => [8, 10, 12, 14, 16][r - 1]",
      },
    ],
  },
  {
    id: "staff-of-homa",
    varName: "staffOfHoma",
    name: "Staff of Homa",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 66.2, baseValue: 14.4 },
    passiveName: "Reckless Cinnabar",
    passiveDesc:
      "HP increased by 20~40%. Additionally, provides an ATK Bonus based on 0.8~1.6% of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK bonus is increased by an additional 1~1.8% of Max HP (total 1.8~3.4%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "homa-wielder-hp",
        label: "Character Total Max HP (e.g. 35000)",
        control: "stacks",
        max: 80000,
        defaultValue: 35000,
        hint: "Max HP used for flat ATK conversion",
      },
      {
        id: "homa-low-hp",
        label: "Current HP < 50% (+1.0~1.8% Max HP as ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "Adds extra 1.0~1.8% Max HP to ATK when under 50% HP",
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
        computeCode: "(r) => [20, 25, 30, 35, 40][r - 1]",
      },
      {
        id: "homa-flat-atk",
        label: "Flat ATK from Max HP (Staff of Homa)",
        stat: "atk",
        refinementValues: [1.8, 2.2, 2.6, 3.0, 3.4],
        isTeamBuff: false,
        conditionKey: "homa-wielder-hp",
        computeCode:
          "(r, ctx) => { const hp = Number(ctx.inputs?.['homa-wielder-hp'] ?? 35000); const lowHp = (ctx.inputs?.['homa-low-hp'] ?? '1') === '1' || Number(ctx.inputs?.['homa-low-hp'] ?? 1) > 0; const baseRatio = [0.008, 0.010, 0.012, 0.014, 0.016][r - 1]; const lowHpRatio = [0.010, 0.012, 0.014, 0.016, 0.018][r - 1]; const ratio = baseRatio + (lowHp ? lowHpRatio : 0); return hp * ratio; }",
      },
    ],
    signatureFor: ["hu-tao"],
  },
  {
    id: "staff-of-the-scarlet-sands",
    varName: "staffOfTheScarletSands",
    name: "Staff of the Scarlet Sands",
    rarity: 5,
    baseAtk: 542,
    lvl1BaseAtk: 44,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 44.1, baseValue: 9.6 },
    passiveName: "Heat Haze at Horizon's End",
    passiveDesc:
      "The equipping character gains 52~104% of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, gain 1 stack of the Dream of the Scarlet Sands (max 3): grants 28~56% of EM as bonus ATK per stack for 10s (up to +136~272% EM as ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "scarlet-wielder-em",
        label: "Character Total Elemental Mastery (e.g. 400)",
        control: "stacks",
        max: 2000,
        defaultValue: 400,
        hint: "Total EM used to compute flat ATK bonus",
      },
      {
        id: "scarlet-sands-stacks",
        label: "Dream of Scarlet Sands Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+28~56% EM as ATK per stack (up to +84~168% EM as ATK)",
      },
    ],
    buffs: [
      {
        id: "scarlet-base-em-atk",
        label: "Flat ATK from Base EM (Staff of Scarlet Sands)",
        stat: "atk",
        refinementValues: [52, 65, 78, 91, 104],
        isTeamBuff: false,
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 400); const ratio = [0.52, 0.65, 0.78, 0.91, 1.04][r - 1]; return em * ratio; }",
      },
      {
        id: "scarlet-stacks-em-atk",
        label: "Flat ATK from Stacks (Staff of Scarlet Sands)",
        stat: "atk",
        refinementValues: [84, 105, 126, 147, 168],
        isTeamBuff: false,
        conditionKey: "scarlet-sands-stacks",
        computeCode:
          "(r, ctx) => { const em = Number(ctx.inputs?.['scarlet-wielder-em'] ?? 400); const s = Number(ctx.inputs?.['scarlet-sands-stacks'] ?? 3); const perStack = [0.28, 0.35, 0.42, 0.49, 0.56][r - 1]; return em * s * perStack; }",
      },
    ],
    signatureFor: ["cyno"],
  },
  {
    id: "vortex-vanquisher",
    varName: "vortexVanquisher",
    name: "Vortex Vanquisher",
    rarity: 5,
    baseAtk: 608,
    lvl1BaseAtk: 46,
    subStat: { type: "atkPct", label: "ATK%", value: 49.6, baseValue: 10.8 },
    passiveName: "Golden Majesty",
    passiveDesc:
      "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. While protected by a shield, this ATK increase effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "vortex-stacks",
        label: "Golden Majesty Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+4~8% ATK per stack",
      },
      {
        id: "vortex-shielded",
        label: "Protected by Shield (2x ATK Buff)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles ATK bonus from stacks",
      },
    ],
    buffs: [
      {
        id: "vortex-atk",
        label: "ATK% (Vortex Vanquisher Stacks)",
        stat: "atk",
        refinementValues: [20, 25, 30, 35, 40],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "vortex-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['vortex-stacks'] ?? 5); const shielded = (ctx.inputs?.['vortex-shielded'] ?? '1') === '1' || Number(ctx.inputs?.['vortex-shielded'] ?? 1) > 0; const mult = shielded ? 2 : 1; return ((s * [4, 5, 6, 7, 8][r - 1] * mult) / 100) * ctx.baseAtk; }",
      },
    ],
    signatureFor: ["zhongli"],
  },

  // ==========================================
  // 4-STAR POLEARMS (29)
  // ==========================================
  {
    id: "the-catch",
    varName: "theCatch",
    name: "\"The Catch\"",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Shanty",
    passiveDesc:
      "Increases Elemental Burst DMG by 16~32% and Elemental Burst CRIT Rate by 6~12%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "catch-burst-dmg",
        label: "Elemental Burst DMG Bonus (\"The Catch\")",
        stat: "burstDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "catch-burst-crit",
        label: "Elemental Burst CRIT Rate% (\"The Catch\")",
        stat: "critRate",
        refinementValues: [6, 7.5, 9, 10.5, 12],
        isTeamBuff: false,
        computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]",
      },
    ],
  },
  {
    id: "ballad-of-the-fjords",
    varName: "balladOfTheFjords",
    name: "Ballad of the Fjords",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 27.6, baseValue: 6.0 },
    passiveName: "Tales of the Tundra",
    passiveDesc:
      "When there are at least 3 different Elemental Types in your party, Elemental Mastery is increased by 120~240.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "ballad-elements-met",
        label: "Party has >= 3 Different Elements (+120~240 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+120~240 EM when 3+ elements in team",
      },
    ],
    buffs: [
      {
        id: "ballad-em",
        label: "Elemental Mastery (Ballad of the Fjords)",
        stat: "em",
        refinementValues: [120, 150, 180, 210, 240],
        isTeamBuff: false,
        conditionKey: "ballad-elements-met",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['ballad-elements-met'] ?? '1') === '1' || Number(ctx.inputs?.['ballad-elements-met'] ?? 1) > 0; return on ? [120, 150, 180, 210, 240][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "blackcliff-pole",
    varName: "blackcliffPole",
    name: "Blackcliff Pole",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "critDmg", label: "CRIT DMG%", value: 55.1, baseValue: 12.0 },
    passiveName: "Press the Advantage",
    passiveDesc:
      "After defeating an opponent, ATK is increased by 12~24% for 30s. Max 3 stacks (up to +36~72% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "blackcliff-pole-stacks",
        label: "Opponents Defeated Stacks (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+12~24% ATK per stack (up to +36~72%)",
      },
    ],
    buffs: [
      {
        id: "blackcliff-pole-atk",
        label: "ATK% (Blackcliff Pole Stacks)",
        stat: "atk",
        refinementValues: [36, 45, 54, 63, 72],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "blackcliff-pole-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['blackcliff-pole-stacks'] ?? 3); return ((s * [12, 15, 18, 21, 24][r - 1]) / 100) * ctx.baseAtk; }",
      },
    ],
  },
  {
    id: "blackmarrow-lantern",
    varName: "blackmarrowLantern",
    name: "Blackmarrow Lantern",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Blackmarrow Radiance",
    passiveDesc: "All Elemental DMG Bonus is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "blackmarrow-elem-dmg",
        label: "All Elemental DMG Bonus (Blackmarrow Lantern)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },
  {
    id: "crescent-pike",
    varName: "crescentPike",
    name: "Crescent Pike",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 34.5, baseValue: 7.5 },
    passiveName: "Infusion Needle",
    passiveDesc:
      "After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal an additional 20~40% ATK as DMG for 5s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "dawning-frost",
    varName: "dawningFrost",
    name: "Dawning Frost",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Frost Dawn",
    passiveDesc: "Elemental Skill DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "dawning-frost-skill",
        label: "Elemental Skill DMG Bonus (Dawning Frost)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "deathmatch",
    varName: "deathmatch",
    name: "Deathmatch",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 36.8, baseValue: 8.0 },
    passiveName: "Gladiator",
    passiveDesc:
      "If there are at least 2 opponents nearby, ATK is increased by 16~32% and DEF is increased by 16~32%. If there are fewer than 2 opponents nearby, ATK is increased by 24~48%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "deathmatch-enemy-count",
        label: "Opponents Nearby (1 = <2, 2 = >=2)",
        control: "stacks",
        max: 2,
        defaultValue: 1,
        hint: "1: <2 opponents (+24~48% ATK), 2: >=2 opponents (+16~32% ATK & DEF)",
      },
    ],
    buffs: [
      {
        id: "deathmatch-atk",
        label: "ATK% (Deathmatch)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "deathmatch-enemy-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['deathmatch-enemy-count'] ?? 1); const pct = count >= 2 ? [16, 20, 24, 28, 32][r - 1] : [24, 30, 36, 42, 48][r - 1]; return (pct / 100) * ctx.baseAtk; }",
      },
      {
        id: "deathmatch-def",
        label: "DEF% (Deathmatch >=2 opponents)",
        stat: "def",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "deathmatch-enemy-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['deathmatch-enemy-count'] ?? 1); return count >= 2 ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "dialogues-of-the-desert-sages",
    varName: "dialoguesOfTheDesertSages",
    name: "Dialogues of the Desert Sages",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "hpPct", label: "HP%", value: 41.3, baseValue: 9.0 },
    passiveName: "Principle of Equilibrium",
    passiveDesc:
      "When the wielder is healed, restores 8~16 Energy. Can occur once every 10s even when character is off-field.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "dragons-bane",
    varName: "dragonsBane",
    name: "Dragon's Bane",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "em", label: "Elemental Mastery", value: 221, baseValue: 48 },
    passiveName: "Bane of Flame and Water",
    passiveDesc:
      "Increases DMG against opponents affected by Hydro or Pyro by 20~36%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "dragons-bane-target-affected",
        label: "Target Affected by Hydro or Pyro (+20~36% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+20~36% All DMG bonus against affected enemies",
      },
    ],
    buffs: [
      {
        id: "dragons-bane-dmg",
        label: "All DMG Bonus vs Hydro/Pyro (Dragon's Bane)",
        stat: "dmgBonus",
        refinementValues: [20, 24, 28, 32, 36],
        isTeamBuff: false,
        conditionKey: "dragons-bane-target-affected",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['dragons-bane-target-affected'] ?? '1') === '1' || Number(ctx.inputs?.['dragons-bane-target-affected'] ?? 1) > 0; return on ? [20, 24, 28, 32, 36][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "dragonspine-spear",
    varName: "dragonspineSpear",
    name: "Dragonspine Spear",
    rarity: 4,
    baseAtk: 454,
    lvl1BaseAtk: 41,
    subStat: { type: "physicalDmgBonus", label: "Physical DMG Bonus%", value: 69.0, baseValue: 15.0 },
    passiveName: "Frost Burial",
    passiveDesc:
      "Hitting an opponent with Normal and Charged Attacks has a 60~100% chance of forming and dropping an Everfrost Icicle above them, dealing 80~140% AoE ATK DMG. Opponents affected by Cryo are dealt 200~360% ATK DMG instead.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "etherlight-spindlelute",
    varName: "etherlightSpindlelute",
    name: "Etherlight Spindlelute",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Etherlight Resonator",
    passiveDesc: "Elemental Burst DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "spindlelute-burst-dmg",
        label: "Elemental Burst DMG Bonus (Etherlight Spindlelute)",
        stat: "burstDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "favonius-lance",
    varName: "favoniusLance",
    name: "Favonius Lance",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "Windfall",
    passiveDesc:
      "CRIT hits have a 60~100% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
    isSupport: true,
    buffType: "team",
    buffs: [],
  },
  {
    id: "flame-forged-insight",
    varName: "flameForgedInsight",
    name: "Flame-Forged Insight",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "em", label: "Elemental Mastery", value: 165, baseValue: 36 },
    passiveName: "Flame Forging",
    passiveDesc: "Increases Pyro DMG Bonus by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "flame-insight-pyro-dmg",
        label: "Pyro DMG Bonus (Flame-Forged Insight)",
        stat: "pyroDmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },
  {
    id: "footprint-of-the-rainbow",
    varName: "footprintOfTheRainbow",
    name: "Footprint of the Rainbow",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "defPct", label: "DEF%", value: 51.7, baseValue: 11.3 },
    passiveName: "The Song of the Earth",
    passiveDesc:
      "Using an Elemental Skill increases DEF by 16~32% for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "rainbow-skill-used",
        label: "Elemental Skill Used (+16~32% DEF)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% DEF for 15s",
      },
    ],
    buffs: [
      {
        id: "rainbow-def",
        label: "DEF% (Footprint of the Rainbow)",
        stat: "def",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "rainbow-skill-used",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['rainbow-skill-used'] ?? '1') === '1' || Number(ctx.inputs?.['rainbow-skill-used'] ?? 1) > 0; return on ? [16, 20, 24, 28, 32][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "forged-by-the-golden-melody",
    varName: "forgedByTheGoldenMelody",
    name: "Forged by the Golden Melody",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Golden Cadence",
    passiveDesc: "Elemental Skill and Elemental Burst DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "golden-melody-skill-dmg",
        label: "Elemental Skill DMG Bonus (Golden Melody)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
      {
        id: "golden-melody-burst-dmg",
        label: "Elemental Burst DMG Bonus (Golden Melody)",
        stat: "burstDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "kitain-cross-spear",
    varName: "kitainCrossSpear",
    name: "Kitain Cross Spear",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Samurai Conduct",
    passiveDesc:
      "Increases Elemental Skill DMG by 6~12%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates 3~5 Energy every 2s for 6s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "kitain-skill-dmg",
        label: "Elemental Skill DMG Bonus (Kitain Cross Spear)",
        stat: "skillDmgBonus",
        refinementValues: [6, 7.5, 9, 10.5, 12],
        isTeamBuff: false,
        computeCode: "(r) => [6, 7.5, 9, 10.5, 12][r - 1]",
      },
    ],
  },
  {
    id: "lithic-spear",
    varName: "lithicSpear",
    name: "Lithic Spear",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Lithic Axiom: Unity",
    passiveDesc:
      "For every character in the party who hails from Liyue, the character equipping this weapon gains a 7~11% ATK increase and a 3~7% CRIT Rate increase. Max 4 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "lithic-spear-liyue-count",
        label: "Liyue Party Members (1-4)",
        control: "stacks",
        max: 4,
        defaultValue: 1,
        hint: "+7~11% ATK and +3~7% CRIT Rate per Liyue member",
      },
    ],
    buffs: [
      {
        id: "lithic-spear-atk",
        label: "ATK% from Liyue Members (Lithic Spear)",
        stat: "atk",
        refinementValues: [28, 32, 36, 40, 44],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "lithic-spear-liyue-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['lithic-spear-liyue-count'] ?? 1); const perStack = [7, 8, 9, 10, 11][r - 1]; return ((count * perStack) / 100) * ctx.baseAtk; }",
      },
      {
        id: "lithic-spear-crit",
        label: "CRIT Rate% from Liyue Members (Lithic Spear)",
        stat: "critRate",
        refinementValues: [12, 16, 20, 24, 28],
        isTeamBuff: false,
        conditionKey: "lithic-spear-liyue-count",
        computeCode:
          "(r, ctx) => { const count = Number(ctx.inputs?.['lithic-spear-liyue-count'] ?? 1); const perStack = [3, 4, 5, 6, 7][r - 1]; return count * perStack; }",
      },
    ],
  },
  {
    id: "missive-windspear",
    varName: "missiveWindspear",
    name: "Missive Windspear",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "The Wind Unattained",
    passiveDesc:
      "Within 10s after an Elemental Reaction is triggered, ATK is increased by 12~24% and Elemental Mastery is increased by 48~96.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "windspear-reaction-active",
        label: "Reaction Triggered Active (+12~24% ATK, +48~96 EM)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% ATK and +48~96 EM for 10s",
      },
    ],
    buffs: [
      {
        id: "windspear-atk",
        label: "ATK% (Missive Windspear)",
        stat: "atk",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "windspear-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['windspear-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['windspear-reaction-active'] ?? 1) > 0; return on ? ([12, 15, 18, 21, 24][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
      {
        id: "windspear-em",
        label: "Elemental Mastery (Missive Windspear)",
        stat: "em",
        refinementValues: [48, 60, 72, 84, 96],
        isTeamBuff: false,
        conditionKey: "windspear-reaction-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['windspear-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['windspear-reaction-active'] ?? 1) > 0; return on ? [48, 60, 72, 84, 96][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "moonpiercer",
    varName: "moonpiercer",
    name: "Moonpiercer",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Stillwood Moonshadow",
    passiveDesc:
      "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be generated on the ground for 10s. The character who picks it up will have their ATK increased by 16~32% for 12s.",
    isSupport: true,
    buffType: "team",
    mechanicDefs: [
      {
        id: "moonpiercer-leaf-picked",
        label: "Leaf of Revival Picked Up (+16~32% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "Team buff: +16~32% ATK for 12s to picking party member",
      },
    ],
    buffs: [
      {
        id: "moonpiercer-party-atk",
        label: "Party ATK% (Moonpiercer Leaf of Revival)",
        description: "Picking up Leaf of Revival grants +16~32% ATK for 12s",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "moonpiercer-leaf-picked",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['moonpiercer-leaf-picked'] ?? '1') === '1' || Number(ctx.inputs?.['moonpiercer-leaf-picked'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "moonweavers-dawn",
    varName: "moonweaversDawn",
    name: "Moonweaver's Dawn",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Moonweaver's Light",
    passiveDesc: "All Elemental DMG Bonus is increased by 12~24%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "moonweaver-elem-dmg",
        label: "All Elemental DMG Bonus (Moonweaver's Dawn)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        computeCode: "(r) => [12, 15, 18, 21, 24][r - 1]",
      },
    ],
  },
  {
    id: "mountain-bracing-bolt",
    varName: "mountainBracingBolt",
    name: "Mountain-Bracing Bolt",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 30.6, baseValue: 6.7 },
    passiveName: "A Lingering Echo",
    passiveDesc:
      "Decreases climbing Stamina Consumption by 15%. After using an Elemental Skill, Elemental Skill DMG is increased by 12~24% for 15s. If in Nightsoul's Blessing, this DMG increase is increased by 100% (up to +24~48%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "mountain-bolt-skill-active",
        label: "Elemental Skill Used (+12~24% Skill DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "+12~24% Skill DMG for 15s",
      },
      {
        id: "mountain-bolt-nightsoul",
        label: "In Nightsoul's Blessing (2x Skill DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Doubles Skill DMG bonus (up to +24~48%)",
      },
    ],
    buffs: [
      {
        id: "mountain-bolt-skill-dmg",
        label: "Elemental Skill DMG Bonus (Mountain-Bracing Bolt)",
        stat: "skillDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        conditionKey: "mountain-bolt-skill-active",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['mountain-bolt-skill-active'] ?? '1') === '1' || Number(ctx.inputs?.['mountain-bolt-skill-active'] ?? 1) > 0; if (!on) return 0; const nightsoul = (ctx.inputs?.['mountain-bolt-nightsoul'] ?? '1') === '1' || Number(ctx.inputs?.['mountain-bolt-nightsoul'] ?? 1) > 0; const mult = nightsoul ? 2 : 1; return [12, 15, 18, 21, 24][r - 1] * mult; }",
      },
    ],
  },
  {
    id: "prospectors-drill",
    varName: "prospectorsDrill",
    name: "Prospector's Drill",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Masons' Ditty",
    passiveDesc:
      "When healed or healing, gain a Stoic's Symbol for 30s (max 3). Using Skill or Burst consumes symbols to grant 8~16% ATK and 4~8% All Elemental DMG Bonus per symbol for 15s (up to +24~48% ATK, +12~24% Elem DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "drill-symbols",
        label: "Stoic Symbols Consumed (0-3)",
        control: "stacks",
        max: 3,
        defaultValue: 3,
        hint: "+8~16% ATK and +4~8% All Elem DMG per symbol",
      },
    ],
    buffs: [
      {
        id: "drill-atk",
        label: "ATK% (Prospector's Drill)",
        stat: "atk",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "drill-symbols",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['drill-symbols'] ?? 3); return ((s * [8, 10, 12, 14, 16][r - 1]) / 100) * ctx.baseAtk; }",
      },
      {
        id: "drill-elem-dmg",
        label: "All Elemental DMG Bonus (Prospector's Drill)",
        stat: "dmgBonus",
        refinementValues: [12, 15, 18, 21, 24],
        isTeamBuff: false,
        conditionKey: "drill-symbols",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['drill-symbols'] ?? 3); return s * [4, 5, 6, 7, 8][r - 1]; }",
      },
    ],
  },
  {
    id: "prototype-starglitter",
    varName: "prototypeStarglitter",
    name: "Prototype Starglitter",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Magic Affinity",
    passiveDesc:
      "After using an Elemental Skill, increases Normal and Charged Attack DMG by 8~16% for 12s. Max 2 stacks (up to +16~32% NA/CA DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "starglitter-stacks",
        label: "Magic Affinity Stacks (0-2)",
        control: "stacks",
        max: 2,
        defaultValue: 2,
        hint: "+8~16% NA & CA DMG per stack (up to +16~32%)",
      },
    ],
    buffs: [
      {
        id: "starglitter-na-dmg",
        label: "Normal Attack DMG Bonus (Prototype Starglitter)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "starglitter-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['starglitter-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
      {
        id: "starglitter-ca-dmg",
        label: "Charged Attack DMG Bonus (Prototype Starglitter)",
        stat: "chargedDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        conditionKey: "starglitter-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['starglitter-stacks'] ?? 2); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
  },
  {
    id: "rightful-reward",
    varName: "rightfulReward",
    name: "Rightful Reward",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "hpPct", label: "HP%", value: 27.6, baseValue: 6.0 },
    passiveName: "Tip of the Spear",
    passiveDesc:
      "When the wielder is healed, restore 8~16 Energy. Can occur once every 10s even when character is off-field.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "royal-spear",
    varName: "royalSpear",
    name: "Royal Spear",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "atkPct", label: "ATK%", value: 27.6, baseValue: 6.0 },
    passiveName: "Focus",
    passiveDesc:
      "Upon damaging an opponent, increases CRIT Rate by 8~16%. Max 5 stacks (up to +40~80%). A CRIT hit removes all stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "royal-spear-focus-stacks",
        label: "Focus Stacks (0-5)",
        control: "stacks",
        max: 5,
        defaultValue: 5,
        hint: "+8~16% CRIT Rate per stack (up to +40~80%)",
      },
    ],
    buffs: [
      {
        id: "royal-spear-crit",
        label: "CRIT Rate% (Royal Spear Focus)",
        stat: "critRate",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "royal-spear-focus-stacks",
        computeCode:
          "(r, ctx) => { const s = Number(ctx.inputs?.['royal-spear-focus-stacks'] ?? 5); return s * [8, 10, 12, 14, 16][r - 1]; }",
      },
    ],
  },
  {
    id: "sacrificers-staff",
    varName: "sacrificersStaff",
    name: "Sacrificer's Staff",
    rarity: 4,
    baseAtk: 565,
    lvl1BaseAtk: 44,
    subStat: { type: "em", label: "Elemental Mastery", value: 110, baseValue: 24 },
    passiveName: "Sacrificial Rites",
    passiveDesc: "Elemental Skill DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "sacrificer-staff-skill",
        label: "Elemental Skill DMG Bonus (Sacrificer's Staff)",
        stat: "skillDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "snare-hook",
    varName: "snareHook",
    name: "Snare Hook",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "atkPct", label: "ATK%", value: 41.3, baseValue: 9.0 },
    passiveName: "Snaring Point",
    passiveDesc: "Normal Attack DMG is increased by 16~32%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "snare-hook-na",
        label: "Normal Attack DMG Bonus (Snare Hook)",
        stat: "normalDmgBonus",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        computeCode: "(r) => [16, 20, 24, 28, 32][r - 1]",
      },
    ],
  },
  {
    id: "tamayuratei-no-ohanashi",
    varName: "tamayurateiNoOhanashi",
    name: "Tamayuratei no Ohanashi",
    rarity: 4,
    baseAtk: 510,
    lvl1BaseAtk: 42,
    subStat: { type: "energyRecharge", label: "Energy Recharge%", value: 45.9, baseValue: 10.0 },
    passiveName: "Ephemera",
    passiveDesc:
      "Using an Elemental Skill increases ATK by 16~32% and Movement SPD by 10% for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "tamayura-skill-used",
        label: "Elemental Skill Used (+16~32% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "+16~32% ATK for 10s",
      },
    ],
    buffs: [
      {
        id: "tamayura-atk",
        label: "ATK% (Tamayuratei no Ohanashi)",
        stat: "atk",
        refinementValues: [16, 20, 24, 28, 32],
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "tamayura-skill-used",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['tamayura-skill-used'] ?? '1') === '1' || Number(ctx.inputs?.['tamayura-skill-used'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; }",
      },
    ],
  },
  {
    id: "wavebreakers-fin",
    varName: "wavebreakersFin",
    name: "Wavebreaker's Fin",
    rarity: 4,
    baseAtk: 620,
    lvl1BaseAtk: 45,
    subStat: { type: "atkPct", label: "ATK%", value: 13.8, baseValue: 3.0 },
    passiveName: "Watatsumi Wavewalker",
    passiveDesc:
      "For every point of the entire party's combined maximum Energy capacity, Elemental Burst DMG is increased by 0.12~0.24% (up to 40~80%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "wavebreaker-party-energy",
        label: "Party Total Energy Capacity (e.g. 300)",
        control: "stacks",
        max: 400,
        defaultValue: 300,
        hint: "+0.12~0.24% Burst DMG per total party energy capacity point",
      },
    ],
    buffs: [
      {
        id: "wavebreaker-burst-dmg",
        label: "Elemental Burst DMG Bonus (Wavebreaker's Fin)",
        stat: "burstDmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "wavebreaker-party-energy",
        computeCode:
          "(r, ctx) => { const energy = Number(ctx.inputs?.['wavebreaker-party-energy'] ?? 300); const ratio = [0.0012, 0.0015, 0.0018, 0.0021, 0.0024][r - 1]; const cap = [40, 50, 60, 70, 80][r - 1]; return Math.min(energy * ratio * 100, cap); }",
      },
    ],
  },

  // ==========================================
  // 3-STAR POLEARMS (3)
  // ==========================================
  {
    id: "black-tassel",
    varName: "blackTassel",
    name: "Black Tassel",
    rarity: 3,
    baseAtk: 354,
    lvl1BaseAtk: 38,
    subStat: { type: "hpPct", label: "HP%", value: 46.9, baseValue: 10.2 },
    passiveName: "Bane of the Soft",
    passiveDesc: "Increases DMG against slimes by 40~80%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "black-tassel-slimes",
        label: "Target is a Slime (+40~80% DMG)",
        control: "toggle",
        defaultValue: 0,
        hint: "+40~80% All DMG bonus vs slimes",
      },
    ],
    buffs: [
      {
        id: "black-tassel-dmg",
        label: "All DMG Bonus vs Slimes (Black Tassel)",
        stat: "dmgBonus",
        refinementValues: [40, 50, 60, 70, 80],
        isTeamBuff: false,
        conditionKey: "black-tassel-slimes",
        computeCode:
          "(r, ctx) => { const on = (ctx.inputs?.['black-tassel-slimes'] ?? '0') === '1' || Number(ctx.inputs?.['black-tassel-slimes'] ?? 0) > 0; return on ? [40, 50, 60, 70, 80][r - 1] : 0; }",
      },
    ],
  },
  {
    id: "halberd",
    varName: "halberd",
    name: "Halberd",
    rarity: 3,
    baseAtk: 448,
    lvl1BaseAtk: 40,
    subStat: { type: "atkPct", label: "ATK%", value: 23.5, baseValue: 5.1 },
    passiveName: "Heavy",
    passiveDesc: "Normal Attacks deal an additional 160~320% DMG every 10s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "white-tassel",
    varName: "whiteTassel",
    name: "White Tassel",
    rarity: 3,
    baseAtk: 401,
    lvl1BaseAtk: 39,
    subStat: { type: "critRate", label: "CRIT Rate%", value: 23.4, baseValue: 5.1 },
    passiveName: "Sharp",
    passiveDesc: "Normal Attack DMG is increased by 24~48%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "white-tassel-na",
        label: "Normal Attack DMG Bonus (White Tassel)",
        stat: "normalDmgBonus",
        refinementValues: [24, 30, 36, 42, 48],
        isTeamBuff: false,
        computeCode: "(r) => [24, 30, 36, 42, 48][r - 1]",
      },
    ],
  },

  // ==========================================
  // 2-STAR & 1-STAR POLEARMS (2)
  // ==========================================
  {
    id: "iron-point",
    varName: "ironPoint",
    name: "Iron Point",
    rarity: 2,
    baseAtk: 243,
    lvl1BaseAtk: 33,
    passiveName: "",
    passiveDesc: "",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "beginners-protector",
    varName: "beginnersProtector",
    name: "Beginner's Protector",
    rarity: 1,
    baseAtk: 185,
    lvl1BaseAtk: 23,
    passiveName: "",
    passiveDesc: "",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
];

// Helper to write a weapon file
function generateWeaponFile(w: PolearmDefinition): string {
  const buffCode = (w.buffs || [])
    .map(
      (b: any) => `    {
      id: "${b.id}",
      label: "${b.label.replace(/"/g, '\\"')}",
      ${b.description ? `description: "${b.description.replace(/"/g, '\\"')}",\n      ` : ""}stat: "${b.stat}",
      refinementValues: [${b.refinementValues.join(", ")}],
      isTeamBuff: ${b.isTeamBuff},
      ${b.isPercent ? "isPercent: true,\n      " : ""}${b.conditionKey ? `conditionKey: "${b.conditionKey}",\n      ` : ""}${b.computeCode ? `compute: ${b.computeCode},` : ""}
    }`
    )
    .join(",\n");

  const mechanicCode = w.mechanicDefs?.length
    ? `  mechanicDefs: [\n` +
      w.mechanicDefs
        .map(
          (m: any) => `    {
      id: "${m.id}",
      label: "${m.label}",
      control: "${m.control}",
      ${m.defaultValue !== undefined ? `defaultValue: ${typeof m.defaultValue === "string" ? `"${m.defaultValue}"` : m.defaultValue},\n      ` : ""}${m.max !== undefined ? `max: ${m.max},\n      ` : ""}${m.min !== undefined ? `min: ${m.min},\n      ` : ""}${m.hint ? `hint: "${m.hint}",\n    ` : ""}}`
        )
        .join(",\n") +
      `\n  ],`
    : "";

  return `import type { WeaponConfig } from "../types";

export const ${w.varName}: WeaponConfig = {
  id: "${w.id}",
  name: "${w.name.replace(/"/g, '\\"')}",
  type: "Polearm",
  rarity: ${w.rarity},
  baseAtk: ${w.baseAtk},
  lvl1BaseAtk: ${w.lvl1BaseAtk},
  ${
    w.subStat
      ? `subStat: {
    type: "${w.subStat.type}",
    label: "${w.subStat.label}",
    value: ${w.subStat.value},
    ${w.subStat.baseValue !== undefined ? `baseValue: ${w.subStat.baseValue},` : ""}
  },`
      : ""
  }
  passiveName: "${w.passiveName.replace(/"/g, '\\"')}",
  passiveDesc:
    "${w.passiveDesc.replace(/"/g, '\\"')}",
  isSupport: ${w.isSupport},
  buffType: "${w.buffType}",
${mechanicCode ? mechanicCode + "\n" : ""}  buffs: [
${buffCode}
  ],
  ${w.signatureFor ? `signatureFor: [${w.signatureFor.map((s: string) => `"${s}"`).join(", ")}],` : ""}
};
`;
}

// Generate all polearm files
const polearmsDir = path.resolve("src/data/registry/weapons/polearms");

for (const w of COMPLETE_POLEARMS) {
  const filePath = path.join(polearmsDir, `${w.id}.ts`);
  const content = generateWeaponFile(w);
  fs.writeFileSync(filePath, content, "utf-8");
}

// Update polearms/index.ts
const imports = COMPLETE_POLEARMS.map((w) => `import { ${w.varName} } from "./${w.id}";`).join("\n");
const names = COMPLETE_POLEARMS.map((w) => w.varName).join(",\n  ");

const indexContent = `${imports}
import type { WeaponConfig } from "../types";

export {
  ${names},
};

export const POLEARMS: WeaponConfig[] = [
  ${names},
];
`;

fs.writeFileSync(path.join(polearmsDir, "index.ts"), indexContent, "utf-8");

console.log(`Successfully generated ${COMPLETE_POLEARMS.length} polearm files and updated polearms/index.ts.`);

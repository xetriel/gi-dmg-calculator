import type { WeaponConfig } from "../types";

export const bloodsoakedRuins: WeaponConfig = {
  id: "bloodsoaked-ruins",
  name: "Bloodsoaked Ruins",
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
  passiveName: "Mournful Tribute",
  passiveDesc:
    "For 3.5s after using an Elemental Burst, the equipping character's Lunar-Charged DMG dealt to opponents is increased by 36~84%. Additionally, after triggering a Lunar-Charged reaction, the equipping character will gain Requiem of Ruin: CRIT DMG is increased by 28~56% for 6s. They will also regain 12~16 Elemental Energy. Elemental Energy can be restored this way once every 14s.",
  isSupport: false,
  buffType: "self",
  signatureFor: ["flins"],
  mechanicDefs: [
    {
      id: "bloodsoaked-burst-active",
      label: "After Elemental Burst (+36~84% Lunar-Charged DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+36~84% Lunar-Charged DMG for 3.5s after using an Elemental Burst",
    },
    {
      id: "bloodsoaked-requiem-active",
      label: "Requiem of Ruin (+28~56% CRIT DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "+28~56% CRIT DMG for 6s after triggering a Lunar-Charged reaction",
    },
  ],
  buffs: [
    {
      id: "bloodsoaked-lunar-charged",
      label: "Lunar-Charged DMG% (Mournful Tribute)",
      stat: "lunarChargedDmgBonus",
      refinementValues: [36, 48, 60, 72, 84],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "bloodsoaked-burst-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["bloodsoaked-burst-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["bloodsoaked-burst-active"] ?? 1) > 0;
        return on ? [36, 48, 60, 72, 84][r - 1] : 0;
      },
    },
    {
      id: "bloodsoaked-crit-dmg",
      label: "CRIT DMG% (Requiem of Ruin)",
      stat: "critDmg",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "bloodsoaked-requiem-active",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["bloodsoaked-requiem-active"] ?? "1") === "1" ||
          Number(ctx.inputs?.["bloodsoaked-requiem-active"] ?? 1) > 0;
        return on ? [28, 35, 42, 49, 56][r - 1] : 0;
      },
    },
  ],
};

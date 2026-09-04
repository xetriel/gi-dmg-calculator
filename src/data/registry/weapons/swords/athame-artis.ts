import type { WeaponConfig } from "../types";

export const athameArtis: WeaponConfig = {
  id: "athame-artis",
  name: "Athame Artis",
  type: "Sword",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Day King's Splendor Solis",
  passiveDesc:
    "CRIT DMG from Elemental Bursts is increased by 16~32%. When an Elemental Burst hits an opponent, gain the Blade of the Daylight Hours effect: ATK is increased by 20~40%. Nearby active party members other than the equipping character have their ATK increased by 16~32% for 3s. Additionally, when the party possesses Hexerei: Secret Rite effects, the effects of Blade of the Daylight Hours are increased by an additional 75%. This effect can be triggered even if the equipping character is off-field.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "athame-burst-hit",
      label: "Blade of the Daylight Hours (Burst hit active)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% wielder ATK, +16~32% party ATK",
    },
    {
      id: "athame-hexerei-active",
      label: "Hexerei: Secret Rite Active (+75% effect)",
      control: "toggle",
      defaultValue: 0,
      hint: "Increases Blade of Daylight Hours ATK boosts by an additional 75%",
    },
  ],
  buffs: [
    {
      id: "athame-burst-crit-dmg",
      label: "Elemental Burst CRIT DMG (Athame Artis)",
      stat: "critDmg",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      compute: (r) => [16, 20, 24, 28, 32][r - 1],
    },
    {
      id: "athame-wielder-atk",
      label: "Wielder ATK% (Blade of Daylight Hours)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "athame-burst-hit",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["athame-burst-hit"] ?? "1") === "1" ||
          Number(ctx.inputs?.["athame-burst-hit"] ?? 1) > 0;
        if (!on) return 0;
        const hex =
          (ctx.inputs?.["athame-hexerei-active"] ?? "0") === "1" ||
          Number(ctx.inputs?.["athame-hexerei-active"] ?? 0) > 0;
        const mult = hex ? 1.75 : 1.0;
        return (([20, 25, 30, 35, 40][r - 1] * mult) / 100) * ctx.baseAtk;
      },
    },
    {
      id: "athame-party-atk",
      label: "Party ATK% (Athame Artis)",
      description: "Nearby party members other than wielder gain +16~32% ATK for 3s (boosted by 75% under Hexerei)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "athame-burst-hit",
      compute: (r, ctx) => {
        const on =
          (ctx.inputs?.["athame-burst-hit"] ?? "1") === "1" ||
          Number(ctx.inputs?.["athame-burst-hit"] ?? 1) > 0;
        if (!on) return 0;
        const hex =
          (ctx.inputs?.["athame-hexerei-active"] ?? "0") === "1" ||
          Number(ctx.inputs?.["athame-hexerei-active"] ?? 0) > 0;
        const mult = hex ? 1.75 : 1.0;
        return (([16, 20, 24, 28, 32][r - 1] * mult) / 100) * ctx.baseAtk;
      },
    },
  ],
};

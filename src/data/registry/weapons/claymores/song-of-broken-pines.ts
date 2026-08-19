import type { WeaponConfig } from "../types";

export const songOfBrokenPines: WeaponConfig = {
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
    "Increases ATK by 16~32%. Normal/Charged Attacks grant Sigils of Whispers (max 4). At 4 Sigils, all party members gain Millennial Movement: Banner-Hymn (+12~24% Normal ATK SPD and +20~40% ATK for 12s).",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "pines-banner-active",
      label: "Banner-Hymn Active (4 Sigils)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +12~24% Normal ATK SPD, +20~40% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "pines-party-atk",
      label: "Party ATK% (Song of Broken Pines)",
      description: "Nearby party members gain +20~40% ATK",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "pines-banner-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['pines-banner-active'] ?? '1') === '1' || Number(ctx.inputs?.['pines-banner-active'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "pines-self-atk",
      label: "Self ATK% (Song of Broken Pines Base)",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: false,
      isPercent: true,
      compute: (r, ctx) => ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk,
    }
  ],
  signatureFor: ["eula"],
};

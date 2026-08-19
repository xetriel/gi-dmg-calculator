import type { WeaponConfig } from "../types";

export const rainbowSerpentsRainBow: WeaponConfig = {
  id: "rainbow-serpents-rain-bow",
  name: "Rainbow Serpent's Rain Bow",
  type: "Bow",
  rarity: 4,
  baseAtk: 510,
  lvl1BaseAtk: 42,
  subStat: {
    type: "energyRecharge",
    label: "Energy Recharge%",
    value: 45.9,
    baseValue: 10,
  },
  passiveName: "Astral Whispers Beyond the Sacred Throne",
  passiveDesc:
    "ATK is increased by 28~56% for 8s after the equipping character's attacks hit an opponent while they are off-field.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "rainbow-serpent-offfield-hit",
      label: "Off-Field Attack Hit Active (+28~56% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+28~56% ATK for 8s",
    }
  ],
  buffs: [
    {
      id: "rainbow-serpent-atk",
      label: "ATK% (Rainbow Serpent's Rain Bow)",
      stat: "atk",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "rainbow-serpent-offfield-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['rainbow-serpent-offfield-hit'] ?? '1') === '1' || Number(ctx.inputs?.['rainbow-serpent-offfield-hit'] ?? 1) > 0; return on ? ([28, 35, 42, 49, 56][r - 1] / 100) * ctx.baseAtk : 0; },
    }
  ],
  
};

import type { WeaponConfig } from "../types";

export const athameArtis: WeaponConfig = {
  id: "athame-artis",
  name: "Athame Artis",
  type: "Sword",
  rarity: 5,
  baseAtk: 674,
  lvl1BaseAtk: 48,
  subStat: {
    type: "critDmg",
    label: "CRIT DMG%",
    value: 44.1,
    baseValue: 9.6,
  },
  passiveName: "Ritual Cleaving",
  passiveDesc:
    "Increases Normal and Charged Attack DMG by 20~40%. When the equipping character triggers an Elemental Reaction, nearby party members gain 12~24% All Elemental DMG Bonus and 16~32% ATK for 12s.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "athame-reaction-active",
      label: "Party Buff: Reaction Triggered Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +12~24% All Elemental DMG and +16~32% ATK for 12s",
    }
  ],
  buffs: [
    {
      id: "athame-party-elem-dmg",
      label: "Party All Elemental DMG Bonus (Athame Artis)",
      description: "Nearby party members gain +12~24% All Elemental DMG Bonus for 12s",
      stat: "dmgBonus",
      refinementValues: [12, 15, 18, 21, 24],
      isTeamBuff: true,
      conditionKey: "athame-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['athame-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['athame-reaction-active'] ?? 1) > 0; return on ? [12, 15, 18, 21, 24][r - 1] : 0; },
    },
    {
      id: "athame-party-atk",
      label: "Party ATK% (Athame Artis)",
      description: "Nearby party members gain +16~32% ATK for 12s",
      stat: "atk",
      refinementValues: [16, 20, 24, 28, 32],
      isTeamBuff: true,
      isPercent: true,
      conditionKey: "athame-reaction-active",
      compute: (r, ctx) => { const on = (ctx.inputs?.['athame-reaction-active'] ?? '1') === '1' || Number(ctx.inputs?.['athame-reaction-active'] ?? 1) > 0; return on ? ([16, 20, 24, 28, 32][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "athame-na-ca-dmg",
      label: "Normal/Charged Attack DMG Bonus (Athame Artis)",
      stat: "normalDmgBonus",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      compute: (r) => [20, 25, 30, 35, 40][r - 1],
    }
  ],
  
};

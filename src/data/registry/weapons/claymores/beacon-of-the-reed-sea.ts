import type { WeaponConfig } from "../types";

export const beaconOfTheReedSea: WeaponConfig = {
  id: "beacon-of-the-reed-sea",
  name: "Beacon of the Reed Sea",
  type: "Claymore",
  rarity: 5,
  baseAtk: 608,
  lvl1BaseAtk: 46,
  subStat: {
    type: "critRate",
    label: "CRIT Rate%",
    value: 33.1,
    baseValue: 7.2,
  },
  passiveName: "Desert Watch",
  passiveDesc:
    "After an Elemental Skill hits an opponent, ATK is increased by 20~40% for 8s. After taking DMG, ATK is increased by 20~40% for 8s. When not protected by a shield, Max HP is increased by 32~64%.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "beacon-skill-hit",
      label: "Skill Hit Opponent (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK",
    },
    {
      id: "beacon-took-dmg",
      label: "Character Took DMG (+20~40% ATK)",
      control: "toggle",
      defaultValue: 1,
      hint: "+20~40% ATK",
    },
    {
      id: "beacon-unshielded",
      label: "Unshielded (+32~64% Max HP)",
      control: "toggle",
      defaultValue: 1,
      hint: "+32~64% Max HP",
    }
  ],
  buffs: [
    {
      id: "beacon-skill-atk",
      label: "ATK% from Skill Hit (Beacon)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "beacon-skill-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['beacon-skill-hit'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-skill-hit'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "beacon-dmg-atk",
      label: "ATK% from Taking DMG (Beacon)",
      stat: "atk",
      refinementValues: [20, 25, 30, 35, 40],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "beacon-took-dmg",
      compute: (r, ctx) => { const on = (ctx.inputs?.['beacon-took-dmg'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-took-dmg'] ?? 1) > 0; return on ? ([20, 25, 30, 35, 40][r - 1] / 100) * ctx.baseAtk : 0; },
    },
    {
      id: "beacon-hp",
      label: "Max HP% (Beacon Unshielded)",
      stat: "hp",
      refinementValues: [32, 40, 48, 56, 64],
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "beacon-unshielded",
      compute: (r, ctx) => { const on = (ctx.inputs?.['beacon-unshielded'] ?? '1') === '1' || Number(ctx.inputs?.['beacon-unshielded'] ?? 1) > 0; return on ? [32, 40, 48, 56, 64][r - 1] : 0; },
    }
  ],
  signatureFor: ["dehya"],
};

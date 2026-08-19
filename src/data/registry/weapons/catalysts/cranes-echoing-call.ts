import type { WeaponConfig } from "../types";

export const cranesEchoingCall: WeaponConfig = {
  id: "cranes-echoing-call",
  name: "Crane's Echoing Call",
  type: "Catalyst",
  rarity: 5,
  baseAtk: 741,
  lvl1BaseAtk: 49,
  subStat: {
    type: "atkPct",
    label: "ATK%",
    value: 16.5,
    baseValue: 3.6,
  },
  passiveName: "Pavilion of the Sun",
  passiveDesc:
    "After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks deal 28~56% increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore 2.5~3.5 Energy to the equipping character.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "cranes-plunge-hit",
      label: "Wielder Plunging Attack Hit Active (+28~56% Party Plunge DMG)",
      control: "toggle",
      defaultValue: 1,
      hint: "Team buff: +28~56% Plunging Attack DMG for 20s",
    }
  ],
  buffs: [
    {
      id: "cranes-party-plunge-dmg",
      label: "Party Plunging Attack DMG Bonus (Crane's Echoing Call)",
      description: "All nearby party members gain +28~56% Plunging Attack DMG for 20s",
      stat: "plungeDmgBonus",
      refinementValues: [28, 35, 42, 49, 56],
      isTeamBuff: true,
      conditionKey: "cranes-plunge-hit",
      compute: (r, ctx) => { const on = (ctx.inputs?.['cranes-plunge-hit'] ?? '1') === '1' || Number(ctx.inputs?.['cranes-plunge-hit'] ?? 1) > 0; return on ? [28, 35, 42, 49, 56][r - 1] : 0; },
    }
  ],
  signatureFor: ["xianyun"],
};

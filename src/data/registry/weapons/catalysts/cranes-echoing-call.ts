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
  passiveName: "Pavonian Whispers",
  passiveDesc:
    "After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks deal 28~80% increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore 2.5~3.5 Energy to the equipping character.",
  isSupport: true,
  buffType: "both",
  buffs: [
    {
      id: "crane-party-plunge",
      label: "Party Plunging Attack DMG Bonus (Crane's Echoing Call)",
      description: "All nearby party members deal +28~80% increased Plunging Attack DMG",
      stat: "plungeDmgBonus",
      refinementValues: [28, 41, 54, 67, 80],
      isTeamBuff: true,
      compute: (r) => [28, 41, 54, 67, 80][r - 1],
    }
  ],
  signatureFor: ["xianyun"],
};

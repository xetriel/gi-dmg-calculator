import type { ArtifactConfig } from "./types";

export const nightOfTheSkysUnveiling: ArtifactConfig = {
  id: "night-of-the-skys-unveiling",
  name: "Night of the Sky's Unveiling",
  rarity: 5,
  twoPieceDesc: "Increases Lunar Reaction DMG by 20%.",
  fourPieceDesc: "When nearby party members trigger Lunar Reactions: on-field wielder gains Gleaming Moon: Intent (+15%/+30% CRIT Rate with Nascent/Ascendant Gleam). All party members' Lunar Reaction DMG +10% per Gleaming Moon effect.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "sky-moonsign-level",
          "label": "Moonsign Level (Nascent vs Ascendant Gleam)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Toggle ON for Ascendant Gleam (+30% CRIT Rate), OFF for Nascent Gleam (+15% CRIT Rate)"
      }
  ],
  buffs: [
    {
      id: "night-sky-2pc-lunar-charged",
      label: "2-Piece Lunar-Charged DMG% (Night of the Sky)",
      stat: "lunarChargedDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "night-sky-2pc-lunar-bloom",
      label: "2-Piece Lunar-Bloom DMG% (Night of the Sky)",
      stat: "lunarBloomDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "night-sky-2pc-lunar-cryst",
      label: "2-Piece Lunar-Crystallize DMG% (Night of the Sky)",
      stat: "lunarCrystallizeDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "night-sky-4pc-crit",
      label: "4-Piece Gleaming Moon CRIT Rate (Night of the Sky)",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 30,
      compute: (ctx) => {
        const isAscendant = (ctx.inputs?.["sky-moonsign-level"] ?? "1") === "1" || Number(ctx.inputs?.["sky-moonsign-level"] ?? 1) > 0;
        return isAscendant ? 30 : 15;
      },
    },
    {
      id: "night-sky-4pc-party-lunar",
      label: "4-Piece Party Lunar Reaction DMG% (Night of the Sky)",
      stat: "lunarChargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      value: 10,
      compute: () => 10,
    }
  ],
};

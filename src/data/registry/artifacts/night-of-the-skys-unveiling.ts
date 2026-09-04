import type { ArtifactConfig } from "./types";

export const nightOfTheSkysUnveiling: ArtifactConfig = {
  id: "night-of-the-skys-unveiling",
  name: "Night of the Sky's Unveiling",
  rarity: 5,
  twoPieceDesc: "Increases Elemental Mastery by 80.",
  fourPieceDesc: "When nearby party members trigger Lunar Reactions, if the equipping character is on the field, gain the Gleaming Moon: Intent effect for 4s: Increases CRIT Rate by 15%/30% when the party's Moonsign is Nascent Gleam/Ascendant Gleam. All party members' Lunar Reaction DMG is increased by 10% for each different Gleaming Moon effect that party members have. Effects from Gleaming Moon cannot stack.",
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
      id: "night-sky-2pc-em",
      label: "2-Piece Elemental Mastery (Night of the Sky's Unveiling)",
      stat: "em",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 80,
      compute: () => 80,
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

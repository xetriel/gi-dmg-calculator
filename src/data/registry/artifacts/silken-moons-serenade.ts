import type { ArtifactConfig } from "./types";

export const silkenMoonsSerenade: ArtifactConfig = {
  id: "silken-moons-serenade",
  name: "Silken Moon's Serenade",
  rarity: 5,
  twoPieceDesc: "Energy Recharge +20%.",
  fourPieceDesc: "When dealing Elemental DMG, gain Gleaming Moon: Devotion: Increases all party members' Elemental Mastery by 60/120 when Moonsign is Nascent/Ascendant Gleam (Triggerable off-field). All party members' Lunar Reaction DMG +10%.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "silken-moonsign-level",
          "label": "Moonsign Level (Nascent vs Ascendant Gleam)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Toggle ON for Ascendant Gleam (+120 Party EM), OFF for Nascent Gleam (+60 Party EM)"
      }
  ],
  buffs: [
    {
      id: "silken-moon-2pc-er",
      label: "2-Piece Energy Recharge% (Silken Moon's Serenade)",
      stat: "energyRecharge",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "silken-moon-4pc-party-em",
      label: "4-Piece Party Elemental Mastery (Silken Moon's Serenade)",
      stat: "em",
      pieceRequirement: 4,
      isTeamBuff: true,
      value: 120,
      compute: (ctx) => {
        const isAscendant = (ctx.inputs?.["silken-moonsign-level"] ?? "1") === "1" || Number(ctx.inputs?.["silken-moonsign-level"] ?? 1) > 0;
        return isAscendant ? 120 : 60;
      },
    },
    {
      id: "silken-moon-4pc-party-lunar",
      label: "4-Piece Party Lunar Reaction DMG% (Silken Moon's Serenade)",
      stat: "lunarChargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      value: 10,
      compute: () => 10,
    }
  ],
};

import type { ArtifactConfig } from "./types";

export const aubadeOfMorningstarAndMoon: ArtifactConfig = {
  id: "aubade-of-morningstar-and-moon",
  name: "Aubade of Morningstar and Moon",
  rarity: 5,
  twoPieceDesc: "Increases Lunar Reaction DMG by 20%.",
  fourPieceDesc: "When the equipping character is off-field, Lunar Reaction DMG is increased by 20%. When party's Moonsign Level is at least Ascendant Gleam, further increased by 40% (Total +60%).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "aubade-ascendant-gleam",
          "label": "Ascendant Gleam Moonsign (+40% Extra, Total +60%)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases Lunar Reaction DMG by an additional 40% (Total +60%) when Moonsign is Ascendant Gleam"
      }
  ],
  buffs: [
    {
      id: "aubade-2pc-lunar-charged",
      label: "2-Piece Lunar-Charged DMG% (Aubade of Morningstar)",
      stat: "lunarChargedDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "aubade-4pc-lunar-charged",
      label: "4-Piece Lunar Reaction DMG% (Aubade of Morningstar)",
      stat: "lunarChargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "aubade-ascendant-gleam",
      value: 60,
      compute: (ctx) => {
        const isAscendant = (ctx.inputs?.["aubade-ascendant-gleam"] ?? "1") === "1" || Number(ctx.inputs?.["aubade-ascendant-gleam"] ?? 1) > 0;
        return isAscendant ? 60 : 20;
      },
    }
  ],
};

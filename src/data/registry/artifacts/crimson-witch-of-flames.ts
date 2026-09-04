import type { ArtifactConfig } from "./types";

export const crimsonWitchOfFlames: ArtifactConfig = {
  id: "crimson-witch-of-flames",
  name: "Crimson Witch of Flames",
  rarity: 5,
  twoPieceDesc: "Pyro DMG Bonus +15%",
  fourPieceDesc: "Increases Overloaded and Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using Elemental Skill increases the 2-Piece Set Bonus by 50% of its starting value for 10s. Max 3 stacks.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "witch-stacks",
          "label": "Skill Cast Stacks (50% 2pc Boost / Stack)",
          "control": "stacks",
          "min": 0,
          "max": 3,
          "defaultValue": 3,
          "hint": "Each stack increases the 2-Piece Pyro DMG Bonus by 50% of its base value (+7.5% Pyro DMG per stack, max 3 stacks = +22.5%)"
      }
  ],
  buffs: [
    {
      id: "witch-2pc-pyro",
      label: "2-Piece Pyro DMG Bonus% (Crimson Witch of Flames)",
      stat: "pyroDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "witch-4pc-stacks-pyro",
      label: "4-Piece Stacking Pyro DMG Bonus% (Crimson Witch of Flames)",
      stat: "pyroDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "witch-stacks",
      value: 22.5,
      compute: (ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["witch-stacks"] ?? 3)));
        return stacks * 7.5;
      },
    }
  ],
};

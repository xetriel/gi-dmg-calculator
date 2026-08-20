import type { ArtifactConfig } from "./types";

export const deepwoodMemories: ArtifactConfig = {
  id: "deepwood-memories",
  name: "Deepwood Memories",
  rarity: 5,
  twoPieceDesc: "Dendro DMG Bonus +15%.",
  fourPieceDesc: "After Elemental Skills or Bursts hit opponents, the targets' Dendro RES will be decreased by 30% for 8s. This effect can be triggered even if the equipping character is not on the field.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "deepwood-res-shred",
          "label": "Skill/Burst Hit Opponents (Dendro RES -30%)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Decreases opponent's Dendro RES by 30% for 8s (Triggerable off-field)"
      }
  ],
  buffs: [
    {
      id: "deepwood-2pc-dendro",
      label: "2-Piece Dendro DMG Bonus% (Deepwood Memories)",
      stat: "dendroDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "deepwood-4pc-res-shred",
      label: "4-Piece Dendro RES Shred (Deepwood Memories)",
      stat: "enemyRes",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "deepwood-res-shred",
      value: -30,
      compute: (ctx) => {
        const on = (ctx.inputs?.["deepwood-res-shred"] ?? "1") === "1" || Number(ctx.inputs?.["deepwood-res-shred"] ?? 1) > 0;
        return on ? -30 : 0;
      },
    }
  ],
};

import type { ArtifactConfig } from "./types";

export const tinyMiracle: ArtifactConfig = {
  id: "tiny-miracle",
  name: "Tiny Miracle",
  rarity: 4,
  twoPieceDesc: "All Elemental RES increased by 20%.",
  fourPieceDesc: "Incoming Elemental DMG increases corresponding Elemental RES by 30% for 10s. Can only occur once every 10s.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "tiny-miracle-hit",
      label: "Incoming Elemental DMG Taken (+30% Elemental RES)",
      control: "toggle",
      defaultValue: 1,
      hint: "Incoming Elemental DMG increases corresponding Elemental RES by 30% for 10s",
    },
  ],
  buffs: [
    {
      id: "tiny-miracle-2pc-res",
      label: "2-Piece All Elemental RES (Tiny Miracle)",
      stat: "allRes",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "tiny-miracle-4pc-res",
      label: "4-Piece Elemental RES (Tiny Miracle)",
      stat: "allRes",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "tiny-miracle-hit",
      value: 30,
      compute: (ctx) => {
        const on = (ctx.inputs?.["tiny-miracle-hit"] ?? "1") === "1" || Number(ctx.inputs?.["tiny-miracle-hit"] ?? 1) > 0;
        return on ? 30 : 0;
      },
    },
  ],
};

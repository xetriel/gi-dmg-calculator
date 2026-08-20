import type { ArtifactConfig } from "./types";

export const wanderersTroupe: ArtifactConfig = {
  id: "wanderers-troupe",
  name: "Wanderer's Troupe",
  rarity: 5,
  twoPieceDesc: "Increases Elemental Mastery by 80.",
  fourPieceDesc: "Increases Charged Attack DMG by 35% if the character uses a Catalyst or Bow.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "wanderer-2pc-em",
      label: "2-Piece Elemental Mastery (Wanderer's Troupe)",
      stat: "em",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 80,
      compute: () => 80,
    },
    {
      id: "wanderer-4pc-ca-dmg",
      label: "4-Piece Charged Attack DMG% (Wanderer's Troupe)",
      stat: "chargedDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 35,
      compute: (ctx) => {
        const isEligible = !ctx.charWeapon || ctx.charWeapon === "Bow" || ctx.charWeapon === "Catalyst";
        return isEligible ? 35 : 0;
      },
    }
  ],
};

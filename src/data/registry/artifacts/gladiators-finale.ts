import type { ArtifactConfig } from "./types";

export const gladiatorsFinale: ArtifactConfig = {
  id: "gladiators-finale",
  name: "Gladiator's Finale",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc: "If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "gladiator-2pc-atk",
      label: "2-Piece ATK% (Gladiator's Finale)",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "gladiator-4pc-na-dmg",
      label: "4-Piece Normal Attack DMG% (Gladiator's Finale)",
      stat: "normalDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 35,
      compute: (ctx) => {
        const isEligible = !ctx.charWeapon || ctx.charWeapon === "Sword" || ctx.charWeapon === "Claymore" || ctx.charWeapon === "Polearm";
        return isEligible ? 35 : 0;
      },
    }
  ],
};

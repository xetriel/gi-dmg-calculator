import type { ArtifactConfig } from "./types";

export const viridescentVenerer: ArtifactConfig = {
  id: "viridescent-venerer",
  name: "Viridescent Venerer",
  rarity: 5,
  twoPieceDesc: "Anemo DMG Bonus +15%",
  fourPieceDesc: "Increases Swirl Reaction DMG dealt by 60%, and Stellar Swirl reaction DMG dealt by 20%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s. Upon triggering a Stellar Swirl in the opponent, will also decrease their Cryo RES by 40%. RES debuffs of the same elemental type do not stack.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "vv-res-shred-active",
          "label": "Swirl / Stellar Swirl Elemental RES Shred (-40%)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Decreases opponent's Elemental RES by 40% for 10s (Non-stacking)"
      }
  ],
  buffs: [
    {
      id: "vv-2pc-anemo",
      label: "2-Piece Anemo DMG Bonus% (Viridescent Venerer)",
      stat: "anemoDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "vv-4pc-stellar-swirl",
      label: "4-Piece Stellar Swirl DMG% (Viridescent Venerer)",
      stat: "stellarSwirlDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      value: 20,
      compute: () => 20,
    },
    {
      id: "vv-4pc-res-shred",
      label: "4-Piece Elemental RES Shred (Viridescent Venerer)",
      stat: "enemyRes",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "vv-res-shred-active",
      value: -40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["vv-res-shred-active"] ?? "1") === "1" || Number(ctx.inputs?.["vv-res-shred-active"] ?? 1) > 0;
        return on ? -40 : 0;
      },
    }
  ],
};

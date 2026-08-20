import type { ArtifactConfig } from "./types";

export const archaicPetra: ArtifactConfig = {
  id: "archaic-petra",
  name: "Archaic Petra",
  rarity: 5,
  twoPieceDesc: "Geo DMG Bonus +15%.",
  fourPieceDesc: "Upon obtaining an Elemental Shard created through Crystallize or triggering a Lunar-Crystallize reaction, all party members gain 35% DMG Bonus for that particular element for 10s. Only one form of Elemental DMG Bonus can be gained in this manner at any one time.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "petra-crystal-active",
          "label": "Picked Up Crystallize Shard / Lunar-Crystallize",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "All party members gain 35% Elemental DMG Bonus corresponding to the shard element for 10s"
      }
  ],
  buffs: [
    {
      id: "petra-2pc-geo",
      label: "2-Piece Geo DMG Bonus% (Archaic Petra)",
      stat: "geoDmgBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "petra-4pc-party-dmg",
      label: "4-Piece Party Elemental DMG Bonus% (Archaic Petra)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "petra-crystal-active",
      value: 35,
      compute: (ctx) => {
        const on = (ctx.inputs?.["petra-crystal-active"] ?? "1") === "1" || Number(ctx.inputs?.["petra-crystal-active"] ?? 1) > 0;
        return on ? 35 : 0;
      },
    }
  ],
};

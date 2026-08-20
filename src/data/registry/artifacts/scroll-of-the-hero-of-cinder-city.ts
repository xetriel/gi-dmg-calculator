import type { ArtifactConfig } from "./types";

export const scrollOfTheHeroOfCinderCity: ArtifactConfig = {
  id: "scroll-of-the-hero-of-cinder-city",
  name: "Scroll of the Hero of Cinder City",
  rarity: 5,
  twoPieceDesc: "When a nearby party member triggers a Nightsoul Burst, the equipping character regenerates 6 Elemental Energy.",
  fourPieceDesc: "After triggering a reaction related to their Elemental Type, all nearby party members gain a 12% Elemental DMG Bonus for elements involved for 15s. If in Nightsoul's Blessing state, all nearby party members gain an additional 28% Elemental DMG Bonus (Total +40%). Does not stack.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "cinder-reaction-active",
          "label": "Triggered Elemental Reaction",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "All nearby party members gain 12% Elemental DMG Bonus for elements involved"
      },
      {
          "id": "cinder-nightsoul-active",
          "label": "In Nightsoul's Blessing State (+28% Extra, Total +40%)",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases party Elemental DMG Bonus by an additional 28% (Total +40%)"
      }
  ],
  buffs: [
    {
      id: "cinder-4pc-party-dmg",
      label: "4-Piece Party Elemental DMG% (Scroll of Cinder City)",
      stat: "dmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "cinder-reaction-active",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["cinder-reaction-active"] ?? "1") === "1" || Number(ctx.inputs?.["cinder-reaction-active"] ?? 1) > 0;
        if (!on) return 0;
        const nightsoul = (ctx.inputs?.["cinder-nightsoul-active"] ?? "1") === "1" || Number(ctx.inputs?.["cinder-nightsoul-active"] ?? 1) > 0;
        return nightsoul ? 40 : 12;
      },
    }
  ],
};

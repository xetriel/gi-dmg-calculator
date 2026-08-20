import type { ArtifactConfig } from "./types";

export const flowerOfParadiseLost: ArtifactConfig = {
  id: "flower-of-paradise-lost",
  name: "Flower of Paradise Lost",
  rarity: 5,
  twoPieceDesc: "Increases Elemental Mastery by 80.",
  fourPieceDesc: "The equipping character's Bloom, Hyperbloom, and Burgeon reaction DMG are increased by 40%, and their Lunar-Bloom reaction DMG is increased by 10%. Triggering reactions grants an additional +25% bonus per stack (max 4 stacks, up to +80% Bloom/Hyperbloom/Burgeon, +20% Lunar-Bloom).",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
      {
          "id": "paradise-stacks",
          "label": "Reaction Trigger Stacks (Max 4)",
          "control": "stacks",
          "min": 0,
          "max": 4,
          "defaultValue": 4,
          "hint": "Each stack increases Bloom/Hyperbloom/Burgeon bonus by 25% of base (Max 4 stacks = +80% extra Bloom DMG, +20% extra Lunar-Bloom DMG)"
      }
  ],
  buffs: [
    {
      id: "fopl-2pc-em",
      label: "2-Piece Elemental Mastery (Flower of Paradise Lost)",
      stat: "em",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 80,
      compute: () => 80,
    },
    {
      id: "fopl-4pc-lunar-bloom",
      label: "4-Piece Lunar-Bloom DMG% (Flower of Paradise Lost)",
      stat: "lunarBloomDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "paradise-stacks",
      value: 30,
      compute: (ctx) => {
        const s = Math.min(4, Math.max(0, Number(ctx.inputs?.["paradise-stacks"] ?? 4)));
        return 10 + s * 2.5;
      },
    }
  ],
};

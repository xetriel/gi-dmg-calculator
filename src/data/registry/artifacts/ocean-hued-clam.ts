import type { ArtifactConfig } from "./types";

export const oceanHuedClam: ArtifactConfig = {
  id: "ocean-hued-clam",
  name: "Ocean-Hued Clam",
  rarity: 5,
  twoPieceDesc: "Healing Bonus +15%.",
  fourPieceDesc: "When the character equipping this artifact set heals a character in the party, a Sea-Dyed Foam will appear for 3 seconds, accumulating the amount of HP recovered from healing (including overflow healing).At the end of the duration, the Sea-Dyed Foam will explode, dealing DMG to nearby opponents based on 90% of the accumulated healing.(This DMG is calculated similarly to Reactions such as Electro-Charged, and Superconduct, but it is not affected by Elemental Mastery, Character Levels, or Reaction DMG Bonuses).Only one Sea-Dyed Foam can be produced every 3.5 seconds.Each Sea-Dyed Foam can accumulate up to 30,000 HP (including overflow healing).There can be no more than one Sea-Dyed Foam active at any given time.This effect can still be triggered even when the character who is using this artifact set is not on the field.",
  isSupport: false,
  buffType: "self",
  buffs: [
    {
      id: "clam-2pc-heal",
      label: "2-Piece Healing Bonus% (Ocean-Hued Clam)",
      stat: "healingBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    }
  ],
};

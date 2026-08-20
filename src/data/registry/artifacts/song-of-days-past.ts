import type { ArtifactConfig } from "./types";

export const songOfDaysPast: ArtifactConfig = {
  id: "song-of-days-past",
  name: "Song of Days Past",
  rarity: 5,
  twoPieceDesc: "Healing Bonus +15%.",
  fourPieceDesc: "When healing a party member, records healing up to 15,000 HP. Waves of Days Past increases active character's NA/CA/Plunge/Skill/Burst DMG by 8% of recorded healing (up to 1,200 Flat DMG).",
  isSupport: true,
  buffType: "both",
  buffs: [
    {
      id: "days-past-2pc-heal",
      label: "2-Piece Healing Bonus% (Song of Days Past)",
      stat: "healingBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    }
  ],
};

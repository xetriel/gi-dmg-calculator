import type { ArtifactConfig } from "./types";

export const maidenBeloved: ArtifactConfig = {
  id: "maiden-beloved",
  name: "Maiden Beloved",
  rarity: 5,
  twoPieceDesc: "Character Healing Effectiveness +15%",
  fourPieceDesc: "Using an Elemental Skill or Burst increases healing received by all party members by 20% for 10s.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "maiden-skill-burst",
      label: "Used Elemental Skill or Burst (Party Healing Received +20%)",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases healing received by all party members by 20% for 10s",
    },
  ],
  buffs: [
    {
      id: "maiden-2pc-heal",
      label: "2-Piece Healing Effectiveness% (Maiden Beloved)",
      stat: "healingBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "maiden-4pc-party-heal",
      label: "4-Piece Party Healing Received% (Maiden Beloved)",
      stat: "healingBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "maiden-skill-burst",
      value: 20,
      compute: (ctx) => {
        const on = (ctx.inputs?.["maiden-skill-burst"] ?? "1") === "1" || Number(ctx.inputs?.["maiden-skill-burst"] ?? 1) > 0;
        return on ? 20 : 0;
      },
    },
  ],
};

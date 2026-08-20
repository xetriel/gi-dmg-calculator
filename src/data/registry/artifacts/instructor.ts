import type { ArtifactConfig } from "./types";

export const instructor: ArtifactConfig = {
  id: "instructor",
  name: "Instructor",
  rarity: 4,
  twoPieceDesc: "Increases Elemental Mastery by 80.",
  fourPieceDesc: "Upon triggering an Elemental Reaction, increases all party members' Elemental Mastery by 120 for 8s.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
      {
          "id": "instructor-reaction",
          "label": "Triggered Elemental Reaction",
          "control": "toggle",
          "defaultValue": 1,
          "hint": "Increases all party members' Elemental Mastery by 120 for 8s"
      }
  ],
  buffs: [
    {
      id: "instructor-2pc-em",
      label: "2-Piece Elemental Mastery (Instructor)",
      stat: "em",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 80,
      compute: () => 80,
    },
    {
      id: "instructor-4pc-party-em",
      label: "4-Piece Party Elemental Mastery (Instructor)",
      stat: "em",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "instructor-reaction",
      value: 120,
      compute: (ctx) => {
        const on = (ctx.inputs?.["instructor-reaction"] ?? "1") === "1" || Number(ctx.inputs?.["instructor-reaction"] ?? 1) > 0;
        return on ? 120 : 0;
      },
    }
  ],
};

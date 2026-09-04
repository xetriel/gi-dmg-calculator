import type { ArtifactConfig } from "./types";

export const songOfDaysPast: ArtifactConfig = {
  id: "song-of-days-past",
  name: "Song of Days Past",
  rarity: 5,
  twoPieceDesc: "Healing Bonus +15%.",
  fourPieceDesc: 'When the equipping character heals a party member, the Yearning effect will be created for 6s, which records the total amount of healing provided (including overflow healing). When the duration expires, the Yearning effect will be transformed into the "Waves of Days Past" effect: When your active party member hits an opponent with a Normal Attack, Charged Attack, Plunging Attack, Elemental Skill, or Elemental Burst, the DMG dealt will be increased by 8% of the total healing amount recorded by the Yearning effect. The "Waves of Days Past" effect is removed after it has taken effect 5 times or after 10s. A single instance of the Yearning effect can record up to 15,000 healing, and only a single instance can exist at once, but it can record the healing from multiple equipping characters. Equipping characters on standby can still trigger this effect.',
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "days-past-healing",
      label: "Recorded Healing (0–15,000 HP)",
      control: "stacks",
      min: 0,
      max: 15000,
      defaultValue: 15000,
      hint: "Waves of Days Past increases active character DMG by 8% of recorded healing (Max +1,200 Flat DMG)",
    },
  ],
  buffs: [
    {
      id: "days-past-2pc-heal",
      label: "2-Piece Healing Bonus% (Song of Days Past)",
      stat: "healingBonus",
      pieceRequirement: 2,
      isTeamBuff: false,
      value: 15,
      compute: () => 15,
    },
    {
      id: "days-past-4pc-flat-dmg",
      label: "4-Piece Waves of Days Past Flat DMG (Song of Days Past)",
      stat: "flatDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "days-past-healing",
      value: 1200,
      compute: (ctx) => {
        const healing = Math.min(15000, Math.max(0, Number(ctx.inputs?.["days-past-healing"] ?? 15000)));
        return Math.min(1200, healing * 0.08);
      },
    },
  ],
};

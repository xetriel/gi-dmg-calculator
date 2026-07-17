import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge } from "./hit-helpers";

export const gaming: CharacterConfig = {
  id: "gaming",
  name: "Gaming",
  rarity: 4,
  element: "Pyro",
  weapon: "Claymore",
  scalingSource: "atk",
  ascensionStat: { label: "ATK", maxValue: 24.0 },
  dmgBonusLabel: "Pyro DMG Bonus%",
  stats: coreStats("Pyro DMG Bonus%"),
  talents: [
    {
      type: "normal",
      name: "Normal Attack — Stellar Rend",
      hits: [
        atk("1-hit", "1-Hit"),
        atk("2-hit", "2-Hit"),
        atk("3-hit", "3-Hit"),
        atk("4-hit", "4-Hit"),
        atkCharged("charged-cyclic", "Charged Attack Cyclic DMG"),
        atkCharged("charged-final", "Charged Attack Final DMG"),
        atkPlunge("plunge", "Plunge"),
        atkPlunge("low-plunge", "Low Plunge"),
        atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill",
      name: "Elemental Skill — Bestial Ascent",
      hits: [
        atkPlunge("charmed-cloudstrider-dmg", "Plunging Attack: Charmed Cloudstrider DMG"),
      ]
    },
    {
      type: "burst",
      name: "Elemental Burst — Suanni's Gilded Dance",
      hits: [
        { key: "smash-dmg", name: "Suanni Man Chai Smash DMG", scaling: "atk", hitCategory: "burst" },
      ]
    }
  ],
  mechanicDefs: [
    {
      id: "gaming-high-hp",
      label: "HP ≥ 60% (A4 DMG Buff)",
      control: "toggle",
      defaultValue: 1,
      hint: "A4: Increases Plunging Attack: Charmed Cloudstrider damage by 20% when HP is 60% or more."
    },
    {
      id: "c2-overflow-heal",
      label: "C2 Overflow Healing ATK Bonus",
      control: "toggle",
      defaultValue: 0,
      hint: "C2: Increases ATK by 20% for 5 seconds when Gaming receives overflow healing."
    }
  ],
  mechanics: [
    "Dance of Amity (A1): Landing a Charmed Cloudstrider plunge heals 6% of Max HP over 0.8s.",
    "Air of Prosperity (A4): If HP ≥ 60%, Charmed Cloudstrider DMG is increased by 20%. If HP < 60%, its healing is increased by 20%.",
    "Bringer of Blessing (C1): Meeting back up with Suanni Man Chai heals Gaming by 15% of Max HP.",
    "Plumage of Plummet (C2): Overflow healing increases Gaming's ATK by 20% (scaling off Base ATK) for 5s.",
    "Soarer of Solitary Solace (C4): Charmed Cloudstrider hits restore 2 Energy to Gaming.",
    "To Tame All Beasts (C6): Charmed Cloudstrider CRIT Rate +20%, CRIT DMG +40%, and attack radius increased."
  ],
  constellations: [
    {
      level: 1,
      name: "Bringer of Blessing",
      description: "When Suanni Man Chai meets back up with Gaming, he heals 15% of Max HP.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2,
      name: "Plumage of Plummet",
      description: "When Gaming receives overflow healing, ATK is increased by 20% for 5 seconds.",
      effects: [{ type: "informational" }]
    },
    {
      level: 3,
      name: "Awakening Awakening",
      description: "Increases the Level of Elemental Skill: Bestial Ascent by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4,
      name: "Soarer of Solitary Solace",
      description: "When Charmed Cloudstrider hits an opponent, restores 2 Energy.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5,
      name: "Demon-Daunting Roar",
      description: "Increases the Level of Elemental Burst: Suanni's Gilded Dance by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6,
      name: "To Tame All Beasts",
      description: "Charmed Cloudstrider CRIT Rate increased by 20%, CRIT DMG increased by 40%, and attack radius increased.",
      effects: [{ type: "informational" }]
    }
  ]
};

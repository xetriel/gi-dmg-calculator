import type { CharacterConfig } from "../types";
import { coreStats } from "../core-stats";
import { atk, atkCharged, atkPlunge, lunarEm } from "./hit-helpers";

export const nefer: CharacterConfig = {
  id: "nefer", name: "Nefer", rarity: 5,
  element: "Dendro", weapon: "Catalyst", scalingSource: "em",
  ascensionStat: { label: "CRIT DMG", maxValue: 38.4 },
  dmgBonusLabel: "Dendro DMG Bonus%",
  stats: coreStats("Dendro DMG Bonus%"),
  talents: [
    {
      type: "normal", name: "Normal Attack — Striking Serpent", hits: [
        atk("1-hit", "1-Hit"), atk("2-hit", "2-Hit"), atk("3-hit", "3-Hit ×2 (each)"), atk("4-hit", "4-Hit"),
        atkCharged("charged", "Charged Attack"),
        atkPlunge("plunge", "Plunge"), atkPlunge("low-plunge", "Low Plunge"), atkPlunge("high-plunge", "High Plunge"),
      ]
    },
    {
      type: "skill", name: "Elemental Skill — Senet Strategy: Dance of a Thousand Nights", hits: [
        { key: "skill-dmg", name: "Skill DMG (% ATK + % EM)", scaling: "em", hitCategory: "skill" },
        { key: "phantasm-1-nefer", name: "Phantasm Performance 1-Hit (Nefer — % ATK + % EM)", scaling: "em", hitCategory: "charged" },
        { key: "phantasm-2-nefer", name: "Phantasm Performance 2-Hit (Nefer — % ATK + % EM)", scaling: "em", hitCategory: "charged" },
        lunarEm("phantasm-1-shades", "Phantasm Performance 1-Hit (Shades — % EM)"),
        lunarEm("phantasm-2-shades", "Phantasm Performance 2-Hit (Shades — % EM)"),
        lunarEm("phantasm-3-shades", "Phantasm Performance 3-Hit (Shades — % EM)"),
        lunarEm("c6-converted", "C6 Converted Phantasm 2-Hit (Nefer — % EM)"),
        lunarEm("c6-extra", "C6 Extra Lunar-Bloom DMG (% EM)"),
      ]
    },
    {
      type: "burst", name: "Elemental Burst — Sacred Vow: True Eye's Phantasm", hits: [
        { key: "burst-1-hit", name: "1-Hit DMG (% ATK + % EM)", scaling: "em", hitCategory: "burst" },
        { key: "burst-2-hit", name: "2-Hit DMG (% ATK + % EM)", scaling: "em", hitCategory: "burst" },
        { key: "burst-dmg-bonus", name: "DMG Bonus (% per Veil stack)", scaling: "em", kind: "buff" },
      ]
    },
  ],
  mechanicDefs: [
    {
      id: "shadow-dance", label: "Shadow Dance state", control: "toggle", defaultValue: 1,
      hint: "Charged Attacks replaced by Phantasm Performance; decreases stamina cost"
    },
    {
      id: "veil-stacks", label: "Veil of Falsehood stacks", control: "stacks", max: 5, defaultValue: 3,
      hint: "+8% Phantasm Performance DMG per stack; at max stacks (3 or 5), EM increases by 100/200"
    },
    {
      id: "lunar-bloom-trigger", label: "Lunar-Bloom triggered recently (A4)", control: "toggle", defaultValue: 1,
      hint: "A4: allows Slither to generate additional Verdant Dew (informational)"
    },
    {
      id: "c4-res-shred", label: "C4: opponent Dendro RES decrease", control: "toggle",
      hint: "Opponents' Dendro RES decreased by 20% (during Shadow Dance)"
    },
    {
      id: "ascendant-gleam", label: "Moonsign: Ascendant Gleam", control: "toggle", defaultValue: 1,
      hint: "A1: Enables Seeds of Deceit absorption. C6: Lunar-Bloom DMG elevated by 15%."
    }
  ],
  wikiTalents: [
    {
      name: "Striking Serpent",
      type: "Normal Attack",
      description: "Normal Attack: Performs up to 4 kicks that deal Dendro DMG with the ferocity and grace of a striking serpent. Charged Attack: Nefer enters the Slither state, consuming Stamina to move rapidly forward for up to 2.5s. When the skill button is released, the duration ends, or Stamina runs out, Nefer will exit the Slither state and consume a certain amount of additional Stamina to deal Dendro DMG to opponents. When in the Shadow Dance state, additional Stamina consumption is decreased. Additionally, unleashing the Elemental Skill Senet Strategy: Dance of a Thousand Nights or sprinting while Nefer is in the Slither state will not cause her to exit the state. Plunging Attack: Calling upon the might of Dendro, Nefer plunges towards the ground from mid-air, damaging all opponents in her path and dealing AoE Dendro DMG upon impact with the ground."
    },
    {
      name: "Senet Strategy: Dance of a Thousand Nights",
      type: "Elemental Skill",
      description: "A dance that dissolved dynasties, as chilling as a winter's night on the great sea of sand, yet lingering with the tenderness of moonlit gauze. Nefer charges forward, dealing AoE Dendro DMG and entering the Shadow Dance state. While in the Shadow Dance state, if you have at least 1 Verdant Dew, Nefer's Charged Attacks will be replaced with the special Charged Attack Phantasm Performance, which will not consume Stamina. Nefer summons shades of herself to perform Coordinated Attacks against enemies. Nefer and the shades will deal 2 and 3 stages of AoE Dendro DMG respectively. DMG dealt by the shades is considered Lunar-Bloom DMG. 1 Verdant Dew will be consumed the first time shades are summoned after every Phantasm Performance. When in the Shadow Dance state, Nefer's resistance to interruption is increased. Two initial charges."
    },
    {
      name: "Sacred Vow: True Eye's Phantasm",
      type: "Elemental Burst",
      description: "Grant 'revelation' to the mysteries of the false through Thoth's true sight, dealing AoE Dendro DMG to opponents ahead. When unleashed, Nefer will consume all Veils of Falsehood to increase the DMG dealt by the current Elemental Burst."
    },
    {
      name: "A Wager of Moonlight",
      type: "Passive Talent",
      description: "Nefer will be granted the corresponding buff effects based on the party's Moonsign. Moonsign: Ascendant Gleam: When she unleashes her Elemental Skill Senet Strategy: Dance of a Thousand Nights, any Dendro Cores on the field will be converted to Seeds of Deceit, and any Lunar-Bloom reactions triggered by nearby characters in the following 15s that would create Dendro Cores or Bountiful Cores will instead create Seeds of Deceit. Seeds of Deceit cannot trigger Hyperbloom or Burgeon reactions and will not burst. When Nefer unleashes a Charged Attack or Phantasm Performance, she can absorb Seeds of Deceit within a certain range, gaining 1 stack of Veil of Falsehood for every seed absorbed. When this effect reaches 3 stacks, or when the third stack's duration is refreshed, Nefer's Elemental Mastery will be increased by 100 for 8s."
    },
    {
      name: "Daughter of the Dust and Sand",
      type: "Passive Talent",
      description: "When Nefer is in the Shadow Dance state, for 5s after a party member triggers a Lunar-Bloom reaction, Nefer's Slither state will provide additional Verdant Dew. Every 100 points of Nefer's Elemental Mastery beyond 500 will strengthen this additional provision effect by 10%. The maximum increase that can be achieved this way is 50%."
    },
    {
      name: "Dusklit Eaves",
      type: "Moonsign Benediction Passive",
      description: "When a party member triggers a Bloom reaction, it will be converted into the Lunar-Bloom reaction, with every point of Elemental Mastery that Nefer has increasing Lunar-Bloom's Base DMG by 0.0175%, up to a maximum of 14%. Additionally, when Nefer is in the party, the party's Moonsign will increase by 1 level."
    },
    {
      name: "Conspiracy of the Golden Vault",
      type: "Utility Passive",
      description: "Gains 25% more rewards when dispatched on a Nod-Krai Expedition for 20 hours. Additionally, as the head of the Curatorium of Secrets, Nefer seemingly has the ability to obtain intelligence from a variety of sources — intelligence that certain factions in Nasha Town might find extremely interesting..."
    }
  ],
  constellations: [
    {
      level: 1, name: "Planning Breeds Success",
      description: "The Base DMG for Lunar-Bloom reactions caused by Nefer's Phantasm Performance is increased by 60% of her Elemental Mastery. This effect is also boosted by Veil of Falsehood.",
      effects: [{ type: "informational" }]
    },
    {
      level: 2, name: "Observation Feeds Strategy",
      description: "Enhances the effects of the Ascension Talent A Wager of Moonlight: Extends Veil of Falsehood's duration by 5s, and increases its stack limit to 5, as well as causing Phantasm Performance to deal up to 140% of its original DMG. When Nefer unleashes her Elemental Skill Senet Strategy: Dance of a Thousand Nights, she will instantly gain 2 stacks of Veil of Falsehood. Additionally, when Veil of Falsehood reaches 5 stacks, or when the fifth stack's duration is refreshed, Nefer's Elemental Mastery will be increased by 200 for 8s instead. You must first unlock the Ascension Talent 'A Wager of Moonlight.'",
      effects: [{ type: "informational" }]
    },
    {
      level: 3, name: "Deceit Cloaks the Truth",
      description: "Increases the Level of Senet Strategy: Dance of a Thousand Nights by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "skill" }]
    },
    {
      level: 4, name: "Delusion Ensnares Reason",
      description: "When Nefer is on the field and in the Shadow Dance state, you will gain Verdant Dew 25% faster. Additionally, while Nefer is in the Shadow Dance state, nearby opponents will have their Dendro RES decreased by 20%. When Nefer exits the Shadow Dance state or after she strays a certain distance away from the opponents, this effect will be removed after 4.5s.",
      effects: [{ type: "informational" }]
    },
    {
      level: 5, name: "Opportunity Hides in the Margins",
      description: "Increases the Level of Sacred Vow: True Eye's Phantasm by 3. Maximum upgrade level is 15.",
      effects: [{ type: "talent_level_bonus", talentType: "burst" }]
    },
    {
      level: 6, name: "Victory Flows from the Turning of Tides",
      description: "When Nefer unleashes Phantasm Performance, the second stage of DMG dealt by herself will be converted to deal AoE Dendro DMG equal to 85% of her Elemental Mastery. Additionally, when the attacks from Phantasm Performance end, an extra instance of AoE Dendro DMG equal to 120% of Nefer's Elemental Mastery will be dealt. All of the aforementioned DMG is considered Lunar-Bloom DMG dealt by Phantasm Performance. Moonsign: Ascendant Gleam Nefer's Lunar-Bloom DMG is elevated by 15%.",
      effects: [{ type: "informational" }]
    }
  ]
};

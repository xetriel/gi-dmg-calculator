import fs from "fs";
import path from "path";

interface RawArtifact {
  id: string;
  name: string;
  rarity: number;
  twoPieceDesc: string;
  fourPieceDesc: string;
  isSupport: boolean;
  buffType: "team" | "self" | "both";
  mechanicDefs?: Array<{
    id: string;
    label: string;
    control: "toggle" | "percent" | "stacks";
    min?: number;
    max?: number;
    defaultValue?: number;
    hint?: string;
  }>;
  buffs: Array<{
    id: string;
    label: string;
    description?: string;
    stat: string;
    pieceRequirement: number;
    isTeamBuff: boolean;
    isPercent?: boolean;
    conditionKey?: string;
    value?: number;
    computeSnippet?: string;
  }>;
}

export const ALL_ARTIFACTS: RawArtifact[] = [
  // --- Batch 1: Starter & 1★-4★ Sets ---
  {
    id: "initiate",
    name: "Initiate",
    rarity: 1,
    twoPieceDesc: "Basic 1★ equipment.",
    fourPieceDesc: "No 4-Piece bonus.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "adventurer",
    name: "Adventurer",
    rarity: 3,
    twoPieceDesc: "Max HP increased by 1,000.",
    fourPieceDesc: "Opening a chest regenerates 30% Max HP over 5s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "adventurer-2pc-hp",
        label: "2-Piece Flat HP (Adventurer)",
        stat: "hp",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 1000,
        computeSnippet: "() => 1000",
      },
    ],
  },
  {
    id: "lucky-dog",
    name: "Lucky Dog",
    rarity: 3,
    twoPieceDesc: "DEF increased by 100.",
    fourPieceDesc: "Picking up Mora restores 300 HP.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "lucky-dog-2pc-def",
        label: "2-Piece Flat DEF (Lucky Dog)",
        stat: "def",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 100,
        computeSnippet: "() => 100",
      },
    ],
  },
  {
    id: "traveling-doctor",
    name: "Traveling Doctor",
    rarity: 3,
    twoPieceDesc: "Increases incoming healing by 20%.",
    fourPieceDesc: "Using Elemental Burst restores 20% HP.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "traveling-doctor-2pc-heal",
        label: "2-Piece Incoming Healing% (Traveling Doctor)",
        stat: "healingBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
    ],
  },
  {
    id: "resolution-of-sojourner",
    name: "Resolution of Sojourner",
    rarity: 4,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc: "Increases Charged Attack CRIT Rate by 30%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "sojourner-2pc-atk",
        label: "2-Piece ATK% (Resolution of Sojourner)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "sojourner-4pc-ca-crit",
        label: "4-Piece Charged Attack CRIT Rate (Resolution of Sojourner)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 30,
        computeSnippet: "() => 30",
      },
    ],
  },
  {
    id: "tiny-miracle",
    name: "Tiny Miracle",
    rarity: 4,
    twoPieceDesc: "All Elemental RES increased by 20%.",
    fourPieceDesc: "Incoming Elemental DMG increases corresponding Elemental RES by 30% for 10s. Can only occur once every 10s.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "berserker",
    name: "Berserker",
    rarity: 4,
    twoPieceDesc: "CRIT Rate increased by 12%.",
    fourPieceDesc: "When HP is below 70%, CRIT Rate increases by an additional 24%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "hp-lt-70",
        label: "HP Below 70%",
        control: "toggle",
        defaultValue: 1,
        hint: "Grants an additional +24% CRIT Rate when HP is below 70%",
      },
    ],
    buffs: [
      {
        id: "berserker-2pc-crit",
        label: "2-Piece CRIT Rate (Berserker)",
        stat: "critRate",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 12,
        computeSnippet: "() => 12",
      },
      {
        id: "berserker-4pc-low-hp-crit",
        label: "4-Piece Low HP CRIT Rate (Berserker)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "hp-lt-70",
        value: 24,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["hp-lt-70"] ?? "1") === "1" || Number(ctx.inputs?.["hp-lt-70"] ?? 1) > 0;
        return on ? 24 : 0;
      }`,
      },
    ],
  },
  {
    id: "instructor",
    name: "Instructor",
    rarity: 4,
    twoPieceDesc: "Increases Elemental Mastery by 80.",
    fourPieceDesc: "Upon triggering an Elemental Reaction, increases all party members' Elemental Mastery by 120 for 8s.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "instructor-reaction",
        label: "Triggered Elemental Reaction",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases all party members' Elemental Mastery by 120 for 8s",
      },
    ],
    buffs: [
      {
        id: "instructor-2pc-em",
        label: "2-Piece Elemental Mastery (Instructor)",
        stat: "em",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 80,
        computeSnippet: "() => 80",
      },
      {
        id: "instructor-4pc-party-em",
        label: "4-Piece Party Elemental Mastery (Instructor)",
        stat: "em",
        pieceRequirement: 4,
        isTeamBuff: true,
        conditionKey: "instructor-reaction",
        value: 120,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["instructor-reaction"] ?? "1") === "1" || Number(ctx.inputs?.["instructor-reaction"] ?? 1) > 0;
        return on ? 120 : 0;
      }`,
      },
    ],
  },
  {
    id: "the-exile",
    name: "The Exile",
    rarity: 4,
    twoPieceDesc: "Energy Recharge +20%.",
    fourPieceDesc: "Using an Elemental Burst regenerates 2 Energy for all party members (excluding the wearer) every 2s for 6s. This effect cannot stack.",
    isSupport: true,
    buffType: "both",
    buffs: [
      {
        id: "exile-2pc-er",
        label: "2-Piece Energy Recharge% (The Exile)",
        stat: "energyRecharge",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
    ],
  },
  {
    id: "defenders-will",
    name: "Defender's Will",
    rarity: 4,
    twoPieceDesc: "DEF increased by 30%.",
    fourPieceDesc: "For each different element present in your own party, the wearer's Elemental RES to that corresponding element is increased by 30%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "defenders-will-2pc-def",
        label: "2-Piece DEF% (Defender's Will)",
        stat: "def",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 30,
        computeSnippet: "(ctx) => (30 / 100) * ctx.baseAtk",
      },
    ],
  },
  {
    id: "brave-heart",
    name: "Brave Heart",
    rarity: 4,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc: "Increases DMG by 30% against opponents with more than 50% HP.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "opponent-hp-gt-50",
        label: "Opponent HP > 50%",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases DMG by 30% against opponents with more than 50% HP",
      },
    ],
    buffs: [
      {
        id: "brave-heart-2pc-atk",
        label: "2-Piece ATK% (Brave Heart)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "brave-heart-4pc-dmg",
        label: "4-Piece DMG Bonus% (Brave Heart)",
        stat: "dmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "opponent-hp-gt-50",
        value: 30,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["opponent-hp-gt-50"] ?? "1") === "1" || Number(ctx.inputs?.["opponent-hp-gt-50"] ?? 1) > 0;
        return on ? 30 : 0;
      }`,
      },
    ],
  },
  {
    id: "martial-artist",
    name: "Martial Artist",
    rarity: 4,
    twoPieceDesc: "Increases Normal Attack and Charged Attack DMG by 15%.",
    fourPieceDesc: "After using Elemental Skill, increases Normal Attack and Charged Attack DMG by 25% for 8s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "skill-used-ma",
        label: "After Elemental Skill",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Normal and Charged Attack DMG by an additional 25% for 8s",
      },
    ],
    buffs: [
      {
        id: "martial-artist-2pc-na",
        label: "2-Piece Normal Attack DMG% (Martial Artist)",
        stat: "normalDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "martial-artist-2pc-ca",
        label: "2-Piece Charged Attack DMG% (Martial Artist)",
        stat: "chargedDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "martial-artist-4pc-na",
        label: "4-Piece Normal Attack DMG% (Martial Artist)",
        stat: "normalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "skill-used-ma",
        value: 25,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["skill-used-ma"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-ma"] ?? 1) > 0;
        return on ? 25 : 0;
      }`,
      },
      {
        id: "martial-artist-4pc-ca",
        label: "4-Piece Charged Attack DMG% (Martial Artist)",
        stat: "chargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "skill-used-ma",
        value: 25,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["skill-used-ma"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-ma"] ?? 1) > 0;
        return on ? 25 : 0;
      }`,
      },
    ],
  },
  {
    id: "gambler",
    name: "Gambler",
    rarity: 4,
    twoPieceDesc: "Increases Elemental Skill DMG by 20%.",
    fourPieceDesc: "Defeating an opponent has a 100% chance to remove Elemental Skill CD. Can only occur once every 15s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "gambler-2pc-skill-dmg",
        label: "2-Piece Elemental Skill DMG% (Gambler)",
        stat: "skillDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    rarity: 4,
    twoPieceDesc: "Energy Recharge +20%.",
    fourPieceDesc: "Gaining Elemental Particles or Orbs gives 3 Energy to all party members who have a bow or a catalyst equipped. Can only occur once every 3s.",
    isSupport: true,
    buffType: "both",
    buffs: [
      {
        id: "scholar-2pc-er",
        label: "2-Piece Energy Recharge% (Scholar)",
        stat: "energyRecharge",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
    ],
  },
  {
    id: "prayers-for-wisdom",
    name: "Prayers for Wisdom",
    rarity: 4,
    twoPieceDesc: "Affected by Electro for 40% less time.",
    fourPieceDesc: "1-Piece Tiara set.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "prayers-for-destiny",
    name: "Prayers for Destiny",
    rarity: 4,
    twoPieceDesc: "Affected by Hydro for 40% less time.",
    fourPieceDesc: "1-Piece Tiara set.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "prayers-for-illumination",
    name: "Prayers for Illumination",
    rarity: 4,
    twoPieceDesc: "Affected by Pyro for 40% less time.",
    fourPieceDesc: "1-Piece Tiara set.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },
  {
    id: "prayers-to-springtime",
    name: "Prayers to Springtime",
    rarity: 4,
    twoPieceDesc: "Affected by Cryo for 40% less time.",
    fourPieceDesc: "1-Piece Tiara set.",
    isSupport: false,
    buffType: "self",
    buffs: [],
  },

  // --- Batch 2: Classic 4★–5★ Sets ---
  {
    id: "gladiators-finale",
    name: "Gladiator's Finale",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc: "If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "gladiator-2pc-atk",
        label: "2-Piece ATK% (Gladiator's Finale)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "gladiator-4pc-na-dmg",
        label: "4-Piece Normal Attack DMG% (Gladiator's Finale)",
        stat: "normalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 35,
        computeSnippet: `(ctx) => {
        const isEligible = !ctx.charWeapon || ctx.charWeapon === "Sword" || ctx.charWeapon === "Claymore" || ctx.charWeapon === "Polearm";
        return isEligible ? 35 : 0;
      }`,
      },
    ],
  },
  {
    id: "wanderers-troupe",
    name: "Wanderer's Troupe",
    rarity: 5,
    twoPieceDesc: "Increases Elemental Mastery by 80.",
    fourPieceDesc: "Increases Charged Attack DMG by 35% if the character uses a Catalyst or Bow.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "wanderer-2pc-em",
        label: "2-Piece Elemental Mastery (Wanderer's Troupe)",
        stat: "em",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 80,
        computeSnippet: "() => 80",
      },
      {
        id: "wanderer-4pc-ca-dmg",
        label: "4-Piece Charged Attack DMG% (Wanderer's Troupe)",
        stat: "chargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 35,
        computeSnippet: `(ctx) => {
        const isEligible = !ctx.charWeapon || ctx.charWeapon === "Bow" || ctx.charWeapon === "Catalyst";
        return isEligible ? 35 : 0;
      }`,
      },
    ],
  },
  {
    id: "noblesse-oblige",
    name: "Noblesse Oblige",
    rarity: 5,
    twoPieceDesc: "Elemental Burst DMG +20%.",
    fourPieceDesc: "Using an Elemental Burst increases all party members' ATK by 20% for 12s. This effect cannot stack.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "noblesse-burst",
        label: "Used Elemental Burst (Party ATK +20%)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases all party members' ATK by 20% for 12s (Non-stacking)",
      },
    ],
    buffs: [
      {
        id: "noblesse-2pc-burst",
        label: "2-Piece Elemental Burst DMG% (Noblesse Oblige)",
        stat: "burstDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "noblesse-4pc-party-atk",
        label: "4-Piece Party ATK% (Noblesse Oblige)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "noblesse-burst",
        value: 20,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["noblesse-burst"] ?? "1") === "1" || Number(ctx.inputs?.["noblesse-burst"] ?? 1) > 0;
        return on ? (20 / 100) * ctx.baseAtk : 0;
      }`,
      },
    ],
  },
  {
    id: "bloodstained-chivalry",
    name: "Bloodstained Chivalry",
    rarity: 5,
    twoPieceDesc: "Physical DMG +25%.",
    fourPieceDesc: "After defeating an opponent, increases Charged Attack DMG by 50%, and reduces its Stamina cost to 0 for 10s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "defeat-opponent-bc",
        label: "Defeated Opponent",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Charged Attack DMG by 50% for 10s",
      },
    ],
    buffs: [
      {
        id: "bloodstained-2pc-phys",
        label: "2-Piece Physical DMG% (Bloodstained Chivalry)",
        stat: "physicalDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 25,
        computeSnippet: "() => 25",
      },
      {
        id: "bloodstained-4pc-ca-dmg",
        label: "4-Piece Charged Attack DMG% (Bloodstained Chivalry)",
        stat: "chargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "defeat-opponent-bc",
        value: 50,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["defeat-opponent-bc"] ?? "1") === "1" || Number(ctx.inputs?.["defeat-opponent-bc"] ?? 1) > 0;
        return on ? 50 : 0;
      }`,
      },
    ],
  },
  {
    id: "maiden-beloved",
    name: "Maiden Beloved",
    rarity: 5,
    twoPieceDesc: "Character Healing Effectiveness +15%.",
    fourPieceDesc: "Using an Elemental Skill or Burst increases healing received by all party members by 20% for 10s.",
    isSupport: true,
    buffType: "both",
    buffs: [
      {
        id: "maiden-2pc-heal",
        label: "2-Piece Healing Effectiveness% (Maiden Beloved)",
        stat: "healingBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
    ],
  },
  {
    id: "viridescent-venerer",
    name: "Viridescent Venerer",
    rarity: 5,
    twoPieceDesc: "Anemo DMG Bonus +15%.",
    fourPieceDesc:
      "Increases Swirl Reaction DMG dealt by 60%, and Stellar Swirl reaction DMG dealt by 20%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s. Upon triggering a Stellar Swirl in the opponent, will also decrease their Cryo RES by 40%. RES debuffs of the same elemental type do not stack.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "vv-res-shred-active",
        label: "Swirl / Stellar Swirl Elemental RES Shred (-40%)",
        control: "toggle",
        defaultValue: 1,
        hint: "Decreases opponent's Elemental RES by 40% for 10s (Non-stacking)",
      },
    ],
    buffs: [
      {
        id: "vv-2pc-anemo",
        label: "2-Piece Anemo DMG Bonus% (Viridescent Venerer)",
        stat: "anemoDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "vv-4pc-stellar-swirl",
        label: "4-Piece Stellar Swirl DMG% (Viridescent Venerer)",
        stat: "stellarSwirlDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "vv-4pc-res-shred",
        label: "4-Piece Elemental RES Shred (Viridescent Venerer)",
        stat: "enemyRes",
        pieceRequirement: 4,
        isTeamBuff: true,
        conditionKey: "vv-res-shred-active",
        value: -40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["vv-res-shred-active"] ?? "1") === "1" || Number(ctx.inputs?.["vv-res-shred-active"] ?? 1) > 0;
        return on ? -40 : 0;
      }`,
      },
    ],
  },
  {
    id: "archaic-petra",
    name: "Archaic Petra",
    rarity: 5,
    twoPieceDesc: "Geo DMG Bonus +15%.",
    fourPieceDesc:
      "Upon obtaining an Elemental Shard created through Crystallize or triggering a Lunar-Crystallize reaction, all party members gain 35% DMG Bonus for that particular element for 10s. Only one form of Elemental DMG Bonus can be gained in this manner at any one time.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "petra-crystal-active",
        label: "Picked Up Crystallize Shard / Lunar-Crystallize",
        control: "toggle",
        defaultValue: 1,
        hint: "All party members gain 35% Elemental DMG Bonus corresponding to the shard element for 10s",
      },
    ],
    buffs: [
      {
        id: "petra-2pc-geo",
        label: "2-Piece Geo DMG Bonus% (Archaic Petra)",
        stat: "geoDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "petra-4pc-party-dmg",
        label: "4-Piece Party Elemental DMG Bonus% (Archaic Petra)",
        stat: "dmgBonus",
        pieceRequirement: 4,
        isTeamBuff: true,
        conditionKey: "petra-crystal-active",
        value: 35,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["petra-crystal-active"] ?? "1") === "1" || Number(ctx.inputs?.["petra-crystal-active"] ?? 1) > 0;
        return on ? 35 : 0;
      }`,
      },
    ],
  },
  {
    id: "retracing-bolide",
    name: "Retracing Bolide",
    rarity: 5,
    twoPieceDesc: "Increases Shield Strength by 35%.",
    fourPieceDesc: "While protected by a shield, gain an additional 40% Normal and Charged Attack DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "has-shield-bolide",
        label: "Protected by a Shield",
        control: "toggle",
        defaultValue: 1,
        hint: "Grants +40% Normal and Charged Attack DMG while shielded",
      },
    ],
    buffs: [
      {
        id: "bolide-4pc-na",
        label: "4-Piece Normal Attack DMG% (Retracing Bolide)",
        stat: "normalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "has-shield-bolide",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["has-shield-bolide"] ?? "1") === "1" || Number(ctx.inputs?.["has-shield-bolide"] ?? 1) > 0;
        return on ? 40 : 0;
      }`,
      },
      {
        id: "bolide-4pc-ca",
        label: "4-Piece Charged Attack DMG% (Retracing Bolide)",
        stat: "chargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "has-shield-bolide",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["has-shield-bolide"] ?? "1") === "1" || Number(ctx.inputs?.["has-shield-bolide"] ?? 1) > 0;
        return on ? 40 : 0;
      }`,
      },
    ],
  },
  {
    id: "thundersoother",
    name: "Thundersoother",
    rarity: 5,
    twoPieceDesc: "Electro RES increased by 40%.",
    fourPieceDesc: "Increases DMG against opponents affected by Electro by 35%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "target-electro",
        label: "Opponent Affected by Electro",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases DMG dealt by 35% against opponents affected by Electro",
      },
    ],
    buffs: [
      {
        id: "thundersoother-4pc-dmg",
        label: "4-Piece DMG Bonus% (Thundersoother)",
        stat: "dmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "target-electro",
        value: 35,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["target-electro"] ?? "1") === "1" || Number(ctx.inputs?.["target-electro"] ?? 1) > 0;
        return on ? 35 : 0;
      }`,
      },
    ],
  },
  {
    id: "thundering-fury",
    name: "Thundering Fury",
    rarity: 5,
    twoPieceDesc: "Electro DMG Bonus +15%.",
    fourPieceDesc:
      "Increases the DMG caused by Overloaded, Electro-Charged, Superconduct, and Hyperbloom by 40%, the DMG Bonus conferred by Aggravate by 20%, and the DMG caused by Lunar-Charged and Stellar-Conduct by 20%. When Quicken or the aforementioned Elemental Reactions are triggered, Elemental Skill CD is decreased by 1s. Can only occur once every 0.8s.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "tf-2pc-electro",
        label: "2-Piece Electro DMG Bonus% (Thundering Fury)",
        stat: "electroDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "tf-4pc-lunar-charged",
        label: "4-Piece Lunar-Charged DMG% (Thundering Fury)",
        stat: "lunarChargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
    ],
  },
  {
    id: "lavawalker",
    name: "Lavawalker",
    rarity: 5,
    twoPieceDesc: "Pyro RES increased by 40%.",
    fourPieceDesc: "Increases DMG against opponents affected by Pyro by 35%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "target-pyro",
        label: "Opponent Affected by Pyro",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases DMG dealt by 35% against opponents affected by Pyro",
      },
    ],
    buffs: [
      {
        id: "lavawalker-4pc-dmg",
        label: "4-Piece DMG Bonus% (Lavawalker)",
        stat: "dmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "target-pyro",
        value: 35,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["target-pyro"] ?? "1") === "1" || Number(ctx.inputs?.["target-pyro"] ?? 1) > 0;
        return on ? 35 : 0;
      }`,
      },
    ],
  },
  {
    id: "crimson-witch-of-flames",
    name: "Crimson Witch of Flames",
    rarity: 5,
    twoPieceDesc: "Pyro DMG Bonus +15%.",
    fourPieceDesc:
      "Increases Overloaded and Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using Elemental Skill increases the 2-Piece Set Bonus by 50% of its starting value for 10s. Max 3 stacks.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "witch-stacks",
        label: "Skill Cast Stacks (50% 2pc Boost / Stack)",
        control: "stacks",
        min: 0,
        max: 3,
        defaultValue: 3,
        hint: "Each stack increases the 2-Piece Pyro DMG Bonus by 50% of its base value (+7.5% Pyro DMG per stack, max 3 stacks = +22.5%)",
      },
    ],
    buffs: [
      {
        id: "witch-2pc-pyro",
        label: "2-Piece Pyro DMG Bonus% (Crimson Witch of Flames)",
        stat: "pyroDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "witch-4pc-stacks-pyro",
        label: "4-Piece Stacking Pyro DMG Bonus% (Crimson Witch of Flames)",
        stat: "pyroDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "witch-stacks",
        value: 22.5,
        computeSnippet: `(ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["witch-stacks"] ?? 3)));
        return stacks * 7.5;
      }`,
      },
    ],
  },
  {
    id: "blizzard-strayer",
    name: "Blizzard Strayer",
    rarity: 5,
    twoPieceDesc: "Cryo DMG Bonus +15%.",
    fourPieceDesc: "When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "target-cryo",
        label: "Opponent Affected by Cryo (+20% CRIT Rate)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases CRIT Rate by 20% against opponents affected by Cryo",
      },
      {
        id: "target-frozen",
        label: "Opponent is Frozen (Additional +20% CRIT Rate)",
        control: "toggle",
        defaultValue: 0,
        hint: "Increases CRIT Rate by an additional 20% (Total +40% CRIT Rate) when opponent is Frozen",
      },
    ],
    buffs: [
      {
        id: "blizzard-2pc-cryo",
        label: "2-Piece Cryo DMG Bonus% (Blizzard Strayer)",
        stat: "cryoDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "blizzard-4pc-crit",
        label: "4-Piece CRIT Rate (Blizzard Strayer)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 40,
        computeSnippet: `(ctx) => {
        const cryo = (ctx.inputs?.["target-cryo"] ?? "1") === "1" || Number(ctx.inputs?.["target-cryo"] ?? 1) > 0;
        const frozen = (ctx.inputs?.["target-frozen"] ?? "0") === "1" || Number(ctx.inputs?.["target-frozen"] ?? 0) > 0;
        return (cryo ? 20 : 0) + (frozen ? 20 : 0);
      }`,
      },
    ],
  },
  {
    id: "heart-of-depth",
    name: "Heart of Depth",
    rarity: 5,
    twoPieceDesc: "Hydro DMG Bonus +15%.",
    fourPieceDesc: "After using an Elemental Skill, increases Normal Attack and Charged Attack DMG by 30% for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "skill-used-hod",
        label: "After Elemental Skill (+30% NA/CA DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Normal and Charged Attack DMG by 30% for 15s after using Elemental Skill",
      },
    ],
    buffs: [
      {
        id: "hod-2pc-hydro",
        label: "2-Piece Hydro DMG Bonus% (Heart of Depth)",
        stat: "hydroDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "hod-4pc-na",
        label: "4-Piece Normal Attack DMG% (Heart of Depth)",
        stat: "normalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "skill-used-hod",
        value: 30,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["skill-used-hod"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-hod"] ?? 1) > 0;
        return on ? 30 : 0;
      }`,
      },
      {
        id: "hod-4pc-ca",
        label: "4-Piece Charged Attack DMG% (Heart of Depth)",
        stat: "chargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "skill-used-hod",
        value: 30,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["skill-used-hod"] ?? "1") === "1" || Number(ctx.inputs?.["skill-used-hod"] ?? 1) > 0;
        return on ? 30 : 0;
      }`,
      },
    ],
  },

  // --- Batch 3: Inazuma & Sumeru Sets ---
  {
    id: "tenacity-of-the-millelith",
    name: "Tenacity of the Millelith",
    rarity: 5,
    twoPieceDesc: "HP increased by 20%.",
    fourPieceDesc:
      "When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by 20% and their Shield Strength is increased by 30% for 3s. This effect can be triggered once every 0.5s. This effect can still be triggered even when the character who is using this artifact set is not on the field.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "totm-skill-hit",
        label: "Elemental Skill Hit Opponent (Party ATK +20%)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases all nearby party members' ATK by 20% and Shield Strength by 30% for 3s",
      },
    ],
    buffs: [
      {
        id: "totm-2pc-hp",
        label: "2-Piece HP% (Tenacity of the Millelith)",
        stat: "hp",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 20,
        computeSnippet: "(ctx) => (20 / 100) * ctx.baseAtk",
      },
      {
        id: "totm-4pc-party-atk",
        label: "4-Piece Party ATK% (Tenacity of the Millelith)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: true,
        isPercent: true,
        conditionKey: "totm-skill-hit",
        value: 20,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["totm-skill-hit"] ?? "1") === "1" || Number(ctx.inputs?.["totm-skill-hit"] ?? 1) > 0;
        return on ? (20 / 100) * ctx.baseAtk : 0;
      }`,
      },
    ],
  },
  {
    id: "pale-flame",
    name: "Pale Flame",
    rarity: 5,
    twoPieceDesc: "Physical DMG +25%.",
    fourPieceDesc:
      "When an Elemental Skill hits an opponent, ATK is increased by 9% for 7s. This effect stacks up to 2 times and can be triggered once every 0.3s. Once 2 stacks are reached, the 2-set effect is increased by 100%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "pale-flame-stacks",
        label: "Skill Hit Stacks (9% ATK / Stack)",
        control: "stacks",
        min: 0,
        max: 2,
        defaultValue: 2,
        hint: "Each stack grants +9% ATK. At 2 stacks, grants an additional +25% Physical DMG Bonus",
      },
    ],
    buffs: [
      {
        id: "pale-flame-2pc-phys",
        label: "2-Piece Physical DMG% (Pale Flame)",
        stat: "physicalDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 25,
        computeSnippet: "() => 25",
      },
      {
        id: "pale-flame-4pc-atk",
        label: "4-Piece Stacking ATK% (Pale Flame)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "pale-flame-stacks",
        value: 18,
        computeSnippet: `(ctx) => {
        const stacks = Math.min(2, Math.max(0, Number(ctx.inputs?.["pale-flame-stacks"] ?? 2)));
        return (stacks * 9 / 100) * ctx.baseAtk;
      }`,
      },
      {
        id: "pale-flame-4pc-max-phys",
        label: "4-Piece Max Stacks Physical DMG% (Pale Flame)",
        stat: "physicalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "pale-flame-stacks",
        value: 25,
        computeSnippet: `(ctx) => {
        const stacks = Math.min(2, Math.max(0, Number(ctx.inputs?.["pale-flame-stacks"] ?? 2)));
        return stacks >= 2 ? 25 : 0;
      }`,
      },
    ],
  },
  {
    id: "shimenawas-reminiscence",
    name: "Shimenawa's Reminiscence",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc:
      "When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/Plunging Attack DMG is increased by 50% for 10s. This effect will not trigger again during that duration.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "shimenawa-active",
        label: "Skill Cast Energy Consumed (+50% NA/CA/Plunge)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Normal, Charged, and Plunging Attack DMG by 50% for 10s after casting Skill with >=15 Energy",
      },
    ],
    buffs: [
      {
        id: "shimenawa-2pc-atk",
        label: "2-Piece ATK% (Shimenawa's Reminiscence)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "shimenawa-4pc-na",
        label: "4-Piece Normal Attack DMG% (Shimenawa's Reminiscence)",
        stat: "normalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "shimenawa-active",
        value: 50,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["shimenawa-active"] ?? "1") === "1" || Number(ctx.inputs?.["shimenawa-active"] ?? 1) > 0;
        return on ? 50 : 0;
      }`,
      },
      {
        id: "shimenawa-4pc-ca",
        label: "4-Piece Charged Attack DMG% (Shimenawa's Reminiscence)",
        stat: "chargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "shimenawa-active",
        value: 50,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["shimenawa-active"] ?? "1") === "1" || Number(ctx.inputs?.["shimenawa-active"] ?? 1) > 0;
        return on ? 50 : 0;
      }`,
      },
      {
        id: "shimenawa-4pc-plunge",
        label: "4-Piece Plunging Attack DMG% (Shimenawa's Reminiscence)",
        stat: "plungeDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "shimenawa-active",
        value: 50,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["shimenawa-active"] ?? "1") === "1" || Number(ctx.inputs?.["shimenawa-active"] ?? 1) > 0;
        return on ? 50 : 0;
      }`,
      },
    ],
  },
  {
    id: "emblem-of-severed-fate",
    name: "Emblem of Severed Fate",
    rarity: 5,
    twoPieceDesc: "Energy Recharge +20%.",
    fourPieceDesc: "Increases Elemental Burst DMG by 25% of Energy Recharge. A maximum of 75% bonus DMG can be obtained in this way.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "emblem-er-input",
        label: "Total Energy Recharge% for Scaling",
        control: "percent",
        min: 100,
        max: 350,
        defaultValue: 200,
        hint: "Elemental Burst DMG increases by 25% of Energy Recharge (Capped at 75% Burst DMG at 300% ER)",
      },
    ],
    buffs: [
      {
        id: "emblem-2pc-er",
        label: "2-Piece Energy Recharge% (Emblem of Severed Fate)",
        stat: "energyRecharge",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "emblem-4pc-burst-dmg",
        label: "4-Piece Scaled Burst DMG% (Emblem of Severed Fate)",
        stat: "burstDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "emblem-er-input",
        value: 50,
        computeSnippet: `(ctx) => {
        const er = Number(ctx.inputs?.["emblem-er-input"] ?? 200);
        return Math.min(75, er * 0.25);
      }`,
      },
    ],
  },
  {
    id: "husk-of-opulent-dreams",
    name: "Husk of Opulent Dreams",
    rarity: 5,
    twoPieceDesc: "DEF +30%.",
    fourPieceDesc: "A character equipped with this Artifact set will obtain Curiosity stacks (up to 4 stacks, each providing 6% DEF and a 6% Geo DMG Bonus).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "curiosity-stacks",
        label: "Curiosity Stacks (6% DEF & 6% Geo / Stack)",
        control: "stacks",
        min: 0,
        max: 4,
        defaultValue: 4,
        hint: "Each stack grants +6% DEF and +6% Geo DMG Bonus (Max 4 stacks = +24% DEF, +24% Geo DMG)",
      },
    ],
    buffs: [
      {
        id: "husk-2pc-def",
        label: "2-Piece DEF% (Husk of Opulent Dreams)",
        stat: "def",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 30,
        computeSnippet: "(ctx) => (30 / 100) * ctx.baseAtk",
      },
      {
        id: "husk-4pc-geo-dmg",
        label: "4-Piece Stacking Geo DMG% (Husk of Opulent Dreams)",
        stat: "geoDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "curiosity-stacks",
        value: 24,
        computeSnippet: `(ctx) => {
        const stacks = Math.min(4, Math.max(0, Number(ctx.inputs?.["curiosity-stacks"] ?? 4)));
        return stacks * 6;
      }`,
      },
    ],
  },
  {
    id: "ocean-hued-clam",
    name: "Ocean-Hued Clam",
    rarity: 5,
    twoPieceDesc: "Healing Bonus +15%.",
    fourPieceDesc: "Accumulates healing to explode Sea-Dyed Foam dealing physical DMG (90% of accumulated healing, up to 27,000 base DMG).",
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
        computeSnippet: "() => 15",
      },
    ],
  },
  {
    id: "vermillion-hereafter",
    name: "Vermillion Hereafter",
    rarity: 5,
    twoPieceDesc: "ATK +18%.",
    fourPieceDesc: "After using Elemental Burst, gain Nascent Light increasing ATK by 8%, plus 10% per HP loss stack (max 4 stacks, total +48% ATK).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "vermillion-nascent-light",
        label: "Nascent Light Active (After Burst)",
        control: "toggle",
        defaultValue: 1,
        hint: "Grants +8% ATK base after Elemental Burst",
      },
      {
        id: "vermillion-hp-stacks",
        label: "HP Loss Stacks (10% ATK / Stack)",
        control: "stacks",
        min: 0,
        max: 4,
        defaultValue: 4,
        hint: "Each HP loss grants +10% ATK (Max 4 stacks = +40% ATK, Total +48% ATK with base)",
      },
    ],
    buffs: [
      {
        id: "vermillion-2pc-atk",
        label: "2-Piece ATK% (Vermillion Hereafter)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "vermillion-4pc-atk",
        label: "4-Piece Nascent Light ATK% (Vermillion Hereafter)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "vermillion-nascent-light",
        value: 48,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["vermillion-nascent-light"] ?? "1") === "1" || Number(ctx.inputs?.["vermillion-nascent-light"] ?? 1) > 0;
        if (!on) return 0;
        const stacks = Math.min(4, Math.max(0, Number(ctx.inputs?.["vermillion-hp-stacks"] ?? 4)));
        return ((8 + stacks * 10) / 100) * ctx.baseAtk;
      }`,
      },
    ],
  },
  {
    id: "echoes-of-an-offering",
    name: "Echoes of an Offering",
    rarity: 5,
    twoPieceDesc: "ATK +18%.",
    fourPieceDesc: "When Normal Attacks hit opponents, there is a chance to trigger Valley Rite, increasing Normal Attack DMG by 70% of ATK.",
    isSupport: false,
    buffType: "self",
    buffs: [
      {
        id: "echoes-2pc-atk",
        label: "2-Piece ATK% (Echoes of an Offering)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
    ],
  },
  {
    id: "deepwood-memories",
    name: "Deepwood Memories",
    rarity: 5,
    twoPieceDesc: "Dendro DMG Bonus +15%.",
    fourPieceDesc: "After Elemental Skills or Bursts hit opponents, the targets' Dendro RES will be decreased by 30% for 8s. This effect can be triggered even if the equipping character is not on the field.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "deepwood-res-shred",
        label: "Skill/Burst Hit Opponents (Dendro RES -30%)",
        control: "toggle",
        defaultValue: 1,
        hint: "Decreases opponent's Dendro RES by 30% for 8s (Triggerable off-field)",
      },
    ],
    buffs: [
      {
        id: "deepwood-2pc-dendro",
        label: "2-Piece Dendro DMG Bonus% (Deepwood Memories)",
        stat: "dendroDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "deepwood-4pc-res-shred",
        label: "4-Piece Dendro RES Shred (Deepwood Memories)",
        stat: "enemyRes",
        pieceRequirement: 4,
        isTeamBuff: true,
        conditionKey: "deepwood-res-shred",
        value: -30,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["deepwood-res-shred"] ?? "1") === "1" || Number(ctx.inputs?.["deepwood-res-shred"] ?? 1) > 0;
        return on ? -30 : 0;
      }`,
      },
    ],
  },
  {
    id: "gilded-dreams",
    name: "Gilded Dreams",
    rarity: 5,
    twoPieceDesc: "Increases Elemental Mastery by 80.",
    fourPieceDesc: "Within 8s of triggering an Elemental Reaction: ATK +14% for each same element party member (up to 3), and EM +50 for each different element party member (up to 3).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "gilded-same-element",
        label: "Same Element Teammates (14% ATK / Char)",
        control: "stacks",
        min: 0,
        max: 3,
        defaultValue: 1,
        hint: "Each teammate of the same element increases ATK by 14% (Max 3)",
      },
      {
        id: "gilded-diff-element",
        label: "Different Element Teammates (50 EM / Char)",
        control: "stacks",
        min: 0,
        max: 3,
        defaultValue: 2,
        hint: "Each teammate of a different element increases Elemental Mastery by 50 (Max 3)",
      },
    ],
    buffs: [
      {
        id: "gilded-2pc-em",
        label: "2-Piece Elemental Mastery (Gilded Dreams)",
        stat: "em",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 80,
        computeSnippet: "() => 80",
      },
      {
        id: "gilded-4pc-atk",
        label: "4-Piece Team Match ATK% (Gilded Dreams)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: false,
        isPercent: true,
        value: 14,
        computeSnippet: `(ctx) => {
        const same = Math.min(3, Math.max(0, Number(ctx.inputs?.["gilded-same-element"] ?? 1)));
        return (same * 14 / 100) * ctx.baseAtk;
      }`,
      },
      {
        id: "gilded-4pc-em",
        label: "4-Piece Team Variety EM (Gilded Dreams)",
        stat: "em",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 100,
        computeSnippet: `(ctx) => {
        const diff = Math.min(3, Math.max(0, Number(ctx.inputs?.["gilded-diff-element"] ?? 2)));
        return diff * 50;
      }`,
      },
    ],
  },
  {
    id: "desert-pavilion-chronicle",
    name: "Desert Pavilion Chronicle",
    rarity: 5,
    twoPieceDesc: "Anemo DMG Bonus +15%.",
    fourPieceDesc: "When Charged Attacks hit opponents, the equipping character's Normal Attack SPD will increase by 10% while Normal, Charged, and Plunging Attack DMG will increase by 40% for 15s.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "dpc-ca-hit",
        label: "Charged Attack Hit (+40% NA/CA/Plunge)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Normal, Charged, and Plunging Attack DMG by 40% for 15s",
      },
    ],
    buffs: [
      {
        id: "dpc-2pc-anemo",
        label: "2-Piece Anemo DMG Bonus% (Desert Pavilion Chronicle)",
        stat: "anemoDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "dpc-4pc-na",
        label: "4-Piece Normal Attack DMG% (Desert Pavilion Chronicle)",
        stat: "normalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "dpc-ca-hit",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["dpc-ca-hit"] ?? "1") === "1" || Number(ctx.inputs?.["dpc-ca-hit"] ?? 1) > 0;
        return on ? 40 : 0;
      }`,
      },
      {
        id: "dpc-4pc-ca",
        label: "4-Piece Charged Attack DMG% (Desert Pavilion Chronicle)",
        stat: "chargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "dpc-ca-hit",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["dpc-ca-hit"] ?? "1") === "1" || Number(ctx.inputs?.["dpc-ca-hit"] ?? 1) > 0;
        return on ? 40 : 0;
      }`,
      },
      {
        id: "dpc-4pc-plunge",
        label: "4-Piece Plunging Attack DMG% (Desert Pavilion Chronicle)",
        stat: "plungeDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "dpc-ca-hit",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["dpc-ca-hit"] ?? "1") === "1" || Number(ctx.inputs?.["dpc-ca-hit"] ?? 1) > 0;
        return on ? 40 : 0;
      }`,
      },
    ],
  },
  {
    id: "flower-of-paradise-lost",
    name: "Flower of Paradise Lost",
    rarity: 5,
    twoPieceDesc: "Increases Elemental Mastery by 80.",
    fourPieceDesc:
      "The equipping character's Bloom, Hyperbloom, and Burgeon reaction DMG are increased by 40%, and their Lunar-Bloom reaction DMG is increased by 10%. Triggering reactions grants an additional +25% bonus per stack (max 4 stacks, up to +80% Bloom/Hyperbloom/Burgeon, +20% Lunar-Bloom).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "paradise-stacks",
        label: "Reaction Trigger Stacks (Max 4)",
        control: "stacks",
        min: 0,
        max: 4,
        defaultValue: 4,
        hint: "Each stack increases Bloom/Hyperbloom/Burgeon bonus by 25% of base (Max 4 stacks = +80% extra Bloom DMG, +20% extra Lunar-Bloom DMG)",
      },
    ],
    buffs: [
      {
        id: "fopl-2pc-em",
        label: "2-Piece Elemental Mastery (Flower of Paradise Lost)",
        stat: "em",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 80,
        computeSnippet: "() => 80",
      },
      {
        id: "fopl-4pc-lunar-bloom",
        label: "4-Piece Lunar-Bloom DMG% (Flower of Paradise Lost)",
        stat: "lunarBloomDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "paradise-stacks",
        value: 30,
        computeSnippet: `(ctx) => {
        const s = Math.min(4, Math.max(0, Number(ctx.inputs?.["paradise-stacks"] ?? 4)));
        return 10 + s * 2.5;
      }`,
      },
    ],
  },
  {
    id: "nymphs-dream",
    name: "Nymph's Dream",
    rarity: 5,
    twoPieceDesc: "Hydro DMG Bonus +15%.",
    fourPieceDesc: "After Normal/Charged/Plunge/Skill/Burst hits, gain Mirrored Nymph stacks. 1/2/3 stacks grant +7%/16%/25% ATK and +4%/9%/15% Hydro DMG.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "nymph-stacks",
        label: "Mirrored Nymph Stacks (1–3)",
        control: "stacks",
        min: 0,
        max: 3,
        defaultValue: 3,
        hint: "1/2/3 stacks grant 7%/16%/25% ATK and 4%/9%/15% Hydro DMG Bonus",
      },
    ],
    buffs: [
      {
        id: "nymph-2pc-hydro",
        label: "2-Piece Hydro DMG Bonus% (Nymph's Dream)",
        stat: "hydroDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "nymph-4pc-atk",
        label: "4-Piece Stacking ATK% (Nymph's Dream)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "nymph-stacks",
        value: 25,
        computeSnippet: `(ctx) => {
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["nymph-stacks"] ?? 3)));
        const pct = s >= 3 ? 25 : s === 2 ? 16 : s === 1 ? 7 : 0;
        return (pct / 100) * ctx.baseAtk;
      }`,
      },
      {
        id: "nymph-4pc-hydro",
        label: "4-Piece Stacking Hydro DMG% (Nymph's Dream)",
        stat: "hydroDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "nymph-stacks",
        value: 15,
        computeSnippet: `(ctx) => {
        const s = Math.min(3, Math.max(0, Number(ctx.inputs?.["nymph-stacks"] ?? 3)));
        return s >= 3 ? 15 : s === 2 ? 9 : s === 1 ? 4 : 0;
      }`,
      },
    ],
  },
  {
    id: "vourukashas-glow",
    name: "Vourukasha's Glow",
    rarity: 5,
    twoPieceDesc: "HP increased by 20%.",
    fourPieceDesc: "Elemental Skill and Elemental Burst DMG +10%. Taking DMG increases this bonus by 80% per stack (max 5 stacks, total +50% Skill/Burst DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "vourukasha-stacks",
        label: "Damage Taken Stacks (0–5)",
        control: "stacks",
        min: 0,
        max: 5,
        defaultValue: 5,
        hint: "Base +10% Skill/Burst DMG; each stack adds +8% (Max 5 stacks = +50% Skill/Burst DMG total)",
      },
    ],
    buffs: [
      {
        id: "vourukasha-2pc-hp",
        label: "2-Piece HP% (Vourukasha's Glow)",
        stat: "hp",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 20,
        computeSnippet: "(ctx) => (20 / 100) * ctx.baseAtk",
      },
      {
        id: "vourukasha-4pc-skill",
        label: "4-Piece Elemental Skill DMG% (Vourukasha's Glow)",
        stat: "skillDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "vourukasha-stacks",
        value: 50,
        computeSnippet: `(ctx) => {
        const s = Math.min(5, Math.max(0, Number(ctx.inputs?.["vourukasha-stacks"] ?? 5)));
        return 10 + s * 8;
      }`,
      },
      {
        id: "vourukasha-4pc-burst",
        label: "4-Piece Elemental Burst DMG% (Vourukasha's Glow)",
        stat: "burstDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "vourukasha-stacks",
        value: 50,
        computeSnippet: `(ctx) => {
        const s = Math.min(5, Math.max(0, Number(ctx.inputs?.["vourukasha-stacks"] ?? 5)));
        return 10 + s * 8;
      }`,
      },
    ],
  },

  // --- Batch 4: Fontaine & Natlan Sets ---
  {
    id: "marechaussee-hunter",
    name: "Marechaussee Hunter",
    rarity: 5,
    twoPieceDesc: "Normal and Charged Attack DMG +15%.",
    fourPieceDesc: "When current HP increases or decreases, CRIT Rate will be increased by 12% for 5s. Max 3 stacks (Total +36% CRIT Rate).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "marechaussee-stacks",
        label: "HP Change Stacks (12% CRIT / Stack)",
        control: "stacks",
        min: 0,
        max: 3,
        defaultValue: 3,
        hint: "Each stack increases CRIT Rate by 12% (Max 3 stacks = +36% CRIT Rate)",
      },
    ],
    buffs: [
      {
        id: "marechaussee-2pc-na",
        label: "2-Piece Normal Attack DMG% (Marechaussee Hunter)",
        stat: "normalDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "marechaussee-2pc-ca",
        label: "2-Piece Charged Attack DMG% (Marechaussee Hunter)",
        stat: "chargedDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 15,
        computeSnippet: "() => 15",
      },
      {
        id: "marechaussee-4pc-crit",
        label: "4-Piece CRIT Rate (Marechaussee Hunter)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "marechaussee-stacks",
        value: 36,
        computeSnippet: `(ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["marechaussee-stacks"] ?? 3)));
        return stacks * 12;
      }`,
      },
    ],
  },
  {
    id: "golden-troupe",
    name: "Golden Troupe",
    rarity: 5,
    twoPieceDesc: "Increases Elemental Skill DMG by 20%.",
    fourPieceDesc: "Increases Elemental Skill DMG by 25%. Additionally, when not on the field, Elemental Skill DMG will be further increased by 25% (Total +70% Skill DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "golden-troupe-off-field",
        label: "Character is Off-Field (+25% Extra Skill DMG)",
        control: "toggle",
        defaultValue: 0,
        hint: "Grants an additional +25% Elemental Skill DMG when off-field (Total +70% Skill DMG)",
      },
    ],
    buffs: [
      {
        id: "golden-troupe-2pc-skill",
        label: "2-Piece Elemental Skill DMG% (Golden Troupe)",
        stat: "skillDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "golden-troupe-4pc-skill",
        label: "4-Piece Elemental Skill DMG% (Golden Troupe)",
        stat: "skillDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "golden-troupe-off-field",
        value: 25,
        computeSnippet: `(ctx) => {
        const offField = (ctx.inputs?.["golden-troupe-off-field"] ?? "0") === "1" || Number(ctx.inputs?.["golden-troupe-off-field"] ?? 0) > 0;
        return 25 + (offField ? 25 : 0);
      }`,
      },
    ],
  },
  {
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
        computeSnippet: "() => 15",
      },
    ],
  },
  {
    id: "nighttime-whispers-in-the-echoing-woods",
    name: "Nighttime Whispers in the Echoing Woods",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc: "After using an Elemental Skill, gain a 20% Geo DMG Bonus for 10s. When under a shield granted by Crystallize or near Moondrifts, effect is increased by 150% (+50% Geo DMG total).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "nighttime-skill-used",
        label: "After Elemental Skill (+20% Geo DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Geo DMG Bonus by 20% for 10s",
      },
      {
        id: "nighttime-crystallize-shield",
        label: "Protected by Crystallize Shield / Moondrifts (+150% Effect)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases the Geo DMG Bonus by 150% (Total +50% Geo DMG)",
      },
    ],
    buffs: [
      {
        id: "nighttime-2pc-atk",
        label: "2-Piece ATK% (Nighttime Whispers)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "nighttime-4pc-geo",
        label: "4-Piece Geo DMG Bonus% (Nighttime Whispers)",
        stat: "geoDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 50,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["nighttime-skill-used"] ?? "1") === "1" || Number(ctx.inputs?.["nighttime-skill-used"] ?? 1) > 0;
        if (!on) return 0;
        const shield = (ctx.inputs?.["nighttime-crystallize-shield"] ?? "1") === "1" || Number(ctx.inputs?.["nighttime-crystallize-shield"] ?? 1) > 0;
        return shield ? 50 : 20;
      }`,
      },
    ],
  },
  {
    id: "fragment-of-harmonic-whimsy",
    name: "Fragment of Harmonic Whimsy",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc: "When the value of a Bond of Life increases or decreases, this character deals 18% increased DMG for 6s. Max 3 stacks (Total +54% DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "whimsy-bol-stacks",
        label: "Bond of Life Stacks (18% DMG / Stack)",
        control: "stacks",
        min: 0,
        max: 3,
        defaultValue: 3,
        hint: "Each stack grants +18% All DMG Bonus (Max 3 stacks = +54% All DMG)",
      },
    ],
    buffs: [
      {
        id: "whimsy-2pc-atk",
        label: "2-Piece ATK% (Fragment of Harmonic Whimsy)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "whimsy-4pc-dmg",
        label: "4-Piece Bond of Life DMG Bonus% (Fragment of Harmonic Whimsy)",
        stat: "dmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "whimsy-bol-stacks",
        value: 54,
        computeSnippet: `(ctx) => {
        const stacks = Math.min(3, Math.max(0, Number(ctx.inputs?.["whimsy-bol-stacks"] ?? 3)));
        return stacks * 18;
      }`,
      },
    ],
  },
  {
    id: "unfinished-reverie",
    name: "Unfinished Reverie",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc: "After leaving combat for 3s, DMG dealt increased by 50%. In combat, when a Burning opponent exists, gain 50% DMG Bonus.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "reverie-burning-active",
        label: "Burning Opponent Exists (+50% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases DMG dealt by 50% when a Burning opponent exists nearby",
      },
    ],
    buffs: [
      {
        id: "reverie-2pc-atk",
        label: "2-Piece ATK% (Unfinished Reverie)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "reverie-4pc-dmg",
        label: "4-Piece Burning DMG Bonus% (Unfinished Reverie)",
        stat: "dmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "reverie-burning-active",
        value: 50,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["reverie-burning-active"] ?? "1") === "1" || Number(ctx.inputs?.["reverie-burning-active"] ?? 1) > 0;
        return on ? 50 : 0;
      }`,
      },
    ],
  },
  {
    id: "scroll-of-the-hero-of-cinder-city",
    name: "Scroll of the Hero of Cinder City",
    rarity: 5,
    twoPieceDesc: "When a nearby party member triggers a Nightsoul Burst, the equipping character regenerates 6 Elemental Energy.",
    fourPieceDesc:
      "After triggering a reaction related to their Elemental Type, all nearby party members gain a 12% Elemental DMG Bonus for elements involved for 15s. If in Nightsoul's Blessing state, all nearby party members gain an additional 28% Elemental DMG Bonus (Total +40%). Does not stack.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "cinder-reaction-active",
        label: "Triggered Elemental Reaction",
        control: "toggle",
        defaultValue: 1,
        hint: "All nearby party members gain 12% Elemental DMG Bonus for elements involved",
      },
      {
        id: "cinder-nightsoul-active",
        label: "In Nightsoul's Blessing State (+28% Extra, Total +40%)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases party Elemental DMG Bonus by an additional 28% (Total +40%)",
      },
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
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["cinder-reaction-active"] ?? "1") === "1" || Number(ctx.inputs?.["cinder-reaction-active"] ?? 1) > 0;
        if (!on) return 0;
        const nightsoul = (ctx.inputs?.["cinder-nightsoul-active"] ?? "1") === "1" || Number(ctx.inputs?.["cinder-nightsoul-active"] ?? 1) > 0;
        return nightsoul ? 40 : 12;
      }`,
      },
    ],
  },
  {
    id: "obsidian-codex",
    name: "Obsidian Codex",
    rarity: 5,
    twoPieceDesc: "While the equipping character is in Nightsoul's Blessing and is on the field, their DMG dealt is increased by 15%.",
    fourPieceDesc: "After the equipping character consumes 1 Nightsoul point while on the field, CRIT Rate increases by 40% for 6s. This effect can trigger once every second.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "obsidian-on-field-nightsoul",
        label: "In Nightsoul's Blessing On-Field (+15% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases DMG dealt by 15% while in Nightsoul's Blessing on-field",
      },
      {
        id: "obsidian-consumed-point",
        label: "Consumed 1 Nightsoul Point (+40% CRIT Rate)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases CRIT Rate by 40% for 6s after consuming 1 Nightsoul point on-field",
      },
    ],
    buffs: [
      {
        id: "obsidian-2pc-dmg",
        label: "2-Piece Nightsoul DMG Bonus% (Obsidian Codex)",
        stat: "dmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        conditionKey: "obsidian-on-field-nightsoul",
        value: 15,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["obsidian-on-field-nightsoul"] ?? "1") === "1" || Number(ctx.inputs?.["obsidian-on-field-nightsoul"] ?? 1) > 0;
        return on ? 15 : 0;
      }`,
      },
      {
        id: "obsidian-4pc-crit",
        label: "4-Piece CRIT Rate (Obsidian Codex)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "obsidian-consumed-point",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["obsidian-consumed-point"] ?? "1") === "1" || Number(ctx.inputs?.["obsidian-consumed-point"] ?? 1) > 0;
        return on ? 40 : 0;
      }`,
      },
    ],
  },
  {
    id: "long-nights-oath",
    name: "Long Night's Oath",
    rarity: 5,
    twoPieceDesc: "Plunging Attack DMG increased by 20%.",
    fourPieceDesc: "After Plunging/Charged/Skill hits, gain Radiance Everlasting: Plunging Attacks deal 15% increased DMG for 6s. Max 5 stacks (+75% Plunging DMG).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "long-night-stacks",
        label: "Radiance Everlasting Stacks (15% Plunge / Stack)",
        control: "stacks",
        min: 0,
        max: 5,
        defaultValue: 5,
        hint: "Each stack increases Plunging Attack DMG by 15% (Max 5 stacks = +75% Plunge DMG)",
      },
    ],
    buffs: [
      {
        id: "long-night-2pc-plunge",
        label: "2-Piece Plunging Attack DMG% (Long Night's Oath)",
        stat: "plungeDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "long-night-4pc-plunge",
        label: "4-Piece Stacking Plunging DMG% (Long Night's Oath)",
        stat: "plungeDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "long-night-stacks",
        value: 75,
        computeSnippet: `(ctx) => {
        const s = Math.min(5, Math.max(0, Number(ctx.inputs?.["long-night-stacks"] ?? 5)));
        return s * 15;
      }`,
      },
    ],
  },
  {
    id: "finale-of-the-deep-galleries",
    name: "Finale of the Deep Galleries",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc: "When the equipping character has 0 Elemental Energy, Normal Attack DMG is increased by 60% and Elemental Burst DMG is increased by 60%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "zero-energy-active",
        label: "Has 0 Elemental Energy (+60% NA/Burst)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Normal Attack DMG by 60% and Elemental Burst DMG by 60% when at 0 Energy",
      },
    ],
    buffs: [
      {
        id: "deep-galleries-2pc-atk",
        label: "2-Piece ATK% (Finale of the Deep Galleries)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "deep-galleries-4pc-na",
        label: "4-Piece Normal Attack DMG% (Finale of the Deep Galleries)",
        stat: "normalDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "zero-energy-active",
        value: 60,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["zero-energy-active"] ?? "1") === "1" || Number(ctx.inputs?.["zero-energy-active"] ?? 1) > 0;
        return on ? 60 : 0;
      }`,
      },
      {
        id: "deep-galleries-4pc-burst",
        label: "4-Piece Elemental Burst DMG% (Finale of the Deep Galleries)",
        stat: "burstDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "zero-energy-active",
        value: 60,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["zero-energy-active"] ?? "1") === "1" || Number(ctx.inputs?.["zero-energy-active"] ?? 1) > 0;
        return on ? 60 : 0;
      }`,
      },
    ],
  },

  // --- Batch 5: Nod-Khadar & Moonsign / Special Sets ---
  {
    id: "night-of-the-skys-unveiling",
    name: "Night of the Sky's Unveiling",
    rarity: 5,
    twoPieceDesc: "Increases Lunar Reaction DMG by 20%.",
    fourPieceDesc:
      "When nearby party members trigger Lunar Reactions: on-field wielder gains Gleaming Moon: Intent (+15%/+30% CRIT Rate with Nascent/Ascendant Gleam). All party members' Lunar Reaction DMG +10% per Gleaming Moon effect.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "sky-moonsign-level",
        label: "Moonsign Level (Nascent vs Ascendant Gleam)",
        control: "toggle",
        defaultValue: 1,
        hint: "Toggle ON for Ascendant Gleam (+30% CRIT Rate), OFF for Nascent Gleam (+15% CRIT Rate)",
      },
    ],
    buffs: [
      {
        id: "night-sky-2pc-lunar-charged",
        label: "2-Piece Lunar-Charged DMG% (Night of the Sky)",
        stat: "lunarChargedDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "night-sky-2pc-lunar-bloom",
        label: "2-Piece Lunar-Bloom DMG% (Night of the Sky)",
        stat: "lunarBloomDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "night-sky-2pc-lunar-cryst",
        label: "2-Piece Lunar-Crystallize DMG% (Night of the Sky)",
        stat: "lunarCrystallizeDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "night-sky-4pc-crit",
        label: "4-Piece Gleaming Moon CRIT Rate (Night of the Sky)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        value: 30,
        computeSnippet: `(ctx) => {
        const isAscendant = (ctx.inputs?.["sky-moonsign-level"] ?? "1") === "1" || Number(ctx.inputs?.["sky-moonsign-level"] ?? 1) > 0;
        return isAscendant ? 30 : 15;
      }`,
      },
      {
        id: "night-sky-4pc-party-lunar",
        label: "4-Piece Party Lunar Reaction DMG% (Night of the Sky)",
        stat: "lunarChargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: true,
        value: 10,
        computeSnippet: "() => 10",
      },
    ],
  },
  {
    id: "silken-moons-serenade",
    name: "Silken Moon's Serenade",
    rarity: 5,
    twoPieceDesc: "Energy Recharge +20%.",
    fourPieceDesc:
      "When dealing Elemental DMG, gain Gleaming Moon: Devotion: Increases all party members' Elemental Mastery by 60/120 when Moonsign is Nascent/Ascendant Gleam (Triggerable off-field). All party members' Lunar Reaction DMG +10%.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "silken-moonsign-level",
        label: "Moonsign Level (Nascent vs Ascendant Gleam)",
        control: "toggle",
        defaultValue: 1,
        hint: "Toggle ON for Ascendant Gleam (+120 Party EM), OFF for Nascent Gleam (+60 Party EM)",
      },
    ],
    buffs: [
      {
        id: "silken-moon-2pc-er",
        label: "2-Piece Energy Recharge% (Silken Moon's Serenade)",
        stat: "energyRecharge",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "silken-moon-4pc-party-em",
        label: "4-Piece Party Elemental Mastery (Silken Moon's Serenade)",
        stat: "em",
        pieceRequirement: 4,
        isTeamBuff: true,
        value: 120,
        computeSnippet: `(ctx) => {
        const isAscendant = (ctx.inputs?.["silken-moonsign-level"] ?? "1") === "1" || Number(ctx.inputs?.["silken-moonsign-level"] ?? 1) > 0;
        return isAscendant ? 120 : 60;
      }`,
      },
      {
        id: "silken-moon-4pc-party-lunar",
        label: "4-Piece Party Lunar Reaction DMG% (Silken Moon's Serenade)",
        stat: "lunarChargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: true,
        value: 10,
        computeSnippet: "() => 10",
      },
    ],
  },
  {
    id: "aubade-of-morningstar-and-moon",
    name: "Aubade of Morningstar and Moon",
    rarity: 5,
    twoPieceDesc: "Increases Lunar Reaction DMG by 20%.",
    fourPieceDesc: "When the equipping character is off-field, Lunar Reaction DMG is increased by 20%. When party's Moonsign Level is at least Ascendant Gleam, further increased by 40% (Total +60%).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "aubade-ascendant-gleam",
        label: "Ascendant Gleam Moonsign (+40% Extra, Total +60%)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases Lunar Reaction DMG by an additional 40% (Total +60%) when Moonsign is Ascendant Gleam",
      },
    ],
    buffs: [
      {
        id: "aubade-2pc-lunar-charged",
        label: "2-Piece Lunar-Charged DMG% (Aubade of Morningstar)",
        stat: "lunarChargedDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "aubade-4pc-lunar-charged",
        label: "4-Piece Lunar Reaction DMG% (Aubade of Morningstar)",
        stat: "lunarChargedDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "aubade-ascendant-gleam",
        value: 60,
        computeSnippet: `(ctx) => {
        const isAscendant = (ctx.inputs?.["aubade-ascendant-gleam"] ?? "1") === "1" || Number(ctx.inputs?.["aubade-ascendant-gleam"] ?? 1) > 0;
        return isAscendant ? 60 : 20;
      }`,
      },
    ],
  },
  {
    id: "a-day-carved-from-rising-winds",
    name: "A Day Carved From Rising Winds",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc:
      "After NA/CA/Skill/Burst hits, gain Blessing of Pastoral Winds: ATK +25%. If equipping character has completed Witch's Homework, upgraded to Resolve of Pastoral Winds (+20% CRIT Rate extra).",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "pastoral-winds-active",
        label: "Blessing of Pastoral Winds (+25% ATK)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases ATK by 25% for 6s after an attack hits an opponent",
      },
      {
        id: "witch-homework-active",
        label: "Completed Witch's Homework (+20% CRIT Rate)",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases CRIT Rate by 20% when character has Witch's Homework synergy",
      },
    ],
    buffs: [
      {
        id: "rising-winds-2pc-atk",
        label: "2-Piece ATK% (A Day Carved From Rising Winds)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "rising-winds-4pc-atk",
        label: "4-Piece Pastoral Winds ATK% (A Day Carved From Rising Winds)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "pastoral-winds-active",
        value: 25,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["pastoral-winds-active"] ?? "1") === "1" || Number(ctx.inputs?.["pastoral-winds-active"] ?? 1) > 0;
        return on ? (25 / 100) * ctx.baseAtk : 0;
      }`,
      },
      {
        id: "rising-winds-4pc-crit",
        label: "4-Piece Witch's Homework CRIT Rate (A Day Carved From Rising Winds)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "witch-homework-active",
        value: 20,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["pastoral-winds-active"] ?? "1") === "1" || Number(ctx.inputs?.["pastoral-winds-active"] ?? 1) > 0;
        if (!on) return 0;
        const homework = (ctx.inputs?.["witch-homework-active"] ?? "1") === "1" || Number(ctx.inputs?.["witch-homework-active"] ?? 1) > 0;
        return homework ? 20 : 0;
      }`,
      },
    ],
  },
  {
    id: "celestial-gift",
    name: "Celestial Gift",
    rarity: 5,
    twoPieceDesc: "Energy Recharge +20%.",
    fourPieceDesc:
      "If character has Witch's Homework, using Skill grants Light's Guidance: all party members gain +20% Elemental DMG of wielder's element for 20s. With Hexerei: Secret Rite, upgraded to Mortal Hymn (+40% Elemental DMG to wielder & active member elements).",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "celestial-skill-guidance",
        label: "Used Elemental Skill (Light's Guidance Active)",
        control: "toggle",
        defaultValue: 1,
        hint: "All nearby party members gain 20% Elemental DMG Bonus for 20s",
      },
      {
        id: "celestial-hexerei-active",
        label: "Hexerei: Secret Rite Active (Mortal Hymn +40% DMG)",
        control: "toggle",
        defaultValue: 1,
        hint: "Upgrades party Elemental DMG Bonus to 40% for both wielder and active party member elements",
      },
    ],
    buffs: [
      {
        id: "celestial-gift-2pc-er",
        label: "2-Piece Energy Recharge% (Celestial Gift)",
        stat: "energyRecharge",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 20,
        computeSnippet: "() => 20",
      },
      {
        id: "celestial-gift-4pc-party-dmg",
        label: "4-Piece Party Elemental DMG% (Celestial Gift)",
        stat: "dmgBonus",
        pieceRequirement: 4,
        isTeamBuff: true,
        conditionKey: "celestial-skill-guidance",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["celestial-skill-guidance"] ?? "1") === "1" || Number(ctx.inputs?.["celestial-skill-guidance"] ?? 1) > 0;
        if (!on) return 0;
        const hexerei = (ctx.inputs?.["celestial-hexerei-active"] ?? "1") === "1" || Number(ctx.inputs?.["celestial-hexerei-active"] ?? 1) > 0;
        return hexerei ? 40 : 20;
      }`,
      },
    ],
  },
  {
    id: "disenchantment-in-deep-shadow",
    name: "Disenchantment in Deep Shadow",
    rarity: 5,
    twoPieceDesc: "Physical DMG +25%.",
    fourPieceDesc:
      "Increases Superconduct Reaction DMG by 80% and Stellar-Conduct Reaction DMG by 40%. When the wielder attacks opponents affected by Superconduct or Stellar-Conduct, this attack's CRIT Rate is increased by 16%.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "disenchantment-reaction-active",
        label: "Opponent Affected by Superconduct / Stellar-Conduct",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases CRIT Rate by 16% when attacking opponents affected by Superconduct or Stellar-Conduct",
      },
    ],
    buffs: [
      {
        id: "disenchantment-2pc-phys",
        label: "2-Piece Physical DMG% (Disenchantment in Deep Shadow)",
        stat: "physicalDmgBonus",
        pieceRequirement: 2,
        isTeamBuff: false,
        value: 25,
        computeSnippet: "() => 25",
      },
      {
        id: "disenchantment-4pc-crit",
        label: "4-Piece Reaction CRIT Rate (Disenchantment in Deep Shadow)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "disenchantment-reaction-active",
        value: 16,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["disenchantment-reaction-active"] ?? "1") === "1" || Number(ctx.inputs?.["disenchantment-reaction-active"] ?? 1) > 0;
        return on ? 16 : 0;
      }`,
      },
    ],
  },
  {
    id: "scarlet-proof",
    name: "Scarlet Proof",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc:
      "Increases the equipping character's CRIT Rate by 16%, and their Stellar Swirl reaction dealt by 40%, for 10s after they trigger a Stellar Swirl reaction.",
    isSupport: false,
    buffType: "self",
    mechanicDefs: [
      {
        id: "trigger-stellar-swirl",
        label: "Triggered Stellar Swirl",
        control: "toggle",
        defaultValue: 1,
        hint: "Increases CRIT Rate by 16% and Stellar Swirl reaction DMG by 40% for 10s after triggering Stellar Swirl",
      },
    ],
    buffs: [
      {
        id: "scarlet-proof-2pc-atk",
        label: "2-Piece ATK% (Scarlet Proof)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "scarlet-proof-4pc-crit",
        label: "4-Piece CRIT Rate (Scarlet Proof)",
        stat: "critRate",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "trigger-stellar-swirl",
        value: 16,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-swirl"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-swirl"] ?? 1) > 0;
        return on ? 16 : 0;
      }`,
      },
      {
        id: "scarlet-proof-4pc-stellar-swirl",
        label: "4-Piece Stellar Swirl DMG% (Scarlet Proof)",
        stat: "stellarSwirlDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: false,
        conditionKey: "trigger-stellar-swirl",
        value: 40,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-swirl"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-swirl"] ?? 1) > 0;
        return on ? 40 : 0;
      }`,
      },
    ],
  },
  {
    id: "heart-of-the-furnace",
    name: "Heart of the Furnace",
    rarity: 5,
    twoPieceDesc: "ATK increased by 18%.",
    fourPieceDesc:
      "Increases the equipping character's ATK by 12% for 12s when they trigger a Stellar Glimmer reaction or deal Stellar Glimmer reaction DMG. Also increases Stellar Glimmer reaction DMG dealt by all nearby party members by 50%. The above effects can trigger even when the equipping character is not on the field, and the DMG bonus from multiple Artifact Sets with the same name do not stack.",
    isSupport: true,
    buffType: "both",
    mechanicDefs: [
      {
        id: "trigger-stellar-glimmer",
        label: "Triggered / Dealt Stellar Glimmer DMG",
        control: "toggle",
        defaultValue: 1,
        hint: "Equipping character gains +12% ATK; all nearby party members gain +50% Stellar Glimmer reaction DMG for 12s",
      },
    ],
    buffs: [
      {
        id: "furnace-2pc-atk",
        label: "2-Piece ATK% (Heart of the Furnace)",
        stat: "atk",
        pieceRequirement: 2,
        isTeamBuff: false,
        isPercent: true,
        value: 18,
        computeSnippet: "(ctx) => (18 / 100) * ctx.baseAtk",
      },
      {
        id: "furnace-4pc-wielder-atk",
        label: "4-Piece Wielder ATK% (Heart of the Furnace)",
        stat: "atk",
        pieceRequirement: 4,
        isTeamBuff: false,
        isPercent: true,
        conditionKey: "trigger-stellar-glimmer",
        value: 12,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-glimmer"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-glimmer"] ?? 1) > 0;
        return on ? (12 / 100) * ctx.baseAtk : 0;
      }`,
      },
      {
        id: "furnace-4pc-party-glimmer-dmg",
        label: "4-Piece Party Stellar Glimmer DMG% (Heart of the Furnace)",
        stat: "stellarGlimmerDmgBonus",
        pieceRequirement: 4,
        isTeamBuff: true,
        conditionKey: "trigger-stellar-glimmer",
        value: 50,
        computeSnippet: `(ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-glimmer"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-glimmer"] ?? 1) > 0;
        return on ? 50 : 0;
      }`,
      },
    ],
  },
];

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function generateArtifactFile(art: RawArtifact): string {
  const varName = toCamelCase(art.id);
  const mechanicDefsStr = art.mechanicDefs
    ? `  mechanicDefs: ${JSON.stringify(art.mechanicDefs, null, 4).replace(/\n/g, "\n  ")},\n`
    : "";

  const buffsStr = art.buffs
    .map((b) => {
      const computeLine = b.computeSnippet ? `      compute: ${b.computeSnippet},\n` : "";
      return `    {
      id: ${JSON.stringify(b.id)},
      label: ${JSON.stringify(b.label)},
      stat: ${JSON.stringify(b.stat)},
      pieceRequirement: ${b.pieceRequirement},
      isTeamBuff: ${b.isTeamBuff},${b.isPercent ? "\n      isPercent: true," : ""}${b.conditionKey ? `\n      conditionKey: ${JSON.stringify(b.conditionKey)},` : ""}${b.value !== undefined ? `\n      value: ${b.value},` : ""}
${computeLine}    }`;
    })
    .join(",\n");

  return `import type { ArtifactConfig } from "./types";

export const ${varName}: ArtifactConfig = {
  id: ${JSON.stringify(art.id)},
  name: ${JSON.stringify(art.name)},
  rarity: ${art.rarity},
  twoPieceDesc: ${JSON.stringify(art.twoPieceDesc)},
  fourPieceDesc: ${JSON.stringify(art.fourPieceDesc)},
  isSupport: ${art.isSupport},
  buffType: ${JSON.stringify(art.buffType)},
${mechanicDefsStr}  buffs: [
${buffsStr}
  ],
};
`;
}

function main() {
  const outDir = path.resolve(__dirname, "../src/data/registry/artifacts");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Generating ${ALL_ARTIFACTS.length} artifact files in ${outDir}...`);

  const exportsList: string[] = [];

  for (const art of ALL_ARTIFACTS) {
    const filePath = path.join(outDir, `${art.id}.ts`);
    const content = generateArtifactFile(art);
    fs.writeFileSync(filePath, content, "utf-8");
    const varName = toCamelCase(art.id);
    exportsList.push(`export { ${varName} } from "./${art.id}";`);
  }

  // Generate index.ts
  const importsList = ALL_ARTIFACTS.map((a) => `import { ${toCamelCase(a.id)} } from "./${a.id}";`).join("\n");
  const arrayItems = ALL_ARTIFACTS.map((a) => `  ${toCamelCase(a.id)},`).join("\n");

  const indexContent = `import type { ArtifactConfig } from "./types";
${importsList}

export * from "./types";
${exportsList.join("\n")}

export const ARTIFACTS: ArtifactConfig[] = [
${arrayItems}
];

const artifactMap = new Map<string, ArtifactConfig>();
for (const artifact of ARTIFACTS) {
  artifactMap.set(artifact.id, artifact);
}

export function artifactById(id: string): ArtifactConfig | undefined {
  return artifactMap.get(id);
}

export const supportArtifacts = ARTIFACTS.filter((a) => a.isSupport);
export const wielderArtifacts = ARTIFACTS.filter((a) => a.buffType === "self" || a.buffType === "both");
`;

  const indexPath = path.join(outDir, "index.ts");
  fs.writeFileSync(indexPath, indexContent, "utf-8");
  console.log(`Done! Aggregated index.ts generated with ${ALL_ARTIFACTS.length} artifacts.`);
}

main();

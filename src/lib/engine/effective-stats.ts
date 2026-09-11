import type { CharacterConfig, Element } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import { getTargetResForElement, type DamageStats } from "./damage";
import type { CalcInstance, StatBuffSource, StatBreakdown } from "@/components/calculator/types";
import { resolveMechanics } from "./mechanics";
import { effectiveTalentLevels, getRequiredConstellation } from "./validation";
import { activeEffects, constellationStatBonuses } from "./constellations";
import { resolveTeamBuffs } from "./team-buffs";
import { resolveExternalWeaponBuffs } from "./weapon-buffs";
import { resolveExternalArtifactBuffs } from "./artifact-buffs";
import { levelMultiplier } from "./level-multiplier";

const toNum = (val: string | number | undefined): number | undefined => {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "number") return isNaN(val) ? undefined : val;
  const s = String(val).trim();
  if (s === "") return undefined;
  const n = Number(s);
  return isNaN(n) ? undefined : n;
};

export interface EffectiveRowDef {
  key: keyof DamageStats | "lunarBaseBonus" | "stellarBaseBonus" | "stellarPanelBonus" | "transformativeBonus" | "vaporizeMult" | "meltMult" | "aggravateFlat" | "spreadFlat";
  label: string;
  category: "attributes" | "categoryDmg" | "elementalDmg" | "reactionElevation" | "reactionDmg" | "reactionCrit" | "elementalCrit" | "talentCrit" | "debuffs" | "selfRes" | "staminaAndMisc" | "multipliers";
  unit: "flat" | "percent" | "multiplier";
  hideIfZero?: boolean;
}

export const EFFECTIVE_ROW_DEFINITIONS: EffectiveRowDef[] = [
  // 1. Core Attributes
  { key: "atk", label: "ATK", category: "attributes", unit: "flat" },
  { key: "hp", label: "Max HP", category: "attributes", unit: "flat" },
  { key: "def", label: "DEF", category: "attributes", unit: "flat" },
  { key: "em", label: "Elemental Mastery", category: "attributes", unit: "flat" },
  { key: "critRate", label: "CRIT Rate", category: "attributes", unit: "percent" },
  { key: "critDmg", label: "CRIT DMG", category: "attributes", unit: "percent" },
  { key: "energyRecharge", label: "Energy Recharge", category: "attributes", unit: "percent" },
  { key: "healingBonus", label: "Healing Bonus", category: "attributes", unit: "percent", hideIfZero: true },
  { key: "baseAtk", label: "Base ATK", category: "attributes", unit: "flat", hideIfZero: true },
  { key: "baseHp", label: "Base HP", category: "attributes", unit: "flat", hideIfZero: true },
  { key: "baseDef", label: "Base DEF", category: "attributes", unit: "flat", hideIfZero: true },

  // 2. Attack Category & Elemental DMG Bonuses
  { key: "dmgBonus", label: "Common / All DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "commonDmgBonus", label: "Common DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "pyroDmgBonus", label: "Pyro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "hydroDmgBonus", label: "Hydro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "dendroDmgBonus", label: "Dendro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "electroDmgBonus", label: "Electro DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "anemoDmgBonus", label: "Anemo DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "cryoDmgBonus", label: "Cryo DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "geoDmgBonus", label: "Geo DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },
  { key: "physicalDmgBonus", label: "Physical DMG Bonus", category: "elementalDmg", unit: "percent", hideIfZero: true },

  // Elemental Damage Increases (Flat Additive)
  { key: "commonDmgIncrease", label: "Common DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "pyroDmgIncrease", label: "Pyro DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "hydroDmgIncrease", label: "Hydro DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "dendroDmgIncrease", label: "Dendro DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "electroDmgIncrease", label: "Electro DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "anemoDmgIncrease", label: "Anemo DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "cryoDmgIncrease", label: "Cryo DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "geoDmgIncrease", label: "Geo DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },
  { key: "physicalDmgIncrease", label: "Physical DMG Increase", category: "elementalDmg", unit: "flat", hideIfZero: true },

  // 3. Talent DMG Bonuses, Increases & Level Boosts
  { key: "normalDmgBonus", label: "Normal Att. DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "chargedDmgBonus", label: "Charged Att. DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "plungeDmgBonus", label: "Plunging Att. DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "plungingCollisionDmgBonus", label: "Plunging Collision DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "plungingImpactDmgBonus", label: "Plunging Impact DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "skillDmgBonus", label: "Ele. Skill DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "burstDmgBonus", label: "Ele. Burst DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "elementalAttDmgBonus", label: "Elemental Att. DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },
  { key: "normalAttEleDmgBonus", label: "Normal Att. Ele. DMG Bonus", category: "categoryDmg", unit: "percent", hideIfZero: true },

  { key: "normalDmgIncrease", label: "Normal Att. DMG Increase", category: "categoryDmg", unit: "flat", hideIfZero: true },
  { key: "chargedDmgIncrease", label: "Charged Att. DMG Increase", category: "categoryDmg", unit: "flat", hideIfZero: true },
  { key: "plungingCollisionDmgIncrease", label: "Plunging Collision DMG Increase", category: "categoryDmg", unit: "flat", hideIfZero: true },
  { key: "plungingImpactDmgIncrease", label: "Plunging Impact DMG Increase", category: "categoryDmg", unit: "flat", hideIfZero: true },
  { key: "skillDmgIncrease", label: "Ele. Skill DMG Increase", category: "categoryDmg", unit: "flat", hideIfZero: true },
  { key: "burstDmgIncrease", label: "Ele. Burst DMG Increase", category: "categoryDmg", unit: "flat", hideIfZero: true },

  { key: "normalLevelBoost", label: "Normal Attack Level Boost", category: "categoryDmg", unit: "flat", hideIfZero: true },
  { key: "skillLevelBoost", label: "Ele. Skill Level Boost", category: "categoryDmg", unit: "flat", hideIfZero: true },
  { key: "burstLevelBoost", label: "Ele. Burst Level Boost", category: "categoryDmg", unit: "flat", hideIfZero: true },

  // 4. Elemental CRIT Bonuses
  { key: "pyroCritRate", label: "Pyro CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "pyroCritDmg", label: "Pyro CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "hydroCritRate", label: "Hydro CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "hydroCritDmg", label: "Hydro CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "electroCritRate", label: "Electro CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "electroCritDmg", label: "Electro CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "cryoCritRate", label: "Cryo CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "cryoCritDmg", label: "Cryo CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "anemoCritRate", label: "Anemo CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "anemoCritDmg", label: "Anemo CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "geoCritRate", label: "Geo CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "geoCritDmg", label: "Geo CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "dendroCritRate", label: "Dendro CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "dendroCritDmg", label: "Dendro CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "physicalCritRate", label: "Physical CRIT Rate Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },
  { key: "physicalCritDmg", label: "Physical CRIT DMG Bonus", category: "elementalCrit", unit: "percent", hideIfZero: true },

  // 5. Talent CRIT Bonuses
  { key: "normalCritRate", label: "Normal Att. CRIT Rate Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "normalCritDmg", label: "Normal Att. CRIT DMG Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "chargedCritRate", label: "Charged Att. CRIT Rate Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "chargedCritDmg", label: "Charged Att. CRIT DMG Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "plungingCollisionCritRate", label: "Plunging Collision CRIT Rate", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "plungingCollisionCritDmg", label: "Plunging Collision CRIT DMG", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "plungingImpactCritRate", label: "Plunging Impact CRIT Rate", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "plungingImpactCritDmg", label: "Plunging Impact CRIT DMG", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "plungingCritRate", label: "Plunging Att. CRIT Rate", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "plungingCritDmg", label: "Plunging Att. CRIT DMG", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "skillCritRate", label: "Ele. Skill CRIT Rate Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "skillCritDmg", label: "Ele. Skill CRIT DMG Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "burstCritRate", label: "Ele. Burst CRIT Rate Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "burstCritDmg", label: "Ele. Burst CRIT DMG Bonus", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "elementalAttCritRate", label: "Elemental Att. CRIT Rate", category: "talentCrit", unit: "percent", hideIfZero: true },
  { key: "elementalAttCritDmg", label: "Elemental Att. CRIT DMG", category: "talentCrit", unit: "percent", hideIfZero: true },

  // 6. Reaction DMG Bonuses & Multipliers
  { key: "overloadedDmgBonus", label: "Overloaded DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "shatteredDmgBonus", label: "Shattered DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "electroChargedDmgBonus", label: "Electro-Charged DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "superconductDmgBonus", label: "Superconduct DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "swirlDmgBonus", label: "Swirl DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "burningDmgBonus", label: "Burning DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "bloomDmgBonus", label: "Bloom DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "burgeonDmgBonus", label: "Burgeon DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "hyperbloomDmgBonus", label: "Hyperbloom DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "vaporizeDmgBonus", label: "Vaporize DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "meltDmgBonus", label: "Melt DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "spreadDmgBonus", label: "Spread DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "aggravateDmgBonus", label: "Aggravate DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },

  // Lunar Reactions
  { key: "lunarChargedDmgBonus", label: "Lunar-Charged DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarBloomDmgBonus", label: "Lunar-Bloom DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeDmgBonus", label: "Lunar-Crystallize DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarReactionDmgBonus", label: "Lunar Reaction DMG Bonus (Superset)", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "lunarChargedBaseDmgMultiplier", label: "Lunar-Charged Base DMG Multiplier", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarBloomBaseDmgMultiplier", label: "Lunar-Bloom Base DMG Multiplier", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeBaseDmgMultiplier", label: "Lunar-Crystallize Base DMG Multiplier", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarReactionBaseDmgMultiplier", label: "Lunar Reaction Base DMG Multiplier (Superset)", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "lunarChargedSpecialDmgBonus", label: "Lunar-Charged Special DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarBloomSpecialDmgBonus", label: "Lunar-Bloom Special DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeSpecialDmgBonus", label: "Lunar-Crystallize Special DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarReactionSpecialDmgBonus", label: "Lunar Reaction Special DMG Bonus (Superset)", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "lunarChargedElevation", label: "Lunar-Charged Elevation DMG", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarBloomElevation", label: "Lunar-Bloom Elevation DMG", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeElevation", label: "Lunar-Crystallize Elevation DMG", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "lunarChargedFlatDmg", label: "Lunar-Charged Flat DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarBloomFlatDmg", label: "Lunar-Bloom Flat DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarCrystallizeFlatDmg", label: "Lunar-Crystallize Flat DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarChargedReactionDmgIncrease", label: "Lunar-Charged Reaction DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarChargedDirectDmgIncrease", label: "Lunar-Charged Direct DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarBloomReactionDmgIncrease", label: "Lunar-Bloom Reaction DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarBloomDirectDmgIncrease", label: "Lunar-Bloom Direct DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarCrystallizeReactionDmgIncrease", label: "Lunar-Crystallize Reaction DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarCrystallizeDirectDmgIncrease", label: "Lunar-Crystallize Direct DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarReactionDmgIncrease", label: "Lunar Reaction DMG Increase (Superset)", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "lunarBaseBonus", label: "Lunar Reaction Base DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },

  // Stellar Glimmer Reactions
  { key: "stellarConductDmgBonus", label: "Stellar-Conduct DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarSwirlDmgBonus", label: "Stellar Swirl DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarGlimmerDmgBonus", label: "Stellar Glimmer DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarReactionDmgBonus", label: "Stellar Reaction DMG Bonus (Superset)", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "stellarConductBaseDmgMultiplier", label: "Stellar-Conduct Base DMG Multiplier", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarSwirlBaseDmgMultiplier", label: "Stellar Swirl Base DMG Multiplier", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarReactionBaseDmgMultiplier", label: "Stellar Reaction Base DMG Multiplier (Superset)", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "stellarConductSpecialDmgBonus", label: "Stellar-Conduct Special DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarSwirlSpecialDmgBonus", label: "Stellar Swirl Special DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarReactionSpecialDmgBonus", label: "Stellar Reaction Special DMG Bonus (Superset)", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "stellarConductMultiplier", label: "Stellar-Conduct Multiplier (BRC)", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarSwirlMultiplier", label: "Stellar Swirl Multiplier (BRC)", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarReactionMultiplier", label: "Stellar Reaction Multiplier (Superset BRC)", category: "reactionDmg", unit: "percent", hideIfZero: true },
  { key: "stellarPanelBonus", label: "Stellar Glimmer Reaction DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },

  { key: "stellarConductReactionDmgIncrease", label: "Stellar-Conduct Reaction DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "stellarConductDirectDmgIncrease", label: "Stellar-Conduct Direct DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "stellarSwirlReactionDmgIncrease", label: "Stellar Swirl Reaction DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "stellarSwirlDirectDmgIncrease", label: "Stellar Swirl Direct DMG Increase", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "stellarReactionDmgIncrease", label: "Stellar Reaction DMG Increase (Superset)", category: "reactionDmg", unit: "flat", hideIfZero: true },
  { key: "stellarBaseBonus", label: "Stellar Reaction Base DMG Bonus", category: "reactionDmg", unit: "percent", hideIfZero: true },

  // 7. Reaction CRIT Bonuses
  { key: "lunarChargedCritRate", label: "Lunar-Charged CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "lunarChargedCritDmg", label: "Lunar-Charged CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "burningCritRate", label: "Burning CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "burningCritDmg", label: "Burning CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "superconductCritRate", label: "Superconduct CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "superconductCritDmg", label: "Superconduct CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "bloomCritRate", label: "Bloom CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "bloomCritDmg", label: "Bloom CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "burgeonCritRate", label: "Burgeon CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "burgeonCritDmg", label: "Burgeon CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "hyperbloomCritRate", label: "Hyperbloom CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "hyperbloomCritDmg", label: "Hyperbloom CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "lunarBloomCritRate", label: "Lunar-Bloom CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "lunarBloomCritDmg", label: "Lunar-Bloom CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "swirlCritRate", label: "Swirl CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "swirlCritDmg", label: "Swirl CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeCritRate", label: "Lunar-Crystallize CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "lunarCrystallizeCritDmg", label: "Lunar-Crystallize CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "stellarConductCritRate", label: "Stellar-Conduct CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "stellarConductCritDmg", label: "Stellar-Conduct CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "stellarSwirlCritRate", label: "Stellar Swirl CRIT Rate", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "stellarSwirlCritDmg", label: "Stellar Swirl CRIT DMG", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "lunarReactionCritRate", label: "Lunar Reaction CRIT Rate (Superset)", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "lunarReactionCritDmg", label: "Lunar Reaction CRIT DMG (Superset)", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "stellarReactionCritRate", label: "Stellar Reaction CRIT Rate (Superset)", category: "reactionCrit", unit: "percent", hideIfZero: true },
  { key: "stellarReactionCritDmg", label: "Stellar Reaction CRIT DMG (Superset)", category: "reactionCrit", unit: "percent", hideIfZero: true },

  // 8. Enemy Debuffs
  { key: "enemyPhysicalRes", label: "Enemy Physical DMG RES", category: "debuffs", unit: "percent" },
  { key: "enemyPyroRes", label: "Enemy Pyro DMG RES", category: "debuffs", unit: "percent" },
  { key: "enemyHydroRes", label: "Enemy Hydro DMG RES", category: "debuffs", unit: "percent" },
  { key: "enemyDendroRes", label: "Enemy Dendro DMG RES", category: "debuffs", unit: "percent" },
  { key: "enemyElectroRes", label: "Enemy Electro DMG RES", category: "debuffs", unit: "percent" },
  { key: "enemyAnemoRes", label: "Enemy Anemo DMG RES", category: "debuffs", unit: "percent" },
  { key: "enemyCryoRes", label: "Enemy Cryo DMG RES", category: "debuffs", unit: "percent" },
  { key: "enemyGeoRes", label: "Enemy Geo DMG RES", category: "debuffs", unit: "percent" },
  { key: "defReduction", label: "DEF Reduction", category: "debuffs", unit: "percent", hideIfZero: true },
  { key: "defIgnore", label: "DEF Ignore", category: "debuffs", unit: "percent", hideIfZero: true },

  // 9. Self Resistances
  { key: "selfPhysicalRes", label: "Physical DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },
  { key: "selfAnemoRes", label: "Anemo DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },
  { key: "selfGeoRes", label: "Geo DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },
  { key: "selfElectroRes", label: "Electro DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },
  { key: "selfHydroRes", label: "Hydro DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },
  { key: "selfPyroRes", label: "Pyro DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },
  { key: "selfCryoRes", label: "Cryo DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },
  { key: "selfDendroRes", label: "Dendro DMG RES", category: "selfRes", unit: "percent", hideIfZero: true },

  // 10. Stamina & Misc Stats
  { key: "stamina", label: "Stamina", category: "staminaAndMisc", unit: "flat", hideIfZero: true },
  { key: "staminaDec", label: "Stamina Consumption Dec.", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "sprintingStaminaDec", label: "Sprinting Stamina Dec.", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "glidingStaminaDec", label: "Gliding Stamina Dec.", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "chargedAttackStaminaDec", label: "Charged Attack Stamina Dec.", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "incomingHealingBonus", label: "Incoming Healing Bonus", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "shieldStrength", label: "Shield Strength", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "cdReduction", label: "CD Reduction", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "movementSpd", label: "Movement SPD", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "atkSpd", label: "ATK SPD", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "weakspotDmg", label: "Weakspot DMG", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "dmgReduction", label: "DMG Reduction / -(DMG Bonus)", category: "staminaAndMisc", unit: "percent", hideIfZero: true },
  { key: "healIncrease", label: "Heal Increase", category: "staminaAndMisc", unit: "flat", hideIfZero: true },
  { key: "levelChar", label: "Character Level", category: "staminaAndMisc", unit: "flat" },
  { key: "levelEnemy", label: "Enemy Level", category: "staminaAndMisc", unit: "flat" },

  // 11. Multipliers & Reaction Math
  { key: "transformativeBonus", label: "Transformative Reaction Bonus", category: "multipliers", unit: "percent", hideIfZero: false },
  { key: "vaporizeMult", label: "Vaporize Multiplier", category: "multipliers", unit: "multiplier", hideIfZero: true },
  { key: "meltMult", label: "Melt Multiplier", category: "multipliers", unit: "multiplier", hideIfZero: true },
  { key: "aggravateFlat", label: "Aggravate Flat DMG Bonus", category: "multipliers", unit: "flat", hideIfZero: true },
  { key: "spreadFlat", label: "Spread Flat DMG Bonus", category: "multipliers", unit: "flat", hideIfZero: true },
];

export function resolveAllEffectiveStats(
  config: CharacterConfig,
  scaling: TalentScalingData,
  inst: CalcInstance,
  inputStats: DamageStats,
  effectiveStats: DamageStats
): StatBreakdown[] {
  const breakdowns: StatBreakdown[] = [];

  // Parse mechanics inputs
  const parsedInputs: Record<string, number> = {};
  if (inst.mechanicInputs) {
    for (const [k, v] of Object.entries(inst.mechanicInputs)) {
      parsedInputs[k] = Number(v) || 0;
    }
  }
  for (const m of config.mechanicDefs ?? []) {
    const requiredCon = getRequiredConstellation(m);
    if (requiredCon > 0 && inst.constellationLevel < requiredCon) {
      parsedInputs[m.id] = 0;
    }
  }

  const mechResult = resolveMechanics(config, {
    stats: inputStats,
    baseAtk: toNum(inst.stats["atk.base"]) ?? 800,
    baseDef: toNum(inst.stats["def.base"]) ?? 500,
    baseHp: toNum(inst.stats["hp.base"]) ?? 15000,
    constellationLevel: inst.constellationLevel,
    talentLevels: effectiveTalentLevels(config, scaling, inst.levels, inst.constellationLevel, inst.mechanicInputs),
    scaling,
    inputs: parsedInputs,
  });

  const effects = activeEffects(config, inst.constellationLevel);
  const constellationStats = constellationStatBonuses(effects);

  // Resolve external buffs
  const baseAtk = toNum(inst.stats["atk.base"]) ?? 0;
  const baseDef = toNum(inst.stats["def.base"]) ?? 0;
  const baseHp = toNum(inst.stats["hp.base"]) ?? 0;

  const teamRes = inst.teamBuffsEnabled !== false && inst.teamSupports?.length
    ? resolveTeamBuffs(inst.teamSupports, true, config, baseAtk, baseDef, baseHp)
    : { statDeltas: {}, lunarBaseBonusPct: 0, stellarBaseBonusPct: 0, sources: [], teamCrit: { critRate: 0, critDmg: 0 }, equippedArtifactIds: [], equippedWeaponIds: [] };

  const weaponRes = inst.externalWeaponBuffsEnabled !== false && inst.externalWeapons?.length
    ? resolveExternalWeaponBuffs(inst.externalWeapons, baseAtk, config, true, teamRes.equippedWeaponIds)
    : { statDeltas: {}, sources: [] };

  const artifactRes = inst.externalArtifactBuffsEnabled !== false && inst.externalArtifacts?.length
    ? resolveExternalArtifactBuffs(
        inst.externalArtifacts,
        baseAtk,
        config,
        true,
        baseDef,
        baseHp,
        teamRes.equippedArtifactIds,
      )
    : { statDeltas: {}, sources: [] };

  // Multiplier math parameters
  const reactionBonusPct = toNum(inst.reactionPanelBonus) ?? 0;
  const emTransformative = (16 * effectiveStats.em) / (effectiveStats.em + 2000) * 100;
  const totalTransformativeBonus = emTransformative + reactionBonusPct;

  const instReactionBonusPct = Number(inst.reactionBonus || 0);
  const emAmplifyingBonus = (2.78 * effectiveStats.em) / (effectiveStats.em + 1400);
  const getAmpMult = (base: number) => base * (1 + emAmplifyingBonus + instReactionBonusPct / 100);

  const emCatalyzeBonus = (5 * effectiveStats.em) / (effectiveStats.em + 1200);
  const aggravateFlatVal = 1.15 * levelMultiplier(effectiveStats.levelChar) * (1 + emCatalyzeBonus + instReactionBonusPct / 100);
  const spreadFlatVal = 1.25 * levelMultiplier(effectiveStats.levelChar) * (1 + emCatalyzeBonus + instReactionBonusPct / 100);

  const rawLunarBase = toNum(inst.lunarBaseBonus) ?? 0;
  const teamLunarBase = teamRes.lunarBaseBonusPct ?? 0;
  const mechLunarBase = mechResult.lunarBaseBonusPct ?? 0;
  const totalLunarBase = rawLunarBase + teamLunarBase + mechLunarBase;

  const rawStellarBase = toNum(inst.stellarBaseBonus) ?? 0;
  const teamStellarBase = teamRes.stellarBaseBonusPct ?? 0;
  const totalStellarBase = rawStellarBase + teamStellarBase;
  const rawStellarPanel = toNum(inst.stellarPanelBonus) ?? 0;

  // Process each definition
  for (const row of EFFECTIVE_ROW_DEFINITIONS) {
    // Special handled rows
    if (row.key === "transformativeBonus") {
      const additions: StatBuffSource[] = [];
      if (reactionBonusPct > 0) {
        additions.push({
          source: "Panel Reaction Bonus",
          value: reactionBonusPct,
          description: "Direct reaction bonus input from panel",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: emTransformative,
        additions,
        total: totalTransformativeBonus,
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "stellarPanelBonus") {
      const additions: StatBuffSource[] = [];
      const hasValue = rawStellarPanel > 0.01;
      if (row.hideIfZero && !hasValue) continue;

      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawStellarPanel,
        additions,
        total: rawStellarPanel,
        hideIfZero: row.hideIfZero,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "lunarBaseBonus") {
      const additions: StatBuffSource[] = [];
      if (mechLunarBase > 0) {
        additions.push({
          source: `${config.name} (Moonsign Benediction)`,
          value: mechLunarBase,
          description: "Character passive lunar base scaling",
          type: "mechanic",
          category: "character",
        });
      }
      if (teamLunarBase > 0) {
        additions.push({
          source: "Team Moonsign Buff",
          value: teamLunarBase,
          description: "Teammate Moonsign Benediction base DMG bonus",
          type: "external",
          category: "team",
          rarity: 5,
        });
      }
      const hasValue = totalLunarBase > 0.01;
      if (row.hideIfZero && !hasValue) continue;

      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawLunarBase,
        additions,
        total: totalLunarBase,
        hideIfZero: row.hideIfZero,
        hasExternalBuffs: additions.some(a => a.type === "external"),
      });
      continue;
    }

    if (row.key === "stellarBaseBonus") {
      const additions: StatBuffSource[] = [];
      if (teamStellarBase > 0) {
        additions.push({
          source: "Team Stellar Buff",
          value: teamStellarBase,
          description: "Teammate Stellar reaction base DMG bonus",
          type: "external",
          category: "team",
          rarity: 5,
        });
      }
      const hasValue = totalStellarBase > 0.01;
      if (row.hideIfZero && !hasValue) continue;

      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawStellarBase,
        additions,
        total: totalStellarBase,
        hideIfZero: row.hideIfZero,
        hasExternalBuffs: additions.some(a => a.type === "external"),
      });
      continue;
    }

    if (row.key === "vaporizeMult") {
      const showVape = ["Pyro", "Hydro"].includes(config.element);
      if (!showVape) continue;
      const baseAmp = config.element === "Pyro" ? 1.5 : 2.0;
      const additions: StatBuffSource[] = [];
      if (emAmplifyingBonus > 0) {
        additions.push({
          source: "EM Amplifying Bonus",
          value: baseAmp * emAmplifyingBonus,
          description: "Amplifying EM bonus multiplier",
          type: "mechanic",
          category: "character",
        });
      }
      if (instReactionBonusPct > 0) {
        additions.push({
          source: "Reaction Bonus%",
          value: baseAmp * (instReactionBonusPct / 100),
          description: "Reaction bonus modifier input",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: `${row.label} (${baseAmp.toFixed(1)}x Base)`,
        category: row.category,
        unit: row.unit,
        raw: baseAmp,
        additions,
        total: getAmpMult(baseAmp),
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "meltMult") {
      const showMelt = ["Pyro", "Cryo"].includes(config.element);
      if (!showMelt) continue;
      const baseAmp = config.element === "Pyro" ? 2.0 : 1.5;
      const additions: StatBuffSource[] = [];
      if (emAmplifyingBonus > 0) {
        additions.push({
          source: "EM Amplifying Bonus",
          value: baseAmp * emAmplifyingBonus,
          description: "Amplifying EM bonus multiplier",
          type: "mechanic",
          category: "character",
        });
      }
      if (instReactionBonusPct > 0) {
        additions.push({
          source: "Reaction Bonus%",
          value: baseAmp * (instReactionBonusPct / 100),
          description: "Reaction bonus modifier input",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: `${row.label} (${baseAmp.toFixed(1)}x Base)`,
        category: row.category,
        unit: row.unit,
        raw: baseAmp,
        additions,
        total: getAmpMult(baseAmp),
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "aggravateFlat") {
      if (config.element !== "Electro") continue;
      const rawBase = 1.15 * levelMultiplier(effectiveStats.levelChar);
      const additions: StatBuffSource[] = [];
      if (emCatalyzeBonus > 0 || instReactionBonusPct > 0) {
        additions.push({
          source: "EM Catalyze & Reaction Bonus",
          value: aggravateFlatVal - rawBase,
          description: "Level base scaling * (1 + EM bonus% + panel reaction bonus%)",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawBase,
        additions,
        total: aggravateFlatVal,
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    if (row.key === "spreadFlat") {
      if (config.element !== "Dendro") continue;
      const rawBase = 1.25 * levelMultiplier(effectiveStats.levelChar);
      const additions: StatBuffSource[] = [];
      if (emCatalyzeBonus > 0 || instReactionBonusPct > 0) {
        additions.push({
          source: "EM Catalyze & Reaction Bonus",
          value: spreadFlatVal - rawBase,
          description: "Level base scaling * (1 + EM bonus% + panel reaction bonus%)",
          type: "mechanic",
          category: "character",
        });
      }
      breakdowns.push({
        key: row.key,
        label: row.label,
        category: row.category,
        unit: row.unit,
        raw: rawBase,
        additions,
        total: spreadFlatVal,
        hideIfZero: false,
        hasExternalBuffs: false,
      });
      continue;
    }

    // Standard DamageStats rows
    const statKey = row.key as keyof DamageStats;
    const isEnemyRes = [
      "enemyPhysicalRes", "enemyPyroRes", "enemyHydroRes", "enemyDendroRes",
      "enemyElectroRes", "enemyAnemoRes", "enemyCryoRes", "enemyGeoRes",
    ].includes(statKey as string);

    let raw: number;
    let total: number;

    if (isEnemyRes) {
      const elementMap: Record<string, Element | "Physical"> = {
        enemyPhysicalRes: "Physical",
        enemyPyroRes: "Pyro",
        enemyHydroRes: "Hydro",
        enemyDendroRes: "Dendro",
        enemyElectroRes: "Electro",
        enemyAnemoRes: "Anemo",
        enemyCryoRes: "Cryo",
        enemyGeoRes: "Geo",
      };
      const elem = elementMap[statKey as string];
      const baseVal = toNum(inputStats[statKey]);
      const globalBase = toNum(inputStats.enemyRes) ?? 10;
      raw = baseVal !== undefined ? baseVal : globalBase;
      total = getTargetResForElement(effectiveStats, elem);
    } else {
      raw = (inputStats[statKey] as number | undefined) ?? 0;
      total = (effectiveStats[statKey] as number | undefined) ?? 0;
    }
    const delta = total - raw;

    const additions: StatBuffSource[] = [];

    // 1. Character mechanics additions
    if (mechResult.statBuffSources?.[statKey]) {
      for (const mSrc of mechResult.statBuffSources[statKey]) {
        additions.push({
          source: mSrc.source,
          value: mSrc.value,
          description: mSrc.description,
          type: "mechanic",
          category: "character",
        });
      }
    }
    if (isEnemyRes && mechResult.statBuffSources?.["enemyRes"]) {
      for (const mSrc of mechResult.statBuffSources["enemyRes"]) {
        additions.push({
          source: mSrc.source,
          value: mSrc.value,
          description: mSrc.description,
          type: "mechanic",
          category: "character",
        });
      }
    }

    // 2. Constellation stat additions
    if (config.constellations) {
      for (const c of config.constellations) {
        if (c.level <= inst.constellationLevel) {
          for (const e of c.effects) {
            if (e.type === "stat_bonus" && (e.statKey === statKey || (isEnemyRes && e.statKey === "enemyRes")) && e.statValue) {
              additions.push({
                source: `C${c.level} (${c.name})`,
                value: e.statValue,
                description: c.description || `Grants +${e.statValue} ${row.label}`,
                type: "constellation",
                category: "character",
              });
            }
          }
        }
      }
    }

    // 3. Team Support Buffs (External)
    for (const src of teamRes.sources) {
      if (src.stat === statKey || (isEnemyRes && src.stat === "enemyRes")) {
        additions.push({
          source: `${src.supportName} (Team)`,
          value: src.value,
          description: src.label,
          type: "external",
          category: "team",
          rarity: src.rarity ?? 5,
        });
      }
    }

    // 4. External Weapon Buffs (External)
    for (const src of weaponRes.sources) {
      if (src.stat === statKey || (isEnemyRes && src.stat === "enemyRes")) {
        additions.push({
          source: `${src.weaponName} (Weapon)`,
          value: src.value,
          description: src.label,
          type: "external",
          category: "weapon",
          rarity: src.rarity ?? 5,
        });
      }
    }

    // 5. External Artifact Buffs (External)
    for (const src of artifactRes.sources) {
      if (src.stat === statKey || (isEnemyRes && src.stat === "enemyRes")) {
        additions.push({
          source: `${src.artifactName} (Artifact)`,
          value: src.value,
          description: src.label,
          type: "external",
          category: "artifact",
          rarity: src.rarity ?? 5,
        });
      }
    }

    // 6. Generic unrecorded delta fallback
    const recordedSum = additions.reduce((acc, curr) => acc + curr.value, 0);
    const unrecordedDelta = delta - recordedSum;
    if (Math.abs(unrecordedDelta) > 0.05) {
      additions.push({
        source: isEnemyRes ? "RES Debuff / Mechanics" : "Character Mechanics / Trait Buff",
        value: unrecordedDelta,
        description: isEnemyRes ? "Active enemy RES reduction effect" : "Special active mechanic or ascension passive modifier",
        type: "fallback",
        category: "character",
      });
    }

    // Hide if zero check
    if (row.hideIfZero && Math.abs(total) < 0.05 && additions.length === 0) {
      continue;
    }

    const hasExternalBuffs = additions.some(a => a.type === "external");

    breakdowns.push({
      key: String(row.key),
      label: row.label,
      category: row.category,
      unit: row.unit,
      raw,
      additions,
      total,
      hideIfZero: row.hideIfZero,
      hasExternalBuffs,
    });
  }

  return breakdowns;
}

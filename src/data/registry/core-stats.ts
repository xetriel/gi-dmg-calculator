import type { StatField } from "./types";

// Base stats (HP, ATK, DEF with base + percent + flat)
export const baseStats: StatField[] = [
  { key: "hp",  label: "HP",  unit: "flat", group: "base", hasBaseAndFlat: true },
  { key: "atk", label: "ATK", unit: "flat", group: "base", hasBaseAndFlat: true },
  { key: "def", label: "DEF", unit: "flat", group: "base", hasBaseAndFlat: true },
];

// Advanced baseline stats
export const advancedStats: StatField[] = [
  { key: "em",             label: "Elemental Mastery",  unit: "flat",    group: "advanced" },
  { key: "energyRecharge", label: "Energy Recharge%",   unit: "percent", group: "advanced" },
  { key: "healingBonus",   label: "Healing Bonus%",     unit: "percent", group: "advanced" },
];

// Standard combat stats
export const combatStats = (dmgBonusLabel: string): StatField[] => [
  { key: "critRate",        label: "CRIT Rate%",          unit: "percent", group: "combat" },
  { key: "critDmg",         label: "CRIT DMG%",           unit: "percent", group: "combat" },
  { key: "dmgBonus",        label: dmgBonusLabel || "All DMG Bonus%", unit: "percent", group: "combat" },
  { key: "commonDmgBonus",  label: "Common DMG Bonus%",   unit: "percent", group: "combat" },
  { key: "normalDmgBonus",  label: "Normal ATK DMG Bonus%", unit: "percent", group: "combat" },
  { key: "chargedDmgBonus", label: "Charged ATK DMG Bonus%", unit: "percent", group: "combat" },
  { key: "plungeDmgBonus",  label: "Plunging ATK DMG Bonus%", unit: "percent", group: "combat" },
  { key: "skillDmgBonus",   label: "Elemental Skill DMG Bonus%", unit: "percent", group: "combat" },
  { key: "burstDmgBonus",   label: "Elemental Burst DMG Bonus%", unit: "percent", group: "combat" },
  { key: "pyroDmgBonus",     label: "Pyro DMG Bonus%",     unit: "percent", group: "combat" },
  { key: "hydroDmgBonus",    label: "Hydro DMG Bonus%",    unit: "percent", group: "combat" },
  { key: "dendroDmgBonus",   label: "Dendro DMG Bonus%",   unit: "percent", group: "combat" },
  { key: "electroDmgBonus",  label: "Electro DMG Bonus%",  unit: "percent", group: "combat" },
  { key: "anemoDmgBonus",    label: "Anemo DMG Bonus%",    unit: "percent", group: "combat" },
  { key: "cryoDmgBonus",     label: "Cryo DMG Bonus%",     unit: "percent", group: "combat" },
  { key: "geoDmgBonus",      label: "Geo DMG Bonus%",      unit: "percent", group: "combat" },
  { key: "physicalDmgBonus", label: "Physical DMG Bonus%", unit: "percent", group: "combat" },
];

// Target baseline stats
export const defenseStats: StatField[] = [
  { key: "enemyRes",       label: "Enemy RES% (All Elements)",    unit: "percent", group: "defense" },
  { key: "levelChar",      label: "Level (Character)",            unit: "flat",    group: "defense" },
  { key: "levelEnemy",     label: "Level (Enemy)",                unit: "flat",    group: "defense" },
  { key: "defReduction",   label: "DEF Reduction%",               unit: "percent", group: "defense" },
  { key: "defIgnore",      label: "DEF Ignore%",                  unit: "percent", group: "defense" },
  { key: "dmgReduction",   label: "DMG Reduction / -(DMG Bonus)", unit: "percent", group: "defense" },
];

// Reaction bonuses & multipliers
export const reactionStats: StatField[] = [
  { key: "overloadedDmgBonus",     label: "Overloaded DMG Bonus%",     unit: "percent", group: "reactions" },
  { key: "shatteredDmgBonus",      label: "Shattered DMG Bonus%",      unit: "percent", group: "reactions" },
  { key: "electroChargedDmgBonus", label: "Electro-Charged DMG Bonus%", unit: "percent", group: "reactions" },
  { key: "superconductDmgBonus",   label: "Superconduct DMG Bonus%",   unit: "percent", group: "reactions" },
  { key: "swirlDmgBonus",          label: "Swirl DMG Bonus%",          unit: "percent", group: "reactions" },
  { key: "burningDmgBonus",        label: "Burning DMG Bonus%",        unit: "percent", group: "reactions" },
  { key: "bloomDmgBonus",          label: "Bloom DMG Bonus%",          unit: "percent", group: "reactions" },
  { key: "burgeonDmgBonus",        label: "Burgeon DMG Bonus%",        unit: "percent", group: "reactions" },
  { key: "hyperbloomDmgBonus",     label: "Hyperbloom DMG Bonus%",     unit: "percent", group: "reactions" },
  { key: "vaporizeDmgBonus",       label: "Vaporize DMG Bonus%",       unit: "percent", group: "reactions" },
  { key: "meltDmgBonus",           label: "Melt DMG Bonus%",           unit: "percent", group: "reactions" },
  { key: "spreadDmgBonus",         label: "Spread DMG Bonus%",         unit: "percent", group: "reactions" },
  { key: "aggravateDmgBonus",      label: "Aggravate DMG Bonus%",      unit: "percent", group: "reactions" },
  { key: "lunarReactionDmgBonus",  label: "Lunar Reaction DMG Bonus%", unit: "percent", group: "reactions" },
  { key: "stellarReactionDmgBonus",label: "Stellar Reaction DMG Bonus%",unit: "percent", group: "reactions" },
  { key: "lunarChargedBaseDmgMultiplier",     label: "Lunar-Charged Base DMG Multiplier%",     unit: "percent", group: "reactions" },
  { key: "lunarChargedSpecialDmgBonus",        label: "Lunar-Charged Special DMG Bonus%",        unit: "percent", group: "reactions" },
  { key: "lunarBloomBaseDmgMultiplier",       label: "Lunar-Bloom Base DMG Multiplier%",       unit: "percent", group: "reactions" },
  { key: "lunarBloomSpecialDmgBonus",          label: "Lunar-Bloom Special DMG Bonus%",          unit: "percent", group: "reactions" },
  { key: "lunarCrystallizeBaseDmgMultiplier", label: "Lunar-Crystallize Base DMG Multiplier%", unit: "percent", group: "reactions" },
  { key: "lunarCrystallizeSpecialDmgBonus",    label: "Lunar-Crystallize Special DMG Bonus%",    unit: "percent", group: "reactions" },
  { key: "stellarConductBaseDmgMultiplier",   label: "Stellar-Conduct Base DMG Multiplier%",   unit: "percent", group: "reactions" },
  { key: "stellarConductSpecialDmgBonus",      label: "Stellar-Conduct Special DMG Bonus%",      unit: "percent", group: "reactions" },
  { key: "stellarConductMultiplier",          label: "Stellar-Conduct Multiplier%",             unit: "percent", group: "reactions" },
  { key: "stellarSwirlBaseDmgMultiplier",     label: "Stellar Swirl Base DMG Multiplier%",     unit: "percent", group: "reactions" },
  { key: "stellarSwirlSpecialDmgBonus",        label: "Stellar Swirl Special DMG Bonus%",        unit: "percent", group: "reactions" },
  { key: "stellarSwirlMultiplier",            label: "Stellar Swirl Multiplier%",               unit: "percent", group: "reactions" },
  { key: "lunarReactionBaseDmgMultiplier",    label: "Lunar Reaction Base DMG Multiplier%",    unit: "percent", group: "reactions" },
  { key: "lunarReactionSpecialDmgBonus",       label: "Lunar Reaction Special DMG Bonus%",       unit: "percent", group: "reactions" },
  { key: "stellarReactionBaseDmgMultiplier",  label: "Stellar Reaction Base DMG Multiplier%",  unit: "percent", group: "reactions" },
  { key: "stellarReactionSpecialDmgBonus",     label: "Stellar Reaction Special DMG Bonus%",     unit: "percent", group: "reactions" },
  { key: "stellarReactionMultiplier",         label: "Stellar Reaction Multiplier%",            unit: "percent", group: "reactions" },
];

// Reaction CRIT stats
export const reactionCritStats: StatField[] = [
  { key: "lunarChargedCritRate",     label: "Lunar-Charged CRIT Rate%",     unit: "percent", group: "reactionCrits" },
  { key: "lunarChargedCritDmg",      label: "Lunar-Charged CRIT DMG%",      unit: "percent", group: "reactionCrits" },
  { key: "burningCritRate",          label: "Burning CRIT Rate%",          unit: "percent", group: "reactionCrits" },
  { key: "burningCritDmg",           label: "Burning CRIT DMG%",           unit: "percent", group: "reactionCrits" },
  { key: "superconductCritRate",      label: "Superconduct CRIT Rate%",      unit: "percent", group: "reactionCrits" },
  { key: "superconductCritDmg",       label: "Superconduct CRIT DMG%",       unit: "percent", group: "reactionCrits" },
  { key: "bloomCritRate",            label: "Bloom CRIT Rate%",            unit: "percent", group: "reactionCrits" },
  { key: "bloomCritDmg",             label: "Bloom CRIT DMG%",             unit: "percent", group: "reactionCrits" },
  { key: "burgeonCritRate",          label: "Burgeon CRIT Rate%",          unit: "percent", group: "reactionCrits" },
  { key: "burgeonCritDmg",           label: "Burgeon CRIT DMG%",           unit: "percent", group: "reactionCrits" },
  { key: "hyperbloomCritRate",       label: "Hyperbloom CRIT Rate%",       unit: "percent", group: "reactionCrits" },
  { key: "hyperbloomCritDmg",        label: "Hyperbloom CRIT DMG%",        unit: "percent", group: "reactionCrits" },
  { key: "lunarBloomCritRate",       label: "Lunar-Bloom CRIT Rate%",       unit: "percent", group: "reactionCrits" },
  { key: "lunarBloomCritDmg",        label: "Lunar-Bloom CRIT DMG%",        unit: "percent", group: "reactionCrits" },
  { key: "swirlCritRate",            label: "Swirl CRIT Rate%",            unit: "percent", group: "reactionCrits" },
  { key: "swirlCritDmg",             label: "Swirl CRIT DMG%",             unit: "percent", group: "reactionCrits" },
  { key: "lunarCrystallizeCritRate", label: "Lunar-Crystallize CRIT Rate%", unit: "percent", group: "reactionCrits" },
  { key: "lunarCrystallizeCritDmg",  label: "Lunar-Crystallize CRIT DMG%",  unit: "percent", group: "reactionCrits" },
  { key: "stellarConductCritRate",   label: "Stellar-Conduct CRIT Rate%",   unit: "percent", group: "reactionCrits" },
  { key: "stellarConductCritDmg",    label: "Stellar-Conduct CRIT DMG%",    unit: "percent", group: "reactionCrits" },
  { key: "stellarSwirlCritRate",     label: "Stellar Swirl CRIT Rate%",     unit: "percent", group: "reactionCrits" },
  { key: "stellarSwirlCritDmg",      label: "Stellar Swirl CRIT DMG%",      unit: "percent", group: "reactionCrits" },
  { key: "lunarReactionCritRate",    label: "Lunar Reaction CRIT Rate%",    unit: "percent", group: "reactionCrits" },
  { key: "lunarReactionCritDmg",     label: "Lunar Reaction CRIT DMG%",     unit: "percent", group: "reactionCrits" },
  { key: "stellarReactionCritRate",  label: "Stellar Reaction CRIT Rate%",  unit: "percent", group: "reactionCrits" },
  { key: "stellarReactionCritDmg",   label: "Stellar Reaction CRIT DMG%",   unit: "percent", group: "reactionCrits" },
];

// Lunar specific reaction stats
export const lunarStats: StatField[] = [
  { key: "lunarChargedDmgBonus",      label: "Lunar-Charged DMG Bonus%",                unit: "percent", group: "lunar" },
  { key: "lunarChargedElevation",     label: "Lunar-Charged Elevated DMG Multiplier%",   unit: "percent", group: "lunar" },
  { key: "lunarChargedFlatDmg",       label: "Lunar-Charged Flat DMG Increase",          unit: "flat",    group: "lunar" },
  { key: "lunarBloomDmgBonus",        label: "Lunar-Bloom DMG Bonus%",                  unit: "percent", group: "lunar" },
  { key: "lunarBloomElevation",       label: "Lunar-Bloom Elevated DMG Multiplier%",     unit: "percent", group: "lunar" },
  { key: "lunarBloomFlatDmg",         label: "Lunar-Bloom Flat DMG Increase",            unit: "flat",    group: "lunar" },
  { key: "lunarCrystallizeDmgBonus",  label: "Lunar-Crystallize DMG Bonus%",            unit: "percent", group: "lunar" },
  { key: "lunarCrystallizeElevation", label: "Lunar-Crystallize Elevated DMG Multiplier%", unit: "percent", group: "lunar" },
  { key: "lunarCrystallizeFlatDmg",   label: "Lunar-Crystallize Flat DMG Increase",      unit: "flat",    group: "lunar" },
];

// Stellar specific reaction stats
export const stellarStats: StatField[] = [
  { key: "stellarConductDmgBonus",   label: "Stellar-Conduct DMG Bonus%",              unit: "percent", group: "stellar" },
  { key: "stellarSwirlDmgBonus",     label: "Stellar Swirl DMG Bonus%",                unit: "percent", group: "stellar" },
  { key: "stellarGlimmerDmgBonus",   label: "Stellar Glimmer DMG Bonus%",              unit: "percent", group: "stellar" },
];

// Talent flat increases
export const talentIncreasesStats: StatField[] = [
  { key: "normalDmgIncrease",            label: "Normal Attack DMG Increase",          unit: "flat", group: "talentIncreases" },
  { key: "chargedDmgIncrease",           label: "Charged Attack DMG Increase",         unit: "flat", group: "talentIncreases" },
  { key: "plungingCollisionDmgIncrease", label: "Plunging Collision DMG Increase",     unit: "flat", group: "talentIncreases" },
  { key: "plungingImpactDmgIncrease",    label: "Plunging Impact DMG Increase",        unit: "flat", group: "talentIncreases" },
  { key: "skillDmgIncrease",             label: "Elemental Skill DMG Increase",        unit: "flat", group: "talentIncreases" },
  { key: "burstDmgIncrease",             label: "Elemental Burst DMG Increase",        unit: "flat", group: "talentIncreases" },
];

// Talent specific CRIT bonuses
export const talentCritsStats: StatField[] = [
  { key: "normalCritRate",            label: "Normal Attack CRIT Rate%",            unit: "percent", group: "talentCrits" },
  { key: "normalCritDmg",             label: "Normal Attack CRIT DMG%",             unit: "percent", group: "talentCrits" },
  { key: "chargedCritRate",           label: "Charged Attack CRIT Rate%",           unit: "percent", group: "talentCrits" },
  { key: "chargedCritDmg",            label: "Charged Attack CRIT DMG%",            unit: "percent", group: "talentCrits" },
  { key: "plungingCollisionCritRate", label: "Plunging Collision CRIT Rate%",       unit: "percent", group: "talentCrits" },
  { key: "plungingCollisionCritDmg",  label: "Plunging Collision CRIT DMG%",        unit: "percent", group: "talentCrits" },
  { key: "plungingImpactCritRate",    label: "Plunging Impact CRIT Rate%",          unit: "percent", group: "talentCrits" },
  { key: "plungingImpactCritDmg",     label: "Plunging Impact CRIT DMG%",           unit: "percent", group: "talentCrits" },
  { key: "plungingCritRate",          label: "Plunging Attack CRIT Rate%",          unit: "percent", group: "talentCrits" },
  { key: "plungingCritDmg",           label: "Plunging Attack CRIT DMG%",           unit: "percent", group: "talentCrits" },
  { key: "skillCritRate",             label: "Elemental Skill CRIT Rate%",          unit: "percent", group: "talentCrits" },
  { key: "skillCritDmg",              label: "Elemental Skill CRIT DMG%",           unit: "percent", group: "talentCrits" },
  { key: "burstCritRate",             label: "Elemental Burst CRIT Rate%",          unit: "percent", group: "talentCrits" },
  { key: "burstCritDmg",              label: "Elemental Burst CRIT DMG%",           unit: "percent", group: "talentCrits" },
  { key: "elementalAttCritRate",      label: "Elemental Attack CRIT Rate%",         unit: "percent", group: "talentCrits" },
  { key: "elementalAttCritDmg",       label: "Elemental Attack CRIT DMG%",          unit: "percent", group: "talentCrits" },
];

// Talent extra DMG bonuses
export const talentDmgStats: StatField[] = [
  { key: "plungingCollisionDmgBonus", label: "Plunging Collision DMG Bonus%",       unit: "percent", group: "talentDmg" },
  { key: "plungingImpactDmgBonus",    label: "Plunging Impact DMG Bonus%",          unit: "percent", group: "talentDmg" },
  { key: "plungingDmgBonus",          label: "Plunging Attack Extra DMG Bonus%",    unit: "percent", group: "talentDmg" },
  { key: "elementalAttDmgBonus",      label: "Elemental Attack DMG Bonus%",         unit: "percent", group: "talentDmg" },
  { key: "normalAttEleDmgBonus",      label: "Normal Attack Elemental DMG Bonus%",  unit: "percent", group: "talentDmg" },
];

// Talent level boosts
export const talentLevelsStats: StatField[] = [
  { key: "normalLevelBoost", label: "Normal Attack Level Boost", unit: "flat", group: "talentLevels" },
  { key: "skillLevelBoost",  label: "Elemental Skill Level Boost",  unit: "flat", group: "talentLevels" },
  { key: "burstLevelBoost",  label: "Elemental Burst Level Boost",  unit: "flat", group: "talentLevels" },
];

// Elemental flat increases
export const elementalIncreasesStats: StatField[] = [
  { key: "physicalDmgIncrease", label: "Physical DMG Increase", unit: "flat", group: "elementalIncreases" },
  { key: "anemoDmgIncrease",    label: "Anemo DMG Increase",    unit: "flat", group: "elementalIncreases" },
  { key: "geoDmgIncrease",      label: "Geo DMG Increase",      unit: "flat", group: "elementalIncreases" },
  { key: "electroDmgIncrease",  label: "Electro DMG Increase",  unit: "flat", group: "elementalIncreases" },
  { key: "hydroDmgIncrease",    label: "Hydro DMG Increase",    unit: "flat", group: "elementalIncreases" },
  { key: "pyroDmgIncrease",     label: "Pyro DMG Increase",     unit: "flat", group: "elementalIncreases" },
  { key: "cryoDmgIncrease",     label: "Cryo DMG Increase",     unit: "flat", group: "elementalIncreases" },
  { key: "dendroDmgIncrease",   label: "Dendro DMG Increase",   unit: "flat", group: "elementalIncreases" },
  { key: "commonDmgIncrease",   label: "Common DMG Increase",   unit: "flat", group: "elementalIncreases" },
  { key: "lunarBloomDmgIncrease",              label: "Lunar-Bloom DMG Increase",              unit: "flat", group: "elementalIncreases" },
  { key: "lunarCrystallizeDmgIncrease",        label: "Lunar-Crystallize DMG Increase",        unit: "flat", group: "elementalIncreases" },
  { key: "stellarConductDmgIncrease",          label: "Stellar-Conduct DMG Increase",          unit: "flat", group: "elementalIncreases" },
  { key: "stellarSwirlDmgIncrease",            label: "Stellar Swirl DMG Increase",            unit: "flat", group: "elementalIncreases" },
  { key: "lunarChargedReactionDmgIncrease",     label: "Lunar-Charged Reaction DMG Increase",   unit: "flat", group: "elementalIncreases" },
  { key: "lunarChargedDirectDmgIncrease",       label: "Lunar-Charged Direct DMG Increase",     unit: "flat", group: "elementalIncreases" },
  { key: "lunarBloomReactionDmgIncrease",       label: "Lunar-Bloom Reaction DMG Increase",     unit: "flat", group: "elementalIncreases" },
  { key: "lunarBloomDirectDmgIncrease",         label: "Lunar-Bloom Direct DMG Increase",       unit: "flat", group: "elementalIncreases" },
  { key: "lunarCrystallizeReactionDmgIncrease", label: "Lunar-Crystallize Reaction DMG Increase", unit: "flat", group: "elementalIncreases" },
  { key: "lunarCrystallizeDirectDmgIncrease",   label: "Lunar-Crystallize Direct DMG Increase",   unit: "flat", group: "elementalIncreases" },
  { key: "stellarConductReactionDmgIncrease",   label: "Stellar-Conduct Reaction DMG Increase",   unit: "flat", group: "elementalIncreases" },
  { key: "stellarConductDirectDmgIncrease",     label: "Stellar-Conduct Direct DMG Increase",     unit: "flat", group: "elementalIncreases" },
  { key: "stellarSwirlReactionDmgIncrease",     label: "Stellar Swirl Reaction DMG Increase",     unit: "flat", group: "elementalIncreases" },
  { key: "stellarSwirlDirectDmgIncrease",       label: "Stellar Swirl Direct DMG Increase",       unit: "flat", group: "elementalIncreases" },
  { key: "lunarReactionDmgIncrease",            label: "Lunar Reaction DMG Increase",            unit: "flat", group: "elementalIncreases" },
  { key: "stellarReactionDmgIncrease",          label: "Stellar Reaction DMG Increase",          unit: "flat", group: "elementalIncreases" },
];

// Elemental CRIT bonuses
export const elementalCritsStats: StatField[] = [
  { key: "physicalCritRate", label: "Physical CRIT Rate%", unit: "percent", group: "elementalCrits" },
  { key: "physicalCritDmg",  label: "Physical CRIT DMG%",  unit: "percent", group: "elementalCrits" },
  { key: "anemoCritRate",    label: "Anemo CRIT Rate%",    unit: "percent", group: "elementalCrits" },
  { key: "anemoCritDmg",     label: "Anemo CRIT DMG%",     unit: "percent", group: "elementalCrits" },
  { key: "geoCritRate",      label: "Geo CRIT Rate%",      unit: "percent", group: "elementalCrits" },
  { key: "geoCritDmg",       label: "Geo CRIT DMG%",       unit: "percent", group: "elementalCrits" },
  { key: "electroCritRate",  label: "Electro CRIT Rate%",  unit: "percent", group: "elementalCrits" },
  { key: "electroCritDmg",   label: "Electro CRIT DMG%",   unit: "percent", group: "elementalCrits" },
  { key: "hydroCritRate",    label: "Hydro CRIT Rate%",    unit: "percent", group: "elementalCrits" },
  { key: "hydroCritDmg",     label: "Hydro CRIT DMG%",     unit: "percent", group: "elementalCrits" },
  { key: "pyroCritRate",     label: "Pyro CRIT Rate%",     unit: "percent", group: "elementalCrits" },
  { key: "pyroCritDmg",      label: "Pyro CRIT DMG%",      unit: "percent", group: "elementalCrits" },
  { key: "cryoCritRate",     label: "Cryo CRIT Rate%",     unit: "percent", group: "elementalCrits" },
  { key: "cryoCritDmg",      label: "Cryo CRIT DMG%",      unit: "percent", group: "elementalCrits" },
  { key: "dendroCritRate",   label: "Dendro CRIT Rate%",   unit: "percent", group: "elementalCrits" },
  { key: "dendroCritDmg",    label: "Dendro CRIT DMG%",    unit: "percent", group: "elementalCrits" },
];

// Enemy specific elemental resistances
export const enemyResStats: StatField[] = [
  { key: "enemyPhysicalRes", label: "Enemy Physical RES%", unit: "percent", group: "enemyRes" },
  { key: "enemyAnemoRes",    label: "Enemy Anemo RES%",    unit: "percent", group: "enemyRes" },
  { key: "enemyGeoRes",      label: "Enemy Geo RES%",      unit: "percent", group: "enemyRes" },
  { key: "enemyElectroRes",  label: "Enemy Electro RES%",  unit: "percent", group: "enemyRes" },
  { key: "enemyHydroRes",    label: "Enemy Hydro RES%",    unit: "percent", group: "enemyRes" },
  { key: "enemyPyroRes",     label: "Enemy Pyro RES%",     unit: "percent", group: "enemyRes" },
  { key: "enemyCryoRes",     label: "Enemy Cryo RES%",     unit: "percent", group: "enemyRes" },
  { key: "enemyDendroRes",   label: "Enemy Dendro RES%",   unit: "percent", group: "enemyRes" },
];

// Self elemental & physical resistances
export const selfResStats: StatField[] = [
  { key: "selfPhysicalRes", label: "Physical RES%", unit: "percent", group: "selfRes" },
  { key: "selfAnemoRes",    label: "Anemo RES%",    unit: "percent", group: "selfRes" },
  { key: "selfGeoRes",      label: "Geo RES%",      unit: "percent", group: "selfRes" },
  { key: "selfElectroRes",  label: "Electro RES%",  unit: "percent", group: "selfRes" },
  { key: "selfHydroRes",    label: "Hydro RES%",    unit: "percent", group: "selfRes" },
  { key: "selfPyroRes",     label: "Pyro RES%",     unit: "percent", group: "selfRes" },
  { key: "selfCryoRes",     label: "Cryo RES%",     unit: "percent", group: "selfRes" },
  { key: "selfDendroRes",   label: "Dendro RES%",   unit: "percent", group: "selfRes" },
];

// Stamina buffs
export const staminaStats: StatField[] = [
  { key: "stamina",                 label: "Max Stamina",                      unit: "flat",    group: "stamina" },
  { key: "staminaDec",              label: "Stamina Consumption Dec.%",        unit: "percent", group: "stamina" },
  { key: "sprintingStaminaDec",     label: "Sprinting Stamina Dec.%",          unit: "percent", group: "stamina" },
  { key: "glidingStaminaDec",       label: "Gliding Stamina Dec.%",            unit: "percent", group: "stamina" },
  { key: "chargedAttackStaminaDec", label: "Charged Attack Stamina Dec.%",     unit: "percent", group: "stamina" },
];

// Misc & utility stats
export const miscStats: StatField[] = [
  { key: "incomingHealingBonus", label: "Incoming Healing Bonus%", unit: "percent", group: "misc" },
  { key: "shieldStrength",       label: "Shield Strength%",        unit: "percent", group: "misc" },
  { key: "cdReduction",          label: "Cooldown Reduction%",     unit: "percent", group: "misc" },
  { key: "movementSpd",          label: "Movement SPD%",           unit: "percent", group: "misc" },
  { key: "atkSpd",               label: "ATK SPD%",                unit: "percent", group: "misc" },
  { key: "weakspotDmg",          label: "Weakspot DMG Bonus%",     unit: "percent", group: "misc" },
  { key: "healIncrease",         label: "Healing Increase (Flat)", unit: "flat",    group: "misc" },
  { key: "allRes",               label: "All RES%",                unit: "percent", group: "misc" },
];

// Unified skeleton exported across characters; dmgBonus label is overridden per character.
export const coreStats = (dmgBonusLabel: string): StatField[] => [
  ...baseStats,
  ...advancedStats,
  ...combatStats(dmgBonusLabel),
  ...defenseStats,
  ...lunarStats,
  ...stellarStats,
  ...reactionStats,
  ...reactionCritStats,
  ...talentIncreasesStats,
  ...talentCritsStats,
  ...talentDmgStats,
  ...talentLevelsStats,
  ...elementalIncreasesStats,
  ...elementalCritsStats,
  ...enemyResStats,
  ...selfResStats,
  ...staminaStats,
  ...miscStats,
];


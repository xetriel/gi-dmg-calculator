import type { StatField } from "./types";
// Shared skeleton identical across characters; dmgBonus label is overridden per character.
export const coreStats = (dmgBonusLabel: string): StatField[] => [
  { key: "hp",  label: "HP",  unit: "flat", group: "base", hasBaseAndFlat: true },
  { key: "atk", label: "ATK", unit: "flat", group: "base", hasBaseAndFlat: true },
  { key: "def", label: "DEF", unit: "flat", group: "base", hasBaseAndFlat: true },
  { key: "em",             label: "Elemental Mastery",  unit: "flat",    group: "advanced" },
  { key: "critRate",       label: "CRIT Rate%",         unit: "percent", group: "combat" },
  { key: "critDmg",        label: "CRIT DMG%",          unit: "percent", group: "combat" },
  { key: "energyRecharge", label: "Energy Recharge%",   unit: "percent", group: "advanced" },
  { key: "dmgBonus",       label: dmgBonusLabel,        unit: "percent", group: "combat" },
  { key: "healingBonus",   label: "Healing Bonus%",     unit: "percent", group: "advanced" },
  { key: "dmgReduction",   label: "DMG Reduction / -(DMG Bonus)", unit: "percent", group: "defense" },
  { key: "enemyRes",       label: "Enemy RES% (All Elements)",    unit: "percent", group: "defense" },
  { key: "levelChar",      label: "Level (Character)",  unit: "flat",    group: "defense" },
  { key: "levelEnemy",     label: "Level (Enemy)",      unit: "flat",    group: "defense" },
  { key: "defReduction",   label: "DEF Reduction%",     unit: "percent", group: "defense" },
  { key: "defIgnore",      label: "DEF Ignore%",        unit: "percent", group: "defense" },
];

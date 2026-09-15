import type { DamageStats } from "./damage";
import type { CharacterConfig } from "@/data/registry/types";
import { weaponById, type ExternalWeaponInstance, type WeaponBuffContext, type WeaponSlot } from "../../data/registry/weapons";

export type { ExternalWeaponInstance, WeaponSlot } from "../../data/registry/weapons";


export interface ExternalWeaponBuffSource {
  weaponId: string;
  weaponName: string;
  refinement: number;
  slot?: WeaponSlot;
  buffId?: string;
  stat: string;
  label: string;
  value: number;
  rarity?: number;
}

export interface ExternalWeaponBuffResult {
  statDeltas: Partial<DamageStats>;
  sources: ExternalWeaponBuffSource[];
}

/**
 * Resolves all active external weapon buffs for the current character calculation instance.
 *
 * @param weapons - array of ExternalWeaponInstance attached to the active setup (max 4)
 * @param baseAtk - active character's base ATK
 * @param charConfig - active character's CharacterConfig (for element and weapon type routing)
 * @param masterEnabled - master toggle state for external weapon buffs (defaults to true)
 */
export function resolveExternalWeaponBuffs(
  weapons: ExternalWeaponInstance[] | undefined,
  baseAtk: number = 0,
  charConfig?: CharacterConfig,
  masterEnabled: boolean = true,
  overriddenWeaponIds?: string[] | Set<string>,
  baseDef: number = 0,
  baseHp: number = 0,
): ExternalWeaponBuffResult {
  const result: ExternalWeaponBuffResult = {
    statDeltas: {},
    sources: [],
  };

  if (!masterEnabled || !weapons || weapons.length === 0) {
    return result;
  }

  const overriddenSet = new Set(
    overriddenWeaponIds instanceof Set
      ? Array.from(overriddenWeaponIds)
      : (overriddenWeaponIds ?? [])
  );

  // Enforce max 4 weapons (including active character)
  const validWeapons = weapons.slice(0, 4);

  for (const inst of validWeapons) {
    if (!inst.enabled) continue;

    // If this weapon is already equipped on an active support character, it is overridden
    if (overriddenSet.has(inst.weaponId)) {
      continue;
    }

    const config = weaponById(inst.weaponId);
    if (!config) continue;

    const refinement = Math.max(1, Math.min(5, inst.refinement || 1));
    const ctx: WeaponBuffContext = {
      refinement,
      baseAtk,
      baseDef,
      baseHp,
      charElement: charConfig?.element,
      charWeapon: charConfig?.weapon,
      inputs: inst.inputs ?? {},
    };

    const isMatchingClass = charConfig ? config.type === charConfig.weapon : false;
    const slot: WeaponSlot = inst.slot ?? (isMatchingClass && config.buffType === "self" ? "wielder" : "support");
    const isWielder = slot === "wielder" && isMatchingClass;

    // 1. Resolve Wielder Substat if this is equipped by the matching active wielder
    if (isWielder && config.subStat) {
      const isPct =
        config.subStat.label.includes("%") ||
        config.subStat.type.endsWith("Pct") ||
        ["defPct", "atkPct", "hpPct", "critRate", "critDmg", "energyRecharge", "healingBonus", "physicalDmgBonus"].includes(
          config.subStat.type
        );
      const subVal = config.subStat.value;
      let flatVal = subVal;
      let targetStat: keyof DamageStats = config.subStat.type as keyof DamageStats;

      if (config.subStat.type === "defPct" || (config.subStat.type === "def" && isPct)) {
        targetStat = "def";
        flatVal = baseDef > 0 ? (subVal / 100) * baseDef : 0;
      } else if (config.subStat.type === "atkPct" || (config.subStat.type === "atk" && isPct)) {
        targetStat = "atk";
        flatVal = baseAtk > 0 ? (subVal / 100) * baseAtk : 0;
      } else if (config.subStat.type === "hpPct" || (config.subStat.type === "hp" && isPct)) {
        targetStat = "hp";
        flatVal = baseHp > 0 ? (subVal / 100) * baseHp : 0;
      } else {
        flatVal = subVal;
      }

      if (flatVal > 0 && Number.isFinite(flatVal)) {
        result.sources.push({
          weaponId: config.id,
          weaponName: config.name,
          refinement,
          slot,
          buffId: `${config.id}-substat`,
          stat: targetStat as string,
          label: `${config.name}: ${config.subStat.label} (+${subVal}${isPct ? "%" : ""})`,
          value: flatVal,
          rarity: config.rarity,
        });

        (result.statDeltas as Record<string, number>)[targetStat] =
          ((result.statDeltas as Record<string, number>)[targetStat] ?? 0) + flatVal;
      }
    }

    // 2. Resolve Weapon Passives
    for (const buff of config.buffs) {
      // Support slot only receives team buffs (!buff.isTeamBuff is skipped)
      if (slot === "support" && !buff.isTeamBuff) {
        continue;
      }

      // Wielder slot receives team buffs and self buffs (if character matches weapon class)
      if (slot === "wielder" && !buff.isTeamBuff && !isWielder) {
        continue;
      }

      let val = 0;
      if (buff.compute) {
        val = buff.compute(refinement, ctx);
      } else {
        const rawVal = buff.refinementValues[refinement - 1] ?? 0;
        if (buff.isPercent && buff.stat === "atk") {
          val = baseAtk > 0 ? (rawVal / 100) * baseAtk : rawVal;
        } else if (buff.isPercent && buff.stat === "def") {
          val = baseDef > 0 ? (rawVal / 100) * baseDef : rawVal;
        } else if (buff.isPercent && buff.stat === "hp") {
          val = baseHp > 0 ? (rawVal / 100) * baseHp : rawVal;
        } else {
          val = rawVal;
        }
      }

      if (val === 0 || !Number.isFinite(val)) continue;

      result.sources.push({
        weaponId: config.id,
        weaponName: config.name,
        refinement,
        slot,
        buffId: buff.id,
        stat: buff.stat,
        label: `${buff.label} (R${refinement})`,
        value: val,
        rarity: config.rarity,
      });

      const key = buff.stat as keyof DamageStats;
      (result.statDeltas as Record<string, number>)[key] =
        ((result.statDeltas as Record<string, number>)[key] ?? 0) + val;
    }
  }

  return result;
}

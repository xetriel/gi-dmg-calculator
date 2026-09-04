import type { DamageStats } from "./damage";
import type { CharacterConfig } from "@/data/registry/types";
import { weaponById, type ExternalWeaponInstance, type WeaponBuffContext } from "../../data/registry/weapons";

export type { ExternalWeaponInstance } from "../../data/registry/weapons";


export interface ExternalWeaponBuffSource {
  weaponId: string;
  weaponName: string;
  refinement: number;
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
): ExternalWeaponBuffResult {
  const result: ExternalWeaponBuffResult = {
    statDeltas: {},
    sources: [],
  };

  if (!masterEnabled || !weapons || weapons.length === 0) {
    return result;
  }

  // Enforce max 4 weapons (including active character)
  const validWeapons = weapons.slice(0, 4);

  for (const inst of validWeapons) {
    if (!inst.enabled) continue;

    const config = weaponById(inst.weaponId);
    if (!config) continue;

    const refinement = Math.max(1, Math.min(5, inst.refinement || 1));
    const ctx: WeaponBuffContext = {
      refinement,
      baseAtk,
      charElement: charConfig?.element,
      charWeapon: charConfig?.weapon,
      inputs: inst.inputs ?? {},
    };

    const isWielder = charConfig ? config.type === charConfig.weapon : false;

    for (const buff of config.buffs) {
      // Team buffs apply to everyone; self-only buffs apply only if the active character matches the weapon class
      if (!buff.isTeamBuff && !isWielder) {
        continue;
      }

      let val = 0;
      if (buff.compute) {
        val = buff.compute(refinement, ctx);
      } else {
        const rawVal = buff.refinementValues[refinement - 1] ?? 0;
        if (buff.isPercent && buff.stat === "atk") {
          val = (rawVal / 100) * baseAtk;
        } else {
          val = rawVal;
        }
      }

      if (val === 0 || !Number.isFinite(val)) continue;

      result.sources.push({
        weaponId: config.id,
        weaponName: config.name,
        refinement,
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

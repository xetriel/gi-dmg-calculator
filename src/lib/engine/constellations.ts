import type { CharacterConfig } from "@/data/registry/types";
import { scalingTotal, type DamageStats } from "./damage";

export function activeEffects(config: CharacterConfig, level: number) {
  if (!config.constellations) return [];
  return config.constellations
    .filter(c => c.level <= level)
    .flatMap(c => c.effects);
}

export function constellationFlatBonus(effects: any[], hitKey: string, stats: DamageStats): number {
  let bonus = 0;
  for (const e of effects) {
    if (e.type === "flat_dmg_bonus" && e.affectedHitKeys?.includes(hitKey)) {
      const base = e.bonusScaling ? scalingTotal(stats, e.bonusScaling) : 0;
      bonus += base * (e.bonusPercent ?? 0) / 100;
    }
  }
  return bonus;
}

export function constellationStatBonuses(effects: any[]): Record<string, number> {
  const bonuses: Record<string, number> = {};
  for (const e of effects) {
    if (e.type === "stat_bonus" && e.statKey) {
      bonuses[e.statKey] = (bonuses[e.statKey] ?? 0) + (e.statValue ?? 0);
    }
  }
  return bonuses;
}

import type { DamageStats } from "../damage";
import type { TalentScalingData } from "../../talent-scaling";
import type { MechanicsCtx } from "../mechanics-utils";
import { flattenSeed, TALENT_SEED } from "../../../data/talents";

export const LV90 = 1446.853458;

export const baseStats: DamageStats = {
  atk: 2000,
  hp: 20000,
  def: 0,
  em: 0,
  critRate: 50,
  critDmg: 100,
  dmgBonus: 0,
  normalDmgBonus: 0,
  chargedDmgBonus: 0,
  plungeDmgBonus: 0,
  skillDmgBonus: 0,
  burstDmgBonus: 0,
  pyroDmgBonus: 0,
  hydroDmgBonus: 0,
  dendroDmgBonus: 0,
  electroDmgBonus: 0,
  anemoDmgBonus: 0,
  cryoDmgBonus: 0,
  geoDmgBonus: 0,
  physicalDmgBonus: 0,
  dmgReduction: 0,
  enemyRes: 0,
  levelChar: 90,
  levelEnemy: 100,
  defReduction: 0,
  defIgnore: 0,
  energyRecharge: 100,
  healingBonus: 0,
};

// Build TalentScalingData for a character straight from its seed (as the page does).
export function scalingFor(characterId: string): TalentScalingData {
  const out: TalentScalingData = {};
  for (const r of flattenSeed(TALENT_SEED.filter(s => s.characterId === characterId))) {
    const t = (out[r.talentType] ??= { levels: [], byLevel: {} });
    (t.byLevel[r.level] ??= {})[r.hitKey] = r.value;
  }
  for (const t of Object.values(out)) {
    t.levels = Object.keys(t.byLevel).map(Number).sort((a, b) => a - b);
  }
  return out;
}

export function ctxFor(characterId: string, overrides: Partial<MechanicsCtx> = {}): MechanicsCtx {
  return {
    stats: { ...baseStats, ...(overrides.stats || {}) },
    baseAtk: 800,
    baseDef: 500,
    constellationLevel: 0,
    talentLevels: overrides.talentLevels || overrides.levels || { normal: 10, skill: 10, burst: 10 },
    scaling: scalingFor(characterId),
    inputs: {},
    ...overrides,
  };
}

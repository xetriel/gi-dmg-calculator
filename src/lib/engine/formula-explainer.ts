import type { CharacterConfig, Element, ReactionType } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { CalcInstance } from "@/components/calculator/types";
import {
  computeHit,
  scalingTotal,
  defMultiplier,
  resMultiplier,
  amplifyingMultiplier,
  catalyzeAdditive,
  dmgBonusMultiplier,
  stellarEmBonus,
  type DamageStats,
  type HitResult,
} from "./damage";
import {
  resolveStats,
  resolveHitMultipliers,
  effectiveTalentLevels,
  toNum,
  hitId,
  getRequiredConstellation,
} from "./validation";
import { resolveMechanics } from "./mechanics";
import { levelMultiplier } from "./level-multiplier";
import { transformativeDamage, TRANSFORMATIVE_BY_ELEMENT, TRANSFORMATIVE_LABEL } from "./transformative";
import { indirectLunarDamage, LUNAR_BY_ELEMENT, LUNAR_LABEL, LUNAR_DIRECT_MULTIPLIER } from "./lunar";
import {
  indirectStellarDamage,
  STELLAR_BY_ELEMENT,
  STELLAR_LABEL,
  STELLAR_SWIRL_VARIANT_LABEL,
  STELLAR_INDIRECT_COEFFICIENT,
  STELLAR_DIRECT_COEFFICIENT,
  type StellarType,
  type StellarSwirlVariant,
} from "./stellar";
import { activeEffects, constellationFlatBonus, constellationStatBonuses } from "./constellations";
import { resolveTeamBuffs } from "./team-buffs";
import { resolveExternalWeaponBuffs } from "./weapon-buffs";
import { resolveExternalArtifactBuffs } from "./artifact-buffs";


export interface FormulaBreakdown {
  id: string;
  hitName: string;
  category: string;
  element: Element | "Physical";
  reaction: ReactionType;
  multiplierPct: number;
  scalingSource: string;
  nonCrit: number;
  crit: number;
  avg: number;
  mainFormula: string;
  mainFormulaNonCrit?: string;
  mainFormulaCrit?: string;
  mainFormulaAvg?: string;
  subBreakdowns: string[];
}

const fmt = (n: number, decimals: number = 1) => {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

const fmtPct = (n: number, decimals: number = 1) => `${fmt(n, decimals)}%`;

function formatResMultiplier(resPct: number, elem: string): string {
  if (resPct < 0) {
    return `(100% - Total Enemy ${elem} DMG RES ${fmtPct(resPct)} / 2)`;
  } else if (resPct <= 75) {
    return `(100% - Total Enemy ${elem} DMG RES ${fmtPct(resPct)})`;
  } else {
    return `(1 / (4 * Total Enemy ${elem} DMG RES ${fmtPct(resPct)} + 1))`;
  }
}

export function explainHitFormulas(
  config: CharacterConfig,
  scaling: TalentScalingData,
  inst: CalcInstance
): FormulaBreakdown[] {
  const inputStats = resolveStats({
    stats: inst.stats,
    hits: inst.hits,
    reaction: inst.reaction,
    reactionBonus: inst.reactionBonus,
    mechanicInputs: inst.mechanicInputs,
  });

  const parsedInputs: Record<string, number> = {};
  for (const m of config.mechanicDefs ?? []) {
    const requiredCon = getRequiredConstellation(m);
    if (requiredCon > 0 && inst.constellationLevel < requiredCon) {
      parsedInputs[m.id] = 0;
    } else {
      const rawVal = inst.mechanicInputs?.[m.id];
      parsedInputs[m.id] = toNum(rawVal) ?? (m.defaultValue ?? 0);
    }
  }

  const baseAtk = toNum(inst.stats["atk.base"]) ?? 800;
  const baseDef = toNum(inst.stats["def.base"]) ?? 500;
  const baseHp = toNum(inst.stats["hp.base"]) ?? 15000;
  const atkFlat = toNum(inst.stats["atk.flat"]) ?? 0;
  const atkPct = toNum(inst.stats["atk.percent"]) ?? 0;
  const hpFlat = toNum(inst.stats["hp.flat"]) ?? 0;
  const hpPct = toNum(inst.stats["hp.percent"]) ?? 0;
  const defFlat = toNum(inst.stats["def.flat"]) ?? 0;
  const defPct = toNum(inst.stats["def.percent"]) ?? 0;

  const mech = resolveMechanics(config, {
    stats: inputStats,
    baseAtk,
    baseDef,
    baseHp,
    constellationLevel: inst.constellationLevel,
    talentLevels: effectiveTalentLevels(config, scaling, inst.levels, inst.constellationLevel, inst.mechanicInputs),
    scaling,
    inputs: parsedInputs,
  });

  const effectiveStats: DamageStats = { ...inputStats };
  for (const [key, val] of Object.entries(mech.statDeltas)) {
    if (key in effectiveStats && typeof val === "number") {
      (effectiveStats as unknown as Record<string, number>)[key] += val;
    }
  }

  const effects = activeEffects(config, inst.constellationLevel);
  const statBonuses = constellationStatBonuses(effects);
  for (const [key, val] of Object.entries(statBonuses)) {
    if (key in effectiveStats) {
      (effectiveStats as unknown as Record<string, number>)[key] += val;
    }
  }

  // Apply team support buffs
  let lunarBaseFromTeam = 0;
  let stellarBaseFromTeam = 0;
  const teamResult = (inst.teamBuffsEnabled !== false && inst.teamSupports?.length)
    ? resolveTeamBuffs(inst.teamSupports, true, config, baseAtk, baseDef, baseHp)
    : null;
  if (teamResult) {
    for (const [key, val] of Object.entries(teamResult.statDeltas)) {
      if (key in effectiveStats && typeof val === "number") {
        (effectiveStats as unknown as Record<string, number>)[key] += val;
      }
    }
    lunarBaseFromTeam = teamResult.lunarBaseBonusPct;
    stellarBaseFromTeam = teamResult.stellarBaseBonusPct;
  }

  // Apply external weapon team buffs
  const weaponResult = (inst.externalWeaponBuffsEnabled !== false && inst.externalWeapons?.length)
    ? resolveExternalWeaponBuffs(inst.externalWeapons, baseAtk, config, true, teamResult?.equippedWeaponIds)
    : null;
  if (weaponResult) {
    for (const [key, val] of Object.entries(weaponResult.statDeltas)) {
      if (key in effectiveStats && typeof val === "number") {
        (effectiveStats as unknown as Record<string, number>)[key] += val;
      }
    }
  }

  // Apply external artifact team buffs
  const artifactResult = (inst.externalArtifactBuffsEnabled !== false && inst.externalArtifacts?.length)
    ? resolveExternalArtifactBuffs(inst.externalArtifacts, baseAtk, config, true, baseDef, baseHp, teamResult?.equippedArtifactIds)
    : null;
  if (artifactResult) {
    for (const [key, val] of Object.entries(artifactResult.statDeltas)) {
      if (key in effectiveStats && typeof val === "number") {
        (effectiveStats as unknown as Record<string, number>)[key] += val;
      }
    }
  }

  const lunarBaseTotal = (toNum(inst.lunarBaseBonus) ?? 0) + (mech.lunarBaseBonusPct ?? 0) + lunarBaseFromTeam;
  const panelBonusTotal = toNum(inst.reactionPanelBonus) ?? 0;
  const stellarBaseTotal = (toNum(inst.stellarBaseBonus) ?? 0) + stellarBaseFromTeam;
  const stellarPanelTotal = toNum(inst.stellarPanelBonus) ?? 0;


  const resolvedMultipliers = resolveHitMultipliers(
    config,
    scaling,
    inst.levels,
    inst.hits,
    inst.constellationLevel,
    inst.mechanicInputs
  );

  const breakdowns: FormulaBreakdown[] = [];

  // 1. Process standard talent hits
  config.talents.forEach((g, gi) => {
    g.hits.forEach((h, hi) => {
      const id = hitId(gi, hi);
      const mult = resolvedMultipliers[id];
      if (mult == null || mult === 0) return;

      // Skip inactive constellation hits
      if (h.minConstellation != null && inst.constellationLevel < h.minConstellation) {
        return;
      }

      const mods = mech.perHit[h.key] ?? {};
      const elem = mods.element ?? h.element ?? config.element;
      const effectiveReaction = inst.reaction;
      const flatBonus = constellationFlatBonus(effects, h.key, effectiveStats) + (mods.flatDmgBonus ?? 0);

      let directRx = h.direct ? mods.directReaction ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 } : undefined;
      if (directRx) {
        const isStellar = h.direct === "stellar" || directRx.stellarType !== undefined || (!directRx.lunarType && config.element === "Cryo");
        const isLunar = h.direct === "lunar" || directRx.lunarType !== undefined;
        const extraBase = isStellar ? stellarBaseTotal : isLunar ? lunarBaseTotal : 0;
        const extraRx = isStellar ? stellarPanelTotal : isLunar ? panelBonusTotal : 0;
        directRx = {
          ...directRx,
          baseDmgBonusPct: (directRx.baseDmgBonusPct ?? 0) + extraBase,
          reactionBonusPct: (directRx.reactionBonusPct ?? 0) + extraRx,
        };
      }

      const hitRes = computeHit(effectiveStats, {
        multiplier: mult,
        scaling: h.scaling,
        element: elem,
        reaction: effectiveReaction,
        reactionBonusPct: Number(inst.reactionBonus || 0) + (mods.reactionBonusPct ?? 0),
        flatDmgBonus: flatBonus || undefined,
        baseDmgMultiplier: mods.baseDmgMultiplier,
        critDmgBonusPct: mods.critDmgBonusPct,
        critRateBonusPct: mods.critRateBonusPct,
        bonusDmgPct: mods.bonusDmgPct,
        defIgnorePct: mods.defIgnorePct,
        hitCategory: h.hitCategory ?? (g.type as any),
        charElement: config.element,
        dmgBonusLabel: config.dmgBonusLabel,
        directReaction: directRx,
      });

      const statVal = scalingTotal(effectiveStats, h.scaling);
      const statName = h.scaling.toUpperCase();
      const baseMult = mods.baseDmgMultiplier ?? 1;
      const flatIncrease = flatBonus;

      // Catalyze additive DMG
      const catAdd = elem === "Physical" ? 0 : catalyzeAdditive(elem, effectiveReaction, effectiveStats.levelChar, effectiveStats.em, Number(inst.reactionBonus || 0) + (mods.reactionBonusPct ?? 0));
      const totalIncrease = flatIncrease + catAdd;

      // Base DMG term calculation
      const baseDmgTerm = (mult / 100) * statVal * baseMult + totalIncrease;

      // DMG bonus calculation
      let categoryBonus = 0;
      const catKey = h.hitCategory ?? (g.type as any);
      if (catKey === "normal") categoryBonus = effectiveStats.normalDmgBonus;
      else if (catKey === "charged") categoryBonus = effectiveStats.chargedDmgBonus;
      else if (catKey === "plunge") categoryBonus = effectiveStats.plungeDmgBonus;
      else if (catKey === "skill") categoryBonus = effectiveStats.skillDmgBonus;
      else if (catKey === "burst") categoryBonus = effectiveStats.burstDmgBonus;
      else if (catKey === "special") categoryBonus = 0;

      let elementBonus = 0;
      if (elem === "Pyro") elementBonus = effectiveStats.pyroDmgBonus;
      else if (elem === "Hydro") elementBonus = effectiveStats.hydroDmgBonus;
      else if (elem === "Dendro") elementBonus = effectiveStats.dendroDmgBonus;
      else if (elem === "Electro") elementBonus = effectiveStats.electroDmgBonus;
      else if (elem === "Anemo") elementBonus = effectiveStats.anemoDmgBonus;
      else if (elem === "Cryo") elementBonus = effectiveStats.cryoDmgBonus;
      else if (elem === "Geo") elementBonus = effectiveStats.geoDmgBonus;
      else if (elem === "Physical") elementBonus = effectiveStats.physicalDmgBonus;

      const commonBonus = effectiveStats.dmgBonus;
      const extraBonus = mods.bonusDmgPct ?? 0;
      const totalDmgBonusPct = commonBonus + categoryBonus + elementBonus + extraBonus - effectiveStats.dmgReduction;
      const dmgBonusMult = 1 + totalDmgBonusPct / 100;

      // Elemental and Talent CRIT Rate & CRIT DMG additions
      let elementalCritRate = 0;
      let elementalCritDmg = 0;
      if (elem === "Pyro") { elementalCritRate = effectiveStats.pyroCritRate ?? 0; elementalCritDmg = effectiveStats.pyroCritDmg ?? 0; }
      else if (elem === "Hydro") { elementalCritRate = effectiveStats.hydroCritRate ?? 0; elementalCritDmg = effectiveStats.hydroCritDmg ?? 0; }
      else if (elem === "Cryo") { elementalCritRate = effectiveStats.cryoCritRate ?? 0; elementalCritDmg = effectiveStats.cryoCritDmg ?? 0; }
      else if (elem === "Electro") { elementalCritRate = effectiveStats.electroCritRate ?? 0; elementalCritDmg = effectiveStats.electroCritDmg ?? 0; }
      else if (elem === "Anemo") { elementalCritRate = effectiveStats.anemoCritRate ?? 0; elementalCritDmg = effectiveStats.anemoCritDmg ?? 0; }
      else if (elem === "Geo") { elementalCritRate = effectiveStats.geoCritRate ?? 0; elementalCritDmg = effectiveStats.geoCritDmg ?? 0; }
      else if (elem === "Dendro") { elementalCritRate = effectiveStats.dendroCritRate ?? 0; elementalCritDmg = effectiveStats.dendroCritDmg ?? 0; }
      else if (elem === "Physical") { elementalCritRate = effectiveStats.physicalCritRate ?? 0; elementalCritDmg = effectiveStats.physicalCritDmg ?? 0; }

      const hitCat = h.hitCategory ?? (g.type as "normal" | "skill" | "burst");
      let talentCritRate = 0;
      let talentCritDmg = 0;
      if (hitCat === "normal") { talentCritRate = effectiveStats.normalCritRate ?? 0; talentCritDmg = effectiveStats.normalCritDmg ?? 0; }
      else if (hitCat === "charged") { talentCritRate = effectiveStats.chargedCritRate ?? 0; talentCritDmg = effectiveStats.chargedCritDmg ?? 0; }
      else if (hitCat === "plunge") { talentCritRate = effectiveStats.plungingCritRate ?? 0; talentCritDmg = effectiveStats.plungingCritDmg ?? 0; }
      else if (hitCat === "skill") { talentCritRate = effectiveStats.skillCritRate ?? 0; talentCritDmg = effectiveStats.skillCritDmg ?? 0; }
      else if (hitCat === "burst") { talentCritRate = effectiveStats.burstCritRate ?? 0; talentCritDmg = effectiveStats.burstCritDmg ?? 0; }

      // CRIT Rate & CRIT DMG
      const effectiveCritRate = Math.min(Math.max(effectiveStats.critRate + (mods.critRateBonusPct ?? 0) + elementalCritRate + talentCritRate, 0), 100);
      const effectiveCritDmg = effectiveStats.critDmg + (mods.critDmgBonusPct ?? 0) + elementalCritDmg + talentCritDmg;
      const critMult = 1 + effectiveCritDmg / 100;

      // DEF & RES multipliers
      let targetRes = effectiveStats.enemyRes;
      if (elem === "Pyro" && effectiveStats.enemyPyroRes !== undefined) targetRes = effectiveStats.enemyPyroRes;
      else if (elem === "Hydro" && effectiveStats.enemyHydroRes !== undefined) targetRes = effectiveStats.enemyHydroRes;
      else if (elem === "Cryo" && effectiveStats.enemyCryoRes !== undefined) targetRes = effectiveStats.enemyCryoRes;
      else if (elem === "Electro" && effectiveStats.enemyElectroRes !== undefined) targetRes = effectiveStats.enemyElectroRes;
      else if (elem === "Anemo" && effectiveStats.enemyAnemoRes !== undefined) targetRes = effectiveStats.enemyAnemoRes;
      else if (elem === "Geo" && effectiveStats.enemyGeoRes !== undefined) targetRes = effectiveStats.enemyGeoRes;
      else if (elem === "Dendro" && effectiveStats.enemyDendroRes !== undefined) targetRes = effectiveStats.enemyDendroRes;
      else if (elem === "Physical" && effectiveStats.enemyPhysicalRes !== undefined) targetRes = effectiveStats.enemyPhysicalRes;

      const defMult = defMultiplier(effectiveStats, mods.defIgnorePct);
      const resMult = resMultiplier(targetRes);
      const ampMult = elem === "Physical" ? 1 : amplifyingMultiplier(elem, effectiveReaction, effectiveStats.em, Number(inst.reactionBonus || 0) + (mods.reactionBonusPct ?? 0));

      // Build main formula lines for Non-Crit, CRIT, and Avg modes
      let basePart = "";
      let specialPart = "";
      if (h.direct === "lunar") {
        const dr = mods.directReaction ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0, lunarType: h.lunarType };
        const emBonusPct = stellarEmBonus(effectiveStats.em) * 100;

        let specificDmgBonus = 0;
        let specificElevation = 0;
        let specificFlatDmg = 0;
        let lunarLabel = "Lunar DMG Bonus";

        if (h.lunarType === "lunar-charged") {
          specificDmgBonus = effectiveStats.lunarChargedDmgBonus ?? 0;
          specificElevation = effectiveStats.lunarChargedElevation ?? 0;
          specificFlatDmg = effectiveStats.lunarChargedFlatDmg ?? 0;
          lunarLabel = "Lunar-Charged DMG Bonus";
        } else if (h.lunarType === "lunar-bloom") {
          specificDmgBonus = effectiveStats.lunarBloomDmgBonus ?? 0;
          specificElevation = effectiveStats.lunarBloomElevation ?? 0;
          specificFlatDmg = effectiveStats.lunarBloomFlatDmg ?? 0;
          lunarLabel = "Lunar-Bloom DMG Bonus";
        } else if (h.lunarType === "lunar-crystallize") {
          specificDmgBonus = effectiveStats.lunarCrystallizeDmgBonus ?? 0;
          specificElevation = effectiveStats.lunarCrystallizeElevation ?? 0;
          specificFlatDmg = effectiveStats.lunarCrystallizeFlatDmg ?? 0;
          lunarLabel = "Lunar-Crystallize DMG Bonus";
        }

        const totalLunarDmgBonus = dr.reactionBonusPct + specificDmgBonus;
        const totalFlatIncrease = totalIncrease + specificFlatDmg;
        const elevationPct = specificElevation;

        const coeff = dr.coefficient ?? (h.lunarType ? LUNAR_DIRECT_MULTIPLIER[h.lunarType] : 1) ?? 1;
        const coeffFactorStr = coeff !== 1 ? ` * ${coeff}` : "";
        const coeffStr = `${fmtPct(mult)}`;
        const baseTransStr = `(Base Transformative Multiplier ${fmtPct(100 + emBonusPct)}${totalLunarDmgBonus > 0 ? ` + Total ${lunarLabel} ${fmtPct(totalLunarDmgBonus)}` : ""})`;
        const baseBonusStr = dr.baseDmgBonusPct > 0 ? ` * (100% + Total Lunar Base DMG Multiplier ${fmtPct(dr.baseDmgBonusPct)})` : "";
        const flatStr = totalFlatIncrease > 0 ? ` + Total Lunar DMG Increase ${fmt(totalFlatIncrease)}` : "";

        basePart = `(${coeffStr} * Total ${statName} ${fmt(statVal)}${coeffFactorStr} * ${baseTransStr}${baseBonusStr}${flatStr})`;
        if (elevationPct > 0) {
          specialPart = ` * (100% + Total Lunar Special DMG Bonus ${fmtPct(elevationPct)})`;
        }
      } else if (h.direct === "stellar") {
        const dr = directRx ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 };
        const emBonusPct = stellarEmBonus(effectiveStats.em) * 100;
        const coeff = dr.coefficient ?? (h.stellarType ? STELLAR_DIRECT_COEFFICIENT[h.stellarType] : 1) ?? 1;
        const coeffFactorStr = coeff !== 1 ? ` * ${coeff}` : "";
        const baseBonusStr = dr.baseDmgBonusPct > 0 ? ` * (100% + Stellar Base DMG Multiplier ${fmtPct(dr.baseDmgBonusPct)})` : "";
        const rxBonusStr = dr.reactionBonusPct > 0 ? ` + Stellar Reaction Bonus ${fmtPct(dr.reactionBonusPct)}` : "";
        basePart = `(${fmtPct(mult)} * Total ${statName} ${fmt(statVal)}${coeffFactorStr}${totalIncrease > 0 ? ` + Total DMG Increase ${fmt(totalIncrease)}` : ""}) * (Base Transformative Multiplier ${fmtPct(100 + emBonusPct)}${rxBonusStr})${baseBonusStr}`;
      } else if (h.direct) {
        const dr = directRx ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 };
        const emBonusPct = stellarEmBonus(effectiveStats.em) * 100;
        const coeff = dr.coefficient ?? 1;
        const coeffFactorStr = coeff !== 1 ? ` * ${coeff}` : "";
        const baseBonusStr = dr.baseDmgBonusPct > 0 ? ` * (100% + Lunar Base DMG Bonus ${fmtPct(dr.baseDmgBonusPct)})` : "";
        const rxBonusStr = dr.reactionBonusPct > 0 ? ` + Reaction Bonus ${fmtPct(dr.reactionBonusPct)}` : "";
        basePart = `(${fmtPct(mult)} * Total ${statName} ${fmt(statVal)}${coeffFactorStr}${totalIncrease > 0 ? ` + Total DMG Increase ${fmt(totalIncrease)}` : ""}) * (Base Transformative Multiplier ${fmtPct(100 + emBonusPct)}${rxBonusStr})${baseBonusStr}`;
      } else {
        basePart = `(${fmtPct(mult)} * Total ${statName} ${fmt(statVal)}${totalIncrease > 0 ? ` + Total DMG Increase ${fmt(totalIncrease)}` : ""}) * (100% + Total DMG Bonus ${fmtPct(totalDmgBonusPct)})`;
      }
      const defResPart = `${h.direct ? "" : ` * Enemy DEF Multiplier ${fmtPct(defMult * 100)}`}${specialPart} * ${formatResMultiplier(targetRes, elem)}`;

      const mainFormulaNonCrit = `${h.name} ${fmt(hitRes.nonCrit)} = ${basePart}${defResPart}`;
      const mainFormulaCrit = `${h.name} ${fmt(hitRes.crit)} = ${basePart} * (100% + Total Crit DMG ${fmtPct(effectiveCritDmg)})${defResPart}`;
      const mainFormulaAvg = `${h.name} ${fmt(hitRes.avg)} = ${basePart} * (100% + Total Crit Rate ${fmtPct(effectiveCritRate)} * Total Crit DMG ${fmtPct(effectiveCritDmg)})${defResPart}`;
      const mainFormula = mainFormulaCrit;

      // Sub breakdowns with source references
      const subBreakdowns: string[] = [];

      // 1. Stat breakdown (ATK/HP/DEF/EM)
      if (h.scaling === "atk") {
        const charAtk = (config.stats.find(s => s.key === "atk") as any)?.baseDefault ?? 342.03;
        const weaponAtk = Math.max(0, baseAtk - charAtk);
        const mechAtkAdds = mech.statBuffSources?.["atk"] ?? [];
        
        // Extract team ATK% and flat ATK sources if present
        const teamAtkBuffs = [...mechAtkAdds.filter(a => a.source.toLowerCase().includes("team") || a.source.toLowerCase().includes("bennett") || a.source.toLowerCase().includes("xilonen") || a.source.toLowerCase().includes("kazuha"))];
        if (teamResult) {
          for (const s of teamResult.sources) {
            if (s.stat === "atk") teamAtkBuffs.push({ source: s.supportName, value: s.value });
          }
        }
        if (weaponResult) {
          for (const s of weaponResult.sources) {
            if (s.stat === "atk") teamAtkBuffs.push({ source: s.weaponName, value: s.value });
          }
        }
        if (artifactResult) {
          for (const s of artifactResult.sources) {
            if (s.stat === "atk") teamAtkBuffs.push({ source: s.artifactName, value: s.value });
          }
        }

        const teamAtkPctSum = teamAtkBuffs.filter(a => a.source.toLowerCase().includes("%") || (a.value < 100 && !a.source.toLowerCase().includes("flat"))).reduce((acc, c) => acc + c.value, 0);
        const flatAtkBuffs = teamAtkBuffs.filter(a => a.value >= 100 || a.source.toLowerCase().includes("flat"));
        const flatAtkSum = flatAtkBuffs.reduce((acc, c) => acc + c.value, 0);

        const atkPctTerms: string[] = [];
        if (atkPct > 0) atkPctTerms.push(`Art. ATK ${fmtPct(atkPct)}`);
        if (teamAtkPctSum > 0) atkPctTerms.push(`Team ATK ${fmtPct(teamAtkPctSum)}`);

        let atkPctExpr = atkPctTerms.length > 0 ? ` * (100% + ${atkPctTerms.join(" + ")})` : "";
        let flatAtkExpr = atkFlat > 0 ? ` + Art. ATK ${fmt(atkFlat)}` : "";
        if (flatAtkBuffs.length > 0) {
          flatAtkExpr += flatAtkBuffs.map(b => ` + ATK (${b.source}) ${fmt(b.value)}`).join("");
        } else if (flatAtkSum > 0) {
          flatAtkExpr += ` + Buffs ${fmt(flatAtkSum)}`;
        }

        subBreakdowns.push(`Total ATK ${fmt(effectiveStats.atk)} = Base ATK ${fmt(baseAtk)}${atkPctExpr}${flatAtkExpr}`);
        subBreakdowns.push(`Base ATK ${fmt(baseAtk)} = Char. ATK ${fmt(charAtk, 2)} + Weapon ATK ${fmt(weaponAtk, 2)}`);

        if (teamAtkBuffs.length > 0 && teamAtkPctSum > 0) {
          subBreakdowns.push(`Team ATK ${fmtPct(teamAtkPctSum)} = ${teamAtkBuffs.filter(a => a.source.toLowerCase().includes("%") || (a.value < 100 && !a.source.toLowerCase().includes("flat"))).map(b => `ATK (${b.source}) ${fmtPct(b.value)}`).join(" + ")}`);
        }
      } else if (h.scaling === "hp") {
        subBreakdowns.push(`Total HP ${fmt(effectiveStats.hp)} = Base HP ${fmt(baseHp)} * (100% + HP ${fmtPct(hpPct)}) + Flat HP ${fmt(hpFlat)}`);
      } else if (h.scaling === "def") {
        subBreakdowns.push(`Total DEF ${fmt(effectiveStats.def)} = Base DEF ${fmt(baseDef)} * (100% + DEF ${fmtPct(defPct)}) + Flat DEF ${fmt(defFlat)}`);
      } else if (h.scaling === "em") {
        subBreakdowns.push(`Total EM ${fmt(effectiveStats.em)} = Base EM ${fmt(inputStats.em)}`);
      }

      // 2. DMG Increase breakdown
      if (totalIncrease > 0) {
        if (config.id === "arlecchino" && flatIncrease > 0 && (h.hitCategory === "normal" || g.type === "normal")) {
          const bolPct = parsedInputs["bond-of-life"] ?? 100;
          const effNaLvl = effectiveTalentLevels(config, scaling, inst.levels, inst.constellationLevel, inst.mechanicInputs)["normal"] ?? 10;
          const baseMasque = scaling.normal?.byLevel[effNaLvl]?.["masque-increase"] ?? 238;
          const c1Bonus = inst.constellationLevel >= 1 ? 100 : 0;
          
          subBreakdowns.push(`Total DMG Increase ${fmt(totalIncrease)} = Total Normal Att. DMG Increase ${fmt(totalIncrease)}`);
          if (c1Bonus > 0) {
            subBreakdowns.push(`Total Normal Att. DMG Increase ${fmt(totalIncrease)} = ${fmtPct(baseMasque)} * Total ATK ${fmt(effectiveStats.atk)} * ${bolPct}% + ${fmtPct(c1Bonus)} (C1) * Total ATK ${fmt(effectiveStats.atk)} * ${bolPct}%`);
          } else {
            subBreakdowns.push(`Total Normal Att. DMG Increase ${fmt(totalIncrease)} = ${fmtPct(baseMasque)} * Total ATK ${fmt(effectiveStats.atk)} * ${bolPct}%`);
          }
        } else {
          subBreakdowns.push(`Total DMG Increase ${fmt(totalIncrease)} = ${flatIncrease > 0 ? `Flat DMG Bonus ${fmt(flatIncrease)}` : ""}${catAdd > 0 ? `${flatIncrease > 0 ? " + " : ""}Aggravate Catalyze DMG ${fmt(catAdd)}` : ""}`);
        }
      }

      // 3. DMG Bonus breakdown
      if (h.direct) {
        const dr = mods.directReaction ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 };
        const emBonusPct = stellarEmBonus(effectiveStats.em) * 100;
        subBreakdowns.push(`Base Transformative Multiplier ${fmtPct(100 + emBonusPct)} = 100% + 6 * Total EM ${fmt(effectiveStats.em)} / (Total EM ${fmt(effectiveStats.em)} + 2000)`);
        if (dr.baseDmgBonusPct > 0 || lunarBaseFromTeam > 0) {
          const totalLunarBase = dr.baseDmgBonusPct + lunarBaseFromTeam;
          let charBaseFormula = "";
          if (config.id === "flins" || config.id === "ineffa") {
            charBaseFormula = `Min(0.7% * (Total ATK ${fmt(effectiveStats.atk)} / 100), 14%)`;
          } else if (config.id === "zibai") {
            charBaseFormula = `Min(0.7% * (Total DEF ${fmt(effectiveStats.def)} / 100), 14%)`;
          } else if (config.id === "columbina") {
            charBaseFormula = `Min(0.2% * (Total HP ${fmt(effectiveStats.hp)} / 1000), 7%)`;
          } else if (h.scaling === "atk") {
            charBaseFormula = `Min(0.7% * (Total ATK ${fmt(effectiveStats.atk)} / 100), 14%)`;
          } else if (h.scaling === "def") {
            charBaseFormula = `Min(0.7% * (Total DEF ${fmt(effectiveStats.def)} / 100), 14%)`;
          } else {
            charBaseFormula = `Min(0.2% * (Total HP ${fmt(effectiveStats.hp)} / 1000), 7%)`;
          }

          if (lunarBaseFromTeam > 0) {
            subBreakdowns.push(`Total Lunar Base DMG Multiplier ${fmtPct(totalLunarBase)} = Lunar Base DMG (${config.name}) ${fmtPct(dr.baseDmgBonusPct)} + Team Lunar Base DMG ${fmtPct(lunarBaseFromTeam)}`);
            subBreakdowns.push(`Lunar Base DMG (${config.name}) ${fmtPct(dr.baseDmgBonusPct)} = ${charBaseFormula}`);
            if (teamResult) {
              const teamMoonsignSources = teamResult.sources.filter(s => s.stat === "lunarBaseBonusPct");
              if (teamMoonsignSources.length > 0) {
                subBreakdowns.push(`Team Lunar Base DMG ${fmtPct(lunarBaseFromTeam)} = ${teamMoonsignSources.map(s => `Lunar Base DMG (${s.supportName}) ${fmtPct(s.value)}`).join(" + ")}`);
              }
            }
          } else {
            subBreakdowns.push(`Lunar Base DMG Bonus ${fmtPct(dr.baseDmgBonusPct)} = ${charBaseFormula}`);
          }
        }
      } else {
        const isSpecial = catKey === "special";
        const bonusParts: string[] = [];
        if (commonBonus > 0) bonusParts.push(`Total Common DMG Bonus ${fmtPct(commonBonus)}`);
        if (categoryBonus > 0 && !isSpecial) bonusParts.push(`Total ${g.type === "normal" ? "Normal Att." : g.type.toUpperCase()} DMG Bonus ${fmtPct(categoryBonus)}`);
        if (elementBonus > 0) bonusParts.push(`Total ${elem} DMG Bonus ${fmtPct(elementBonus)}`);
        if (extraBonus > 0) bonusParts.push(`Extra Hit Bonus ${fmtPct(extraBonus)}`);

        subBreakdowns.push(`Total DMG Bonus ${fmtPct(totalDmgBonusPct)} = ${bonusParts.length > 0 ? bonusParts.join(" + ") : "0%"}${isSpecial ? " (Independent Special Hit)" : ""}`);
        if (commonBonus > 0) {
          subBreakdowns.push(`Total Common DMG Bonus ${fmtPct(commonBonus)} = Common DMG Bonus ${fmtPct(commonBonus)}`);
        }
        if (categoryBonus > 0 && !isSpecial) {
          subBreakdowns.push(`Total ${g.type === "normal" ? "Normal Att." : g.type.toUpperCase()} DMG Bonus ${fmtPct(categoryBonus)} = ${g.type === "normal" ? "Normal Att." : g.type.toUpperCase()} DMG Bonus ${fmtPct(categoryBonus)}`);
        }
        if (elementBonus > 0) {
          subBreakdowns.push(`Total ${elem} DMG Bonus ${fmtPct(elementBonus)} = ${elem} DMG Bonus ${fmtPct(elementBonus)}`);
        }
      }

      // 4. CRIT Rate & CRIT DMG breakdown
      const initialCritRate = toNum(inst.stats["critRate"]) ?? 5;
      const initialCritDmg = toNum(inst.stats["critDmg"]) ?? 50;

      const crBuffs: { source: string; value: number }[] = [];
      if (mods.critRateBonusPct) {
        crBuffs.push({ source: `${h.name} Bonus`, value: mods.critRateBonusPct });
      }
      if (artifactResult) {
        for (const s of artifactResult.sources) {
          if (s.stat === "critRate") crBuffs.push({ source: s.artifactName, value: s.value });
        }
      }
      if (weaponResult) {
        for (const s of weaponResult.sources) {
          if (s.stat === "critRate") crBuffs.push({ source: s.weaponName, value: s.value });
        }
      }
      if (teamResult) {
        for (const s of teamResult.sources) {
          if (s.stat === "critRate") crBuffs.push({ source: s.supportName, value: s.value });
        }
      }
      if (mech.statDeltas.critRate) {
        crBuffs.push({ source: config.name, value: mech.statDeltas.critRate });
      }
      const talentCatName = hitCat === "normal" ? "Normal Attack" : hitCat === "charged" ? "Charged Attack" : hitCat === "plunge" ? "Plunging Attack" : hitCat === "skill" ? "Elemental Skill" : "Elemental Burst";
      if (elementalCritRate > 0) {
        crBuffs.push({ source: `${elem} CRIT Rate`, value: elementalCritRate });
      }
      if (talentCritRate > 0) {
        crBuffs.push({ source: `${talentCatName} CRIT Rate`, value: talentCritRate });
      }

      const crTerms = [`Initial Crit Rate ${fmtPct(initialCritRate)}`];
      for (const b of crBuffs) {
        crTerms.push(`Crit Rate (${b.source}) ${fmtPct(b.value)}`);
      }
      const crInner = crTerms.length === 1 ? crTerms[0] : crTerms.join(" + ");
      subBreakdowns.push(`Total Crit Rate ${fmtPct(effectiveCritRate)} = Max(Min((${crInner}), 100%), 0%)`);

      const cdBuffs: { source: string; value: number }[] = [];
      if (mods.critDmgBonusPct) {
        cdBuffs.push({ source: `${h.name} Bonus`, value: mods.critDmgBonusPct });
      }
      if (artifactResult) {
        for (const s of artifactResult.sources) {
          if (s.stat === "critDmg") cdBuffs.push({ source: s.artifactName, value: s.value });
        }
      }
      if (weaponResult) {
        for (const s of weaponResult.sources) {
          if (s.stat === "critDmg") cdBuffs.push({ source: s.weaponName, value: s.value });
        }
      }
      if (teamResult) {
        for (const s of teamResult.sources) {
          if (s.stat === "critDmg") cdBuffs.push({ source: s.supportName, value: s.value });
        }
      }
      if (mech.statDeltas.critDmg) {
        cdBuffs.push({ source: config.name, value: mech.statDeltas.critDmg });
      }
      if (elementalCritDmg > 0) {
        cdBuffs.push({ source: `${elem} CRIT DMG`, value: elementalCritDmg });
      }
      if (talentCritDmg > 0) {
        cdBuffs.push({ source: `${talentCatName} CRIT DMG`, value: talentCritDmg });
      }

      const cdTerms = [`Initial Crit DMG ${fmtPct(initialCritDmg)}`];
      for (const b of cdBuffs) {
        cdTerms.push(`Crit DMG (${b.source}) ${fmtPct(b.value)}`);
      }
      subBreakdowns.push(`Total Crit DMG ${fmtPct(effectiveCritDmg)} = ${cdTerms.join(" + ")}`);

      // 5. DEF Multiplier breakdown
      if (!h.direct) {
        subBreakdowns.push(`Enemy DEF Multiplier ${fmtPct(defMult * 100)} = Min(100%, ((Char. Level ${effectiveStats.levelChar} + 100) / (Char. Level ${effectiveStats.levelChar} + 100 + (Enemy Level ${effectiveStats.levelEnemy} + 100))))`);
      }

      // 6. RES Multiplier breakdown
      const baseEnemyRes = toNum(inst.stats["enemyRes"]) ?? 10;
      const resDiff = targetRes - baseEnemyRes;
      if (Math.abs(resDiff) > 0.001) {
        subBreakdowns.push(`Total Enemy ${elem} DMG RES ${fmtPct(targetRes)} = Base Enemy ${elem} DMG RES ${fmtPct(baseEnemyRes)} + Debuff/Buff RES ${fmtPct(resDiff)}`);
      } else {
        subBreakdowns.push(`Total Enemy ${elem} DMG RES ${fmtPct(targetRes)} = Base Enemy ${elem} DMG RES ${fmtPct(targetRes)}`);
      }

      breakdowns.push({
        id: `hit-${id}`,
        hitName: h.name,
        category: g.type,
        element: elem,
        reaction: effectiveReaction,
        multiplierPct: mult,
        scalingSource: h.scaling,
        nonCrit: hitRes.nonCrit,
        crit: hitRes.crit,
        avg: hitRes.avg,
        mainFormula,
        mainFormulaNonCrit,
        mainFormulaCrit,
        mainFormulaAvg,
        subBreakdowns,
      });
    });
  });

  // 2. Process Transformative Reactions
  const transformativeList = TRANSFORMATIVE_BY_ELEMENT[config.element] ?? [];
  transformativeList.forEach(tType => {
    const dmg = transformativeDamage(
      tType,
      effectiveStats.levelChar,
      effectiveStats.em,
      effectiveStats.enemyRes,
      toNum(inst.reactionPanelBonus) ?? 0
    );

    const label = TRANSFORMATIVE_LABEL[tType];
    const emBonusPct = ((16 * effectiveStats.em) / (effectiveStats.em + 2000)) * 100;
    const panelBonusPct = toNum(inst.reactionPanelBonus) ?? 0;
    const totalBonusPct = emBonusPct + panelBonusPct;
    const resMult = resMultiplier(effectiveStats.enemyRes);
    const resFormulaStr = effectiveStats.enemyRes < 0
      ? `(100% - Enemy RES ${fmtPct(effectiveStats.enemyRes)} / 2)`
      : effectiveStats.enemyRes <= 75
        ? `(100% - Enemy RES ${fmtPct(effectiveStats.enemyRes)})`
        : `(1 / (4 * Enemy RES ${fmtPct(effectiveStats.enemyRes)} + 1))`;

    const mainFormula = `${label} DMG ${fmt(dmg)} = Base Reaction Scaling * (100% + Reaction Bonus ${fmtPct(totalBonusPct)}) * Enemy RES Multiplier ${fmtPct(resMult * 100)}`;
    const subBreakdowns = [
      `Reaction Bonus ${fmtPct(totalBonusPct)} = EM Bonus ${fmtPct(emBonusPct)} + Panel Bonus ${fmtPct(panelBonusPct)}`,
      `EM Bonus ${fmtPct(emBonusPct)} = (16 * EM ${fmt(effectiveStats.em)}) / (EM + 2000)`,
      `Enemy RES Multiplier ${fmtPct(resMult * 100)} = ${resFormulaStr}`,
    ];

    breakdowns.push({
      id: `tr-${tType}`,
      hitName: `${label} Reaction`,
      category: "transformative",
      element: config.element,
      reaction: "none",
      multiplierPct: 0,
      scalingSource: "em",
      nonCrit: dmg,
      crit: dmg,
      avg: dmg,
      mainFormula,
      subBreakdowns,
    });
  });

  // 3. Process Indirect Lunar Reactions
  const lunarList = LUNAR_BY_ELEMENT[config.element] ?? [];
  lunarList.forEach(lType => {
    const res = indirectLunarDamage(
      lType,
      effectiveStats,
      (toNum(inst.lunarBaseBonus) ?? 0) + (mech.lunarBaseBonusPct ?? 0) + lunarBaseFromTeam,
      toNum(inst.reactionPanelBonus) ?? 0
    );

    const label = LUNAR_LABEL[lType];
    const emBonus = stellarEmBonus(effectiveStats.em);
    const crRatio = res.benchmarkCritRate ?? effectiveStats.critRate;
    const cdRatio = res.benchmarkCritDmg ?? effectiveStats.critDmg;
    const mainFormula = `${label} DMG ${fmt(res.avg)} = Base Lunar DMG * (100% + EM Bonus ${fmtPct(emBonus * 100)}) * (100% + Benchmark Crit Rate ${fmtPct(crRatio)} * Benchmark Crit DMG ${fmtPct(cdRatio)}) * Enemy RES Multiplier`;
    const subBreakdowns = [
      `Normalized Multi-Contributor DMG = 0.60 * D1 + 0.30 * D2 + 0.05 * D3 + 0.05 * D4`,
      `Capacity Active: ${res.contributorCount ?? 1} contributor(s) (${res.contributorCount === 1 ? "60%" : res.contributorCount === 2 ? "90%" : res.contributorCount === 3 ? "95%" : "100%"} capacity)`,
      `Benchmark CRIT: Highest individual contributor (D1) CRIT ratio (${fmtPct(crRatio)} / ${fmtPct(cdRatio)})`,
      `EM Bonus ${fmtPct(emBonus * 100)} = (6 * EM ${fmt(effectiveStats.em)}) / (EM + 2000)`,
      `Non-Crit DMG: ${fmt(res.nonCrit)} | Crit DMG: ${fmt(res.crit)} | Average DMG: ${fmt(res.avg)}`,
    ];

    breakdowns.push({
      id: `lunar-${lType}`,
      hitName: `${label} Reaction`,
      category: "lunar",
      element: config.element,
      reaction: "none",
      multiplierPct: 0,
      scalingSource: "em",
      nonCrit: res.nonCrit,
      crit: res.crit,
      avg: res.avg,
      mainFormula,
      subBreakdowns,
    });
  });

  // 3.5 Process Stellar Glimmer Reactions
  const stellarList = STELLAR_BY_ELEMENT[config.element] ?? [];

  if (stellarList.includes("stellar-swirl")) {
    const variants: StellarSwirlVariant[] = ["initial", "vortex-lv1", "vortex-lv2"];
    variants.forEach(variant => {
      const res = indirectStellarDamage(
        variant,
        effectiveStats,
        stellarBaseTotal,
        stellarPanelTotal,
      );
      const label = STELLAR_SWIRL_VARIANT_LABEL[variant];
      const coeff = STELLAR_INDIRECT_COEFFICIENT[variant];
      const emBonus = stellarEmBonus(effectiveStats.em);
      const elem: Element | "Physical" = variant === "initial" ? "Anemo" : "Cryo";
      const crRatio = res.benchmarkCritRate ?? effectiveStats.critRate;
      const cdRatio = res.benchmarkCritDmg ?? effectiveStats.critDmg;

      const mainFormula = `${label} DMG ${fmt(res.avg)} = Coeff ${coeff.toFixed(2)} * LevelMult * (100% + Base Bonus ${fmtPct(stellarBaseTotal)}) * (100% + EM Bonus ${fmtPct(emBonus * 100)}) * Benchmark Crit * Enemy RES Multiplier`;
      const subBreakdowns = [
        `Normalized Multi-Contributor DMG = 0.60 * D1 + 0.30 * D2 + 0.05 * D3 + 0.05 * D4`,
        `Base Reaction Coefficient: ${coeff.toFixed(2)} (${variant === "initial" ? "Initial Anemo" : variant === "vortex-lv1" ? "Lv. 1 Vortex Cryo AoE" : "Lv. 2 Vortex Cryo AoE"})`,
        `Capacity Active: ${res.contributorCount ?? 1} contributor(s) (${res.contributorCount === 1 ? "60%" : res.contributorCount === 2 ? "90%" : res.contributorCount === 3 ? "95%" : "100%"} capacity)`,
        `Benchmark CRIT: Highest individual contributor (D1) CRIT ratio (${fmtPct(crRatio)} / ${fmtPct(cdRatio)})`,
        `EM Bonus ${fmtPct(emBonus * 100)} = (6 * EM ${fmt(effectiveStats.em)}) / (EM + 2000)`,
        `Non-Crit DMG: ${fmt(res.nonCrit)} | Crit DMG: ${fmt(res.crit)} | Average DMG: ${fmt(res.avg)}`,
      ];

      breakdowns.push({
        id: `stellar-${variant}`,
        hitName: label,
        category: "stellar",
        element: elem as Element,
        reaction: "none",
        multiplierPct: coeff * 100,
        scalingSource: "em",
        nonCrit: res.nonCrit,
        crit: res.crit,
        avg: res.avg,
        mainFormula,
        subBreakdowns,
      });
    });
  }

  // 4. Add Received Team Buffs Section
  const teamBuffsLines: string[] = [];
  const atkBuffs = (mech.statBuffSources?.["atk"] ?? []);
  if (atkBuffs.length > 0) {
    const teamAtkPctSum = atkBuffs.filter(a => a.source.toLowerCase().includes("%") || a.value < 100).reduce((acc, c) => acc + c.value, 0);
    if (teamAtkPctSum > 0) {
      teamBuffsLines.push(`Team ATK ${fmtPct(teamAtkPctSum)} = ${atkBuffs.map(b => `ATK (${b.source}) ${fmtPct(b.value)}`).join(" + ")}`);
    }
  }

  const emBuffs = (mech.statBuffSources?.["em"] ?? []);
  if (emBuffs.length > 0) {
    const emSum = emBuffs.reduce((acc, c) => acc + c.value, 0);
    teamBuffsLines.push(`Team Elemental Mastery ${fmt(emSum)} = ${emBuffs.map(b => `Elemental Mastery (${b.source}) ${fmt(b.value)}`).join(" + ")}`);
  }

  const dmgBonusBuffs = (mech.statBuffSources?.["dmgBonus"] ?? []);
  if (dmgBonusBuffs.length > 0) {
    const totalDmgBonusSum = dmgBonusBuffs.reduce((acc, c) => acc + c.value, 0);
    teamBuffsLines.push(`Team ${config.element} DMG Bonus ${fmtPct(totalDmgBonusSum)} = ${dmgBonusBuffs.map(b => `${config.element} DMG Bonus (${b.source}) ${fmtPct(b.value)}`).join(" + ")}`);
  }

  const resBuffs = (mech.statBuffSources?.["enemyRes"] ?? []);
  if (resBuffs.length > 0) {
    const resShredSum = resBuffs.reduce((acc, c) => acc + c.value, 0);
    teamBuffsLines.push(`Team Enemy ${config.element} DMG RES ${fmtPct(-resShredSum)} = ${resBuffs.map(b => `Enemy ${config.element} DMG RES (${b.source}) ${fmtPct(-b.value)}`).join(" + ")}`);
  }

  // Add team support, external weapon, and external artifact buff sources
  const allBuffSources: { name: string; label: string; stat: string; value: number }[] = [];
  if (teamResult && teamResult.sources.length > 0) {
    for (const s of teamResult.sources) {
      allBuffSources.push({ name: s.supportName, label: s.label, stat: s.stat, value: s.value });
    }
  }
  if (weaponResult && weaponResult.sources.length > 0) {
    for (const s of weaponResult.sources) {
      allBuffSources.push({ name: s.weaponName, label: s.label, stat: s.stat, value: s.value });
    }
  }
  if (artifactResult && artifactResult.sources.length > 0) {
    for (const s of artifactResult.sources) {
      allBuffSources.push({ name: s.artifactName, label: s.label, stat: s.stat, value: s.value });
    }
  }

  if (allBuffSources.length > 0) {
    // Group by stat
    const byStatMap = new Map<string, { stat: string; sources: { name: string; label: string; value: number }[] }>();
    for (const s of allBuffSources) {
      const existing = byStatMap.get(s.stat);
      if (existing) {
        existing.sources.push({ name: s.name, label: s.label, value: s.value });
      } else {
        byStatMap.set(s.stat, { stat: s.stat, sources: [{ name: s.name, label: s.label, value: s.value }] });
      }
    }
    for (const [stat, group] of byStatMap) {
      const isFlat = stat === "em" || stat === "atk" || stat === "hp" || stat === "def";
      const total = group.sources.reduce((acc, s) => acc + s.value, 0);
      const fmtVal = isFlat ? fmt(total) : fmtPct(total);
      const parts = group.sources.map(s => `${s.label} ${isFlat ? fmt(s.value) : fmtPct(s.value)}`);
      const statLabel = stat === "em" ? "Elemental Mastery" 
        : stat === "lunarChargedDmgBonus" ? "Lunar-Charged DMG Bonus" 
        : stat === "lunarBaseBonusPct" ? "Lunar Base DMG"
        : stat === "normalDmgBonus" ? "Normal Attack DMG Bonus"
        : stat === "chargedDmgBonus" ? "Charged Attack DMG Bonus"
        : stat === "plungeDmgBonus" ? "Plunging Attack DMG Bonus"
        : stat === "dmgBonus" ? "All DMG Bonus"
        : stat.charAt(0).toUpperCase() + stat.slice(1);
      teamBuffsLines.push(`Team ${statLabel} ${fmtVal} = ${parts.join(" + ")}`);
    }
  }


  if (teamBuffsLines.length > 0) {
    breakdowns.push({
      id: "received-team-buffs",
      hitName: "Received Team Buffs",
      category: "team-buffs",
      element: config.element,
      reaction: "none",
      multiplierPct: 0,
      scalingSource: "none",
      nonCrit: 0,
      crit: 0,
      avg: 0,
      mainFormula: "Received Team Buffs Summary",
      subBreakdowns: teamBuffsLines,
    });
  }

  return breakdowns;
}

const AMP_BASE: Record<Element, Partial<Record<ReactionType, number>>> = {
  Pyro: { vaporize: 1.5, melt: 2.0 },
  Hydro: { vaporize: 2.0 },
  Cryo: { melt: 1.5 },
  Electro: {},
  Anemo: {},
  Geo: {},
  Dendro: {},
};

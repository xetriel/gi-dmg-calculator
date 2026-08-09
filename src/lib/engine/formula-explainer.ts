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
} from "./validation";
import { resolveMechanics } from "./mechanics";
import { levelMultiplier } from "./level-multiplier";
import { transformativeDamage, TRANSFORMATIVE_BY_ELEMENT, TRANSFORMATIVE_LABEL } from "./transformative";
import { indirectLunarDamage, LUNAR_BY_ELEMENT, LUNAR_LABEL } from "./lunar";
import { activeEffects, constellationFlatBonus, constellationStatBonuses } from "./constellations";
import { resolveTeamBuffs } from "./team-buffs";

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
    const rawVal = inst.mechanicInputs?.[m.id];
    parsedInputs[m.id] = toNum(rawVal) ?? (m.defaultValue ?? 0);
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
  const teamResult = (inst.teamBuffsEnabled !== false && inst.teamSupports?.length)
    ? resolveTeamBuffs(inst.teamSupports, true)
    : null;
  if (teamResult) {
    for (const [key, val] of Object.entries(teamResult.statDeltas)) {
      if (key in effectiveStats && typeof val === "number") {
        (effectiveStats as unknown as Record<string, number>)[key] += val;
      }
    }
    lunarBaseFromTeam = teamResult.lunarBaseBonusPct;
  }

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
        directReaction: h.direct ? mods.directReaction ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 } : undefined,
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

      // CRIT Rate & CRIT DMG
      const effectiveCritRate = Math.min(Math.max(effectiveStats.critRate + (mods.critRateBonusPct ?? 0), 0), 100);
      const effectiveCritDmg = effectiveStats.critDmg + (mods.critDmgBonusPct ?? 0);
      const critMult = 1 + effectiveCritDmg / 100;

      // DEF & RES multipliers
      const defMult = defMultiplier(effectiveStats, mods.defIgnorePct);
      const resMult = resMultiplier(effectiveStats.enemyRes);
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

        const coeffStr = `${fmtPct(mult)}`;
        const baseTransStr = `(Base Transformative Multiplier ${fmtPct(100 + emBonusPct)}${totalLunarDmgBonus > 0 ? ` + Total ${lunarLabel} ${fmtPct(totalLunarDmgBonus)}` : ""})`;
        const baseBonusStr = dr.baseDmgBonusPct > 0 ? ` * (100% + Total Lunar Base DMG Multiplier ${fmtPct(dr.baseDmgBonusPct)})` : "";
        const flatStr = totalFlatIncrease > 0 ? ` + Total Lunar DMG Increase ${fmt(totalFlatIncrease)}` : "";

        basePart = `(${coeffStr} * Total ${statName} ${fmt(statVal)} * ${baseTransStr}${baseBonusStr}${flatStr})`;
        if (elevationPct > 0) {
          specialPart = ` * (100% + Total Lunar Special DMG Bonus ${fmtPct(elevationPct)})`;
        }
      } else if (h.direct) {
        const dr = mods.directReaction ?? { coefficient: 1, baseDmgBonusPct: 0, reactionBonusPct: 0 };
        const emBonusPct = stellarEmBonus(effectiveStats.em) * 100;
        const coeffStr = dr.coefficient !== 1 ? `${dr.coefficient} * ` : "";
        const baseBonusStr = dr.baseDmgBonusPct > 0 ? ` * (100% + Lunar Base DMG Bonus ${fmtPct(dr.baseDmgBonusPct)})` : "";
        const rxBonusStr = dr.reactionBonusPct > 0 ? ` + Reaction Bonus ${fmtPct(dr.reactionBonusPct)}` : "";
        basePart = `(${coeffStr}${fmtPct(mult)} * Total ${statName} ${fmt(statVal)}${totalIncrease > 0 ? ` + Total DMG Increase ${fmt(totalIncrease)}` : ""}) * (Base Transformative Multiplier ${fmtPct(100 + emBonusPct)}${rxBonusStr})${baseBonusStr}`;
      } else {
        basePart = `(${fmtPct(mult)} * Total ${statName} ${fmt(statVal)}${totalIncrease > 0 ? ` + Total DMG Increase ${fmt(totalIncrease)}` : ""}) * (100% + Total DMG Bonus ${fmtPct(totalDmgBonusPct)})`;
      }
      const defResPart = `${h.direct ? "" : ` * Enemy DEF Multiplier ${fmtPct(defMult * 100)}`}${specialPart} * (100% - Total Enemy ${elem} DMG RES ${fmtPct(effectiveStats.enemyRes)} / 2)`;

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
        const teamAtkBuffs = mechAtkAdds.filter(a => a.source.toLowerCase().includes("team") || a.source.toLowerCase().includes("bennett") || a.source.toLowerCase().includes("xilonen") || a.source.toLowerCase().includes("kazuha"));
        const teamAtkPctSum = teamAtkBuffs.filter(a => a.source.toLowerCase().includes("%") || a.value < 100).reduce((acc, c) => acc + c.value, 0);
        const flatAtkBuffs = mechAtkAdds.filter(a => a.value >= 100 && !a.source.toLowerCase().includes("%"));
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
          subBreakdowns.push(`Team ATK ${fmtPct(teamAtkPctSum)} = ${teamAtkBuffs.map(b => `ATK (${b.source}) ${fmtPct(b.value)}`).join(" + ")}`);
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
        if (dr.baseDmgBonusPct > 0) {
          subBreakdowns.push(`Lunar Base DMG Bonus ${fmtPct(dr.baseDmgBonusPct)} = Min(0.2% * (Total HP ${fmt(effectiveStats.hp)} / 1000), 7%)`);
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
      const charCritDmg = config.ascensionStat?.label === "CRIT DMG" ? (config.ascensionStat.maxValue ?? 38.4) : 0;
      const charCritRate = config.ascensionStat?.label === "CRIT Rate" ? (config.ascensionStat.maxValue ?? 19.2) : 0;
      const defaultCritRate = 5 + charCritRate;
      const defaultCritDmg = 50 + charCritDmg;

      const artCritRate = Math.max(0, toNum(inst.stats["critRate"]) ?? 0);
      const artCritDmg = Math.max(0, toNum(inst.stats["critDmg"]) ?? 0);

      subBreakdowns.push(`Total Crit Rate ${fmtPct(effectiveCritRate)} = Max(Min((Default Crit Rate ${fmtPct(defaultCritRate)}${artCritRate > 0 ? ` + Art. Crit Rate ${fmtPct(artCritRate)}` : ""}), 100%), 0%)`);
      subBreakdowns.push(`Total Crit DMG ${fmtPct(effectiveCritDmg)} = Default Crit DMG ${fmtPct(defaultCritDmg)}${artCritDmg > 0 ? ` + Art. Crit DMG ${fmtPct(artCritDmg)}` : ""}`);

      // 5. DEF Multiplier breakdown
      if (!h.direct) {
        subBreakdowns.push(`Enemy DEF Multiplier ${fmtPct(defMult * 100)} = Min(100%, ((Char. Level ${effectiveStats.levelChar} + 100) / (Char. Level ${effectiveStats.levelChar} + 100 + (Enemy Level ${effectiveStats.levelEnemy} + 100))))`);
      }

      // 6. RES Multiplier breakdown
      subBreakdowns.push(`Total Enemy ${elem} DMG RES ${fmtPct(effectiveStats.enemyRes)} = Base Enemy ${elem} DMG RES ${fmtPct(effectiveStats.enemyRes)}`);

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

    const mainFormula = `${label} DMG ${fmt(dmg)} = Base Reaction Scaling * (100% + Reaction Bonus ${fmtPct(totalBonusPct)}) * Enemy RES Multiplier ${fmtPct(resMult * 100)}`;
    const subBreakdowns = [
      `Reaction Bonus ${fmtPct(totalBonusPct)} = EM Bonus ${fmtPct(emBonusPct)} + Panel Bonus ${fmtPct(panelBonusPct)}`,
      `EM Bonus ${fmtPct(emBonusPct)} = (16 * EM ${fmt(effectiveStats.em)}) / (EM + 2000)`,
      `Enemy RES Multiplier ${fmtPct(resMult * 100)} = (100% - Enemy RES ${fmtPct(effectiveStats.enemyRes)} / 2)`,
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
    const mainFormula = `${label} DMG ${fmt(res.avg)} = Base Lunar DMG * (100% + EM Bonus ${fmtPct(emBonus * 100)}) * (100% + Crit Rate ${fmtPct(effectiveStats.critRate)} * Crit DMG ${fmtPct(effectiveStats.critDmg)}) * Enemy RES Multiplier`;
    const subBreakdowns = [
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

  // Add team support buff sources
  if (teamResult && teamResult.sources.length > 0) {
    // Group by stat
    const byStatMap = new Map<string, { stat: string; sources: { name: string; label: string; value: number }[] }>();
    for (const s of teamResult.sources) {
      const existing = byStatMap.get(s.stat);
      if (existing) {
        existing.sources.push({ name: s.supportName, label: s.label, value: s.value });
      } else {
        byStatMap.set(s.stat, { stat: s.stat, sources: [{ name: s.supportName, label: s.label, value: s.value }] });
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

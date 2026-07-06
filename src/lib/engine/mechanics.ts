// Fully-computed character mechanics (pure, framework-free).
// The registry's MechanicDefs describe the UI controls; this module owns the math,
// keyed by character id. Constellation interactions that are numeric but bespoke
// (Arlecchino C1/C6, Clorinde C2/C4/C6, Neuvillette C1/C2) also live here — the
// generic ConstellationEffect system stays for simple stat/flat/level effects.
// All formulas are from the saved wiki pages (see scripts/extract-wiki.ts).
import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { DamageStats, DirectReactionParams } from "./damage";
import { stellarBRC, stellarEmBonus, resMultiplier } from "./damage";
import { LUNAR_DIRECT_MULTIPLIER } from "./lunar";

export interface PerHitMods {
  flatDmgBonus?: number;
  baseDmgMultiplier?: number;
  critDmgBonusPct?: number;
  critRateBonusPct?: number;
  bonusDmgPct?: number;
  directReaction?: DirectReactionParams; // Stellar-Conduct / Direct-Lunar hits: routes computeHit into the direct-reaction branch
}

export interface MechanicsResult {
  statDeltas: Partial<DamageStats>; // added onto the resolved stats before computing hits
  perHit: Record<string, PerHitMods>; // keyed by TalentHit.key
  notes: string[]; // computed info lines shown in the UI (e.g. heal amounts, caps hit)
  lunarBaseBonusPct?: number; // auto Lunar Base DMG Bonus (Moonsign passives, e.g. Zibai) — also fed to the indirect lunar panel
}

export interface MechanicsCtx {
  stats: DamageStats;                   // resolved stats, before deltas
  baseAtk: number;                      // the "Base" ATK input (Paramita cap: 400% of it)
  baseDef: number;                      // the "Base" DEF input (Zibai A4: +15% of it per Geo ally)
  constellationLevel: number;           // 0–6
  talentLevels: Record<string, number>; // effective level per talent type (incl. C3/C5 +3)
  scaling: TalentScalingData;           // per-level values incl. buff/heal rows
  inputs: Record<string, number>;       // MechanicDef.id -> value (toggle: 0/1)
}

// Look up a per-level coefficient (damage/buff/heal row) from the scaling data.
function coeff(ctx: MechanicsCtx, talentType: string, hitKey: string): number | undefined {
  const t = ctx.scaling[talentType];
  const lvl = ctx.talentLevels[talentType];
  if (!t || !lvl) return undefined;
  const capped = Math.min(lvl, Math.max(...t.levels));
  return t.byLevel[capped]?.[hitKey];
}

// All damage hit keys of one talent group (used to apply "all Normal Attack" effects).
function hitKeysOf(config: CharacterConfig, type: string): string[] {
  return config.talents.find(g => g.type === type)?.hits.filter(h => h.kind !== "heal").map(h => h.key) ?? [];
}

const addMods = (perHit: Record<string, PerHitMods>, key: string, mods: PerHitMods) => {
  const m = (perHit[key] ??= {});
  if (mods.flatDmgBonus) m.flatDmgBonus = (m.flatDmgBonus ?? 0) + mods.flatDmgBonus;
  if (mods.baseDmgMultiplier) m.baseDmgMultiplier = (m.baseDmgMultiplier ?? 1) * mods.baseDmgMultiplier;
  if (mods.critDmgBonusPct) m.critDmgBonusPct = (m.critDmgBonusPct ?? 0) + mods.critDmgBonusPct;
  if (mods.critRateBonusPct) m.critRateBonusPct = (m.critRateBonusPct ?? 0) + mods.critRateBonusPct;
  if (mods.bonusDmgPct) m.bonusDmgPct = (m.bonusDmgPct ?? 0) + mods.bonusDmgPct;
  if (mods.directReaction) m.directReaction = mods.directReaction; // set once per hit, not accumulated
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export function resolveMechanics(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  switch (config.id) {
    case "hu-tao": {
      // Paramita Papilio: ATK += (skill "ATK Increase (% Max HP)") × Max HP, capped at
      // 400% of Base ATK. Wiki fixed value: cap = 400% Base ATK.
      if (on("paramita")) {
        const pct = coeff(ctx, "skill", "atk-increase") ?? 0;
        const raw = (pct / 100) * stats.hp;
        const cap = 4 * ctx.baseAtk;
        const bonus = Math.min(raw, cap);
        res.statDeltas.atk = (res.statDeltas.atk ?? 0) + bonus;
        res.notes.push(
          `Paramita: +${fmt(bonus)} ATK (${pct}% of Max HP${raw > cap ? ", capped at 400% Base ATK" : ""})`,
        );
      }
      // Sanguine Rouge (A4): ≤50% HP → +33% Pyro DMG Bonus.
      if (on("low-hp")) {
        res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 33;
        res.notes.push("Sanguine Rouge: +33% Pyro DMG Bonus (HP ≤ 50%)");
      }
      break;
    }

    case "arlecchino": {
      const bolPct = val("bond-of-life"); // % of Max HP, 0–200
      // Masque of the Red Death — verbatim wiki formula:
      //   base DMG = ATK × (Talent Multiplier + Masque Increase × BoL/MaxHP)
      // The bonus multiplies the BoL *percentage* (a ratio) by ATK; Max HP cancels
      // out and does NOT scale her damage. C1: Masque Increase +100 pp.
      if (bolPct > 0) {
        let masquePct = coeff(ctx, "normal", "masque-increase") ?? 0;
        if (cons >= 1) masquePct += 100;
        const additive = (masquePct / 100) * (bolPct / 100) * stats.atk;
        for (const key of hitKeysOf(config, "normal")) {
          addMods(res.perHit, key, { flatDmgBonus: additive });
        }
        res.notes.push(
          `Masque: +${fmt(additive)} flat DMG on Normal Attacks (${masquePct}% × ${bolPct}% BoL × ATK${cons >= 1 ? ", C1" : ""})`,
        );
        // Burst heal (fixed formula): 150% Bond of Life + 150% ATK. The heal restores
        // HP, so here the HP-denominated BoL value (BoL% × Max HP) is the right term.
        const heal = 1.5 * ((bolPct / 100) * stats.hp) + 1.5 * stats.atk;
        res.notes.push(`Balemoon Rising heal: ${fmt(heal)} HP (150% BoL + 150% ATK)`);
      }
      // Utility passive "The Balemoon Alone May Know": +40% Pyro DMG Bonus in combat.
      if (on("pyro-bonus")) {
        res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + 40;
        res.notes.push("Balemoon passive: +40% Pyro DMG Bonus (in combat)");
      }
      // C6: Burst DMG += ATK × 700% × BoL%; NA & Burst +10% CRIT Rate / +70% CRIT DMG.
      if (cons >= 6) {
        addMods(res.perHit, "skill-dmg", { flatDmgBonus: 7.0 * (bolPct / 100) * stats.atk });
        for (const key of [...hitKeysOf(config, "normal"), "skill-dmg"]) {
          addMods(res.perHit, key, { critRateBonusPct: 10, critDmgBonusPct: 70 });
        }
        res.notes.push("C6: Burst +700% ATK × BoL%; NA & Burst +10% CRIT Rate / +70% CRIT DMG");
      }
      break;
    }

    case "neuvillette": {
      // Past Draconic Glories: Equitable Judgment deals 110%/125%/160% at 1/2/3 stacks.
      // C1: +1 stack on taking the field (still capped at 3).
      const stacks = Math.min(val("draconic-stacks") + (cons >= 1 ? 1 : 0), 3);
      const mult = [1, 1.1, 1.25, 1.6][stacks];
      if (mult !== 1) {
        addMods(res.perHit, "equitable-judgment", { baseDmgMultiplier: mult });
        res.notes.push(`Past Draconic Glories ×${mult} on Equitable Judgment (${stacks} stack${stacks > 1 ? "s" : ""}${cons >= 1 ? ", incl. C1" : ""})`);
      }
      // C2: each stack +14% CRIT DMG on Equitable Judgment (max 42%).
      if (cons >= 2 && stacks > 0) {
        addMods(res.perHit, "equitable-judgment", { critDmgBonusPct: Math.min(14 * stacks, 42) });
        res.notes.push(`C2: +${Math.min(14 * stacks, 42)}% CRIT DMG on Equitable Judgment`);
      }
      // A4: +0.6% Hydro DMG per 1% current HP above 30% of Max HP, capped at +30%.
      const hpPct = val("current-hp");
      const a4 = Math.min(Math.max(hpPct - 30, 0) * 0.6, 30);
      if (a4 > 0) {
        res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + a4;
        res.notes.push(`A4: +${a4.toFixed(1)}% Hydro DMG Bonus (current HP ${hpPct}%)`);
      }
      break;
    }

    case "sandrone": {
      // Stellar-Conduct params shared by her three stellar hits.
      // Light of Rationalisme: Base Stellar-Conduct DMG +0.7% per 100 ATK, cap 14%.
      const baseDmgBonusPct = Math.min(0.7 * (stats.atk / 100), 14);
      // C1: all party members deal 30% increased Stellar-Conduct DMG (Reaction Bonus slot).
      const reactionBonusPct = cons >= 1 ? 30 : 0;
      const fieldOn = on("polestar-field");
      const hits = Math.min(val("polestar-hits"), 10);
      const brc = fieldOn ? stellarBRC(hits) : 1;
      const direct: DirectReactionParams = { coefficient: brc, baseDmgBonusPct, reactionBonusPct };

      const stellarKeys = ["condensed-beam-stellar", "prism-shot-stellar", "convective-ray-stellar"];
      for (const key of stellarKeys) addMods(res.perHit, key, { directReaction: direct });
      res.notes.push(
        `Light of Rationalisme: +${baseDmgBonusPct.toFixed(1)}% Base Stellar-Conduct DMG (0.7%/100 ATK${baseDmgBonusPct >= 14 ? ", capped" : ""})`,
      );
      if (fieldOn) {
        // Polestar Field: Cryo/Electro DMG Bonus +20% (0 hits) or +(28+n)% (n≥1).
        // Only non-stellar hits benefit — the stellar branch ignores DMG Bonus%.
        const fieldBonus = hits >= 1 ? 28 + hits : 20;
        res.statDeltas.dmgBonus = (res.statDeltas.dmgBonus ?? 0) + fieldBonus;
        res.notes.push(
          `Polestar Field: BRC ×${brc.toFixed(2)} on Stellar hits (${hits} hit${hits === 1 ? "" : "s"}); +${fieldBonus}% Cryo DMG Bonus on non-Stellar hits`,
        );
      }
      if (cons >= 1) res.notes.push("C1: +30% Stellar-Conduct DMG (Reaction Bonus)");

      // A1 Eternal Speculation Engine: Decoding Power > 50 → 2nd Prism Shot ×4.
      if (on("decoding-over-50")) {
        addMods(res.perHit, "prism-shot-stellar", { baseDmgMultiplier: 4 });
        res.notes.push("A1: 2nd Prism Shot deals 400% of original DMG (Decoding Power > 50)");
      }
      // A1: Burst in Radiance clears Refined Tactics stacks → Ray deals 100% + 10%/stack.
      const tactics = Math.min(val("refined-tactics"), 10);
      if (tactics > 0) {
        addMods(res.perHit, "convective-ray-stellar", { baseDmgMultiplier: 1 + 0.1 * tactics });
        res.notes.push(`A1: Convective Ray ×${(1 + 0.1 * tactics).toFixed(1)} (${tactics} Refined Tactics stack${tactics > 1 ? "s" : ""} cleared)`);
      }
      // C2: condensed beams +40% CRIT DMG, +20% per beam fired this Decoding (max 3).
      if (cons >= 2) {
        const beamStacks = Math.min(val("c2-beam-stacks"), 3);
        const critDmg = 40 + 20 * beamStacks;
        addMods(res.perHit, "condensed-beam-stellar", { critDmgBonusPct: critDmg });
        res.notes.push(`C2: +${critDmg}% CRIT DMG on Condensed Beams (${beamStacks} beam stack${beamStacks === 1 ? "" : "s"})`);
      }
      // C4 Extra Cannon / C6 Cluster Beam: fixed-% stellar side hits, shown as notes.
      const stellarNonCrit = (multPct: number) =>
        brc * (multPct / 100) * stats.atk * (1 + baseDmgBonusPct / 100) *
        (1 + stellarEmBonus(stats.em) + reactionBonusPct / 100) *
        resMultiplier(stats.enemyRes);
      if (cons >= 4) {
        res.notes.push(`C4 Extra Cannon: ${fmt(stellarNonCrit(125))} Stellar-Conduct DMG per proc (125% ATK, every 4s)`);
      }
      if (cons >= 6) {
        res.notes.push(`C6 Cluster Beam: 4 × ${fmt(stellarNonCrit(80))} Stellar-Conduct DMG (80% ATK each)`);
      }
      break;
    }

    case "zibai": {
      // A4 Layered Peaks: +15% of Base DEF per other Geo member; +60 EM per Hydro member.
      const geoAllies = Math.min(val("geo-allies"), 3);
      const hydroAllies = Math.min(val("hydro-allies"), 3);
      const defDelta = 0.15 * ctx.baseDef * geoAllies;
      if (defDelta > 0) {
        res.statDeltas.def = (res.statDeltas.def ?? 0) + defDelta;
        res.notes.push(`A4: +${fmt(defDelta)} DEF (${geoAllies} Geo all${geoAllies > 1 ? "ies" : "y"} × 15% Base DEF)`);
      }
      if (hydroAllies > 0) {
        res.statDeltas.em = (res.statDeltas.em ?? 0) + 60 * hydroAllies;
        res.notes.push(`A4: +${60 * hydroAllies} Elemental Mastery (${hydroAllies} Hydro all${hydroAllies > 1 ? "ies" : "y"})`);
      }
      const defEff = stats.def + defDelta;

      // Moonsign Benediction: +0.7% Lunar-Crystallize Base DMG per 100 DEF, cap 14%.
      const lunarBase = Math.min(0.7 * (defEff / 100), 14);
      res.lunarBaseBonusPct = lunarBase;
      res.notes.push(
        `Moonsign: +${lunarBase.toFixed(1)}% Lunar-Crystallize Base DMG (0.7%/100 DEF${lunarBase >= 14 ? ", capped" : ""})`,
      );

      // C2: party Lunar-Crystallize Reaction DMG +30% while in Lunar Phase Shift.
      const reactionBonusPct = cons >= 2 ? 30 : 0;
      const direct: DirectReactionParams = {
        coefficient: LUNAR_DIRECT_MULTIPLIER["lunar-crystallize"], // 1.6
        baseDmgBonusPct: lunarBase,
        reactionBonusPct,
      };
      const lunarKeys = ["spirit-steed-2", "4-hit-additional", "skill-2"];
      for (const key of lunarKeys) addMods(res.perHit, key, { directReaction: direct });
      if (cons >= 2) res.notes.push("C2: +30% Lunar-Crystallize DMG (Reaction Bonus, in Phase Shift)");

      // A1 Moonfall: Spirit Steed's Stride 2nd hit +60% of DEF (flat).
      if (on("moonfall")) {
        addMods(res.perHit, "spirit-steed-2", { flatDmgBonus: 0.6 * defEff });
        res.notes.push(`A1 Moonfall: +${fmt(0.6 * defEff)} flat DMG on Spirit Steed 2nd hit (60% DEF)`);
      }
      // C2 Ascendant Gleam: Stride 2nd hit additional DMG = 550% of DEF (flat).
      if (cons >= 2) {
        addMods(res.perHit, "spirit-steed-2", { flatDmgBonus: 5.5 * defEff });
        res.notes.push(`C2: +${fmt(5.5 * defEff)} flat DMG on Spirit Steed 2nd hit (550% DEF, Ascendant Gleam)`);
      }
      // C1: first Stride of the phase — 2nd-hit Lunar DMG +220%.
      if (cons >= 1 && on("c1-first-stride")) {
        addMods(res.perHit, "spirit-steed-2", { baseDmgMultiplier: 3.2 });
        res.notes.push("C1: first Stride 2nd-hit ×3.2 (+220%)");
      }
      // C4 Scattermoon Splendor: next Phase Shift 4-Hit Additional deals 250% of original.
      if (cons >= 4 && on("c4-scattermoon")) {
        addMods(res.perHit, "4-hit-additional", { baseDmgMultiplier: 2.5 });
        res.notes.push("C4 Scattermoon: Phase Shift 4-Hit Additional ×2.5");
      }
      // C6: Stride consumes all Radiance; +1.6%/point above 70 on Stride + her Lunar hits.
      if (cons >= 6) {
        const radiance = Math.min(Math.max(val("c6-radiance"), 70), 100);
        const bonusPct = (radiance - 70) * 1.6;
        if (bonusPct > 0) {
          for (const key of ["spirit-steed-1", ...lunarKeys]) {
            addMods(res.perHit, key, { baseDmgMultiplier: 1 + bonusPct / 100 });
          }
          res.notes.push(`C6: +${bonusPct.toFixed(1)}% on Spirit Steed & Lunar hits (${radiance} Radiance consumed)`);
        }
      }
      break;
    }

    case "clorinde": {
      // A1 Dark-Shattering Flame: after a party Electro-related reaction, NA & Burst
      // gain +20% ATK as flat DMG per stack (max 3), total capped at 1,800.
      // C2 upgrades to 30% per stack, cap 2,700.
      const stacks = val("dark-flame-stacks");
      if (stacks > 0) {
        const perStack = cons >= 2 ? 30 : 20;
        const cap = cons >= 2 ? 2700 : 1800;
        const additive = Math.min(stacks * (perStack / 100) * stats.atk, cap);
        const keys = [...hitKeysOf(config, "normal"), "swift-hunt-1", "swift-hunt-2", "skill-dmg-x5"];
        for (const key of keys) addMods(res.perHit, key, { flatDmgBonus: additive });
        res.notes.push(
          `Dark-Shattering Flame: +${fmt(additive)} flat DMG on NA & Burst (${stacks} × ${perStack}% ATK${additive >= cap ? ", capped" : ""}${cons >= 2 ? ", C2" : ""})`,
        );
      }
      // A4 Lawful Remuneration: +10% CRIT Rate per Bond of Life change (max 2 stacks).
      const a4 = Math.min(val("a4-crit-stacks"), 2) * 10;
      if (a4 > 0) {
        res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + a4;
        res.notes.push(`A4: +${a4}% CRIT Rate (Bond of Life ≥ 100%)`);
      }
      // C4: every 1% current Bond of Life → +2% Last Lightfall DMG (max +200%).
      if (cons >= 4) {
        const bonus = Math.min(2 * val("bond-of-life"), 200);
        if (bonus > 0) {
          addMods(res.perHit, "skill-dmg-x5", { bonusDmgPct: bonus });
          res.notes.push(`C4: +${bonus}% DMG Bonus on Last Lightfall (Bond of Life)`);
        }
      }
      // C6: +10% CRIT Rate and +70% CRIT DMG for 12s after using Hunter's Vigil.
      if (cons >= 6) {
        res.statDeltas.critRate = (res.statDeltas.critRate ?? 0) + 10;
        res.statDeltas.critDmg = (res.statDeltas.critDmg ?? 0) + 70;
        res.notes.push("C6: +10% CRIT Rate / +70% CRIT DMG (12s after Hunter's Vigil)");
      }
      break;
    }
  }
  return res;
}

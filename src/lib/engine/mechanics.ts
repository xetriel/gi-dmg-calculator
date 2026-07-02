// Fully-computed character mechanics (pure, framework-free).
// The registry's MechanicDefs describe the UI controls; this module owns the math,
// keyed by character id. Constellation interactions that are numeric but bespoke
// (Arlecchino C1/C6, Clorinde C2/C4/C6, Neuvillette C1/C2) also live here — the
// generic ConstellationEffect system stays for simple stat/flat/level effects.
// All formulas are from the saved wiki pages (see scripts/extract-wiki.ts).
import type { CharacterConfig } from "@/data/registry/types";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { DamageStats } from "./damage";

export interface PerHitMods {
  flatDmgBonus?: number;
  baseDmgMultiplier?: number;
  critDmgBonusPct?: number;
  critRateBonusPct?: number;
  bonusDmgPct?: number;
}

export interface MechanicsResult {
  statDeltas: Partial<DamageStats>; // added onto the resolved stats before computing hits
  perHit: Record<string, PerHitMods>; // keyed by TalentHit.key
  notes: string[]; // computed info lines shown in the UI (e.g. heal amounts, caps hit)
}

export interface MechanicsCtx {
  stats: DamageStats;                   // resolved stats, before deltas
  baseAtk: number;                      // the "Base" ATK input (Paramita cap: 400% of it)
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
};

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
          `Paramita: +${Math.round(bonus).toLocaleString()} ATK (${pct}% of Max HP${raw > cap ? ", capped at 400% Base ATK" : ""})`,
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
      const bolValue = (bolPct / 100) * stats.hp;
      // Masque of the Red Death: each NA hit deals additional DMG =
      // (Masque Increase % [NA level]) × current Bond of Life. C1: +100 pp.
      if (bolPct > 0) {
        let masquePct = coeff(ctx, "normal", "masque-increase") ?? 0;
        if (cons >= 1) masquePct += 100;
        const additive = (masquePct / 100) * bolValue;
        for (const key of hitKeysOf(config, "normal")) {
          addMods(res.perHit, key, { flatDmgBonus: additive });
        }
        res.notes.push(
          `Masque: +${Math.round(additive).toLocaleString()} flat DMG on Normal Attacks (${masquePct}% × Bond of Life${cons >= 1 ? ", C1" : ""})`,
        );
        // Burst heal (fixed formula): 150% Bond of Life + 150% ATK.
        const heal = 1.5 * bolValue + 1.5 * stats.atk;
        res.notes.push(`Balemoon Rising heal: ${Math.round(heal).toLocaleString()} HP (150% BoL + 150% ATK)`);
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
          `Dark-Shattering Flame: +${Math.round(additive).toLocaleString()} flat DMG on NA & Burst (${stacks} × ${perStack}% ATK${additive >= cap ? ", capped" : ""}${cons >= 2 ? ", C2" : ""})`,
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

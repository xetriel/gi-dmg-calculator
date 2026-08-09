import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { coeff, addMods } from "../mechanics-utils";

const CHARGED_ATTACK_HITS = [
  "charged-0-seals",
  "charged-1-seal",
  "charged-2-seals",
  "charged-3-seals",
  "charged-4-seals",
  "blazing-eye",
];

export function resolveYanfei(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons = 0, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;
  const val = (id: string) => inputs[id] ?? 0;

  // Proviso (A1): Each consumed Scarlet Seal grants +5% Pyro DMG Bonus for 6s
  const seals = val("scarlet-seals");
  if (seals > 0) {
    const pyroBonus = seals * 5;
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + pyroBonus;
    res.notes.push(`Proviso (A1): +${pyroBonus}% Pyro DMG Bonus from ${seals} Scarlet Seal(s).`);
  }

  // Done Deal (Burst Brilliance Active): Increases Charged Attack DMG %
  if (on("brilliance-active")) {
    const caBuffCoeff = coeff(ctx, "burst", "burst-charged-buff") ?? 55.8;
    for (const hKey of CHARGED_ATTACK_HITS) {
      addMods(res.perHit, hKey, {
        bonusDmgPct: caBuffCoeff,
      });
    }
    res.notes.push(`Brilliance (Burst): +${caBuffCoeff.toFixed(1)}% Charged Attack DMG Bonus.`);
  }

  // C2 Right of Final Interpretation (+20% CA CRIT Rate vs enemies < 50% HP)
  if (cons >= 2 && on("c2-low-hp-crit")) {
    for (const hKey of CHARGED_ATTACK_HITS) {
      addMods(res.perHit, hKey, {
        critRateBonusPct: 20,
      });
    }
    res.notes.push("Right of Final Interpretation (C2): +20% Charged Attack CRIT Rate against opponents below 50% HP.");
  }

  // C4 Supreme Amnesty (Shield Absorption = 45% Max HP)
  if (cons >= 4 && on("c4-shield")) {
    const shieldHp = 0.45 * stats.hp;
    res.notes.push(`Supreme Amnesty (C4): Creates a shield absorbing 45% Max HP (${shieldHp.toFixed(0)} HP durability) for 15s upon casting Burst.`);
  }

  return res;
}

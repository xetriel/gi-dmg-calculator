import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

// Exact flat HP healing values from talent scaling (Levels 1 to 14)
const SKILL_HEAL_PER_HIT_FLAT: Record<number, number> = {
  1: 72.20,
  2: 79.44,
  3: 87.27,
  4: 95.69,
  5: 104.72,
  6: 114.35,
  7: 124.59,
  8: 135.42,
  9: 146.86,
  10: 158.90,
  11: 171.54,
  12: 184.78,
  13: 198.63,
  14: 212.48,
};

const SKILL_CONT_HEAL_FLAT: Record<number, number> = {
  1: 385.18,
  2: 423.71,
  3: 465.44,
  4: 510.39,
  5: 558.54,
  6: 609.91,
  7: 664.48,
  8: 722.27,
  9: 783.27,
  10: 847.47,
  11: 914.89,
  12: 985.52,
  13: 1059.00,
  14: 1133.00,
};

const BURST_HEAL_FLAT: Record<number, number> = {
  1: 1694,
  2: 1863,
  3: 2047,
  4: 2245,
  5: 2456,
  6: 2682,
  7: 2922,
  8: 3176,
  9: 3445,
  10: 3727,
  11: 4024,
  12: 4334,
  13: 4659,
  14: 4999,
};

export function resolveBarbara(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { constellationLevel: cons, inputs } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  const isMelodyActive = on("melody-loop-active");

  // 1. A1 Glorious Season (-12% Stamina Consumption)
  if (isMelodyActive) {
    res.notes.push("A1 Glorious Season: -12% Stamina Consumption within Melody Loop");
  }

  // 2. A4 Encore (Melody Loop duration extension)
  res.notes.push("A4 Encore: Gaining Elemental Particles/Orbs extends Melody Loop by 1s (max 5s)");

  // 3. C1 Gleeful Songs
  if (cons >= 1) {
    res.notes.push("C1 Gleeful Songs: Regenerates 1 Energy every 10s");
  }

  // 4. C2 Vitality Burst (+15% Hydro DMG Bonus during Melody Loop & -15% CD)
  if (cons >= 2) {
    res.notes.push("C2 Vitality Burst: -15% Let the Show Begin♪ CD (32.0s → 27.2s)");
    if (on("c2-hydro-bonus") && isMelodyActive) {
      res.statDeltas.hydroDmgBonus = (res.statDeltas.hydroDmgBonus ?? 0) + 15;
      res.notes.push("C2 Vitality Burst: +15% Hydro DMG Bonus during Melody Loop");
    }
  }

  // 5. C4 Attentiveness be My Power
  if (cons >= 4) {
    res.notes.push("C4 Attentiveness be My Power: Charged Attacks regenerate 1 Energy per enemy hit (max 5 Energy)");
  }

  // 6. C6 Dedicating Everything to You
  if (cons >= 6) {
    res.notes.push("C6 Dedicating Everything to You: Automatically revives fallen party member to 100% HP off-field (15m CD)");
  }

  // 7. Inject high-precision flat healing components into perHit mods
  const skillLv = ctx.talentLevels?.skill ?? (cons >= 5 ? 13 : 10);
  const burstLv = ctx.talentLevels?.burst ?? (cons >= 3 ? 13 : 10);

  const flatSkillPerHit = SKILL_HEAL_PER_HIT_FLAT[skillLv] ?? 158.90;
  const flatSkillCont = SKILL_CONT_HEAL_FLAT[skillLv] ?? 847.47;
  const flatBurst = BURST_HEAL_FLAT[burstLv] ?? 3727;

  addMods(res.perHit, "skill-heal-per-hit", { flatDmgBonus: flatSkillPerHit });
  addMods(res.perHit, "skill-charged-heal", { flatDmgBonus: flatSkillPerHit * 4 });
  addMods(res.perHit, "skill-continuous-heal", { flatDmgBonus: flatSkillCont });
  addMods(res.perHit, "burst-heal", { flatDmgBonus: flatBurst });

  return res;
}

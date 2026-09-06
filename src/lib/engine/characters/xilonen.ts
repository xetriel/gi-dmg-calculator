import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods, fmt } from "../mechanics-utils";

export function resolveXilonen(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { inputs, constellationLevel: cons, stats } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  const baseDef = ctx.baseDef || stats.def || 930;

  // A4 Portable Armored Sheath: Nightsoul Burst (+20% DEF for 15s)
  if (on("a4-nightsoul-burst")) {
    const a4Def = 0.20 * baseDef;
    res.statDeltas.def = (res.statDeltas.def ?? 0) + a4Def;
    res.notes.push(`A4 Portable Armored Sheath: +20% DEF (+${fmt(a4Def)}) from Nightsoul Burst`);
  }

  const effDef = (stats.def ?? 0) + (res.statDeltas.def ?? 0);

  // Skill: Source Samples Active (Elemental RES Shred)
  if (on("source-samples-active")) {
    const rawSkillLv = ctx.talentLevels?.skill ? Number(ctx.talentLevels.skill) : 10;
    const effectiveSkillLv = rawSkillLv <= 10
      ? (cons >= 3 ? rawSkillLv + 3 : rawSkillLv)
      : (cons >= 3 ? rawSkillLv : Math.max(1, rawSkillLv - 3));
    const clampedLv = Math.min(14, Math.max(1, effectiveSkillLv));
    const resShred = 9 + (clampedLv - 1) * 3;
    res.statDeltas.enemyRes = (res.statDeltas.enemyRes ?? 0) - resShred;
    res.notes.push(`Source Samples: -${resShred}% Enemy Elemental RES (Skill Lv${clampedLv})`);
  }

  // C2 Chiucue Mix: Geo Source Sample grants +50% Geo DMG
  if (cons >= 2 && on("c2-chiucue-mix")) {
    res.statDeltas.geoDmgBonus = (res.statDeltas.geoDmgBonus ?? 0) + 50;
    res.notes.push("C2 Chiucue Mix: +50% Geo DMG Bonus");
  }

  const normalPlungeHits = [
    "1-hit",
    "2-hit",
    "3-hit",
    "plunge",
    "low-plunge",
    "high-plunge",
    "blade-roller-1",
    "blade-roller-2",
    "blade-roller-3",
    "blade-roller-4",
  ];

  // A1 Netotiliztli's Echoes: Geo DPS Mode (< 2 PHEC teammates)
  const isGeoDps = on("source-samples-geo-dps");
  if (isGeoDps) {
    for (const h of normalPlungeHits) {
      addMods(res.perHit, h, { bonusDmgPct: 30 });
    }
    res.notes.push("A1 Netotiliztli's Echoes: +30% Normal and Plunging Attack DMG Bonus (< 2 PHEC Teammates)");
  } else {
    // Support Mode (>= 2 PHEC teammates): Follow-Up Beats from Ardent Rhythm are disabled
    addMods(res.perHit, "follow-up-beat", { baseDmgMultiplier: 0 });
    res.notes.push("Support Mode: Burst triggers Ebullient continuous healing (Follow-Up Beats disabled)");
  }

  // C4 Suchitl's Trance: Blooming Blessing (+65% DEF Flat DMG to Normal/Charged/Plunge)
  if (cons >= 4 && on("c4-blooming-blessing")) {
    const c4Flat = 0.65 * effDef;
    const c4Hits = [...normalPlungeHits, "charged"];
    for (const h of c4Hits) {
      addMods(res.perHit, h, { flatDmgBonus: c4Flat });
    }
    res.notes.push(`C4 Suchitl's Trance: +${fmt(c4Flat)} Flat DMG to Normal, Charged, and Plunging Attacks (65% DEF)`);
  }

  // C6 Imperishable Night Carnival: +300% DEF Flat DMG to Normal and Plunging Attacks
  if (cons >= 6 && on("c6-imperishable-night")) {
    const c6Flat = 3.00 * effDef;
    for (const h of normalPlungeHits) {
      addMods(res.perHit, h, { flatDmgBonus: c6Flat });
    }
    res.notes.push(`C6 Imperishable Night Carnival: +${fmt(c6Flat)} Flat DMG to Normal and Plunging Attacks (300% DEF)`);
  }

  return res;
}

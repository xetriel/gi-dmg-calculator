import type { CharacterConfig } from "@/data/registry/types";
import type { MechanicsCtx, MechanicsResult } from "../mechanics-utils";
import { addMods } from "../mechanics-utils";

export function resolveKazuha(config: CharacterConfig, ctx: MechanicsCtx): MechanicsResult {
  const res: MechanicsResult = { statDeltas: {}, perHit: {}, notes: [] };
  const { stats, inputs, constellationLevel: cons } = ctx;
  const on = (id: string) => (inputs[id] ?? 0) > 0;

  // C2: Yamaarashi Tailwind (+200 EM inside Autumn Whirlwind field)
  if (cons >= 2 && on("c2-tailwind-active")) {
    res.statDeltas.em = (res.statDeltas.em ?? 0) + 200;
    res.notes.push("C2 Yamaarashi Tailwind: +200 Elemental Mastery inside Autumn Whirlwind field");
  }

  // Total EM including active C2 bonus
  const totalEm = (stats.em ?? 0) + (res.statDeltas.em ?? 0);

  // A4: Poetics of Fuubutsu (+0.04% Elemental DMG Bonus per point of EM for swirled elements)
  if (on("a4-pyro-swirl")) {
    const pyroBonus = totalEm * 0.04;
    res.statDeltas.pyroDmgBonus = (res.statDeltas.pyroDmgBonus ?? 0) + pyroBonus;
    res.notes.push(`A4 Poetics of Fuubutsu: +${pyroBonus.toFixed(1)}% Pyro DMG Bonus`);
  }

  if (on("a4-hydro-swirl")) {
    const hydroBonus = totalEm * 0.04;
    res.statDeltas.hydroDmgBonus = (res.statDeltas.hydroDmgBonus ?? 0) + hydroBonus;
    res.notes.push(`A4 Poetics of Fuubutsu: +${hydroBonus.toFixed(1)}% Hydro DMG Bonus`);
  }

  if (on("a4-electro-swirl")) {
    const electroBonus = totalEm * 0.04;
    res.statDeltas.electroDmgBonus = (res.statDeltas.electroDmgBonus ?? 0) + electroBonus;
    res.notes.push(`A4 Poetics of Fuubutsu: +${electroBonus.toFixed(1)}% Electro DMG Bonus`);
  }

  if (on("a4-cryo-swirl")) {
    const cryoBonus = totalEm * 0.04;
    res.statDeltas.cryoDmgBonus = (res.statDeltas.cryoDmgBonus ?? 0) + cryoBonus;
    res.notes.push(`A4 Poetics of Fuubutsu: +${cryoBonus.toFixed(1)}% Cryo DMG Bonus`);
  }

  // C6: Crimson Momiji (Anemo Infusion & +0.2% Normal/Charged/Plunge DMG per EM)
  if (cons >= 6 && on("c6-crimson-momiji")) {
    const c6BonusDmgPct = totalEm * 0.2;

    // Normal, Charged, and Basic Plunge hits get infused with Anemo
    const infusedHits = [
      "1-hit",
      "2-hit",
      "3-hit-1",
      "3-hit-2",
      "4-hit",
      "5-hit",
      "charged-1",
      "charged-2",
      "plunge",
      "low-plunge",
      "high-plunge",
    ];

    for (const key of infusedHits) {
      addMods(res.perHit, key, { element: "Anemo" });
    }

    // All Normal, Charged, and Plunging Attack hits (including Midare Ranzan & Soumon) get +0.2% DMG per EM
    const allNaCaPlungeHits = [
      ...infusedHits,
      "midare-ranzan-low",
      "midare-ranzan-high",
      "soumon-pyro",
      "soumon-hydro",
      "soumon-electro",
      "soumon-cryo",
    ];

    for (const key of allNaCaPlungeHits) {
      addMods(res.perHit, key, { bonusDmgPct: c6BonusDmgPct });
    }

    res.notes.push(
      `C6 Crimson Momiji: Anemo Infusion & +${c6BonusDmgPct.toFixed(1)}% Normal, Charged, and Plunging Attack DMG Bonus`
    );
  }

  return res;
}

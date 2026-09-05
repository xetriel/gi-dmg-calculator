"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LUNAR_LABEL, LUNAR_INDIRECT_MULTIPLIER, LUNAR_DIRECT_MULTIPLIER, type LunarType } from "@/lib/engine/lunar";

export function ReactionsWikiView() {
  const [em, setEm] = useState<number>(300);

  // Reaction mathematical formulas
  const vapeMeltBonus = (2.78 * em) / (em + 1400) * 100;
  const catalyzeBonus = (5.0 * em) / (em + 1200) * 100;
  const transformativeBonus = (16.0 * em) / (em + 2000) * 100;
  const lunarStellarBonus = (6.0 * em) / (em + 2000) * 100;

  const lv90BaseMultiplier = 1446.85; // canonical Level 90 reaction base multiplier

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Elemental Reactions & Formula Lab
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Live Engine Math
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            Exact mathematical formulas implemented by the damage engine: Amplifying, Catalyze, Transformative, and custom Lunar/Stellar reactions.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-xs"
        >
          <span>⚡ Go to Calculator</span>
        </Link>
      </div>

      {/* Interactive EM Sandbox */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-zinc-900/40 to-transparent backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>🎛️ Interactive Elemental Mastery (EM) Sandbox</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Adjust EM to simulate real-time bonus yields across all reaction formula curves.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xs">
            <span className="text-xs text-gray-400 dark:text-zinc-500 font-bold">EM:</span>
            <input
              type="number"
              min={0}
              max={2500}
              value={em}
              onChange={(e) => setEm(Math.max(0, Number(e.target.value)))}
              className="w-16 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 bg-transparent focus:outline-none text-sm"
            />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={1500}
          step={5}
          value={em}
          onChange={(e) => setEm(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg"
        />

        {/* Real-time EM Yields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-sans font-bold text-red-500 block mb-1">
              Amplifying (Vape/Melt)
            </span>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              +{vapeMeltBonus.toFixed(1)}%
            </div>
            <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans mt-0.5">
              2.78 · EM / (EM + 1400)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-sans font-bold text-lime-500 block mb-1">
              Catalyze (Spread/Aggravate)
            </span>
            <div className="text-xl font-bold text-lime-600 dark:text-lime-400">
              +{catalyzeBonus.toFixed(1)}%
            </div>
            <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans mt-0.5">
              5.00 · EM / (EM + 1200)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-sans font-bold text-emerald-500 block mb-1">
              Transformative (Swirl/Bloom)
            </span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              +{transformativeBonus.toFixed(1)}%
            </div>
            <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans mt-0.5">
              16.00 · EM / (EM + 2000)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-sans font-bold text-purple-500 block mb-1">
              Lunar & Stellar Reactions
            </span>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              +{lunarStellarBonus.toFixed(1)}%
            </div>
            <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans mt-0.5">
              6.00 · EM / (EM + 2000)
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reaction Classes */}
      <div className="space-y-6">
        {/* 1. Amplifying Reactions */}
        <div id="amplifying" className="p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
              1. Amplifying Reactions (Vaporize & Melt)
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
              Full Hit Multiplier
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            Amplifying reactions multiply the character's entire outgoing hit damage, inheriting CRIT Rate, CRIT DMG, and all relevant DMG Bonus% terms.
          </p>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 font-mono text-xs overflow-x-auto space-y-1">
            <div className="text-zinc-800 dark:text-zinc-200 font-bold">
              Reaction Multiplier = ReactionCoeff × [ 1 + (2.78 · EM / (EM + 1400)) + ReactionBonus% ]
            </div>
            <div className="text-gray-500 dark:text-zinc-400 text-[11px] font-sans">
              • Hydro on Pyro (Forward Vaporize): ReactionCoeff = 2.0<br />
              • Pyro on Hydro (Reverse Vaporize): ReactionCoeff = 1.5<br />
              • Pyro on Cryo (Forward Melt): ReactionCoeff = 2.0<br />
              • Cryo on Pyro (Reverse Melt): ReactionCoeff = 1.5
            </div>
          </div>
        </div>

        {/* 2. Catalyze Reactions */}
        <div id="catalyze" className="p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-lime-600 dark:text-lime-400">
              2. Catalyze Reactions (Aggravate & Spread)
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/30">
              Additive Flat Base DMG
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            Triggering Aggravate or Spread adds an additive flat base damage number directly to the base hit before DMG Bonus% and Enemy DEF are applied.
          </p>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 font-mono text-xs overflow-x-auto space-y-1">
            <div className="text-zinc-800 dark:text-zinc-200 font-bold">
              Flat Additive DMG = ReactionCoeff × LevelMultiplier(90 = 1446.85) × [ 1 + (5.00 · EM / (EM + 1200)) + ReactionBonus% ]
            </div>
            <div className="text-gray-500 dark:text-zinc-400 text-[11px] font-sans">
              • Electro on Quicken (Aggravate): ReactionCoeff = 1.15 (Base: 1,663.88)<br />
              • Dendro on Quicken (Spread): ReactionCoeff = 1.25 (Base: 1,808.56)
            </div>
          </div>
        </div>

        {/* 3. Transformative Reactions */}
        <div id="transformative" className="p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              3. Transformative Reactions (Swirl, Bloom, Hyperbloom, Burgeon, Overload)
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Level & EM Scaling Only
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            Transformative reactions scale purely from character Level and Elemental Mastery. They ignore character ATK/CRIT and enemy DEF, scaling solely against Enemy Elemental RES.
          </p>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 font-mono text-xs overflow-x-auto space-y-2">
            <div className="text-zinc-800 dark:text-zinc-200 font-bold">
              DMG = Coeff × LevelMultiplier(90 = 1446.85) × [ 1 + (16.00 · EM / (EM + 2000)) + ReactionBonus% ] × EnemyRESMult
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700 text-[11px]">
              <div>Burgeon / Hyperbloom: <strong>3.0×</strong></div>
              <div>Bloom / Overload: <strong>2.0×</strong></div>
              <div>Shattered: <strong>1.5×</strong></div>
              <div>Electro-Charged: <strong>1.2×</strong></div>
              <div>Swirl: <strong>0.6×</strong></div>
              <div>Superconduct: <strong>0.5×</strong></div>
              <div>Burning: <strong>0.25×</strong></div>
            </div>
          </div>
        </div>

        {/* 4. Lunar Reactions */}
        <div id="lunar" className="p-5 rounded-xl border border-purple-500/40 bg-purple-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-purple-600 dark:text-purple-400">
              4. Specialized Lunar Reactions (Lunar-Charged, Lunar-Crystallize, Lunar-Bloom)
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              Can CRIT & Moonsign Scaling
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            Unique to the calculator's Lunar combat system. Unlike traditional transformative reactions, <strong>Lunar reaction damage CAN CRIT</strong> using the contributor's CRIT Rate and CRIT DMG stats.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-white/60 dark:bg-zinc-800/60 border border-purple-500/30 space-y-1">
              <span className="font-bold text-purple-500 font-sans block">Indirect Lunar Reaction:</span>
              <div className="text-[11px] text-zinc-800 dark:text-zinc-200">
                DMG = Mult_Indirect × LevelMult × (1 + LunarBaseDmg%) × [ 1 + (6·EM/(EM+2000)) + Bonus% ] × Elevation × RESMult × CritMult
              </div>
              <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans pt-1">
                • Lunar-Charged Indirect Mult: {LUNAR_INDIRECT_MULTIPLIER["lunar-charged"]}<br />
                • Lunar-Crystallize Indirect Mult: {LUNAR_INDIRECT_MULTIPLIER["lunar-crystallize"]}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/60 dark:bg-zinc-800/60 border border-purple-500/30 space-y-1">
              <span className="font-bold text-purple-500 font-sans block">Direct Lunar Ability:</span>
              <div className="text-[11px] text-zinc-800 dark:text-zinc-200">
                DMG = [ Mult_Direct × Ability% × Stat × (1 + LunarBaseDmg%) × [ 1 + (6·EM/(EM+2000)) + Bonus% ] + Additive ] × Elevation × RESMult × CritMult
              </div>
              <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-sans pt-1">
                • Lunar-Charged Direct: {LUNAR_DIRECT_MULTIPLIER["lunar-charged"]}× | Lunar-Crystallize: {LUNAR_DIRECT_MULTIPLIER["lunar-crystallize"]}× | Lunar-Bloom: {LUNAR_DIRECT_MULTIPLIER["lunar-bloom"]}×
              </div>
            </div>
          </div>
        </div>

        {/* 5. Stellar Reactions */}
        <div id="stellar" className="p-5 rounded-xl border border-teal-500/40 bg-teal-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-teal-600 dark:text-teal-400">
              5. Stellar Reactions (Stellar-Conduct & Stellar-Swirl)
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
              DEF-Bypassing Direct Reaction
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            Direct Stellar reaction attacks bypass the standard Enemy DEF multiplier entirely and omit standard DMG Bonus% terms, scaling with the specialized EM curve <code>6·EM / (EM + 2000)</code>.
          </p>

          <div className="p-3 rounded-lg bg-white/60 dark:bg-zinc-800/60 border border-teal-500/30 font-mono text-xs">
            <div className="text-zinc-800 dark:text-zinc-200 font-bold">
              Stellar Hit DMG = (Talent% × Stat × BaseReactionCoeff × [ 1 + (6·EM/(EM+2000)) + StellarBonus% ] + FlatDMG) × RESMult × CritMult
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

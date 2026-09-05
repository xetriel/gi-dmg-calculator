"use client";

import React, { useState } from "react";
import Link from "next/link";

export function MechanicsWikiView() {
  const [charLevel, setCharLevel] = useState<number>(90);
  const [enemyLevel, setEnemyLevel] = useState<number>(90);
  const [defReduction, setDefReduction] = useState<number>(0);
  const [defIgnore, setDefIgnore] = useState<number>(0);
  const [enemyRes, setEnemyRes] = useState<number>(10);

  // Compute DEF Multiplier
  const charTerm = charLevel + 100;
  const enemyTerm = (enemyLevel + 100) * (1 - defReduction / 100) * (1 - defIgnore / 100);
  const defMult = charTerm / (charTerm + enemyTerm);

  // Compute RES Multiplier
  const resDec = enemyRes / 100;
  let resMult = 1 - resDec;
  if (enemyRes < 0) {
    resMult = 1 - resDec / 2;
  } else if (enemyRes > 75) {
    resMult = 1 / (4 * resDec + 1);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Combat Mechanics Compendium
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              Mathematical Standard
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            Comprehensive guide to the General Damage Formula, Enemy Defense, Resistance shred piecewise math, Bond of Life, and Nightsoul systems.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-xs"
        >
          <span>⚡ Go to Calculator</span>
        </Link>
      </div>

      {/* 1. General Damage Formula */}
      <div id="general-formula" className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="text-amber-500">📜</span>
            <span>The Universal Damage Formula</span>
          </h2>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            6 Core Multipliers
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
          Every standard direct talent hit in Genshin Impact is calculated as the product of base scaling terms multiplied by 5 distinct defensive and amplifying multiplier layers:
        </p>

        <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 font-mono text-xs overflow-x-auto space-y-2">
          <div className="text-amber-600 dark:text-amber-400 font-bold text-sm">
            DMG = (BaseDMG + AdditiveDMG) × DMGBonusMult × DEFMult × RESMult × ReactionMult × CritMult
          </div>

          <div className="text-gray-600 dark:text-zinc-300 text-[11px] font-sans pt-2 border-t border-gray-200 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>• <strong>BaseDMG</strong>: Talent% × Scaling Stat (ATK, HP, DEF, or EM)</div>
            <div>• <strong>AdditiveDMG</strong>: Flat bonuses (Yun Jin, Shenhe, Catalyze, BoL)</div>
            <div>• <strong>DMGBonusMult</strong>: 100% + Elemental% + Category% + All DMG%</div>
            <div>• <strong>DEFMult</strong>: Target Defense Multiplier (Level + Shred + Ignore)</div>
            <div>• <strong>RESMult</strong>: Target Elemental / Physical Resistance Multiplier</div>
            <div>• <strong>CritMult</strong>: Non-Crit (1.0), CRIT (1 + CDMG), Avg (1 + CR × CDMG)</div>
          </div>
        </div>
      </div>

      {/* 2. Enemy DEF Multiplier & Live Calculator */}
      <div id="defense" className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="text-blue-500">🛡️</span>
            <span>Enemy Defense (DEF) Multiplier</span>
          </h2>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            Level + Shred + Ignore
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
          The enemy defense multiplier reduces incoming damage based on the ratio between the attacking character's level and the defender's level. DEF Reduction and DEF Ignore stack multiplicatively.
        </p>

        {/* Live DEF Calculator Widget */}
        <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3">
          <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
            Live DEF Multiplier Simulator
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 block mb-1">
                Char Level:
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={charLevel}
                onChange={(e) => setCharLevel(Number(e.target.value))}
                className="w-full p-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 block mb-1">
                Enemy Level:
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={enemyLevel}
                onChange={(e) => setEnemyLevel(Number(e.target.value))}
                className="w-full p-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 block mb-1">
                DEF Reduction%:
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={defReduction}
                onChange={(e) => setDefReduction(Number(e.target.value))}
                className="w-full p-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 block mb-1">
                DEF Ignore%:
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={defIgnore}
                onChange={(e) => setDefIgnore(Number(e.target.value))}
                className="w-full p-1.5 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between font-mono">
            <span className="text-xs text-gray-600 dark:text-zinc-300 font-sans">
              Computed DEF Multiplier:
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {defMult.toFixed(4)} ({(defMult * 100).toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Enemy RES Multiplier & Live Calculator */}
      <div id="resistance" className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="text-purple-500">🔰</span>
            <span>Enemy Resistance (RES) Piecewise Formula</span>
          </h2>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            Piecewise Math
          </span>
        </div>

        <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
          Enemy resistance multiplier uses a 3-stage piecewise function. Critically, <strong>any resistance reduction below 0% is halved</strong>.
        </p>

        <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
              Live RES Multiplier Simulator
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs text-gray-400 dark:text-zinc-500 font-bold">Target RES%:</span>
              <input
                type="number"
                min={-100}
                max={200}
                value={enemyRes}
                onChange={(e) => setEnemyRes(Number(e.target.value))}
                className="w-16 text-center font-mono font-bold text-purple-600 dark:text-purple-400 bg-transparent text-sm"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-1">
            <div className="text-zinc-800 dark:text-zinc-200">
              {enemyRes < 0 ? (
                <span className="text-emerald-500 font-bold">
                  RES &lt; 0: RESMult = 1 - (RES / 2) = 1 - (({enemyRes}%) / 2) = {resMult.toFixed(4)}
                </span>
              ) : enemyRes > 75 ? (
                <span className="text-red-500 font-bold">
                  RES &gt; 75%: RESMult = 1 / (4 · RES + 1) = {resMult.toFixed(4)}
                </span>
              ) : (
                <span className="text-purple-500 font-bold">
                  0% ≤ RES ≤ 75%: RESMult = 1 - RES = 1 - {enemyRes}% = {resMult.toFixed(4)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bond of Life & Nightsoul */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div id="bond-of-life" className="p-5 rounded-xl border border-red-500/30 bg-red-500/5 space-y-2.5">
          <h2 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <span>🩸</span>
            <span>Bond of Life (BoL) System</span>
          </h2>
          <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            Bond of Life absorbs incoming heals up to a percentage of Max HP (up to 200%). On Arlecchino, it infuses attacks with Pyro and adds massive ATK-scaled flat damage via <em>Masque of the Red Death</em>:
          </p>
          <div className="p-2.5 rounded bg-white/60 dark:bg-zinc-800/60 border border-red-500/20 font-mono text-[11px] text-zinc-800 dark:text-zinc-200">
            Masque Flat DMG = ATK × MasqueRatio% × (BoL% / MaxHP)
          </div>
        </div>

        <div id="nightsoul" className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2.5">
          <h2 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span>✨</span>
            <span>Nightsoul's Blessing System</span>
          </h2>
          <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
            Natlan characters enter Nightsoul's Blessing to gain enhanced attacks, Phlogiston mobility, and trigger Nightsoul Bursts. Powers major artifacts like <em>Obsidian Codex</em> (+40% CRIT Rate) and <em>Scroll of the Hero of Cinder City</em> (+40% Team Elemental DMG).
          </p>
          <div className="p-2.5 rounded bg-white/60 dark:bg-zinc-800/60 border border-amber-500/20 font-mono text-[11px] text-zinc-800 dark:text-zinc-200">
            Nightsoul Burst CD: 18s (reduced by 3s per Natlan party member)
          </div>
        </div>
      </div>
    </div>
  );
}

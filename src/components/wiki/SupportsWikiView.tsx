"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SUPPORT_CONFIGS } from "@/data/registry/characters";
import { ElementIcon, WeaponIcon } from "@/components/icons";

export function SupportsWikiView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredSupports = useMemo(() => {
    return SUPPORT_CONFIGS.filter((s) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchDesc = s.description?.toLowerCase().includes(q);
        const matchBuffs = s.buffExplanations?.some(
          (b) => b.name.toLowerCase().includes(q) || b.brief.toLowerCase().includes(q) || b.full.toLowerCase().includes(q)
        );
        if (!matchName && !matchDesc && !matchBuffs) return false;
      }

      if (selectedCategory === "atk") {
        const hasAtk = s.buffs.some((b) => b.stat === "atk" || b.stat === "atkPct") ||
          s.buffExplanations?.some((b) => b.brief.toLowerCase().includes("atk") || b.name.toLowerCase().includes("atk"));
        if (!hasAtk) return false;
      }

      if (selectedCategory === "res") {
        const hasRes = s.buffs.some((b) => b.stat === "enemyRes" || b.stat === "allRes") ||
          s.buffExplanations?.some((b) => b.brief.toLowerCase().includes("res") || b.name.toLowerCase().includes("res") || b.brief.toLowerCase().includes("shred"));
        if (!hasRes) return false;
      }

      if (selectedCategory === "dmg") {
        const hasDmg = s.buffs.some((b) => b.stat.includes("DmgBonus") || b.stat === "dmgBonus") ||
          s.buffExplanations?.some((b) => b.brief.toLowerCase().includes("dmg") || b.name.toLowerCase().includes("dmg"));
        if (!hasDmg) return false;
      }

      if (selectedCategory === "crit") {
        const hasCrit = s.buffs.some((b) => b.stat === "critRate" || b.stat === "critDmg") ||
          s.buffExplanations?.some((b) => b.brief.toLowerCase().includes("crit") || b.name.toLowerCase().includes("crit"));
        if (!hasCrit) return false;
      }

      if (selectedCategory === "lunar") {
        const hasLunar = Boolean(s.lunarBaseBonusCompute) ||
          s.buffs.some((b) => b.stat.includes("lunar") || b.stat.includes("stellar")) ||
          s.buffExplanations?.some((b) => b.category === "lunar" || b.brief.toLowerCase().includes("lunar"));
        if (!hasLunar) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Universal Support Buff Matrix
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
              {filteredSupports.length} of {SUPPORT_CONFIGS.length} Supports
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            Compare party buffs across all 46 support characters. Filter by ATK buffers, RES shredders, DMG% sources, and Moonsign Lunar amplifiers.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-xs"
        >
          <span>⚡ Go to Calculator</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm space-y-3 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search support name, buff effect, or stat..."
            className="w-full text-sm border border-gray-300 dark:border-zinc-800 rounded-lg pl-3 pr-8 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          {[
            { id: "all", label: "All Supports" },
            { id: "atk", label: "⚔️ Flat ATK Buffers" },
            { id: "res", label: "🔰 RES Shredders" },
            { id: "dmg", label: "💥 DMG% Buffers" },
            { id: "crit", label: "🎯 CRIT Buffers" },
            { id: "lunar", label: "🌙 Moonsign Lunar Amplifiers" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/50 shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Supports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSupports.map((supp) => {
          return (
            <div
              key={supp.id}
              className="p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <ElementIcon element={supp.element} className="w-8 h-8 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {supp.name}
                        </h2>
                        {supp.weapon && (
                          <WeaponIcon weapon={supp.weapon} className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mt-0.5">
                        <span className={supp.rarity === 5 ? "text-amber-500 font-bold" : "text-purple-400 font-bold"}>
                          {supp.rarity}★
                        </span>
                        {" • "}{supp.element}
                      </div>
                    </div>
                  </div>

                  {supp.lunarBaseBonusCompute && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                      🌙 Moonsign
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
                  {supp.description || "Versatile party support."}
                </p>

                {/* Buff Explanations */}
                {supp.buffExplanations && supp.buffExplanations.length > 0 ? (
                  <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">
                      Team Buff Contributions ({supp.buffExplanations.length})
                    </span>
                    {supp.buffExplanations.map((buff, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-2 rounded bg-gray-50 dark:bg-zinc-800/40 border border-gray-200/60 dark:border-zinc-700/60 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">
                          <span className="text-indigo-600 dark:text-indigo-400">{buff.name}</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                            {buff.brief}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                          {buff.full}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 rounded bg-gray-50 dark:bg-zinc-800/30 text-xs text-gray-400 dark:text-zinc-500 italic">
                    Pure on-field hypercarry: provides team elemental resonance and Lunar reaction CRIT passthrough (teamCrit) without numeric stat inflation.
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div className="text-[10px] text-gray-400 dark:text-zinc-500">
                  Support ID: <code className="font-mono">{supp.id}</code>
                </div>

                <Link
                  href={`/characters/${supp.characterId}`}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
                >
                  View Character Calculator →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

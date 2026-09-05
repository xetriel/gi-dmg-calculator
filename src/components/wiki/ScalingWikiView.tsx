"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RAW_CHARACTERS } from "@/data/registry/characters";
import { TALENT_SEED } from "@/data/talents";
import { ElementIcon } from "@/components/icons";
import type { TalentType } from "@/data/registry/types";

export function ScalingWikiView() {
  const [selectedCharId, setSelectedCharId] = useState<string>("arlecchino");
  const [selectedTalentType, setSelectedTalentType] = useState<TalentType>("normal");
  const [highlightLevel, setHighlightLevel] = useState<number>(10);

  const selectedChar = RAW_CHARACTERS.find((c) => c.id === selectedCharId) ?? RAW_CHARACTERS[0];
  const charSeed = TALENT_SEED.find((s) => s.characterId === selectedCharId);

  // Find talent hits for this character & talent type
  const talentGroup = selectedChar.talents.find((t) => t.type === selectedTalentType);
  const hits = talentGroup?.hits ?? [];

  // Group seed entries by hitKey
  const hitScalings = hits.map((hit) => {
    const seedHit = charSeed?.hits.find((h) => h.hitKey === hit.key);
    const levels: number[] = [];
    for (let lvl = 1; lvl <= 15; lvl++) {
      const val = seedHit?.values[lvl - 1] ?? 0;
      levels.push(val);
    }
    return {
      hit,
      levels,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📈</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Talent Multiplier Scaling Inspector
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Lv 1–15 Curves
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-zinc-400">
            Inspect canonical talent multiplier progression across levels 1 through 15 for all character abilities.
          </p>
        </div>

        <Link
          href={`/characters/${selectedChar.id}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-xs"
        >
          <span>⚡ Open {selectedChar.name} Calculator</span>
        </Link>
      </div>

      {/* Control Panel */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Character Selector */}
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
              Select Character
            </label>
            <div className="flex items-center gap-2">
              <ElementIcon element={selectedChar.element} className="w-5 h-5 shrink-0" />
              <select
                value={selectedCharId}
                onChange={(e) => setSelectedCharId(e.target.value)}
                className="w-full text-xs font-bold border border-gray-300 dark:border-zinc-700 rounded-lg p-2 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {RAW_CHARACTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.element} · {c.weapon})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Talent Type Selector */}
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
              Select Talent
            </label>
            <div className="flex gap-1">
              {[
                { type: "normal", label: "Normal Attack" },
                { type: "skill", label: "Elemental Skill" },
                { type: "burst", label: "Elemental Burst" },
              ].map((t) => (
                <button
                  key={t.type}
                  onClick={() => setSelectedTalentType(t.type as TalentType)}
                  className={`flex-1 py-2 px-1 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                    selectedTalentType === t.type
                      ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-xs font-extrabold"
                      : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Highlight Level Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Highlight Level:
              </label>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                Level {highlightLevel}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={highlightLevel}
              onChange={(e) => setHighlightLevel(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg mt-1"
            />
          </div>
        </div>
      </div>

      {/* Scaling Table */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <div className="p-3 bg-gray-50 dark:bg-zinc-800/60 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {talentGroup?.name ?? "Talent Hits"} ({hits.length} Hit Definitions)
          </span>
          <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-mono">
            Highlighted: Lv {highlightLevel}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-[11px] text-gray-500 dark:text-zinc-400 font-semibold font-mono">
                <th className="p-3 whitespace-nowrap min-w-[140px]">Hit Name</th>
                <th className="p-3 whitespace-nowrap min-w-[70px]">Scaling</th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((lvl) => (
                  <th
                    key={lvl}
                    className={`p-2.5 text-center min-w-[55px] transition-colors ${
                      highlightLevel === lvl
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
                        : ""
                    }`}
                  >
                    Lv{lvl}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 font-mono">
              {hitScalings.map(({ hit, levels }) => (
                <tr key={hit.key} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3 font-sans font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {hit.name}
                  </td>
                  <td className="p-3 uppercase text-[10px] text-gray-400 dark:text-zinc-500">
                    {hit.scaling}
                  </td>
                  {levels.map((val, idx) => {
                    const lvl = idx + 1;
                    const isHighlighted = highlightLevel === lvl;
                    return (
                      <td
                        key={lvl}
                        className={`p-2.5 text-center text-xs transition-colors ${
                          isHighlighted
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold"
                            : "text-gray-700 dark:text-zinc-300"
                        }`}
                      >
                        {val > 0 ? `${val.toFixed(1)}%` : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

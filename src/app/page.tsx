"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CHARACTERS } from "@/data/registry/characters";
import { ElementIcon, WeaponIcon, ELEMENT_COLORS } from "@/components/icons";
import type { Element, Weapon } from "@/data/registry/types";

const ELEMENTS: Element[] = ["Pyro", "Hydro", "Anemo", "Electro", "Dendro", "Cryo", "Geo"];
const WEAPONS: Weapon[] = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);

  const filteredCharacters = CHARACTERS.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedElement && c.element !== selectedElement) return false;
    if (selectedWeapon && c.weapon !== selectedWeapon) return false;
    if (selectedQuality && c.rarity !== selectedQuality) return false;
    return true;
  });

  const isFiltering = searchQuery || selectedElement || selectedWeapon || selectedQuality;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedElement(null);
    setSelectedWeapon(null);
    setSelectedQuality(null);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Character Calculators</h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400">
          Search and filter character profiles to open their detailed calculation panels.
        </p>
      </div>

      {/* Filters Dashboard Panel */}
      <div className="bg-white/50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Type character name..."
                className="w-full text-sm border border-gray-300 dark:border-zinc-800 rounded-lg px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quality Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Rarity</label>
            <div className="flex gap-2">
              {[5, 4].map(stars => (
                <button
                  key={stars}
                  onClick={() => setSelectedQuality(selectedQuality === stars ? null : stars)}
                  className={`flex-1 text-sm font-semibold py-2 rounded-lg border cursor-pointer select-none transition-all ${
                    selectedQuality === stars
                      ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {stars === 5 ? "⭐⭐⭐⭐⭐ 5★" : "⭐⭐⭐⭐ 4★"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Elements Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Elements</label>
          <div className="flex flex-wrap gap-2">
            {ELEMENTS.map(elem => {
              const isActive = selectedElement === elem;
              const col = ELEMENT_COLORS[elem];
              return (
                <button
                  key={elem}
                  onClick={() => setSelectedElement(isActive ? null : elem)}
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                    isActive
                      ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold"
                      : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <ElementIcon element={elem} className="w-4 h-4" />
                  <span>{elem}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weapons Filter */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-1.5 border-t border-gray-150 dark:border-zinc-800/80">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Weapons</label>
            <div className="flex flex-wrap gap-2">
              {WEAPONS.map(weap => {
                const isActive = selectedWeapon === weap;
                return (
                  <button
                    key={weap}
                    onClick={() => setSelectedWeapon(isActive ? null : weap)}
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                      isActive
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-400 font-extrabold"
                        : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <WeaponIcon weapon={weap} className="w-4 h-4" />
                    <span>{weap}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {isFiltering && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-red-500 dark:text-red-400 hover:underline cursor-pointer select-none self-end pb-1.5"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Characters list grid */}
      <div>
        <div className="flex items-center justify-between mb-3.5 select-none">
          <h2 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            Playable Characters ({filteredCharacters.length})
          </h2>
        </div>

        {filteredCharacters.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredCharacters.map(c => {
              const rarityColor =
                c.rarity === 5
                  ? "border-amber-400/40 dark:border-amber-400/30 bg-amber-500/5 hover:bg-amber-500/10"
                  : "border-purple-400/40 dark:border-purple-400/30 bg-purple-500/5 hover:bg-purple-500/10";
              const starStr = "★".repeat(c.rarity);

              return (
                <li key={c.id}>
                  <Link
                    href={`/characters/${c.id}`}
                    className={`group flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 shadow-xs ${rarityColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {c.name}
                      </span>
                      <span className="text-[10px] font-bold text-amber-500 select-none">
                        {starStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 mt-3 select-none">
                      <div className="flex items-center gap-1.5">
                        <ElementIcon element={c.element} className="w-4 h-4" />
                        <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                          {c.element}
                        </span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <div className="flex items-center gap-1.5">
                        <WeaponIcon weapon={c.weapon} className="w-4 h-4" />
                        <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                          {c.weapon}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
            <span className="text-2xl select-none">🔍</span>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-2 font-medium">No characters match your active filters.</p>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-amber-500 mt-3 hover:underline cursor-pointer select-none"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHARACTERS } from "@/data/registry/characters";
import { ElementIcon, WeaponIcon } from "@/components/icons";
import type { Element, Weapon } from "@/data/registry/types";

const ELEMENTS: Element[] = ["Pyro", "Hydro", "Anemo", "Electro", "Dendro", "Cryo", "Geo"];
const WEAPONS: Weapon[] = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState));
    }
  };

  const filteredCharacters = CHARACTERS.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedElement && c.element !== selectedElement) return false;
    if (selectedWeapon && c.weapon !== selectedWeapon) return false;
    if (selectedQuality && c.rarity !== selectedQuality) return false;
    return true;
  });

  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
    if (sortOrder === "asc") return a.name.localeCompare(b.name);
    if (sortOrder === "desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const isFilteringActive = searchQuery || selectedElement || selectedWeapon || selectedQuality || sortOrder !== "none";

  return (
    <nav className={`shrink-0 border-r border-gray-200 dark:border-zinc-800 p-3 flex flex-col gap-1 bg-gray-50/50 dark:bg-zinc-900/30 backdrop-blur-sm h-full overflow-y-auto no-scrollbar select-none transition-all duration-200 ${isCollapsed ? "w-14 items-center" : "w-60"}`}>
      {/* Header with Toggle Sidebar and Filters */}
      {isCollapsed ? (
        <div className="pb-2 border-b border-gray-200/55 dark:border-zinc-800/40 mb-1 flex justify-center w-full">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-gray-500 dark:text-zinc-400 cursor-pointer transition-colors"
            title="Expand Sidebar"
          >
            <svg className="w-5 h-5 animate-in fade-in zoom-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-200/55 dark:border-zinc-800/40 mb-1 w-full">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-gray-500 dark:text-zinc-400 cursor-pointer transition-colors"
              title="Collapse Sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Calculators
            </span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`text-[10px] font-bold px-2 py-0.5 border rounded-md cursor-pointer select-none transition-all flex items-center gap-1 ${
              showFilters || isFilteringActive
                ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            <span>🔍</span>
            <span>{showFilters ? "Hide" : "Filter"}</span>
          </button>
        </div>
      )}
      {/* Collapsible Filters Section */}
      {!isCollapsed && showFilters && (
        <div className="p-2.5 bg-white/50 dark:bg-zinc-900/30 border border-gray-205 dark:border-zinc-800 rounded-xl space-y-3 mb-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name..."
              className="w-full text-xs border border-gray-300 dark:border-zinc-800 rounded-md pl-2 pr-5 py-1 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-1.5 top-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[10px]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Elements Filter Icons */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Element</span>
            <div className="flex flex-wrap gap-1">
              {ELEMENTS.map(elem => {
                const isActive = selectedElement === elem;
                return (
                  <button
                    key={elem}
                    onClick={() => setSelectedElement(isActive ? null : elem)}
                    className={`p-1 rounded-md border cursor-pointer transition-all ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/80 shadow-xs"
                        : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80"
                    }`}
                    title={elem}
                  >
                    <ElementIcon element={elem} className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weapons Filter Icons */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Weapon</span>
            <div className="flex flex-wrap gap-1">
              {WEAPONS.map(weap => {
                const isActive = selectedWeapon === weap;
                return (
                  <button
                    key={weap}
                    onClick={() => setSelectedWeapon(isActive ? null : weap)}
                    className={`p-1 rounded-md border cursor-pointer transition-all ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/80 shadow-xs"
                        : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80"
                    }`}
                    title={weap}
                  >
                    <WeaponIcon weapon={weap} className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rarity Selector */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Rarity</span>
            <div className="flex gap-1">
              {[5, 4].map(stars => {
                const isActive = selectedQuality === stars;
                return (
                  <button
                    key={stars}
                    onClick={() => setSelectedQuality(isActive ? null : stars)}
                    className={`flex-1 text-[9px] py-1 rounded-md border font-bold cursor-pointer transition-all ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/80 text-amber-600 dark:text-amber-400 font-extrabold"
                        : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {stars}★
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorting Selector */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">Sort Name</span>
            <div className="flex gap-1">
              {["none", "asc", "desc"].map(mode => {
                const label = mode === "none" ? "Default" : mode === "asc" ? "A-Z" : "Z-A";
                const isActive = sortOrder === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setSortOrder(mode as any)}
                    className={`flex-1 text-[9px] py-1 rounded-md border font-bold cursor-pointer transition-all ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/80 text-amber-600 dark:text-amber-400 font-extrabold"
                        : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear Button */}
          {isFilteringActive && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedElement(null);
                setSelectedWeapon(null);
                setSelectedQuality(null);
                setSortOrder("none");
              }}
              className="text-[10px] font-bold text-red-500 dark:text-red-400 hover:underline cursor-pointer block w-full text-center"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Characters List Links */}
      <div className={`flex-1 space-y-1 overflow-y-auto no-scrollbar ${isCollapsed ? "w-full flex flex-col items-center" : ""}`}>
        {sortedCharacters.length > 0 ? (
          sortedCharacters.map(c => {
            const href = `/characters/${c.id}`;
            const isActive = pathname === href;
            if (isCollapsed) {
              return (
                <Link
                  key={c.id}
                  href={href}
                  className={`group flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                    isActive
                      ? "bg-amber-500/15 border border-amber-500/35 text-amber-600 dark:text-amber-400 font-bold shadow-xs"
                      : "text-gray-700 hover:bg-gray-155 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                  }`}
                  title={`${c.name} (${c.element} · ${c.weapon})`}
                >
                  <ElementIcon element={c.element} className="w-5 h-5 shrink-0" />
                </Link>
              );
            }
            return (
              <Link
                key={c.id}
                href={href}
                className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-200/70 text-black dark:bg-zinc-800 dark:text-white font-semibold shadow-xs"
                    : "text-gray-700 hover:bg-gray-155 hover:text-black dark:text-gray-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                }`}
              >
                <span>{c.name}</span>
                <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <ElementIcon element={c.element} className="w-3.5 h-3.5" />
                  <WeaponIcon weapon={c.weapon} className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-400 dark:text-zinc-500 text-xs">
            {!isCollapsed ? "No matches found." : "✕"}
          </div>
        )}
      </div>
    </nav>
  );
}

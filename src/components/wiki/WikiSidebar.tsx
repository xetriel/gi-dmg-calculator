"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WEAPONS, type WeaponType } from "@/data/registry/weapons";
import { ARTIFACTS } from "@/data/registry/artifacts";
import { CHARACTERS } from "@/data/registry/characters";
import { ElementIcon, WeaponIcon } from "@/components/icons";
import { matchesArtifactRarity } from "@/data/registry/artifacts/types";
import { getRarityTextColor, ArtifactRarityPills } from "@/components/wiki/RarityRangeBadge";
import type { Element, Weapon } from "@/data/registry/types";

const WIKI_SECTIONS = [
  { id: "weapons", label: "Weapons", href: "/wiki/weapons", icon: "⚔️", count: 246 },
  { id: "artifacts", label: "Artifacts", href: "/wiki/artifacts", icon: "🛡️", count: 64 },
  { id: "characters", label: "Characters", href: "/wiki/characters", icon: "👤", count: 48 },
  { id: "reactions", label: "Reactions", href: "/wiki/reactions", icon: "🧪" },
  { id: "mechanics", label: "Mechanics", href: "/wiki/mechanics", icon: "⚙️" },
  { id: "supports", label: "Supports", href: "/wiki/supports", icon: "🤝" },
  { id: "scaling", label: "Scaling", href: "/wiki/scaling", icon: "📈" },
];

const ELEMENTS: Element[] = ["Pyro", "Hydro", "Anemo", "Electro", "Dendro", "Cryo", "Geo"];
const WEAPON_TYPES: WeaponType[] = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

export function WikiSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Weapon filters
  const [selectedWeaponType, setSelectedWeaponType] = useState<WeaponType | null>(null);
  const [selectedWeaponRarity, setSelectedWeaponRarity] = useState<number | null>(null);
  const [selectedWeaponSupport, setSelectedWeaponSupport] = useState<boolean | null>(null);

  // Artifact filters
  const [selectedArtifactRarity, setSelectedArtifactRarity] = useState<number | null>(null);
  const [selectedArtifactSupport, setSelectedArtifactSupport] = useState<boolean | null>(null);

  // Character filters
  const [selectedCharElement, setSelectedCharElement] = useState<Element | null>(null);
  const [selectedCharWeapon, setSelectedCharWeapon] = useState<Weapon | null>(null);
  const [selectedCharRarity, setSelectedCharRarity] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsCollapsed(localStorage.getItem("wiki-sidebar-collapsed") === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("wiki-sidebar-collapsed", String(newState));
    }
  };

  // Determine active section
  const currentSection = WIKI_SECTIONS.find((s) => pathname.startsWith(s.href))?.id ?? "hub";

  // Filtered lists for sidebar fast-navigation
  const filteredWeapons = WEAPONS.filter((w) => {
    if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedWeaponType && w.type !== selectedWeaponType) return false;
    if (selectedWeaponRarity && w.rarity !== selectedWeaponRarity) return false;
    if (selectedWeaponSupport !== null && w.isSupport !== selectedWeaponSupport) return false;
    return true;
  });

  const filteredArtifacts = ARTIFACTS.filter((a) => {
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedArtifactRarity && !matchesArtifactRarity(a, selectedArtifactRarity, "range")) return false;
    if (selectedArtifactSupport !== null && a.isSupport !== selectedArtifactSupport) return false;
    return true;
  });

  const filteredCharacters = CHARACTERS.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCharElement && c.element !== selectedCharElement) return false;
    if (selectedCharWeapon && c.weapon !== selectedCharWeapon) return false;
    if (selectedCharRarity && c.rarity !== selectedCharRarity) return false;
    return true;
  });

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedWeaponType !== null ||
    selectedWeaponRarity !== null ||
    selectedWeaponSupport !== null ||
    selectedArtifactRarity !== null ||
    selectedArtifactSupport !== null ||
    selectedCharElement !== null ||
    selectedCharWeapon !== null ||
    selectedCharRarity !== null;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedWeaponType(null);
    setSelectedWeaponRarity(null);
    setSelectedWeaponSupport(null);
    setSelectedArtifactRarity(null);
    setSelectedArtifactSupport(null);
    setSelectedCharElement(null);
    setSelectedCharWeapon(null);
    setSelectedCharRarity(null);
  };

  return (
    <nav
      className={`shrink-0 border-r border-gray-200 dark:border-zinc-800 p-3 flex flex-col gap-1 bg-gray-50/50 dark:bg-zinc-900/30 backdrop-blur-sm h-full overflow-y-auto no-scrollbar select-none transition-all duration-200 ${
        isCollapsed ? "w-14 items-center" : "w-60"
      }`}
    >
      {/* Header with Toggle Sidebar and Filters */}
      {isCollapsed ? (
        <div className="pb-2 border-b border-gray-200/55 dark:border-zinc-800/40 mb-1 flex justify-center w-full">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-gray-500 dark:text-zinc-400 cursor-pointer transition-colors"
            title="Expand Wiki Sidebar"
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
              title="Collapse Wiki Sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              href="/wiki"
              className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:opacity-80 transition-opacity"
            >
              Wiki Hub
            </Link>
          </div>
          {(currentSection === "weapons" || currentSection === "artifacts" || currentSection === "characters") && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`text-[10px] font-bold px-2 py-0.5 border rounded-md cursor-pointer select-none transition-all flex items-center gap-1 ${
                showFilters || hasActiveFilters
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                  : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <span>🔍</span>
              <span>{showFilters ? "Hide" : "Filter"}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Section Links */}
      <div className="space-y-0.5 mb-2 w-full">
        {WIKI_SECTIONS.map((section) => {
          const isActive = pathname === section.href || pathname.startsWith(`${section.href}/`);
          if (isCollapsed) {
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`group flex items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500/15 border border-amber-500/35 text-amber-600 dark:text-amber-400 font-bold shadow-xs"
                    : "text-gray-700 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                }`}
                title={section.label}
              >
                <span className="text-base">{section.icon}</span>
              </Link>
            );
          }
          return (
            <Link
              key={section.id}
              href={section.href}
              className={`group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-zinc-200/80 text-black dark:bg-zinc-800 dark:text-white font-semibold shadow-xs border border-zinc-300 dark:border-zinc-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </div>
              {section.count !== undefined && (
                <span className="text-[10px] font-mono opacity-60 bg-black/5 dark:bg-white/5 px-1.5 py-0.2 rounded">
                  {section.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Collapsible Filter Section when active */}
      {!isCollapsed && showFilters && (
        <div className="p-2.5 bg-white/50 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800 rounded-xl space-y-3 mb-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentSection}...`}
              className="w-full text-xs border border-gray-300 dark:border-zinc-800 rounded-lg pl-2 pr-6 py-1.5 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Weapons Section Filters */}
          {currentSection === "weapons" && (
            <>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Weapon Type
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {WEAPON_TYPES.map((type) => {
                    const isSelected = selectedWeaponType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedWeaponType(isSelected ? null : type)}
                        className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-500/15 border-amber-500/80 shadow-xs"
                            : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        }`}
                        title={type}
                      >
                        <WeaponIcon weapon={type} className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Rarity
                </span>
                <div className="flex gap-1">
                  {[5, 4, 3].map((stars) => {
                    const isSelected = selectedWeaponRarity === stars;
                    return (
                      <button
                        key={stars}
                        onClick={() => setSelectedWeaponRarity(isSelected ? null : stars)}
                        className={`flex-1 text-[10px] py-1 rounded-md border font-bold cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/80 text-amber-600 dark:text-amber-400"
                            : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        }`}
                      >
                        {stars}★
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Artifacts Section Filters */}
          {currentSection === "artifacts" && (
            <>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Drop Tier Range
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { stars: 5, label: "4★–5★" },
                    { stars: 4, label: "3★–4★" },
                    { stars: 3, label: "1★–3★" },
                  ].map((tier) => {
                    const isSelected = selectedArtifactRarity === tier.stars;
                    return (
                      <button
                        key={tier.stars}
                        onClick={() => setSelectedArtifactRarity(isSelected ? null : tier.stars)}
                        className={`text-[9px] py-1 rounded-md border font-bold cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/80 text-amber-600 dark:text-amber-400"
                            : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Role
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedArtifactSupport(selectedArtifactSupport === true ? null : true)}
                    className={`flex-1 text-[9px] py-1 rounded-md border font-bold cursor-pointer transition-all ${
                      selectedArtifactSupport === true
                        ? "bg-amber-500/10 border-amber-500/80 text-amber-600 dark:text-amber-400"
                        : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    🤝 Support
                  </button>
                  <button
                    onClick={() => setSelectedArtifactSupport(selectedArtifactSupport === false ? null : false)}
                    className={`flex-1 text-[9px] py-1 rounded-md border font-bold cursor-pointer transition-all ${
                      selectedArtifactSupport === false
                        ? "bg-amber-500/10 border-amber-500/80 text-amber-600 dark:text-amber-400"
                        : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    ⚔️ Wielder
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Characters Section Filters */}
          {currentSection === "characters" && (
            <>
              <div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Element
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {ELEMENTS.map((elem) => {
                    const isSelected = selectedCharElement === elem;
                    return (
                      <button
                        key={elem}
                        onClick={() => setSelectedCharElement(isSelected ? null : elem)}
                        className={`p-1 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-500/15 border-amber-500/80 shadow-xs"
                            : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        }`}
                        title={elem}
                      >
                        <ElementIcon element={elem} className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-bold text-red-500 dark:text-red-400 hover:underline cursor-pointer block w-full text-center pt-1"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Sub-item quick list for current section */}
      {!isCollapsed && (
        <div className="flex-1 space-y-0.5 overflow-y-auto no-scrollbar border-t border-gray-200/50 dark:border-zinc-800/50 pt-2">
          {currentSection === "weapons" && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-2 mb-1">
                Weapons ({filteredWeapons.length})
              </div>
              {filteredWeapons.slice(0, 100).map((w) => (
                <a
                  key={w.id}
                  href={`/wiki/weapons#weapon-${w.id}`}
                  className="flex items-center justify-between px-2 py-1 rounded text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <span className="truncate">{w.name}</span>
                  <div className="flex items-center gap-1 shrink-0 text-[10px] opacity-85">
                    <WeaponIcon weapon={w.type} className="w-3 h-3" />
                    <span className={getRarityTextColor(w.rarity)}>
                      {w.rarity}★
                    </span>
                  </div>
                </a>
              ))}
            </>
          )}

          {currentSection === "artifacts" && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-2 mb-1">
                Artifact Sets ({filteredArtifacts.length})
              </div>
              {filteredArtifacts.map((a) => (
                <a
                  key={a.id}
                  href={`/wiki/artifacts#artifact-${a.id}`}
                  className="flex items-center justify-between px-2 py-1 rounded text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors gap-2"
                >
                  <span className="truncate">{a.name}</span>
                  <ArtifactRarityPills artifact={a} />
                </a>
              ))}
            </>
          )}

          {currentSection === "characters" && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-2 mb-1">
                Characters ({filteredCharacters.length})
              </div>
              {filteredCharacters.map((c) => (
                <a
                  key={c.id}
                  href={`/wiki/characters#character-${c.id}`}
                  className="flex items-center justify-between px-2 py-1 rounded text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <span className="truncate">{c.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                    <span className={getRarityTextColor(c.rarity)}>{c.rarity}★</span>
                    <ElementIcon element={c.element} className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </>
          )}

          {currentSection === "reactions" && (
            <div className="p-2 text-xs text-gray-500 dark:text-zinc-400 space-y-1">
              <a href="/wiki/reactions#amplifying" className="block hover:text-amber-500">
                • Amplifying (Vape / Melt)
              </a>
              <a href="/wiki/reactions#catalyze" className="block hover:text-amber-500">
                • Catalyze (Quicken / Aggravate / Spread)
              </a>
              <a href="/wiki/reactions#transformative" className="block hover:text-amber-500">
                • Transformative (Swirl, Bloom, Overload)
              </a>
              <a href="/wiki/reactions#lunar" className="block hover:text-amber-500">
                • Lunar Reactions
              </a>
              <a href="/wiki/reactions#stellar" className="block hover:text-amber-500">
                • Stellar Reactions
              </a>
            </div>
          )}

          {currentSection === "mechanics" && (
            <div className="p-2 text-xs text-gray-500 dark:text-zinc-400 space-y-1">
              <a href="/wiki/mechanics#general-formula" className="block hover:text-amber-500">
                • General Damage Formula
              </a>
              <a href="/wiki/mechanics#defense" className="block hover:text-amber-500">
                • Enemy DEF Multiplier
              </a>
              <a href="/wiki/mechanics#resistance" className="block hover:text-amber-500">
                • Enemy RES Multiplier
              </a>
              <a href="/wiki/mechanics#bond-of-life" className="block hover:text-amber-500">
                • Bond of Life (BoL)
              </a>
              <a href="/wiki/mechanics#nightsoul" className="block hover:text-amber-500">
                • Nightsoul Mechanics
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

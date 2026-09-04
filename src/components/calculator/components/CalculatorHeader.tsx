"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance, SavedBuild, SavedRotation } from "../types";

interface CalculatorHeaderProps {
  config: CharacterConfig;
  fromCharacterId?: string | null;
  showExtraInfo: boolean;
  setShowExtraInfo: (val: boolean) => void;
  saveStatus: string | null;

  // Rotation / Combo
  rotationState: {
    rotations: SavedRotation[];
    activeRotationId: string;
    setActiveRotationId: (id: string) => void;
  };
  setIsRotationOpen: (val: boolean) => void;

  // Split View
  isSplitView: boolean;
  toggleSplitView: () => void;

  // External Weapon & Artifact Buffs
  instances: CalcInstance[];
  setIsWeaponModalOpen: (val: boolean) => void;
  setActiveWeaponModalSetupId: (id: string) => void;
  setIsArtifactModalOpen?: (val: boolean) => void;
  setActiveArtifactModalSetupId?: (id: string) => void;

  // Build persistence & Load
  activeBuildId: string | null;
  activeBuildName: string;
  savedBuildsList: SavedBuild[];
  isLoadDropdownOpen: boolean;
  setIsLoadDropdownOpen: (val: boolean) => void;
  setActiveBuildId: (id: string | null) => void;
  setActiveBuildName: (name: string) => void;
  loadBuild: (b: SavedBuild) => void;
  handleDeleteBuild: (e: React.MouseEvent, id: string) => void;

  // Save changes
  saveChanges: () => void;
  isSaving: boolean;
  isDirty: boolean;

  // Export & More Actions dropdown
  isExportDropdownOpen: boolean;
  setIsExportDropdownOpen: (val: boolean) => void;
  shareBuild: () => void;
  importBuild: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportAsJson: () => void;
  exportAsCsv: () => void;
  exportAsTxt: () => void;
  copyAsText: () => void;
  exportAsPdf: () => void;
  exportAsPng: () => void;
  setNewBuildName: (val: string) => void;
  setIsSaveModalOpen: (val: boolean) => void;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  config,
  fromCharacterId,
  showExtraInfo,
  setShowExtraInfo,
  saveStatus,
  rotationState,
  setIsRotationOpen,
  isSplitView,
  toggleSplitView,
  instances,
  setIsWeaponModalOpen,
  setActiveWeaponModalSetupId,
  setIsArtifactModalOpen,
  setActiveArtifactModalSetupId,
  activeBuildId,
  activeBuildName,
  savedBuildsList,
  isLoadDropdownOpen,
  setIsLoadDropdownOpen,
  setActiveBuildId,
  setActiveBuildName,
  loadBuild,
  handleDeleteBuild,
  saveChanges,
  isSaving,
  isDirty,
  isExportDropdownOpen,
  setIsExportDropdownOpen,
  shareBuild,
  importBuild,
  exportAsJson,
  exportAsCsv,
  exportAsTxt,
  copyAsText,
  exportAsPdf,
  exportAsPng,
  setNewBuildName,
  setIsSaveModalOpen,
}) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  // Close tools dropdown when clicking outside
  useEffect(() => {
    if (!isToolsDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".tools-dropdown-container")) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isToolsDropdownOpen]);

  // Compute active badges
  const activeWeaponBuffsCount = instances.reduce(
    (acc, inst) => acc + (inst.externalWeapons ?? []).filter((w) => w.enabled).length,
    0
  );
  const activeArtifactBuffsCount = instances.reduce(
    (acc, inst) => acc + (inst.externalArtifacts ?? []).filter((a) => a.enabled).length,
    0
  );
  const totalToolsBadge =
    (rotationState.rotations.length > 0 ? 1 : 0) +
    (activeWeaponBuffsCount > 0 ? 1 : 0) +
    (activeArtifactBuffsCount > 0 ? 1 : 0);

  return (
    <header className="mb-6 shrink-0 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4 flex-wrap gap-y-3">
      {/* Character Identity & Combo Selection */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{config.name}</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">Combo:</span>
            <select
              className="bg-transparent border-none text-xs font-semibold py-0.5 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
              value={rotationState.activeRotationId}
              onChange={(e) => rotationState.setActiveRotationId(e.target.value)}
            >
              {rotationState.rotations.map((r) => (
                <option key={r.id} value={r.id} className="bg-white dark:bg-zinc-950 text-black dark:text-white">
                  {r.name || "Untitled"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p
          onClick={() => setShowExtraInfo(!showExtraInfo)}
          className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer select-none truncate max-w-sm mt-0.5 flex items-center gap-1"
        >
          <span>
            {config.weapon} · {config.element} · Rarity: {config.rarity}★
          </span>
          <span className="text-gray-400">•</span>
          <span className="underline">{showExtraInfo ? "Hide info" : "Show character details"}</span>
          <span
            className={`inline-block transform transition-transform duration-200 text-gray-400 dark:text-zinc-500 font-mono text-xs ${
              showExtraInfo ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </p>
      </div>

      {/* Compact Toolbar Controls (Option B) */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
        {saveStatus && (
          <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium animate-pulse mr-1">
            {saveStatus}
          </span>
        )}

        {/* 1. Compact View Toggle (Split vs Column) */}
        <button
          onClick={toggleSplitView}
          className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 ${
            isSplitView
              ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold"
              : "border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
          }`}
          title={isSplitView ? "Switch to Column View" : "Switch to Split View (Top/Bottom)"}
        >
          <span className="text-sm leading-none">{isSplitView ? "🥞" : "◫"}</span>
          <span>{isSplitView ? "Column" : "Split"}</span>
        </button>

        {/* 2. Grouped Tools Dropdown (Rotation Builder, Weapon Buffs, Artifact Buffs, Support Editor) */}
        <div className="relative tools-dropdown-container">
          <button
            onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
            className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 ${
              isToolsDropdownOpen
                ? "border-amber-500/50 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                : "border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
            }`}
            title="Calculation tools (Rotation Builder, Weapon Buffs, Support Editor)"
          >
            <span>🛠️ Tools</span>
            {totalToolsBadge > 0 && (
              <span className="bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                {totalToolsBadge}
              </span>
            )}
            <span className="text-[10px] text-gray-400 font-mono">▼</span>
          </button>

          {isToolsDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 px-3 py-1.5 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-900 mb-1">
                CALCULATION TOOLS
              </div>

              {/* Rotation Builder */}
              <button
                onClick={() => {
                  setIsToolsDropdownOpen(false);
                  setIsRotationOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📋</span>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">Rotation Builder</div>
                    <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-normal">Combo steps & damage</div>
                  </div>
                </div>
                {rotationState.rotations.length > 0 && (
                  <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {rotationState.rotations.length}
                  </span>
                )}
              </button>

              {/* External Weapon Buffs */}
              {!fromCharacterId && (
                <button
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    setActiveWeaponModalSetupId(instances[0]?.id || "");
                    setIsWeaponModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚔️</span>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">Weapon Buffs</div>
                      <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-normal">Team & wielder weapons</div>
                    </div>
                  </div>
                  {activeWeaponBuffsCount > 0 && (
                    <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {activeWeaponBuffsCount}
                    </span>
                  )}
                </button>
              )}

              {/* External Artifact Buffs */}
              {!fromCharacterId && setIsArtifactModalOpen && (
                <button
                  onClick={() => {
                    setIsToolsDropdownOpen(false);
                    if (setActiveArtifactModalSetupId) setActiveArtifactModalSetupId(instances[0]?.id || "");
                    setIsArtifactModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer text-gray-700 dark:text-zinc-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏺</span>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">Artifact Buffs</div>
                      <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-normal">Team & 4pc artifact sets</div>
                    </div>
                  </div>
                  {activeArtifactBuffsCount > 0 && (
                    <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                      {activeArtifactBuffsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Dedicated Support Build Editor Link */}
              <div className="border-t border-gray-150 dark:border-zinc-850 my-1"></div>
              <Link
                href={`/characters/${config.id}/support${fromCharacterId ? `?from=${fromCharacterId}` : ""}`}
                onClick={() => setIsToolsDropdownOpen(false)}
                className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-700 dark:text-amber-300 transition-colors flex items-center justify-between cursor-pointer"
                title="Open dedicated Support Build Editor"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🛡️</span>
                  <div>
                    <div className="font-semibold">Support Editor</div>
                    <div className="text-[10px] text-amber-600/70 dark:text-amber-400/70 font-normal">
                      Standalone support builder
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold">↗</span>
              </Link>
            </div>
          )}
        </div>

        {/* 3. Build / Setup Selector (character setup n) */}
        <div className="relative load-dropdown-container">
          <button
            onClick={() => setIsLoadDropdownOpen(!isLoadDropdownOpen)}
            className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 max-w-[170px] ${
              isLoadDropdownOpen
                ? "border-amber-500/50 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                : "border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
            }`}
            title="Load a saved build from database"
          >
            <span className="truncate">📂 {activeBuildName}</span>
            <span className="text-[10px] text-gray-400 font-mono shrink-0">▼</span>
          </button>
          {isLoadDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-y-auto">
              <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 px-3 py-1.5 border-b border-gray-100 dark:border-zinc-900 mb-1">
                SELECT SAVED BUILD
              </div>
              <button
                onClick={() => {
                  setActiveBuildId(null);
                  setActiveBuildName("Scratchpad");
                  setIsLoadDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer ${
                  !activeBuildId ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 font-bold" : "text-gray-700 dark:text-zinc-300"
                }`}
              >
                <span>📝 New Scratchpad Setup</span>
              </button>
              {savedBuildsList.length === 0 ? (
                <div className="text-xs text-gray-400 dark:text-zinc-600 px-3 py-2 italic text-center">
                  No saved builds yet
                </div>
              ) : (
                savedBuildsList.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => loadBuild(b)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between cursor-pointer ${
                      activeBuildId === b.id
                        ? "text-amber-600 dark:text-amber-400 bg-amber-500/5 font-bold"
                        : "text-gray-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate max-w-[125px]" title={b.name}>
                        {b.name}
                      </span>
                      {b.isOffline ? (
                        <span className="text-[8px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1 py-0.5 border border-zinc-200 dark:border-zinc-700/60 rounded font-mono">
                          Local
                        </span>
                      ) : (
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 border border-emerald-500/15 rounded font-mono">
                          Cloud
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteBuild(e, b.id)}
                      className="text-zinc-400 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                      title="Delete this build configuration"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4. Save Changes Action */}
        <button
          onClick={saveChanges}
          disabled={isSaving}
          className={
            isDirty
              ? "rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 px-3 py-2 text-xs font-semibold text-white dark:text-zinc-950 transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              : "rounded-lg border border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-2 text-xs font-semibold text-black dark:text-white transition-all shadow-2xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          }
          title="Save changes to active build"
        >
          <span>{isSaving ? "⏳" : "💾"}</span>
          <span>{activeBuildId ? "Save Changes" : "Save Setup"}</span>
          {isDirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          )}
        </button>

        {/* 5. Categorized More Actions / Export Dropdown */}
        <div className="relative export-dropdown-container">
          <button
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer flex items-center gap-1 ${
              isExportDropdownOpen
                ? "border-amber-500/50 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                : "border-gray-300 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
            }`}
            title="Actions & Export options"
          >
            <span>⋯ Actions</span>
            <span className="text-[10px] text-gray-400 font-mono">▼</span>
          </button>

          {isExportDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-1 duration-100">
              {/* Category 1: Build Setup */}
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-3 py-1">
                Build Setup
              </div>
              <button
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  shareBuild();
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">🔗</span> Share Build Link
              </button>
              <button
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  document.getElementById("json-import-input")?.click();
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">📥</span> Import JSON Setup
              </button>
              {activeBuildId && (
                <button
                  onClick={() => {
                    setIsExportDropdownOpen(false);
                    setNewBuildName(`${activeBuildName} Copy`);
                    setIsSaveModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
                  title="Save current configuration as a new separate database entry"
                >
                  <span className="text-zinc-400 text-sm">💾</span> Save As New Setup
                </button>
              )}

              {/* Category 2: Data & Reports */}
              <div className="border-t border-gray-150 dark:border-zinc-850 my-1.5"></div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-3 py-1">
                Data & Reports
              </div>
              <button
                onClick={exportAsJson}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">📦</span> Export JSON (.json)
              </button>
              <button
                onClick={exportAsCsv}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">📊</span> Export CSV (.csv)
              </button>
              <button
                onClick={exportAsTxt}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">📄</span> Export TXT (.txt)
              </button>
              <button
                onClick={copyAsText}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">📋</span> Copy as text
              </button>

              {/* Category 3: Visual Snapshot */}
              <div className="border-t border-gray-150 dark:border-zinc-850 my-1.5"></div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-3 py-1">
                Visual Snapshot
              </div>
              <button
                onClick={exportAsPdf}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">🖨️</span> Save as PDF (.pdf)
              </button>
              <button
                onClick={exportAsPng}
                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <span className="text-zinc-400 text-sm">🖼️</span> Download PNG (.png)
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input for JSON Setup Import */}
        <input
          id="json-import-input"
          type="file"
          accept=".json"
          onChange={importBuild}
          className="hidden"
        />
      </div>
    </header>
  );
};

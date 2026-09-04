import React, { useState, useRef } from "react";
import type { StatBuffSource } from "../types";
import { getRarityTheme } from "../rarity-theme";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface StatBreakdownRowProps {
  name: string;
  unit: "flat" | "percent" | "multiplier";
  raw: number;
  additions: StatBuffSource[];
  total: number;
  hideIfZero?: boolean;
  hasExternalBuffs?: boolean;
  statKey?: string;
  onRedirect?: (targetAnchorId: string) => void;
}

export const StatBreakdownRow: React.FC<StatBreakdownRowProps> = ({
  name,
  unit,
  raw,
  additions,
  total,
  hideIfZero,
  hasExternalBuffs,
  statKey,
  onRedirect,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // If hideIfZero is true and total is virtually zero, don't render
  if (hideIfZero && Math.abs(total) < 0.05) {
    return null;
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 200);
  };

  const handleRedirect = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onRedirect && statKey) {
      onRedirect(`stat-${statKey}`);
    } else {
      setShowTooltip((prev) => !prev);
    }
  };

  const formatVal = (v: number) => {
    if (unit === "percent") return `${v.toFixed(1)}%`;
    if (unit === "multiplier") return `${v.toFixed(2)}x`;
    return fmt(v);
  };

  const formatSignedAdd = (v: number) => {
    const prefix = v >= 0 ? "+" : "−";
    const absV = Math.abs(v);
    if (unit === "percent") return `${prefix}${absV.toFixed(1)}%`;
    if (unit === "multiplier") return `${prefix}${absV.toFixed(2)}x`;
    return `${prefix}${fmt(absV)}`;
  };

  // Determine displayed additions terms (max 3 displayed terms)
  const maxVisibleAdditions = 3;
  const isTruncated = additions.length > maxVisibleAdditions;
  const visibleAdditions = isTruncated
    ? additions.slice(0, maxVisibleAdditions)
    : additions;

  const isExternal = (add: StatBuffSource) =>
    add.type === "external" ||
    add.category === "team" ||
    add.category === "weapon" ||
    add.category === "artifact" ||
    add.source.includes("(Team)") ||
    add.source.includes("(Weapon)") ||
    add.source.includes("(Artifact)");

  const externalAdditions = additions.filter(isExternal);
  const internalAdditions = additions.filter((a) => !isExternal(a));

  return (
    <div
      className={`flex items-center justify-between gap-3 text-xs py-1.5 px-2.5 rounded-lg border transition-colors group relative select-none ${
        hasExternalBuffs
          ? "border-amber-400/40 dark:border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10 hover:bg-amber-50/40 dark:hover:bg-amber-950/20"
          : "border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 hover:bg-white/80 dark:hover:bg-zinc-900/60"
      }`}
    >
      {/* Name with External Buff Indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        {hasExternalBuffs && (
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 ring-2 ring-amber-400/30"
            title="Augmented by external support buffs"
          />
        )}
        <span
          className={`font-semibold ${
            hasExternalBuffs
              ? "text-amber-900 dark:text-amber-200"
              : "text-gray-700 dark:text-zinc-300"
          }`}
        >
          {name}
        </span>
      </div>

      {/* Math Expression: <raw> + <add1> + <add2> = <total> */}
      <div className="flex items-center gap-1.5 font-mono tabular-nums text-right flex-wrap justify-end">
        <span className="text-gray-500 dark:text-zinc-400">
          {formatVal(raw)}
        </span>

        {visibleAdditions.map((add, i) => {
          const ext = isExternal(add);
          return (
            <span
              key={i}
              className={`font-semibold ${
                ext
                  ? "text-amber-600 dark:text-amber-400 font-bold"
                  : "text-sky-600 dark:text-sky-400"
              }`}
              title={`${add.source}: ${formatSignedAdd(add.value)}`}
            >
              {formatSignedAdd(add.value)}
            </span>
          );
        })}

        {isTruncated && (
          <span
            className="text-amber-500 dark:text-amber-400 font-bold"
            title={`${additions.length - maxVisibleAdditions} more addition(s) not displayed`}
          >
            + ...
          </span>
        )}

        <span className="text-gray-400 dark:text-zinc-500 font-sans">=</span>

        <span
          className={`font-extrabold ${
            hasExternalBuffs
              ? "text-amber-950 dark:text-amber-100"
              : "text-black dark:text-white"
          }`}
        >
          {formatVal(total)}
        </span>

        {/* Question Mark Logo / Chat-Cloud Tooltip Button */}
        <div
          className="relative inline-block ml-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            onClick={handleRedirect}
            className={`w-4 h-4 rounded-full font-bold text-[10px] flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
              hasExternalBuffs
                ? "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-500 hover:text-white"
                : "bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-black text-gray-600 dark:text-zinc-300"
            }`}
            aria-label={`View sources for ${name}`}
            title={onRedirect && statKey ? `Click to jump directly to ${name} breakdown` : `View sources for ${name}`}
          >
            ?
          </button>

          {/* Chat Cloud Speech Bubble Popover */}
          {showTooltip && (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="absolute right-0 bottom-full mb-2 w-80 z-50 p-3 rounded-xl bg-zinc-900/95 dark:bg-zinc-950/95 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
            >
              {/* Speech bubble arrow point */}
              <div className="absolute right-1.5 -bottom-1.5 w-3 h-3 bg-zinc-900 dark:bg-zinc-950 border-r border-b border-zinc-700/80 transform rotate-45"></div>

              <div className="space-y-2.5">
                <div className="border-b border-zinc-800 pb-1.5 flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-amber-400">
                      {name} Breakdown
                    </span>
                    {hasExternalBuffs && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        External Buffed
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Total: {formatVal(total)}
                  </span>
                </div>

                {/* Raw Input Baseline */}
                <div className="flex justify-between items-start text-[11px] font-sans">
                  <span className="text-zinc-400">📥 Base / Raw Inputs:</span>
                  <span className="font-mono text-white font-semibold">
                    {formatVal(raw)}
                  </span>
                </div>

                {/* External Support Buffs Section */}
                {externalAdditions.length > 0 && (
                  <div className="space-y-1 border-t border-zinc-800/80 pt-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <span>👥</span>
                      <span>External Support Buffs:</span>
                    </span>
                    <ul className="space-y-1 text-[11px] font-sans">
                      {externalAdditions.map((add, i) => {
                        const theme = getRarityTheme(add.rarity ?? 5);
                        return (
                          <li
                            key={i}
                            className="flex flex-col gap-0.5 bg-zinc-900/60 p-1.5 rounded border border-zinc-800"
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-semibold text-amber-300 flex items-center gap-1 flex-wrap">
                                <span>✨ {add.source}</span>
                                {add.rarity && (
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${theme.badge}`}>
                                    {add.rarity}★
                                  </span>
                                )}
                              </span>
                              <span className="font-mono text-amber-400 font-extrabold shrink-0">
                                {formatSignedAdd(add.value)}
                              </span>
                            </div>
                            {add.description && (
                              <p className="text-[10px] text-zinc-400 leading-tight italic">
                                {add.description}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Internal Mechanics & Constellations Section */}
                {internalAdditions.length > 0 && (
                  <div className="space-y-1 border-t border-zinc-800/80 pt-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                      <span>⚙️</span>
                      <span>Character Mechanics & Constellations:</span>
                    </span>
                    <ul className="space-y-1 text-[11px] font-sans">
                      {internalAdditions.map((add, i) => (
                        <li
                          key={i}
                          className="flex flex-col gap-0.5 bg-zinc-900/40 p-1.5 rounded border border-zinc-800/60"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-semibold text-zinc-200">
                              • {add.source}
                            </span>
                            <span className="font-mono text-emerald-400 font-bold shrink-0">
                              {formatSignedAdd(add.value)}
                            </span>
                          </div>
                          {add.description && (
                            <p className="text-[10px] text-zinc-400 leading-tight italic">
                              {add.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {onRedirect && statKey && (
                  <button
                    type="button"
                    onClick={handleRedirect}
                    className="w-full mt-2 py-1 px-2 text-[10px] font-bold text-center rounded bg-amber-500 hover:bg-amber-600 text-black transition-colors cursor-pointer"
                  >
                    Redirect to {name} Breakdown →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

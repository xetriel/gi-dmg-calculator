import React, { useState } from "react";
import type { StatBuffSource } from "../types";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface StatBreakdownRowProps {
  name: string;
  unit: "flat" | "percent" | "multiplier";
  raw: number;
  additions: StatBuffSource[];
  total: number;
  hideIfZero?: boolean;
}

export const StatBreakdownRow: React.FC<StatBreakdownRowProps> = ({
  name,
  unit,
  raw,
  additions,
  total,
  hideIfZero,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // If hideIfZero is true and total is virtually zero, don't render
  if (hideIfZero && Math.abs(total) < 0.05) {
    return null;
  }

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

  return (
    <div className="flex items-center justify-between gap-3 text-xs py-1.5 px-2.5 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 hover:bg-white/80 dark:hover:bg-zinc-900/60 transition-colors group relative select-none">
      {/* Name */}
      <span className="font-semibold text-gray-700 dark:text-zinc-300 shrink-0">
        {name}
      </span>

      {/* Math Expression: <raw> + <add1> + <add2> = <total> */}
      <div className="flex items-center gap-1.5 font-mono tabular-nums text-right flex-wrap justify-end">
        <span className="text-gray-500 dark:text-zinc-400">
          {formatVal(raw)}
        </span>

        {visibleAdditions.map((add, i) => (
          <span
            key={i}
            className="text-amber-600 dark:text-amber-400 font-semibold"
            title={`${add.source}: ${formatSignedAdd(add.value)}`}
          >
            {formatSignedAdd(add.value)}
          </span>
        ))}

        {isTruncated && (
          <span
            className="text-amber-500 dark:text-amber-400 font-bold"
            title={`${additions.length - maxVisibleAdditions} more addition(s) not displayed`}
          >
            + ...
          </span>
        )}

        <span className="text-gray-400 dark:text-zinc-500 font-sans">=</span>

        <span className="font-extrabold text-black dark:text-white">
          {formatVal(total)}
        </span>

        {/* Question Mark Logo / Chat-Cloud Tooltip Button */}
        <div
          className="relative inline-block ml-1"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            type="button"
            onClick={() => setShowTooltip(!showTooltip)}
            className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-black text-gray-600 dark:text-zinc-300 font-bold text-[10px] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            aria-label={`View sources for ${name}`}
          >
            ?
          </button>

          {/* Chat Cloud Speech Bubble Popover */}
          {showTooltip && (
            <div className="absolute right-0 bottom-full mb-2 w-72 z-50 p-3 rounded-xl bg-zinc-900/95 dark:bg-zinc-950/95 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
              {/* Speech bubble arrow point */}
              <div className="absolute right-1.5 -bottom-1.5 w-3 h-3 bg-zinc-900 dark:bg-zinc-950 border-r border-b border-zinc-700/80 transform rotate-45"></div>

              <div className="space-y-2">
                <div className="border-b border-zinc-800 pb-1 flex items-center justify-between">
                  <span className="font-semibold text-xs text-amber-400">
                    {name} Breakdown
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Total: {formatVal(total)}
                  </span>
                </div>

                {/* Sources List */}
                <ul className="space-y-1.5 text-[11px] font-sans">
                  <li className="flex justify-between items-start gap-2">
                    <span className="text-zinc-400">📥 Base / Raw Inputs:</span>
                    <span className="font-mono text-white font-semibold">
                      {formatVal(raw)}
                    </span>
                  </li>

                  {additions.map((add, i) => (
                    <li key={i} className="flex flex-col gap-0.5 border-t border-zinc-800/60 pt-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-amber-300">
                          ✨ {add.source}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

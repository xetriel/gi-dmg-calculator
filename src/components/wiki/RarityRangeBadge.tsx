import React from "react";
import type { ArtifactConfig, ArtifactRarityRange } from "@/data/registry/artifacts/types";
import { getArtifactRarityRange } from "@/data/registry/artifacts/types";

interface RarityRangeBadgeProps {
  artifact?: ArtifactConfig;
  range?: ArtifactRarityRange;
  className?: string;
  showText?: boolean;
}

export function RarityRangeBadge({
  artifact,
  range,
  className = "",
  showText = true,
}: RarityRangeBadgeProps) {
  const [min, max] = range ?? (artifact ? getArtifactRarityRange(artifact) : [5, 5]);

  if (min === max) {
    // Single rarity
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
          max === 5
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            : max === 4
            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
            : max === 3
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
            : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30"
        } ${className}`}
      >
        <span className="tracking-widest select-none">{"★".repeat(max)}</span>
        {showText && <span className="font-mono text-[9px] opacity-85">({max}★)</span>}
      </span>
    );
  }

  // Dual tier range (e.g. 4★-5★, 3★-4★, 1★-3★)
  const isFiveStarRange = max === 5 && min === 4;
  const isFourStarRange = max === 4 && min === 3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
        isFiveStarRange
          ? "bg-gradient-to-r from-purple-500/10 via-amber-500/15 to-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 shadow-xs"
          : isFourStarRange
          ? "bg-gradient-to-r from-blue-500/10 via-purple-500/15 to-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40 shadow-xs"
          : "bg-gradient-to-r from-zinc-500/10 to-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
      } ${className}`}
      title={`Acquisition Tiers: ${min}-Star to ${max}-Star`}
    >
      <span className="tracking-tighter select-none font-mono">
        {"★".repeat(min)}–{"★".repeat(max)}
      </span>
      {showText && (
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-black/10 dark:bg-white/10">
          {min}★–{max}★
        </span>
      )}
    </span>
  );
}

import React, { useState, useRef } from "react";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface HitFormulaTooltipProps {
  hitName: string;
  targetAnchorId: string; // e.g. "hit-0:4", "tr-overloaded", "lunar-lunar-charged"
  nonCrit?: number;
  crit?: number;
  avg?: number;
  onFormulaRedirect: (targetAnchorId: string) => void;
}

export const HitFormulaTooltip: React.FC<HitFormulaTooltipProps> = ({
  hitName,
  targetAnchorId,
  nonCrit,
  crit,
  avg,
  onFormulaRedirect,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    onFormulaRedirect(targetAnchorId);
  };

  return (
    <div
      className="relative inline-block ml-1 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleRedirect}
        className="w-3.5 h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-black text-gray-600 dark:text-zinc-300 font-bold text-[9px] inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs"
        aria-label={`View formula for ${hitName}`}
        title={`Click to jump directly to ${hitName} formula section`}
      >
        ?
      </button>

      {/* Chat Cloud Speech Bubble Popover */}
      {showTooltip && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 bottom-full mb-2 w-64 z-50 p-3 rounded-xl bg-zinc-900/95 dark:bg-zinc-950/95 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
        >
          {/* Speech bubble arrow point */}
          <div className="absolute left-2.5 -bottom-1.5 w-3 h-3 bg-zinc-900 dark:bg-zinc-950 border-r border-b border-zinc-700/80 transform rotate-45"></div>

          <div className="space-y-2">
            <div className="border-b border-zinc-800 pb-1 flex items-center justify-between">
              <span className="font-semibold text-xs text-amber-400">
                {hitName} Formula
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                #{targetAnchorId}
              </span>
            </div>

            {nonCrit != null && (
              <div className="text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Non-Crit:</span>
                  <span className="text-zinc-200 font-semibold">{fmt(nonCrit)}</span>
                </div>
                {crit != null && (
                  <div className="flex justify-between">
                    <span className="text-amber-400">CRIT DMG:</span>
                    <span className="text-amber-300 font-bold">{fmt(crit)}</span>
                  </div>
                )}
                {avg != null && (
                  <div className="flex justify-between border-t border-zinc-800 pt-1">
                    <span className="text-emerald-400">Average DMG:</span>
                    <span className="text-emerald-300 font-extrabold">{fmt(avg)}</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleRedirect}
              className="w-full mt-1.5 py-1 px-2 text-[10px] font-bold text-center rounded bg-amber-500 hover:bg-amber-600 text-black transition-colors cursor-pointer"
            >
              Redirect to {hitName} Formula →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

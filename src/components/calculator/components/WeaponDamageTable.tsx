import React from "react";
import type { HitResult } from "@/lib/engine/damage";
import { DMG_COLORS } from "../utils/colors";

export interface ResolvedWeaponHit {
  id: string;
  weaponId: string;
  weaponName: string;
  weaponRarity: number;
  refinement: number;
  hitName: string;
  element: string;
  scaling: "atk" | "hp" | "def";
  multiplier: number;
  result: HitResult;
  conditionLabel?: string;
}

interface WeaponDamageTableProps {
  weaponHits: ResolvedWeaponHit[];
  benchmarkWeaponHits?: ResolvedWeaponHit[];
  showPct?: boolean;
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export const WeaponDamageTable: React.FC<WeaponDamageTableProps> = ({
  weaponHits,
  benchmarkWeaponHits,
  showPct,
}) => {
  if (!weaponHits || weaponHits.length === 0) return null;

  const benchmarkMap = new Map<string, HitResult>();
  if (benchmarkWeaponHits) {
    for (const b of benchmarkWeaponHits) {
      benchmarkMap.set(b.id, b.result);
    }
  }

  const renderPct = (currentVal: number, benchmarkVal: number | undefined) => {
    if (!showPct || benchmarkVal === undefined || benchmarkVal === 0) return null;
    const pct = (currentVal / benchmarkVal) * 100;

    let colorClass = "text-gray-400 dark:text-zinc-500";
    if (pct < 99.95) {
      colorClass = "text-red-500 dark:text-red-400 font-semibold";
    } else if (pct > 100.05) {
      colorClass = "text-green-500 dark:text-green-400 font-semibold";
    }

    return (
      <span className={`text-[10px] leading-none select-none ${colorClass}`}>
        {pct.toFixed(1)}%
      </span>
    );
  };

  const physColor = DMG_COLORS["Physical"] || "#94a3b8";

  return (
    <section className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            ⚔️ Weapon Passive DMG
          </h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
            Independent Procs
          </span>
        </div>
      </div>

      <table className="w-full text-xs mt-2 border-collapse">
        <thead>
          <tr className="border-b border-gray-200/80 dark:border-zinc-700/60 text-gray-500 dark:text-zinc-400 text-[11px]">
            <th className="text-left font-medium py-1.5 pl-1">Hit</th>
            <th className="text-right font-medium py-1.5 pr-2 w-20">Non-Crit</th>
            <th className="text-right font-medium py-1.5 pr-2 w-20">CRIT</th>
            <th className="text-right font-medium py-1.5 pr-1 w-24">Avg.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
          {weaponHits.map((h) => {
            const bench = benchmarkMap.get(h.id);
            const res = h.result;

            return (
              <tr
                key={h.id}
                className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td className="py-2 pl-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: physColor }}
                    />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {h.hitName}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.2 rounded font-mono"
                      style={{
                        backgroundColor: `${physColor}20`,
                        color: physColor,
                        border: `1px solid ${physColor}40`,
                      }}
                    >
                      {h.element}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-zinc-500 pl-3">
                    {h.weaponName} (R{h.refinement}) • {h.multiplier}% {h.scaling.toUpperCase()}
                    {h.conditionLabel ? ` • ${h.conditionLabel}` : ""}
                  </div>
                </td>

                <td
                  className="py-2 pr-2 text-right tabular-nums font-mono"
                  style={{ color: physColor }}
                >
                  <div className="flex flex-col items-end">
                    <span>{fmt(res.nonCrit)}</span>
                    {renderPct(res.nonCrit, bench?.nonCrit)}
                  </div>
                </td>

                <td
                  className="py-2 pr-2 text-right tabular-nums font-mono"
                  style={{ color: physColor }}
                >
                  <div className="flex flex-col items-end">
                    <span>{fmt(res.crit)}</span>
                    {renderPct(res.crit, bench?.crit)}
                  </div>
                </td>

                <td
                  className="py-2 pr-1 text-right tabular-nums font-semibold font-mono"
                  style={{ color: physColor }}
                >
                  <div className="flex flex-col items-end">
                    <span>{fmt(res.avg)}</span>
                    {renderPct(res.avg, bench?.avg)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

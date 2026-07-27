import React from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { HitResult } from "@/lib/engine/damage";
import type { TalentScalingData } from "@/lib/talent-scaling";
import type { CalcInstance } from "../types";
import { hitId, effectiveTalentLevels, type validate } from "@/lib/engine/validation";
import { getHitColor, DMG_COLORS } from "../utils/colors";

const DIRECT_TAG: Record<"stellar" | "lunar", { label: string; cls: string; title: string }> = {
  stellar: {
    label: "Stellar",
    cls: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300",
    title: "Stellar-Conduct reaction DMG: ignores DMG Bonus% and enemy DEF; EM bonus 6·EM/(EM+2000)",
  },
  lunar: {
    label: "Lunar",
    cls: "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300",
    title: "Lunar-Crystallize reaction DMG: ignores DMG Bonus% and enemy DEF; EM bonus 6·EM/(EM+2000)",
  },
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

import { HitFormulaTooltip } from "./HitFormulaTooltip";

interface DamageTableProps {
  inst: CalcInstance;
  config: CharacterConfig;
  scaling: TalentScalingData;
  results: Record<string, HitResult> | null;
  benchmarkResults: Record<string, HitResult> | null | undefined;
  showPct: boolean;
  validation: ReturnType<typeof validate>;
  setLevel: (instId: string, type: string, v: string) => void;
  setHit: (instId: string, hitId: string, v: string) => void;
  onFormulaRedirect?: (targetAnchorId: string) => void;
}

export const DamageTable: React.FC<DamageTableProps> = ({
  inst,
  config,
  scaling,
  results,
  benchmarkResults,
  showPct,
  validation,
  setLevel,
  setHit,
  onFormulaRedirect,
}) => {
  const err = (id: string) => validation.errors[id];
  const effLevels = effectiveTalentLevels(
    config,
    scaling,
    inst.levels,
    inst.constellationLevel,
    inst.mechanicInputs
  );
  
  const inputCls = (id: string, w: string) =>
    `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${
      err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""
    }`;

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

  return (
    <>
      {config.talents.map((g, gi) => {
        const s = scaling[g.type];
        const baseLevel = s ? Number(inst.levels[g.type]) : NaN;
        const effLevel = effLevels[g.type];
        const bonusLvl = Number.isFinite(effLevel) && Number.isFinite(baseLevel) ? effLevel - baseLevel : 0;

        return (
          <section key={g.name} className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-zinc-800 pb-1">
              <h3 className="font-semibold text-sm">{g.name}</h3>
              {s && s.levels.length ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>Lv.</span>
                  <select
                    className="border border-gray-250 dark:border-zinc-700 rounded px-1.5 py-0.5 text-xs bg-white dark:bg-zinc-800 text-black dark:text-white"
                    value={inst.levels[g.type] ?? ""}
                    onChange={(e) => setLevel(inst.id, g.type, e.target.value)}
                  >
                    {s.levels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  {bonusLvl > 0 ? (
                    <span
                      className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 select-none"
                      title={`+${bonusLvl} from Constellations (Effective Level ${effLevel})`}
                    >
                      +{bonusLvl} (Lv.{effLevel})
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <table className="mt-1 w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="py-1.5 font-normal">Hit</th>
                  <th className="py-1.5 font-normal text-right">Mult %</th>
                  {results ? (
                    <>
                      <th className="py-1.5 pr-1 text-right font-normal">Non-Crit</th>
                      <th className="py-1.5 pr-1 text-right font-normal">CRIT</th>
                      <th className="py-1.5 text-right font-normal">Avg</th>
                    </>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {g.hits.map((h, hi) => {
                  const id = hitId(gi, hi);
                  const res = results?.[id];
                  const levelVal = s && effLevel ? s.byLevel[effLevel]?.[h.key] : undefined;
                  const isHeal = h.kind === "heal";
                  const isShield = h.kind === "shield";
                  const isInactive = h.minConstellation != null && inst.constellationLevel < h.minConstellation;

                  return (
                    <tr
                      key={id}
                      className={`border-t border-gray-100 dark:border-zinc-800/60 ${
                        isHeal ? "bg-emerald-50/40 dark:bg-emerald-950/10" : isShield ? "bg-blue-50/40 dark:bg-blue-950/10" : isInactive ? "opacity-60 bg-gray-50/30 dark:bg-zinc-900/30" : ""
                      }`}
                    >
                      <td className="py-1.5 text-gray-700 dark:text-gray-300 font-medium">
                        {h.name}{" "}
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          ({isHeal ? "HEAL" : isShield ? "SHIELD" : h.scaling.toUpperCase()})
                        </span>
                        {h.direct ? (
                          <span
                            className="ml-1 text-[9px] font-bold uppercase tracking-wider rounded px-1 py-0.5 border"
                            style={{
                              backgroundColor: h.direct === "stellar" ? "rgba(228, 209, 255, 0.15)" : "rgba(255, 242, 186, 0.15)",
                              borderColor: h.direct === "stellar" ? "rgba(228, 209, 255, 0.3)" : "rgba(255, 242, 186, 0.3)",
                              color: h.direct === "stellar" ? "rgb(180, 150, 220)" : "rgb(210, 170, 70)",
                            }}
                            title={DIRECT_TAG[h.direct].title}
                          >
                            {DIRECT_TAG[h.direct].label}
                          </span>
                        ) : null}
                        {onFormulaRedirect && !isHeal && !isShield && (
                          <HitFormulaTooltip
                            hitName={h.name}
                            targetAnchorId={`hit-${id}`}
                            nonCrit={isInactive ? undefined : res?.nonCrit}
                            crit={isInactive ? undefined : res?.crit}
                            avg={isInactive ? undefined : res?.avg}
                            onFormulaRedirect={onFormulaRedirect}
                          />
                        )}
                      </td>
                      <td className="py-1.5 text-right font-mono text-gray-600 dark:text-gray-400">
                        {levelVal != null ? (
                          <span title={`Talent Lv. ${effLevel}${bonusLvl > 0 ? ` (+${bonusLvl} from Constellations)` : ""}`}>{levelVal}</span>
                        ) : (
                          <input
                            className={inputCls(id, "w-16 text-right")}
                            type="number"
                            placeholder="%"
                            value={inst.hits[id] ?? ""}
                            onChange={(e) => setHit(inst.id, id, e.target.value)}
                          />
                        )}
                      </td>
                      {results ? (
                        isInactive ? (
                          <td colSpan={3} className="py-1.5 text-right font-mono text-gray-400 dark:text-zinc-500 italic" title={`Requires Constellation ${h.minConstellation}`}>
                            —
                          </td>
                        ) : isHeal || isShield ? (
                          <td
                            colSpan={3}
                            className="py-1.5 text-right tabular-nums font-semibold"
                            style={{ color: isHeal ? DMG_COLORS["Heal-related"] : DMG_COLORS["Shield-related"] }}
                          >
                            {res ? (
                              <div className="flex flex-col items-end">
                                <span>{isHeal ? `+${fmt(res.nonCrit)} HP` : `${fmt(res.nonCrit)} Shield`}</span>
                                {renderPct(res.nonCrit, benchmarkResults?.[id]?.nonCrit)}
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                        ) : (() => {
                          const cellColor = res ? getHitColor(res.element ?? h.element ?? config.element, res.reaction, h.direct, h.name) : undefined;
                          const cellStyle = cellColor ? { color: cellColor } : undefined;
                          return (
                            <>
                              <td className="py-1.5 pr-1 text-right tabular-nums" style={cellStyle}>
                                {res ? (
                                  <div className="flex flex-col items-end">
                                    <span>{fmt(res.nonCrit)}</span>
                                    {renderPct(res.nonCrit, benchmarkResults?.[id]?.nonCrit)}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="py-1.5 pr-1 text-right tabular-nums" style={cellStyle}>
                                {res ? (
                                  <div className="flex flex-col items-end">
                                    <span>{fmt(res.crit)}</span>
                                    {renderPct(res.crit, benchmarkResults?.[id]?.crit)}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="py-1.5 text-right tabular-nums font-semibold" style={cellStyle}>
                                {res ? (
                                  <div className="flex flex-col items-end">
                                    <span>{fmt(res.avg)}</span>
                                    {renderPct(res.avg, benchmarkResults?.[id]?.avg)}
                                  </div>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </>
                          );
                        })()
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        );
      })}
    </>
  );
};

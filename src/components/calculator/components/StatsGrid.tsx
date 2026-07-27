import React from "react";
import type { CharacterConfig, StatField } from "@/data/registry/types";
import type { CalcInstance } from "../types";
import type { validate } from "@/lib/engine/validation";

const GROUPS: { key: StatField["group"]; label: string }[] = [
  { key: "base", label: "Base Stats" },
  { key: "combat", label: "Combat Stats" },
  { key: "advanced", label: "Advanced Stats" },
  { key: "lunar", label: "Lunar Reaction & Direct Stats" },
  { key: "defense", label: "Target Stats" },
];

interface StatsGridProps {
  inst: CalcInstance;
  config: CharacterConfig;
  validation: ReturnType<typeof validate>;
  setStat: (instId: string, statId: string, v: string) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  inst,
  config,
  validation,
  setStat,
}) => {
  const err = (id: string) => validation.errors[id];
  
  const inputCls = (id: string, w: string) =>
    `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${
      err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""
    }`;

  return (
    <>
      {GROUPS.map((group) => {
        const fields = config.stats.filter((f) => f.group === group.key);
        if (fields.length === 0) return null;
        return (
          <section key={group.key} className="mb-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {fields.map((f) => {
                const baseErr =
                  err(`${f.key}.base`) ||
                  err(`${f.key}.flat`) ||
                  err(`${f.key}.percent`);
                const singleErr = err(f.key);
                return (
                  <label
                    key={f.key}
                    className="flex flex-col gap-1 rounded-lg border border-gray-150 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/20 p-2.5 shadow-2xs transition-colors"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {f.label}
                      </span>
                      {f.hasBaseAndFlat ? (
                        <span className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end">
                          <input
                            className={inputCls(`${f.key}.base`, "w-20 sm:w-24 text-right font-mono")}
                            type="number"
                            placeholder="Base"
                            value={inst.stats[`${f.key}.base`] ?? ""}
                            onChange={(e) =>
                              setStat(inst.id, `${f.key}.base`, e.target.value)
                            }
                          />
                          <span className="text-gray-400 dark:text-gray-500 font-bold">+</span>
                          <div className="relative">
                            <input
                              className={inputCls(`${f.key}.percent`, "w-20 sm:w-24 pr-5 text-right font-mono")}
                              type="number"
                              placeholder="%"
                              value={inst.stats[`${f.key}.percent`] ?? ""}
                              onChange={(e) =>
                                setStat(
                                  inst.id,
                                  `${f.key}.percent`,
                                  e.target.value
                                )
                              }
                            />
                            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none select-none">
                              %
                            </span>
                          </div>
                          <span className="text-gray-400 dark:text-gray-500 font-bold">+</span>
                          <input
                            className={inputCls(`${f.key}.flat`, "w-20 sm:w-24 text-right font-mono")}
                            type="number"
                            placeholder="Flat"
                            value={inst.stats[`${f.key}.flat`] ?? ""}
                            onChange={(e) =>
                              setStat(inst.id, `${f.key}.flat`, e.target.value)
                            }
                          />
                        </span>
                      ) : (
                        <input
                          className={inputCls(f.key, "w-28 sm:w-32 text-right font-mono")}
                          type="number"
                          value={inst.stats[f.key] ?? ""}
                          onChange={(e) =>
                            setStat(inst.id, f.key, e.target.value)
                          }
                        />
                      )}
                    </span>
                    {f.hasBaseAndFlat ? (
                      (() => {
                        const base = Number(inst.stats[`${f.key}.base`]) || 0;
                        const pct = Number(inst.stats[`${f.key}.percent`]) || 0;
                        const flat = Number(inst.stats[`${f.key}.flat`]) || 0;
                        const increment = Math.round(base * (pct / 100));
                        const total = base + increment + flat;
                        return (
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800/50 p-1.5 rounded border border-gray-200 dark:border-zinc-700/50 mt-1 select-none flex justify-between">
                            <span>
                              {base} (Base) + {increment} ({pct}%) + {flat} (Flat)
                            </span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              = {total} (Total)
                            </span>
                          </div>
                        );
                      })()
                    ) : null}
                    {(f.hasBaseAndFlat ? baseErr : singleErr) ? (
                      <span className="text-xs text-red-600">
                        {f.hasBaseAndFlat ? baseErr : singleErr}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
};

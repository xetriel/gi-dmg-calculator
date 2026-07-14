import React from "react";
import type { CharacterConfig, MechanicDef } from "@/data/registry/types";
import type { CalcInstance } from "../types";
import type { validate } from "@/lib/engine/validation";

interface MechanicsPanelProps {
  inst: CalcInstance;
  config: CharacterConfig;
  validation: ReturnType<typeof validate>;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
  setMechanic: (instId: string, mechId: string, v: string) => void;
}

export const MechanicsPanel: React.FC<MechanicsPanelProps> = ({
  inst,
  config,
  validation,
  updateInstance,
  setMechanic,
}) => {
  const err = (id: string) => validation.errors[id];
  
  const inputCls = (id: string, w: string) =>
    `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${
      err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""
    }`;

  return (
    <>
      {/* Constellation selector */}
      {config.constellations?.length ? (
        <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Constellation
          </h2>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((lvl) => {
              const active = inst.constellationLevel >= lvl;
              const isInfo =
                lvl > 0 &&
                config.constellations!.find((c) => c.level === lvl)?.effects.every(
                  (e) => e.type === "informational"
                );
              return (
                <button
                  key={lvl}
                  onClick={() =>
                    updateInstance(inst.id, () => ({
                      constellationLevel:
                        inst.constellationLevel === lvl ? lvl - 1 : lvl,
                    }))
                  }
                  title={
                    lvl === 0
                      ? "No constellation"
                      : `C${lvl}: ${
                          config.constellations!.find((c) => c.level === lvl)
                            ?.name ?? ""
                        }`
                  }
                  className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer transition-all border ${
                    active
                      ? isInfo
                        ? "bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 border-zinc-400 dark:border-zinc-500"
                        : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                      : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                  }`}
                >
                  C{lvl}
                </button>
              );
            })}
          </div>
          {inst.constellationLevel > 0 && (
            <details className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 group">
              <summary className="cursor-pointer font-semibold list-none flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-350 select-none">
                <span>Show Constellation Details</span>
                <span className="text-[8px] transform group-open:rotate-180 transition-transform duration-200">
                  ▼
                </span>
              </summary>
              <div className="mt-1.5 space-y-1 pl-1 border-l border-zinc-200 dark:border-zinc-800">
                {config.constellations!
                  .filter((c) => c.level <= inst.constellationLevel)
                  .map((c) => (
                    <span key={c.level} className="block leading-normal">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">
                        C{c.level} ({c.name})
                      </span>
                      : {c.description}
                    </span>
                  ))}
              </div>
            </details>
          )}
        </div>
      ) : null}

      {/* Character mechanics */}
      {config.mechanicDefs?.length ? (
        <div className="mb-4 border-b border-gray-200 dark:border-zinc-800 pb-3">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Mechanics
          </h2>
          <div className="space-y-2">
            {config.mechanicDefs.map((m: MechanicDef) => {
              const val = inst.mechanicInputs[m.id] ?? "0";
              let isDisabled = false;
              if (config.id === "varka") {
                const isPyro = (inst.mechanicInputs["party-has-pyro"] ?? "1") === "1";
                const isHydro = (inst.mechanicInputs["party-has-hydro"] ?? "0") === "1";
                const isElectro = (inst.mechanicInputs["party-has-electro"] ?? "0") === "1";
                const isCryo = (inst.mechanicInputs["party-has-cryo"] ?? "0") === "1";
                const numChecked =
                  (isPyro ? 1 : 0) +
                  (isHydro ? 1 : 0) +
                  (isElectro ? 1 : 0) +
                  (isCryo ? 1 : 0);

                const isElementField = [
                  "party-has-pyro",
                  "party-has-hydro",
                  "party-has-electro",
                  "party-has-cryo",
                ].includes(m.id);
                const isChecked = val === "1";

                if (isElementField && !isChecked && numChecked >= 3) {
                  isDisabled = true;
                }
                if (m.id === "a1-resonance-tier2" && numChecked >= 2) {
                  isDisabled = true;
                }
                if (m.id === "a1-resonance-tier1" && numChecked >= 3) {
                  isDisabled = true;
                }
              }

              return (
                <div key={m.id} className="flex flex-col gap-1" title={m.hint}>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-xs font-medium ${
                        isDisabled
                          ? "text-gray-400 dark:text-gray-600"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {m.label}
                    </span>
                    {m.control === "toggle" ? (
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        checked={Number(val) > 0}
                        disabled={isDisabled}
                        onChange={(e) =>
                          setMechanic(inst.id, m.id, e.target.checked ? "1" : "0")
                        }
                      />
                    ) : m.control === "stacks" ? (
                      <div className="flex gap-1">
                        {Array.from({ length: (m.max ?? 3) + 1 }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setMechanic(inst.id, m.id, String(i))}
                            className={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer transition-all border ${
                              Number(val) === i
                                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                                : "bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600"
                            }`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        className={inputCls(`mech.${m.id}`, "w-20")}
                        type="number"
                        min={0}
                        max={m.max}
                        value={val}
                        onChange={(e) =>
                          setMechanic(inst.id, m.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                  {err(`mech.${m.id}`) ? (
                    <span className="text-xs text-red-600 text-right">
                      {err(`mech.${m.id}`)}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

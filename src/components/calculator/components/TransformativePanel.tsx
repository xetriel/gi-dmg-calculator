import React from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance, ReactionExtras } from "../types";
import type { validate } from "@/lib/engine/validation";
import { TRANSFORMATIVE_BY_ELEMENT, TRANSFORMATIVE_LABEL, type TransformativeType } from "@/lib/engine/transformative";
import { LUNAR_BY_ELEMENT, LUNAR_LABEL, type LunarType } from "@/lib/engine/lunar";
import { DMG_COLORS } from "../utils/colors";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface TransformativePanelProps {
  inst: CalcInstance;
  config: CharacterConfig;
  extras: ReactionExtras | null;
  validation: ReturnType<typeof validate>;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
}

export const TransformativePanel: React.FC<TransformativePanelProps> = ({
  inst,
  config,
  extras,
  validation,
  updateInstance,
}) => {
  const err = (id: string) => validation.errors[id];
  
  const inputCls = (id: string, w: string) =>
    `${w} border rounded px-2 py-0.5 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all ${
      err(id) ? "border-red-500 focus:ring-red-500 dark:border-red-500" : ""
    }`;

  const hasTransformative = TRANSFORMATIVE_BY_ELEMENT[config.element]?.length > 0;
  const hasLunar = LUNAR_BY_ELEMENT[config.element]?.length > 0;

  if (!hasTransformative && !hasLunar) return null;

  const getTransformativeColor = (type: TransformativeType): string => {
    switch (type) {
      case "burning": return DMG_COLORS["Burning"];
      case "swirl": {
        if (config.element === "Anemo") {
          if (Number(inst.mechanicInputs["party-has-pyro"]) > 0) return DMG_COLORS["Pyro"];
          if (Number(inst.mechanicInputs["party-has-hydro"]) > 0) return DMG_COLORS["Hydro"];
          if (Number(inst.mechanicInputs["party-has-electro"]) > 0) return DMG_COLORS["Electro"];
          if (Number(inst.mechanicInputs["party-has-cryo"]) > 0) return DMG_COLORS["Cryo"];
        }
        return DMG_COLORS["Anemo"];
      }
      case "superconduct": return DMG_COLORS["Superconduct"];
      case "electro-charged": return DMG_COLORS["Electro-Charged"];
      case "bloom": return DMG_COLORS["Bloom"];
      case "overloaded": return DMG_COLORS["Overloaded"];
      case "burgeon": return DMG_COLORS["Burgeon"];
      case "hyperbloom": return DMG_COLORS["Hyperbloom"];
      case "shatter": return DMG_COLORS["Shattered"];
      default: return "inherit";
    }
  };

  const getLunarColor = (type: LunarType): string => {
    switch (type) {
      case "lunar-charged": return DMG_COLORS["Lunar-Charged"];
      case "lunar-bloom": return DMG_COLORS["Lunar-Bloom"];
      case "lunar-crystallize": return DMG_COLORS["Lunar-Crystallize"];
      default: return "inherit";
    }
  };

  return (
    <section className="mt-5 border-t border-gray-200 dark:border-zinc-800 pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-sm">
          Reaction DMG ({config.element}-triggered)
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <label className="flex items-center gap-1">
            Bonus %
            <input
              className={inputCls("reactionPanelBonus", "w-14")}
              type="number"
              value={inst.reactionPanelBonus}
              onChange={(e) =>
                updateInstance(inst.id, () => ({
                  reactionPanelBonus: e.target.value,
                }))
              }
            />
          </label>
          {hasLunar ? (
            <label
              className="flex items-center gap-1"
              title="Lunar Reaction Base DMG Bonus (Moonsign Benediction passives)"
            >
              Lunar Base %
              <input
                className={inputCls("lunarBaseBonus", "w-14")}
                type="number"
                value={inst.lunarBaseBonus}
                onChange={(e) =>
                  updateInstance(inst.id, () => ({
                    lunarBaseBonus: e.target.value,
                  }))
                }
              />
            </label>
          ) : null}
        </div>
      </div>
      {extras ? (
        <table className="mt-1 w-full text-xs">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
              <th className="py-1.5 font-normal">Reaction</th>
              <th className="py-1.5 pr-1 text-right font-normal">Non-Crit</th>
              <th className="py-1.5 pr-1 text-right font-normal">CRIT</th>
              <th className="py-1.5 text-right font-normal">Avg</th>
            </tr>
          </thead>
          <tbody>
            {extras.transformative.map((t: { type: TransformativeType; dmg: number }) => {
              const color = getTransformativeColor(t.type);
              const label = t.type === "swirl" && config.element === "Anemo" ? (() => {
                const swirled = (() => {
                  if (Number(inst.mechanicInputs["party-has-pyro"]) > 0) return "Pyro";
                  if (Number(inst.mechanicInputs["party-has-hydro"]) > 0) return "Hydro";
                  if (Number(inst.mechanicInputs["party-has-electro"]) > 0) return "Electro";
                  if (Number(inst.mechanicInputs["party-has-cryo"]) > 0) return "Cryo";
                  return "";
                })();
                return swirled ? `${swirled} Swirl` : "Swirl";
              })() : TRANSFORMATIVE_LABEL[t.type];
              return (
                <tr
                  key={t.type}
                  className="border-t border-gray-100 dark:border-zinc-800/60"
                  style={{ color }}
                >
                  <td className="py-1.5 font-medium" style={{ color }}>
                    {label}
                  </td>
                  <td className="py-1.5 pr-1 text-right tabular-nums" colSpan={3}>
                    <span className="font-semibold">{fmt(t.dmg)}</span>
                    <span className="ml-1 text-[10px] text-gray-400">
                      (no crit)
                    </span>
                  </td>
                </tr>
              );
            })}
            {extras.lunar.map((l: { type: LunarType; res: any }) => {
              const color = getLunarColor(l.type);
              return (
                <tr
                  key={l.type}
                  className="border-t border-gray-100 dark:border-zinc-800/60"
                  style={{ color }}
                >
                  <td className="py-1.5 font-medium" style={{ color }}>
                    {LUNAR_LABEL[l.type]}
                  </td>
                  <td className="py-1.5 pr-1 text-right tabular-nums">
                    {fmt(l.res.nonCrit)}
                  </td>
                  <td className="py-1.5 pr-1 text-right tabular-nums">
                    {fmt(l.res.crit)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums font-semibold">
                    {fmt(l.res.avg)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="mt-1 text-[10px] text-gray-400">
          Fill the remaining fields to compute (scales with character level, EM,
          and enemy RES).
        </p>
      )}
    </section>
  );
};

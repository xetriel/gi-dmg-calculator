import React from "react";
import type { CharacterConfig } from "@/data/registry/types";
import type { CalcInstance, ReactionExtras } from "../types";
import type { validate } from "@/lib/engine/validation";
import { TRANSFORMATIVE_BY_ELEMENT, TRANSFORMATIVE_LABEL, type TransformativeType } from "@/lib/engine/transformative";
import { LUNAR_BY_ELEMENT, LUNAR_LABEL, type LunarType } from "@/lib/engine/lunar";
import {
  STELLAR_BY_ELEMENT,
  STELLAR_LABEL,
  STELLAR_SWIRL_VARIANT_LABEL,
  type StellarType,
  type StellarSwirlVariant,
} from "@/lib/engine/stellar";
import { DMG_COLORS } from "../utils/colors";
import { HitFormulaTooltip } from "./HitFormulaTooltip";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface TransformativePanelProps {
  inst: CalcInstance;
  config: CharacterConfig;
  extras: ReactionExtras | null;
  validation: ReturnType<typeof validate>;
  updateInstance: (id: string, updater: (inst: CalcInstance) => Partial<CalcInstance>) => void;
  onFormulaRedirect?: (targetAnchorId: string) => void;
}

export const TransformativePanel: React.FC<TransformativePanelProps> = ({
  inst,
  config,
  extras,
  validation: _validation,
  updateInstance: _updateInstance,
  onFormulaRedirect,
}) => {
  const hasTransformative = (TRANSFORMATIVE_BY_ELEMENT[config.element]?.length ?? 0) > 0;
  const hasLunar = (LUNAR_BY_ELEMENT[config.element]?.length ?? 0) > 0;
  const hasStellar = (STELLAR_BY_ELEMENT[config.element]?.length ?? 0) > 0;

  if (!hasTransformative && !hasLunar && !hasStellar) return null;

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

  const getStellarColor = (variant?: StellarSwirlVariant): string => {
    if (variant === "initial") return DMG_COLORS["Anemo"];
    if (variant === "vortex-lv1" || variant === "vortex-lv2") return DMG_COLORS["Cryo"];
    return DMG_COLORS["Stellar-Conduct"];
  };

  return (
    <section className="mt-5 border-t border-gray-200 dark:border-zinc-800 pt-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm">
          Reaction DMG ({config.element}-triggered)
        </h3>
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
            {extras.transformative.map((t) => {
              const color = getTransformativeColor(t.type);
              const label =
                t.type === "swirl" && config.element === "Anemo"
                  ? (() => {
                      const swirled = (() => {
                        if (Number(inst.mechanicInputs["party-has-pyro"]) > 0) return "Pyro";
                        if (Number(inst.mechanicInputs["party-has-hydro"]) > 0) return "Hydro";
                        if (Number(inst.mechanicInputs["party-has-electro"]) > 0) return "Electro";
                        if (Number(inst.mechanicInputs["party-has-cryo"]) > 0) return "Cryo";
                        return "";
                      })();
                      return swirled ? `${swirled} Swirl` : "Swirl";
                    })()
                  : TRANSFORMATIVE_LABEL[t.type];

              const canCrit = Boolean(t.res?.canCrit);

              return (
                <tr
                  key={t.type}
                  className="border-t border-gray-100 dark:border-zinc-800/60"
                  style={{ color }}
                >
                  <td className="py-1.5 font-medium" style={{ color }}>
                    {label}
                  </td>
                  {canCrit && t.res ? (
                    <>
                      <td className="py-1.5 pr-1 text-right tabular-nums">
                        {fmt(t.res.nonCrit)}
                      </td>
                      <td className="py-1.5 pr-1 text-right tabular-nums">
                        {fmt(t.res.crit)}
                      </td>
                      <td className="py-1.5 text-right tabular-nums font-semibold">
                        <div className="flex items-center justify-end gap-1.5">
                          <span>{fmt(t.res.avg)}</span>
                          {onFormulaRedirect && (
                            <HitFormulaTooltip
                              hitName={`${label} Reaction`}
                              targetAnchorId={`tr-${t.type}`}
                              nonCrit={t.res.nonCrit}
                              crit={t.res.crit}
                              avg={t.res.avg}
                              onFormulaRedirect={onFormulaRedirect}
                            />
                          )}
                        </div>
                      </td>
                    </>
                  ) : (
                    <td className="py-1.5 pr-1 text-right tabular-nums" colSpan={3}>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-semibold">{fmt(t.res?.nonCrit ?? t.dmg)}</span>
                        <span className="text-[10px] text-gray-400">(no crit)</span>
                        {onFormulaRedirect && (
                          <HitFormulaTooltip
                            hitName={`${label} Reaction`}
                            targetAnchorId={`tr-${t.type}`}
                            nonCrit={t.res?.nonCrit ?? t.dmg}
                            crit={t.res?.nonCrit ?? t.dmg}
                            avg={t.res?.nonCrit ?? t.dmg}
                            onFormulaRedirect={onFormulaRedirect}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Lunar Reactions */}
            {extras.lunar.map((l) => {
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
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{fmt(l.res.avg)}</span>
                      {onFormulaRedirect && (
                        <HitFormulaTooltip
                          hitName={`${LUNAR_LABEL[l.type]} Reaction`}
                          targetAnchorId={`lunar-${l.type}`}
                          nonCrit={l.res.nonCrit}
                          crit={l.res.crit}
                          avg={l.res.avg}
                          onFormulaRedirect={onFormulaRedirect}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Stellar Swirl Reactions */}
            {extras.stellar?.map((s) => {
              const color = getStellarColor(s.variant);
              return (
                <tr
                  key={`${s.type}-${s.variant ?? ""}`}
                  className="border-t border-gray-100 dark:border-zinc-800/60"
                  style={{ color }}
                >
                  <td className="py-1.5 font-medium" style={{ color }}>
                    {s.label}
                  </td>
                  <td className="py-1.5 pr-1 text-right tabular-nums">
                    {fmt(s.res.nonCrit)}
                  </td>
                  <td className="py-1.5 pr-1 text-right tabular-nums">
                    {fmt(s.res.crit)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums font-semibold">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{fmt(s.res.avg)}</span>
                      {onFormulaRedirect && (
                        <HitFormulaTooltip
                          hitName={`${s.label} Reaction`}
                          targetAnchorId={`stellar-${s.variant ?? s.type}`}
                          nonCrit={s.res.nonCrit}
                          crit={s.res.crit}
                          avg={s.res.avg}
                          onFormulaRedirect={onFormulaRedirect}
                        />
                      )}
                    </div>
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

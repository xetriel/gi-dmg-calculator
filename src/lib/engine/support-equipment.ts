import type { Element, WeaponType } from "../../data/registry/types";
import { weaponById, type WeaponConfig, type WeaponBuffContext } from "../../data/registry/weapons";
import { artifactById, type ArtifactConfig, type ArtifactBuffContext } from "../../data/registry/artifacts";
import { supportById, byId as characterById, type SupportCtx } from "../../data/registry/characters";
import type { DamageStats } from "./damage";

export interface EquippedWeaponState {
  weaponId: string;
  refinement: number; // 1..5
  inputs?: Record<string, string | number>;
  enabled: boolean;
}

export interface EquippedArtifactState {
  artifactId: string;
  pieceCount: 2 | 4;
  inputs?: Record<string, string | number>;
  enabled: boolean;
}

export interface SupportEquipmentSetup {
  id: string; // e.g. "1", "2", "setup-1"
  name: string; // e.g. "Support Setup 1"
  characterId: string; // e.g. "xilonen", "bennett"
  weapon: EquippedWeaponState | null;
  artifact: EquippedArtifactState | null;
  updatedAt?: number;
}

export interface EquipmentBuffSource {
  type: "weapon" | "artifact";
  target: "party" | "self";
  id: string;
  name: string;
  stat: string;
  label: string;
  value: number;
  isPercent?: boolean;
  rarity?: number;
  explainer?: string;
}

export interface ResolvedSupportEquipment {
  partyStatDeltas: Partial<DamageStats>;
  selfStatDeltas: Partial<DamageStats>;
  partySources: EquipmentBuffSource[];
  selfSources: EquipmentBuffSource[];
  scalingExplainers: string[];
}

// In-memory fallback store for Node / non-browser test environments
const inMemoryStore: Record<string, string> = {};

function storageGet(key: string): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    try { return window.localStorage.getItem(key); } catch { /* ignore */ }
  }
  if (typeof globalThis !== "undefined" && (globalThis as any).localStorage) {
    try { return (globalThis as any).localStorage.getItem(key); } catch { /* ignore */ }
  }
  return inMemoryStore[key] ?? null;
}

function storageSet(key: string, val: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try { window.localStorage.setItem(key, val); return; } catch { /* ignore */ }
  }
  if (typeof globalThis !== "undefined" && (globalThis as any).localStorage) {
    try { (globalThis as any).localStorage.setItem(key, val); return; } catch { /* ignore */ }
  }
  inMemoryStore[key] = val;
}

// Canonical default presets for recognized support characters
export const DEFAULT_SUPPORT_PRESETS: Record<string, {
  name: string;
  weapon: { weaponId: string; refinement: number; inputs?: Record<string, string | number> };
  artifact: { artifactId: string; pieceCount: 2 | 4; inputs?: Record<string, string | number> };
}> = {
  xilonen: {
    name: "Peak Patrol & Cinder City (Support)",
    weapon: {
      weaponId: "peak-patrol-song",
      refinement: 1,
      inputs: { "patrol-ode-stacks": "2" },
    },
    artifact: {
      artifactId: "scroll-of-the-hero-of-cinder-city",
      pieceCount: 4,
      inputs: {
        "cinder-nightsoul-active": "1",
        "cinder-crystallize-pyro": "1",
      },
    },
  },
  bennett: {
    name: "Freedom-Sworn & Noblesse (Support)",
    weapon: {
      weaponId: "freedom-sworn",
      refinement: 1,
      inputs: { "freedom-sigils-active": "1", "freedom-sigils": "2" },
    },
    artifact: {
      artifactId: "noblesse-oblige",
      pieceCount: 4,
      inputs: { "noblesse-burst": "1" },
    },
  },
  furina: {
    name: "Splendor & Tenacity (Support)",
    weapon: {
      weaponId: "splendor-of-tranquil-waters",
      refinement: 1,
      inputs: {},
    },
    artifact: {
      artifactId: "tenacity-of-the-millelith",
      pieceCount: 4,
      inputs: { "tenacity-skill-hit": "1" },
    },
  },
  ineffa: {
    name: "Peak Patrol & Tenacity (Support)",
    weapon: {
      weaponId: "peak-patrol-song",
      refinement: 1,
      inputs: { "patrol-ode-stacks": "2" },
    },
    artifact: {
      artifactId: "tenacity-of-the-millelith",
      pieceCount: 4,
      inputs: { "tenacity-skill-hit": "1" },
    },
  },
  kazuha: {
    name: "Freedom-Sworn & VV (Support)",
    weapon: {
      weaponId: "freedom-sworn",
      refinement: 1,
      inputs: { "freedom-sigils-active": "1", "freedom-sigils": "2" },
    },
    artifact: {
      artifactId: "viridescent-venerer",
      pieceCount: 4,
      inputs: {},
    },
  },
  citlali: {
    name: "TTDS & Cinder City (Support)",
    weapon: {
      weaponId: "thrilling-tales-of-dragon-slayers",
      refinement: 5,
      inputs: { "ttds-switch": "1" },
    },
    artifact: {
      artifactId: "scroll-of-the-hero-of-cinder-city",
      pieceCount: 4,
      inputs: {
        "cinder-nightsoul-active": "1",
        "cinder-melt": "1",
      },
    },
  },
};

/**
 * Returns the default equipment setup for any given character ID.
 */
export function getDefaultEquipmentSetup(characterId: string, setupId: string = "1"): SupportEquipmentSetup {
  const normId = characterId.replace(/-support$/, "");
  const preset = DEFAULT_SUPPORT_PRESETS[normId];
  if (preset) {
    return {
      id: setupId,
      name: preset.name,
      characterId: normId,
      weapon: {
        weaponId: preset.weapon.weaponId,
        refinement: preset.weapon.refinement,
        inputs: { ...preset.weapon.inputs },
        enabled: true,
      },
      artifact: {
        artifactId: preset.artifact.artifactId,
        pieceCount: preset.artifact.pieceCount,
        inputs: { ...preset.artifact.inputs },
        enabled: true,
      },
      updatedAt: Date.now(),
    };
  }

  // Fallback defaults
  return {
    id: setupId,
    name: `Support Setup ${setupId}`,
    characterId: normId,
    weapon: {
      weaponId: "favonius-sword",
      refinement: 1,
      inputs: {},
      enabled: true,
    },
    artifact: {
      artifactId: "noblesse-oblige",
      pieceCount: 4,
      inputs: { "noblesse-burst": "1" },
      enabled: true,
    },
    updatedAt: Date.now(),
  };
}

/**
 * Reads all equipment setups for a character from localStorage.
 */
export function getSupportEquipmentSetups(characterId: string): SupportEquipmentSetup[] {
  const normId = characterId.replace(/-support$/, "");
  try {
    const raw = storageGet(`gi_support_equipment_${normId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize legacy Cinder City over-toggled inputs if all 4 crystallize reactions are enabled
        for (const setup of parsed) {
          if (setup.artifact?.artifactId === "scroll-of-the-hero-of-cinder-city" && setup.artifact.inputs) {
            const inp = setup.artifact.inputs;
            const crystallizeCount = [
              inp["cinder-crystallize-pyro"],
              inp["cinder-crystallize-hydro"],
              inp["cinder-crystallize-electro"],
              inp["cinder-crystallize-cryo"],
            ].filter((v: unknown) => v === "1" || Number(v) > 0).length;

            if (crystallizeCount >= 4) {
              inp["cinder-crystallize-hydro"] = "0";
              inp["cinder-crystallize-electro"] = "0";
              inp["cinder-crystallize-cryo"] = "0";
            }
          }
          if (setup.artifact?.artifactId === "viridescent-venerer" && setup.artifact.inputs) {
            if (setup.artifact.inputs["vv-res-shred-active"] === undefined) {
              setup.artifact.inputs["vv-res-shred-active"] = "1";
            }
          }
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load support equipment setups:", err);
  }
  const def = getDefaultEquipmentSetup(normId, "1");
  return [def];
}

/**
 * Persists an equipment setup for a character to localStorage.
 */
export function saveSupportEquipmentSetup(characterId: string, setup: SupportEquipmentSetup): void {
  const normId = characterId.replace(/-support$/, "");
  try {
    const current = getSupportEquipmentSetups(normId);
    const existingIdx = current.findIndex((s) => s.id === setup.id);
    let next: SupportEquipmentSetup[];
    if (existingIdx >= 0) {
      next = [...current];
      next[existingIdx] = { ...setup, updatedAt: Date.now() };
    } else {
      next = [...current, { ...setup, updatedAt: Date.now() }];
    }
    storageSet(`gi_support_equipment_${normId}`, JSON.stringify(next));
  } catch (err) {
    console.error("Failed to save support equipment setup:", err);
  }
}

/**
 * Deletes an equipment setup for a character from localStorage.
 */
export function deleteSupportEquipmentSetup(characterId: string, setupId: string): void {
  const normId = characterId.replace(/-support$/, "");
  try {
    const current = getSupportEquipmentSetups(normId);
    const next = current.filter((s) => s.id !== setupId);
    if (next.length === 0) {
      next.push(getDefaultEquipmentSetup(normId, "1"));
    }
    storageSet(`gi_support_equipment_${normId}`, JSON.stringify(next));
  } catch (err) {
    console.error("Failed to delete support equipment setup:", err);
  }
}

export interface ResolveSupportEquipmentOpts {
  supportCharacterId: string;
  supportCtx?: SupportCtx | null;
  weaponState?: EquippedWeaponState | null;
  artifactState?: EquippedArtifactState | null;
  activeCharElement?: Element;
  activeCharWeapon?: WeaponType;
  activeCharBaseAtk?: number;
  activeCharBaseDef?: number;
  activeCharBaseHp?: number;
}

function formatSupportEquipmentLabel(buffLabel: string, sourceName: string, suffix: string): string {
  const clean = buffLabel.replace(/\s*\([^)]+\)$/, "").trim();
  return `${clean} (${sourceName} [${suffix}])`;
}

/**
 * Resolves all buffs produced by a support character's equipped weapon and artifact set.
 * Explicitly separates:
 * 1. Self Buffs: Buffs granted to the support character itself (e.g. 2pc HP, 2pc DEF, weapon substats)
 * 2. Party Buffs: Buffs granted to the active DPS teammate (scaling off support's element & attributes)
 */
export function resolveSupportEquipmentBuffs(opts: ResolveSupportEquipmentOpts): ResolvedSupportEquipment {
  const normId = opts.supportCharacterId.replace(/-support$/, "");
  const supportCfg = supportById(normId) || supportById(`${normId}-support`);
  const charCfg = characterById(normId);
  const supportName = supportCfg?.name ?? charCfg?.name ?? normId;
  const supportElement = supportCfg?.element ?? charCfg?.element;

  const result: ResolvedSupportEquipment = {
    partyStatDeltas: {},
    selfStatDeltas: {},
    partySources: [],
    selfSources: [],
    scalingExplainers: [],
  };

  const supportBaseAtk = opts.supportCtx?.baseAtk ?? 800;
  const supportBaseDef = opts.supportCtx?.baseDef ?? 800;
  const supportBaseHp = opts.supportCtx?.baseHp ?? 20000;
  const supportBaseEm = opts.supportCtx?.em ?? 0;

  const supportDef = opts.supportCtx?.def ?? supportBaseDef;
  const supportHp = opts.supportCtx?.hp ?? supportBaseHp;
  const supportAtk = opts.supportCtx?.atk ?? supportBaseAtk;
  const supportEm = opts.supportCtx?.em ?? 0;

  const dpsBaseAtk = opts.activeCharBaseAtk ?? 1000;
  const dpsBaseDef = opts.activeCharBaseDef ?? 800;
  const dpsBaseHp = opts.activeCharBaseHp ?? 15000;
  const dpsElement = opts.activeCharElement;

  const wConfig =
    opts.weaponState && opts.weaponState.enabled && opts.weaponState.weaponId
      ? weaponById(opts.weaponState.weaponId)
      : null;
  const refinement = opts.weaponState?.refinement ?? 1;
  const refIdx = Math.max(0, Math.min(4, refinement - 1));

  const aConfig =
    opts.artifactState && opts.artifactState.enabled && opts.artifactState.artifactId
      ? artifactById(opts.artifactState.artifactId)
      : null;
  const pieceCount = opts.artifactState?.pieceCount ?? 4;

  // 1. Resolve Wielder Self Buffs from Weapon (Substat + Passive Self Buffs)
  if (wConfig) {
    // Check Weapon Substat for Self Buffs
    if (wConfig.subStat) {
      const isPct =
        wConfig.subStat.label.includes("%") ||
        wConfig.subStat.type.endsWith("Pct") ||
        ["defPct", "atkPct", "hpPct", "critRate", "critDmg", "energyRecharge", "healingBonus", "physicalDmgBonus"].includes(
          wConfig.subStat.type
        );

      const cleanLabel = wConfig.subStat.label.endsWith("%")
        ? wConfig.subStat.label
        : isPct
        ? `${wConfig.subStat.label}%`
        : wConfig.subStat.label;

      result.selfSources.push({
        type: "weapon",
        target: "self",
        id: `${wConfig.id}-substat`,
        name: wConfig.name,
        stat: wConfig.subStat.type,
        label: `${wConfig.name}: ${cleanLabel} +${wConfig.subStat.value}${isPct ? "%" : ""}`,
        value: wConfig.subStat.value,
        isPercent: isPct,
        rarity: wConfig.rarity,
        explainer: `Wielder base substat for ${supportName}`,
      });

      // Accumulate into selfStatDeltas
      if (wConfig.subStat.type === "defPct" || (wConfig.subStat.type === "def" && isPct)) {
        result.selfStatDeltas.defPercent = (result.selfStatDeltas.defPercent ?? 0) + wConfig.subStat.value;
        result.selfStatDeltas.def = (result.selfStatDeltas.def ?? 0) + (wConfig.subStat.value / 100) * supportBaseDef;
      } else if (wConfig.subStat.type === "atkPct" || (wConfig.subStat.type === "atk" && isPct)) {
        result.selfStatDeltas.atkPercent = (result.selfStatDeltas.atkPercent ?? 0) + wConfig.subStat.value;
        result.selfStatDeltas.atk = (result.selfStatDeltas.atk ?? 0) + (wConfig.subStat.value / 100) * supportBaseAtk;
      } else if (wConfig.subStat.type === "hpPct" || (wConfig.subStat.type === "hp" && isPct)) {
        result.selfStatDeltas.hpPercent = (result.selfStatDeltas.hpPercent ?? 0) + wConfig.subStat.value;
        result.selfStatDeltas.hp = (result.selfStatDeltas.hp ?? 0) + (wConfig.subStat.value / 100) * supportBaseHp;
      } else if (wConfig.subStat.type === "em") {
        result.selfStatDeltas.em = (result.selfStatDeltas.em ?? 0) + wConfig.subStat.value;
      } else if (wConfig.subStat.type === "critRate") {
        result.selfStatDeltas.critRate = (result.selfStatDeltas.critRate ?? 0) + wConfig.subStat.value;
      } else if (wConfig.subStat.type === "critDmg") {
        result.selfStatDeltas.critDmg = (result.selfStatDeltas.critDmg ?? 0) + wConfig.subStat.value;
      } else if (wConfig.subStat.type === "energyRecharge") {
        result.selfStatDeltas.energyRecharge = (result.selfStatDeltas.energyRecharge ?? 0) + wConfig.subStat.value;
      }
    }

    // Evaluate Weapon Self Buffs (passive abilities affecting wielder)
    const selfWeaponCtx: WeaponBuffContext = {
      refinement,
      baseAtk: supportBaseAtk,
      charElement: supportElement,
      charWeapon: wConfig.type,
      wielderElement: supportElement,
      inputs: {
        wielderDef: supportDef,
        wielderHp: supportHp,
        wielderEm: supportEm,
        "patrol-wielder-def": supportDef,
        "patrol-ode-stacks": "2",
        ...(opts.weaponState?.inputs ?? {}),
      },
    };

    for (const buff of wConfig.buffs) {
      if (buff.isTeamBuff) continue;

      let val = 0;
      if (buff.compute) {
        val = buff.compute(refinement, selfWeaponCtx);
      } else {
        val = buff.refinementValues[refIdx] ?? 0;
      }

      const wMechDef = buff.conditionKey ? wConfig.mechanicDefs?.find((m) => m.id === buff.conditionKey) : undefined;
      const wCondVal = buff.conditionKey
        ? selfWeaponCtx.inputs?.[buff.conditionKey] ?? (wMechDef?.defaultValue !== undefined ? String(wMechDef.defaultValue) : undefined)
        : undefined;
      if (buff.conditionKey && wCondVal !== undefined && wCondVal !== "1" && Number(wCondVal) <= 0) {
        val = 0;
      }

      if (val !== 0 && Number.isFinite(val)) {
        result.selfSources.push({
          type: "weapon",
          target: "self",
          id: buff.id,
          name: wConfig.name,
          stat: buff.stat,
          label: formatSupportEquipmentLabel(buff.label, wConfig.name, "Self"),
          value: val,
          isPercent: buff.isPercent,
          rarity: wConfig.rarity,
          explainer: `Passive bonus affecting ${supportName}'s own attributes`,
        });

        if (buff.isPercent) {
          if (buff.stat === "def") {
            result.selfStatDeltas.defPercent = (result.selfStatDeltas.defPercent ?? 0) + val;
            result.selfStatDeltas.def = (result.selfStatDeltas.def ?? 0) + (val / 100) * supportBaseDef;
          } else if (buff.stat === "atk") {
            result.selfStatDeltas.atkPercent = (result.selfStatDeltas.atkPercent ?? 0) + val;
            result.selfStatDeltas.atk = (result.selfStatDeltas.atk ?? 0) + (val / 100) * supportBaseAtk;
          } else if (buff.stat === "hp") {
            result.selfStatDeltas.hpPercent = (result.selfStatDeltas.hpPercent ?? 0) + val;
            result.selfStatDeltas.hp = (result.selfStatDeltas.hp ?? 0) + (val / 100) * supportBaseHp;
          } else {
            const key = buff.stat as keyof DamageStats;
            (result.selfStatDeltas as Record<string, number>)[key] =
              ((result.selfStatDeltas as Record<string, number>)[key] ?? 0) + val;
          }
        } else {
          const key = buff.stat as keyof DamageStats;
          (result.selfStatDeltas as Record<string, number>)[key] =
            ((result.selfStatDeltas as Record<string, number>)[key] ?? 0) + val;
        }
      }
    }
  }

  // 2. Resolve Wielder Self Buffs from Artifact Set (2-Piece / 4-Piece)
  if (aConfig) {
    const selfArtifactCtx: ArtifactBuffContext = {
      pieceCount,
      slot: "support",
      baseAtk: supportBaseAtk,
      baseDef: supportBaseDef,
      baseHp: supportBaseHp,
      charElement: supportElement,
      inputs: {
        ...(supportElement ? { wielderElement: supportElement } : {}),
        wielderDef: supportDef,
        wielderHp: supportHp,
        wielderEm: supportEm,
        ...(opts.artifactState?.inputs ?? {}),
      },
    };

    for (const buff of aConfig.buffs) {
      if (buff.isTeamBuff || pieceCount < buff.pieceRequirement) continue;

      let val = 0;
      if (buff.compute) {
        val = buff.compute(selfArtifactCtx);
      } else {
        val = buff.value ?? 0;
      }

      const aMechDef = buff.conditionKey ? aConfig.mechanicDefs?.find((m) => m.id === buff.conditionKey) : undefined;
      const aCondVal = buff.conditionKey
        ? selfArtifactCtx.inputs?.[buff.conditionKey] ?? (aMechDef?.defaultValue !== undefined ? String(aMechDef.defaultValue) : undefined)
        : undefined;
      if (buff.conditionKey && aCondVal !== undefined && aCondVal !== "1" && Number(aCondVal) <= 0) {
        val = 0;
      }

      if (val !== 0 && Number.isFinite(val)) {
        result.selfSources.push({
          type: "artifact",
          target: "self",
          id: buff.id,
          name: aConfig.name,
          stat: buff.stat,
          label: formatSupportEquipmentLabel(buff.label, aConfig.name, "Self"),
          value: val,
          isPercent: buff.isPercent,
          rarity: aConfig.rarity,
          explainer: `2-Piece/4-Piece self passive for ${supportName}`,
        });

        if (buff.isPercent) {
          if (buff.compute) {
            // Already computed using base stat (e.g. Husk compute returns flat DEF)
            const key = buff.stat as keyof DamageStats;
            (result.selfStatDeltas as Record<string, number>)[key] =
              ((result.selfStatDeltas as Record<string, number>)[key] ?? 0) + val;
          } else {
            if (buff.stat === "def") {
              result.selfStatDeltas.defPercent = (result.selfStatDeltas.defPercent ?? 0) + val;
              result.selfStatDeltas.def = (result.selfStatDeltas.def ?? 0) + (val / 100) * supportBaseDef;
            } else if (buff.stat === "atk") {
              result.selfStatDeltas.atkPercent = (result.selfStatDeltas.atkPercent ?? 0) + val;
              result.selfStatDeltas.atk = (result.selfStatDeltas.atk ?? 0) + (val / 100) * supportBaseAtk;
            } else if (buff.stat === "hp") {
              result.selfStatDeltas.hpPercent = (result.selfStatDeltas.hpPercent ?? 0) + val;
              result.selfStatDeltas.hp = (result.selfStatDeltas.hp ?? 0) + (val / 100) * supportBaseHp;
            } else {
              const key = buff.stat as keyof DamageStats;
              (result.selfStatDeltas as Record<string, number>)[key] =
                ((result.selfStatDeltas as Record<string, number>)[key] ?? 0) + val;
            }
          }
        } else {
          const key = buff.stat as keyof DamageStats;
          (result.selfStatDeltas as Record<string, number>)[key] =
            ((result.selfStatDeltas as Record<string, number>)[key] ?? 0) + val;
        }
      }
    }
  }

  // 3. Compute Effective Wielder Attributes with Self Equipment Applied
  const effectiveSupportDef = supportDef + (result.selfStatDeltas.def ?? 0);
  const effectiveSupportHp = supportHp + (result.selfStatDeltas.hp ?? 0);
  const effectiveSupportAtk = supportAtk + (result.selfStatDeltas.atk ?? 0);
  const effectiveSupportEm = supportEm + (result.selfStatDeltas.em ?? 0);

  // 4. Resolve Party Buffs from Weapon
  if (wConfig) {
    const weaponCtx: WeaponBuffContext = {
      refinement,
      baseAtk: dpsBaseAtk,
      charElement: dpsElement,
      charWeapon: opts.activeCharWeapon,
      wielderElement: supportElement,
      inputs: {
        wielderDef: effectiveSupportDef,
        wielderHp: effectiveSupportHp,
        wielderEm: effectiveSupportEm,
        "patrol-wielder-def": effectiveSupportDef,
        "patrol-ode-stacks": "2",
        ...(opts.weaponState?.inputs ?? {}),
      },
    };

    for (const buff of wConfig.buffs) {
      if (!buff.isTeamBuff) continue;

      let val = 0;
      if (buff.compute) {
        val = buff.compute(refinement, weaponCtx);
      } else {
        const rawVal = buff.refinementValues[refIdx] ?? 0;
        if (buff.isPercent && buff.stat === "atk") {
          val = (rawVal / 100) * dpsBaseAtk;
        } else if (buff.isPercent && buff.stat === "def") {
          val = (rawVal / 100) * dpsBaseDef;
        } else if (buff.isPercent && buff.stat === "hp") {
          val = (rawVal / 100) * dpsBaseHp;
        } else {
          val = rawVal;
        }
      }

      const wMechDef = buff.conditionKey ? wConfig.mechanicDefs?.find((m) => m.id === buff.conditionKey) : undefined;
      const wCondVal = buff.conditionKey
        ? weaponCtx.inputs?.[buff.conditionKey] ?? (wMechDef?.defaultValue !== undefined ? String(wMechDef.defaultValue) : undefined)
        : undefined;
      if (buff.conditionKey && wCondVal !== undefined && wCondVal !== "1" && Number(wCondVal) <= 0) {
        val = 0;
      }

      if (val !== 0 && Number.isFinite(val)) {
        result.partySources.push({
          type: "weapon",
          target: "party",
          id: buff.id,
          name: wConfig.name,
          stat: buff.stat,
          label: formatSupportEquipmentLabel(buff.label, wConfig.name, supportName),
          value: val,
          isPercent: buff.isPercent,
          rarity: wConfig.rarity,
          explainer: `Equipped on ${supportName} (R${refinement}) -> grants ${val}${buff.isPercent ? "%" : ""} ${buff.stat} to party teammates`,
        });

        const key = buff.stat as keyof DamageStats;
        (result.partyStatDeltas as Record<string, number>)[key] =
          ((result.partyStatDeltas as Record<string, number>)[key] ?? 0) + val;
      }
    }

    // Add specific weapon scaling explainers using effective wielder attributes
    if (wConfig.id === "peak-patrol-song") {
      const cap = [25.6, 32, 38.4, 44.8, 51.2][refIdx] ?? 25.6;
      const perK = [8, 10, 12, 14, 16][refIdx] ?? 8;
      const currentBonus = Math.min(cap, (effectiveSupportDef / 1000) * perK);
      result.scalingExplainers.push(
        `⚔️ Peak Patrol Song (R${refinement}): Scales off ${supportName}'s DEF (${Math.round(effectiveSupportDef).toLocaleString("en-US")}) -> grants +${currentBonus.toFixed(1)}% All Elemental DMG Bonus to nearby party members (Cap: ${cap}%).`
      );
    } else if (wConfig.id === "freedom-sworn") {
      result.scalingExplainers.push(
        `⚔️ Freedom-Sworn (R${refinement}): Millennial Movement grants nearby party members +20% ATK and +16% Normal/Charged/Plunging Attack DMG.`
      );
    } else if (wConfig.id === "thrilling-tales-of-dragon-slayers") {
      const atkVal = [24, 30, 36, 42, 48][refIdx] ?? 48;
      result.scalingExplainers.push(
        `⚔️ Thrilling Tales of Dragon Slayers (R${refinement}): When switching characters, the new character taking the field gains +${atkVal}% ATK for 10s.`
      );
    }
  }

  // 5. Resolve Party Buffs from Artifact Set
  if (aConfig) {
    const artifactCtx: ArtifactBuffContext = {
      pieceCount,
      slot: "support",
      baseAtk: dpsBaseAtk,
      baseDef: dpsBaseDef,
      baseHp: dpsBaseHp,
      charElement: dpsElement,
      inputs: {
        ...(supportElement ? { wielderElement: supportElement } : {}),
        wielderDef: effectiveSupportDef,
        wielderHp: effectiveSupportHp,
        wielderEm: effectiveSupportEm,
        ...(opts.artifactState?.inputs ?? {}),
      },
    };

    for (const buff of aConfig.buffs) {
      if (!buff.isTeamBuff || pieceCount < buff.pieceRequirement) continue;

      let val = 0;
      if (buff.compute) {
        val = buff.compute(artifactCtx);
      } else {
        const raw = buff.value ?? 0;
        if (buff.isPercent) {
          if (buff.stat === "atk") val = (raw / 100) * dpsBaseAtk;
          else if (buff.stat === "def") val = (raw / 100) * dpsBaseDef;
          else if (buff.stat === "hp") val = (raw / 100) * dpsBaseHp;
          else val = raw;
        } else {
          val = raw;
        }
      }

      const aMechDef = buff.conditionKey ? aConfig.mechanicDefs?.find((m) => m.id === buff.conditionKey) : undefined;
      const aCondVal = buff.conditionKey
        ? artifactCtx.inputs?.[buff.conditionKey] ?? (aMechDef?.defaultValue !== undefined ? String(aMechDef.defaultValue) : undefined)
        : undefined;
      if (buff.conditionKey && aCondVal !== undefined && aCondVal !== "1" && Number(aCondVal) <= 0) {
        val = 0;
      }

      if (val !== 0 && Number.isFinite(val)) {
        result.partySources.push({
          type: "artifact",
          target: "party",
          id: buff.id,
          name: aConfig.name,
          stat: buff.stat,
          label: formatSupportEquipmentLabel(buff.label, aConfig.name, supportName),
          value: val,
          isPercent: buff.isPercent,
          rarity: aConfig.rarity,
          explainer: `${aConfig.name} (${pieceCount}-Pc) equipped on ${supportName} -> provides ${val}${buff.isPercent ? "%" : ""} to party`,
        });

        const key = buff.stat as keyof DamageStats;
        (result.partyStatDeltas as Record<string, number>)[key] =
          ((result.partyStatDeltas as Record<string, number>)[key] ?? 0) + val;
      }
    }

    // Add specific artifact scaling explainers
    if (aConfig.id === "scroll-of-the-hero-of-cinder-city") {
      const isNightsoul = opts.artifactState?.inputs?.["cinder-nightsoul-active"] === "1" || Number(opts.artifactState?.inputs?.["cinder-nightsoul-active"] ?? 1) > 0;
      const bonus = isNightsoul ? 40 : 12;
      result.scalingExplainers.push(
        `🏺 Scroll of Cinder City (4-Pc): ${supportName} (${supportElement}) triggers reaction related to ${supportElement} ${isNightsoul ? "in Nightsoul's Blessing" : ""}, granting nearby party members +${bonus}% Elemental DMG Bonus for elements involved.`
      );
    } else if (aConfig.id === "noblesse-oblige") {
      result.scalingExplainers.push(
        `🏺 Noblesse Oblige (4-Pc): Using an Elemental Burst with ${supportName} grants all party members +20% ATK for 12s.`
      );
    } else if (aConfig.id === "tenacity-of-the-millelith") {
      result.scalingExplainers.push(
        `🏺 Tenacity of the Millelith (4-Pc): When an Elemental Skill hits an opponent, party members gain +20% ATK and +30% Shield Strength for 3s.`
      );
    } else if (aConfig.id === "viridescent-venerer") {
      result.scalingExplainers.push(
        `🏺 Viridescent Venerer (4-Pc): ${supportName} Swirls an element, decreasing opponent Elemental RES to that element by 40% for 10s.`
      );
    }
  }

  return result;
}

export interface ActiveSupportEquippedWeapon {
  supportId: string;
  supportName: string;
  supportElement?: Element;
  weapon: EquippedWeaponState;
  buffs: EquipmentBuffSource[];
}

export interface ActiveSupportEquippedArtifact {
  supportId: string;
  supportName: string;
  supportElement?: Element;
  artifact: EquippedArtifactState;
  buffs: EquipmentBuffSource[];
}

export function getActiveSupportEquippedWeapons(
  supports: Array<{
    supportId: string;
    enabled?: boolean;
    useCharacterBuild?: boolean;
    equipmentSetupId?: string;
    equippedWeapon?: EquippedWeaponState | null;
    equippedArtifact?: EquippedArtifactState | null;
    stats?: Record<string, string>;
    mechanicInputs?: Record<string, string>;
    constellationLevel?: number;
  }>,
  masterEnabled: boolean = true,
  dpsElement?: Element,
  dpsWeapon?: WeaponType,
  dpsBaseAtk: number = 1000,
  dpsBaseDef: number = 800,
  dpsBaseHp: number = 15000
): ActiveSupportEquippedWeapon[] {
  if (!masterEnabled || !supports?.length) return [];
  const result: ActiveSupportEquippedWeapon[] = [];

  for (const sup of supports) {
    if (sup.enabled === false || sup.useCharacterBuild === false) continue;
    const hasEquipment =
      sup.useCharacterBuild === true ||
      Boolean(sup.equippedWeapon || sup.equippedArtifact || sup.equipmentSetupId);
    if (!hasEquipment) continue;

    const normId = sup.supportId.replace(/-support$/, "");
    let equippedWeapon = sup.equippedWeapon;
    if (!equippedWeapon || !equippedWeapon.weaponId) {
      const defSetup = getDefaultEquipmentSetup(normId, sup.equipmentSetupId || "1");
      if (defSetup?.weapon) {
        equippedWeapon = defSetup.weapon;
      }
    }

    if (!equippedWeapon?.enabled || !equippedWeapon.weaponId) continue;

    const supportCfg = supportById(normId) || supportById(`${normId}-support`);
    const charCfg = characterById(normId);
    const supportName = supportCfg?.name ?? charCfg?.name ?? normId;
    const supportElement = supportCfg?.element ?? charCfg?.element;

    const baseDef = Number(sup.stats?.["def.base"] ?? sup.stats?.["baseDef"] ?? 800);
    const def =
      Number(sup.stats?.["def.base"] ?? 0) * (1 + Number(sup.stats?.["def.percent"] ?? 0) / 100) +
        Number(sup.stats?.["def.flat"] ?? 0) || Number(sup.stats?.["def"] ?? 1000);
    const hp =
      Number(sup.stats?.["hp.base"] ?? 0) * (1 + Number(sup.stats?.["hp.percent"] ?? 0) / 100) +
        Number(sup.stats?.["hp.flat"] ?? 0) || Number(sup.stats?.["hp"] ?? 20000);
    const baseAtk = Number(sup.stats?.["atk.base"] ?? sup.stats?.["baseAtk"] ?? 800);

    const eqRes = resolveSupportEquipmentBuffs({
      supportCharacterId: sup.supportId,
      supportCtx: {
        atk: baseAtk,
        baseAtk,
        hp,
        baseHp: hp,
        def,
        baseDef,
        em: Number(sup.stats?.["em"] ?? 0),
        critRate: 0.05,
        critDmg: 0.5,
        constellationLevel: sup.constellationLevel ?? 0,
        talentLevels: {},
        inputs: {},
      },
      weaponState: equippedWeapon,
      activeCharElement: dpsElement,
      activeCharWeapon: dpsWeapon,
      activeCharBaseAtk: dpsBaseAtk,
      activeCharBaseDef: dpsBaseDef,
      activeCharBaseHp: dpsBaseHp,
    });

    result.push({
      supportId: sup.supportId,
      supportName,
      supportElement,
      weapon: equippedWeapon,
      buffs: eqRes.partySources.filter((s) => s.type === "weapon"),
    });
  }

  return result;
}

export function getActiveSupportEquippedArtifacts(
  supports: Array<{
    supportId: string;
    enabled?: boolean;
    useCharacterBuild?: boolean;
    equippedWeapon?: EquippedWeaponState | null;
    equippedArtifact?: EquippedArtifactState | null;
    equipmentSetupId?: string;
    stats?: Record<string, string>;
    mechanicInputs?: Record<string, string>;
    constellationLevel?: number;
  }>,
  masterEnabled: boolean = true,
  dpsElement?: Element,
  dpsBaseAtk: number = 1000,
  dpsBaseDef: number = 800,
  dpsBaseHp: number = 15000
): ActiveSupportEquippedArtifact[] {
  if (!masterEnabled || !supports?.length) return [];
  const result: ActiveSupportEquippedArtifact[] = [];

  for (const sup of supports) {
    if (sup.enabled === false || sup.useCharacterBuild === false) continue;
    const hasEquipment =
      sup.useCharacterBuild === true ||
      Boolean(sup.equippedWeapon || sup.equippedArtifact || sup.equipmentSetupId);
    if (!hasEquipment) continue;

    const normId = sup.supportId.replace(/-support$/, "");
    let equippedArtifact = sup.equippedArtifact;
    if (!equippedArtifact || !equippedArtifact.artifactId) {
      const defSetup = getDefaultEquipmentSetup(normId, sup.equipmentSetupId || "1");
      if (defSetup?.artifact) {
        equippedArtifact = defSetup.artifact;
      }
    }

    if (!equippedArtifact?.enabled || !equippedArtifact.artifactId) continue;

    const supportCfg = supportById(normId) || supportById(`${normId}-support`);
    const charCfg = characterById(normId);
    const supportName = supportCfg?.name ?? charCfg?.name ?? normId;
    const supportElement = supportCfg?.element ?? charCfg?.element;

    const baseDef = Number(sup.stats?.["def.base"] ?? sup.stats?.["baseDef"] ?? 800);
    const def =
      Number(sup.stats?.["def.base"] ?? 0) * (1 + Number(sup.stats?.["def.percent"] ?? 0) / 100) +
        Number(sup.stats?.["def.flat"] ?? 0) || Number(sup.stats?.["def"] ?? 1000);
    const hp =
      Number(sup.stats?.["hp.base"] ?? 0) * (1 + Number(sup.stats?.["hp.percent"] ?? 0) / 100) +
        Number(sup.stats?.["hp.flat"] ?? 0) || Number(sup.stats?.["hp"] ?? 20000);
    const baseAtk = Number(sup.stats?.["atk.base"] ?? sup.stats?.["baseAtk"] ?? 800);

    const eqRes = resolveSupportEquipmentBuffs({
      supportCharacterId: sup.supportId,
      supportCtx: {
        atk: baseAtk,
        baseAtk,
        hp,
        baseHp: hp,
        def,
        baseDef,
        em: Number(sup.stats?.["em"] ?? 0),
        critRate: 0.05,
        critDmg: 0.5,
        constellationLevel: sup.constellationLevel ?? 0,
        talentLevels: {},
        inputs: {},
      },
      artifactState: equippedArtifact,
      activeCharElement: dpsElement,
      activeCharBaseAtk: dpsBaseAtk,
      activeCharBaseDef: dpsBaseDef,
      activeCharBaseHp: dpsBaseHp,
    });

    result.push({
      supportId: sup.supportId,
      supportName,
      supportElement,
      artifact: equippedArtifact,
      buffs: eqRes.partySources.filter((s) => s.type === "artifact"),
    });
  }

  return result;
}

/**
 * Filters mechanicDefs for artifacts like Scroll of the Hero of Cinder City to only show
 * reactions related to the specific character's Elemental Type.
 */
export function getRelevantArtifactMechanics<
  T extends { id: string; label: string; control?: string; defaultValue?: number; hint?: string }
>(mechanicDefs: T[] | undefined, artifactId: string, charElement?: Element): T[] {
  if (!mechanicDefs) return [];
  if (artifactId !== "scroll-of-the-hero-of-cinder-city" || !charElement) {
    return mechanicDefs;
  }

  return mechanicDefs.filter((m) => {
    if (m.id === "cinder-nightsoul-active" || m.id === "cinder-reaction-active") return true;

    if (charElement === "Geo") {
      return m.id.startsWith("cinder-crystallize-");
    }
    if (charElement === "Anemo") {
      return m.id.startsWith("cinder-swirl-");
    }
    if (charElement === "Pyro") {
      return (
        m.id === "cinder-vaporize" ||
        m.id === "cinder-melt" ||
        m.id === "cinder-overloaded" ||
        m.id === "cinder-burning" ||
        m.id === "cinder-crystallize-pyro" ||
        m.id === "cinder-swirl-pyro"
      );
    }
    if (charElement === "Hydro") {
      return (
        m.id === "cinder-vaporize" ||
        m.id === "cinder-electro-charged" ||
        m.id === "cinder-frozen" ||
        m.id === "cinder-bloom" ||
        m.id === "cinder-crystallize-hydro" ||
        m.id === "cinder-swirl-hydro"
      );
    }
    if (charElement === "Electro") {
      return (
        m.id === "cinder-overloaded" ||
        m.id === "cinder-electro-charged" ||
        m.id === "cinder-superconduct" ||
        m.id === "cinder-quicken" ||
        m.id === "cinder-crystallize-electro" ||
        m.id === "cinder-swirl-electro"
      );
    }
    if (charElement === "Cryo") {
      return (
        m.id === "cinder-melt" ||
        m.id === "cinder-frozen" ||
        m.id === "cinder-superconduct" ||
        m.id === "cinder-crystallize-cryo" ||
        m.id === "cinder-swirl-cryo"
      );
    }
    if (charElement === "Dendro") {
      return (
        m.id === "cinder-burning" ||
        m.id === "cinder-bloom" ||
        m.id === "cinder-quicken"
      );
    }

    return true;
  });
}

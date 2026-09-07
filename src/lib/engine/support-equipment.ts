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
      inputs: { "freedom-sigils": "2" },
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
      inputs: { "freedom-sigils": "2" },
    },
    artifact: {
      artifactId: "viridescent-venerer",
      pieceCount: 4,
      inputs: {
        "vv-swirl-pyro": "1",
        "vv-swirl-hydro": "1",
        "vv-swirl-electro": "1",
        "vv-swirl-cryo": "1",
      },
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
  const supportDef = opts.supportCtx?.def ?? 1000;
  const supportHp = opts.supportCtx?.hp ?? 20000;
  const supportEm = opts.supportCtx?.em ?? 0;

  const dpsBaseAtk = opts.activeCharBaseAtk ?? 1000;
  const dpsBaseDef = opts.activeCharBaseDef ?? 800;
  const dpsBaseHp = opts.activeCharBaseHp ?? 15000;
  const dpsElement = opts.activeCharElement;

  // 1. Resolve Equipped Weapon
  if (opts.weaponState && opts.weaponState.enabled && opts.weaponState.weaponId) {
    const wConfig = weaponById(opts.weaponState.weaponId);
    if (wConfig) {
      const refinement = opts.weaponState.refinement;
      const refIdx = Math.max(0, Math.min(4, refinement - 1));

      // Check Weapon Substat for Self Buffs
      if (wConfig.subStat) {
        result.selfSources.push({
          type: "weapon",
          target: "self",
          id: `${wConfig.id}-substat`,
          name: wConfig.name,
          stat: wConfig.subStat.type,
          label: `${wConfig.name}: ${wConfig.subStat.label} +${wConfig.subStat.value}`,
          value: wConfig.subStat.value,
          rarity: wConfig.rarity,
          explainer: `Wielder base substat for ${supportName}`,
        });
      }

      // Check Weapon Buffs
      const weaponCtx: WeaponBuffContext = {
        refinement,
        baseAtk: dpsBaseAtk,
        charElement: dpsElement,
        charWeapon: opts.activeCharWeapon,
        wielderElement: supportElement,
        inputs: {
          wielderDef: supportDef,
          wielderHp: supportHp,
          wielderEm: supportEm,
          "patrol-wielder-def": supportDef,
          "patrol-ode-stacks": "2",
          ...(opts.weaponState.inputs ?? {}),
        },
      };

      for (const buff of wConfig.buffs) {
        let val = 0;
        if (buff.compute) {
          val = buff.compute(refinement, weaponCtx);
        } else {
          val = buff.refinementValues[refIdx] ?? 0;
        }

        if (buff.conditionKey && weaponCtx.inputs?.[buff.conditionKey] !== "1" && Number(weaponCtx.inputs?.[buff.conditionKey] ?? 0) <= 0) {
          val = 0;
        }

        if (val > 0) {
          if (buff.isTeamBuff) {
            // Party buff granted to active character
            let scaledVal = val;
            if (buff.isPercent && buff.stat === "atk") {
              scaledVal = (val / 100) * dpsBaseAtk;
            } else if (buff.isPercent && buff.stat === "def") {
              scaledVal = (val / 100) * dpsBaseDef;
            } else if (buff.isPercent && buff.stat === "hp") {
              scaledVal = (val / 100) * dpsBaseHp;
            }

            result.partySources.push({
              type: "weapon",
              target: "party",
              id: buff.id,
              name: wConfig.name,
              stat: buff.stat,
              label: `${buff.label} (${wConfig.name} [${supportName}])`,
              value: scaledVal,
              isPercent: buff.isPercent,
              rarity: wConfig.rarity,
              explainer: `Equipped on ${supportName} (R${refinement}) -> grants ${val}${buff.isPercent ? "%" : ""} ${buff.stat} to party teammates`,
            });

            const key = buff.stat as keyof DamageStats;
            (result.partyStatDeltas as Record<string, number>)[key] =
              ((result.partyStatDeltas as Record<string, number>)[key] ?? 0) + scaledVal;
          } else {
            // Self buff granted to support wielder
            result.selfSources.push({
              type: "weapon",
              target: "self",
              id: buff.id,
              name: wConfig.name,
              stat: buff.stat,
              label: `${buff.label} (${wConfig.name} [Self])`,
              value: val,
              isPercent: buff.isPercent,
              rarity: wConfig.rarity,
              explainer: `Passive bonus affecting ${supportName}'s own attributes`,
            });

            const key = buff.stat as keyof DamageStats;
            (result.selfStatDeltas as Record<string, number>)[key] =
              ((result.selfStatDeltas as Record<string, number>)[key] ?? 0) + val;
          }
        }
      }

      // Add specific weapon scaling explainers
      if (wConfig.id === "peak-patrol-song") {
        const cap = [25.6, 32, 38.4, 44.8, 51.2][refIdx] ?? 25.6;
        const perK = [8, 10, 12, 14, 16][refIdx] ?? 8;
        const currentBonus = Math.min(cap, (supportDef / 1000) * perK);
        result.scalingExplainers.push(
          `⚔️ Peak Patrol Song (R${refinement}): Scales off ${supportName}'s DEF (${Math.round(supportDef).toLocaleString()}) -> grants +${currentBonus.toFixed(1)}% All Elemental DMG Bonus to nearby party members (Cap: ${cap}%).`
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
  }

  // 2. Resolve Equipped Artifact Set
  if (opts.artifactState && opts.artifactState.enabled && opts.artifactState.artifactId) {
    const aConfig = artifactById(opts.artifactState.artifactId);
    if (aConfig) {
      const pieceCount = opts.artifactState.pieceCount;
      const artifactCtx: ArtifactBuffContext = {
        pieceCount,
        slot: "support",
        baseAtk: dpsBaseAtk,
        baseDef: dpsBaseDef,
        baseHp: dpsBaseHp,
        charElement: dpsElement,
        inputs: {
          ...(supportElement ? { wielderElement: supportElement } : {}),
          wielderDef: supportDef,
          wielderHp: supportHp,
          ...(opts.artifactState.inputs ?? {}),
        },
      };

      for (const buff of aConfig.buffs) {
        if (pieceCount < buff.pieceRequirement) continue;

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

        if (buff.conditionKey && artifactCtx.inputs?.[buff.conditionKey] !== "1" && Number(artifactCtx.inputs?.[buff.conditionKey] ?? 0) <= 0) {
          val = 0;
        }

        if (val > 0) {
          if (buff.isTeamBuff) {
            result.partySources.push({
              type: "artifact",
              target: "party",
              id: buff.id,
              name: aConfig.name,
              stat: buff.stat,
              label: `${buff.label} (${aConfig.name} [${supportName}])`,
              value: val,
              isPercent: buff.isPercent,
              rarity: aConfig.rarity,
              explainer: `${aConfig.name} (${pieceCount}-Pc) equipped on ${supportName} -> provides ${val}${buff.isPercent ? "%" : ""} to party`,
            });

            const key = buff.stat as keyof DamageStats;
            (result.partyStatDeltas as Record<string, number>)[key] =
              ((result.partyStatDeltas as Record<string, number>)[key] ?? 0) + val;
          } else {
            result.selfSources.push({
              type: "artifact",
              target: "self",
              id: buff.id,
              name: aConfig.name,
              stat: buff.stat,
              label: `${buff.label} (${aConfig.name} [Self])`,
              value: val,
              isPercent: buff.isPercent,
              rarity: aConfig.rarity,
              explainer: `2-Piece/4-Piece self passive for ${supportName}`,
            });

            const key = buff.stat as keyof DamageStats;
            (result.selfStatDeltas as Record<string, number>)[key] =
              ((result.selfStatDeltas as Record<string, number>)[key] ?? 0) + val;
          }
        }
      }

      // Add specific artifact scaling explainers
      if (aConfig.id === "scroll-of-the-hero-of-cinder-city") {
        const isNightsoul = opts.artifactState.inputs?.["cinder-nightsoul-active"] === "1" || Number(opts.artifactState.inputs?.["cinder-nightsoul-active"] ?? 1) > 0;
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
    equippedWeapon?: EquippedWeaponState | null;
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
    if (sup.useCharacterBuild !== false) {
      const setups = getSupportEquipmentSetups(normId);
      const activeSetup = sup.equipmentSetupId
        ? (setups.find((s) => s.id === sup.equipmentSetupId) ?? setups[0])
        : (!equippedWeapon ? setups[0] : undefined);
      if (activeSetup?.weapon) {
        equippedWeapon = activeSetup.weapon;
      }
    }

    if (!equippedWeapon?.enabled || !equippedWeapon.weaponId) continue;

    const supportCfg = supportById(normId) || supportById(`${normId}-support`);
    const charCfg = characterById(normId);
    const supportName = supportCfg?.name ?? charCfg?.name ?? normId;
    const supportElement = supportCfg?.element ?? charCfg?.element;

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
        baseDef: def,
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
    if (sup.useCharacterBuild !== false) {
      const setups = getSupportEquipmentSetups(normId);
      const activeSetup = sup.equipmentSetupId
        ? (setups.find((s) => s.id === sup.equipmentSetupId) ?? setups[0])
        : (!equippedArtifact ? setups[0] : undefined);
      if (activeSetup?.artifact) {
        equippedArtifact = activeSetup.artifact;
      }
    }

    if (!equippedArtifact?.enabled || !equippedArtifact.artifactId) continue;

    const supportCfg = supportById(normId) || supportById(`${normId}-support`);
    const charCfg = characterById(normId);
    const supportName = supportCfg?.name ?? charCfg?.name ?? normId;
    const supportElement = supportCfg?.element ?? charCfg?.element;

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
        baseDef: def,
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

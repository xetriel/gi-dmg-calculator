import type {
  CharacterConfig,
  SupportConfig,
  SupportCtx,
  SupportBuff,
  SupportBuffExplanation,
  SupportStatField,
  BriefStatPill,
  CharacterSupportBuffDef,
} from "../types";

export type {
  CharacterConfig,
  SupportConfig,
  SupportCtx,
  SupportBuff,
  SupportBuffExplanation,
  SupportStatField,
  BriefStatPill,
  CharacterSupportBuffDef,
};

import { arlecchino } from "./arlecchino";
import { huTao } from "./hu-tao";
import { neuvillette } from "./neuvillette";
import { clorinde } from "./clorinde";
import { sandrone } from "./sandrone";
import { zibai } from "./zibai";
import { nefer } from "./nefer";
import { flins } from "./flins";
import { columbina } from "./columbina";
import { varka } from "./varka";
import { linnea } from "./linnea";
import { ineffa } from "./ineffa";
import { skirk } from "./skirk";
import { varesa } from "./varesa";
import { gaming } from "./gaming";
import { durin } from "./durin";
import { alhaitham } from "./alhaitham";
import { ayaka } from "./ayaka";
import { ayato } from "./ayato";
import { dehya } from "./dehya";
import { diluc } from "./diluc";
import { cyno } from "./cyno";
import { aloy } from "./aloy";
import { eula } from "./eula";
import { ganyu } from "./ganyu";
import { heizou } from "./heizou";
import { itto } from "./itto";
import { kaveh } from "./kaveh";
import { keqing } from "./keqing";
import { klee } from "./klee";
import { mavuika } from "./mavuika";
import { mualani } from "./mualani";
import { lyney } from "./lyney";
import { xiao } from "./xiao";
import { tartaglia } from "./tartaglia";
import { yanfei } from "./yanfei";
import { xinyan } from "./xinyan";
import { mizuki } from "./mizuki";
import { travelerAnemo } from "./traveler-anemo";
import { travelerGeo } from "./traveler-geo";
import { travelerElectro } from "./traveler-electro";
import { travelerDendro } from "./traveler-dendro";
import { travelerHydro } from "./traveler-hydro";
import { travelerPyro } from "./traveler-pyro";
import { travelerCryo } from "./traveler-cryo";
import { bennett } from "./bennett";

// Each character's full definition lives in its own file (mirrors src/data/talents/),
// so growing the roster only ever means adding a file + one line here.
export {
  arlecchino,
  huTao,
  neuvillette,
  clorinde,
  sandrone,
  zibai,
  nefer,
  flins,
  columbina,
  varka,
  linnea,
  ineffa,
  skirk,
  varesa,
  gaming,
  durin,
  alhaitham,
  ayaka,
  ayato,
  dehya,
  diluc,
  cyno,
  aloy,
  eula,
  ganyu,
  heizou,
  itto,
  kaveh,
  keqing,
  klee,
  mavuika,
  mualani,
  lyney,
  xiao,
  tartaglia,
  yanfei,
  xinyan,
  mizuki,
  travelerAnemo,
  travelerGeo,
  travelerElectro,
  travelerDendro,
  travelerHydro,
  travelerPyro,
  travelerCryo,
  bennett,
};

export const RAW_CHARACTERS: CharacterConfig[] = [
  arlecchino,
  huTao,
  neuvillette,
  clorinde,
  sandrone,
  zibai,
  nefer,
  flins,
  columbina,
  varka,
  linnea,
  ineffa,
  skirk,
  varesa,
  gaming,
  durin,
  alhaitham,
  ayaka,
  ayato,
  dehya,
  diluc,
  cyno,
  aloy,
  eula,
  ganyu,
  heizou,
  itto,
  kaveh,
  keqing,
  klee,
  mavuika,
  mualani,
  lyney,
  xiao,
  tartaglia,
  yanfei,
  xinyan,
  mizuki,
  travelerAnemo,
  travelerGeo,
  travelerElectro,
  travelerDendro,
  travelerHydro,
  travelerPyro,
  travelerCryo,
  bennett,
];

// ==========================================
// Derived Support Roster & Helpers
// ==========================================

export const SUPPORT_CONFIGS: SupportConfig[] = RAW_CHARACTERS.filter(
  (c): c is CharacterConfig & { support: NonNullable<CharacterConfig["support"]> } => !!c.support
).map((c) => ({
  id: `${c.id}-support`,
  characterId: c.id,
  name: c.name,
  rarity: c.rarity,
  element: c.element,
  weapon: c.weapon,
  description: c.support.description ?? c.notes?.join(" ") ?? "",
  buffExplanations: c.support.buffExplanations ?? [],
  statFields: c.support.statFields ?? [
    { key: "baseAtk", label: "Base ATK", defaultValue: "800" },
    { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
    { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
  ],
  mechanicDefs: c.mechanicDefs,
  constellations: c.constellations,
  buffs: c.support.buffs,
  lunarBaseBonusCompute: c.support.lunarBaseBonusCompute,
  formatBriefStats: c.support.formatBriefStats,
}));

export const supportById = (id: string): SupportConfig | undefined => {
  const cleanId = id.replace(/-support$/, "");
  return SUPPORT_CONFIGS.find(
    (s) =>
      s.id === id ||
      s.characterId === id ||
      s.characterId === cleanId ||
      s.id === `${cleanId}-support`
  );
};

// ==========================================
// Clean Serializable Character Roster
// ==========================================
// Strips function-bearing `support` blocks so that CharacterConfig objects
// can be safely serialized across the Next.js RSC Server -> Client boundary.
export const CHARACTERS: CharacterConfig[] = RAW_CHARACTERS.map((c) => {
  if (!c.support) return c;
  const { support: _support, ...clean } = c;
  return clean;
});

export const byId = (id: string): CharacterConfig | undefined =>
  CHARACTERS.find((c) => c.id === id);


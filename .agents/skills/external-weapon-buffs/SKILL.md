---
name: external-weapon-buffs
description: Guidelines and architectural standard for implementing Genshin Impact external weapon team buff sources, modular 1-file-per-weapon registries, character and supportive weapon filtering, refinement scaling (R1–R5), mechanic condition resolvers, Prisma and MySQL database schema syncing, and engine integration.
---

# External Weapon Team Buff Skill & Implementation Standard

This skill documents the exact architectural patterns, data structures, calculation engine, UI components, rarity-focused design theming, database schema synchronization, and verification workflow for implementing or extending **External Weapon Team Buff Sources** in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The External Weapon Buff system allows weapons equipped by party members (supportive weapons) or signature weapons equipped by the active DPS character to inject buffs into the damage calculation pipeline.

### Key Principles

1. **Character-Specific & Supportive Weapon Filtering (`getWeaponsForCharacter`)**:
   - For any active DPS character (e.g. Arlecchino, Polearm), available weapons in the selection catalog MUST follow strict rules:
     - **Matching Weapon Class**: All weapons of the character's weapon type (e.g., all Polearms for Arlecchino).
     - **Team Supportive Weapons**: All weapons marked with `isSupport: true` across *all* weapon classes (e.g. *A Thousand Floating Dreams* [Catalyst], *Freedom-Sworn* [Sword], *Elegy for the End* [Bow], *Song of Broken Pines* [Claymore], *Key of Khaj-Nisut* [Sword], *TTDS* [Catalyst], *Peak Patrol Song* [Sword], etc.).
     - Non-support weapons of non-matching classes (e.g. *Tome of the Eternal Flow* [Catalyst] for Arlecchino) are strictly excluded.
2. **Modular 1-File-Per-Weapon Registry**:
   - Every weapon is defined in its own isolated file under its category directory (`src/data/registry/weapons/<category>/<id>.ts`).
   - Grouped into 5 weapon categories (`catalysts/`, `swords/`, `polearms/`, `claymores/`, `bows/`), each with a category `index.ts` barrel aggregator.
   - Unified central entrypoint: `src/data/registry/weapons/index.ts`.
3. **Dual Toggle Granularity**:
   - **Master Toggle (`externalWeaponBuffsEnabled`)**: Global switch in the calculator header/panel to apply or bypass all external weapon buffs.
   - **Per-Weapon Toggle (`enabled`)**: Individual checkbox on each weapon card. A weapon's buffs apply if and only if **both** the master toggle and that weapon's individual toggle are enabled.
4. **Refinement Scaling (R1–R5)**:
   - Every buff definition provides explicit 5-element arrays (`refinementValues: [R1, R2, R3, R4, R5]`) or custom computation logic.
5. **Interactive Mechanic Inputs**:
   - Weapons with conditional passives (e.g., Bond of Life states on *Crimson Moon's Semblance*, wielder HP for *Key of Khaj-Nisut*, party element match stacks for *A Thousand Floating Dreams*) declare `mechanicDefs` with toggles or sliders that render dynamically in the UI.
6. **Pure Engine Stat Delta Accumulation**:
   - `resolveExternalWeaponBuffs` is a pure function that resolves all active weapon buffs into `statDeltas` (ATK, EM, CRIT, DMG Bonus%, ER, etc.) and a structured `sources` list for attribution.
   - Percentage ATK buffs (e.g. TTDS +48% ATK, Freedom-Sworn +20% ATK) multiply against the active character's `baseAtk`: `(pct / 100) * baseAtk`.
   - Stamped with `rarity: config.rarity` on every emitted source for dynamic rarity theming.
7. **Formula Breakdown & Tooltip Attribution**:
   - Every buff is tracked with source name and label (e.g., `A Thousand Floating Dreams (Weapon): +40 Party EM (R1)`).
   - Displayed in the `Received Team Buffs` card on `/characters/[id]/formula` and in hover tooltip popovers on the character calculator page.
8. **Database Synchronization (Prisma & MySQL)**:
   - Database schema has `model Weapon` in `prisma/schema.prisma` and matching DDL in `gi_stat_db.sql`.
   - Seeded via `prisma/seed.ts` from the TypeScript registry.

---

## 2. Rarity-Focused Theming Architecture

All external weapon buff UI components follow the centralized **Rarity-Focused Design System** (`src/components/calculator/rarity-theme.ts` via `getRarityTheme(rarity)`):

| Rarity | Vibe Theme | Primary Tailwind Accents | Applied Weapons & Buff Notes |
| :--- | :--- | :--- | :--- |
| **5-Star (5★)** | **Gold-ish** | `amber-500` / `amber-400` / `amber-950/20` | A Thousand Floating Dreams, Freedom-Sworn, Elegy for the End, Key of Khaj-Nisut, Song of Broken Pines, Peak Patrol Song |
| **4-Star (4★)** | **Purple-ish** | `purple-600` / `purple-400` / `purple-950/20` | Favonius Series, Sacrificial Series, Xiphos' Moonlight, Forest Regalia, Moonpiercer, Makhaira Aquamarine |
| **3-Star (3★)** | **Blue-ish** | `sky-600` / `sky-400` / `sky-950/20` | **Thrilling Tales of Dragon Slayers (TTDS Party ATK%)**, Harbinger of Dawn, White Tassel |
| **2-Star (2★)** | **Green-ish** | `emerald-600` / `emerald-400` / `emerald-950/20` | 2-star weapons |
| **1-Star (1★)** | **Silver-ish** | `zinc-500` / `zinc-400` / `zinc-900/20` | 1-star weapons |

### UI Theming Standards
1. **Panel Header & Quantity Notation (`ExternalWeaponBuffPanel.tsx`)**:
   - Header button text uses neutral default: `text-gray-900 dark:text-white hover:text-black dark:hover:text-white`.
   - Icon badge: neutral `bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700`.
   - Quantity notation formatted as `{activeCount}/{total}` in bright white and `(Max 3)` in grey:
     `<span className="text-gray-900 dark:text-white font-extrabold">{activeCount}/{weapons.length}</span> <span className="text-gray-400 dark:text-zinc-500 font-medium">(Max {MAX_EXTERNAL_WEAPONS})</span>`.
   - Empty state button uses neutral dashed border with clean white/gray hover.
2. **Aggregated Buff Pills**:
   - `ExternalWeaponBuffSource` carries `rarity?: number` reflecting `config.rarity`.
   - Buff pills use `getRarityTheme(s.rarity).sourceBuffPill` (5★ weapons like A Thousand Floating Dreams render gold-ish; 3★ weapons like TTDS render blue-ish).
3. **Modal Cards (`ExternalWeaponBuffModal.tsx`)**:
   - Catalog card hover: `theme.catalogBorderHover`.
   - Added card state: `theme.catalogAddedBg`.
   - Active card outline: `theme.cardBorderActive`.
   - Checkboxes: `theme.checkboxAccent`.
   - Refinement buttons (R1–R5): `theme.activeButton` and `theme.buttonHover`.
   - Rarity badge: `theme.badge`.
4. **Placement in Vertical Split Screen**:
   - Located in the **top container (inputs & configurations)** above the horizontal draggable splitter bar.

---

## 3. File Architecture & Modules

| File Path | Purpose |
| --- | --- |
| `src/data/registry/weapons/types.ts` | Type definitions (`WeaponType`, `WeaponRarity`, `WeaponSubStat`, `WeaponBuffContext`, `WeaponBuffDef`, `WeaponConfig`, `ExternalWeaponInstance`) and `getWeaponsForCharacter()` filtering helper. |
| `src/data/registry/weapons/catalysts/<id>.ts` | Individual catalyst weapon definitions (e.g., `a-thousand-floating-dreams.ts`, `thrilling-tales-of-dragon-slayers.ts`). |
| `src/data/registry/weapons/swords/<id>.ts` | Individual sword weapon definitions (e.g., `freedom-sworn.ts`, `key-of-khaj-nisut.ts`, `peak-patrol-song.ts`). |
| `src/data/registry/weapons/polearms/<id>.ts` | Individual polearm weapon definitions (e.g., `crimson-moons-semblance.ts`, `staff-of-homa.ts`, `moonpiercer.ts`). |
| `src/data/registry/weapons/claymores/<id>.ts` | Individual claymore weapon definitions (e.g., `song-of-broken-pines.ts`, `wolfs-gravestone.ts`). |
| `src/data/registry/weapons/bows/<id>.ts` | Individual bow weapon definitions (e.g., `elegy-for-the-end.ts`, `favonius-warbow.ts`). |
| `src/data/registry/weapons/<category>/index.ts` | Category barrel exports (`CATALYSTS`, `SWORDS`, `POLEARMS`, `CLAYMORES`, `BOWS`). |
| `src/data/registry/weapons/index.ts` | Unified central registry export: `WEAPONS`, `weaponById`, `weaponsByType`, `supportWeapons`, and type re-exports. |
| `src/lib/engine/weapon-buffs.ts` | Pure calculation engine: `resolveExternalWeaponBuffs(weapons, baseAtk, charConfig, masterEnabled)`. |
| `src/lib/engine/weapon-buffs.test.ts` | Comprehensive Vitest suite testing character filtering, R1–R5 scaling, conditions, stacking, and toggle bypass. |
| `src/components/calculator/rarity-theme.ts` | Centralized rarity color vibe token mapping (`getRarityTheme(rarity)`). |
| `src/components/calculator/components/ExternalWeaponBuffPanel.tsx` | In-calculator summary panel in top container above splitter with master toggle, configured weapon pills, and live stat breakdown pills. |
| `src/components/calculator/components/ExternalWeaponBuffModal.tsx` | 2-pane popup modal dialog with search, weapon category filter, R1–R5 picker, mechanic controls, and live previews. |
| `src/components/calculator/types.ts` | State interfaces: `externalWeapons?: ExternalWeaponInstance[]`, `externalWeaponBuffsEnabled?: boolean`. |
| `src/components/CharacterCalculator.tsx` | Calculator integration: applies `statDeltas` in `computeInstance`, renders panel in top container above horizontal splitter. |
| `src/lib/engine/formula-explainer.ts` | Explainer integration: includes weapon buff equations under "Received Team Buffs" on `/characters/[id]/formula`. |
| `prisma/schema.prisma` | Database schema: `model Weapon` with indexes on `type` and `isSupport`. |
| `prisma/seed.ts` | Database seed synchronization syncing `WEAPONS` into Prisma `prisma.weapon`. |
| `gi_stat_db.sql` | Raw MySQL DDL schema and initial seed inserts. |

---

## 4. Data Layer Standard (`WeaponConfig`)

### A. Core Interfaces

```ts
export type WeaponType = "Sword" | "Claymore" | "Polearm" | "Bow" | "Catalyst";
export type WeaponRarity = 1 | 2 | 3 | 4 | 5;

export interface WeaponBuffContext {
  refinement: number;                          // 1..5
  baseAtk: number;                             // active character's base ATK
  charElement?: Element;                       // active character's element
  charWeapon?: WeaponType;                     // active character's weapon type
  inputs?: Record<string, string | number>;    // weapon condition inputs (e.g. stacks, wielderHp)
  wielderElement?: Element;                    // for element comparison
}

export interface WeaponBuffDef {
  id: string;                                  // unique buff slug e.g. "freedom-party-atk"
  label: string;                               // display label
  description?: string;                        // detailed tooltip description
  stat: string;                                // target stat key ("atk", "em", "normalDmgBonus", "allDmgBonus", etc.)
  refinementValues: [number, number, number, number, number]; // [R1, R2, R3, R4, R5]
  isTeamBuff: boolean;                         // true if applies to team / active DPS
  isPercent?: boolean;                         // true if percentage based (e.g. +20% ATK)
  conditionKey?: string;                       // links to MechanicDef.id if conditional
  compute?: (refinement: number, ctx: WeaponBuffContext) => number;
}

export interface WeaponConfig {
  id: string;                                  // slug e.g. "thrilling-tales-of-dragon-slayers"
  name: string;                                // display name
  type: WeaponType;
  rarity: WeaponRarity;
  baseAtk: number;                             // Lv90 Base ATK
  lvl1BaseAtk?: number;                        // Lv1 Base ATK
  subStat?: {
    type: string;                              // "hpPct", "em", "critRate", etc.
    label: string;
    value: number;
    baseValue?: number;
  };
  passiveName: string;
  passiveDesc: string;
  isSupport: boolean;                          // true if provides team/party buffs
  buffType: "team" | "self" | "both";
  buffs: WeaponBuffDef[];
  mechanicDefs?: MechanicDef[];                // UI controls for conditional passives
  signatureFor?: string[];                     // Character slugs this weapon is signature for
}

export interface ExternalWeaponBuffSource {
  weaponId: string;
  weaponName: string;
  refinement: number;
  stat: string;
  label: string;
  value: number;
  rarity?: number;                             // Stamped from WeaponConfig.rarity for rarity theming
}
```

---

## 5. Adding a New Weapon: Step-by-Step Workflow

When adding a new weapon to the system:

1. **Create the Weapon File**:
   - Location: `src/data/registry/weapons/<category>/<weapon-slug>.ts`.
   - Define `rarity` (1–5), `baseAtk`, `subStat`, `isSupport`, `buffType`, `refinementValues` for each buff, and `compute` callbacks.
2. **Register in Index**:
   - In `src/data/registry/weapons/<category>/index.ts`, export the weapon.
   - In `src/data/registry/weapons/index.ts`, ensure it is included in `WEAPONS`.
3. **Write Unit Tests**:
   - In `src/lib/engine/weapon-buffs.test.ts`:
     - Test character filtering matching `getWeaponsForCharacter`.
     - Test R1 through R5 refinement scaling.
     - Test mechanic condition toggles.
     - Test proper stamping of `rarity` on `ExternalWeaponBuffSource`.
4. **Run Test Suite & Build Verification**:
   - Run `npm test` to verify all Vitest tests pass.
   - Run `npm run build` to confirm zero TypeScript compilation errors.
5. **Sync Database**:
   - Run `npx prisma db seed` or verify DDL in `gi_stat_db.sql`.

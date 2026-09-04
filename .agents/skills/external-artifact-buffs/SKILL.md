---
name: external-artifact-buffs
description: Guidelines and architectural standard for implementing Genshin Impact external artifact team buff sources, modular 1-file-per-artifact registries, character and supportive artifact filtering, 2-Piece and 4-Piece scaling, Wielder vs Party Support slot routing, maximum 4 artifact set constraints, mechanic condition resolvers, Prisma and MySQL database schema syncing, and engine integration.
---

# External Artifact Team Buff Skill & Implementation Standard

This skill documents the exact architectural patterns, data structures, calculation engine, UI modal components, rarity-focused design theming, database schema synchronization, and verification workflow for implementing or extending **External Artifact Team Buff Sources** in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The External Artifact Buff system allows artifact sets equipped by party members (supportive artifact sets) or equipped by the active DPS character (wielder sets) to inject buffs into the damage calculation pipeline.

### Key Principles

1. **"Party Support" vs "Wielder" Role Routing**:
   - **Party Support (`isSupport: true` / `buffType: "team"` or `"both"`)**: Artifact sets that provide buffs to teammates (e.g. *"DMG dealt by all nearby party members is increased by..."* like *Heart of the Furnace* 4pc, *Noblesse Oblige* 4pc, *Tenacity of the Millelith* 4pc, *Viridescent Venerer* 4pc). Labeled with a green/emerald **Party Support** badge. When equipped on a teammate (`slot: "support"`), only `isTeamBuff: true` buffs apply to the active DPS character.
   - **Wielder (`buffType: "self"` or `"both"`)**: Artifact sets that grant buffs exclusively to the equipping character (e.g. *"Increases the equipping character's..."* like *Scarlet Proof* or *Gladiator's Finale*). Labeled with a blue/sky **Wielder** badge. Applies when equipped in the active character's slot (`slot: "wielder"`).
2. **Maximum 4 Artifact Sets Limit**:
   - In a 4-person Genshin team (1 Active DPS + 3 Off-Field Supports), there is a strict maximum of **4 artifact sets** active per setup (at most 1 active character Wielder set + up to 3 Support teammate sets).
   - The UI blocks adding more than 4 artifact sets and shows an active counter badge (e.g. `2/4 Active (Max 4)`).
3. **Modular 1-File-Per-Artifact Registry**:
   - Every artifact set is defined in its own isolated file under `src/data/registry/artifacts/<artifact-slug>.ts` (e.g. `scarlet-proof.ts`, `heart-of-the-furnace.ts`, `noblesse-oblige.ts`).
   - Central registry entrypoint: `src/data/registry/artifacts/index.ts`.
4. **2-Piece vs 4-Piece Set Scaling**:
   - Users can toggle between **2-Piece** and **4-Piece** on each configured artifact card.
   - If `pieceCount === 2`, only 2-Piece buffs apply. If `pieceCount === 4`, both 2-Piece and 4-Piece buffs apply.
5. **Dual Toggle Granularity**:
   - **Master Toggle (`externalArtifactBuffsEnabled`)**: Global switch in the calculator header/panel to apply or bypass all external artifact buffs.
   - **Per-Artifact Toggle (`enabled`)**: Individual checkbox on each artifact card. An artifact's buffs apply if and only if **both** the master toggle and that artifact's individual toggle are enabled.
6. **Interactive Mechanic Inputs**:
   - Artifacts with conditional passives declare `mechanicDefs` with toggles or sliders that render dynamically in the UI (e.g. *"Triggered Elemental Burst"*, *"Triggered Swirl"*, *"Triggered / Dealt Stellar Glimmer DMG"*).
7. **Same-Name Non-Stacking Rule**:
   - Automatically prevents duplicate stacking for identical party support buffs from the same artifact set across teammates (e.g. two party members equipping Noblesse Oblige 4pc).
8. **Pure Engine Stat Delta Accumulation**:
   - `resolveExternalArtifactBuffs` is a pure function that resolves all active artifact buffs into `statDeltas` (ATK, CRIT, Reaction DMG Bonus%, etc.) and a structured `sources` list for attribution.
   - Percentage ATK buffs (e.g. 2pc +18% ATK, 4pc +20% ATK) multiply against the active character's `baseAtk`: `(pct / 100) * baseAtk`.
   - Stamped with `rarity: config.rarity` on every emitted source for dynamic rarity theming.
9. **Formula Breakdown & Tooltip Attribution**:
   - Every buff is tracked with source name and label (e.g., `Noblesse Oblige (Artifact): +203.2 4-Piece Party ATK% (4-Pc, Support)`).
   - Displayed in the `Received Team Buffs` card on `/characters/[id]/formula` and in hover tooltip popovers on the character calculator page.
10. **Database Synchronization (Prisma & MySQL)**:
    - Database schema has `model Artifact` in `prisma/schema.prisma` and matching DDL in `gi_stat_db.sql`.
    - Seeded via `prisma/seed.ts` from the TypeScript registry.

---

## 2. Rarity-Focused Theming Architecture

All external artifact buff UI components follow the centralized **Rarity-Focused Design System** (`src/components/calculator/rarity-theme.ts` via `getRarityTheme(rarity)`):

| Rarity | Vibe Theme | Primary Tailwind Accents | Applied Artifact Sets & Buff Notes |
| :--- | :--- | :--- | :--- |
| **5-Star (5★)** | **Gold-ish** | `amber-500` / `amber-400` / `amber-950/20` | Noblesse Oblige, Viridescent Venerer, Gladiator's Finale, Wanderer's Troupe, Tenacity, Deepwood Memories, Heart of the Furnace |
| **4-Star (4★)** | **Purple-ish** | `purple-600` / `purple-400` / `purple-950/20` | Instructor (4★ EM Team Buff), The Exile (4★ Energy Recharge), Berserker, Martial Artist |
| **3-Star (3★)** | **Blue-ish** | `sky-600` / `sky-400` / `sky-950/20` | 3-star early-game artifact sets |
| **2-Star (2★)** | **Green-ish** | `emerald-600` / `emerald-400` / `emerald-950/20` | 2-star early-game sets |
| **1-Star (1★)** | **Silver-ish** | `zinc-500` / `zinc-400` / `zinc-900/20` | 1-star initial utility |

### UI Theming Standards
1. **Panel Header & Quantity Notation (`ExternalArtifactBuffPanel.tsx`)**:
   - Header button text uses neutral default: `text-gray-900 dark:text-white hover:text-black dark:hover:text-white`.
   - Icon badge: neutral `bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700`.
   - Quantity notation formatted as `{activeCount}/{total}` in bright white and `(Max 4)` in grey:
     `<span className="text-gray-900 dark:text-white font-extrabold">{activeCount}/{artifacts.length}</span> <span className="text-gray-400 dark:text-zinc-500 font-medium">(Max {MAX_EXTERNAL_ARTIFACTS})</span>`.
   - Empty state button uses neutral dashed border with clean white/gray hover.
2. **Aggregated Buff Pills**:
   - `ExternalArtifactBuffSource` carries `rarity?: number` reflecting `config.rarity`.
   - Buff pills use `getRarityTheme(s.rarity).sourceBuffPill` (5★ artifacts like Noblesse and VV render gold-ish; 4★ artifacts like Instructor render purple-ish).
3. **Modal Cards (`ExternalArtifactBuffModal.tsx`)**:
   - Catalog card hover: `theme.catalogBorderHover`.
   - Added card state: `theme.catalogAddedBg`.
   - Active card outline: `theme.cardBorderActive`.
   - Checkboxes: `theme.checkboxAccent`.
   - Rarity badge: `theme.badge`.
4. **Placement in Vertical Split Screen**:
   - Located in the **top container (inputs & configurations)** above the horizontal draggable splitter bar.

---

## 3. File Architecture & Modules

| File Path | Purpose |
| --- | --- |
| `src/data/registry/artifacts/types.ts` | Type definitions (`ArtifactRarity`, `ArtifactPieceCount`, `ArtifactSlot`, `ArtifactBuffContext`, `ArtifactBuffDef`, `ArtifactConfig`, `ExternalArtifactInstance`) and `filterArtifacts()` helper. |
| `src/data/registry/artifacts/<id>.ts` | Individual artifact definitions (e.g. `scarlet-proof.ts`, `heart-of-the-furnace.ts`, `noblesse-oblige.ts`). |
| `src/data/registry/artifacts/index.ts` | Unified central registry export: `ARTIFACTS`, `artifactById`, `supportArtifacts`, `wielderArtifacts`, and type re-exports. |
| `src/lib/engine/artifact-buffs.ts` | Pure calculation engine: `resolveExternalArtifactBuffs(artifacts, baseAtk, charConfig, masterEnabled)`. |
| `src/lib/engine/artifact-buffs.test.ts` | Comprehensive Vitest suite testing 2pc/4pc, wielder vs support slot routing, conditions, non-stacking, and toggle bypass. |
| `src/components/calculator/rarity-theme.ts` | Centralized rarity color vibe token mapping (`getRarityTheme(rarity)`). |
| `src/components/calculator/components/ExternalArtifactBuffPanel.tsx` | In-calculator summary panel in top container above splitter with master toggle, configured artifact badge pills, live stat breakdown pills, and modal trigger. |
| `src/components/calculator/components/ExternalArtifactBuffModal.tsx` | 2-pane popup modal dialog with search, role filters, 2pc/4pc selector, wielder vs support slot switcher, mechanic controls, and live previews. |
| `src/components/calculator/types.ts` | State interfaces: `externalArtifacts?: ExternalArtifactInstance[]`, `externalArtifactBuffsEnabled?: boolean`. |
| `src/components/CharacterCalculator.tsx` | Calculator integration: applies `statDeltas` in `computeInstance`, renders panel in top container above horizontal splitter. |
| `src/lib/engine/formula-explainer.ts` | Explainer integration: includes external artifact buff equations on `/characters/[id]/formula`. |
| `prisma/schema.prisma` | Database schema: `model Artifact` with index on `isSupport`. |
| `prisma/seed.ts` | Database seed synchronization syncing `ARTIFACTS` into Prisma `prisma.artifact`. |
| `gi_stat_db.sql` | Raw MySQL DDL schema and initial seed inserts. |

---

## 4. Data Layer Standard (`ArtifactConfig`)

### A. Core Interfaces

```ts
export type ArtifactRarity = 1 | 2 | 3 | 4 | 5;
export type ArtifactPieceCount = 2 | 4;
export type ArtifactSlot = "wielder" | "support";

export interface ArtifactBuffContext {
  pieceCount: ArtifactPieceCount;              // 2 or 4
  slot: ArtifactSlot;                          // "wielder" (active DPS) or "support" (party member)
  baseAtk: number;                             // active character's base ATK
  charElement?: Element;                       // active character's element
  inputs?: Record<string, string | number>;    // artifact condition inputs (e.g. toggles/stacks)
}

export interface ArtifactBuffDef {
  id: string;                                  // unique identifier e.g. "noblesse-oblige-4pc-atk"
  label: string;                               // display label e.g. "4-Piece Party ATK% (Noblesse Oblige)"
  description?: string;                        // optional tooltip description
  stat: string;                                // target stat key ("atk", "critRate", "burstDmgBonus", etc.)
  pieceRequirement: ArtifactPieceCount;        // 2 or 4 pieces required
  isTeamBuff: boolean;                         // true if buff applies to all party members / teammates
  isPercent?: boolean;                         // true if percentage based (e.g. +20% ATK)
  conditionKey?: string;                       // MechanicDef.id if conditional
  value?: number;                              // default value (e.g. 20 for +20% ATK, 20 for +20% Burst DMG)
  compute?: (ctx: ArtifactBuffContext) => number;
}

export interface ArtifactConfig {
  id: string;                                  // slug e.g. "noblesse-oblige"
  name: string;                                // display name
  rarity: ArtifactRarity;                      // 4 or 5
  twoPieceDesc: string;                        // 2-Piece bonus description
  fourPieceDesc: string;                       // 4-Piece bonus description
  isSupport: boolean;                          // Has party/team buff capabilities
  buffType: "team" | "self" | "both";          // "team" (support), "self" (wielder), "both"
  buffs: ArtifactBuffDef[];
  mechanicDefs?: MechanicDef[];                // UI controls for conditional passives
}

export interface ExternalArtifactBuffSource {
  artifactId: string;
  artifactName: string;
  pieceCount: ArtifactPieceCount;
  slot: ArtifactSlot;
  buffId: string;
  stat: string;
  label: string;
  value: number;
  rarity?: number;                             // Stamped from ArtifactConfig.rarity for rarity theming
}
```

---

## 5. Adding a New Artifact Set: Step-by-Step Workflow

When adding a new artifact set to the system:

1. **Create the Artifact File**:
   - Location: `src/data/registry/artifacts/<artifact-slug>.ts` (e.g. `src/data/registry/artifacts/noblesse-oblige.ts`).
   - Define `rarity` (4 or 5), 2-piece and 4-piece bonuses, `isSupport`, `buffType` (`"team" | "self" | "both"`), `mechanicDefs`, and `compute` callbacks.
2. **Register in Index**:
   - In `src/data/registry/artifacts/index.ts`:
     - Import the artifact and export it.
     - Add to the `ARTIFACTS` array.
3. **Write Unit Tests**:
   - In `src/lib/engine/artifact-buffs.test.ts`:
     - Test 2-piece vs 4-piece scaling.
     - Test Wielder vs Support slot routing.
     - Test mechanic condition toggles.
     - Test non-stacking behavior for party buffs.
     - Test proper stamping of `rarity` on `ExternalArtifactBuffSource`.
4. **Run Test Suite & Build Verification**:
   - Run `npm test` to verify all Vitest tests pass.
   - Run `npm run build` to confirm zero TypeScript compilation errors.
5. **Sync Database**:
   - Run `npx prisma db seed` or verify DDL in `gi_stat_db.sql`.

---
name: support-calculator
description: Guidelines and architectural standard for implementing Genshin Impact support characters, full character calculator backing, brief info pills, setup switcher, team buff definitions, Moonsign Lunar Base DMG bonuses, team CRIT passthrough, and team buff engine integration.
---

# Support Calculator Skill & Implementation Standard

This skill documents the exact patterns, data structures, engine aggregation, UI components, theming rules, formula interpretations, and verification steps for implementing or modifying **Team Support Buff** calculators in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The Team Support Buff system allows external support characters (e.g., Ineffa, Bennett, Furina, Kazuha) to apply buffs to the active DPS character in a 4-person party context.

### Key Principles
1. **Full Character Calculator Backing**:
   - Supports are backed by full character calculators with standard stat dictionaries, talent scaling, rotations, and working drafts saved in `localStorage` (`gi_calc_working_draft_<characterId>`).
   - Every character can be configured in their own calculator (`/characters/[id]`) and their builds/setups are seamlessly picked up by the DPS calculator.
2. **Remastered Brief Information Cards**:
   - Support cards render a clean **Brief Info Summary**:
     - **Setup Switcher**: Select between available setups (e.g., `Support Setup 1` vs `Support Setup 2`).
     - **Brief Stat Summary Badges (`formatBriefStats`)**: Key metrics (e.g., `Total ATK: 2,180`, `CRIT: 70% / 140%`, `C1`).
     - **Sync Button (`[🔄 Sync]`)**: Pulls latest stats from the support character's `localStorage` working draft.
     - **Edit Build Action (`[✎ Edit Build ↗]`)**: Direct link to the dedicated support builder (`/characters/[id]/support?from=[dpsId]&charSetup=[setupId]&supportSetup=[supportSetupId]`).
     - **Live Computed Buffs**: Clean breakdown of active bonuses (`+1,202.4 ATK`, `+15.0% Pyro DMG`, `+14.0% Lunar Base DMG`).
3. **Dedicated Support Build Editor (`/characters/[id]/support`)**:
   - Dedicated route allowing deep customization of a support character's stats, artifacts, mechanics, and constellations without cluttering the main DPS page.
   - **Cross-Calculator Navigation Banner**: Renders a top banner displaying `"🛠️ Editing support build for <Parent Name>"` with a `[← Back to <Parent Name> Calculator]` button.
   - **Interactive Save & Dual-Draft Syncing**:
     - Explicit **Save Support Build** button with dirty state tracking (`hasUnsavedChanges`, `saveStatus: "saved" | "unsaved"`).
     - Auto-syncs directly into both the support character's working draft (`gi_calc_working_draft_<characterId>`) and the parent character's working draft (`gi_calc_working_draft_<fromCharacterId>`).
     - Navigating back automatically performs a silent save if unsaved changes exist.
   - **Zero-Recursion Guarantee**: Nested `TeamBuffPanel`, `ExternalWeaponBuffPanel`, and `ExternalArtifactBuffPanel` are hidden when editing a support character.
4. **Support Slot Limit**:
   - Strict maximum of **3 support slots** per DPS calculation instance (mirroring a standard 4-character party: 1 Active DPS + 3 Teammates).
5. **Dual Toggle Granularity**:
   - **Master Toggle (`teamBuffsEnabled`)**: Global switch in the calculator header/panel to apply or bypass all team buffs.
   - **Per-Support Toggle (`enabled`)**: Individual checkbox on each support card. A support's buffs apply if and only if **both** the master toggle and that support's individual toggle are enabled.
6. **Additive Aggregation**:
   - Stat deltas (`statDeltas`) and Moonsign Lunar Base DMG (`lunarBaseBonusPct`) from all active supports are accumulated additively into the DPS character's effective stats.
7. **Averaged Team CRIT Passthrough**:
   - Team CRIT Rate and CRIT DMG are averaged across active supports to power team-wide Lunar reaction calculations.
   - Initial CRIT Rate is derived directly from input stats (not hardcoded), and clamped to $\le 100\%$ ($1.0$) in probability calculations.
8. **Full Persistence & Source Attribution**:
   - Support configurations are saved/loaded alongside main DPS builds in `CalcInstance.teamSupports`.
   - Every buff contribution is tracked with per-source attribution (`TeamBuffSource`), including the support's `rarity` for dynamic theming and explainer display.

---

## 2. Rarity-Focused Theming Architecture

All support buff components adhere to the centralized **Rarity-Focused Theming System** (`src/components/calculator/rarity-theme.ts` via `getRarityTheme(rarity)`):

| Rarity | Vibe Theme | Primary Tailwind Accents | Applied Items & Buff Notes |
| :--- | :--- | :--- | :--- |
| **5-Star (5★)** | **Gold-ish** | `amber-500` / `amber-400` / `amber-950/20` | Ineffa, Furina, Kazuha; Moonsign Lunar Base DMG bonuses |
| **4-Star (4★)** | **Purple-ish** | `purple-600` / `purple-400` / `purple-950/20` | Bennett (Fantastic Voyage, C6), Xingqiu, Xiangling, Sucrose |
| **3-Star (3★)** | **Blue-ish** | `sky-600` / `sky-400` / `sky-950/20` | 3-star support equipment/weapons |
| **2-Star (2★)** | **Green-ish** | `emerald-600` / `emerald-400` / `emerald-950/20` | 2-star utility |
| **1-Star (1★)** | **Silver-ish** | `zinc-500` / `zinc-400` / `zinc-900/20` | 1-star utility |

### UI Theming Standards
1. **Panel Header & Badges (`TeamBuffPanel.tsx`)**:
   - Header button uses neutral white: `text-gray-900 dark:text-white hover:text-black dark:hover:text-white`.
   - Icon badge is neutral: `bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700`.
   - Quantity notation formatted as `{activeCount}/{total}` in bright white with limit `(Max 3)` in grey:
     `<span className="text-gray-900 dark:text-white font-extrabold">{activeCount}/{total}</span> <span className="text-gray-400 dark:text-zinc-500 font-medium">(Max {MAX_SUPPORTS})</span>`.
   - Empty state button uses neutral dashed border with white/gray hover.
2. **Aggregated Buff Pills**:
   - `TeamBuffSource` emitted by `resolveTeamBuffs` contains `rarity?: number` reflecting `config.rarity`.
   - Buff pills use `getRarityTheme(s.rarity).sourceBuffPill` (e.g. Bennett buffs render purple-ish; Ineffa buffs render gold-ish).
3. **Support Catalog & Configured Cards (`TeamBuffModal.tsx`)**:
   - Catalog card hover: `theme.catalogBorderHover`.
   - Added card state: `theme.catalogAddedBg`.
   - Active card outline: `theme.cardBorderActive`.
   - Checkboxes: `theme.checkboxAccent`.
   - Constellation and setup buttons: `theme.activeButton` and `theme.buttonHover`.
   - Rarity badge: `theme.badge`.

---

## 3. Dedicated Support Build Editor (`SupportBuildEditorView.tsx`)

Located at `/characters/[id]/support`, this component is the dedicated workbench for fine-tuning support builds.

### Key Capabilities & Rules
1. **URL & Query Parameters**:
   - Accepts `?from=[dpsId]&charSetup=[charSetupId]&supportSetup=[supportSetupId]`.
   - `fromCharacterId`: Identifies the parent DPS character.
   - `fromCharSetupId`: Identifies the specific DPS setup being buffed.
   - `initialSupportSetupId`: Preselects the support setup variant to edit.
2. **Dual-Draft Saving Flow**:
   - Saves to `gi_calc_working_draft_<characterId>` for standalone persistence.
   - When `fromCharacterId` is present, directly updates the corresponding `teamSupports` entry in `gi_calc_working_draft_<fromCharacterId>`.
3. **Dirty State Tracking**:
   - Any modification flags `hasUnsavedChanges = true` and `saveStatus = "unsaved"`.
   - The **Save Support Build** button pulses amber when unsaved changes exist.
   - Clicking **← Back to Calculator** automatically saves silently before navigating back.
4. **Constellation Auto-Boost Rule**:
   - Constellations that increase talent levels (e.g. Bennett C3 +3 Skill, C5 +3 Burst) must automatically add +3 to the effective talent level in buff formulas.
   - Base input talent level remains 1–10; effective talent level reaches 4–13.

---

## 4. 2-Pane TeamBuffModal Architecture

The configuration modal dialog (`TeamBuffModal.tsx`) uses a split 2-pane desktop grid:

### Left Pane: Support Character Catalog & Filters (5 cols)
- **Search Bar**: Real-time filtering across character name, element, description, and buff explanations.
- **Element Filter Pills**: `All Elements`, `Pyro`, `Hydro`, `Electro`, `Cryo`, `Anemo`, `Geo`, `Dendro`.
- **Rarity Filter Pills**: `All`, `5★`, `4★`.
- **Catalog Cards**: Display element icon, rarity badge, weapon icon, character description, buff explanations, and an "+ Add" button (disabled when already added or when `MAX_SUPPORTS = 3` is reached).

### Right Pane: Configured Party Supports (7 cols)
- **Setup Switcher Tabs**: Switches between DPS setups (`Setup 1`, `Setup 2`, `Setup 3`) with active support counts.
- **Support Cards**:
  - Checkbox toggle + character metadata (element, rarity, constellation, setup attribution).
  - Brief Info Stat Pills (`formatBriefStats`).
  - Support Setup selector buttons.
  - `[🔄 Sync]` button pulling from `localStorage`.
  - `[✎ Edit Build ↗]` link pointing to `/characters/[id]/support`.
  - Constellation level buttons (C0–C6).
  - Mechanic condition toggles with constellation gating (e.g., `Requires C6` disables toggle with strikethrough).
  - Live preview of active stat bonuses.

---

## 5. File Architecture & Modules

| File Path | Purpose |
| --- | --- |
| `src/data/registry/types.ts` | Type definitions: `CharacterConfig`, `CharacterSupportBuffDef`, `SupportConfig`, `SupportBuff`, `SupportCtx`, `SupportStatField`, `BriefStatPill`. |
| `src/data/registry/characters/<id>.ts` | Character configuration with embedded `support` block (e.g., `ineffa.ts`, `bennett.ts`): stat inputs, mechanic toggles, constellations, buff compute functions, `formatBriefStats`, and Moonsign formulas. |
| `src/data/registry/characters/index.ts` | Central character & support registry exporting `CHARACTERS`, `byId(id)`, `SUPPORT_CONFIGS` array, `supportById(id)` lookup helper, and type re-exports. |
| `src/lib/engine/team-buffs.ts` | Pure engine resolver: `resolveTeamBuffs(supports, masterEnabled)`, `resolveSupportCtx(inst)`, computing `statDeltas`, `lunarBaseBonusPct`, `sources` (with `rarity`), and `teamCrit`. |
| `src/lib/engine/team-buffs.test.ts` | Vitest test suite testing buff computations, caps, constellation gates, toggle exclusions, ATK/stat zero edge cases, additive stacking, and brief stat formatting. |
| `src/components/calculator/rarity-theme.ts` | Centralized rarity color vibe token mapping (`getRarityTheme(rarity)`). |
| `src/components/calculator/components/TeamBuffPanel.tsx` | In-calculator summary panel in top container above splitter with master toggle, configured character pills, and aggregated buff pills. |
| `src/components/calculator/components/TeamBuffModal.tsx` | 2-pane popup modal dialog with search, element/rarity filters, setup switcher, brief stats, constellation slider, and mechanic condition toggles. |
| `src/components/calculator/SupportBuildEditorView.tsx` | Dedicated support build editor view with multi-setup switcher, core attributes grid, constellation selectors, dirty state tracking, and dual-draft save. |
| `src/app/characters/[id]/support/page.tsx` | Dedicated support build editor route (`/characters/[id]/support?from=[dpsId]`). |
| `src/components/calculator/types.ts` | State interfaces: `SupportInstance` (`selectedSetupId`, `selectedSetupName`, `sourceBuildId`) and `CalcInstance` (`teamSupports?: SupportInstance[]`, `teamBuffsEnabled?: boolean`). |
| `src/components/CharacterCalculator.tsx` | Calculator integration: applies `statDeltas` in `computeInstance`, renders `TeamBuffPanel` in top container, and handles `fromCharacterId` return flow. |
| `src/lib/engine/formula-explainer.ts` | Explainer integration: includes math breakdown under "Received Team Buffs" on `/characters/[id]/formula`. |

---

## 6. Data Layer Specifications

### A. Context Interface (`SupportCtx`)
Passed to every buff `compute(ctx)` function:
```ts
export interface SupportCtx {
  atk: number;               // Support's total ATK: base * (1 + percent/100) + flat
  baseAtk: number;           // Support's base ATK
  hp: number;                // Support's total HP: base * (1 + percent/100) + flat
  baseHp: number;            // Support's base HP
  def: number;               // Support's total DEF: base * (1 + percent/100) + flat
  baseDef: number;           // Support's base DEF
  em: number;                // Support's EM
  critRate: number;          // For team Lunar CRIT calculation (clamped <= 1.0 in math)
  critDmg: number;           // For team Lunar CRIT calculation
  constellationLevel: number;// 0 to 6
  talentLevels: Record<string, number>;
  inputs: Record<string, number>; // Mechanic toggle/slider values
}
```

### B. Support Buff Interface (`SupportBuff`)
```ts
export interface SupportBuff {
  stat: string;              // Target stat key on DamageStats (e.g., "atk", "em", "pyroDmgBonus")
  label: string;             // Human-readable attribution label (e.g., "ATK (Bennett Fantastic Voyage)")
  compute: (ctx: SupportCtx) => number; // Pure calculation returning the numerical bonus
}
```

### C. Team Buff Source Interface (`TeamBuffSource`)
Emitted by `resolveTeamBuffs`:
```ts
export interface TeamBuffSource {
  supportId: string;
  supportName: string;
  label: string;
  stat: string;
  value: number;
  rarity?: number;           // Stamped from supportConfig.rarity for rarity-focused theming
}
```

### D. Brief Stat Pill Interface (`BriefStatPill`)
```ts
export interface BriefStatPill {
  label: string;             // e.g. "Total ATK", "Base ATK", "CRIT"
  value: string;             // e.g. "2,180", "865", "70% / 140%"
}
```

### E. Full Support Config (`SupportConfig`)
```ts
export interface SupportConfig {
  id: string;                // Unique identifier, e.g. "ineffa-support" or "bennett-support"
  characterId: string;       // Foreign key to main CharacterConfig.id ("ineffa", "bennett")
  name: string;              // Display name ("Ineffa", "Bennett")
  rarity: 4 | 5;
  element: Element;          // "Electro", "Pyro", "Hydro", "Cryo", "Anemo", "Geo", "Dendro"
  weapon?: WeaponType;       // "Sword", "Claymore", "Polearm", "Bow", "Catalyst"
  description?: string;      // Summary of supportive capabilities
  statFields: SupportStatField[];       // Baseline stat fields
  mechanicDefs?: MechanicDef[];         // Support-mode mechanic toggles/sliders
  constellations?: Constellation[];     // Constellation definitions
  buffExplanations?: Array<{ name: string; brief: string; full: string }>; // Catalog preview
  buffs: SupportBuff[];                 // Array of buff providers
  lunarBaseBonusCompute?: (ctx: SupportCtx) => number;  // Optional Moonsign Lunar Base DMG bonus %
  formatBriefStats?: (ctx: SupportCtx) => BriefStatPill[]; // Brief info pills for card UI
}
```

---

## 7. Step-by-Step Guide for Adding a New Support Character

Follow these steps whenever introducing a new support character or supportive kit:

1. **Implement Support Block in Character Registry**:
   - Open `src/data/registry/characters/<characterId>.ts`.
   - Add the `support: { ... }` block matching `CharacterSupportBuffDef`:
     - Define `buffs` with exact formulas, talent scaling multipliers, and constellation gates.
     - If the support boosts talent levels (e.g. C3/C5), ensure formulas account for effective talent levels.
     - Define `buffExplanations` for rich catalog tooltips.
     - Define `formatBriefStats(ctx)` to display key metrics (e.g. Total ATK, Base ATK, HP, ER, EM).
     - If applicable, define `lunarBaseBonusCompute(ctx)` for Moonsign characters.
2. **Verify Central Registry Export**:
   - In `src/data/registry/characters/index.ts`, ensure `SUPPORT_CONFIGS` includes the new support character.
3. **Write Unit Tests**:
   - Open `src/lib/engine/team-buffs.test.ts`.
   - Add a dedicated test suite covering:
     - Baseline buff values at default stats.
     - Constellation gating (e.g., buff inactive at C0, active at C6).
     - Scaling with stats (e.g., scaling with Base ATK or Max HP).
     - Proper stamping of `rarity` on `TeamBuffSource`.
     - `formatBriefStats` output formatting.
4. **Test UI Integration**:
   - Verify that the character appears in `TeamBuffModal` with correct rarity badge and color theme.
   - Verify that adding the character shows the correct brief pills, setup switcher, and live computed buffs.
   - Verify opening `/characters/<characterId>/support` works, allows editing setups, and clicking **Save** persists the build to both working drafts.
   - Verify that aggregated buff pills in `TeamBuffPanel` render with the proper rarity vibe.
5. **Run Verification**:
   - `npm test`
   - `npm run build`

---
name: support-calculator
description: Guidelines and architectural standard for implementing Genshin Impact support characters, full character calculator backing, brief info pills, setup switcher, team buff definitions, Moonsign Lunar Base DMG bonuses, team CRIT passthrough, and team buff engine integration.
---

# Support Calculator Skill & Implementation Standard

This skill documents the exact patterns, data structures, engine aggregation, UI components, formula interpretations, and verification steps for implementing or modifying **Team Support Buff** calculators in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The Team Support Buff system allows external support characters (e.g., Ineffa, Bennett, Furina, Kazuha) to apply buffs to the active DPS character.

### Key Principles
1. **Full Character Calculator Backing**:
   - Supports are backed by full character calculators with standard stat dictionaries, talent scaling, rotations, and working drafts saved in `localStorage` (`gi_calc_working_draft_<characterId>`).
   - Every character can be configured in their own calculator (`/characters/[id]`) and their builds/setups are seamlessly picked up by the DPS calculator.
2. **Remastered Brief Information Cards**:
   - Instead of cluttered raw input textboxes, support cards render a **Brief Info Summary**:
     - **Setup Switcher**: Select between available setups (e.g., `Setup 1 (2,180 ATK)` vs `Setup 2 (1,000 ATK)`).
     - **Brief Stat Summary Badges (`formatBriefStats`)**: Key metrics (e.g., `Total ATK: 2,180`, `CRIT: 70% / 140%`, `C1`).
     - **Sync Button (`[🔄 Sync]`)**: Pulls latest stats from the support's `localStorage` working draft.
     - **Edit Build Action (`[✎ Edit Build ↗]`)**: Direct link to `/characters/[id]?from=[dpsId]`.
     - **Live Computed Buffs**: Clean breakdown of active bonuses (`+130.8 EM`, `+14.0% Lunar Base DMG`).
3. **Cross-Calculator Navigation & Return**:
   - Opening a character calculator with `?from=[dpsId]` renders a top banner:
     `"🛠️ Editing support build for <Parent Name>"` with a `[← Back to <Parent Name> Calculator]` button.
4. **Support Slot Limit**:
   - Maximum **3 support slots** per DPS calculation instance (mirroring a standard 4-character party minus the active DPS).
5. **Dual Toggle Granularity**:
   - **Master Toggle (`teamBuffsEnabled`)**: Global switch in calculator header to apply or bypass all team buffs.
   - **Per-Support Toggle (`enabled`)**: Individual checkbox on each support card. A support's buffs apply if and only if **both** the master toggle and that support's individual toggle are enabled.
6. **Additive Aggregation**:
   - Stat deltas (`statDeltas`) and Moonsign Lunar Base DMG (`lunarBaseBonusPct`) from all active supports are accumulated additively into the DPS character's effective stats.
7. **Averaged Team CRIT Passthrough**:
   - Team CRIT Rate and CRIT DMG are averaged across active supports to power team-wide Lunar reaction calculations.
8. **Full Persistence & Attribution**:
   - Support configurations are saved/loaded alongside main DPS builds in `CalcInstance.teamSupports`.
   - Every buff contribution is tracked with per-source attribution (`TeamBuffSource`) for breakdown inspection and the formula explainer page.

---

## 2. File Architecture & Modules

Every support implementation and engine extension touches or adheres to the following modules:

| File Path | Purpose |
| --- | --- |
| `src/data/registry/supports/types.ts` | Type definitions: `SupportConfig`, `SupportBuff`, `SupportCtx`, `SupportStatField`, `BriefStatPill`. |
| `src/data/registry/supports/<id>.ts` | Character support configuration (e.g., `ineffa.ts`, `bennett.ts`): stat inputs, mechanic toggles, constellations, buff compute functions, `formatBriefStats`, and Moonsign Lunar Base DMG formulas. |
| `src/data/registry/supports/index.ts` | Central support registry exporting `SUPPORT_CONFIGS` array, `supportById(id)` lookup helper, and type re-exports. |
| `src/lib/engine/team-buffs.ts` | Pure engine resolver: `resolveTeamBuffs(supports, masterEnabled)`, `resolveSupportCtx(inst)`, computing `statDeltas`, `lunarBaseBonusPct`, `sources`, and `teamCrit`. |
| `src/lib/engine/team-buffs.test.ts` | Vitest test suite testing buff computations, caps, constellation gates, toggle exclusions, ATK/stat zero edge cases, additive stacking, and brief stat formatting. |
| `src/components/calculator/components/TeamBuffPanel.tsx` | Collapsible UI panel rendering master toggle, add-support selector, support cards with brief stats, setup switcher, draft sync, constellation selectors, mechanic toggles, and live computed buff previews. |
| `src/components/calculator/SupportBuildEditorView.tsx` | Dedicated support build editor view with multi-setup switcher, core attributes grid, constellation selectors, mechanic toggles, and live provided team buffs output (with zero nested team buffs). |
| `src/app/characters/[id]/support/page.tsx` | Dedicated support build editor route (`/characters/[id]/support?from=[dpsId]`). |
| `src/components/calculator/types.ts` | State interfaces: `SupportInstance` (`selectedSetupId`, `selectedSetupName`, `sourceBuildId`) and `CalcInstance` (`teamSupports?: SupportInstance[]`, `teamBuffsEnabled?: boolean`). |
| `src/components/CharacterCalculator.tsx` | Main calculator integration: damage pipeline, `fromCharacterId` return banner, support editor header link, and conditional `<TeamBuffPanel>` embedding (hidden when editing a support to prevent recursion). |
| `src/app/characters/[id]/page.tsx` | Character page handler: extracts `?from=` query param and passes `fromCharacterId` to `CharacterCalculator`. |
| `src/lib/engine/formula-explainer.ts` | Explainer integration: includes math breakdown under "Received Team Buffs" on `/characters/[id]/formula`. |

---

## 3. Data Layer Specifications

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
  critRate: number;          // For team Lunar CRIT calculation
  critDmg: number;           // For team Lunar CRIT calculation
  constellationLevel: number;// 0 to 6
  talentLevels: Record<string, number>;
  inputs: Record<string, number>; // Mechanic toggle/slider values
}
```

### B. Support Buff Interface (`SupportBuff`)
```ts
export interface SupportBuff {
  stat: string;              // Target stat key on DamageStats (e.g., "em", "atk", "lunarChargedDmgBonus")
  label: string;             // Human-readable attribution label (e.g., "EM (Ineffa A4)")
  compute: (ctx: SupportCtx) => number; // Pure calculation returning the numerical bonus
}
```

### C. Brief Stat Pill Interface (`BriefStatPill`)
```ts
export interface BriefStatPill {
  label: string;             // e.g. "Total ATK", "Base ATK", "CRIT"
  value: string;             // e.g. "2,180", "800", "70% / 140%"
}
```

### D. Full Support Config (`SupportConfig`)
```ts
export interface SupportConfig {
  id: string;                // Unique identifier, e.g. "ineffa-support"
  characterId: string;       // Foreign key to main CharacterConfig.id ("ineffa")
  name: string;              // Display name ("Ineffa")
  rarity: 4 | 5;
  element: Element;          // "Electro", "Pyro", "Hydro", "Cryo", "Anemo", "Geo", "Dendro"
  statFields: SupportStatField[];       // Baseline stat fields
  mechanicDefs?: MechanicDef[];         // Support-mode mechanic toggles/sliders
  constellations?: Constellation[];     // Constellation definitions (informational / talent)
  buffs: SupportBuff[];                 // Array of buff providers
  lunarBaseBonusCompute?: (ctx: SupportCtx) => number;  // Optional Moonsign Lunar Base DMG bonus %
  formatBriefStats?: (ctx: SupportCtx) => BriefStatPill[]; // Brief info pills for card UI
}
```

---

## 4. Verification Checklist

Before completing any team support task:
1. **Support Limit**: Confirm `MAX_SUPPORTS = 3` is strictly maintained.
2. **Brief Stats Format**: Verify `formatBriefStats` outputs readable badges for key metrics.
3. **Setup Switcher**: Verify setups switch correctly from `localStorage` working drafts.
4. **Navigation Flow**: Confirm `?from=` query parameter renders the return banner and back link properly.
5. **Unit Tests**: Run `npx vitest run src/lib/engine/team-buffs.test.ts`.
6. **Full Test Suite & Build**: Run `npx vitest run` and `npx next build` to verify zero regressions.

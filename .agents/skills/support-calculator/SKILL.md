---
name: support-calculator
description: Guidelines and architectural standard for implementing Genshin Impact support characters, limited stat configs, team buff definitions, Moonsign Lunar Base DMG bonuses, team CRIT passthrough, and team buff engine integration.
---

# Support Calculator Skill & Implementation Standard

This skill documents the exact patterns, data structures, engine aggregation, UI components, formula interpretations, and verification steps for implementing or modifying **Team Support Buff** calculators in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The Team Support Buff system allows external support characters (e.g., Ineffa, Bennett, Furina, Kazuha) to apply buffs to the active DPS character.

### Key Principles
1. **Limited Stat Inputs (Per-Support Mini-Calculator)**:
   - Only input fields that directly impact the support's buff output + CRIT Rate/CRIT DMG (for team Lunar CRIT calculations) are exposed.
   - Elemental/Category DMG Bonuses, Healing Bonus, etc. are omitted if they have zero effect on support output.
   - Base/Percent/Flat triples are supported for scaling stats (e.g., `atk.base`, `atk.percent`, `atk.flat` via `hasBaseAndFlat: true`). Scalar inputs are used for simpler stats (`critRate`, `critDmg`, `em`).
2. **Support Slot Limit**:
   - Maximum **3 support slots** per DPS calculation instance (mirroring a standard 4-character party minus the active DPS).
3. **Dual Toggle Granularity**:
   - **Master Toggle (`teamBuffsEnabled`)**: Global switch in calculator header to apply or bypass all team buffs.
   - **Per-Support Toggle (`enabled`)**: Individual checkbox on each support card. A support's buffs apply if and only if **both** the master toggle and that support's individual toggle are enabled.
4. **Additive Aggregation**:
   - Stat deltas (`statDeltas`) and Moonsign Lunar Base DMG (`lunarBaseBonusPct`) from all active supports are accumulated additively into the DPS character's effective stats.
5. **Averaged Team CRIT Passthrough**:
   - Team CRIT Rate and CRIT DMG are averaged across active supports to power team-wide Lunar reaction calculations.
6. **Full Persistence & Attribution**:
   - Support configurations are saved/loaded alongside main DPS builds in `CalcInstance.teamSupports`.
   - Every buff contribution is tracked with per-source attribution (`TeamBuffSource`) for breakdown inspection and the formula explainer page.

---

## 2. File Architecture & Modules

Every support implementation and engine extension touches or adheres to the following modules:

| File Path | Purpose |
| --- | --- |
| `src/data/registry/supports/types.ts` | Type definitions: `SupportConfig`, `SupportBuff`, `SupportCtx`, `SupportStatField`. |
| `src/data/registry/supports/<id>.ts` | Character support configuration (e.g., `ineffa.ts`): limited stat inputs, mechanic toggles, constellations, buff compute functions, and Moonsign Lunar Base DMG formulas. |
| `src/data/registry/supports/index.ts` | Central support registry exporting `SUPPORT_CONFIGS` array, `supportById(id)` lookup helper, and type re-exports. |
| `src/lib/engine/team-buffs.ts` | Pure engine resolver: `resolveTeamBuffs(supports, masterEnabled)`, computing `statDeltas`, `lunarBaseBonusPct`, `sources`, and `teamCrit`. |
| `src/lib/engine/team-buffs.test.ts` | Vitest test suite testing buff computations, caps, constellation gates, toggle exclusions, ATK/stat zero edge cases, and additive stacking. |
| `src/components/calculator/components/TeamBuffPanel.tsx` | Collapsible UI panel rendering master toggle, add-support selector, support cards with limited stat inputs, constellation selectors, mechanic toggles, and live computed buff previews. |
| `src/components/calculator/types.ts` | State interfaces: `SupportInstance` and `CalcInstance` (`teamSupports?: SupportInstance[]`, `teamBuffsEnabled?: boolean`). |
| `src/components/CharacterCalculator.tsx` | Damage pipeline integration: invokes `resolveTeamBuffs()`, applies `statDeltas` to `s`, supplies `lunarBaseFromTeam` to `indirectLunarDamage`, and renders `<TeamBuffPanel>`. |
| `src/components/calculator/hooks/useCalculatorState.ts` | State management: initializes `teamSupports: []`, `teamBuffsEnabled: true`, persists draft state to `localStorage`. |
| `src/components/calculator/components/StatBreakdownRow.tsx` | Breakdown display: renders team buff sources with character attribution (e.g. `+148.44 (Ineffa (Team))`). |
| `src/lib/engine/formula-explainer.ts` | Explainer integration: includes math breakdown under "Received Team Buffs" on `/characters/[id]/formula`. |

---

## 3. Data Layer Specifications

### A. Context Interface (`SupportCtx`)
Passed to every buff `compute(ctx)` function:
```ts
export interface SupportCtx {
  atk: number;               // Support's total ATK: base * (1 + percent/100) + flat
  hp: number;                // Support's total HP: base * (1 + percent/100) + flat
  def: number;               // Support's total DEF: base * (1 + percent/100) + flat
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

### C. Stat Input Field Definition (`SupportStatField`)
```ts
export interface SupportStatField {
  key: string;               // e.g., "atk", "hp", "critRate", "em"
  label: string;             // e.g., "ATK", "CRIT Rate"
  defaultValue: string;      // e.g., "700"
  hasBaseAndFlat?: boolean;  // If true, UI renders Base / ATK% / Flat triple inputs
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
  statFields: SupportStatField[];       // Limited stat fields to render
  mechanicDefs?: MechanicDef[];         // Support-mode mechanic toggles/sliders
  constellations?: Constellation[];     // Constellation definitions (informational / talent)
  buffs: SupportBuff[];                 // Array of buff providers
  lunarBaseBonusCompute?: (ctx: SupportCtx) => number;  // Optional Moonsign Lunar Base DMG bonus %
}
```

---

## 4. Step-by-Step Implementation Guide

When adding a new support character to the calculator:

### Step 1: Create `src/data/registry/supports/<id>.ts`
1. Define limited stat inputs: Only include stats that scale the character's buffs (e.g., Base ATK for Bennett; Max HP for Furina/Baizhu; DEF for Gorou/Xilonen; EM for Sucrose/Kazuha; plus `critRate` & `critDmg`).
2. Define mechanic toggles in `mechanicDefs` with clear `defaultValue` and descriptive `hint`.
3. Define `constellations` list (C1–C6).
4. Implement pure `buffs` list with condition and constellation checks.
5. If the character has a Moonsign Lunar reaction bonus (e.g., Ineffa Assemblage Hub), implement `lunarBaseBonusCompute`.

#### Example Template:
```ts
import type { SupportConfig } from "./types";

export const exampleSupport: SupportConfig = {
  id: "example-support",
  characterId: "example",
  name: "Example Character",
  rarity: 5,
  element: "Pyro",

  statFields: [
    { key: "atk", label: "ATK", defaultValue: "800", hasBaseAndFlat: true },
    { key: "critRate", label: "CRIT Rate", defaultValue: "60" },
    { key: "critDmg", label: "CRIT DMG", defaultValue: "120" },
  ],

  mechanicDefs: [
    {
      id: "burst-active",
      label: "Burst Buff Active",
      control: "toggle",
      defaultValue: 1,
      hint: "Grants ATK bonus based on Base ATK"
    },
    {
      id: "c6-bonus",
      label: "C6: Pyro DMG Bonus",
      control: "toggle",
      defaultValue: 0,
      hint: "Grants 15% Pyro DMG Bonus to party members"
    },
  ],

  constellations: [
    { level: 1, name: "C1 Name", description: "C1 description", effects: [{ type: "informational" }] },
    // ... C2 to C6
  ],

  buffs: [
    {
      stat: "atk",
      label: "ATK (Example Burst)",
      compute: (ctx) => {
        if ((ctx.inputs["burst-active"] ?? 0) <= 0) return 0;
        // Calculation logic
        return 1.2 * ctx.atk;
      },
    },
    {
      stat: "pyroDmgBonus",
      label: "Pyro DMG (Example C6)",
      compute: (ctx) => {
        if (ctx.constellationLevel < 6) return 0;
        if ((ctx.inputs["c6-bonus"] ?? 0) <= 0) return 0;
        return 15;
      },
    },
  ],

  // Optional: Moonsign Lunar Base DMG %
  // lunarBaseBonusCompute: (ctx) => Math.min(0.7 * (ctx.atk / 100), 14),
};
```

### Step 2: Register in `src/data/registry/supports/index.ts`
Export the new config and add it to `SUPPORT_CONFIGS`:
```ts
import { ineffaSupport } from "./ineffa";
import { exampleSupport } from "./example";
import type { SupportConfig } from "./types";

export const SUPPORT_CONFIGS: SupportConfig[] = [
  ineffaSupport,
  exampleSupport,
];

export const supportById = (id: string) => SUPPORT_CONFIGS.find(s => s.id === id);
```

### Step 3: Write Unit Tests in `src/lib/engine/team-buffs.test.ts`
Write comprehensive tests covering:
- Base stat scaling formulas.
- Mechanic toggles off $\to$ 0 buff.
- Constellation gates (e.g. C0 $\to$ 0 for C1+ buffs).
- Caps and boundaries (e.g. `min(formula, cap)`).
- Edge cases: $0$ stats $\to$ $0$ buff output.
- Additive stacking with other supports.
- Source attribution labels.

### Step 4: Verification & Build
1. Run tests: `npx vitest run src/lib/engine/team-buffs.test.ts`.
2. Run full suite: `npx vitest run`.
3. Check build: `npx next build`.

---

## 5. Engine Aggregation Details (`resolveTeamBuffs`)

The pure function `resolveTeamBuffs(supports, masterEnabled)` performs:
1. **Disabled Master Check**: If `masterEnabled === false` or `supports` is empty, returns empty `statDeltas`, `0` Lunar Base, empty `sources`, and `0` CRIT.
2. **Support Iteration**: For each `inst` in `supports`:
   - Checks `inst.enabled` (skips if `false`).
   - Resolves total stats into `SupportCtx`:
     $$\text{Stat} = \text{base} \times \left(1 + \frac{\text{percent}}{100}\right) + \text{flat}$$
   - Executes each `buff.compute(ctx)`:
     - Ignores if result is `0`.
     - Appends to `result.sources` with `{ supportName, stat, label, value }`.
     - Adds value additively to `result.statDeltas[stat]`.
   - Executes `config.lunarBaseBonusCompute(ctx)` (if present):
     - Adds value additively to `result.lunarBaseBonusPct`.
     - Appends source record with `stat: "lunarBaseBonusPct"`.
   - Accumulates `critRate` and `critDmg` for team averaging:
     $$\text{teamCrit.critRate} = \frac{\sum \text{critRate}}{\text{activeSupportsCount}}, \quad \text{teamCrit.critDmg} = \frac{\sum \text{critDmg}}{\text{activeSupportsCount}}$$

---

## 6. Integration Touchpoints in the Calculator

### 1. `computeInstance()` in `CharacterCalculator.tsx`
```ts
let teamBuffSources: TeamBuffSource[] = [];
let lunarBaseFromTeam = 0;

if (inst.teamBuffsEnabled !== false && inst.teamSupports?.length) {
  const teamResult = resolveTeamBuffs(inst.teamSupports, true);
  for (const [key, val] of Object.entries(teamResult.statDeltas)) {
    if (key in s && typeof val === "number") {
      (s as any)[key] += val;
    }
  }
  lunarBaseFromTeam = teamResult.lunarBaseBonusPct;
  teamBuffSources = teamResult.sources;
}
```

### 2. Indirect Lunar Reaction Calculation
```ts
indirectLunarDamage(
  type,
  s,
  lunarBase + mech.lunarBaseBonusPct + lunarBaseFromTeam,
  // ...
);
```

### 3. Stat Breakdown Attribution
In `StatBreakdownRow`, team buffs render as distinct addends alongside artifacts and weapon bonuses:
```
EM:  160  +148.44 (Ineffa (Team))  = 308.44
```

### 4. Formula Explainer (`formula-explainer.ts`)
Appends mathematical breakdown lines for every attributed team buff source under "Received Team Buffs".

---

## 7. Verification Checklist

Before completing any team support task:
1. **Support Limit**: Confirm `MAX_SUPPORTS = 3` is strictly maintained.
2. **Stat Scope**: Ensure no superfluous stats (e.g. Elemental DMG Bonuses for pure ATK/EM buffers) are included in `statFields`.
3. **Constellation & Toggle Gating**: Verify C1–C6 and mechanic toggle conditions are checked inside `compute(ctx)`.
4. **Attribution**: Verify `sources` includes descriptive labels for stat breakdown and formula pages.
5. **Unit Tests**: Run `npx vitest run src/lib/engine/team-buffs.test.ts`.
6. **Full Test Suite & Build**: Run `npx vitest run` and `npx next build` to verify zero regressions.

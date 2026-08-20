---
name: external-artifact-buffs
description: Guidelines and architectural standard for implementing Genshin Impact external artifact team buff sources, modular 1-file-per-artifact registries, character and supportive artifact filtering, 2-Piece and 4-Piece scaling, Wielder vs Party Support slot routing, maximum 4 artifact set constraints, mechanic condition resolvers, Prisma and MySQL database schema syncing, and engine integration.
---

# External Artifact Team Buff Skill & Implementation Standard

This skill documents the exact architectural patterns, data structures, calculation engine, UI modal components, database schema synchronization, and verification workflow for implementing or extending **External Artifact Team Buff Sources** in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The External Artifact Buff system allows artifact sets equipped by party members (supportive artifact sets) or equipped by the active DPS character (wielder sets) to inject buffs into the damage calculation pipeline.

### Key Principles

1. **"Party Support" vs "Wielder" Role Routing**:
   - **Party Support (`isSupport: true` / `buffType: "team"` or `"both"`)**: Artifact sets that provide buffs to teammates (e.g. *"DMG dealt by all nearby party members is increased by..."* like *Heart of the Furnace* 4pc). Labeled with a green/emerald **Party Support** badge. When equipped on a teammate (`slot: "support"`), only `isTeamBuff: true` buffs apply to the active DPS character.
   - **Wielder (`buffType: "self"` or `"both"`)**: Artifact sets that grant buffs exclusively to the equipping character (e.g. *"Increases the equipping character's..."* like *Scarlet Proof* or *Heart of the Furnace* 2pc/4pc self ATK). Labeled with a blue/sky **Wielder** badge. Applies when equipped in the active character's slot (`slot: "wielder"`).
2. **Maximum 4 Artifact Sets Limit**:
   - In a 4-person Genshin team (1 Active DPS + 3 Off-Field Supports), there is a strict maximum of **4 artifact sets** active per setup (at most 1 active character Wielder set + up to 3 Support teammate sets).
   - The UI blocks adding more than 4 artifact sets and shows an active counter badge (e.g. `2/4 Active (Max 4)`).
3. **Modular 1-File-Per-Artifact Registry**:
   - Every artifact set is defined in its own isolated file under `src/data/registry/artifacts/<artifact-slug>.ts` (e.g. `scarlet-proof.ts`, `heart-of-the-furnace.ts`).
   - Central registry entrypoint: `src/data/registry/artifacts/index.ts`.
4. **2-Piece vs 4-Piece Set Scaling**:
   - Users can toggle between **2-Piece** and **4-Piece** on each configured artifact card.
   - If `pieceCount === 2`, only 2-Piece buffs apply. If `pieceCount === 4`, both 2-Piece and 4-Piece buffs apply.
5. **Dual Toggle Granularity**:
   - **Master Toggle (`externalArtifactBuffsEnabled`)**: Global switch in the calculator header/panel to apply or bypass all external artifact buffs.
   - **Per-Artifact Toggle (`enabled`)**: Individual checkbox on each artifact card. An artifact's buffs apply if and only if **both** the master toggle and that artifact's individual toggle are enabled.
6. **Interactive Mechanic Inputs**:
   - Artifacts with conditional passives declare `mechanicDefs` with toggles or sliders that render dynamically in the UI (e.g. *"Triggered Stellar Swirl"*, *"Triggered / Dealt Stellar Glimmer DMG"*).
7. **Same-Name Non-Stacking Rule**:
   - Automatically prevents duplicate stacking for identical party support buffs from the same artifact set across teammates.
8. **Pure Engine Stat Delta Accumulation**:
   - `resolveExternalArtifactBuffs` is a pure function that resolves all active artifact buffs into `statDeltas` (ATK, CRIT, Reaction DMG Bonus%, etc.) and a structured `sources` list for attribution.
   - Percentage ATK buffs (e.g. 2pc +18% ATK, 4pc +12% ATK) multiply against active character's `baseAtk`: `(pct / 100) * baseAtk`.
9. **Formula Breakdown & Tooltip Attribution**:
   - Every buff is tracked with source name and label (e.g., `Heart of the Furnace (Artifact): +50.0% Stellar Glimmer DMG% (4-Pc, Support)`).
   - Displayed in the `Received Team Buffs` card on `/characters/[id]/formula` and in hover tooltip popovers on the character calculator page.
10. **Database Synchronization (Prisma & MySQL)**:
    - Database schema has `model Artifact` in `prisma/schema.prisma` and matching DDL in `gi_stat_db.sql`.
    - Seeded via `prisma/seed.ts` from the TypeScript registry.

---

## 2. File Architecture & Modules

| File Path | Purpose |
| --- | --- |
| `src/data/registry/artifacts/types.ts` | Type definitions (`ArtifactRarity`, `ArtifactPieceCount`, `ArtifactSlot`, `ArtifactBuffContext`, `ArtifactBuffDef`, `ArtifactConfig`, `ExternalArtifactInstance`) and `filterArtifacts()` helper. |
| `src/data/registry/artifacts/<id>.ts` | Individual artifact definitions (e.g. `scarlet-proof.ts`, `heart-of-the-furnace.ts`). |
| `src/data/registry/artifacts/index.ts` | Unified central registry export: `ARTIFACTS`, `artifactById`, `supportArtifacts`, `wielderArtifacts`, and type re-exports. |
| `src/lib/engine/artifact-buffs.ts` | Pure calculation engine: `resolveExternalArtifactBuffs(artifacts, baseAtk, charConfig, masterEnabled)`. |
| `src/lib/engine/artifact-buffs.test.ts` | Comprehensive Vitest suite testing 2pc/4pc, wielder vs support slot routing, conditions, non-stacking, and toggle bypass. |
| `src/components/calculator/components/ExternalArtifactBuffPanel.tsx` | In-calculator summary panel with master toggle, configured artifact badge pills, live stat breakdown pills, and modal trigger. |
| `src/components/calculator/components/ExternalArtifactBuffModal.tsx` | 2-pane popup modal dialog with search, role filters, 2pc/4pc selector, wielder vs support slot switcher, mechanic controls, and live previews. |
| `src/components/calculator/types.ts` | State interfaces: `externalArtifacts?: ExternalArtifactInstance[]`, `externalArtifactBuffsEnabled?: boolean`. |
| `src/components/CharacterCalculator.tsx` | Calculator integration: applies `statDeltas` in `computeInstance`, adds artifact sources to `StatBreakdownRow`, and embeds `<ExternalArtifactBuffPanel>` & `<ExternalArtifactBuffModal>`. |
| `src/lib/engine/formula-explainer.ts` | Explainer integration: includes external artifact buff equations on `/characters/[id]/formula`. |
| `prisma/schema.prisma` | Database schema: `model Artifact` with index on `isSupport`. |
| `prisma/seed.ts` | Database seed synchronization syncing `ARTIFACTS` into Prisma `prisma.artifact`. |
| `gi_stat_db.sql` | Raw MySQL DDL schema and initial seed inserts. |

---

## 3. Data Layer Standard (`ArtifactConfig`)

### A. Core Interfaces

```ts
export type ArtifactRarity = 4 | 5;
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
  id: string;                                  // unique identifier e.g. "scarlet-proof-2pc-atk"
  label: string;                               // display label e.g. "2-Piece ATK% (Scarlet Proof)"
  description?: string;                        // optional tooltip description
  stat: string;                                // target stat key ("atk", "critRate", "stellarSwirlDmgBonus", etc.)
  pieceRequirement: ArtifactPieceCount;        // 2 or 4 pieces required
  isTeamBuff: boolean;                         // true if buff applies to all party members / teammates
  isPercent?: boolean;                         // true if percentage based (e.g. +18% ATK)
  conditionKey?: string;                       // MechanicDef.id if conditional
  value?: number;                              // default value (e.g. 18 for +18% ATK, 16 for +16% CRIT Rate)
  compute?: (ctx: ArtifactBuffContext) => number;
}

export interface ArtifactConfig {
  id: string;                                  // slug e.g. "scarlet-proof"
  name: string;                                // display name
  rarity: ArtifactRarity;                      // 4 or 5
  twoPieceDesc: string;                        // 2-Piece bonus description
  fourPieceDesc: string;                       // 4-Piece bonus description
  isSupport: boolean;                          // Has party/team buff capabilities
  buffType: "team" | "self" | "both";          // "team" (support), "self" (wielder), "both"
  buffs: ArtifactBuffDef[];
  mechanicDefs?: MechanicDef[];                // UI controls for conditional passives
}
```

---

### B. Implementation Examples

#### 1. Wielder-Only Artifact (*Scarlet Proof*)
`src/data/registry/artifacts/scarlet-proof.ts`:
```ts
import type { ArtifactConfig } from "./types";

export const scarletProof: ArtifactConfig = {
  id: "scarlet-proof",
  name: "Scarlet Proof",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc:
    "Increases the equipping character's CRIT Rate by 16%, and their Stellar Swirl reaction dealt by 40%, for 10s after they trigger a Stellar Swirl reaction.",
  isSupport: false,
  buffType: "self",
  mechanicDefs: [
    {
      id: "trigger-stellar-swirl",
      label: "Triggered Stellar Swirl",
      control: "toggle",
      defaultValue: 1,
      hint: "Increases CRIT Rate by 16% and Stellar Swirl reaction DMG by 40% for 10s after triggering Stellar Swirl",
    },
  ],
  buffs: [
    {
      id: "scarlet-proof-2pc-atk",
      label: "2-Piece ATK% (Scarlet Proof)",
      description: "ATK increased by 18%",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "scarlet-proof-4pc-crit",
      label: "4-Piece CRIT Rate (Scarlet Proof)",
      description: "CRIT Rate increased by 16% for 10s after triggering a Stellar Swirl reaction",
      stat: "critRate",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "trigger-stellar-swirl",
      value: 16,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-swirl"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-swirl"] ?? 1) > 0;
        return on ? 16 : 0;
      },
    },
    {
      id: "scarlet-proof-4pc-stellar-swirl",
      label: "4-Piece Stellar Swirl DMG% (Scarlet Proof)",
      description: "Stellar Swirl reaction DMG dealt increased by 40% for 10s after triggering a Stellar Swirl reaction",
      stat: "stellarSwirlDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: false,
      conditionKey: "trigger-stellar-swirl",
      value: 40,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-swirl"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-swirl"] ?? 1) > 0;
        return on ? 40 : 0;
      },
    },
  ],
};
```

#### 2. Party Support & Wielder Artifact (*Heart of the Furnace*)
`src/data/registry/artifacts/heart-of-the-furnace.ts`:
```ts
import type { ArtifactConfig } from "./types";

export const heartOfTheFurnace: ArtifactConfig = {
  id: "heart-of-the-furnace",
  name: "Heart of the Furnace",
  rarity: 5,
  twoPieceDesc: "ATK increased by 18%.",
  fourPieceDesc:
    "Increases the equipping character's ATK by 12% for 12s when they trigger a Stellar Glimmer reaction or deal Stellar Glimmer reaction DMG. Also increases Stellar Glimmer reaction DMG dealt by all nearby party members by 50%. The above effects can trigger even when the equipping character is not on the field, and the DMG bonus from multiple Artifact Sets with the same name do not stack.",
  isSupport: true,
  buffType: "both",
  mechanicDefs: [
    {
      id: "trigger-stellar-glimmer",
      label: "Triggered / Dealt Stellar Glimmer DMG",
      control: "toggle",
      defaultValue: 1,
      hint: "Equipping character gains +12% ATK; all nearby party members gain +50% Stellar Glimmer reaction DMG for 12s",
    },
  ],
  buffs: [
    {
      id: "furnace-2pc-atk",
      label: "2-Piece ATK% (Heart of the Furnace)",
      description: "ATK increased by 18%",
      stat: "atk",
      pieceRequirement: 2,
      isTeamBuff: false,
      isPercent: true,
      value: 18,
      compute: (ctx) => (18 / 100) * ctx.baseAtk,
    },
    {
      id: "furnace-4pc-wielder-atk",
      label: "4-Piece Wielder ATK% (Heart of the Furnace)",
      description: "Equipping character gains +12% ATK for 12s when triggering a Stellar Glimmer reaction or dealing Stellar Glimmer DMG",
      stat: "atk",
      pieceRequirement: 4,
      isTeamBuff: false,
      isPercent: true,
      conditionKey: "trigger-stellar-glimmer",
      value: 12,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-glimmer"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-glimmer"] ?? 1) > 0;
        return on ? (12 / 100) * ctx.baseAtk : 0;
      },
    },
    {
      id: "furnace-4pc-party-glimmer-dmg",
      label: "4-Piece Party Stellar Glimmer DMG% (Heart of the Furnace)",
      description: "All nearby party members gain +50% Stellar Glimmer reaction DMG (Does not stack with same artifact set)",
      stat: "stellarGlimmerDmgBonus",
      pieceRequirement: 4,
      isTeamBuff: true,
      conditionKey: "trigger-stellar-glimmer",
      value: 50,
      compute: (ctx) => {
        const on = (ctx.inputs?.["trigger-stellar-glimmer"] ?? "1") === "1" || Number(ctx.inputs?.["trigger-stellar-glimmer"] ?? 1) > 0;
        return on ? 50 : 0;
      },
    },
  ],
};
```

---

## 4. Pure Calculation Engine Pattern (`artifact-buffs.ts`)

```ts
export function resolveExternalArtifactBuffs(
  artifacts: ExternalArtifactInstance[] | undefined,
  baseAtk: number = 0,
  charConfig?: CharacterConfig,
  masterEnabled: boolean = true,
): ExternalArtifactBuffResult {
  const result: ExternalArtifactBuffResult = { statDeltas: {}, sources: [] };
  if (!masterEnabled || !artifacts || artifacts.length === 0) return result;

  const appliedTeamBuffs = new Set<string>();
  const validArtifacts = artifacts.slice(0, 4); // Max 4 sets per team

  for (const inst of validArtifacts) {
    if (!inst.enabled) continue;
    const config = artifactById(inst.artifactId);
    if (!config) continue;

    const pieceCount: ArtifactPieceCount = inst.pieceCount === 2 ? 2 : 4;
    const slot: ArtifactSlot = inst.slot || "wielder";

    const ctx: ArtifactBuffContext = {
      pieceCount,
      slot,
      baseAtk,
      charElement: charConfig?.element,
      inputs: inst.inputs ?? {},
    };

    for (const buff of config.buffs) {
      if (pieceCount < buff.pieceRequirement) continue;
      if (slot === "support" && !buff.isTeamBuff) continue;

      if (buff.isTeamBuff) {
        const teamBuffKey = `${config.id}-${buff.stat}`;
        if (appliedTeamBuffs.has(teamBuffKey)) continue; // Non-stacking rule
        appliedTeamBuffs.add(teamBuffKey);
      }

      let val = 0;
      if (buff.compute) {
        val = buff.compute(ctx);
      } else {
        const rawVal = buff.value ?? 0;
        val = buff.isPercent && buff.stat === "atk" ? (rawVal / 100) * baseAtk : rawVal;
      }

      if (val === 0 || !Number.isFinite(val)) continue;

      result.sources.push({
        artifactId: config.id,
        artifactName: config.name,
        pieceCount,
        slot,
        buffId: buff.id,
        stat: buff.stat,
        label: `${buff.label} (${pieceCount}-Pc, ${slot === "wielder" ? "Wielder" : "Support"})`,
        value: val,
      });

      const key = buff.stat as keyof DamageStats;
      (result.statDeltas as Record<string, number>)[key] =
        ((result.statDeltas as Record<string, number>)[key] ?? 0) + val;
    }
  }

  return result;
}
```

---

## 5. Adding a New Artifact Set: Step-by-Step Workflow

When adding a new artifact set to the system:

1. **Create the Artifact File**:
   - Location: `src/data/registry/artifacts/<artifact-slug>.ts` (e.g. `src/data/registry/artifacts/noblesse-oblige.ts`).
   - Define 2-piece and 4-piece bonuses, `isSupport`, `buffType` (`"team" | "self" | "both"`), `mechanicDefs`, and `compute` callbacks.
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
4. **Run Test Suite & Build Verification**:
   - Run `npm test` to verify all Vitest tests pass.
   - Run `npx prisma validate`.
   - Run `npm run build` to confirm zero TypeScript compilation errors.
5. **Sync Database**:
   - Run `npx prisma db seed` or verify DDL in `gi_stat_db.sql`.

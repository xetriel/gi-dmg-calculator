# Graph Report - gi-dmg-calculator  (2026-08-11)

## Corpus Check
- 244 files · ~133,686 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 806 nodes · 2662 edges · 43 communities (32 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5580fdfa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- damage.ts
- mechanics.ts
- talents/index.ts
- registry/types.ts
- useCalculatorState.ts
- devDependencies
- compilerOptions
- characters/index.ts
- app/page.tsx
- extract-wiki.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- Genshin Damage Calculator — Plan 2: Persistence & Rotation Export
- Setup
- [v1.2.0-Beta] - Current UI Header Version
- talents/gaming.ts
- talents/varesa.ts
- linnea.test.ts
- talents/alhaitham.ts
- talents/ayaka.ts
- talents/durin.ts
- ineffa.test.ts
- talents/mavuika.ts
- HistoryView.tsx
- CharacterCalculator.tsx
- columbina.test.ts
- gi_stat_db.sql
- 0_init/migration.sql
- AGENTS.md
- codebase-metrics.md
- 20260702120000_add_talent_scaling/migration.sql
- 20260703120000_add_export_log/migration.sql
- DamageTable.tsx
- Character Calculator Skill & Implementation Standard
- team-buffs.ts
- varka.test.ts
- calculator/types.ts
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `CharacterConfig` - 108 edges
2. `addMods()` - 79 edges
3. `fmt()` - 55 edges
4. `MechanicsCtx` - 53 edges
5. `MechanicsResult` - 47 edges
6. `CharacterTalentSeed` - 45 edges
7. `coreStats()` - 44 edges
8. `flattenSeed()` - 37 edges
9. `ctxFor()` - 35 edges
10. `TALENT_SEED` - 33 edges

## Surprising Connections (you probably didn't know these)
- `main()` --references--> `@prisma/client`  [EXTRACTED]
  prisma/seed.ts → package.json
- `FormulaBreakdownView()` --references--> `react`  [EXTRACTED]
  src/components/calculator/FormulaBreakdownView.tsx → package.json
- `renderStyledText()` --references--> `react`  [EXTRACTED]
  src/components/calculator/utils/colors.ts → package.json
- `main()` --calls--> `flattenSeed()`  [EXTRACTED]
  prisma/seed.ts → src/data/talents/index.ts
- `TeamBuffPanelProps` --references--> `CalcInstance`  [EXTRACTED]
  src/components/calculator/components/TeamBuffPanel.tsx → src/components/calculator/types.ts

## Import Cycles
- 3-file cycle: `src/data/registry/types.ts -> src/lib/engine/lunar.ts -> src/lib/engine/damage.ts -> src/data/registry/types.ts`

## Communities (43 total, 11 thin omitted)

### Community 0 - "damage.ts"
Cohesion: 0.11
Nodes (39): arlecchino, Element, HitCategory, ScalingSource, activeEffects(), constellationFlatBonus(), constellationStatBonuses(), AMP_BASE (+31 more)

### Community 1 - "mechanics.ts"
Cohesion: 0.09
Nodes (59): resolveAlhaitham(), resolveAloy(), resolveArlecchino(), resolveAyaka(), resolveAyato(), resolveClorinde(), resolveColumbina(), resolveCyno() (+51 more)

### Community 2 - "talents/index.ts"
Cohesion: 0.06
Nodes (40): TalentType, aloySeed, arlecchinoSeed, ayatoSeed, clorindeSeed, cynoSeed, dehyaSeed, dilucSeed (+32 more)

### Community 3 - "registry/types.ts"
Cohesion: 0.11
Nodes (26): atk(), atkCharged(), atkPlunge(), def(), defPlunge(), healHp(), hp(), hpCharged() (+18 more)

### Community 4 - "useCalculatorState.ts"
Cohesion: 0.14
Nodes (22): deleteBuild(), saveBuild(), FormulaPage(), loadScaling(), loadScaling(), Page(), fmt(), FormulaBreakdownView() (+14 more)

### Community 5 - "devDependencies"
Cohesion: 0.04
Nodes (48): dotenv, eslint, eslint-config-next, html-to-image, next, dependencies, html-to-image, next (+40 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "characters/index.ts"
Cohesion: 0.09
Nodes (40): main(), alhaitham, aloy, ayaka, ayato, clorinde, cyno, dehya (+32 more)

### Community 8 - "app/page.tsx"
Cohesion: 0.12
Nodes (22): DbStatusInfo, getDbStatus(), parseDatabaseUrl(), geistMono, geistSans, metadata, RootLayout(), ELEMENTS (+14 more)

### Community 9 - "extract-wiki.ts"
Cohesion: 0.20
Nodes (12): decode(), dmgPath, extractConstellations(), extractLevelMultipliers(), extractScalingTables(), FILES, found, levelMult (+4 more)

### Community 15 - "Genshin Damage Calculator — Plan 2: Persistence & Rotation Export"
Cohesion: 0.13
Nodes (14): 0.1 What Express + Pug is _for_, 0.2 Where the math runs, 0. Two decisions to make up front (read this first), 1. Updated architecture, 2. Data model (MySQL + Prisma), 3. Saving & loading builds (CRUD), 4. Rotations — the core new concept, 5. Export — the cheap formats (client-side, no server) (+6 more)

### Community 16 - "Setup"
Cohesion: 0.15
Nodes (12): 1. Prerequisites, 2. Configure Environment Variables, 3. Install Dependencies, 4. Database Setup & Initialization, 5. Seed the Talent Scaling Data, Deploy on Vercel, Getting Started, Learn More (+4 more)

### Community 17 - "[v1.2.0-Beta] - Current UI Header Version"
Cohesion: 0.20
Nodes (9): Added, Changes & Adjustments, Features & Major Additions, Fixed, Fixed, [Initial Phase] (No Version in UI Header), New Character Calculators, Project Development Documentation (+1 more)

### Community 18 - "talents/gaming.ts"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, gamingSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 19 - "talents/varesa.ts"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, NA_FACTORS, SKILL_BURST_FACTORS, varesaSeed

### Community 20 - "linnea.test.ts"
Cohesion: 0.33
Nodes (4): linnea, baseStats, MockCtxOverride, mockScaling

### Community 21 - "talents/alhaitham.ts"
Cohesion: 0.33
Nodes (3): alhaithamSeed, ALTERNATE_FACTORS, NA_FACTORS

### Community 22 - "talents/ayaka.ts"
Cohesion: 0.15
Nodes (6): ALTERNATE_FACTORS, ayakaSeed, NA_FACTORS, NA_FACTORS, SKILL_BURST_FACTORS, skirkSeed

### Community 23 - "talents/durin.ts"
Cohesion: 0.33
Nodes (3): ALTERNATE_FACTORS, durinSeed, NA_FACTORS

### Community 24 - "ineffa.test.ts"
Cohesion: 0.40
Nodes (3): ineffa, defaultStats, mockScaling

### Community 25 - "talents/mavuika.ts"
Cohesion: 0.33
Nodes (3): mavuikaSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 26 - "HistoryView.tsx"
Cohesion: 0.20
Nodes (11): deleteExportLog(), ExportFormat, ExportLogRow, ExportSummary, getExportLogs(), HistoryPage(), ComparePanel(), fmtNum() (+3 more)

### Community 27 - "CharacterCalculator.tsx"
Cohesion: 0.16
Nodes (21): fmt(), StatBreakdownRow(), StatBreakdownRowProps, initialStats, useRotation(), RotationStep, StatBuffSource, CharacterCalculator() (+13 more)

### Community 28 - "columbina.test.ts"
Cohesion: 0.29
Nodes (5): columbina, columbinaSeed, baseStats, MockCtxOverride, mockScaling

### Community 36 - "DamageTable.tsx"
Cohesion: 0.13
Nodes (22): DamageTable(), DamageTableProps, DIRECT_TAG, fmt(), fmt(), HitFormulaTooltip(), HitFormulaTooltipProps, fmt() (+14 more)

### Community 37 - "Character Calculator Skill & Implementation Standard"
Cohesion: 0.12
Nodes (15): 1. File Architecture & Required Modules, 2. Core Formula Interpretations, 3. Reaction Variants, 4. Special Mechanics Patterns, 5. Verification & Checklist, A. Flat DMG Bonus (`flatDmgBonus`), A. Lunar Reactions, B. Base DMG Multiplier (`baseDmgMultiplier`) (+7 more)

### Community 38 - "team-buffs.ts"
Cohesion: 0.17
Nodes (18): fmt(), TeamBuffPanel(), TeamBuffPanelProps, SUPPORT_CONFIGS, supportById(), ineffaSupport, SupportBuff, SupportConfig (+10 more)

### Community 39 - "varka.test.ts"
Cohesion: 0.33
Nodes (4): varka, baseStats, MockCtxOverride, mockScaling

### Community 40 - "calculator/types.ts"
Cohesion: 0.17
Nodes (19): MechanicsPanel(), MechanicsPanelProps, GROUPS, StatsGrid(), StatsGridProps, fmt(), TransformativePanel(), TransformativePanelProps (+11 more)

## Knowledge Gaps
- **169 isolated node(s):** `eslintConfig`, ``Build``, ``Rotation``, `nextConfig`, `name` (+164 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `devDependencies` to `useCalculatorState.ts`, `DamageTable.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `CharacterConfig` connect `registry/types.ts` to `damage.ts`, `mechanics.ts`, `DamageTable.tsx`, `useCalculatorState.ts`, `characters/index.ts`, `calculator/types.ts`, `CharacterCalculator.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `eslintConfig`, ``Build``, ``Rotation`` to the rest of the system?**
  _169 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `damage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11479591836734694 - nodes in this community are weakly interconnected._
- **Should `mechanics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._
- **Should `talents/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06390977443609022 - nodes in this community are weakly interconnected._
- **Should `registry/types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11292114031840059 - nodes in this community are weakly interconnected._
# Graph Report - gi-dmg-calculator  (2026-08-10)

## Corpus Check
- 245 files · ~133,960 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 793 nodes · 2677 edges · 42 communities (33 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `de7b2e75`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- formula-explainer.ts
- mechanics.ts
- talents/index.ts
- characters/index.ts
- HistoryView.tsx
- devDependencies
- compilerOptions
- test-helpers.ts
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
- talents/skirk.ts
- CharacterCalculator.tsx
- DamageStats
- gi_stat_db.sql
- 0_init/migration.sql
- AGENTS.md
- codebase-metrics.md
- 20260702120000_add_talent_scaling/migration.sql
- 20260703120000_add_export_log/migration.sql
- validation.ts
- useCalculatorState.ts
- team-buffs.ts
- supports/index.ts
- calculator/types.ts
- damage.ts

## God Nodes (most connected - your core abstractions)
1. `CharacterConfig` - 110 edges
2. `addMods()` - 81 edges
3. `fmt()` - 55 edges
4. `MechanicsCtx` - 54 edges
5. `MechanicsResult` - 48 edges
6. `CharacterTalentSeed` - 46 edges
7. `coreStats()` - 45 edges
8. `flattenSeed()` - 38 edges
9. `ctxFor()` - 36 edges
10. `TALENT_SEED` - 34 edges

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

## Communities (42 total, 9 thin omitted)

### Community 0 - "formula-explainer.ts"
Cohesion: 0.15
Nodes (29): arlecchino, neuvillette, amplifyingMultiplier(), catalyzeAdditive(), computeHit(), defMultiplier(), dmgBonusMultiplier(), resMultiplier() (+21 more)

### Community 1 - "mechanics.ts"
Cohesion: 0.09
Nodes (60): resolveAlhaitham(), resolveAloy(), resolveArlecchino(), resolveAyaka(), resolveAyato(), resolveClorinde(), resolveColumbina(), resolveCyno() (+52 more)

### Community 2 - "talents/index.ts"
Cohesion: 0.06
Nodes (41): TalentType, aloySeed, arlecchinoSeed, ayatoSeed, clorindeSeed, columbinaSeed, cynoSeed, dehyaSeed (+33 more)

### Community 3 - "characters/index.ts"
Cohesion: 0.07
Nodes (62): alhaitham, aloy, ayaka, ayato, clorinde, columbina, cyno, dehya (+54 more)

### Community 4 - "HistoryView.tsx"
Cohesion: 0.11
Nodes (21): FormulaPage(), loadScaling(), loadScaling(), Page(), deleteExportLog(), ExportFormat, ExportLogRow, ExportSummary (+13 more)

### Community 5 - "devDependencies"
Cohesion: 0.04
Nodes (48): dotenv, eslint, eslint-config-next, html-to-image, next, dependencies, html-to-image, next (+40 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "test-helpers.ts"
Cohesion: 0.17
Nodes (8): main(), flattenSeed(), TALENT_SEED, baseStats, ctxFor(), scalingFor(), resolveMechanics(), scalingFor()

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
Cohesion: 0.40
Nodes (3): baseStats, MockCtxOverride, mockScaling

### Community 21 - "talents/alhaitham.ts"
Cohesion: 0.33
Nodes (3): alhaithamSeed, ALTERNATE_FACTORS, NA_FACTORS

### Community 22 - "talents/ayaka.ts"
Cohesion: 0.33
Nodes (3): ALTERNATE_FACTORS, ayakaSeed, NA_FACTORS

### Community 23 - "talents/durin.ts"
Cohesion: 0.33
Nodes (3): ALTERNATE_FACTORS, durinSeed, NA_FACTORS

### Community 24 - "ineffa.test.ts"
Cohesion: 0.40
Nodes (3): ineffaSeed, defaultStats, mockScaling

### Community 25 - "talents/mavuika.ts"
Cohesion: 0.33
Nodes (3): mavuikaSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 26 - "talents/skirk.ts"
Cohesion: 0.33
Nodes (3): NA_FACTORS, SKILL_BURST_FACTORS, skirkSeed

### Community 27 - "CharacterCalculator.tsx"
Cohesion: 0.17
Nodes (17): fmt(), StatBreakdownRow(), StatBreakdownRowProps, RotationState, useRotation(), SavedRotation, StatBuffSource, CharacterCalculator() (+9 more)

### Community 28 - "DamageStats"
Cohesion: 0.20
Nodes (8): baseStats, MockCtxOverride, mockScaling, baseStats, MockCtxOverride, mockScaling, DamageStats, TeamBuffResult

### Community 36 - "validation.ts"
Cohesion: 0.12
Nodes (28): DamageTable(), DamageTableProps, DIRECT_TAG, fmt(), MechanicsPanel(), MechanicsPanelProps, fmt(), REACTION_LABEL (+20 more)

### Community 37 - "useCalculatorState.ts"
Cohesion: 0.24
Nodes (13): deleteBuild(), saveBuild(), fmt(), FormulaBreakdownView(), FormulaBreakdownViewProps, getInitialStats(), hydrateFromBuild(), initialStats (+5 more)

### Community 38 - "team-buffs.ts"
Cohesion: 0.29
Nodes (10): fmt(), TeamBuffPanel(), TeamBuffPanelProps, SUPPORT_CONFIGS, supportById(), resolveSupportCtx(), resolveTeamBuffs(), SupportInstance (+2 more)

### Community 39 - "supports/index.ts"
Cohesion: 0.40
Nodes (7): ineffaSupport, SupportBuff, SupportConfig, SupportCtx, SupportStatField, Constellation, MechanicDef

### Community 40 - "calculator/types.ts"
Cohesion: 0.21
Nodes (13): fmt(), HitFormulaTooltip(), HitFormulaTooltipProps, fmt(), TransformativePanel(), ReactionExtras, StatBreakdown, LunarResult (+5 more)

### Community 42 - "damage.ts"
Cohesion: 0.23
Nodes (13): RotationStep, Element, HitCategory, ReactionType, ScalingSource, AMP_BASE, CATALYZE_BASE, clamp() (+5 more)

## Knowledge Gaps
- **157 isolated node(s):** `eslintConfig`, ``Build``, ``Rotation``, `nextConfig`, `name` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `devDependencies` to `validation.ts`, `useCalculatorState.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `CharacterConfig` connect `characters/index.ts` to `formula-explainer.ts`, `mechanics.ts`, `validation.ts`, `useCalculatorState.ts`, `calculator/types.ts`, `CharacterCalculator.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `eslintConfig`, ``Build``, ``Rotation`` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mechanics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08852054311408923 - nodes in this community are weakly interconnected._
- **Should `talents/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.062317429406037 - nodes in this community are weakly interconnected._
- **Should `characters/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06965894465894466 - nodes in this community are weakly interconnected._
- **Should `HistoryView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._
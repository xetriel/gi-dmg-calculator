# Graph Report - gi-dmg-calculator  (2026-08-17)

## Corpus Check
- 248 files · ~135,147 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 767 nodes · 2652 edges · 49 communities (28 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b957202a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- characters/index.ts
- mechanics.ts
- talents/index.ts
- devDependencies
- test-helpers.ts
- formula/page.tsx
- app/page.tsx
- compilerOptions
- damage.ts
- xinyan.test.ts
- calculator/types.ts
- validation.ts
- team-buffs.ts
- useCalculatorState.ts
- extract-wiki.ts
- talents/gaming.ts
- talents/varesa.ts
- talents/alhaitham.ts
- talents/ayaka.ts
- talents/durin.ts
- talents/mavuika.ts
- talents/skirk.ts
- DamageStats
- CharacterCalculator.tsx
- Development Guide & Architecture
- ineffa.test.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- Graphify Agent Rules
- Graphify Workflow
- AGENTS Rules
- CLAUDE Guide
- Codebase Metrics
- Anemo Element Icon
- Cryo Element Icon
- Dendro Element Icon
- Electro Element Icon
- Geo Element Icon
- Hydro Element Icon
- Pyro Element Icon
- Bow Weapon Icon
- Catalyst Weapon Icon
- Claymore Weapon Icon
- Polearm Weapon Icon
- Sword Weapon Icon

## God Nodes (most connected - your core abstractions)
1. `CharacterConfig` - 110 edges
2. `addMods()` - 81 edges
3. `fmt()` - 57 edges
4. `MechanicsCtx` - 54 edges
5. `MechanicsResult` - 48 edges
6. `CharacterTalentSeed` - 46 edges
7. `coreStats()` - 45 edges
8. `flattenSeed()` - 38 edges
9. `ctxFor()` - 36 edges
10. `coeff()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `flattenSeed()`  [EXTRACTED]
  prisma/seed.ts → src/data/talents/index.ts
- `Character Calculator Skill Spec` --conceptually_related_to--> `Development Guide & Architecture`  [INFERRED]
  .agents/skills/character-calculator/SKILL.md → DEVELOPMENT.md
- `Initial Project Plan` --conceptually_related_to--> `Development Guide & Architecture`  [INFERRED]
  initial-plan.md → DEVELOPMENT.md
- `TeamBuffPanelProps` --references--> `CalcInstance`  [EXTRACTED]
  src/components/calculator/components/TeamBuffPanel.tsx → src/components/calculator/types.ts
- `TeamBuffResult` --references--> `DamageStats`  [EXTRACTED]
  src/lib/engine/team-buffs.ts → src/lib/engine/damage.ts

## Import Cycles
- 3-file cycle: `src/data/registry/types.ts -> src/lib/engine/lunar.ts -> src/lib/engine/damage.ts -> src/data/registry/types.ts`

## Communities (49 total, 21 thin omitted)

### Community 0 - "characters/index.ts"
Cohesion: 0.07
Nodes (63): alhaitham, aloy, ayaka, ayato, clorinde, columbina, cyno, dehya (+55 more)

### Community 1 - "mechanics.ts"
Cohesion: 0.09
Nodes (60): resolveAlhaitham(), resolveAloy(), resolveArlecchino(), resolveAyaka(), resolveAyato(), resolveClorinde(), resolveColumbina(), resolveCyno() (+52 more)

### Community 2 - "talents/index.ts"
Cohesion: 0.06
Nodes (40): TalentType, aloySeed, arlecchinoSeed, ayatoSeed, clorindeSeed, columbinaSeed, cynoSeed, dehyaSeed (+32 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (48): dotenv, eslint, eslint-config-next, next, dependencies, html-to-image, next, @prisma/adapter-mariadb (+40 more)

### Community 4 - "test-helpers.ts"
Cohesion: 0.16
Nodes (9): main(), flattenSeed(), TALENT_SEED, baseStats, ctxFor(), LV90, scalingFor(), resolveMechanics() (+1 more)

### Community 5 - "formula/page.tsx"
Cohesion: 0.09
Nodes (24): dynamic, FormulaPage(), loadScaling(), dynamic, loadScaling(), Page(), deleteExportLog(), ExportFormat (+16 more)

### Community 6 - "app/page.tsx"
Cohesion: 0.12
Nodes (22): DbStatusInfo, getDbStatus(), parseDatabaseUrl(), geistMono, geistSans, metadata, RootLayout(), ELEMENTS (+14 more)

### Community 7 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 8 - "damage.ts"
Cohesion: 0.14
Nodes (34): Element, HitCategory, ScalingSource, AMP_BASE, amplifyingMultiplier(), CATALYZE_BASE, catalyzeAdditive(), clamp() (+26 more)

### Community 10 - "calculator/types.ts"
Cohesion: 0.14
Nodes (26): DamageTableProps, MechanicsPanelProps, fmt(), REACTION_LABEL, RotationModal(), RotationModalProps, GROUPS, StatsGridProps (+18 more)

### Community 11 - "validation.ts"
Cohesion: 0.17
Nodes (19): DamageTable(), DIRECT_TAG, fmt(), fmt(), HitFormulaTooltip(), HitFormulaTooltipProps, baseStats, fullRaw() (+11 more)

### Community 12 - "team-buffs.ts"
Cohesion: 0.16
Nodes (18): fmt(), TeamBuffPanel(), TeamBuffPanelProps, SUPPORT_CONFIGS, supportById(), ineffaSupport, SupportBuff, SupportConfig (+10 more)

### Community 13 - "useCalculatorState.ts"
Cohesion: 0.35
Nodes (10): deleteBuild(), saveBuild(), fmt(), FormulaBreakdownView(), getInitialStats(), hydrateFromBuild(), useCalculatorState(), UseCalculatorStateProps (+2 more)

### Community 14 - "extract-wiki.ts"
Cohesion: 0.20
Nodes (12): decode(), dmgPath, extractConstellations(), extractLevelMultipliers(), extractScalingTables(), FILES, found, levelMult (+4 more)

### Community 16 - "talents/gaming.ts"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, gamingSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 17 - "talents/varesa.ts"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, NA_FACTORS, SKILL_BURST_FACTORS, varesaSeed

### Community 20 - "talents/alhaitham.ts"
Cohesion: 0.33
Nodes (3): alhaithamSeed, ALTERNATE_FACTORS, NA_FACTORS

### Community 21 - "talents/ayaka.ts"
Cohesion: 0.33
Nodes (3): ALTERNATE_FACTORS, ayakaSeed, NA_FACTORS

### Community 22 - "talents/durin.ts"
Cohesion: 0.33
Nodes (3): ALTERNATE_FACTORS, durinSeed, NA_FACTORS

### Community 23 - "talents/mavuika.ts"
Cohesion: 0.33
Nodes (3): mavuikaSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 24 - "talents/skirk.ts"
Cohesion: 0.33
Nodes (3): NA_FACTORS, SKILL_BURST_FACTORS, skirkSeed

### Community 25 - "DamageStats"
Cohesion: 0.13
Nodes (13): FormulaBreakdownViewProps, arlecchino, baseStats, MockCtxOverride, mockScaling, baseStats, MockCtxOverride, mockScaling (+5 more)

### Community 26 - "CharacterCalculator.tsx"
Cohesion: 0.15
Nodes (20): MechanicsPanel(), fmt(), StatBreakdownRow(), StatBreakdownRowProps, StatsGrid(), initialStats, RotationState, useRotation() (+12 more)

### Community 27 - "Development Guide & Architecture"
Cohesion: 0.50
Nodes (4): Character Calculator Skill Spec, Development Guide & Architecture, Initial Project Plan, Genshin Impact Damage Calculator Overview

### Community 28 - "ineffa.test.ts"
Cohesion: 0.40
Nodes (3): ineffaSeed, defaultStats, mockScaling

## Knowledge Gaps
- **149 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+144 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterConfig` connect `characters/index.ts` to `mechanics.ts`, `damage.ts`, `calculator/types.ts`, `validation.ts`, `useCalculatorState.ts`, `DamageStats`, `CharacterCalculator.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `DamageStats` connect `DamageStats` to `mechanics.ts`, `test-helpers.ts`, `damage.ts`, `calculator/types.ts`, `validation.ts`, `team-buffs.ts`, `CharacterCalculator.tsx`, `ineffa.test.ts`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `TalentScalingData` connect `DamageStats` to `mechanics.ts`, `test-helpers.ts`, `formula/page.tsx`, `damage.ts`, `calculator/types.ts`, `validation.ts`, `useCalculatorState.ts`, `CharacterCalculator.tsx`, `ineffa.test.ts`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _149 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `characters/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06874209860935525 - nodes in this community are weakly interconnected._
- **Should `mechanics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08922588608710985 - nodes in this community are weakly interconnected._
- **Should `talents/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06390977443609022 - nodes in this community are weakly interconnected._
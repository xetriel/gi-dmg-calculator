# Graph Report - gi-dmg-calculator  (2026-08-19)

## Corpus Check
- 262 files · ~151,101 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 841 nodes · 2865 edges · 54 communities (33 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbec06e1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- characters/index.ts
- mechanics.ts
- talents/index.ts
- devDependencies
- test-helpers.ts
- [id]/page.tsx
- app/page.tsx
- compilerOptions
- damage.ts
- xinyan.test.ts
- CharacterCalculator.tsx
- TalentScalingData
- SupportBuildEditorView.tsx
- useCalculatorState.ts
- extract-wiki.ts
- ExternalWeaponBuffPanel.tsx
- talents/gaming.ts
- talents/varesa.ts
- Formula Breakdown & Explainer Skill & Implementation Standard
- 3. Data Layer Specifications
- talents/alhaitham.ts
- talents/ayaka.ts
- talents/durin.ts
- talents/mavuika.ts
- talents/skirk.ts
- DamageStats
- formula-explainer.ts
- Development Guide & Architecture
- ineffa.test.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- Graphify Agent Rules
- Graphify Workflow
- AGENTS Rules
- CLAUDE Guide
- Element
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
- mizuki.test.ts
- arlecchino-go-debug.test.ts

## God Nodes (most connected - your core abstractions)
1. `CharacterConfig` - 118 edges
2. `addMods()` - 83 edges
3. `fmt()` - 59 edges
4. `MechanicsCtx` - 55 edges
5. `MechanicsResult` - 49 edges
6. `CharacterTalentSeed` - 47 edges
7. `coreStats()` - 46 edges
8. `flattenSeed()` - 39 edges
9. `ctxFor()` - 37 edges
10. `coeff()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `flattenSeed()`  [EXTRACTED]
  prisma/seed.ts → src/data/talents/index.ts
- `Character Calculator Skill Spec` --conceptually_related_to--> `Development Guide & Architecture`  [INFERRED]
  .agents/skills/character-calculator/SKILL.md → DEVELOPMENT.md
- `Initial Project Plan` --conceptually_related_to--> `Development Guide & Architecture`  [INFERRED]
  initial-plan.md → DEVELOPMENT.md
- `SupportBuildEditorViewProps` --references--> `CharacterConfig`  [EXTRACTED]
  src/components/calculator/SupportBuildEditorView.tsx → src/data/registry/types.ts
- `TeamBuffPanelProps` --references--> `CalcInstance`  [EXTRACTED]
  src/components/calculator/components/TeamBuffPanel.tsx → src/components/calculator/types.ts

## Import Cycles
- 3-file cycle: `src/data/registry/types.ts -> src/lib/engine/lunar.ts -> src/lib/engine/damage.ts -> src/data/registry/types.ts`

## Communities (54 total, 21 thin omitted)

### Community 0 - "characters/index.ts"
Cohesion: 0.07
Nodes (63): alhaitham, aloy, ayaka, ayato, clorinde, columbina, cyno, dehya (+55 more)

### Community 1 - "mechanics.ts"
Cohesion: 0.08
Nodes (63): resolveAlhaitham(), resolveAloy(), resolveArlecchino(), resolveAyaka(), resolveAyato(), resolveClorinde(), resolveColumbina(), resolveCyno() (+55 more)

### Community 2 - "talents/index.ts"
Cohesion: 0.07
Nodes (39): TalentType, aloySeed, ayatoSeed, clorindeSeed, columbinaSeed, cynoSeed, dehyaSeed, dilucSeed (+31 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (48): dotenv, eslint, eslint-config-next, next, dependencies, html-to-image, next, @prisma/adapter-mariadb (+40 more)

### Community 4 - "test-helpers.ts"
Cohesion: 0.17
Nodes (8): main(), flattenSeed(), TALENT_SEED, baseStats, ctxFor(), LV90, scalingFor(), scalingFor()

### Community 5 - "[id]/page.tsx"
Cohesion: 0.09
Nodes (25): FormulaPage(), loadScaling(), dynamic, loadScaling(), Page(), dynamic, SupportPage(), deleteExportLog() (+17 more)

### Community 6 - "app/page.tsx"
Cohesion: 0.12
Nodes (22): DbStatusInfo, getDbStatus(), parseDatabaseUrl(), geistMono, geistSans, metadata, RootLayout(), ELEMENTS (+14 more)

### Community 7 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 8 - "damage.ts"
Cohesion: 0.15
Nodes (26): neuvillette, AMP_BASE, amplifyingMultiplier(), availableReactions(), CATALYZE_BASE, catalyzeAdditive(), clamp(), computeHit() (+18 more)

### Community 10 - "CharacterCalculator.tsx"
Cohesion: 0.11
Nodes (34): MechanicsPanel(), MechanicsPanelProps, RotationModalProps, fmt(), StatBreakdownRow(), StatBreakdownRowProps, GROUPS, StatsGrid() (+26 more)

### Community 11 - "TalentScalingData"
Cohesion: 0.16
Nodes (18): DamageTable(), DamageTableProps, DIRECT_TAG, fmt(), fmt(), HitFormulaTooltip(), HitFormulaTooltipProps, fmt() (+10 more)

### Community 12 - "SupportBuildEditorView.tsx"
Cohesion: 0.13
Nodes (24): fmt(), readSupportDraft(), TeamBuffPanel(), TeamBuffPanelProps, fmt(), SupportBuildEditorView(), SupportBuildEditorViewProps, bennettSupport (+16 more)

### Community 13 - "useCalculatorState.ts"
Cohesion: 0.34
Nodes (9): deleteBuild(), saveBuild(), dynamic, fmt(), FormulaBreakdownView(), getInitialStats(), hydrateFromBuild(), useCalculatorState() (+1 more)

### Community 14 - "extract-wiki.ts"
Cohesion: 0.20
Nodes (12): decode(), dmgPath, extractConstellations(), extractLevelMultipliers(), extractScalingTables(), FILES, found, levelMult (+4 more)

### Community 15 - "ExternalWeaponBuffPanel.tsx"
Cohesion: 0.16
Nodes (17): ExternalWeaponBuffPanel(), ExternalWeaponBuffPanelProps, fmt(), RARITY_COLORS, weaponById(), ExternalWeaponInstance, getWeaponsForCharacter(), WeaponBuffContext (+9 more)

### Community 16 - "talents/gaming.ts"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, gamingSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 17 - "talents/varesa.ts"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, NA_FACTORS, SKILL_BURST_FACTORS, varesaSeed

### Community 18 - "Formula Breakdown & Explainer Skill & Implementation Standard"
Cohesion: 0.12
Nodes (15): 1. Core Architecture & Philosophy, 2. File Architecture & Modules, 3. Formula Decomposition Engine (`explainHitFormulas`), 4. Mathematical Equation Decomposition Standard, 5. UI Components & Interaction Patterns, 6. Special Constellation Hit Implementation Standard, 7. Verification Checklist, A. Formula Breakdown Interface (`FormulaBreakdown`) (+7 more)

### Community 19 - "3. Data Layer Specifications"
Cohesion: 0.18
Nodes (10): 1. Core Architecture & Philosophy, 2. File Architecture & Modules, 3. Data Layer Specifications, 4. Verification Checklist, A. Context Interface (`SupportCtx`), B. Support Buff Interface (`SupportBuff`), C. Brief Stat Pill Interface (`BriefStatPill`), D. Full Support Config (`SupportConfig`) (+2 more)

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
Cohesion: 0.20
Nodes (8): baseStats, MockCtxOverride, mockScaling, baseStats, MockCtxOverride, mockScaling, MockCtxOverride, DamageStats

### Community 26 - "formula-explainer.ts"
Cohesion: 0.23
Nodes (19): CharacterCalculator(), fmt(), activeEffects(), constellationFlatBonus(), constellationStatBonuses(), scalingTotal(), manualResolved(), AMP_BASE (+11 more)

### Community 27 - "Development Guide & Architecture"
Cohesion: 0.50
Nodes (4): Character Calculator Skill Spec, Development Guide & Architecture, Initial Project Plan, Genshin Impact Damage Calculator Overview

### Community 28 - "ineffa.test.ts"
Cohesion: 0.40
Nodes (3): ineffaSeed, defaultStats, mockScaling

### Community 37 - "Element"
Cohesion: 0.29
Nodes (8): RotationStep, Element, HitCategory, ReactionType, ScalingSource, HitInput, FormulaBreakdown, RawInputs

### Community 52 - "mizuki.test.ts"
Cohesion: 0.33
Nodes (3): mizukiSeed, NA_FACTORS, SKILL_BURST_FACTORS

## Knowledge Gaps
- **173 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterConfig` connect `characters/index.ts` to `mechanics.ts`, `CharacterCalculator.tsx`, `TalentScalingData`, `SupportBuildEditorView.tsx`, `useCalculatorState.ts`, `ExternalWeaponBuffPanel.tsx`, `formula-explainer.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `DamageStats` connect `DamageStats` to `mechanics.ts`, `test-helpers.ts`, `damage.ts`, `CharacterCalculator.tsx`, `SupportBuildEditorView.tsx`, `ExternalWeaponBuffPanel.tsx`, `formula-explainer.ts`, `ineffa.test.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `flattenSeed()` connect `test-helpers.ts` to `mechanics.ts`, `talents/index.ts`, `[id]/page.tsx`, `damage.ts`, `xinyan.test.ts`, `useCalculatorState.ts`, `mizuki.test.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `characters/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06831237385499146 - nodes in this community are weakly interconnected._
- **Should `mechanics.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08264854614412137 - nodes in this community are weakly interconnected._
- **Should `talents/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06558558558558558 - nodes in this community are weakly interconnected._
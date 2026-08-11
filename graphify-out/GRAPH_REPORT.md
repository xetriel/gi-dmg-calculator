# Graph Report - .  (2026-08-11)

## Corpus Check
- 261 files · ~133,256 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 758 nodes · 2614 edges · 52 communities (31 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Xiao Character Mechanics & Scaling
- Xiao Character Mechanics & Scaling
- Xiao Character Mechanics & Scaling
- Database Schema & Seeds
- Xiao Character Mechanics & Scaling
- Damage Core Engine & Formulas
- Database Schema & Seeds
- Module Dom Infrastructure
- Arlecchino Mechanics & Scaling
- Elemental Reactions Engine
- Arlecchino Mechanics & Scaling
- Elemental Reactions Engine
- Team Buffs & Support Registry
- Damage Core Engine & Formulas
- Module Wiki Infrastructure
- Elemental Reactions Engine
- Database Schema & Seeds
- Database Schema & Seeds
- Database Schema & Seeds
- Database Schema & Seeds
- Database Schema & Seeds
- Database Schema & Seeds
- Database Schema & Seeds
- Database Schema & Seeds
- Database Schema & Seeds
- Damage Core Engine & Formulas
- Team Buffs & Support Registry
- UI Components & Layout
- Module Test Infrastructure
- Module Config Infrastructure
- Module Config Infrastructure
- Module Config Infrastructure
- Module Rule Infrastructure
- Module Workflow Infrastructure
- Module Rules Infrastructure
- UI Components & Layout
- Module Metrics Infrastructure
- Module Webp Infrastructure
- Module Webp Infrastructure
- Module Webp Infrastructure
- Module Webp Infrastructure
- Module Webp Infrastructure
- Module Webp Infrastructure
- Module Webp Infrastructure
- Weapons Registry
- Weapons Registry
- Weapons Registry
- Weapons Registry
- Weapons Registry

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
- `main()` --calls--> `flattenSeed()`  [EXTRACTED]
  prisma/seed.ts → src/data/talents/index.ts
- `Character Calculator Skill Spec` --conceptually_related_to--> `Development Guide & Architecture`  [INFERRED]
  .agents/skills/character-calculator/SKILL.md → DEVELOPMENT.md
- `Initial Project Plan` --conceptually_related_to--> `Development Guide & Architecture`  [INFERRED]
  initial-plan.md → DEVELOPMENT.md
- `TeamBuffPanelProps` --references--> `CalcInstance`  [EXTRACTED]
  src/components/calculator/components/TeamBuffPanel.tsx → src/components/calculator/types.ts
- `MockCtxOverride` --references--> `DamageStats`  [EXTRACTED]
  src/lib/engine/characters/linnea.test.ts → src/lib/engine/damage.ts

## Import Cycles
- 3-file cycle: `src/data/registry/types.ts -> src/lib/engine/lunar.ts -> src/lib/engine/damage.ts -> src/data/registry/types.ts`

## Communities (52 total, 21 thin omitted)

### Community 0 - "Xiao Character Mechanics & Scaling"
Cohesion: 0.07
Nodes (62): alhaitham, aloy, ayaka, ayato, clorinde, columbina, cyno, dehya (+54 more)

### Community 1 - "Xiao Character Mechanics & Scaling"
Cohesion: 0.09
Nodes (59): resolveAlhaitham(), resolveAloy(), resolveArlecchino(), resolveAyaka(), resolveAyato(), resolveClorinde(), resolveColumbina(), resolveCyno() (+51 more)

### Community 2 - "Xiao Character Mechanics & Scaling"
Cohesion: 0.07
Nodes (39): TalentType, aloySeed, arlecchinoSeed, ayatoSeed, clorindeSeed, columbinaSeed, cynoSeed, dehyaSeed (+31 more)

### Community 3 - "Database Schema & Seeds"
Cohesion: 0.04
Nodes (48): dotenv, eslint, eslint-config-next, next, dependencies, html-to-image, next, @prisma/adapter-mariadb (+40 more)

### Community 4 - "Xiao Character Mechanics & Scaling"
Cohesion: 0.16
Nodes (9): main(), flattenSeed(), TALENT_SEED, baseStats, ctxFor(), LV90, scalingFor(), resolveMechanics() (+1 more)

### Community 5 - "Damage Core Engine & Formulas"
Cohesion: 0.09
Nodes (24): dynamic, FormulaPage(), loadScaling(), dynamic, loadScaling(), Page(), deleteExportLog(), ExportFormat (+16 more)

### Community 6 - "Database Schema & Seeds"
Cohesion: 0.12
Nodes (22): DbStatusInfo, getDbStatus(), parseDatabaseUrl(), geistMono, geistSans, metadata, RootLayout(), ELEMENTS (+14 more)

### Community 7 - "Module Dom Infrastructure"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 8 - "Arlecchino Mechanics & Scaling"
Cohesion: 0.19
Nodes (22): arlecchino, activeEffects(), constellationFlatBonus(), constellationStatBonuses(), AMP_BASE, amplifyingMultiplier(), availableReactions(), CATALYZE_BASE (+14 more)

### Community 9 - "Elemental Reactions Engine"
Cohesion: 0.17
Nodes (21): fmt(), TransformativePanel(), TransformativePanelProps, ReactionExtras, StatBreakdown, LEVEL_MULTIPLIERS, levelMultiplier(), clamp() (+13 more)

### Community 10 - "Arlecchino Mechanics & Scaling"
Cohesion: 0.15
Nodes (20): DamageTable(), DamageTableProps, DIRECT_TAG, fmt(), fmt(), HitFormulaTooltip(), HitFormulaTooltipProps, fmt() (+12 more)

### Community 11 - "Elemental Reactions Engine"
Cohesion: 0.15
Nodes (22): MechanicsPanel(), MechanicsPanelProps, GROUPS, StatsGrid(), StatsGridProps, CharacterCalculator(), DIRECT_TAG, EFFECTIVE_ROWS (+14 more)

### Community 12 - "Team Buffs & Support Registry"
Cohesion: 0.16
Nodes (18): fmt(), TeamBuffPanel(), TeamBuffPanelProps, SUPPORT_CONFIGS, supportById(), ineffaSupport, SupportBuff, SupportConfig (+10 more)

### Community 13 - "Damage Core Engine & Formulas"
Cohesion: 0.20
Nodes (15): deleteBuild(), saveBuild(), fmt(), FormulaBreakdownView(), FormulaBreakdownViewProps, getInitialStats(), hydrateFromBuild(), initialStats (+7 more)

### Community 14 - "Module Wiki Infrastructure"
Cohesion: 0.20
Nodes (12): decode(), dmgPath, extractConstellations(), extractLevelMultipliers(), extractScalingTables(), FILES, found, levelMult (+4 more)

### Community 15 - "Elemental Reactions Engine"
Cohesion: 0.29
Nodes (8): RotationStep, Element, HitCategory, ReactionType, ScalingSource, HitInput, FormulaBreakdown, RawInputs

### Community 16 - "Database Schema & Seeds"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, gamingSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 17 - "Database Schema & Seeds"
Cohesion: 0.25
Nodes (4): ALTERNATE_FACTORS, NA_FACTORS, SKILL_BURST_FACTORS, varesaSeed

### Community 18 - "Database Schema & Seeds"
Cohesion: 0.33
Nodes (4): linneaSeed, baseStats, MockCtxOverride, mockScaling

### Community 19 - "Database Schema & Seeds"
Cohesion: 0.33
Nodes (4): varkaSeed, baseStats, MockCtxOverride, mockScaling

### Community 20 - "Database Schema & Seeds"
Cohesion: 0.33
Nodes (3): alhaithamSeed, ALTERNATE_FACTORS, NA_FACTORS

### Community 21 - "Database Schema & Seeds"
Cohesion: 0.33
Nodes (3): ALTERNATE_FACTORS, ayakaSeed, NA_FACTORS

### Community 22 - "Database Schema & Seeds"
Cohesion: 0.33
Nodes (3): ALTERNATE_FACTORS, durinSeed, NA_FACTORS

### Community 23 - "Database Schema & Seeds"
Cohesion: 0.33
Nodes (3): mavuikaSeed, NA_FACTORS, SKILL_BURST_FACTORS

### Community 24 - "Database Schema & Seeds"
Cohesion: 0.33
Nodes (3): NA_FACTORS, SKILL_BURST_FACTORS, skirkSeed

### Community 25 - "Damage Core Engine & Formulas"
Cohesion: 0.40
Nodes (4): baseStats, MockCtxOverride, mockScaling, DamageStats

### Community 26 - "Team Buffs & Support Registry"
Cohesion: 0.60
Nodes (4): fmt(), StatBreakdownRow(), StatBreakdownRowProps, StatBuffSource

### Community 27 - "UI Components & Layout"
Cohesion: 0.50
Nodes (4): Character Calculator Skill Spec, Development Guide & Architecture, Initial Project Plan, Genshin Impact Damage Calculator Overview

## Knowledge Gaps
- **148 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CharacterConfig` connect `Xiao Character Mechanics & Scaling` to `Xiao Character Mechanics & Scaling`, `Arlecchino Mechanics & Scaling`, `Elemental Reactions Engine`, `Arlecchino Mechanics & Scaling`, `Elemental Reactions Engine`, `Damage Core Engine & Formulas`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `DamageStats` connect `Damage Core Engine & Formulas` to `Xiao Character Mechanics & Scaling`, `Xiao Character Mechanics & Scaling`, `Arlecchino Mechanics & Scaling`, `Elemental Reactions Engine`, `Arlecchino Mechanics & Scaling`, `Elemental Reactions Engine`, `Team Buffs & Support Registry`, `Database Schema & Seeds`, `Database Schema & Seeds`, `Module Test Infrastructure`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `TalentScalingData` connect `Arlecchino Mechanics & Scaling` to `Xiao Character Mechanics & Scaling`, `Xiao Character Mechanics & Scaling`, `Damage Core Engine & Formulas`, `Arlecchino Mechanics & Scaling`, `Elemental Reactions Engine`, `Elemental Reactions Engine`, `Damage Core Engine & Formulas`, `Database Schema & Seeds`, `Database Schema & Seeds`, `Damage Core Engine & Formulas`, `Module Test Infrastructure`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Xiao Character Mechanics & Scaling` be split into smaller, more focused modules?**
  _Cohesion score 0.0701064701064701 - nodes in this community are weakly interconnected._
- **Should `Xiao Character Mechanics & Scaling` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._
- **Should `Xiao Character Mechanics & Scaling` be split into smaller, more focused modules?**
  _Cohesion score 0.06558558558558558 - nodes in this community are weakly interconnected._
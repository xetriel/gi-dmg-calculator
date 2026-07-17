# Project Development Documentation

This document logs the feature updates, architecture changes, and character releases across all versions of the Genshin Damage Calculator, matching the version displayed in the application header.

---

## [v1.2.0-Beta] - Current UI Header Version

All developments listed below were implemented during the `v1.2.0-Beta` release cycle (from July 3, 2026 to July 18, 2026).

### New Character Calculators
- **Gaming (July 18, 2026)**: Added Gaming, a 4-star Pyro Claymore character specializing in plunging attacks via his Elemental Skill *Bestial Ascent*, featuring A4 plunge DMG bonus and C6 crit scaling.
- **Varesa (July 17, 2026)**: Added Varesa, a 5-star Electro Catalyst character from Natlan specializing in Plunging Attacks and Nightsoul-related mechanics.
- **Skirk (July 17, 2026)**: Added Skirk, a playable 5-star Cryo Sword character utilizing a unique "Serpent's Subtlety" resource system instead of traditional Elemental Energy.
- **Linnea (July 15, 2026)**: Added Linnea character definition, stat scaling data, and custom mechanics.
- **Ineffa (July 14, 2026)**: Added Ineffa character definition, stat scaling data, custom direct reaction scaling, C1 reaction bonus, and dynamic shield calculations.
- **Varka (July 14, 2026)**: Implemented Varka talent multipliers, passive skills, and special A1/A4 resonance check logic.
- **Columbina (July 14, 2026)**: Implemented Columbina talent multipliers and status effects utilizing Lunar reaction mechanics.
- **Flins (July 14, 2026)**: Added Flins character logic and calculations.
- **Nefer (July 14, 2026)**: Added Nefer character calculator and scaling variables.
- **Zibai (July 6, 2026)**: Implemented Zibai character (with specialized Lunar-Crystallize mechanics).

### Features & Major Additions
- **Vertical/Horizontal Split View Layout (July 18, 2026)**: Implemented split-screen mechanics for character setups with vertical splitting (top part for inputs, bottom part for damage outputs), featuring mouse drag resizing via a draggable horizontal divider.
- **Collapsible Constellation Dropdown Permanence (July 18, 2026)**: Modified the constellation dropdown to always display all 6 constellations (C1-C6) with dynamic dimming (`opacity-40` with transitions) on locked/inactive constellations.
- **Dynamic Initial Stats Application (July 18, 2026)**: Improved the character stats initializer to automatically set the primary element DMG bonus to `46.6%` for elemental characters while leaving it at `0%` for direct reaction Lunar/Stellar characters. Also upgraded default layout stats ratios (HP, ATK, DEF, CRIT).
- **WebP Element and Weapon Assets (July 17, 2026)**: Replaced vector SVG paths in `icons.tsx` with optimized WebP images (`Element_[Name].webp` and `Weapon-class-[Name]-icon.webp`) combined with dark-mode invert filters.
- **Character Filtering & Sidebar Collapse (July 17, 2026)**: Added search, element, weapon, and quality filters on the character selection dashboard and sidebar.
  - Collapsible panels allow dynamic narrowing of character lists on the sidebar and dashboard.
- **Output Damage Type Coloring (July 17, 2026)**: Implemented dynamic text and output coloring in the calculator UI.
  - Created a keyword highlighting text renderer for character and calculation notes.
  - Styled non-crit, crit, average damage table cells, and transformative reaction panels dynamically by element/reaction/heal color configurations.
- **Support for Shield Kind (July 15, 2026)**: Extended the engine and UI to support `shield` as a first-class hit kind. Shields do not scale with Healing Bonus, are styled with a distinct blue background, are labeled as `(SHIELD)` in the rows, and print with a `Shield` suffix in exports.
- **Gemini OCR Screenshot Scanner (July 10, 2026)**: Integrated Character Stats Screenshot Scanner using the Gemini API. Users can paste or drop screenshots of their character screen to automatically populate base and flat stats.
- **Export Logs & History (July 3, 2026)**: Created the `/history` logs page showing a history of downloads and exports, including a multi-build delta comparison and sparkline graphs.
- **Multi-Format Exporting (July 3, 2026)**: Added support for exporting build statistics and combo graphs to JSON, CSV, TXT, PDF, and PNG formats.
- **Draggable Rotation Builder (July 3, 2026)**: Redesigned rotation builder to support sorting, dragging, and sequencing steps.
- **Offline Storage & Fallback (July 3, 2026)**: Added localStorage-backed offline fallback. When the database is unreachable, configurations are saved locally and synchronized automatically once the server database becomes online.
- **Detailed Stats Breakdown (July 14, 2026)**: Expanded the "Effective Stats" tab to display comprehensive breakdown formulas for all DMG Bonuses.

### Changes & Adjustments
- **Engine Refactoring & Modularization (July 17, 2026)**: Extracted character-specific calculations from the monolithic `mechanics.ts` into a new modular folder structure under `src/lib/engine/characters/`. Each character now has their own implementation file and corresponding test file.
- **Enemy Level Range**: Increased validation and limits for the enemy level from `100` to `200` (`Must be 0 < level ≤ 200`) to support high-level boss simulations.
- **Code Refactor**: Performed a major refactoring of calculator components to optimize performance, responsiveness, and file structure.
- **Outermost Header Enhancements**: Revamped RootLayout header with custom SVG sword logos, a v1.2.0-Beta version pill, and a pulsing status badge showing database connectivity.

### Fixed
- **Universal DMG Bonus**: Corrected a computation error where universal DMG bonuses were not properly added to element-specific values in certain sub-formulas.

---

## [Initial Phase] (No Version in UI Header)

Developments before the `v1.2.0-Beta` header was introduced on July 3, 2026 (matching the initial `0.1.0` package.json version).

### Added
- **Sandrone (July 3, 2026)**: Added Sandrone character calculator.
- **Build persistence**: Integrated Prisma persistence allowing users to save multiple custom builds per character.
- **Rotation Builder**: Built a step-by-step combo sequence builder allowing users to chain Normal Attacks, Skills, and Bursts.
- **Framework Setup**: Initialized the project with Next.js 16 (App Router), Prisma ORM (MySQL/MariaDB), and Tailwind CSS.
- **Initial Characters**: Added basic calculators for **Hu Tao** (including HP-to-ATK scaling and Homa passives) and **Neuvillette** (including HP scaling and raw water beams).
- **Base/Flat Splitting**: Separated HP, ATK, and DEF inputs into base and flat fields.
- **Input Validation**: Added form-field validation for stats and talent levels.

### Fixed
- **Arlecchino**: Fixed a calculation bug with Arlecchino's *Masque of the Red Death* Bond of Life consumption scaling.

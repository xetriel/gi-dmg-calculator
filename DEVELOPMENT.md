# Project Development Documentation

This document logs the feature updates, architecture changes, and character releases across all versions of the Genshin Damage Calculator, matching the version displayed in the application header.

---

## [v1.2.0-Beta] - Current UI Header Version

All developments listed below were implemented during the `v1.2.0-Beta` release cycle (from July 3, 2026 to July 15, 2026).

### New Character Calculators
- **Linnea (July 15, 2026)**: Added Linnea character definition, stat scaling data, and custom mechanics.
- **Varka (July 14, 2026)**: Implemented Varka talent multipliers, passive skills, and special A1/A4 resonance check logic.
- **Columbina (July 14, 2026)**: Implemented Columbina talent multipliers and status effects utilizing Lunar reaction mechanics.
- **Flins (July 14, 2026)**: Added Flins character logic and calculations.
- **Nefer (July 14, 2026)**: Added Nefer character calculator and scaling variables.
- **Zibai (July 6, 2026)**: Implemented Zibai character (with specialized Lunar-Crystallize mechanics).

### Features & Major Additions
- **Gemini OCR Screenshot Scanner (July 10, 2026)**: Integrated Character Stats Screenshot Scanner using the Gemini API. Users can paste or drop screenshots of their character screen to automatically populate base and flat stats.
- **Export Logs & History (July 3, 2026)**: Created the `/history` logs page showing a history of downloads and exports, including a multi-build delta comparison and sparkline graphs.
- **Multi-Format Exporting (July 3, 2026)**: Added support for exporting build statistics and combo graphs to JSON, CSV, TXT, PDF, and PNG formats.
- **Draggable Rotation Builder (July 3, 2026)**: Redesigned rotation builder to support sorting, dragging, and sequencing steps.
- **Offline Storage & Fallback (July 3, 2026)**: Added localStorage-backed offline fallback. When the database is unreachable, configurations are saved locally and synchronized automatically once the server database becomes online.
- **Detailed Stats Breakdown (July 14, 2026)**: Expanded the "Effective Stats" tab to display comprehensive breakdown formulas for all DMG Bonuses.

### Changes & Adjustments
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

# Project Development Documentation

This document logs the feature updates, architecture changes, and character releases across all versions of the Genshin Damage Calculator, matching the version displayed in the application header.

---

## [v1.2.0-Beta] - Current UI Header Version

All developments listed below were implemented during the `v1.2.0-Beta` release cycle (from July 3, 2026 to August 4, 2026).

### New Character Calculators
- **Ganyu (August 4, 2026)**: Added Ganyu, a 5-star Cryo Bow main-DPS featuring Frostflake Arrow 2-stage charge shot & Frostflake Bloom DMG, Trail of the Qilin skill, Celestial Shower burst (Cryo DMG Bonus +20% inside field via A4 Undivided Heart), A1 Frostflake CRIT Rate (+20%), C1 Cryo RES shred (-15%), C4 DMG Bonus taken (+5% per stack, up to +25%), C6 instant Frostflake charge after Skill, and custom Frostflake color styling.
- **Eula (August 4, 2026)**: Added Eula, a 5-star Physical Claymore main-DPS featuring Grimheart stacks (+30% DEF per stack, Physical & Cryo RES shred on Consuming Grimheart), Lightfall Sword stack scaling (flat multiplier scaling per stack up to 30 stacks), A1 Roaring Blaze Shattered Lightfall Sword, A4 Skill CD reset on Burst, C1 Physical DMG Bonus (+30%), C2 Skill CD reduction, C4 Lightfall DMG Bonus (+25% vs <50% HP), and C6 extra Lightfall stacks.
- **Aloy (August 4, 2026)**: Added Aloy, a 5-star Cryo Bow crossover character featuring Coil stacks (1–3) NA DMG bonus, 4-stack Rushing Ice state converting Normal Attacks to Cryo DMG and applying up to +47.65% NA DMG Bonus, A1 ATK buff (+16%), and A4 Cryo DMG bonus (+3.5% per stack, up to +35%).
- **Cyno (August 4, 2026)**: Added Cyno, a 5-star Electro Polearm main-DPS featuring Pactsworn Pathclearer Burst state (+100 EM), A4 EM-scaling flat DMG additions (+150% EM to NAs, +250% EM to Duststalker Bolts), A1 Judication Mortuary Rite DMG +35%, Revelation Buff Stellar-Conduct direct reaction, and C2 Electro DMG Bonus (up to +50%).
- **Diluc (August 4, 2026)**: Added Diluc, a 5-star Pyro Claymore character featuring Pyro infusion on Burst (*Dawn*), A1 stamina cost reduction, A4 Pyro DMG bonus during infusion (+20%), C1 DMG bonus against >50% HP targets (+15%), C2 ATK/Speed stacking bonuses, C4 Searing Fate rhythm DMG bonus (+40%), and C6 NA DMG/speed bonus.
- **Dehya (August 4, 2026)**: Added Dehya, a 5-star Pyro Claymore character featuring dual ATK+HP scaling for Skill (*Molten Inferno*) and Burst (*Leonine Bite*), C1 HP flat DMG additions (+3.6% Max HP for Skill, +6.0% Max HP for Burst), C2 Fiery Sanctum DMG bonus (+50%), and C6 Burst CRIT Rate (+10%) / CRIT DMG (+60%).
- **Kamisato Ayato (August 4, 2026)**: Added Kamisato Ayato, a 5-star Hydro Sword character featuring Shunsuiken strikes with Namisen HP flat DMG stacking (`namisenFlatDmg = stacks * (namisenPct / 100) * Max HP`), C1 DMG bonus against <=50% HP targets (+40%), C2 Max HP bonus (+50%), and Suiyuu Burst field NA DMG bonus.
- **Mavuika (August 1, 2026)**: Added Mavuika, a 5-star Pyro Claymore Archon character from Natlan featuring Fighting Spirit stack buffs, Flamestrider drive combo modes, A1/A4 passive bonuses, and C1/C2/C4/C6 constellation scaling.

### Features & Major Additions
- **Dynamic Database Connection Probe & Diagnostics Modal (August 4, 2026)**: Added server action `getDbStatus()` with connection racing and latency timing. Created interactive `<DbStatusBadge>` pill displaying real-time DB health (online latency, active build counts, offline/checking statuses) and an accessible `<DbStatusModal>` dialog featuring connection specs, redacted credentials, raw error logs, XAMPP troubleshooting instructions, and live re-check triggers without page reloads.
- **Kamisato Ayaka (July 21, 2026)**: Added Kamisato Ayaka, a 5-star Cryo Sword main-DPS featuring Cryo infusion via alternate sprint (*Kamisato Art: Senho*), A1 Normal/Charged attack DMG bonus (+30%), A4 Cryo DMG bonus (+18%), C2 Frostflake Seki no To mini-whirlwinds (20% DMG), C4 DEF reduction (-30%), and C6 Charged Attack DMG bonus (+298%).
- **Alhaitham (July 21, 2026)**: Added Alhaitham, a 5-star Dendro Sword main-DPS who utilizes Chisel-Light Mirrors to infuse his attacks with Dendro and deal dual ATK + EM scaling Projection Attacks (`1-mirror`, `2-mirror`, `3-mirror`), featuring A4 EM-to-DMG bonus scaling (0.1% per EM up to 100%), C2 EM boost, C4 Dendro DMG bonus/EM share, and C6 CRIT Rate/DMG bonus.
- **Durin (July 19, 2026)**: Added Durin, a 5-star Pyro Sword off-field Burst sub-DPS who switches between Purity (White) and Darkness (Dark) forms, featuring element shred/reaction buffs, ATK-based summon scaling, C1 flat DMG, and C6 DEF ignore.
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
- **Direct Lunar Reaction Engine & Explainer Alignment (July 28, 2026)**: Aligned direct Lunar reactions (Lunar-Charged, Lunar-Bloom, Lunar-Crystallize) with Genshin Optimizer formulas. Direct reaction derivations in `formula-explainer.ts` omit irrelevant standard DMG Bonus% / Enemy DEF terms, formatting explicit transformative base multipliers (`100% + 6 * EM / (EM + 2000)`) and HP-scaled Lunar Base DMG bonuses (`Min(0.2% * (HP / 1000), 7%)`). Added reaction-specific Lunar stat inputs (`lunarChargedBaseBonusPct`, etc.).
- **Columbina Elemental & Reaction Mechanics Fix (July 27, 2026)**: Updated Columbina hit element definitions in the registry (`moondew-cleanse` to Dendro, `gi-charged` to Electro, `gi-bloom` to Dendro, `gi-crystallize` to Geo). Enhanced engine (`computeHit`), explainer, and `DamageTable.tsx` to respect per-hit element overrides (`mods.element ?? h.element ?? config.element`).
- **Reaction Selection & Validation Hardening (July 28, 2026)**: Fixed disappearing damage outputs on reaction selection by gracefully defaulting un-typed or empty `reactionBonus` fields (`""`) to `0%` baseline without failing form validation, and automatically initializing `reactionBonus` to `"0"` on dropdown selection.
- **Base Stats Input UI Expansion & Spin Arrow Removal (July 27, 2026)**: Expanded stat input field widths in `StatsGrid.tsx` to `w-20 sm:w-24` with tabular monospace alignment, comfortably supporting 6–8 digit values. Added global CSS rules in `globals.css` to hide Webkit/Firefox number spin arrows.
- **Single-Stat OCR Recognition Support (July 27, 2026)**: Updated Gemini OCR prompt and state hook logic so single total stat values recognized from screenshots (without base/bonus breakdown splits) automatically populate flat stat fields while setting base stats to `"0"`.
- **Formula Breakdown Page & Explainer Engine (`/characters/[id]/formula`) (July 26, 2026)**: Introduced a dedicated calculation breakdown route (`/characters/[id]/formula`) powered by `formula-explainer.ts` and `FormulaBreakdownView.tsx`. Displays step-by-step mathematical derivations for all damage instances, including base scaling, flat bonuses, DMG%, CRIT, enemy DEF/RES, and reaction multipliers.
- **Source-Referenced Sub-Equations & Team Buffs (July 26, 2026)**: Upgraded calculation breakdown equations with explicit source attributions (e.g. `Team ATK 115.0% = ATK (Arlecchino) 25% + ATK (Bennett) 20% + ...`) and character-specific mechanic expansions (such as Arlecchino's Masque of the Red Death flat DMG breakdown). Added a dedicated **Received Team Buffs** card.
- **Draft Auto-Persistence & Navigation Fixes (July 26, 2026)**: Integrated automatic `localStorage` draft synchronization (`gi_calc_draft_${characterId}`) and `?share=` URL encoding to eliminate unsaved state reversions when navigating back and forth via browser buttons. Added a damage mode selector (Non-Crit, CRIT, Average, Reactions) to the breakdown page.
- **Constellations Module & Arlecchino Mechanics Scoping (July 25, 2026)**: Extracted constellation logic into `constellations.ts`. Scoped Arlecchino's C6 CRIT Rate (+10%) and CRIT DMG (+70%) bonuses specifically to Normal Attacks (`1-hit`–`6-hit`) and Burst (`skill-dmg`), and restricted Masque of the Red Death flat DMG to Normal Attacks.
- **Remastered Effective Stats Panel & Additive Breakdown (July 22, 2026)**: Remastered the "EFFECTIVE STATS" panel into a single-column stacked layout displaying the full additive breakdown (`<raw> + <add1> + <add2> = <total>`) for every single attribute and reaction multiplier. Integrated interactive chat-cloud tooltips (`[?]`) via a new [StatBreakdownRow.tsx] component to reveal detailed buff source descriptions on hover/click.
- **Comprehensive Effective Stats (July 19, 2026)**: Re-designed the "Effective Stats" panel on the setup card to show all output stats (such as target levels, defenses, resistances, Energy Recharge, Healing Bonus, and specific active element/physical DMG bonuses), removing actual reaction output DMG values to keep the panel focused purely on stats.
- **Scrollbar Hiding in Sidebar (July 19, 2026)**: Added styling to hide the vertical and horizontal scrollbars in the navigation panel and list container, improving UI cleanliness while retaining full scroll functionality.
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

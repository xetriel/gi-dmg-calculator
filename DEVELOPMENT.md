# Project Development Documentation

This document logs the feature updates, architecture changes, and character releases across all versions of the Genshin Damage Calculator, matching the version displayed in the application header.

---

## [v1.2.1] - Current UI Header Version

All developments listed below were implemented during the `v1.2.1` release cycle (September 5, 2026).

### Major Features & Additions

- **Independent Mini Wiki & Knowledge Base Architecture (September 5, 2026)**:
  - **Zero-Drift Single Source of Truth**: Built an independent mini wiki system embedded within the application that imports directly from the canonical registries (`WEAPONS`: 246, `ARTIFACTS`: 64, `CHARACTERS`: 48), calculation engine formulas, and talent seeds with 100% mathematical consistency.
  - **Top Header Dual-Mode Navigation (`HeaderNavTabs.tsx` in `src/app/layout.tsx`)**:
    - `[ ⚡ Calculator ]`: Routes to the interactive damage calculation interface (`/`, `/characters/*`).
    - `[ 📖 Wiki ]`: Routes to the knowledge base (`/wiki`, `/wiki/*`).
    - Active tab is highlighted with high-contrast pill styling and clear visual feedback.
  - **Context-Aware Dynamic Left Sidebar (`AppSidebar.tsx` & `WikiSidebar.tsx`)**:
    - Replaced the static calculator sidebar with a route-aware sidebar that automatically swaps into the **Wiki Sidebar** when navigating `/wiki/*`.
    - 7 category quick links: ⚔️ Weapons (246), 🛡️ Artifacts (64), 👤 Characters (48), 🧪 Reactions, ⚙️ Mechanics, 🤝 Supports, and 📈 Scaling.
    - Contextual search & filter toolbars (e.g. Weapon Type/Rarity filters on `/wiki/weapons`; Drop Tier Range and Wielder/Support filters on `/wiki/artifacts`).
    - Scrollable sub-item fast navigation for quick jumping to specific cards.
    - Responsive collapse/expand toggle button matching the calculator sidebar width.
  - **Completed Wiki Modules & Routes**:
    - `/wiki` (`src/app/wiki/page.tsx`): Overview dashboard, quick stats (246 weapons, 64 artifacts, 48 characters), category navigation cards.
    - `/wiki/weapons` (`src/components/wiki/WeaponsWikiView.tsx`): All 246 canonical weapons, Lv1 vs Lv90 base stats, substats, interactive R1–R5 dynamic refinement sliders, signature synergy badges, and *"Equip in Calculator"* links.
    - `/wiki/artifacts` (`src/components/wiki/ArtifactsWikiView.tsx`): 64 artifact sets, dual-gradient rarity range badges, verbatim 1-Pc/2-Pc/4-Pc descriptions, wielder vs support filters, and interactive mechanic sandboxes.
    - `/wiki/characters` (`src/components/wiki/CharactersWikiView.tsx`): 48 character dossiers, ascension stat curves, Normal/Skill/Burst breakdowns, C1–C6 constellation expanders, support profiles, and *"Open Calculator"* bridges.
    - `/wiki/reactions` (`src/components/wiki/ReactionsWikiView.tsx`): Mathematical formulas for Amplifying, Catalyze, Transformative, Lunar, and Stellar reactions with live interactive EM sandbox slider (0–1500 EM).
    - `/wiki/mechanics` (`src/components/wiki/MechanicsWikiView.tsx`): Universal damage formula breakdown, interactive Enemy DEF multiplier simulator, piecewise Enemy RES simulator, Bond of Life, and Nightsoul rules.
    - `/wiki/supports` (`src/components/wiki/SupportsWikiView.tsx`): Universal 46-character support buff matrix filterable by Flat ATK, RES shred, DMG%, CRIT, and Moonsign Lunar Base amplifiers.
    - `/wiki/scaling` (`src/components/wiki/ScalingWikiView.tsx`): Interactive talent multiplier inspector across levels 1 to 15 for all character abilities.

- **Canonical Artifact Drop Rarity Range Engine (September 5, 2026)**:
  - **Authentic Acquisition Drop Tiers**: Resolved the single-integer rarity limitation by mapping max-rarity labels into authentic Genshin drop tiers:
    - **5-Star Sets** (e.g. *Blizzard Strayer*, *Crimson Witch*, *Deepwood Memories*): Drop as **4★ and 5★** pieces $\rightarrow$ `[4, 5]` (`4★–5★`).
    - **4-Star Sets** (e.g. *Berserker*, *Instructor*, *The Exile*): Drop as **3★ and 4★** pieces $\rightarrow$ `[3, 4]` (`3★–4★`).
    - **3-Star Sets** (e.g. *Adventurer*, *Lucky Dog*, *Traveling Doctor*): Drop as **1★ to 3★** pieces $\rightarrow$ `[1, 3]` (`1★–3★`).
    - **1-Star Sets** (e.g. *Initiate*): `[1, 1]` (`1★`).
  - **Deterministic Resolver & Matching Engine**: Created `getArtifactRarityRange()` in `src/data/registry/artifacts/types.ts`, range matching helper `matchesArtifactRarity()`, and luxury dual-gradient `RarityRangeBadge.tsx`.
  - **Dual Filter Modes**: Integrated into the Artifacts Encyclopedia: **Drop Tiers (Inclusive)** (surfaces both native 4★ sets like *Instructor* and 5★ sets with 4★ pieces like *Blizzard Strayer*) vs **Max Rarity (Strict)** (strictly matches set maximum rarity).

- **Standardized Rarity Color Palette & Multi-Tier Sidebar Badges (September 5, 2026)**:
  - **Authentic Color Mapping**: Standardized canonical rarity colors across `RarityRangeBadge.tsx`, `WikiSidebar.tsx`, and `Sidebar.tsx`:
    - **5★**: Gold/Amber (`text-amber-500` / gold badge `bg-amber-500/15 border-amber-500/30`)
    - **4★**: Purple (`text-purple-400` / purple badge `bg-purple-500/15 border-purple-500/30`)
    - **3★**: Blue (`text-blue-400` / blue badge `bg-blue-500/15 border-blue-500/30`) — *fixes 3★ previously rendering in purple fallback*
    - **2★**: Emerald (`text-emerald-400` / emerald badge `bg-emerald-500/15 border-emerald-500/30`)
    - **1★**: Zinc (`text-zinc-400` / zinc badge `bg-zinc-500/15 border-zinc-500/30`)
  - **Artifact Multi-Rarity Sidebar Pills (`ArtifactRarityPills`)**: Renders 1, 2, or 3 rarity pills side-by-side in the same item row to reflect all available drop tiers:
    - **5★ Sets** (*Blizzard Strayer*, *Crimson Witch*, etc.): `[ 4★ ]` (purple) + `[ 5★ ]` (amber)
    - **4★ Sets** (*Berserker*, *Instructor*, *The Exile*): `[ 3★ ]` (blue) + `[ 4★ ]` (purple)
    - **3★ Sets** (*Adventurer*, *Lucky Dog*, *Traveling Doctor*): `[ 1★ ]` (gray) + `[ 2★ ]` (green) + `[ 3★ ]` (blue)
    - **1★ Sets** (*Initiate*): `[ 1★ ]` (gray)
  - **Character Starring Rarity Badges**: Added starring rarity labels (`5★` in amber, `4★` in purple) to character items in both the **Wiki Sidebar** and the main **Calculator Sidebar** (`Sidebar.tsx`).

- **Independent Weapon Damage Procs ("n% of x as DMG") & 24-Weapon Modeling (September 5, 2026)**:
  - Modeled full R1–R5 refinement curves and `damageInstances` across all 24 weapon registry definitions:
    - **Catalysts**:
      - *Ash-Graven Drinking Horn*: 40% / 50% / 60% / 70% / 80% Max HP as AoE Physical DMG.
      - *Eye of Perception*: 240% / 270% / 300% / 330% / 360% ATK as Physical DMG (Bolt of Perception).
      - *Frostbearer*: 80% / 95% / 110% / 125% / 140% ATK (200% / 240% / 280% / 320% / 360% if enemy affected by Cryo).
      - *Skyward Atlas*: 160% / 200% / 240% / 280% / 320% ATK as Physical DMG (Favor of the Clouds).
    - **Swords**:
      - *Aquila Favonia*: 200% / 230% / 260% / 290% / 320% ATK as AoE Physical DMG (Soul of the Falcon).
      - *Sword of Narzissenkreuz*: 160% / 200% / 240% / 280% / 320% ATK as AoE Physical DMG.
      - *Sword of Descension*: 200% ATK as AoE Physical DMG (Descension Proc); Traveler Flat ATK +66 with `isPercent: false`.
      - *Fillet Blade*: 240% / 280% / 320% / 360% / 400% ATK as Physical DMG.
      - *The Flute*: 100% / 125% / 150% / 175% / 200% ATK as AoE Physical DMG (Harmonics).
      - *Kagotsurube Isshin*: 180% ATK as AoE Physical DMG (Hewing Gale).
    - **Polearms**:
      - *Skyward Spine*: 40% / 55% / 70% / 85% / 100% ATK as Physical DMG (Vacuum Blade).
      - *Crescent Pike*: 20% / 25% / 30% / 35% / 40% ATK as additional Physical DMG on Normal/Charged hits.
      - *Dragonspine Spear*: 80% / 95% / 110% / 125% / 140% ATK (200% / 240% / 280% / 320% / 360% if enemy affected by Cryo).
      - *Halberd*: 160% / 200% / 240% / 280% / 320% ATK as Physical DMG.
    - **Claymores**:
      - *Debate Club*: 60% / 75% / 90% / 105% / 120% ATK as AoE Physical DMG (Blunt Conclusion).
      - *Prototype Archaic*: 240% / 300% / 360% / 420% / 480% ATK as AoE Physical DMG (Crush).
      - *Snow-Tombed Starsilver*: 80% / 95% / 110% / 125% / 140% ATK (200% / 240% / 280% / 320% / 360% if enemy affected by Cryo).
      - *Skyward Pride*: 80% / 100% / 120% / 140% / 160% ATK as Physical DMG (Vacuum Blade).
      - *Luxurious Sea-Lord*: 100% / 125% / 150% / 175% / 200% ATK as AoE Physical DMG (Titanic Tuna).
    - **Bows**:
      - *End of the Line*: 80% / 100% / 120% / 140% / 160% ATK as AoE Physical DMG (Flowswitch).
      - *Messenger*: 100% / 125% / 150% / 175% / 200% ATK as Physical DMG (`guaranteedCrit: true`).
      - *Sequence of Solitude*: 40% / 50% / 60% / 70% / 80% Max HP as AoE Physical DMG.
      - *Skyward Harp*: 125% ATK as Physical DMG.
      - *The Viridescent Hunt*: 40% / 50% / 60% / 70% / 80% ATK per tick as AoE Physical DMG (Cyclone).

- **Interactive Output DMG Calculator in Weapons Wiki (September 5, 2026)**:
  - In `WeaponsWikiView.tsx`, weapon cards with passive damage instances include an interactive **Weapon Output DMG Calculator**:
    - Dynamic R1–R5 refinement selector updating scaling ratios in real-time.
    - Custom base attribute numeric inputs (ATK, HP, DEF).
    - Interactive condition toggles (e.g., "Enemy affected by Cryo") switching between baseline and conditional damage formulas.
    - Real-time proc damage calculation and output display.

- **Character Calculator Integration: Weapon Passive DMG Table (September 5, 2026)**:
  - Created `src/components/WeaponDamageTable.tsx` and integrated it into `CharacterCalculator.tsx`.
  - Computes Non-Crit, CRIT, and Average DMG using the active character's resolved stats (ATK/HP, Physical DMG Bonus, Enemy DEF & RES).
  - Cleanly displays underneath the talent damage table whenever an equipped weapon has passive damage instances.

- **Restoration of Missing Weapon Buffs (September 5, 2026)**:
  - **Golden Majesty Series**: Added `shieldStrength` [20%, 25%, 30%, 35%, 40%] with `isPercent: true` to *Summit Shaper*, *Vortex Vanquisher*, *Memory of Dust*, and *The Unforged*.
  - **Angelos' Heptades**: Added `angelos-party-dmg` buff: 10~22% per 1,000 ATK (modeled as [26%, 34%, 42%, 50%, 58%] All DMG Bonus) for the entire party when shield is active.
  - **Fractured Halo**: Added `halo-lunar-charged` buff: [40%, 50%, 60%, 70%, 80%] Lunar-Charged DMG Bonus for the entire party when shield is active.

- **Complete 246-Weapon Database Audit & Canonical Wiki Synchronization (September 5, 2026)**:
  - **100% Canonical Wiki Synchronization**: Audited all weapons in `src/data/registry/weapons/` against the official Genshin Impact Wiki database, establishing an exact 1-to-1 match across all five categories: **56 Swords**, **45 Claymores**, **43 Polearms**, **53 Catalysts**, and **49 Bows** (246 weapons total).
  - **Relocation of 18 Misplaced Weapons**: Reassigned 18 weapons previously placed in incorrect category directories to their authentic weapon classes, re-aligning their Level 90 Base ATK and Substat progressions to their canonical class curves:
    - *Catalysts*: Moved `angelos-heptades.ts` (Base ATK 741, ATK 16.5%), `clash-of-kings.ts` (Base ATK 510, CRIT Rate 27.6%), `echoes-of-the-heart.ts` (Base ATK 565, ATK 27.6%), `blackmarrow-lantern.ts` (Base ATK 454, EM 221), `dawning-frost.ts` (Base ATK 510, CRIT DMG 55.1%), and `etherlight-spindlelute.ts` (Base ATK 510, ER 45.9%).
    - *Claymores*: Moved `master-key.ts` (Base ATK 454, ER 61.3%), `flame-forged-insight.ts` (Base ATK 510, EM 165), `forged-by-the-golden-melody.ts` (Base ATK 510, CRIT Rate 27.6%), and `a-teaspoon-of-transcendence.ts` (Base ATK 674, CRIT DMG 44.1%).
    - *Polearms*: Moved `symphonist-of-scents.ts` (Base ATK 608, CRIT DMG 66.2%), `bloodsoaked-ruins.ts` (Base ATK 674, CRIT Rate 22.1%), `prospectors-shovel.ts` (Base ATK 510, ATK 41.3%), and `song-of-the-vigil.ts` (Base ATK 565, EM 110).
    - *Swords*: Moved `emberwell.ts` (Base ATK 510, EM 165), `heretics-molten-blade.ts` (Base ATK 510, CRIT Rate 27.6%), `serenitys-call.ts` (Base ATK 454, ER 61.3%), and `moonweavers-dawn.ts` (Base ATK 565, ATK 27.6%).
  - **Creation of Missing Canonical Weapons**:
    - `whitelake-frostfeather.ts`: 5★ Sword (Base ATK 674, CRIT Rate 22.1%) with *Snow Swan's Finale* passive granting stacking ATK and Stellar Glimmer bonuses.
    - `frostbreath.ts`: 4★ Polearm (Base ATK 510, ER 45.9%) with *A Cast Real Far* passive granting reaction-triggered ATK buff and team energy restoration (`isSupport: true`, `buffType: "both"`).
  - **Canonical Normalization & Discrepancy Resolution**:
    - Unified *Sword of Narzissenkreuz* under `sword-of-narzissenkreuz.ts` (retiring `sword-of-narzissenkreuz-pneuma.ts`).
    - Added official double quotation marks to `"\"Ultimate Overlord's Mega Magic Sword\""`.
    - Corrected Base ATK, Substats, and official passive names across 20+ weapons including *Athame Artis*, *Azurelight*, *Lightbearing Moonshard*, *A Thousand Blazing Suns*, *Blade of Atonement*, *Fang of the Mountain King*, *Disaster and Remorse*, *Fractured Halo*, *Sacrificer's Staff*, *Tamayuratei no Ohanashi*, *Nightweaver's Looking Glass*, *Nocturne's Curtain Call*, *Reliquary of Truth*, *Sunny Morning Sleep-In*, *Vivid Notions*, and *Snare Hook*.
  - **Specialized Refinement Mechanics**: Implemented interactive toggles and scaling curves for *A Thousand Blazing Suns* (Nightsoul's Blessing +75% bonus toggle), *Blade of Atonement* (reaction EM & Stellar Glimmer ATK triggers), *Fang of the Mountain King* (Canopy's Favor 10%–20% per stack, up to 120% Skill/Burst DMG), and *Athame Artis* (Burst hit trigger with Hexerei: Secret Rite amplification).
  - **Clean Barrel & Aggregator Exporting**: Rebuilt category barrel exports (`swords/index.ts`, `claymores/index.ts`, `polearms/index.ts`, `catalysts/index.ts`, `bows/index.ts`) and root registry (`WEAPONS`: 246 items).

### Bug Fixes & Adjustments

- **Formatting Bug Fixes: `%` Post-Value Notation**: Corrected suffix display in `WeaponsWikiView.tsx` where Elemental Mastery buffs (`stat === "em"`) and flat stat buffs (`isPercent: false` or stat containing `"flat"`) previously displayed an erroneous `%` sign (e.g. *Ballad of the Fjords* Rank 1 now displays `+120`, and *Sword of Descension* Traveler ATK displays `+66`).
- **Rarity Color Mapping for 3★ Items**: Corrected 3★ weapon and artifact styling across `RarityRangeBadge.tsx`, `WikiSidebar.tsx`, and `Sidebar.tsx` to authentic blue (`text-blue-400` / `border-blue-500/30`), resolving the discrepancy where 3★ items previously fell back to 4★ purple styling.
- **Weapon Classification & Progression Curves**: Re-aligned 18 misplaced weapons to their proper categories and canonical level 90 base ATK and secondary stat growth curves.

### Verification & Validation

- **Automated Unit Tests**: Executed full Vitest test suite (`npx vitest run`) with **49 / 49 test files passing** (422 unit tests total), including all tests in `src/data/registry/artifacts/artifact-rarity.test.ts` and 9 dedicated weapon passive damage tests in `src/lib/engine/weapon-buffs.test.ts`. Zero regressions across damage engine, character mechanics, and external buffs.
- **TypeScript Strict Compilation**: Executed `npx tsc --noEmit` exiting with code 0 (zero errors, strict type safety).
- **Browser Subagent End-to-End Verification**: Successfully validated on `http://127.0.0.1:3000`:
  1. Main header navigation tabs switching between `[ ⚡ Calculator ]` and `[ 📖 Wiki ]`.
  2. Context-aware left sidebar transforming into the Wiki Sidebar with category quick links.
  3. Main calculator sidebar displaying `5★` (amber) and `4★` (purple) character starring rarity badges.
  4. Wiki weapons sidebar displaying authentic rarity colors (5★ amber, 4★ purple, 3★ blue, 1★ gray).
  5. Wiki artifacts sidebar displaying multi-rarity drop tier pills (`[4★][5★]`, `[3★][4★]`, `[1★][2★][3★]`).
  6. Weapons wiki interactive output damage simulator updating live on refinement changes and stat adjustments.
  7. Character calculator rendering the Weapon Passive DMG table with Non-Crit, CRIT, and Average DMG whenever passive damage instances are present.

---

## [v1.2.0-Beta] (July 3, 2026 – September 4, 2026)

All developments listed below were implemented during the `v1.2.0-Beta` release cycle (from July 3, 2026 to September 4, 2026).

### New Character Calculators
- **Bennett (August 20, 2026)**: Added Bennett, a 4-star Pyro Sword character featuring unified DPS and Support integration:
  - **DPS Calculator**: Complete Level 1–15 talent scaling (`src/data/talents/bennett.ts`) for *Strike of Fortune* (Normal/Charged/Plunging Attacks), *Passion Overload* (Press, Hold 1, Hold 2, Explosion), and *Fantastic Voyage* (Burst DMG, Healing, ATK Ratio). Mechanics resolver in `src/lib/engine/characters/bennett.ts` handling A1 Rekindle (-20% Skill CD), A4 Fearnaught (-50% Skill CD in Burst field), C1 Grand Expectation (removes HP restriction & adds +20% Base ATK bonus), C2 Impasse Conqueror (+30% ER when HP < 70%), C4 Unexpected Odysseys (short charge follow-up attack), and C6 Crimson Fire (+15% Pyro DMG Bonus).
  - **Support Integration**: Embedded `support` definition with Base ATK scaling flat ATK buff (`(Base ATK * ratio) + (C1 ? Base ATK * 0.20 : 0)`) and C6 Pyro DMG buff, complete with `formatBriefStats` pill breakdown (Base ATK, Total ATK, ER).
  - Verified with 6 dedicated test cases in `src/lib/engine/characters/bennett.test.ts`.
- **Traveler (Cryo) [Finalized] (August 20, 2026)**: Finalized Cryo Traveler mechanics and constellation definitions in `src/data/registry/characters/traveler-cryo.ts` and `src/lib/engine/characters/traveler-cryo.ts`:
  - Official Constellations: C1 Somber Freeze, C2 Frostfall Reverberation, C3 Glacier Strike, C4 Enduring Ice, C5 Bittercold Fog, C6 Brumal Grimfrost.
  - **A1 Ever-Keen Frost**: Toggling `frostpierce-active` infuses Normal/Charged/Plunging attacks with Cryo and grants a flat +80% ATK DMG bonus.
  - **A4 Lucent Ice**: Converts 8% of total ATK into Elemental Mastery (capped at +160 EM).
  - **C2 Frostfall Reverberation**: Grants +60 EM baseline, boosted to +120 EM when Stellar Glimmer toggle is active.
  - **Frostglow Stacks (0–8)**: Grants +4.96% DMG per stack on standard `burst-javelin-dmg` hits.
  - **Stellar Jubilee (Illusory Frostmirror)**: Injects `directReaction` parameters for `stellar-conduct-javelin-dmg` and `stellar-swirl-javelin-dmg` (`baseDmgBonusPct: min(0.7 * ATK/100, 14)`), routing through the direct reaction engine branch (`6·EM/(EM+2000)`), bypassing standard DMG% and DEF terms.
  - **C6 Brumal Grimfrost**: Injects `reactionBonusPct: min(stacks * 5, 40)` Stellar reaction bonus.
  - Verified with 5 dedicated test cases in `src/lib/engine/characters/traveler.test.ts`.
- **Traveler Elemental Variants (August 10, 2026)**: Added complete calculator profiles for all 7 Traveler elemental forms (Anemo, Geo, Electro, Dendro, Hydro, Pyro, and Cryo):
  - **Traveler (Anemo)**: C2 ER bonus (+16%), C6 Anemo RES shred (-20%) with dynamic elemental absorption shred (-20% Hydro/Pyro/Cryo/Electro).
  - **Traveler (Geo)**: C1 Wake of Earth party CRIT Rate (+10%), C2 Rockcore Melt meteor explosion registration.
  - **Traveler (Electro)**: C2 Electro RES shred (-15%), C6 3rd Falling Thunder independent hit instance (200% DMG multiplier).
  - **Traveler (Dendro)**: A4 EM scaling (Skill DMG +0.15%/EM, Burst DMG +0.1%/EM), C6 Dendro/elemental DMG bonus (+12%).
  - **Traveler (Hydro)**: A4 Max HP Torrent Surge DMG scaling, C4 Aquacrest Sabre 10% Max HP shield durability output.
  - **Traveler (Pyro)**: C1 Nightsoul All DMG Bonus (+6%/+15%), C4 Volcanic Burst Pyro DMG Bonus (+20%), C6 Pyro infusion & +40% Pyro CRIT DMG.
  - **Traveler (Cryo)**: Full Stellar reaction integration, A1 Cryo infusion & flat ATK scaling, A4 ATK→EM conversion, and C6 Brumal Grimfrost reaction DMG bonus.
- **Yanfei (August 9, 2026)**: Added Yanfei, a 4-star Pyro Catalyst character featuring Scarlet Seals (0–4 stacks) A1 Pyro DMG Bonus (+5% per seal), Burst Brilliance Charged Attack DMG Bonus (+55.8%), C2 CA CRIT Rate (+20% vs <50% HP targets), and C4 45% Max HP Shield durability output.
- **Xinyan (August 9, 2026)**: Added Xinyan, a 4-star Pyro Claymore character featuring Physical DMG Bonus focus, A4 Shield Physical DMG Bonus (+15%), C2 Burst Physical 100% CRIT Rate, C4 Physical RES shred (-15%), and C6 DEF to ATK conversion (+50% DEF).
- **Tartaglia (August 9, 2026)**: Added Tartaglia, a 5-star Hydro Bow character featuring Ranged & Melee stance attacks, 4 Riptide variants (Flash, Burst, Slash, Blast), and Master of Weaponry (+1 NA Talent Level) party passive.
- **Xiao (August 9, 2026)**: Added Xiao, a 5-star Anemo Polearm character featuring Yaksha's Mask Anemo infusion & Plunging DMG bonus, A1 DMG stacks (+25%), A4 Skill DMG stacks (+45%), C2 off-field ER (+25%), and C4 DEF bonus (+100% Base DEF when HP < 50%).
- **Lyney (August 6, 2026)**: Added Lyney, a 5-star Pyro Bow character featuring Prop Surplus stacks flat DMG addition, A4 Conclusive Ovation (+60%/+80%/+100% Pyro DMG Bonus for 1–3 Pyro team members), and single skill-dmg hit stream.
- **Mualani (August 6, 2026)**: Added Mualani, a 5-star Hydro Catalyst from Natlan featuring HP-scaling Sharky's Bite & Surging Bite, A1 Pufferfish flat DMG (+45% Max HP), A4 Nightsoul Burst flat DMG (+30% Max HP), C1/C6 Surging Bite flat DMG (+66% Max HP), and C4 Burst DMG bonus (+75%).
- **Klee (August 6, 2026)**: Added Klee, a 5-star Pyro Catalyst character featuring Hexerei Secret Rite (+15% Pyro DMG & Boom Badges 0–3 stacks: 115%/130%/150% CA multiplier), A1 Pounding Surprise (+50% CA DMG Bonus), C1 Chained Reaction (+60% ATK buff & 120% Burst DMG spark hit instance), C2 Explosive Frags (-23% Enemy DEF reduction), C4 Sparkly Explosion (+100% on-field DMG & 555% ATK AoE Pyro DMG instance), and C6 Blazing Delight (+10% Pyro DMG Bonus).
- **Keqing (August 5, 2026)**: Added Keqing, a 5-star Electro Sword character featuring A1 Thundering Penance Electro Infusion override, A4 Aristocratic Dignity (+15% CRIT Rate, +15% ER), C1 Thundering Might independent 50% ATK Electro DMG instance, C4 Attunement (+25% ATK buff), and C6 Tenacious Star (+6% Electro DMG Bonus per stack, up to +24%).
- **Kaveh (August 5, 2026)**: Added Kaveh, a 4-star Dendro Claymore character featuring Painted Dome Dendro Infusion & Bloom DMG Bonus % (up to +49.48%), A4 EM stacks (+25 per stack, up to +100), C1 Dendro RES/Healing received, C4 Bloom DMG Bonus (+60%), and C6 Pairidaeza's Light independent 61.8% ATK AoE Dendro DMG instance.
- **Arataki Itto (August 5, 2026)**: Added Arataki Itto, a 5-star Geo Claymore character featuring Raging Oni King DEF to ATK conversion (57.6%–103.68%) & Geo Infusion override, A4 Crimson Oni 35% DEF flat DMG bonus to Arataki Kesagiri slashes, C4 party DEF/ATK buff (+20%/+20%), and C6 Arataki Kesagiri CRIT DMG (+70%).
- **Shikanoin Heizou (August 5, 2026)**: Added Shikanoin Heizou, a 4-star Anemo Catalyst character featuring Declension & Conviction stacks (0–4), C6 Heartstopper Strike CRIT Rate (+4% per stack, up to +16%) and CRIT DMG (+32%), and A4 EM share (+80 EM).
- **Ganyu (August 4, 2026)**: Added Ganyu, a 5-star Cryo Bow main-DPS featuring Frostflake Arrow 2-stage charge shot & Frostflake Bloom DMG, Trail of the Qilin skill, Celestial Shower burst (Cryo DMG Bonus +20% inside field via A4 Undivided Heart), A1 Frostflake CRIT Rate (+20%), C1 Cryo RES shred (-15%), C4 DMG Bonus taken (+5% per stack, up to +25%), C6 instant Frostflake charge after Skill, and custom Frostflake color styling.
- **Eula (August 4, 2026)**: Added Eula, a 5-star Physical Claymore main-DPS featuring Grimheart stacks (+30% DEF per stack, Physical & Cryo RES shred on Consuming Grimheart), Lightfall Sword stack scaling (flat multiplier scaling per stack up to 30 stacks), A1 Roaring Blaze Shattered Lightfall Sword, A4 Skill CD reset on Burst, C1 Physical DMG Bonus (+30%), C2 Skill CD reduction, C4 Lightfall DMG Bonus (+25% vs <50% HP), and C6 extra Lightfall stacks.
- **Aloy (August 4, 2026)**: Added Aloy, a 5-star Cryo Bow crossover character featuring Coil stacks (1–3) NA DMG bonus, 4-stack Rushing Ice state converting Normal Attacks to Cryo DMG and applying up to +47.65% NA DMG Bonus, A1 ATK buff (+16%), and A4 Cryo DMG bonus (+3.5% per stack, up to +35%).
- **Cyno (August 4, 2026)**: Added Cyno, a 5-star Electro Polearm main-DPS featuring Pactsworn Pathclearer Burst state (+100 EM), A4 EM-scaling flat DMG additions (+150% EM to NAs, +250% EM to Duststalker Bolts), A1 Judication Mortuary Rite DMG +35%, Revelation Buff Stellar-Conduct direct reaction, and C2 Electro DMG Bonus (up to +50%).
- **Diluc (August 4, 2026)**: Added Diluc, a 5-star Pyro Claymore character featuring Pyro infusion on Burst (*Dawn*), A1 stamina cost reduction, A4 Pyro DMG bonus during infusion (+20%), C1 DMG bonus against >50% HP targets (+15%), C2 ATK/Speed stacking bonuses, C4 Searing Fate rhythm DMG bonus (+40%), and C6 NA DMG/speed bonus.
- **Dehya (August 4, 2026)**: Added Dehya, a 5-star Pyro Claymore character featuring dual ATK+HP scaling for Skill (*Molten Inferno*) and Burst (*Leonine Bite*), C1 HP flat DMG additions (+3.6% Max HP for Skill, +6.0% Max HP for Burst), C2 Fiery Sanctum DMG bonus (+50%), and C6 Burst CRIT Rate (+10%) / CRIT DMG (+60%).
- **Kamisato Ayato (August 4, 2026)**: Added Kamisato Ayato, a 5-star Hydro Sword character featuring Shunsuiken strikes with Namisen HP flat DMG stacking (`namisenFlatDmg = stacks * (namisenPct / 100) * Max HP`), C1 DMG bonus against <=50% HP targets (+40%), C2 Max HP bonus (+50%), and Suiyuu Burst field NA DMG bonus.
- **Mavuika (August 1, 2026)**: Added Mavuika, a 5-star Pyro Claymore Archon character from Natlan featuring Fighting Spirit stack buffs, Flamestrider drive combo modes, A1/A4 passive bonuses, and C1/C2/C4/C6 constellation scaling.
- **Kamisato Ayaka (July 21, 2026)**: Added Kamisato Ayaka, a 5-star Cryo Sword main-DPS featuring Cryo infusion via alternate sprint (*Kamisato Art: Senho*), A1 Normal/Charged attack DMG bonus (+30%), A4 Cryo DMG bonus (+18%), C2 Frostflake Seki no To mini-whirlwinds (20% DMG), C4 DEF reduction (-30%), and C6 Charged Attack DMG bonus (+298%).
- **Alhaitham (July 21, 2026)**: Added Alhaitham, a 5-star Dendro Sword main-DPS who utilizes Chisel-Light Mirrors to infuse his attacks with Dendro and deal dual ATK + EM scaling Projection Attacks (`1-mirror`, `2-mirror`, `3-mirror`), featuring A4 EM-to-DMG bonus scaling (0.1% per EM up to 100%), C2 EM boost, C4 Dendro DMG bonus/EM share, and C6 CRIT Rate/DMG bonus.
- **Durin (July 19, 2026)**: Added Durin, a 5-star Pyro Sword off-field Burst sub-DPS who switches between Purity (White) and Darkness (Dark) forms, featuring element shred/reaction buffs, ATK-based summon scaling, C1 flat DMG, and C6 DEF ignore.
- **Gaming (July 18, 2026)**: Added Gaming, a 4-star Pyro Claymore character specializing in plunging attacks via his Elemental Skill *Bestial Ascent*, featuring A4 plunge DMG bonus and C6 crit scaling.
- **Varesa (July 17, 2026)**: Added Varesa, a 5-star Electro Catalyst character from Natlan specializing in Plunging Attacks and Nightsoul-related mechanics.
- **Skirk (July 17, 2026)**: Added Skirk, a playable 5-star Cryo Sword character utilizing a unique "Serpent's Subtlety" resource system instead of traditional Elemental Energy.
- **Linnea (July 15, 2026)**: Added Linnea character definition, stat scaling data, and custom mechanics.
- **Ineffa (July 14, 2026)**: Added Ineffa character definition, stat scaling data, custom direct reaction scaling, C1 reaction bonus, dynamic shield calculations, and embedded support definition (A4 EM share, C1 Lunar-Charged DMG bonus, Moonsign Benediction bonus).
- **Varka (July 14, 2026)**: Implemented Varka talent multipliers, passive skills, and special A1/A4 resonance check logic.
- **Columbina (July 14, 2026)**: Implemented Columbina talent multipliers and status effects utilizing Lunar reaction mechanics.
- **Flins (July 14, 2026)**: Added Flins character logic and calculations.
- **Nefer (July 14, 2026)**: Added Nefer character calculator and scaling variables.
- **Zibai (July 6, 2026)**: Implemented Zibai character (with specialized Lunar-Crystallize mechanics).

### Features & Major Additions
- **UI/UX Header Redesign: Option B Compact Command Toolbar (September 4, 2026)**:
  - **Modular Architecture (`CalculatorHeader.tsx`)**: Extracted and modularized header logic into `CalculatorHeader.tsx`, replacing ~260 lines of inline header code in `CharacterCalculator.tsx`.
  - **Compact Footprint**: Consolidated 7 sprawling toolbar buttons (~720px width) into a compact, responsive ~330px command toolbar with zero clipping or horizontal overflow.
  - **Streamlined Layout & View Controls**:
    - Replaced wide `[ 📖 Split View ]` toggle with high-contrast icon toggle `[ ◫ Split ]` / `[ 🥞 Column ]`.
    - Consolidated Rotation Builder, Weapon Buffs, Artifact Buffs, and Support Editor into a grouped `[ 🛠️ Tools (n) ▼ ]` dropdown with dynamic active-count badges.
    - Implemented max-width text truncation on `[ 📂 Scratchpad ▼ ]` build selector to prevent layout stretching on long build titles.
    - Integrated compact `[ 💾 Save Setup ]` / `[ 💾 Save Changes ]` button with a pulsing dirty indicator dot.
    - Structured `[ ⋯ Actions ▼ ]` dropdown into three clean functional categories: **Build Setup** (Share Build Link, Import JSON Setup, Save As New Setup), **Data & Reports** (Export JSON, Export CSV, Export TXT, Copy as text), and **Visual Snapshot** (Save as PDF, Download PNG).
- **Effective Stats Panel Debugging, Unified Engine Resolution, and Dedicated Focus View (September 4, 2026)**:
  - **Unified Pure Engine Resolver (`resolveAllEffectiveStats`)**: Implemented pure calculation function in `src/lib/engine/effective-stats.ts` systematically deriving stat breakdowns across 6 core categories: Core Attributes, Category DMG Bonuses, Elemental DMG Bonuses, Reaction Elevation & Bonuses, Reaction Multipliers, and Enemy Debuffs. Pre-computed on `ComputedInstance` as `statBreakdowns` to eliminate render cycle overhead.
  - **Strict External Buff Highlighting Rule**: Enforced strict color discipline where bold amber text (`text-amber-600 dark:text-amber-400 font-bold`) and indicator dots are reserved exclusively for external buff additions (Team Supports, External Weapons, External Artifacts), while self-mechanics and constellations render in sky-blue.
  - **Remastered Additive Rows (`StatBreakdownRow.tsx`)**: Formatted all stats into explicit mathematical equations ($\text{Raw} + \text{Additions} = \text{Total}$), paired with categorized tooltip popovers separating Outside External Support Buffs (with source rarity badges) from Character Mechanics / Constellations.
  - **Interactive Popup Modal (`EffectiveStatsModal.tsx`)**: Embedded in-place modal accessible via `[🔍 Focus View ↗]` on setup cards, featuring multi-setup switcher tabs, live stat/source search bar, category filter chips (All Stats, ⭐ External Buffed Only, Core Attributes, Category DMG, Elemental DMG, Reaction & Elevation, Enemy Debuffs, Multipliers), equation summary bar, and direct `[↗ Open Full Page]` navigation.
  - **Dedicated Standalone Breakdown Route (`/characters/[id]/effective-stats`)**: Server-rendered full-screen page powered by `EffectiveStatsView.tsx`, supporting direct URL linking, `?share=` state decoding, and setup switching.
  - **DMG Output `?` Button Relocation**: Moved `HitFormulaTooltip` (`?`) from the 1st column to the far right (5th column Average DMG in `DamageTable.tsx` and alongside Transformative DMG in `TransformativePanel.tsx`) with inward-expanding `right-0` popover orientation.
  - **Direct Stat Anchor Navigation & Glowing Auto-Scroll**: Clicking `?` on any `StatBreakdownRow` navigates directly to `/characters/[id]/effective-stats#stat-${statKey}`, automatically selects the "All Stats" tab, smoothly centers the target card, and pulses with an amber glowing highlight ring.
- **Universal Roster Support Capabilities & 46-Character Team Integration (September 4, 2026)**:
  - **Universal Support Roster**: Integrated all 46 characters in the roster into the Team Support Buff system (`src/data/registry/characters/`), allowing any character to act as a party support member for any DPS setup.
  - **Self-Support Exclusion Guard**: Enforced authentic party constraints in `TeamBuffModal.tsx` (`if (s.characterId === config.id) return false;`), preventing active characters from selecting themselves as a support.
  - **Moonsign & Stellar Amplifiers Group**: Integrated authentic Moonsign Lunar Base DMG formulas (`lunarBaseBonusCompute`), elevations, and stat shares across *Columbina* (+0.2%/1k HP, cap 7%), *Zibai* (+0.7%/100 DEF, cap 14%), *Linnea* (+0.7%/100 DEF, cap 14%, A4 EM share, C2 CRIT DMG), *Flins* (+0.7%/100 ATK, cap 14%, C2 RES shred), *Nefer* (+0.0175%/EM, cap 14%), *Sandrone* (Stellar-Conduct base DMG +0.7%/100 ATK), and *Traveler (Cryo)*.
  - **Offensive Buffers & Debuffers**: Full supportive kit and constellation implementations for *Mavuika* (Kiongozi Burst DMG up to +50%, C2 DEF shred), *Mizuki* (EM-scaling elemental DMG), *Klee* (C2 DEF shred, C6 Pyro DMG), *Ganyu* (Celestial Shower Cryo DMG, C1 RES shred, C4 All DMG), *Ayato* (Burst NA DMG), *Hu Tao* (A1 & C4 CRIT Rate), *Heizou* (A4 EM share), *Tartaglia* (+1 NA Talent Level), *Skirk* (+1 Skill Level), *Itto* (C4 ATK/DEF), *Kaveh* (Bloom DMG bonuses), *Lyney* (C4 Pyro RES shred), *Varka* (C4 Anemo & Swirled DMG), *Xinyan* (A4 Physical DMG, C4 Physical RES shred), *Aloy* (A1 ATK buff), *Ayaka* (C4 DEF shred), *Eula* (Skill RES shred), *Durin* (RES shred, C6 DEF shred), and all *Traveler* elemental forms.
  - **Defensive Supports & Pure On-Field Hypercarries**: Added *Yanfei* (C4 shield) and *Dehya* (mitigation), while configuring pure on-field hypercarries (*Arlecchino*, *Diluc*, *Xiao*, *Cyno*, *Clorinde*, *Neuvillette*, *Gaming*, *Keqing*, *Mualani*, *Alhaitham*, *Varesa*) with `buffs: []`, providing authentic party presence, elemental resonance, and team CRIT passthrough (`teamCrit`) for Lunar reactions without unfaithful numeric inflation.
  - **Next.js RSC Boundary Safety**: Cleanly stripped function-bearing `support` blocks from `CHARACTERS` prior to server-client serialization in `src/data/registry/characters/index.ts`, exporting `SUPPORT_CONFIGS` separately for client and calculation engine use.
- **Complete Audit & Remediation of 64 Artifact Sets (September 4, 2026)**:
  - **Authenticity Audit**: Rechecked all 64 artifact sets against the official Genshin Impact Wiki, confirming 100% authenticity and maintaining flat modular directory structure (`src/data/registry/artifacts/<slug>.ts`).
  - **Verbatim Descriptions**: Standardized naming and updated all 49 abbreviated 2-piece and 4-piece descriptions to match official in-game texts verbatim.
  - **Base DEF and Base HP Context Scaling**: Extended `ArtifactBuffContext` with `baseDef` and `baseHp`, fixing a calculation bug where percent DEF/HP buffs previously scaled against `baseAtk` in `resolveExternalArtifactBuffs`.
  - **Fixed & Missing Buff Implementations**:
    - *Song of Days Past*: Implemented `days-past-healing` slider mechanic (0–15,000 HP) and 4-piece `flatDmgBonus` buff (`isTeamBuff: true`).
    - *Echoes of an Offering*: Implemented `valley-rite-active` toggle mechanic and 4-piece Valley Rite flat DMG bonus.
    - *Tiny Miracle*: Implemented 2-piece All Elemental RES (+20%) and 4-piece Elemental RES (+30%) mechanics.
    - *Maiden Beloved*: Implemented 4-piece party healing bonus (+20%) toggle.
    - *Husk of Opulent Dreams*: Scaled 2-piece DEF% to `baseDef` and added 4-piece Curiosity DEF stacking buffs.
    - *Defender's Will*, *Tenacity of the Millelith*, *Vourukasha's Glow*: Scaled 2-piece DEF%/HP% to `baseDef` and `baseHp`.
    - Corrected 2-piece values for *Long Night's Oath* (25%), *Finale of the Deep Galleries* (Cryo +15%), *Night of the Sky's Unveiling* (EM +80), *Aubade of Morningstar and Moon* (EM +80), and *Disenchantment in Deep Shadow* (ATK +18%). Added `onePieceDesc` to Tiara circlets.
  - **Database Synchronization**: Synchronized Prisma schema and database rows with `npm run db:seed` (`Artifact total rows: 64`).
- **Upper Limit of 4 External Weapons & Engine Enforcement (September 4, 2026)**:
  - **Team Limit Enforcement**: Enforced strict maximum of 4 external weapons per setup, perfectly matching the 4-party member roster limit and External Artifact Buff constraints.
  - **Engine Slice Protection**: Enforced `weapons.slice(0, 4)` in `src/lib/engine/weapon-buffs.ts`, safely ignoring any weapon instances beyond the 4th slot.
  - **UI & Modal Guards**: Defined `MAX_EXTERNAL_WEAPONS = 4` in `ExternalWeaponBuffModal.tsx`, disabled catalog Add buttons with `"Max 4"` badge/tooltip when filled, updated header badge to `{activeCount}/{total} Active (Max 4)`, and aligned `ExternalWeaponBuffPanel.tsx` and types.
- **Unified Default White/Silver Styling & Expand/Shrink Summary Drawer for External Buffs (September 4, 2026)**:
  - **Unified Neutral Theme**: Standardized checkboxes (`accent-zinc-900 dark:accent-zinc-100`), edit buttons, header icons, limit badges, setup switcher counters, and "All" filters to neutral white/silver across Team Support Buffs, External Weapon Buffs, and External Artifact Buffs.
  - **Authentic Rarity & Element Accents**: Preserved authentic colors exclusively where meaningful: rarity filter buttons styled in 5★ gold (`amber-500`), 4★ purple (`purple-600`), and 3★ blue (`sky-600`); element filter buttons in `TeamBuffModal.tsx` styled in raw elemental DMG colors (Pyro, Hydro, Electro, Cryo, Anemo, Geo, Dendro).
  - **Interactive Expand/Shrink Summary Drawer**: Replaced unbounded wrapping summary bars at the bottom of the configured pane with an animated expandable drawer featuring a chevron toggle (`^` / `v`), ~44px single-line collapsed height, active buff count badge, and scrollable container when expanded.
- **Support Character Fix & Mechanics Calibration: Columbina C2 (September 4, 2026)**:
  - **C2 Constellation & Support Realignment**: Updated Columbina C2 to official specifications: Gravity accumulation rate increased by 34%, *Lunar Brilliance* granting +40% Max HP for 8s, and *Ascendant Gleam* sharing stats based on the dominant Lunar reaction: Lunar-Charged (+1% Max HP as ATK), Lunar-Bloom (+0.35% Max HP as EM), and Lunar-Crystallize (+1% Max HP as DEF), plus party-wide +7% Lunar reaction elevation.
  - **Interactive C2 Controls**: Added dedicated toggles in `columbina.ts` (`c2-lunar-brilliance`, `c2-gleam-charged`, `c2-gleam-bloom`, `c2-gleam-crystallize`).
  - **Test Suite Expansion**: Added comprehensive test coverage in `src/lib/engine/characters/columbina.test.ts` and `src/lib/engine/team-buffs.test.ts`.
- **Advanced Rarity-Focused Theming for External Buff Systems & Polished Split View Layout (September 4, 2026)**:
  - **Unified Design Tokens (`rarity-theme.ts`)**: Created a centralized token architecture for 1★ (silver/zinc), 2★ (green/emerald), 3★ (blue/sky), 4★ (purple), and 5★ (gold/amber), standardizing badges, catalog hover outlines, "+ Add" action buttons, active card backgrounds, checkbox accents, option selectors, and preview pills.
  - **Three External Buff Modals Updated (`TeamBuffModal.tsx`, `ExternalWeaponBuffModal.tsx`, `ExternalArtifactBuffModal.tsx`)**: Themed catalog items and configured cards by item rarity instead of uniform amber/purple tones.
  - **Buff Source Rarity Attribution (`team-buffs.ts`, `weapon-buffs.ts`, `artifact-buffs.ts`)**: Extended `TeamBuffSource`, `ExternalWeaponBuffSource`, and `ExternalArtifactBuffSource` with `rarity: config.rarity` to propagate the exact source item rarity to the UI layer.
  - **Source-Themed Buff Notes**: Aggregated buff pills in both modals and setup cards dynamically reflect source rarity (e.g. Bennett's *Fantastic Voyage* and *C6 Pyro DMG* render in purple 4★ styling, TTDS *Party ATK%* renders in blue 3★ styling, and *Noblesse Oblige* renders in gold 5★ styling).
  - **Header & Quantity Limit Neutralization**: Updated header titles and quick-action icons to default white, and styled quantity counters (`n/total`) in clean white with limit notations (`(Max N)`) in a muted grey across `TeamBuffPanel.tsx`, `ExternalWeaponBuffPanel.tsx`, and `ExternalArtifactBuffPanel.tsx`.
  - **Polished Split-Screen View Layout**: Positioned the draggable horizontal splitter bar in `CharacterCalculator.tsx` immediately before `DamageTable` (Normal Attack, Skill, Burst), housing all inputs, external buffs, and effective stats in the top independently-scrolling container, and damage outputs in the bottom container, with resize bounds clamped between 15% and 85%.
- **Support Character Talent Auto-+3 Constellation Scaling & Build Save Validation (September 3, 2026)**:
  - **Dynamic +3 Talent Level Scaling**: Implemented automatic talent level boost (+3) on talent-boosting constellations (e.g., Bennett C5 +3 Burst), accurately calculating talent level 13 ratios ($10 + 3 = 13 \implies 119\% + 20\% = 139\% \implies 865 \times 1.39 = 1,202.4$ flat ATK).
  - **Talent Dropdown Bounds**: Restricted talent level selectors across the main calculator and support build editor to base levels 1–10 with live `+3 (Lv. 13)` indicators.
  - **Dedicated Save & Unsaved Changes Guard**: Added an explicit Save button in `SupportBuildEditorView.tsx` with a dirty state check and modal confirmation when navigating back to the main calculator without saving.
- **Formula Breakdown Mathematical Precision & Sub-Formula Alignment (September 3, 2026)**:
  - Resolved calculation discrepancies and formula decompositions in `/characters/[id]/formula` for Flins and direct reaction scaling.
  - Updated "Default CRIT Rate" label to "Initial CRIT Rate" and enforced probability law bounding ($\le 100\%$).
- **Unified Character & Support Registry Architecture (August 20, 2026)**: Consolidated the support character registry (`src/data/registry/supports/`) directly into the central character registry (`src/data/registry/characters/`), creating a single source of truth for both playable DPS characters and supportive team buff providers:
  - **Single Source of Truth**: Extended `CharacterConfig` in `src/data/registry/types.ts` with an optional `support?: CharacterSupportBuffDef` block.
  - **Dynamic Support Derivation**: Registry dynamically derives `SUPPORT_CONFIGS` via `CHARACTERS.filter(c => !!c.support)` with dual ID compatibility (`"bennett"` / `"bennett-support"`, `"ineffa"` / `"ineffa-support"`).
  - **Folder Consolidation**: Removed `src/data/registry/supports/` and cleanly updated imports across calculation engines, UI components, and test suites.
- **Dedicated Support Character UI & Popup Modal (`<TeamBuffModal>`) (August 20, 2026)**: Redesigned the team support buff interface into a dedicated 2-pane popup modal dialog and sleek summary card, matching the External Weapon and Artifact buff architectures:
  - **2-Pane Modal (`TeamBuffModal.tsx`)**:
    - *Header & Multi-Setup Tabs*: Setup switcher tabs (Setup 1 / Setup 2 / Setup 3) with active counter badges (`{activeCount}/3`).
    - *Left Catalog Pane*: Real-time search bar, Element filters with icons (Pyro, Hydro, Electro, Cryo, Anemo, Geo, Dendro), Rarity filters (5★, 4★), and comprehensive character cards detailing utility descriptions, provided buffs breakdown (`+6% Total ATK as EM`, `Up to 119% Base ATK as Flat ATK`), and constellation previews.
    - *Right Configuration Pane*: Master "Apply All" toggle, per-support checkboxes, brief info stat summary pills (`formatBriefStats`), setup switcher dropdowns, `[🔄 Sync]` button, `[✎ Edit Build ↗]` links, interactive C0–C6 constellation selectors, and constellation-gated mechanic sliders/toggles with dynamic prerequisite hints.
  - **Compact Summary Card (`TeamBuffPanel.tsx`)**: Interactive pill cloud on the setup card displaying configured team supports (element icon, name, constellation badge, setup name) with live aggregated stat bonus badges and quick `⚙️ Edit` trigger.
- **Complete 64-Artifact Database & External Artifact Team Buff Engine (August 20, 2026)**: Implemented full modular 1-file-per-artifact definitions for all 64 artifact sets in Genshin Impact (`src/data/registry/artifacts/`) across 5 release generations:
  - **Batch 1 (Starter & 1★–4★, 18 Sets)**: *Initiate, Adventurer, Lucky Dog, Traveling Doctor, Resolution of Sojourner, Tiny Miracle, Berserker, Instructor, The Exile, Defender's Will, Brave Heart, Martial Artist, Gambler, Scholar, Prayers for Wisdom, Prayers for Destiny, Prayers for Illumination, Prayers to Springtime*.
  - **Batch 2 (Classic Mondstadt & Liyue, 14 Sets)**: *Gladiator's Finale, Wanderer's Troupe, Noblesse Oblige, Bloodstained Chivalry, Maiden Beloved, Viridescent Venerer, Archaic Petra, Retracing Bolide, Thundersoother, Thundering Fury, Lavawalker, Crimson Witch of Flames, Blizzard Strayer, Heart of Depth*.
  - **Batch 3 (Inazuma & Sumeru, 14 Sets)**: *Tenacity of the Millelith, Pale Flame, Shimenawa's Reminiscence, Emblem of Severed Fate, Husk of Opulent Dreams, Ocean-Hued Clam, Vermillion Hereafter, Echoes of an Offering, Deepwood Memories, Gilded Dreams, Desert Pavilion Chronicle, Flower of Paradise Lost, Nymph's Dream, Vourukasha's Glow*.
  - **Batch 4 (Fontaine & Natlan, 10 Sets)**: *Marechaussee Hunter, Golden Troupe, Song of Days Past, Nighttime Whispers in the Echoing Woods, Fragment of Harmonic Whimsy, Unfinished Reverie, Scroll of the Hero of Cinder City, Obsidian Codex, Long Night's Oath, Finale of the Deep Galleries*.
  - **Batch 5 (Nod-Krai & Moonsign / Special, 8 Sets)**: *Night of the Sky's Unveiling, Silken Moon's Serenade, Aubade of Morningstar and Moon, A Day Carved from Rising Winds, Celestial Gift, Disenchantment in Deep Shadow, Scarlet Proof, Heart of the Furnace*.
  - **Role Separation & Constraint Engine (`artifact-buffs.ts`)**: Pure mathematical resolver supporting **Wielder** (active DPS self-buffs) vs **Party Support** (party-wide external buffs), 2-Piece vs 4-Piece requirement activation, strict maximum of 4 active artifact sets per team, same-name non-stacking party support deduplication, weapon eligibility checks, ER-to-Burst DMG scaling, and mechanic condition sliders.
  - **Direct Reaction Stat Additions**: Extended `damage.ts` and `types.ts` with `stellarSwirlDmgBonus` and `stellarGlimmerDmgBonus` stat keys for direct reaction damage derivation.
  - **Interactive 2-Pane Modal (`<ExternalArtifactBuffModal>`) & Summary Card (`<ExternalArtifactBuffPanel>`)**: Features search, role filters (*All*, *Party Support*, *Wielder*), 2pc/4pc switcher, slot switcher (*⚔️ Wielder* vs *🛡️ Support*), mechanic controls, multi-setup tabs, and real-time aggregate stat delta previews.
  - **Prisma Schema & Database Synchronization**: Added `model Artifact` with `isSupport` indexing to `schema.prisma`, DDL to `gi_stat_db.sql`, dynamic upserts to `prisma/seed.ts`, and developer skill in `.agents/skills/external-artifact-buffs/SKILL.md`.
- **Complete 244-Weapon Database & Weapon Role Separation (August 19, 2026)**: Completed the entire weapon database across all 5 weapon classes (56 Swords, 47 Claymores, 44 Polearms, 49 Bows, 48 Catalysts) in modular 1-file-per-weapon registries (`src/data/registry/weapons/`):
  - **Role Separation Standard**: Categorized all weapons into **Party Support** (`isSupport: true, buffType: "team" | "both"`) vs **Own Wielder** (`isSupport: false, buffType: "self"`).
    - *Party Support Weapons* (e.g. *Freedom-Sworn, Key of Khaj-Nisut, Peak Patrol Song, Song of Broken Pines, Wolf's Gravestone, Makhaira Aquamarine, Forest Regalia, Moonpiercer, A Thousand Floating Dreams, Crane's Echoing Call, TTDS, Hakushin Ring, Wandering Evenstar, Elegy for the End, Golden Frostbound Oath, Favonius Series*) can be equipped as external team buff sources for any character in the party regardless of weapon type.
    - *Own Wielder Weapons* (e.g. *Staff of Homa, Tome of the Eternal Flow, Crimson Moon's Semblance, The Daybreak Chronicles, Surf's Up, Thundering Pulse, The First Great Magic, Calamity Queller, Kagura's Verity, The Widsith*) are filtered strictly to characters matching the weapon class.
  - **High-Fidelity Scaling & Mechanics**: Full R1–R5 mathematical refinement curves, dynamic condition sliders/toggles (`mechanicDefs`), and context-aware computation closures (`compute(r, ctx)`).
  - **External Weapon Buffs Popup Modal (`<ExternalWeaponBuffModal>`)**: Overhauled UX flow with a dedicated popup modal (modeled after *Rotation Builder*) accessible via toolbar button `⚔️ Weapon Buffs` with an active buff badge. Includes real-time search, multi-axis filtering (Current Wielder Type, Party Support Only, Weapon Category, Rarity), multi-setup switcher tabs (A/B/C/D), refinement selector, interactive mechanic controls, and live aggregate stat delta preview.
  - **Compact In-Card Summary (`<ExternalWeaponBuffPanel>`)**: Streamlined the setup card into an interactive compact pill cloud displaying active weapons with quick `⚙️ Edit` trigger.
  - **Calculation Engine & Formula Breakdown Alignment**: Pure mathematical resolution in `src/lib/engine/weapon-buffs.ts` with master toggle bypass, integrated directly into `/characters/[id]/formula` calculation derivations with explicit source attributions (`Received Team Buffs`).
  - **Comprehensive Quality Verification**: 45 test files (335 test cases) passing in Vitest, 0 TypeScript errors, 0 duplicate IDs, and verified production Next.js compilation in Turbopack.
- **Character Notes & Damage Table Height Synchronization (August 10, 2026)**: Synchronized layout height formatting between character notes panels and damage output tables across setup cards for consistent card presentation.

- **Modular Team Support Buff System (August 9, 2026)**: Introduced off-field team support buff engine (`team-buffs.ts`) supporting up to 3 team members (e.g. Ineffa) with off-field stat buffs, Moonsign Lunar Base DMG bonuses, and averaged team CRIT rates/DMGs. Added collapsible `<TeamBuffPanel>` UI component with master "Apply All" toggle, individual support checkboxes, constellation level selectors, and live computed buff previews, fully integrated into `CharacterCalculator.tsx` and formula breakdown source attributions.
- **Formula Breakdown Mode Lock & Scroll Restoration (August 9, 2026)**: Defaulted initial damage calculation to **Average (`avg`)**, persisting damage mode selection in `localStorage` (`gi_calc_dmg_type`) and URL query parameters (`?mode=nonCrit`). Automatically captures `window.scrollY` prior to opening formula breakdown and restores exact vertical scroll position when returning to the calculator page.
- **Dynamic Database Connection Probe & Diagnostics Modal (August 4, 2026)**: Added server action `getDbStatus()` with connection racing and latency timing. Created interactive `<DbStatusBadge>` pill displaying real-time DB health (online latency, active build counts, offline/checking statuses) and an accessible `<DbStatusModal>` dialog featuring connection specs, redacted credentials, raw error logs, XAMPP troubleshooting instructions, and live re-check triggers without page reloads.
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
- **Artifact Base DEF & Base HP Context Scaling (September 4, 2026)**: Fixed an engine issue in `resolveExternalArtifactBuffs` where percent DEF% and HP% buffs were erroneously scaling against `baseAtk` instead of `baseDef` and `baseHp`.
- **Columbina C2 Ascendant Gleam Buff Formulas (September 4, 2026)**: Corrected Columbina C2 support buff computations to accurately share +1% Max HP as ATK (Lunar-Charged), +0.35% Max HP as EM (Lunar-Bloom), and +1% Max HP as DEF (Lunar-Crystallize) instead of placeholder ratios.
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

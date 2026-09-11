---
name: effective-stats
description: Architectural standard and guidelines for implementing the Effective Stats & Buff Breakdown system, per-element enemy resistance resolution, HTTP 431 URL safety rules, standalone focus view routing, anchor navigation, and external support buff auditing.
---

# Effective Stats & Buffs Breakdown Skill & Architectural Standard

This skill documents the exact architectural patterns, data structures, calculation engine, URL safety rules, anchor navigation, UI components, and verification workflow for the **Effective Stats & Buff Breakdown System** in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The Effective Stats & Buff Breakdown system provides mathematical transparency across every stat, talent multiplier, and debuff in the damage calculation pipeline. It reveals the exact progression from base attribute values to final effective numbers, accounting for:
- Character base stats and weapon main/substats
- Character talent passives and ascension modifiers
- Constellation level stat bonuses (C1–C6)
- Active character mechanic toggles and sliders
- External team support buffs (e.g. Bennett, Furina, Kazuha, Xilonen)
- External party-support weapon buffs (e.g. Freedom-Sworn, Elegy for the End, A Thousand Floating Dreams)
- External party-support artifact buffs (e.g. Viridescent Venerer, Noblesse Oblige, Tenacity of the Millelith, Scroll of Cinder City)

### The Three Presentation Layers

1. **In-Calculator Compact Summary (`StatBreakdownRow.tsx`)**:
   - Rendered directly inside `CharacterCalculator.tsx` under `"EFFECTIVE STATS & BUFF BREAKDOWN"`.
   - Each row displays stat name, raw value, additions count, and final total.
   - Hovering the `[?]` icon or row opens an in-place speech bubble with a breakdown of additions.
   - Clicking redirect (`onRedirect`) immediately jumps to the standalone focus view with anchor deep-linking (`#stat-${statKey}`).
2. **In-Page Interactive Modal (`EffectiveStatsModal.tsx`)**:
   - Opens as a rich modal dialog within the calculator without navigating away from the page.
   - Allows quick audit of all stats, category tab filtering, external-buffed-only toggling, and multi-setup switching.
   - Contains a direct `"Open Full Page"` link to the standalone focus view.
3. **Dedicated Standalone Route (`/characters/[id]/effective-stats` via `EffectiveStatsView.tsx`)**:
   - Full-screen workbench displaying comprehensive stat cards with full mathematical equations, sources with rarity-themed badges, and sub-breakdown descriptions.
   - Supports hash anchor auto-scrolling with smooth centering and highlight rings.

---

## 2. File Architecture & Module Registry

| File Path | Role | Key Functions / Responsibilities |
| --- | --- | --- |
| `src/lib/engine/effective-stats.ts` | **Core Engine & Definitions** | `EFFECTIVE_ROW_DEFINITIONS`, `resolveAllEffectiveStats()` pure resolution engine. |
| `src/lib/engine/damage.ts` | **Damage Stats & Helpers** | `DamageStats` interface, `getTargetResForElement()`, `applyStatDelta()`, `resMultiplier()`. |
| `src/components/calculator/components/StatBreakdownRow.tsx` | **Summary Row Component** | In-place hover popover, signed formatting, redirect trigger `onRedirect('stat-${statKey}')`. |
| `src/components/calculator/components/EffectiveStatsModal.tsx` | **In-Page Audit Modal** | Modal dialog with setup switcher, category filter, external-buff badge counter, and full-page link. |
| `src/components/calculator/EffectiveStatsView.tsx` | **Full-Screen Client View** | Setup switcher, category tabs, text search, hash anchor auto-scroll, amber highlight ring, back button. |
| `src/app/characters/[id]/effective-stats/page.tsx` | **Next.js Server Page** | Loads character config, talent scaling, decodes optional clipboard share build, renders `EffectiveStatsView`. |
| `src/components/CharacterCalculator.tsx` | **Main Calculator Page** | Houses `handleEffectiveStatsRedirectWithAnchor`, renders compact `StatBreakdownRow` list. |
| `src/lib/engine/effective-stats.test.ts` | **Vitest Test Suite** | Validates definitions, constellation additions, team buffs, external gear, and per-element RES. |

---

## 3. HTTP 431 URL Safety Standard (CRITICAL RULE)

> [!CAUTION]
> **NEVER pass large serialized builds (`?share=${encodeBuild(payload)}`) in internal router navigation (`router.push()`)!**

### The Bug & Root Cause
- In multi-setup character calculators, the state payload contains up to 4 setups, each with 50+ stats, rotations, action steps, notes, external weapons, and external artifacts.
- Serializing this payload to JSON and Base64 (`encodeBuild`) produces strings exceeding 15,000 to 30,000 characters.
- Node.js and Next.js HTTP servers enforce a strict default header size limit (`maxHeaderSize` = 8KB–16KB).
- Navigating with `router.push('/characters/[id]/effective-stats?share=' + encoded + ...')` causes the browser/Next.js to issue HTTP requests with oversized request lines, resulting in:
  ```text
  HTTP ERROR 431 Request Header Fields Too Large
  This page isn’t working
  ```

### The Mandatory Solution: Local Storage Synchronization
Internal navigation must **never** use `?share=...`. Instead:
1. **Synchronize Draft to `localStorage` immediately before navigation**:
   ```ts
   const handleEffectiveStatsRedirectWithAnchor = (targetAnchorId?: string) => {
     const hash = targetAnchorId ? `#${targetAnchorId}` : "";
     if (typeof window !== "undefined") {
       try {
         const draft = {
           instances,
           rotations: rotationState.rotations,
           activeRotationId: rotationState.activeRotationId,
           activeBuildId,
           activeBuildName,
         };
         localStorage.setItem(`gi_calc_working_draft_${config.id}`, JSON.stringify(draft));
         sessionStorage.setItem(`gi_calc_scroll_${config.id}`, window.scrollY.toString());
       } catch (e) {}
     }
     router.push(`/characters/${config.id}/effective-stats?setup=${inst.id}${hash}`);
   };
   ```
2. **Apply the exact same rule to Formula Breakdown redirect**:
   ```ts
   const handleFormulaRedirectWithAnchor = (targetAnchorId?: string) => {
     const hash = targetAnchorId ? `#${targetAnchorId}` : "";
     let modeParam = "";
     if (typeof window !== "undefined") {
       try {
         const draft = {
           instances,
           rotations: rotationState.rotations,
           activeRotationId: rotationState.activeRotationId,
           activeBuildId,
           activeBuildName,
         };
         localStorage.setItem(`gi_calc_working_draft_${config.id}`, JSON.stringify(draft));
         sessionStorage.setItem(`gi_calc_scroll_${config.id}`, window.scrollY.toString());
         const storedMode = localStorage.getItem("gi_calc_dmg_type");
         if (storedMode) modeParam = `&mode=${storedMode}`;
       } catch (e) {}
     }
     router.push(`/characters/${config.id}/formula?setup=${inst.id}${modeParam}${hash}`);
   };
   ```
3. **In `EffectiveStatsView.tsx`, prioritize local working draft**:
   ```ts
   const [instances, setInstances] = useState<CalcInstance[]>(() => {
     const createInit = (id: string): CalcInstance => ({ ... });

     // 1. If explicit ?share=... is in URL, use decoded build
     const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
     if (params?.has("share") && initialBuild?.data) {
       const hyd = hydrateFromBuild(initialBuild.data, createInit);
       if (hyd && hyd.instances.length > 0) return hyd.instances;
     }

     // 2. Otherwise prefer active working draft from localStorage
     if (typeof window !== "undefined") {
       try {
         const stored = localStorage.getItem(`gi_calc_working_draft_${config.id}`);
         if (stored) {
           const draft = JSON.parse(stored);
           if (Array.isArray(draft.instances) && draft.instances.length > 0) {
             return draft.instances;
           }
         }
       } catch (e) {}
     }

     // 3. Fallback to DB build or fresh instance
     if (initialBuild?.data) {
       const hyd = hydrateFromBuild(initialBuild.data, createInit);
       if (hyd && hyd.instances.length > 0) return hyd.instances;
     }

     return [createInit("setup-1")];
   });

   // Keep instances synchronized on client mount
   useEffect(() => {
     if (typeof window === "undefined") return;
     const params = new URLSearchParams(window.location.search);
     if (params.has("share")) return;
     try {
       const stored = localStorage.getItem(`gi_calc_working_draft_${config.id}`);
       if (stored) {
         const draft = JSON.parse(stored);
         if (Array.isArray(draft.instances) && draft.instances.length > 0) {
           setInstances(draft.instances);
         }
       }
     } catch (e) {}
   }, [config.id]);
   ```
4. **Clean fallback `backHref`**:
   ```ts
   const backHref = `/characters/${config.id}?setup=${activeInstId}`;
   ```

---

## 4. Per-Element Enemy Resistance Standard (CRITICAL RULE)

> [!IMPORTANT]
> **In Genshin Impact, Enemy Resistance is ALWAYS resolved per-element. A solitary "Enemy RES (Global)" row is strictly forbidden in the breakdown.**

### Architectural Requirements

1. **Row Definitions**:
   `EFFECTIVE_ROW_DEFINITIONS` must declare all 8 distinct elemental and physical enemy resistance rows under `category: "debuffs"`:
   ```ts
   // 8. Enemy Debuffs
   { key: "enemyPhysicalRes", label: "Enemy Physical DMG RES", category: "debuffs", unit: "percent" },
   { key: "enemyPyroRes",     label: "Enemy Pyro DMG RES",     category: "debuffs", unit: "percent" },
   { key: "enemyHydroRes",    label: "Enemy Hydro DMG RES",    category: "debuffs", unit: "percent" },
   { key: "enemyDendroRes",   label: "Enemy Dendro DMG RES",   category: "debuffs", unit: "percent" },
   { key: "enemyElectroRes",  label: "Enemy Electro DMG RES",  category: "debuffs", unit: "percent" },
   { key: "enemyAnemoRes",    label: "Enemy Anemo DMG RES",    category: "debuffs", unit: "percent" },
   { key: "enemyCryoRes",     label: "Enemy Cryo DMG RES",     category: "debuffs", unit: "percent" },
   { key: "enemyGeoRes",      label: "Enemy Geo DMG RES",      category: "debuffs", unit: "percent" },
   { key: "defReduction",     label: "DEF Reduction",          category: "debuffs", unit: "percent", hideIfZero: true },
   { key: "defIgnore",        label: "DEF Ignore",             category: "debuffs", unit: "percent", hideIfZero: true },
   ```
   - **Do NOT** include `{ key: "enemyRes", label: "Enemy RES (Global)" }`.
   - **Do NOT** set `hideIfZero: true` on the 8 enemy resistance rows. In Genshin Impact, base enemy resistance is 10% by default, and 0% is an active resistance state (e.g. stunned Ruin Guard), not an empty stat.

2. **Mathematical Resolution in `resolveAllEffectiveStats`**:
   ```ts
   const isEnemyRes = [
     "enemyPhysicalRes", "enemyPyroRes", "enemyHydroRes", "enemyDendroRes",
     "enemyElectroRes", "enemyAnemoRes", "enemyCryoRes", "enemyGeoRes",
   ].includes(statKey as string);

   let raw: number;
   let total: number;

   if (isEnemyRes) {
     const elementMap: Record<string, Element | "Physical"> = {
       enemyPhysicalRes: "Physical",
       enemyPyroRes: "Pyro",
       enemyHydroRes: "Hydro",
       enemyDendroRes: "Dendro",
       enemyElectroRes: "Electro",
       enemyAnemoRes: "Anemo",
       enemyCryoRes: "Cryo",
       enemyGeoRes: "Geo",
     };
     const elem = elementMap[statKey as string];
     const baseVal = toNum(inputStats[statKey]);
     const globalBase = toNum(inputStats.enemyRes) ?? 10;
     raw = baseVal !== undefined ? baseVal : globalBase;
     total = getTargetResForElement(effectiveStats, elem);
   } else {
     raw = (inputStats[statKey] as number | undefined) ?? 0;
     total = (effectiveStats[statKey] as number | undefined) ?? 0;
   }
   const delta = total - raw;
   ```

3. **Debuff Source Attribution**:
   Both element-specific debuffs (`statKey`) AND universal debuffs (`enemyRes`) must bind to the element's additions:
   ```ts
   // Team buffs
   for (const src of teamRes.sources) {
     if (src.stat === statKey || (isEnemyRes && src.stat === "enemyRes")) {
       additions.push({
         source: `${src.supportName} (Team)`,
         value: src.value,
         description: src.label,
         type: "external",
         category: "team",
         rarity: src.rarity ?? 5,
       });
     }
   }

   // Weapon buffs
   for (const src of weaponRes.sources) {
     if (src.stat === statKey || (isEnemyRes && src.stat === "enemyRes")) {
       additions.push({
         source: `${src.weaponName} (Weapon)`,
         value: src.value,
         description: src.label,
         type: "external",
         category: "weapon",
         rarity: src.rarity ?? 5,
       });
     }
   }

   // Artifact buffs (e.g. Viridescent Venerer, Deepwood Memories)
   for (const src of artifactRes.sources) {
     if (src.stat === statKey || (isEnemyRes && src.stat === "enemyRes")) {
       additions.push({
         source: `${src.artifactName} (Artifact)`,
         value: src.value,
         description: src.label,
         type: "external",
         category: "artifact",
         rarity: src.rarity ?? 5,
       });
     }
   }
   ```

4. **Concrete In-Game Examples**:
   - **Viridescent Venerer (4-Pc)**: Swirls Pyro -> Shreds Pyro RES by -40%.
     - `Enemy Pyro DMG RES`: Raw `10%`, Additions: `-40% Viridescent Venerer (Artifact)`, Total `-30.0%` [⭐ External Support Buffed].
     - Other elements remain at `10%`.
   - **Zhongli Jade Shield**: Decreases all Elemental & Physical RES by -20%.
     - All 8 resistance rows display Raw `10%`, Additions: `-20% Zhongli (Team)`, Total `-10.0%` [⭐ External Support Buffed].
   - **Superconduct**: Decreases Physical RES by -40%.
     - `Enemy Physical DMG RES`: Raw `10%`, Additions: `-40% Superconduct`, Total `-30.0%`.
   - **Custom Boss Overrides**: User configures `enemyPyroRes: 70` (e.g. Pyro Regisvine).
     - `Enemy Pyro DMG RES`: Raw `70%`, VV addition `-40%` -> Total `30.0%`.

---

## 5. Category Organization & Stat Classification

Every stat belongs to an explicit category for UI tab filtering in `EffectiveStatsView`:

| Category ID | Label & Icon | Covered Statistics |
| :--- | :--- | :--- |
| `attributes` | **Core Attributes** ⚔️ | `atk`, `hp`, `def`, `em`, `critRate`, `critDmg`, `energyRecharge`, `healingBonus`, `baseAtk`, `baseHp`, `baseDef` |
| `categoryDmg` | **Category DMG** 💥 | `normalDmgBonus`, `chargedDmgBonus`, `plungeDmgBonus`, `skillDmgBonus`, `burstDmgBonus`, flat increases & level boosts |
| `elementalDmg` | **Elemental DMG** 🔥 | `dmgBonus` (Common/All), Pyro/Hydro/Dendro/Electro/Anemo/Cryo/Geo/Physical DMG bonuses and flat increases |
| `elementalCrit`| **Elemental CRIT** 🎯 | Pyro/Hydro/Dendro/Electro/Anemo/Cryo/Geo/Physical CRIT Rate and CRIT DMG bonuses |
| `talentCrit` | **Talent CRIT** 🏹 | Normal/Charged/Plunging/Skill/Burst CRIT Rate and CRIT DMG bonuses |
| `reactionDmg` | **Reaction DMG** 💥 | Overload, Superconduct, Swirl, Bloom, Hyperbloom, Burgeon, Vape/Melt bonuses, Lunar reaction bonuses & special bonuses |
| `reactionCrit` | **Reaction CRIT** ⚡ | Lunar-Charged, Lunar-Bloom, Lunar-Crystallize, Stellar Swirl, Stellar-Conduct CRIT Rate & CRIT DMG |
| `debuffs` | **Enemy Debuffs** 🛡️ | All 8 per-element enemy resistances (`enemyPhysicalRes` through `enemyGeoRes`), `defReduction`, `defIgnore` |
| `selfRes` | **Self Resistances** 🔰 | Character self physical and elemental resistances (`selfPhysicalRes` through `selfDendroRes`) |
| `staminaAndMisc`| **Stamina & Misc** 🏃 | Stamina consumption, sprinting/gliding dec, shield strength, CD reduction, ATK SPD, movement SPD |
| `multipliers` | **Multipliers** ⚡ | `transformativeBonus`, `vaporizeMult`, `meltMult`, `aggravateFlat`, `spreadFlat` |

Special category chips:
- `all`: Displays all active stats.
- `externalOnly`: Filters only stats that have `hasExternalBuffs: true` (e.g. stats receiving team, supportive weapon, or supportive artifact buffs).

---

## 6. Hash Anchor Navigation & Focus View Deep-Linking

When clicking a statistic row in the calculator:

1. **Trigger in `StatBreakdownRow.tsx`**:
   ```ts
   const handleRedirect = (e?: React.MouseEvent) => {
     if (e) e.stopPropagation();
     if (onRedirect && statKey) {
       onRedirect(`stat-${statKey}`);
     } else {
       setShowTooltip((prev) => !prev);
     }
   };
   ```
2. **Anchor Navigation in `EffectiveStatsView.tsx`**:
   Card containers render with matching unique HTML IDs:
   ```tsx
   <div
     key={b.key}
     id={`stat-${b.key}`}
     className={`rounded-2xl border p-5 transition-all duration-300 ${
       isHighlighted
         ? "border-amber-500 ring-4 ring-amber-500/40 shadow-xl bg-amber-50/10 dark:bg-amber-950/20"
         : isExt
         ? "border-amber-400/50 dark:border-amber-500/40 bg-white dark:bg-zinc-900 shadow-xs ring-1 ring-amber-400/20"
         : "border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60"
     }`}
   >
   ```
3. **Smooth Centering & Amber Ring**:
   ```ts
   const hash = window.location.hash.replace("#", "");
   if (hash) {
     setActiveCategory("all");
     setHighlightedId(hash);
     setTimeout(() => {
       const el = document.getElementById(hash);
       if (el) {
         el.scrollIntoView({ behavior: "smooth", block: "center" });
       }
     }, 150);
   }
   ```

---

## 7. Rarity-Themed Source Badges

Every source listed in an effective stat's additions tree uses the centralized rarity theme (`getRarityTheme(rarity)`):

| Rarity | Vibe Theme | Accents | Used By |
| :--- | :--- | :--- | :--- |
| **5★ (Gold)** | Amber / Gold | `amber-500`, `amber-400`, `amber-950/20` | 5★ Characters (Kazuha, Zhongli, Furina, Xilonen), 5★ Weapons (Freedom-Sworn), 5★ Artifacts (VV, Noblesse) |
| **4★ (Purple)** | Violet / Purple | `purple-600`, `purple-400`, `purple-950/20` | 4★ Characters (Bennett, Chevreuse, Sucrose), 4★ Weapons (Favonius), 4★ Artifacts (Instructor) |
| **3★ (Blue)** | Sky / Cyan | `sky-600`, `sky-400`, `sky-950/20` | 3★ Weapons (TTDS) |
| **Trait / Mechanic** | Emerald / Slate | `emerald-500` / `zinc-500` | Innate character mechanics, ascension passives, constellations |

---

## 8. Verification & Testing Checklist

When modifying or implementing effective stats or debuffs, execute the following verification workflow:

1. **Automated Vitest Test**:
   ```bash
   npx vitest run src/lib/engine/effective-stats.test.ts
   ```
   Ensure tests verify:
   - All core attributes are defined and compute correct `raw` and `total`.
   - External team support buffs flag `hasExternalBuffs: true` with correct rarity.
   - External weapon buffs (e.g. A Thousand Floating Dreams) and artifact buffs (Noblesse Oblige) attribute properly.
   - `enemyPyroRes`, `enemyHydroRes`, `enemyPhysicalRes` are defined per-element and reflect -40% VV or -20% Zhongli.
2. **Full Test Suite Run**:
   ```bash
   npx vitest run
   ```
   Ensure all 55+ test files and 500+ tests pass without regression.
3. **Manual Browser Verification**:
   - Open any character calculator (e.g. Arlecchino).
   - Equip a support character with Viridescent Venerer (e.g. Kazuha).
   - Scroll to `"EFFECTIVE STATS & BUFF BREAKDOWN"`.
   - Confirm `Enemy Pyro DMG RES` shows `10% (-40%) -> -30.0%` with external buff badge.
   - Click the row: verify seamless redirect to `/characters/arlecchino/effective-stats?setup=setup-1#stat-enemyPyroRes` **without HTTP 431**.
   - Verify smooth scrolling directly to the `Enemy Pyro DMG RES` card with an amber highlight ring.
   - Click `"Back to Arlecchino Calculator"`: verify scroll position is restored.
4. **Graphify Knowledge Graph Update**:
   ```bash
   graphify update .
   ```
   Run after modifying code files to keep graph relations current.

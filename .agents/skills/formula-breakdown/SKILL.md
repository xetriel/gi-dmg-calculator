---
name: formula-breakdown
description: Guidelines and architectural standard for implementing the independent formula breakdown page, hit formula decomposition trees, tooltip popover hover delay, direct anchor navigation, and special constellation damage integration.
---

# Formula Breakdown & Explainer Skill & Implementation Standard

This skill documents the exact patterns, mathematical decomposition trees, routing architecture, interactive UI components, anchor navigation, and verification steps for the **Independent Formula Breakdown & Damage Explanation System** in `gi-dmg-calculator`.

---

## 1. Core Architecture & Philosophy

The Independent Formula Breakdown system provides complete mathematical transparency for every calculated damage hit, transformative reaction, lunar reaction, and external team buff.

### Key Principles
1. **Dedicated Independent Page Route (`/characters/[id]/formula`)**:
   - A standalone, full-screen view listing structured mathematical equations and nested sub-equation breakdowns for all possible character damage outputs.
   - Preserves exact user setup, artifacts, weapon stats, constellation level, and team support buffs via URL serialization (`?share=...&setup=...&mode=...`).
2. **Dual `[?]` Tooltip Pattern**:
   - **Effective Stats `[?]` Popover (`StatBreakdownRow.tsx`)**: An in-place speech bubble listing input stats, talent passives, constellation bonuses, and team support sources without redirecting.
   - **Damage Output `[?]` Tooltip (`HitFormulaTooltip.tsx`)**: Interactive speech bubble on every hit in `DamageTable` and reaction in `TransformativePanel`. Features a **200ms `mouseLeave` delay** to prevent accidental closing across mouse gaps, displays non-crit/crit/avg values, and links directly to the corresponding formula card via hash anchor navigation.
3. **Anchor Navigation & Smooth Scrolling**:
   - Clicking a hit's `[?]` redirects to `/characters/[id]/formula?...#<targetAnchorId>`.
   - The formula view reads `window.location.hash`, scrolls smoothly to center the target card (`scrollIntoView({ behavior: "smooth", block: "center" })`), and applies a temporary highlight border (`ring-2 ring-amber-500`).
4. **Structured Formula Decomposition**:
   - Every breakdown card contains:
     - **Main Equation**: Formatted for the selected mode (`Non-Crit`, `CRIT`, or `Average DMG`).
     - **Nested Sub-Breakdowns**: Step-by-step arithmetic equations resolving Total Stats (ATK/HP/DEF/EM), Base Stats, Team Buffs, Flat DMG Increases (e.g. Arlecchino Masque of the Red Death, Catalyze), DMG Bonuses (Common, Category, Elemental), CRIT stats, DEF Multiplier, and RES Multiplier.
5. **Special Constellation Hits**:
   - Special un-typed damage hits (e.g., Arlecchino C2 *Balemoon Bloodfire*, Klee C1/C4) render with dedicated constellation gating (`"—"` when inactive) and calculate damage with un-typed bonus rules (Common + Elemental DMG only, omitting category Skill/Burst bonuses).

---

## 2. File Architecture & Modules

| File Path | Purpose |
| --- | --- |
| `src/lib/engine/formula-explainer.ts` | Pure decomposition engine: `explainHitFormulas(config, scaling, inst)` producing `FormulaBreakdown[]` trees. |
| `src/app/characters/[id]/formula/page.tsx` | Next.js Server Component route handling `params.id` and `searchParams.share`, fetching database scaling with fallback to `TALENT_SEED`, decoding initial build state, and rendering `FormulaBreakdownView`. |
| `src/components/calculator/FormulaBreakdownView.tsx` | Full-screen client interface: setup switcher tabs, damage mode selector (`nonCrit` / `crit` / `avg`), category filter chips, search input, clipboard formula copy, and hash-anchor smooth scrolling. |
| `src/components/calculator/components/HitFormulaTooltip.tsx` | Interactive hover tooltip with 200ms `mouseLeave` timeout delay, quick damage previews, and anchor redirection trigger. |
| `src/components/calculator/components/DamageTable.tsx` | Renders `<HitFormulaTooltip>` next to hit names (`hit-<groupId>:<hitIndex>`), gating inactive constellation hits with `"—"`. |
| `src/components/calculator/components/TransformativePanel.tsx` | Renders `<HitFormulaTooltip>` next to transformative (`tr-<type>`) and lunar (`lunar-<lunarType>`) reaction cards. |
| `src/lib/engine/share.ts` | State serialization: `encodeBuild()` and `decodeBuild()` for lossless URL sharing and cross-page state synchronization. |

---

## 3. Formula Decomposition Engine (`explainHitFormulas`)

The function `explainHitFormulas(config, scaling, inst): FormulaBreakdown[]` processes:

### A. Formula Breakdown Interface (`FormulaBreakdown`)
```ts
export interface FormulaBreakdown {
  id: string;                      // DOM anchor ID: "hit-0:0", "tr-overloaded", "lunar-lunar-charged", "received-team-buffs"
  hitName: string;                 // Display name (e.g., "1-Hit DMG", "Balemoon Bloodfire")
  category: string;                // "normal" | "charged" | "plunge" | "skill" | "burst" | "special" | "transformative" | "lunar" | "team-buffs"
  element: Element | "Physical";
  reaction: ReactionType;          // "none" | "vaporize" | "melt" | "aggravate" | "spread"
  multiplierPct: number;           // Talent scaling % (reflects +3 if talent constellation active)
  scalingSource: string;           // "atk" | "hp" | "def" | "em" | "special"
  nonCrit: number;
  crit: number;
  avg: number;
  mainFormula: string;             // Default main equation
  mainFormulaNonCrit?: string;     // Non-crit main equation
  mainFormulaCrit?: string;        // CRIT main equation
  mainFormulaAvg?: string;         // Average main equation
  subBreakdowns: string[];         // Indented step-by-step arithmetic equations
}
```

---

## 4. Mathematical Equation Decomposition Standard

### A. Main Equation Construction
For standard talent hits:

- **Non-Crit Mode**:
  $$\text{HitName } \text{DMG} = (\text{Talent\%} \times \text{Total Stat} + \text{Total DMG Increase}) \times (100\% + \text{Total DMG Bonus\%}) \times \text{Enemy DEF Multiplier} \times \left(100\% - \frac{\text{Enemy RES\%}}{2}\right)$$

- **CRIT Mode**:
  $$\text{HitName } \text{DMG} = (\text{Talent\%} \times \text{Total Stat} + \text{Total DMG Increase}) \times (100\% + \text{Total DMG Bonus\%}) \times (100\% + \text{Total Crit DMG\%}) \times \text{Enemy DEF Multiplier} \times \left(100\% - \frac{\text{Enemy RES\%}}{2}\right)$$

- **Average Mode**:
  $$\text{HitName } \text{DMG} = (\text{Talent\%} \times \text{Total Stat} + \text{Total DMG Increase}) \times (100\% + \text{Total DMG Bonus\%}) \times (100\% + \text{Total Crit Rate\%} \times \text{Total Crit DMG\%}) \times \text{Enemy DEF Multiplier} \times \left(100\% - \frac{\text{Enemy RES\%}}{2}\right)$$

### B. Direct Reaction Hit Equations (Lunar / Stellar)
Direct Lunar and Stellar hits omit the standard Enemy DEF multiplier and replace standard DMG bonus with Special EM and reaction modifiers:
$$\text{Base Transformative Multiplier} = 100\% + \frac{6 \times \text{Total EM}}{\text{Total EM} + 2000}$$
$$\text{Lunar Hit DMG} = (\text{Talent\%} \times \text{Total Stat} \times \text{Base Transformative Multiplier} \times (100\% + \text{Lunar Base DMG\%}) + \text{Total Flat DMG}) \times (100\% + \text{Lunar Special DMG\%}) \times \text{RES Multiplier}$$

---

### C. Sub-Equations Decomposition Hierarchy

Every formula card generates structured sub-breakdown lines formatted as:

1. **Stat Scaling Decompositions**:
   ```text
   Total ATK 4604.6 = Base ATK 1016.4 * (100% + Art. ATK 71.1% + Team ATK 115.0%) + Art. ATK 311 + ATK (Bennett) 1203.0
   Base ATK 1016.4 = Char. ATK 342.03 + Weapon ATK 674.33
   Team ATK 115.0% = ATK (Arlecchino) 25% + ATK (Xilonen) 45% + ATK (Bennett) 20% + ATK (Kaedehara Kazuha) 25%
   ```

2. **Total DMG Increase Decompositions**:
   - **Arlecchino Masque of the Red Death**:
     ```text
     Total DMG Increase 24123 = Total Normal Att. DMG Increase 24123
     Total Normal Att. DMG Increase 24123 = 238% * Total ATK 4604.6 * 155% + 100% (C1) * Total ATK 4604.6 * 155%
     ```
   - **Catalyze (Aggravate / Spread)**:
     ```text
     Total DMG Increase 5214 = Aggravate Catalyze DMG 5214
     ```

3. **Total DMG Bonus Decompositions**:
   ```text
   Total DMG Bonus 329.5% = Total Common DMG Bonus 90% + Total Normal Att. DMG Bonus 20% + Total Pyro DMG Bonus 219.5%
   Total Common DMG Bonus 90% = Common DMG Bonus 90%
   Total Normal Att. DMG Bonus 20% = Normal Att. DMG Bonus (Kaedehara Kazuha) 20%
   Total Pyro DMG Bonus 219.5% = Pyro DMG Bonus 40% + Art. Pyro DMG Bonus 46.6% + Team Pyro DMG Bonus 80.6% + Pyro DMG Bonus (Kaedehara Kazuha) 52.3%
   ```

4. **CRIT Rate & CRIT DMG Decompositions (with Probability Clamping)**:
   ```text
   Total Crit Rate 80.3% = Max(Min((Initial Crit Rate 43.4% + Art. Crit Rate 36.9%), 100%), 0%)
   Total Crit DMG 227.5% = Initial Crit DMG 88.4% + Art. Crit DMG 139.1%
   ```
   *(Initial CRIT values reflect base stats from calculator inputs + weapon/ascension bonuses, clamped $\le 100\%$)*.

5. **Enemy DEF Multiplier Decomposition**:
   ```text
   Enemy DEF Multiplier 48.7% = Min(100%, ((Char. Level 90 + 100) / (Char. Level 90 + 100 + (Enemy Level 100 + 100))))
   ```

6. **Enemy RES Multiplier Decomposition**:
   ```text
   Total Enemy Pyro DMG RES -66% = Base Enemy Pyro DMG RES 10% + Team Enemy Pyro DMG RES -76%
   ```

7. **Received Team Buffs Summary Card (`id: "received-team-buffs"`)**:
   ```text
   Team ATK 115.0% = ATK (Bennett Fantastic Voyage) 1202.4 + Party ATK% (Noblesse Oblige) 203.2 + Party ATK% (TTDS) 243.8
   Team Elemental Mastery 148.44 = EM (Ineffa A4) 148.44 + Party EM (A Thousand Floating Dreams) 40.0
   Team Pyro DMG Bonus 15.0% = Pyro DMG (Bennett C6) 15.0%
   Team Enemy Pyro DMG RES -40% = Elemental RES Shred (Viridescent Venerer) -40.0%
   Team Lunar-Charged DMG Bonus 50.0% = Lunar-Charged DMG (Ineffa C1) 50.0%
   Team Lunar Base DMG 14.0% = Lunar Base DMG (Ineffa Moonsign) 14.0%
   ```

---

## 5. UI Components & Interaction Patterns

### A. Hit Formula Tooltip (`HitFormulaTooltip.tsx`)
1. **Hover Timeout Delay (200ms)**:
   - Uses `useRef<NodeJS.Timeout | null>` to store timeout ID.
   - `onMouseEnter`: cancels existing timeout, sets `showTooltip = true`.
   - `onMouseLeave`: sets a 200ms timer before setting `showTooltip = false`.
   - Prevents popover flicker across cursor movement gaps.
2. **Anchor Redirection**:
   - `onFormulaRedirect(targetAnchorId)` handler encodes the build, appends `#<targetAnchorId>`, and pushes the route.

### B. Formula Breakdown View (`FormulaBreakdownView.tsx`)
1. **Hydration & State Preservation**:
   - Hydrates instances from URL query parameter `?share=...` (falling back to database build or `localStorage` draft).
   - Syncs active setup via `?setup=setup-id` and damage mode via `?mode=crit|nonCrit|avg`.
2. **Hash Anchor Auto-Scroll & Highlight**:
   ```ts
   React.useEffect(() => {
     const hash = window.location.hash.replace("#", "");
     if (hash) {
       setHighlightedId(hash);
       setTimeout(() => {
         const el = document.getElementById(hash);
         if (el) {
           el.scrollIntoView({ behavior: "smooth", block: "center" });
         }
       }, 150);
     }
   }, [instances]);
   ```
3. **Clipboard Copy (`handleCopyFormula`)**:
   - Formats active equations into clean multiline text and writes to `navigator.clipboard`.

---

## 6. Verification Checklist

Before completing any formula breakdown task:
1. **Anchor Matching**: Verify every hit in `DamageTable` passes an anchor ID (`hit-<groupId>:<hitIndex>`) matching the ID generated in `explainHitFormulas`.
2. **Hover Delay**: Confirm moving the cursor from the `[?]` button to the speech bubble popover does not cause jitter or premature closing.
3. **Anchor Navigation**: Verify clicking `[?]` jumps directly to the target hit on `/characters/[id]/formula` and smoothly centers & highlights the card.
4. **Constellation Inactivity**: Verify hits requiring higher constellations (e.g. C2) render `"—"` at C0/C1 and do not produce erroneous formulas.
5. **Probability Bounds**: Verify CRIT Rate sub-breakdown displays clamping bounds `Max(Min(..., 100%), 0%)`.
6. **Unit Tests & Build**:
   ```bash
   npm test
   npm run build
   ```

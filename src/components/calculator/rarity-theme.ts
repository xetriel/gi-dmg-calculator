// Centralized design token mapping for rarities 1 through 5
// 5★ Gold | 4★ Purple | 3★ Blue | 2★ Green | 1★ Silver

export interface RarityTheme {
  badge: string;              // Rarity badge text/bg/border (e.g. ★★★★★)
  catalogBorderHover: string; // Catalog card border & bg on hover
  catalogAddedBg: string;     // Catalog card background when already added
  addButton: string;          // Catalog "+ Add" button
  cardBorderActive: string;   // Configured card border & background when enabled/active
  checkboxAccent: string;     // Checkbox accent color
  activeButton: string;       // Active option buttons (Setup, Refinement R1-5, Piece count)
  buttonHover: string;        // Inactive button hover border & text
  notePill: string;           // Info/note badge (Buffing, Preview, etc.)
  panelPillActive: string;    // Main screen panel pill when active
  sourceBuffPill: string;     // Bottom aggregated buff pill
}

export const RARITY_THEMES: Record<number, RarityTheme> = {
  5: {
    badge: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    catalogBorderHover: "hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20",
    catalogAddedBg: "border-amber-400/50 bg-amber-50/20 dark:bg-amber-950/10",
    addButton: "bg-amber-500 hover:bg-amber-600 text-white",
    cardBorderActive: "border-amber-400/60 dark:border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/15",
    checkboxAccent: "accent-amber-500",
    activeButton: "bg-amber-500 text-white border-amber-600 dark:bg-amber-600 dark:border-amber-500 shadow-xs",
    buttonHover: "hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400",
    notePill: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    panelPillActive: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200",
    sourceBuffPill: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  4: {
    badge: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    catalogBorderHover: "hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-950/20",
    catalogAddedBg: "border-purple-400/50 bg-purple-50/20 dark:bg-purple-950/10",
    addButton: "bg-purple-600 hover:bg-purple-700 text-white",
    cardBorderActive: "border-purple-400/60 dark:border-purple-500/40 bg-purple-50/20 dark:bg-purple-950/15",
    checkboxAccent: "accent-purple-500",
    activeButton: "bg-purple-600 text-white border-purple-700 dark:bg-purple-600 dark:border-purple-500 shadow-xs",
    buttonHover: "hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400",
    notePill: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    panelPillActive: "bg-purple-50/70 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700/60 text-purple-900 dark:text-purple-200",
    sourceBuffPill: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  3: {
    badge: "text-sky-500 bg-sky-500/10 border-sky-500/30",
    catalogBorderHover: "hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-950/20",
    catalogAddedBg: "border-sky-400/50 bg-sky-50/20 dark:bg-sky-950/10",
    addButton: "bg-sky-600 hover:bg-sky-700 text-white",
    cardBorderActive: "border-sky-400/60 dark:border-sky-500/40 bg-sky-50/20 dark:bg-sky-950/15",
    checkboxAccent: "accent-sky-500",
    activeButton: "bg-sky-600 text-white border-sky-700 dark:bg-sky-600 dark:border-sky-500 shadow-xs",
    buttonHover: "hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400",
    notePill: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    panelPillActive: "bg-sky-50/70 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700/60 text-sky-900 dark:text-sky-200",
    sourceBuffPill: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  2: {
    badge: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    catalogBorderHover: "hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20",
    catalogAddedBg: "border-emerald-400/50 bg-emerald-50/20 dark:bg-emerald-950/10",
    addButton: "bg-emerald-600 hover:bg-emerald-700 text-white",
    cardBorderActive: "border-emerald-400/60 dark:border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/15",
    checkboxAccent: "accent-emerald-500",
    activeButton: "bg-emerald-600 text-white border-emerald-700 dark:bg-emerald-600 dark:border-emerald-500 shadow-xs",
    buttonHover: "hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400",
    notePill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    panelPillActive: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200",
    sourceBuffPill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  1: {
    badge: "text-zinc-500 bg-zinc-500/10 border-zinc-500/30",
    catalogBorderHover: "hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/40 dark:hover:bg-zinc-800/30",
    catalogAddedBg: "border-zinc-400/50 bg-zinc-50/20 dark:bg-zinc-900/10",
    addButton: "bg-zinc-600 hover:bg-zinc-700 text-white",
    cardBorderActive: "border-zinc-400/60 dark:border-zinc-500/40 bg-zinc-50/20 dark:bg-zinc-900/15",
    checkboxAccent: "accent-zinc-500",
    activeButton: "bg-zinc-600 text-white border-zinc-700 dark:bg-zinc-600 dark:border-zinc-500 shadow-xs",
    buttonHover: "hover:border-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400",
    notePill: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
    panelPillActive: "bg-zinc-100/70 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-200",
    sourceBuffPill: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

export function getRarityTheme(rarity?: number): RarityTheme {
  return RARITY_THEMES[rarity ?? 5] ?? RARITY_THEMES[5];
}

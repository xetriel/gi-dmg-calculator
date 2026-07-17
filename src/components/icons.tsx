import React from "react";

export const ELEMENT_COLORS: Record<string, string> = {
  Pyro: "text-red-500 dark:text-red-400",
  Hydro: "text-blue-500 dark:text-blue-400",
  Electro: "text-purple-500 dark:text-purple-400",
  Cryo: "text-sky-400 dark:text-sky-300",
  Anemo: "text-teal-400 dark:text-teal-300",
  Geo: "text-amber-500 dark:text-amber-400",
  Dendro: "text-lime-500 dark:text-lime-400",
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const ElementIcon: React.FC<{ element: string; className?: string }> = ({ element, className = "w-4 h-4" }) => {
  const colorClass = ELEMENT_COLORS[element] || "text-gray-400";
  const fullClassName = `${className} ${colorClass} shrink-0`;

  switch (element) {
    case "Pyro":
      // Flame
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "Hydro":
      // Droplet
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case "Anemo":
      // Wind/Swirls
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2M12.59 19.41A2 2 0 1 0 14 16H2M15.73 8.27A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      );
    case "Electro":
      // Lightning bolt
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "Dendro":
      // Leaf
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 0 8a7 7 0 0 1-8 10z" />
          <path d="M9 22a7 7 0 0 1-5-5.22" />
        </svg>
      );
    case "Cryo":
      // Snowflake
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </svg>
      );
    case "Geo":
      // Diamond Shield
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        </svg>
      );
    default:
      return null;
  }
};

export const WeaponIcon: React.FC<{ weapon: string; className?: string }> = ({ weapon, className = "w-4 h-4" }) => {
  const fullClassName = `${className} text-gray-500 dark:text-zinc-400 shrink-0`;

  switch (weapon) {
    case "Sword":
      // Sword
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v14M9 16h6M12 16v4M10 20h4" />
        </svg>
      );
    case "Claymore":
      // Claymore / Broadsword
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v14M8 14h8M12 14v6M10 20h4M10 3v11h4V3L12 2z" />
        </svg>
      );
    case "Polearm":
      // Spear
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 10v12M12 2l-2 8h4L12 2z" />
        </svg>
      );
    case "Bow":
      // Bow and arrow
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3c4.5 0 8 3.5 8 8s-3.5 8-8 8" />
          <line x1="9" y1="3" x2="9" y2="19" />
          <line x1="9" y1="11" x2="19" y2="11" />
        </svg>
      );
    case "Catalyst":
      // Open Book
      return (
        <svg className={fullClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    default:
      return null;
  }
};

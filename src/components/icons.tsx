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

export const ElementIcon: React.FC<{ element: string; className?: string }> = ({ element, className = "w-4 h-4" }) => {
  return (
    <img
      src={`/img/Element_${element}.webp`}
      alt={element}
      className={`${className} shrink-0 object-contain`}
      draggable={false}
    />
  );
};

export const WeaponIcon: React.FC<{ weapon: string; className?: string }> = ({ weapon, className = "w-4 h-4" }) => {
  const lowerWeapon = weapon.toLowerCase();
  return (
    <img
      src={`/img/Weapon-class-${lowerWeapon}-icon.webp`}
      alt={weapon}
      className={`${className} shrink-0 object-contain dark:invert`}
      draggable={false}
    />
  );
};

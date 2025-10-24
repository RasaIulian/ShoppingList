export const CATEGORIES = {
  FRUITS_VEGETABLES: { ro: "fructe/legume", en: "fruits/vegetables", name: { ro: "Fructe/Legume", en: "Fruits/Vegetables" }, emoji: "🍎🥦" },
  DAIRY: { ro: "lactate", en: "dairy", name: { ro: "Lactate", en: "Dairy" }, emoji: "🥛" },
  MEAT: { ro: "carne", en: "meat", name: { ro: "Carne", en: "Meat" }, emoji: "🥩" },
  BAKERY: { ro: "panificatie", en: "bakery", name: { ro: "Panificație", en: "Bakery" }, emoji: "🍞" },
  BEVERAGES: { ro: "bauturi", en: "beverages", name: { ro: "Băuturi", en: "Beverages" }, emoji: "🥤" },
  SWEETS: { ro: "dulciuri", en: "sweets", name: { ro: "Dulciuri", en: "Sweets" }, emoji: "🍬" },
  STAPLES: { ro: "produse de baza", en: "staples", name: { ro: "Produse de bază", en: "Staples" }, emoji: "🧂" },
  CANNED_GOODS: { ro: "conserve", en: "canned goods", name: { ro: "Conserve", en: "Canned Goods" }, emoji: "🥫" },
  FROZEN: { ro: "congelate", en: "frozen", name: { ro: "Congelate", en: "Frozen" }, emoji: "🧊" },
  CLEANING: { ro: "curatenie", en: "cleaning", name: { ro: "Curățenie", en: "Cleaning" }, emoji: "🧽" },
  PERSONAL_HYGIENE: { ro: "igiena personala", en: "personal hygiene", name: { ro: "Igienă Personală", en: "Personal Hygiene" }, emoji: "🛁" },
  NON_FOOD: { ro: "nealimentare", en: "non-food", name: { ro: "Nealimentare", en: "Non-food" }, emoji: "🔋" },
  OTHERS: { ro: "altele", en: "others", name: { ro: "Altele", en: "Others" }, emoji: "🛒" },
} as const;

const categoryValues = Object.values(CATEGORIES);

export const categories = categoryValues.flatMap((c) => [c.ro, c.en]);
export type CategoryType = typeof categories[number];

export const categoriesRO = categoryValues.map((c) => c.ro);
export const categoriesEN = categoryValues.map((c) => c.en);

export const categoryDisplay: Record<string, { name: string; emoji: string }> =
  categoryValues.reduce((acc, { ro, en, name, emoji }) => {
    acc[ro] = { name: name.ro, emoji };
    acc[en] = { name: name.en, emoji };
    return acc;
  }, {} as Record<string, { name: string; emoji: string }>);
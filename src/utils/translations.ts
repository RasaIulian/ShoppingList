/**
 * UI Strings and Translations
 * Centralized i18n (internationalization) for all user-facing text
 * Supports Romanian (ro) and English (en) languages
 * Usage: UI_STRINGS[language].keyName to get translated text
 */

import { Language } from "../hooks/useLanguage";

/**
 * Translation object containing all UI strings in both languages
 * Structure: UI_STRINGS["ro"|"en"][stringKey] = translatedText
 * Example: UI_STRINGS["ro"].addNewItem returns "adaugă articol nou"
 * @type {Record<Language, Record<string, string>>}
 */
export const UI_STRINGS: Record<Language, Record<string, string>> = {
  ro: {
    shoppingList: "Lista de cumpărături",
    myLists: "Listele mele",
    addNewItem: "adaugă articol nou",
    checkedItems: "Articole cumparate ✅",
    sort: "⬇️ Sortează",
    removeAllItems: "Șterge articolele",
    clickToEdit: "Click pentru a edita numele listei",
    toggleLanguage: "Schimbă limba (RO/EN)",
    createNewList: "Crează o nouă listă",
    savedLists: "Liste salvate",
    deletePermanently: "Șterge permanent",
    clickToBringBack: "(Click pentru a aduce înapoi în Lista de Cumpărături)",
    shoppingCart: "Coș de cumpărături",
    removeItem: "Șterge item",
    listLimitWarning:
      "Avertisment: limită de 10 liste atinsă. Vă rugăm să ștergeți o listă pentru a adăuga una nouă.",
    deleteListConfirm:
      'Sunteți sigur că doriți să ștergeți permanent "{{listName}}"? Această acțiune va fi permanenta.',
    cancel: "Anulare",
    delete: "Șterge",
  },
  en: {
    shoppingList: "Shopping List",
    myLists: "My Lists",
    addNewItem: "add new item",
    checkedItems: "Checked Items ✅",
    sort: "⬇️ Sort",
    removeAllItems: "Remove All Items",
    clickToEdit: "Click to edit list name",
    toggleLanguage: "Toggle language (RO/EN)",
    createNewList: "Create a new list",
    savedLists: "Saved lists",
    deletePermanently: "Delete permanently",
    clickToBringBack: "(Click to bring back to Shopping List)",
    shoppingCart: "Shopping cart",
    removeItem: "Remove item",
    listLimitWarning:
      "Warning: limit of 10 lists reached. Please remove a list to add a new one.",
    deleteListConfirm:
      'Are you sure you want to permanently delete "{{listName}}"? This action cannot be undone.',
    cancel: "Cancel",
    delete: "Delete",
  },
};

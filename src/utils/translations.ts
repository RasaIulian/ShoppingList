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
    sortTitle: "Sorteaza alfabetic",
    removeAllItems: "Șterge articolele",
    clickToEdit: "Click pentru a edita numele listei",
    toggleLanguage: "Schimbă limba (RO/EN)",
    createNewList: "Crează o nouă listă",
    savedLists: "Liste salvate",
    deletePermanently: "Șterge permanent",
    clickToBringBack: "Click pentru a aduce înapoi în Lista de cumpărături",
    shoppingCart: "Coș de cumpărături",
    removeItem: "Șterge articol",
    listLimitWarning:
      "Avertisment: limită de 10 liste atinsă. Vă rugăm să ștergeți o listă pentru a adăuga una nouă.",
    deleteListConfirm:
      'Sunteți sigur că doriți să ștergeți permanent "{{listName}}"? Această acțiune va fi permanenta.',
    cancel: "Anulare",
    delete: "Șterge",
    itemAlreadyInList: '"{{itemName}}" se află deja pe lista de cumpărături.',
    itemAlreadyInCheckedList:
      '"{{itemName}}" se află deja pe lista cu articole cumparate, click pentru a-l aduce înapoi dacă este necesar.',
    failedToAddItem:
      "Nu s-a putut adăuga articolul. Vă rugăm încercați din nou.",
    offlineError:
      "Se pare că sunteți deconectat. Vă rugăm să verificați conexiunea.",
  },
  en: {
    shoppingList: "Shopping List",
    myLists: "My Lists",
    addNewItem: "add new item",
    checkedItems: "Checked Items ✅",
    sort: "⬇️ Sort",
    sortTitle: "Sort alphabetically",
    removeAllItems: "Remove All Items",
    clickToEdit: "Click to edit list name",
    toggleLanguage: "Toggle language (RO/EN)",
    createNewList: "Create a new list",
    savedLists: "Saved lists",
    deletePermanently: "Delete permanently",
    clickToBringBack: "Click to bring back to Shopping list",
    shoppingCart: "Shopping cart",
    removeItem: "Remove item",
    listLimitWarning:
      "Warning: limit of 10 lists reached. Please remove a list to add a new one.",
    deleteListConfirm:
      'Are you sure you want to permanently delete "{{listName}}"? This action cannot be undone.',
    cancel: "Cancel",
    delete: "Delete",
    itemAlreadyInList: '"{{itemName}}" is already on the shopping list.',
    itemAlreadyInCheckedList:
      '"{{itemName}}" is already on the checked list, click to bring it back if needed.',
    failedToAddItem: "Failed to add item. Please try again.",
    offlineError: "You appear to be offline. Please check your connection.",
  },
};

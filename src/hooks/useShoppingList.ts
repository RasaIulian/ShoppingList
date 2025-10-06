import { useState, useEffect } from "react";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { database } from "../utils/firebase";
import { CategoryType, guessCategory } from "../utils/categoryGuesser";

export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryType;
  sortOrder?: number;
}

/**
 * Custom hook to manage the state and Firebase interactions for a single shopping list.
 * It handles fetching data, adding, removing, checking, and sorting items.
 * @param listId The unique identifier for the shopping list.
 * @returns An object containing the list's state (items, name, etc.) and functions to manipulate it.
 */
export const useShoppingList = (
  listId: string | null,
  onListNotFound?: (listId: string) => void
) => {
  // State for the items that are yet to be purchased
  const [items, setItems] = useState<ShoppingItem[]>([]);
  // State for the items that have been checked off the list
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>([]);
  // State for the name of the shopping list
  const [listName, setListName] = useState<string>("Shopping List");
  // State for handling and displaying errors
  const [error, setError] = useState<string>("");
  // State to indicate if the initial data is being loaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listId) {
      setLoading(false);
      return;
    }

    // Set up Firebase references for the list name, items, and checked items.
    const listNameRef = ref(database, `lists/${listId}/name`);
    const itemsRef = ref(database, `lists/${listId}/items`);
    const checkedItemsRef = ref(database, `lists/${listId}/checkedItems`);

    // Subscribe to real-time updates for the list name.
    const unsubscribeListName = onValue(listNameRef, (snapshot) => {
      const name = snapshot.val();
      if (name) {
        setListName(name);
      } else {
        if (onListNotFound && listId) {
          onListNotFound(listId);
        }
      }
      setLoading(false);
    });

    // Subscribe to real-time updates for the shopping items.
    const unsubscribeItems = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const itemsArray = data
        ? Object.entries(data)
            .map(([id, item]: [string, any]) => ({ id, ...item }))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        : [];
      setItems(itemsArray);
    });

    // Subscribe to real-time updates for the checked items.
    const unsubscribeCheckedItems = onValue(checkedItemsRef, (snapshot) => {
      const data = snapshot.val();
      const checkedArray = data
        ? Object.entries(data)
            .map(([id, item]: [string, any]) => ({ id, ...item }))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        : [];
      setCheckedItems(checkedArray);
    });

    // Cleanup function to unsubscribe from all Firebase listeners when the component unmounts or listId changes.
    return () => {
      unsubscribeListName();
      unsubscribeItems();
      unsubscribeCheckedItems();
    };
  }, [listId, onListNotFound]);

  /**
   * Adds a new item to the shopping list.
   * @param itemName The name of the item to add.
   */
  const addItem = async (itemName: string) => {
    if (!listId) return;
    if (itemName.trim() === "") return;

    const category = guessCategory(itemName);
    const trimmedName = itemName.trim();

    // Check if the item already exists in either the main list or the checked list.
    const existsInItems = items.some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase()
    );
    const existsInChecked = checkedItems.some(
      (item) => item.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existsInItems) {
      setError(`${trimmedName} is already in the list!`);
      return;
    }
    if (existsInChecked) {
      setError(`${trimmedName} already in checked list ->`);
      return;
    }

    // Push the new item to the Firebase database.
    const itemsRef = ref(database, `lists/${listId}/items`);
    const newItemRef = push(itemsRef);
    await set(newItemRef, {
      name: trimmedName,
      category: category,
      sortOrder: items.length,
    });
    setError("");
  };

  /**
   * Updates the name of the shopping list.
   * @param newName The new name for the list.
   */
  const updateListName = async (newName: string) => {
    if (!listId || newName.trim() === "") return;
    const listNameRef = ref(database, `lists/${listId}/name`);
    await set(listNameRef, newName.trim());
  };

  /**
   * Removes an item from the main shopping list.
   * @param itemId The ID of the item to remove.
   */
  const removeItem = async (itemId: string) => {
    if (!listId) return;
    await remove(ref(database, `lists/${listId}/items/${itemId}`));
  };

  /**
   * Removes an item from the checked items list.
   * @param itemId The ID of the item to remove.
   */
  const removeCheckedItem = async (itemId: string) => {
    if (!listId) return;
    await remove(ref(database, `lists/${listId}/checkedItems/${itemId}`));
  };

  /**
   * Moves an item from the main list to the checked list.
   * @param itemToCheck The shopping item to check off.
   */
  const checkItem = async (itemToCheck: ShoppingItem) => {
    if (!listId) return;
    await remove(ref(database, `lists/${listId}/items/${itemToCheck.id}`));
    await set(ref(database, `lists/${listId}/checkedItems/${itemToCheck.id}`), {
      name: itemToCheck.name,
      category: itemToCheck.category,
      sortOrder: checkedItems.length,
    });
  };

  /**
   * Moves an item from the checked list back to the main list.
   * @param itemToUncheck The shopping item to uncheck.
   */
  const uncheckItem = async (itemToUncheck: ShoppingItem) => {
    if (!listId) return;
    await remove(
      ref(database, `lists/${listId}/checkedItems/${itemToUncheck.id}`)
    );
    await set(ref(database, `lists/${listId}/items/${itemToUncheck.id}`), {
      name: itemToUncheck.name,
      category: itemToUncheck.category,
      sortOrder: items.length,
    });
  };

  /**
   * Removes all items from the main shopping list.
   */
  const removeAllItems = async () => {
    if (!listId) return;
    await remove(ref(database, `lists/${listId}/items`));
  };

  /**
   * Removes all items from the checked items list.
   */
  const removeAllCheckedItems = async () => {
    if (!listId) return;
    await remove(ref(database, `lists/${listId}/checkedItems`));
  };

  /**
   * Sorts the main shopping list items alphabetically by name and updates their sort order in Firebase.
   */
  const sortItemsAlphabetically = async () => {
    if (!listId) return;
    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
    const updates: { [key: string]: any } = {};
    sorted.forEach((item, index) => {
      updates[`${item.id}/sortOrder`] = index;
    });
    await update(ref(database, `lists/${listId}/items`), updates);
  };

  /**
   * Sorts the checked items list alphabetically by name and updates their sort order in Firebase.
   */
  const sortCheckedItemsAlphabetically = async () => {
    if (!listId) return;
    const sorted = [...checkedItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const updates: { [key: string]: any } = {};
    sorted.forEach((item, index) => {
      updates[`${item.id}/sortOrder`] = index;
    });
    await update(ref(database, `lists/${listId}/checkedItems`), updates);
  };

  // Expose the state and handler functions to the component.
  return {
    items,
    checkedItems,
    listName,
    error,
    loading,
    addItem,
    updateListName,
    removeItem,
    removeCheckedItem,
    checkItem,
    uncheckItem,
    removeAllItems,
    removeAllCheckedItems,
    sortItemsAlphabetically,
    sortCheckedItemsAlphabetically,
  };
};

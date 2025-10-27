import { useState, useEffect, useCallback } from "react";
import { ref, onValue, set, remove, update, get } from "firebase/database";
import { database } from "../utils/firebase";
import { CategoryType } from "../utils/categories";

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
  // If error handling is planned for future use but not implemented yet:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>("");
  // State to indicate if the initial data is being loaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset state when listId changes
    setItems([]);
    setCheckedItems([]);
    setListName("Shopping List");
    setLoading(true);

    if (!listId) {
      setLoading(false);
      return;
    }

    const listRef = ref(database, `lists/${listId}`);

    // Perform an initial fetch to ensure all data is loaded before hiding the loader.
    get(listRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setListName(data.name || "Shopping List");

        const itemsArray = data.items
          ? Object.entries(data.items)
              .map(([id, item]: [string, any]) => ({ id, ...item }))
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          : [];
        setItems(itemsArray);

        const checkedArray = data.checkedItems
          ? Object.entries(data.checkedItems)
              .map(([id, item]: [string, any]) => ({ id, ...item }))
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          : [];
        setCheckedItems(checkedArray);
      } else {
        // If the list doesn't exist, call the handler.
        if (onListNotFound) {
          onListNotFound(listId);
        }
      }
      // All initial data is processed, set loading to false.
      setLoading(false);
    });

    // Now, set up real-time listeners for subsequent updates.
    const unsubscribeListName = onValue(
      ref(database, `lists/${listId}/name`),
      (snapshot) => {
        setListName(snapshot.val() || "Shopping List");
      }
    );

    const unsubscribeItems = onValue(
      ref(database, `lists/${listId}/items`),
      (snapshot) => {
        const data = snapshot.val() || {};
        const itemsArray = Object.entries(data)
          .map(([id, item]: [string, any]) => ({ id, ...item }))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setItems(itemsArray);
      }
    );

    const unsubscribeCheckedItems = onValue(
      ref(database, `lists/${listId}/checkedItems`),
      (snapshot) => {
        const data = snapshot.val() || {};
        const checkedArray = Object.entries(data)
          .map(([id, item]: [string, any]) => ({ id, ...item }))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setCheckedItems(checkedArray);
      }
    );

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
  const addItem = useCallback(
    async (itemName: string, category: CategoryType) => {
      if (!listId) return;
      try {
        const newItem: ShoppingItem = {
          id: Date.now().toString(),
          name: itemName,
          category: category,
        };
        const itemRef = ref(database, `lists/${listId}/items/${newItem.id}`);
        await set(itemRef, newItem);
        setError(""); // Clear any previous errors
      } catch (err) {
        setError(
          `Failed to add item: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    },
    [listId]
  );

  /**
   * Updates the name of the shopping list.
   * @param newName The new name for the list.
   */
  const updateListName = async (newName: string) => {
    if (!listId || newName.trim() === "") return;
    try {
      const listNameRef = ref(database, `lists/${listId}/name`);
      await set(listNameRef, newName.trim());
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(
        `Failed to update list name: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  /**
   * Removes an item from the main shopping list.
   * @param itemId The ID of the item to remove.
   */
  const removeItem = async (itemId: string) => {
    if (!listId) return;
    try {
      await remove(ref(database, `lists/${listId}/items/${itemId}`));
      setError("");
    } catch (err) {
      setError(
        `Failed to remove item: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
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
    error, // Keep error in the return object for components to display
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

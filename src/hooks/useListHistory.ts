import { useState, useEffect, useCallback, useRef } from "react";
import { ref, get } from "firebase/database";
import { database } from "../utils/firebase";
import { Language } from "./useLanguage";
import { UI_STRINGS } from "../utils/translations";

export interface ListHistoryItem {
  id: string;
  name: string;
}

/**
 * Custom hook to manage the history of shopping lists in localStorage.
 * @param language The current language for error messages
 * @returns An object containing the list history and functions to manipulate it.
 */
export const useListHistory = (language: Language) => {
  // Load synchronously from localStorage on initial render
  const [listHistory, setListHistory] = useState<ListHistoryItem[]>(() => {
    const historyString = localStorage.getItem("listHistory");
    if (!historyString) return [];

    // Parse and clean up any old items that might have extra properties
    const parsed = JSON.parse(historyString);
    return Array.isArray(parsed)
      ? parsed.map((item: any) => ({ id: item.id, name: item.name }))
      : [];
  });
  const [historyError, setHistoryError] = useState<string | null>(null);
  const hasValidatedRef = useRef(false);

  // Load and validate list history from localStorage on initial mount only.
  useEffect(() => {
    if (hasValidatedRef.current) {
      return;
    }

    const loadAndValidateHistory = async () => {
      const historyString = localStorage.getItem("listHistory");
      const storedHistory = Array.isArray(
        historyString ? JSON.parse(historyString) : [],
      )
        ? JSON.parse(historyString || "[]")
        : [];

      const validatedHistory: ListHistoryItem[] = [];
      let hasChanged = false;

      for (const item of storedHistory) {
        const listRef = ref(database, `lists/${item.id}/name`);
        const snapshot = await get(listRef);
        if (snapshot.exists()) {
          const firebaseName = snapshot.val();
          if (item.name !== firebaseName) {
            hasChanged = true;
          }
          // Ensure we only store id and name, cleaning up any extra properties
          validatedHistory.push({ id: item.id, name: firebaseName });
        } else {
          hasChanged = true; // An item was removed
        }
      }
      // Check for any extra properties in stored items that need cleanup
      const needsCleanup = storedHistory.some(
        (item: any) =>
          Object.keys(item).length > 2 || !("id" in item) || !("name" in item),
      );

      if (
        hasChanged ||
        validatedHistory.length !== storedHistory.length ||
        needsCleanup
      ) {
        setListHistory(validatedHistory);
        localStorage.setItem("listHistory", JSON.stringify(validatedHistory));
      }
    };

    hasValidatedRef.current = true;
    loadAndValidateHistory();
  }, []);

  const addListToHistory = useCallback(
    (listId: string, listName: string): boolean => {
      setHistoryError(null);
      // Add only if the list is not already in the history.
      if (!listHistory.some((item) => item.id === listId)) {
        if (listHistory.length >= 10) {
          setHistoryError(UI_STRINGS[language].listLimitWarning);
          return false;
        }
        const newHistory = [
          { id: listId, name: listName },
          ...listHistory,
        ].slice(0, 10);
        localStorage.setItem("listHistory", JSON.stringify(newHistory));
        setListHistory(newHistory);
      }
      return true;
    },
    [language, listHistory],
  );

  /**
   * Updates the name of an existing list in the history.
   * @param listId The ID of the list to update.
   * @param listName The new name for the list.
   */
  const updateListHistoryName = useCallback(
    (listId: string, listName: string) => {
      const historyString = localStorage.getItem("listHistory");
      let history: ListHistoryItem[] = historyString
        ? JSON.parse(historyString)
        : [];
      const itemIndex = history.findIndex((item) => item.id === listId);
      if (itemIndex > -1) {
        history[itemIndex].name = listName;
        // Ensure clean objects with only id and name
        history = history.map((item) => ({ id: item.id, name: item.name }));
        localStorage.setItem("listHistory", JSON.stringify(history));
        // Update state to trigger re-render in components using the hook.
        setListHistory([...history]);
      }
    },
    [],
  );

  /**
   * Removes a list from the history.
   * @param listId The ID of the list to remove.
   * @returns The updated history array.
   */
  const removeFromListHistory = useCallback(
    (listId: string) => {
      const updatedHistory = listHistory.filter((item) => item.id !== listId);
      localStorage.setItem("listHistory", JSON.stringify(updatedHistory));
      setListHistory(updatedHistory);
      return updatedHistory;
    },
    [listHistory],
  );

  // Expose state and management functions.
  return {
    historyError,
    listHistory,
    addListToHistory,
    updateListHistoryName,
    removeFromListHistory,
  };
};

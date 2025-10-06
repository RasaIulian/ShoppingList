import { useState, useEffect, useCallback } from "react";
import { ref, get } from "firebase/database";
import { database } from "../utils/firebase";

export interface ListHistoryItem {
  id: string;
  name: string;
}

/**
 * Custom hook to manage the history of shopping lists in localStorage.
 * @returns An object containing the list history and functions to manipulate it.
 */
export const useListHistory = () => {
  const [listHistory, setListHistory] = useState<ListHistoryItem[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Load and validate list history from localStorage on initial mount.
  useEffect(() => {
    const loadAndValidateHistory = async () => {
      const historyString = localStorage.getItem("listHistory");
      if (historyString) {
        const storedHistory: ListHistoryItem[] = JSON.parse(historyString);
        const validatedHistory: ListHistoryItem[] = [];

        for (const item of storedHistory) {
          const listRef = ref(database, `lists/${item.id}/name`);
          const snapshot = await get(listRef);
          if (snapshot.exists()) {
            validatedHistory.push(item);
          }
        }

        setListHistory(validatedHistory);
        localStorage.setItem("listHistory", JSON.stringify(validatedHistory));
      }
    };

    loadAndValidateHistory();
  }, []);

  const addListToHistory = useCallback(
    (listId: string, listName: string): boolean => {
      setHistoryError(null);
      // Add only if the list is not already in the history.
      if (!listHistory.some((item) => item.id === listId)) {
        if (listHistory.length >= 10) {
          setHistoryError(
            "Warning: limit of 10 lists reached. Please remove a list to add a new one."
          );
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
    [listHistory]
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
        localStorage.setItem("listHistory", JSON.stringify(history));
        // Update state to trigger re-render in components using the hook.
        setListHistory([...history]);
      }
    },
    []
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
    [listHistory]
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

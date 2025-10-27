import { useState, useEffect } from "react";

/**
 * A custom hook to manage the shopping list ID.
 * It retrieves the ID from the URL, falls back to localStorage,
 * or generates a new one if none exists.
 * It also ensures the URL is always in sync with the current list ID.
 */
export const useListId = (): string | null => {
  const [listId, setListId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("list");

    if (id) {
      // If ID is in the URL, use it and store it in localStorage.
      localStorage.setItem("currentListId", id);
    } else {
      // If not in URL, try to get it from localStorage.
      id = localStorage.getItem("currentListId");
      if (!id) {
        // If it doesn't exist anywhere, generate a new one.
        id = `list_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem("currentListId", id);
      }
      // Update the URL to reflect the active list ID without reloading the page.
      window.history.replaceState({}, "", `?list=${id}`);
    }
    setListId(id);
  }, []);

  return listId;
};

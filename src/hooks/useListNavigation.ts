/**
 * List Navigation Hook
 * Handles navigation between different shopping lists
 * Supports both regular navigation and full page reload for creating new lists
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useListNavigation Hook
 * Provides navigation functionality for switching between lists
 * - Regular navigation: Updates URL without full page reload
 * - Force reload: Performs full page reload (used when creating new lists)
 * @returns Object with navigateToList function
 */
export const useListNavigation = () => {
  const navigate = useNavigate();

  const navigateToList = useCallback(
    (newListId: string | null, forceReload = false) => {
      const newUrl = newListId ? `?list=${newListId}` : "/";
      if (forceReload) {
        window.location.href = newUrl;
      } else {
        navigate(newUrl, { replace: true });
      }
    },
    [navigate],
  );

  return { navigateToList };
};

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
    [navigate]
  );

  return { navigateToList };
};

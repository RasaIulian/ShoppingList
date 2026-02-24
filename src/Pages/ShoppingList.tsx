import React, { useState, useEffect, useCallback, useRef } from "react";
import { database } from "../utils/firebase";
import { ref, set, remove, onDisconnect } from "firebase/database";
import {
  Container,
  ListsContainer,
  LoadingIndicator,
} from "./ShoppingList.style";
import { useShoppingList, ShoppingItem } from "../hooks/useShoppingList";
import { useListHistory } from "../hooks/useListHistory";
import { useListId } from "../hooks/useListId";
import { useLanguage } from "../hooks/useLanguage";
import { UI_STRINGS } from "../utils/translations";
import {
  categoryDisplay,
  CategoryType as CategoryKey,
  convertCategoryLanguage,
} from "../utils/categories";
import { getCategoryFromFirebase } from "../utils/firebaseCategoryGuesser";
import { ListHeader } from "../components/ListHeader";
import { ItemsList } from "../components/ItemsList";
import { CheckedItems } from "../components/CheckedItems";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { useListNavigation } from "../hooks/useListNavigation";

const ShoppingList: React.FC = () => {
  const { language } = useLanguage();
  const databaseRef = useRef<any>(null);
  const hasInitializedRef = useRef(false); // Add this ref to track initialization
  const listId = useListId();
  const [inputValue, setInputValue] = useState("");
  const [itemError, setItemError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const {
    listHistory,
    addListToHistory,
    updateListHistoryName,
    removeFromListHistory,
    historyError,
  } = useListHistory(language);
  const { navigateToList } = useListNavigation();

  // Setup database connection and cleanup
  useEffect(() => {
    if (listId) {
      databaseRef.current = ref(database, `lists/${listId}`);

      // Setup disconnect handling
      const disconnectRef = onDisconnect(databaseRef.current);

      // Cleanup function when listId exists
      return () => {
        if (databaseRef.current) {
          // Cancel any pending onDisconnect operations
          disconnectRef.cancel();
        }
      };
    }
    // Return empty cleanup function when no listId
    return () => {};
  }, [listId]);

  const handleNewList = useCallback(async () => {
    // Generate a new list ID but don't navigate immediately
    const newListId = `list_${Date.now()}_${Math.random()
      .toString(36) // e.g., "0.fcv0jotv1j"
      .slice(2, 11)}`; // -> "fcv0jotv1"

    // Find a unique name for the new list
    let newListName = UI_STRINGS[language].shoppingList;
    let counter = 2;
    const existingNames = new Set(listHistory.map((item) => item.name));

    while (existingNames.has(newListName)) {
      newListName = `${UI_STRINGS[language].shoppingList} ${counter}`;
      counter++;
    }

    // Try to add to history first to respect the limit
    const wasAdded = addListToHistory(newListId, newListName);

    if (wasAdded) {
      try {
        const newListRef = ref(database, `lists/${newListId}`);
        await set(newListRef, {
          name: newListName,
          language: "en",
          items: {},
          checkedItems: {},
        });
        navigateToList(newListId, true); // Force reload for new list
      } catch (error) {
        console.error("Failed to create new list:", error);
        // Handle offline state
        if (!navigator.onLine) {
          setItemError(
            UI_STRINGS[language].offlineError,
          );
        }
      }
    }
  }, [addListToHistory, language, listHistory, navigateToList]);

  // Initialize with a single list on first mount only
  useEffect(() => {
    if (!hasInitializedRef.current && !listId && listHistory.length === 0) {
      hasInitializedRef.current = true;
      handleNewList();
    }
  }, [listId, listHistory.length, handleNewList]);

  const handleListNotFound = useCallback(
    (notFoundListId: string) => {
      const remainingHistory = removeFromListHistory(notFoundListId);

      // If we are on the page of the deleted list, navigate away.
      if (listId === notFoundListId) {
        if (remainingHistory.length > 0) {
          navigateToList(remainingHistory[0].id);
        } else {
          handleNewList(); // Or create a new one if no history is left
        }
      }
    },
    [listId, removeFromListHistory, handleNewList, navigateToList],
  );

  const {
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
  } = useShoppingList(listId, handleListNotFound);

  // Add new list to history or update its name when listName changes
  useEffect(() => {
    if (listId && listName) {
      addListToHistory(listId, listName);
    }
  }, [listId, listName, addListToHistory]);

  const handleUpdateListNameWithHistory = async (newName: string) => {
    await updateListName(newName);
    if (listId) {
      updateListHistoryName(listId, newName);
    }
  };

  const handleAddItem = async () => {
    if (inputValue.trim() !== "") {
      const trimmedItemName = inputValue.trim();
      const lowerCaseItemName = trimmedItemName.toLowerCase();
      const isInShoppingList = items.some(
        (item) => item.name.toLowerCase() === lowerCaseItemName,
      );
      const isInCheckedList = checkedItems.some(
        (item) => item.name.toLowerCase() === lowerCaseItemName,
      );

      if (isInShoppingList) {
        setItemError(
          UI_STRINGS[language].itemAlreadyInList.replace("{{itemName}}", trimmedItemName),
        );
        setTimeout(() => setItemError(null), 5000);
        setInputValue("");
        return;
      }
      if (isInCheckedList) {
        setItemError(
          UI_STRINGS[language].itemAlreadyInCheckedList.replace("{{itemName}}", trimmedItemName),
        );
        setTimeout(() => setItemError(null), 5000);
        setInputValue("");
        return;
      }

      try {
        setItemError(null); // Clear previous errors
        const category = await getCategoryFromFirebase(
          trimmedItemName,
          language,
        );
        // Normalize category to Romanian (base language) before storing in Firebase
        // This ensures the same item always has the same category regardless of which language was used
        const normalizedCategory =
          convertCategoryLanguage(category, "ro") || category;
        await addItem(trimmedItemName, normalizedCategory);
        setInputValue("");
      } catch (err) {
        setItemError(UI_STRINGS[language].failedToAddItem);
        setTimeout(() => setItemError(null), 5000);
        setInputValue("");
      }
    }
  };

  const groupedItems = items.reduce(
    (acc, item) => {
      const category = item.category || "Other"; // Fallback for items without a category
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<CategoryKey, ShoppingItem[]>,
  );

  const handleOpenConfirmModal = (
    e: React.MouseEvent<HTMLButtonElement>,
    listIdToRemove: string,
    listNameToRemove: string,
  ) => {
    e.stopPropagation(); // Prevent the dropdown from closing
    e.preventDefault();
    setIsConfirmModalOpen(true);
    setListToDelete({ id: listIdToRemove, name: listNameToRemove });
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;

    try {
      await remove(ref(database, `lists/${listToDelete.id}`));
      const remainingHistory = removeFromListHistory(listToDelete.id);

      if (listId === listToDelete.id) {
        const nextListId =
          remainingHistory.length > 0 ? remainingHistory[0].id : null;
        navigateToList(nextListId, true); // Force reload after deletion
      }
    } catch (error) {
      console.error("Failed to delete list:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsConfirmModalOpen(false);
      setListToDelete(null);
    }
  };

  // Find the current list's name from history for a better loading message.
  const currentListNameFromHistory = listHistory.find(
    (item) => item.id === listId,
  )?.name;

  if (loading) {
    return (
      <Container>
        <LoadingIndicator>
          Loading {currentListNameFromHistory || "your list"}...
        </LoadingIndicator>
      </Container>
    );
  }

  return (
    <Container>
      <ListHeader
        listName={listName}
        listId={listId}
        listHistory={listHistory}
        historyError={historyError}
        onUpdateListName={handleUpdateListNameWithHistory}
        onNewList={handleNewList}
        onDeleteList={handleOpenConfirmModal}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        listToDelete={listToDelete}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <ListsContainer>
        <ItemsList
          items={items}
          groupedItems={groupedItems}
          categoryDisplay={categoryDisplay}
          inputValue={inputValue}
          itemError={itemError || error}
          onInputChange={setInputValue}
          onAddItem={handleAddItem}
          onCheckItem={checkItem}
          onRemoveItem={removeItem}
          onSort={sortItemsAlphabetically}
          onRemoveAll={removeAllItems}
        />
        <CheckedItems
          items={checkedItems}
          onUncheckItem={uncheckItem}
          onRemoveItem={removeCheckedItem}
          onSort={sortCheckedItemsAlphabetically}
          onRemoveAll={removeAllCheckedItems}
        />
      </ListsContainer>
    </Container>
  );
};

export default ShoppingList;

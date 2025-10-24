import React, { useState, useEffect, useCallback } from "react";
import { database } from "../utils/firebase";
import { ref, set, remove } from "firebase/database";
import {
  Container,
  ListsContainer,
  LoadingIndicator,
} from "./ShoppingList.style";
import { useShoppingList, ShoppingItem } from "../hooks/useShoppingList";
import { useListHistory } from "../hooks/useListHistory";
import { categoryDisplay, CategoryType as CategoryKey } from "../utils/categories";
import { getCategoryFromFirebase } from "../utils/firebaseCategoryGuesser";
import { ListHeader } from "../components/ListHeader";
import { ItemsList } from "../components/ItemsList";
import { CheckedItems } from "../components/CheckedItems";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";

// Get or create list ID
const getListId = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  let listId = urlParams.get("list");

  if (!listId) {
    // Check localStorage for existing list
    listId = localStorage.getItem("currentListId");

    if (!listId) {
      // Generate new list ID
      listId = `list_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem("currentListId", listId);
    }

    // Update URL without reload
    window.history.replaceState({}, "", `?list=${listId}`);
  } else {
    // Store the list ID from URL
    localStorage.setItem("currentListId", listId);
  }

  return listId;
};

const ShoppingList: React.FC = () => {
  const [listId, setListId] = useState<string | null>(null);
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
  } = useListHistory();

  const handleNewList = useCallback(async () => {
    // Generate a new list ID but don't navigate immediately
    const newListId = `list_${Date.now()}_${Math.random()
      .toString(36) // e.g., "0.fcv0jotv1j"
      .slice(2, 11)}`; // -> "fcv0jotv1"

    // Find a unique name for the new list
    let newListName = "Shopping List";
    let counter = 2;
    const existingNames = new Set(listHistory.map((item) => item.name));

    while (existingNames.has(newListName)) {
      newListName = `Shopping List ${counter}`;
      counter++;
    }

    // Try to add to history first to respect the limit
    const wasAdded = addListToHistory(newListId, newListName);

    if (wasAdded) {
      // Set default name for the new list in the database immediately
      const newListRef = ref(database, `lists/${newListId}/name`);
      await set(newListRef, newListName);
      window.location.href = `?list=${newListId}`;
    }
  }, [addListToHistory, listHistory]);

  useEffect(() => {
    setListId(getListId());
  }, []);

  const handleListNotFound = useCallback(
    (notFoundListId: string) => {
      const remainingHistory = removeFromListHistory(notFoundListId);

      // If we are on the page of the deleted list, navigate away.
      if (listId === notFoundListId) {
        if (remainingHistory.length > 0) {
          window.location.href = `?list=${remainingHistory[0].id}`;
        } else {
          handleNewList(); // Or create a new one if no history is left
        }
      }
    },
    [listId, removeFromListHistory, handleNewList]
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
        (item) => item.name.toLowerCase() === lowerCaseItemName
      );
      const isInCheckedList = checkedItems.some(
        (item) => item.name.toLowerCase() === lowerCaseItemName
      );

      if (isInShoppingList) {
        setItemError(`Please add a different product, "${trimmedItemName}" is already on the shopping list.`);
        setTimeout(() => setItemError(null), 3000);
        setInputValue("");
        return;
      }
         if (isInCheckedList) {
        setItemError(`Please click on the product, "${trimmedItemName}" is already on the checked list.`);
        setTimeout(() => setItemError(null), 3000);
        setInputValue("");
        return;
      }

      try {
        setItemError(null); // Clear previous errors
        const category = await getCategoryFromFirebase(trimmedItemName);
        await addItem(trimmedItemName, category);
        setInputValue("");
      } catch (err) {
          setItemError("Failed to add item. Please try again.");
          setTimeout(() => setItemError(null), 3000);
          setInputValue("");
      }
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "Other"; // Fallback for items without a category
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<CategoryKey, ShoppingItem[]>);

  const handleOpenConfirmModal = (
    e: React.MouseEvent<HTMLButtonElement>,
    listIdToRemove: string,
    listNameToRemove: string
  ) => {
    e.stopPropagation(); // Prevent the dropdown from closing
    e.preventDefault();
    setIsConfirmModalOpen(true);
    setListToDelete({ id: listIdToRemove, name: listNameToRemove });
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;

    try {
      // 1. Remove from Firebase
      await remove(ref(database, `lists/${listToDelete.id}`));

      // 2. Update local history state
      const remainingHistory = removeFromListHistory(listToDelete.id);

      // 3. If we deleted the list we are on, navigate away
      if (listId === listToDelete.id) {
        const nextListId =
          remainingHistory.length > 0 ? remainingHistory[0].id : null;
        window.location.href = nextListId
          ? `?list=${nextListId}`
          : window.location.pathname;
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
  const currentListNameFromHistory = listHistory.find(item => item.id === listId)?.name;

  if (loading) {
    return (
      <Container>
        <LoadingIndicator>Loading {currentListNameFromHistory || "your list"}...</LoadingIndicator>
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

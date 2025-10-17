import React, { useState, useEffect, useRef, useCallback } from "react";
import { database } from "../utils/firebase";
import { ref, set, remove } from "firebase/database";

import {
  Container,
  Title,
  Input,
  ErrorMessage,
  ListsContainer,
  List,
  ListItem,
  Label,
  CheckboxInput,
  CheckedItemsContainer,
  CheckedItemsTitle,
  CheckedItemsList,
  CategoryContainer,
  CheckedItem,
  CheckedItemName,
  Message,
  RemoveAllButton,
  SortButton,
  Category,
  TitleEditContainer,
  TitleInput,
  TitleDisplay,
  NewListButton,
  HistoryButton,
  HistoryContainer,
  HistoryDropdown,
  HistoryList,
  HistoryListItem,
  HeaderActionsContainer,
  RemoveHistoryButton,
  ModalOverlay,
  ModalContent,
  ModalMessage,
  ModalActions,
  ModalButton,
} from "./ShoppingList.style";
import { useShoppingList, ShoppingItem } from "../hooks/useShoppingList";
import { useListHistory, ListHistoryItem } from "../hooks/useListHistory";
import {
  categories,
  categoryDisplay,
  CategoryType,
} from "../utils/categoryGuesser";

// Get or create list ID
const getListId = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  let listId = urlParams.get("list");

  if (!listId) {
    // Check localStorage for existing list
    listId = localStorage.getItem("currentListId");

    if (!listId) {
      // Generate new list ID
      listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempListName, setTempListName] = useState("");
  const [listNameError, setListNameError] = useState<string | null>(null);
  const editContainerRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
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
      .toString(36)
      .substr(2, 9)}`;

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

  // Handle clicks outside history dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyContainerRef.current &&
        !historyContainerRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleUpdateListName = useCallback(
    async (nameToUpdate: string) => {
      setListNameError(null);
      const newName = nameToUpdate.trim();

      if (newName === "") {
        setListNameError("List name cannot be empty.");
        return;
      }

      const isNameTaken = listHistory.some(
        (item) =>
          item.id !== listId &&
          item.name.toLowerCase() === newName.toLowerCase()
      );

      if (isNameTaken) {
        const errorMsg = `Sorry, a list named "${newName}" already exists.`;
        setListNameError(errorMsg);
        setTempListName(listName); // Revert the input to the original name
        // Show error and stay in editing mode for the user to correct it.
        setTimeout(() => setListNameError(null), 3000);
        return;
      }

      await updateListName(newName);
      if (listId) {
        updateListHistoryName(listId, newName);
      }
      setIsEditingName(false);
    },
    [updateListName, listId, updateListHistoryName, listHistory, listName]
  );

  // Effect to handle clicks outside the editing container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditingName &&
        editContainerRef.current &&
        !editContainerRef.current.contains(event.target as Node)
      ) {
        handleUpdateListName(tempListName);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingName, tempListName, handleUpdateListName]);

  const handleStartEditingName = () => {
    setTempListName(listName);
    setIsEditingName(true);
  };

  const handleCancelEditingName = () => {
    setIsEditingName(false);
    setListNameError(null);
    setTempListName("");
  };

  const handleAddItem = async () => {
    if (inputValue.trim() !== "") {
      await addItem(inputValue);
      setInputValue("");
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<CategoryType, ShoppingItem[]>);

  const handleOpenConfirmModal = (
    e: React.MouseEvent<HTMLButtonElement>,
    listIdToRemove: string,
    listNameToRemove: string
  ) => {
    e.stopPropagation(); // Prevent the dropdown from closing
    e.preventDefault();
    setListToDelete({ id: listIdToRemove, name: listNameToRemove });
    setIsConfirmModalOpen(true);
    setShowHistory(false); // Close dropdown
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

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Title>
        {isEditingName ? (
          <TitleEditContainer ref={editContainerRef}>
            <TitleInput
              type="text"
              name="listNameInput"
              value={tempListName}
              onChange={(e) => setTempListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateListName(tempListName);
                } else if (e.key === "Escape") {
                  handleCancelEditingName();
                }
              }}
              autoFocus
            />
            {listNameError && <ErrorMessage>{listNameError}</ErrorMessage>}
          </TitleEditContainer>
        ) : (
          <TitleDisplay
            onClick={handleStartEditingName}
            title="Click to edit list name"
          >
            {listName}{" "}
            <span role="img" aria-label="Shopping cart">
              🛒
            </span>
          </TitleDisplay>
        )}
        <HeaderActionsContainer>
          <NewListButton onClick={handleNewList} title="Create a new list">
            +
          </NewListButton>
          {listHistory.length > 1 && (
            <HistoryContainer ref={historyContainerRef}>
              <HistoryButton
                title="Saved lists"
                onClick={() => setShowHistory(!showHistory)}
              >
                My lists
              </HistoryButton>
              {showHistory && (
                <HistoryDropdown>
                  <HistoryList>
                    {listHistory.map((item: ListHistoryItem) => (
                      <HistoryListItem key={item.id}>
                        <a href={`?list=${item.id}`} title={item.name}>
                          {item.name}
                        </a>
                        <RemoveHistoryButton
                          onClick={(e) =>
                            handleOpenConfirmModal(e, item.id, item.name)
                          }
                          title={`Delete "${item.name}" permanently`}
                        >
                          &times;
                        </RemoveHistoryButton>
                      </HistoryListItem>
                    ))}
                  </HistoryList>
                </HistoryDropdown>
              )}
            </HistoryContainer>
          )}
        </HeaderActionsContainer>
        {historyError && <ErrorMessage>{historyError}</ErrorMessage>}
      </Title>

      {isConfirmModalOpen && listToDelete && (
        <ModalOverlay>
          <ModalContent>
            <ModalMessage>
              Are you sure you want to permanently delete the list "
              <strong>{listToDelete.name}</strong>"? This action cannot be
              undone.
            </ModalMessage>
            <ModalActions>
              <ModalButton onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </ModalButton>
              <ModalButton color="danger" onClick={handleConfirmDelete}>
                Delete
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      <ListsContainer>
        <List>
          <Input
            type="text"
            name="textInput"
            value={inputValue}
            placeholder="add new item"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddItem();
              }
            }}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {items.length > 4 && (
            <SortButton onClick={sortItemsAlphabetically}>
              <span role="img" aria-label="right arrow">
                ⬇️
              </span>{" "}
              Sort
            </SortButton>
          )}
          {(Object.entries(groupedItems) as [CategoryType, ShoppingItem[]][])
            .sort(
              // Sorting categories based on predefined order
              ([catA], [catB]) =>
                categories.indexOf(catA) - categories.indexOf(catB)
            )
            .map(([category, itemsInCategory]) => (
              <CategoryContainer key={category}>
                <Category>
                  {categoryDisplay[category as CategoryType]?.emoji || "🛒"}{" "}
                  {categoryDisplay[category as CategoryType]?.name ||
                    category.charAt(0).toUpperCase() + category.slice(1)}
                </Category>
                {itemsInCategory.map((item: ShoppingItem) => (
                  <ListItem key={item.id}>
                    <Label>
                      <CheckboxInput
                        type="checkbox"
                        name="checkbox"
                        onChange={() => checkItem(item)}
                      />
                      {item.name}
                    </Label>
                    <button
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      X
                    </button>
                  </ListItem>
                ))}
              </CategoryContainer>
            ))}
          {items.length > 4 && (
            <RemoveAllButton onClick={removeAllItems}>
              Remove All Items
            </RemoveAllButton>
          )}
        </List>

        <CheckedItemsContainer>
          <CheckedItemsList>
            <CheckedItemsTitle>
              Checked Items&nbsp;
              <span role="img" aria-label="checked arrow">
                ✅
              </span>
            </CheckedItemsTitle>
            {checkedItems.length > 0 && (
              <Message>
                {"("}Click to bring back to Shopping&nbsp;List{")"}
              </Message>
            )}
            {checkedItems.length > 4 && (
              <SortButton onClick={sortCheckedItemsAlphabetically}>
                <span role="img" aria-label="down arrow">
                  ⬇️
                </span>{" "}
                Sort
              </SortButton>
            )}
            {checkedItems.map((item: ShoppingItem) => (
              <CheckedItem key={item.id} onClick={() => uncheckItem(item)}>
                <CheckedItemName>{item.name}</CheckedItemName>{" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCheckedItem(item.id);
                  }}
                  title="Remove item"
                >
                  X
                </button>
              </CheckedItem>
            ))}
            {checkedItems.length > 4 && (
              <RemoveAllButton onClick={removeAllCheckedItems}>
                Remove All Items
              </RemoveAllButton>
            )}
          </CheckedItemsList>
        </CheckedItemsContainer>
      </ListsContainer>
    </Container>
  );
};

export default ShoppingList;

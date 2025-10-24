import React, { useState, useRef, useEffect, useCallback } from "react";
import { ListHistoryItem } from "../hooks/useListHistory";
import {
  Title,
  TitleEditContainer,
  TitleInput,
  ErrorMessage,
  TitleDisplay,
  HeaderActionsContainer,
  NewListButton,
} from "../Pages/ShoppingList.style";
import { ListHistory } from "./ListHistory";

interface ListHeaderProps {
  listName: string;
  listId: string | null;
  listHistory: ListHistoryItem[];
  historyError: string | null;
  onUpdateListName: (newName: string) => Promise<void>;
  onNewList: () => void;
  onDeleteList: (e: React.MouseEvent<HTMLButtonElement>, listId: string, listName: string) => void;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  listName,
  listId,
  listHistory,
  historyError,
  onUpdateListName,
  onNewList,
  onDeleteList,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempListName, setTempListName] = useState("");
  const [listNameError, setListNameError] = useState<string | null>(null);
  const editContainerRef = useRef<HTMLDivElement>(null);

  const handleUpdateListName = useCallback(async (nameToUpdate: string) => {
    setListNameError(null);
    const newName = nameToUpdate.trim();

    if (newName === "") {
      setListNameError("List name cannot be empty.");
      return;
    }

    const isNameTaken = listHistory.some(
      (item) => item.id !== listId && item.name.toLowerCase() === newName.toLowerCase()
    );

    if (isNameTaken) {
      setListNameError(`Sorry, a list named "${newName}" already exists.`);
      setTempListName(listName);
      setTimeout(() => setListNameError(null), 3000);
      return;
    }

    await onUpdateListName(newName);
    setIsEditingName(false);
  }, [onUpdateListName, listId, listHistory, listName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditingName && editContainerRef.current && !editContainerRef.current.contains(event.target as Node)) {
        handleUpdateListName(tempListName);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingName, tempListName, handleUpdateListName]);

  return (
    <Title>
      {isEditingName ? (
        <TitleEditContainer ref={editContainerRef}>
          <TitleInput
            type="text"
            name="titleInput"
            value={tempListName}
            onChange={(e) => setTempListName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateListName(tempListName);
              if (e.key === "Escape") setIsEditingName(false);
            }}
            autoFocus
          />
          {listNameError && <ErrorMessage>{listNameError}</ErrorMessage>}
        </TitleEditContainer>
      ) : (
        <TitleDisplay onClick={() => setIsEditingName(true)} title="Click to edit list name">
          {listName} <span role="img" aria-label="Shopping cart">🛒</span>
        </TitleDisplay>
      )}
      <HeaderActionsContainer>
        <NewListButton onClick={onNewList} title="Create a new list">
          +
        </NewListButton>
        <ListHistory listHistory={listHistory} onDelete={onDeleteList} />
      </HeaderActionsContainer>
      {historyError && <ErrorMessage>{historyError}</ErrorMessage>}
    </Title>
  );
};
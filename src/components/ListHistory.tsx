import React, { useState, useRef, useEffect } from "react";
import { ListHistoryItem } from "../hooks/useListHistory";
import { useLanguage } from "../hooks/useLanguage";
import { UI_STRINGS } from "../utils/translations";
import {
  HistoryButton,
  HistoryContainer,
  HistoryDropdown,
  HistoryList,
  HistoryListItem,
  RemoveHistoryButton,
} from "../Pages/ShoppingList.style";

interface ListHistoryProps {
  listHistory: ListHistoryItem[];
  onDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    listId: string,
    listName: string,
  ) => void;
}

export const ListHistory: React.FC<ListHistoryProps> = ({
  listHistory,
  onDelete,
}) => {
  const { language } = useLanguage();
  const [showHistory, setShowHistory] = useState(false);
  const historyContainerRef = useRef<HTMLDivElement>(null);

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

  if (listHistory.length <= 1) {
    return null;
  }

  return (
    <HistoryContainer ref={historyContainerRef}>
      <HistoryButton
        title={UI_STRINGS[language].savedLists}
        onClick={() => setShowHistory(!showHistory)}
      >
        {UI_STRINGS[language].myLists}
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
                  onClick={(e) => onDelete(e, item.id, item.name)}
                  title={`${UI_STRINGS[language].deletePermanently} "${item.name}"`}
                >
                  &times;
                </RemoveHistoryButton>
              </HistoryListItem>
            ))}
          </HistoryList>
        </HistoryDropdown>
      )}
    </HistoryContainer>
  );
};

import React from "react";
import { ShoppingItem } from "../hooks/useShoppingList";
import { useLanguage } from "../hooks/useLanguage";
import { UI_STRINGS } from "../utils/translations";
import {
  CheckedItemsContainer,
  CheckedItemsTitle,
  CheckedItemsList,
  CheckedItem,
  CheckedItemName,
  Message,
  RemoveAllButton,
  SortButton,
} from "../Pages/ShoppingList.style";

interface CheckedItemsProps {
  items: ShoppingItem[];
  onUncheckItem: (item: ShoppingItem) => void;
  onRemoveItem: (itemId: string) => void;
  onSort: () => void;
  onRemoveAll: () => void;
}

export const CheckedItems: React.FC<CheckedItemsProps> = ({
  items,
  onUncheckItem,
  onRemoveItem,
  onSort,
  onRemoveAll,
}) => {
  const { language } = useLanguage();
  return (
    <CheckedItemsContainer>
      <CheckedItemsList>
        <CheckedItemsTitle>
          {UI_STRINGS[language].checkedItems}
        </CheckedItemsTitle>
        {items.length > 0 && (
          <Message>{UI_STRINGS[language].clickToBringBack}</Message>
        )}
        {items.length > 4 && (
          <SortButton onClick={onSort}>{UI_STRINGS[language].sort}</SortButton>
        )}
        {items.map((item) => (
          <CheckedItem key={item.id} onClick={() => onUncheckItem(item)}>
            <CheckedItemName>{item.name}</CheckedItemName>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item.id);
              }}
              title={UI_STRINGS[language].removeItem}
            >
              X
            </button>
          </CheckedItem>
        ))}
        {items.length > 4 && (
          <RemoveAllButton onClick={onRemoveAll}>
            {UI_STRINGS[language].removeAllItems}
          </RemoveAllButton>
        )}
      </CheckedItemsList>
    </CheckedItemsContainer>
  );
};

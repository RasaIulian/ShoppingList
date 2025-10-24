import React from "react";
import { ShoppingItem } from "../hooks/useShoppingList";
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
}) => (
  <CheckedItemsContainer>
    <CheckedItemsList>
      <CheckedItemsTitle>Checked Items ✅</CheckedItemsTitle>
      {items.length > 0 && <Message>{"("}Click to bring back to Shopping&nbsp;List{")"}</Message>}
      {items.length > 4 && <SortButton onClick={onSort}>⬇️ Sort</SortButton>}
      {items.map((item) => (
        <CheckedItem key={item.id} onClick={() => onUncheckItem(item)}>
          <CheckedItemName>{item.name}</CheckedItemName>
          <button onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }} title="Remove item">
            X
          </button>
        </CheckedItem>
      ))}
      {items.length > 4 && (
        <RemoveAllButton onClick={onRemoveAll}>Remove All Items</RemoveAllButton>
      )}
    </CheckedItemsList>
  </CheckedItemsContainer>
);
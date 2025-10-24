import React from "react";
import { ShoppingItem } from "../hooks/useShoppingList";
import {
  List,
  ListItem,
  Label,
  CheckboxInput,
  CategoryContainer,
  Category,
  RemoveAllButton,
  SortButton,
  Input,
  ErrorMessage,
} from "../Pages/ShoppingList.style";
import { CategoryType as CategoryKey } from "../utils/categories";

interface ItemsListProps {
  items: ShoppingItem[];
  groupedItems: Record<CategoryKey, ShoppingItem[]>;
  categoryDisplay: Record<string, { name: string; emoji: string }>;
  inputValue: string;
  itemError: string | null;
  onInputChange: (value: string) => void;
  onAddItem: () => void;
  onCheckItem: (item: ShoppingItem) => void;
  onRemoveItem: (itemId: string) => void;
  onSort: () => void;
  onRemoveAll: () => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({
  items,
  groupedItems,
  categoryDisplay,
  inputValue,
  itemError,
  onInputChange,
  onAddItem,
  onCheckItem,
  onRemoveItem,
  onSort,
  onRemoveAll,
}) => (
  <List>
    <Input
      type="text"
      name="ItemInput"
      value={inputValue}
      placeholder="add new item"
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onAddItem()}
    />
    {itemError && <ErrorMessage>{itemError}</ErrorMessage>}
    {items.length > 4 && <SortButton onClick={onSort}>⬇️ Sort</SortButton>}
    {Object.entries(groupedItems).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, itemsInCategory]) => (
      <CategoryContainer key={category}>
        <Category>{categoryDisplay[category]?.emoji ?? "🛒"} {categoryDisplay[category]?.name || category}</Category>
        {itemsInCategory.map((item) => (
          <ListItem key={item.id}>
            <Label><CheckboxInput type="checkbox" name="checkboxInput" onChange={() => onCheckItem(item)} />{item.name}</Label>
            <button onClick={() => onRemoveItem(item.id)} title="Remove item">X</button>
          </ListItem>
        ))}
      </CategoryContainer>
    ))}
    {items.length > 4 && <RemoveAllButton onClick={onRemoveAll}>Remove All Items</RemoveAllButton>}
  </List>
);
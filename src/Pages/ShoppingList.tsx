import React, { useState, useEffect } from "react";

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
  CheckedItem,
  CheckedItemName,
  Message,
  RemoveAllButton,
  SortButton,
} from "./ShoppingList.style";

interface ShoppingItem {
  // Defining the structure of a shopping item
  id: number;
  name: string;
}

const ShoppingList: React.FC = () => {
  // Functional component definition
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const storedItems = localStorage.getItem("shoppingListItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [inputValue, setInputValue] = useState(""); // State for input field value
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>(() => {
    const storedCheckedItems = localStorage.getItem("CheckedItems");
    return storedCheckedItems ? JSON.parse(storedCheckedItems) : [];
  }); // State for checked items
  const [error, setError] = useState<string>(""); // State for error messages

  // Effect to update local storage when shopping list items change
  useEffect(() => {
    localStorage.setItem("shoppingListItems", JSON.stringify(items));
  }, [items]);

  // Effect to update local storage when checked items change
  useEffect(() => {
    localStorage.setItem("CheckedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Function to handle adding a new item to the shopping list
  const handleAddItem = () => {
    if (inputValue.trim() !== "") {
      const newItem: ShoppingItem = {
        id: Date.now(), // Generate a unique ID
        name: inputValue,
      };

      // Check if the item already exists in the shopping list
      if (
        items.some(
          (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
        )
      ) {
        setError(`${newItem.name} is already in the list!`);
        setInputValue(""); // Clear input field
        return;
      } else if (
        checkedItems.some(
          (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
        )
      ) {
        setError(`${newItem.name} already in checked list ->`);
        setInputValue(""); // Clear input field
        return;
      }

      setItems((prevItems) => [...prevItems, newItem]);
      setInputValue(""); // Clear input field
      setError(""); // Clear error message
    }
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };
  // Function to handle removing a checked item
  const handleRemoveCheckedItem = (itemId: number) => {
    const updatedCheckedItems = checkedItems.filter(
      (item) => item.id !== itemId
    );
    setCheckedItems(updatedCheckedItems);
  };

  // Function to handle checking an item
  const handleCheckItem = (checkedItem: ShoppingItem) => {
    // Remove the checked item from the shopping list
    const newItems = items.filter((item) => item.id !== checkedItem.id);
    setItems(newItems);

    // Add the checked item to the checked items list
    setCheckedItems((prevCheckedItems) => [...prevCheckedItems, checkedItem]);
  };

  const handleRemoveAllListItems = () => {
    setItems([]);
  };
  const handleRemoveAllCheckedItems = () => {
    setCheckedItems([]);
  };

  // Function to handle returning an item to the shopping list
  const handleReturnToShoppingList = (returnedItem: ShoppingItem) => {
    // Remove the returned item from the checked items list
    const newCheckedItems = checkedItems.filter(
      (item) => item.id !== returnedItem.id
    );
    setCheckedItems(newCheckedItems);

    // Add the returned item back to the shopping list
    setItems((prevItems) => [...prevItems, returnedItem]);
  };

  const sortItemsAlphabetically = (items: ShoppingItem[]) => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  };

  const sortShoppingListAlphabetically = () => {
    setItems((prevItems) => {
      const sortedItems = sortItemsAlphabetically([...prevItems]);
      return sortedItems;
    });
  };

  const sortCheckedItemsAlphabetically = () => {
    setCheckedItems((prevCheckedItems) => {
      const sortedCheckedItems = sortItemsAlphabetically([...prevCheckedItems]);
      return sortedCheckedItems;
    });
  };

  // JSX structure for the component
  return (
    <Container>
      <Title>
        Shopping List{" "}
        <span role="img" aria-label="Shopping cart">
          🛒
        </span>
      </Title>

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
          {error && <ErrorMessage>{error}</ErrorMessage>}{" "}
          {items.length > 4 && (
            <SortButton onClick={sortShoppingListAlphabetically}>
              A{" "}
              <span role="img" aria-label="right arrow">
                ➡️
              </span>{" "}
              Z
            </SortButton>
          )}
          {items.map((item) => (
            <ListItem key={item.id}>
              <Label>
                <CheckboxInput
                  type="checkbox"
                  name="checkbox"
                  onChange={() => handleCheckItem(item)}
                />
                {item.name}
              </Label>
              <button onClick={() => handleRemoveItem(item.id)}>X</button>
            </ListItem>
          ))}
          {items.length > 4 && (
            <RemoveAllButton onClick={handleRemoveAllListItems}>
              Remove All
            </RemoveAllButton>
          )}
        </List>

        <CheckedItemsContainer>
          <CheckedItemsList>
            <CheckedItemsTitle>
              Checked Items&nbsp;
              <span role="img" aria-label="checked arrow">
                ☑️
              </span>
            </CheckedItemsTitle>
            {checkedItems.length > 0 && (
              <Message>
                {"("}Click to bring back to Shopping&nbsp;List{")"}
              </Message>
            )}{" "}
            {checkedItems.length > 4 && (
              <SortButton onClick={sortCheckedItemsAlphabetically}>
                A{" "}
                <span role="img" aria-label="right arrow">
                  ➡️
                </span>{" "}
                Z
              </SortButton>
            )}
            {checkedItems.map((item) => (
              <CheckedItem
                key={item.id}
                onClick={() => handleReturnToShoppingList(item)}
              >
                <CheckedItemName>{item.name}</CheckedItemName>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from bubbling up
                    handleRemoveCheckedItem(item.id);
                  }}
                >
                  X
                </button>
              </CheckedItem>
            ))}
            {checkedItems.length > 4 && (
              <RemoveAllButton onClick={handleRemoveAllCheckedItems}>
                Remove All
              </RemoveAllButton>
            )}
          </CheckedItemsList>
        </CheckedItemsContainer>
      </ListsContainer>
    </Container>
  );
};

export default ShoppingList;

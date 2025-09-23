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
  CategoryContainer,
  CheckedItem,
  CheckedItemName,
  Message,
  RemoveAllButton,
  SortButton,
  Category,
} from "./ShoppingList.style";
const categories = [
  "fructe/legume",
  "lactate",
  "carne",
  "panificație",
  "băuturi",
  "dulciuri",
  "produse de bază",
  "conserve",
  "congelate",
  "curățenie",
  "igienă personală",
  "nealimentare",
  "altele",
];
type CategoryType = (typeof categories)[number];

const categoryDisplay: Record<CategoryType, { name: string; emoji: string }> = {
  "fructe/legume": { name: "Fructe/Legume", emoji: "🍎🥦" },
  lactate: { name: "Lactate", emoji: "🥛" },
  carne: { name: "Carne", emoji: "🥩" },
  panificație: { name: "Panificație", emoji: "🍞" },
  băuturi: { name: "Băuturi", emoji: "🥤" },
  dulciuri: { name: "Dulciuri", emoji: "🍬" },
  "produse de bază": { name: "Produse de bază", emoji: "🧂" },
  conserve: { name: "Conserve", emoji: "🥫" },
  congelate: { name: "Congelate", emoji: "🧊" },
  curățenie: { name: "Curățenie", emoji: "🧽" },
  "igienă personală": { name: "Igienă Personală", emoji: "🛁" },
  nealimentare: { name: "Nealimentare", emoji: "🔋" },
  altele: { name: "Altele", emoji: "🛒" },
};

const productCategories: Partial<Record<CategoryType, string[]>> = {
  "fructe/legume": [
    "afine",
    "ananas",
    "anghinare",
    "ardei",
    "avocado",
    "banane",
    "broccoli",
    "capsuni",
    "cartofi",
    "castraveti",
    "ceapa",
    "ceapa verde",
    "cirese",
    "conopida",
    "curmale",
    "dovlecei",
    "dovlecele",
    "kiwi",
    "lamai",
    "mango",
    "mazare",
    "mere",
    "morcovi",
    "papaya",
    "pepene",
    "pere",
    "piersici",
    "portocale",
    "prune",
    "ridichi",
    "rodie",
    "rosii",
    "salata",
    "sfecla",
    "sparanghel",
    "struguri",
    "telina",
    "usturoi",
    "varza",
    "vinete",
    "zmeura",
  ],
  lactate: [
    "branza de burduf",
    "branza de vaci",
    "branza topita",
    "branza",
    "cascaval",
    "cheddar",
    "cottage",
    "edam",
    "feta",
    "gorgonzola",
    "gouda",
    "iaurt",
    "kefir",
    "lapte",
    "lapte batut",
    "mascarpone",
    "mozzarella",
    "parmezan",
    "ricotta",
    "smantana",
    "smantana pentru gatit",
    "telemea",
    "unt",
  ],
  carne: [
    "calamar",
    "calcan",
    "caracatita",
    "carnati",
    "coaste de porc",
    "costita",
    "cotlet porc",
    "crab",
    "creier",
    "creveti",
    "curcan",
    "ficat",
    "file de peste",
    "hering",
    "homar",
    "languste",
    "macrou",
    "mici",
    "midii",
    "miel",
    "mititei",
    "muschiulet",
    "pastrama",
    "peste",
    "piept de curcan",
    "piept de pui",
    "porc",
    "pui",
    "pulpa de pui",
    "pulpa porc",
    "pulpe de pui",
    "rinichi",
    "salam",
    "sardine",
    "slanina",
    "somon",
    "sunca",
    "ton",
    "vita",
  ],
  panificație: [
    "bagheta",
    "biscuiti",
    "branzoaice",
    "chifle",
    "cornuri",
    "covrigi",
    "cozonac",
    "croissant",
    "foccacia",
    "franzela",
    "gogoși",
    "lipie",
    "orez expandat",
    "paine",
    "patiserie",
    "pita",
    "placinta",
    "poale-n brau",
    "prajitura",
  ],
  băuturi: [
    "apa",
    "bere",
    "cafea",
    "ceai",
    "gin",
    "rom",
    "sampanie",
    "suc",
    "vin",
    "votca",
    "votka",
    "whisky",
  ],
  dulciuri: [
    "bomboane",
    "ciocolata",
    "fursecuri",
    "jeleuri",
    "napolitane",
    "prajituri",
  ],
  conserve: [
    "conserva de carne",
    "conserva de ciuperci",
    "conserva de fasole",
    "conserva de linte",
    "conserva de naut",
    "conserva de peste",
    "conserva de rosii",
    "conserve de mazare",
    "conserve de porumb",
    "conserve de ton",
    "zacusca",
  ],
  "produse de bază": [
    "drojdie",
    "fasole",
    "faina",
    "gris",
    "linte",
    "malai",
    "naut",
    "orez",
    "otet",
    "paste",
    "piper",
    "sare",
    "ulei",
    "zahar",
  ],
  congelate: [
    "cartofi congelati",
    "fructe de padure congelate",
    "inghetata",
    "legume congelate",
    "pește congelat",
    "pizza congelata",
    "pui congelat",
  ],
  curățenie: [
    "bureti",
    "clor",
    "detergent",
    "detergent de vase",
    "fairy",
    "saci de gunoi",
    "solutie de geamuri",
  ],
  "igienă personală": [
    "ata dentara",
    "deodorant",
    "dischete demachiante",
    "gel de dus",
    "hartie igienica",
    "pasta de dinti",
    "periuta de dinti",
    "sapun",
    "sapun lichid",
    "sampon",
  ],
  nealimentare: [
    "baterii",
    "becuri",
    "chibrituri",
    "folie alimentara",
    "hartie de copt",
    "lumanari",
    "servetele umede",
    "sfoara",
  ],
};

const productCategoryMap: Record<string, CategoryType> = Object.entries(
  productCategories
).reduce((acc, [category, products]) => {
  if (products) {
    products.forEach((product) => {
      acc[product] = category as CategoryType;
    });
  }
  return acc;
}, {} as Record<string, CategoryType>);

const guessCategory = (productName: string): CategoryType => {
  const lowerCaseName = productName.trim().toLowerCase();
  return productCategoryMap[lowerCaseName] || "altele";
};

interface ShoppingItem {
  // Defining the structure of a shopping item
  id: number;
  name: string;
  category: CategoryType;
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
      const category = guessCategory(inputValue);
      const newItem: ShoppingItem = {
        id: Date.now(), // Generate a unique ID
        name: inputValue,
        category: category,
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

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<CategoryType, ShoppingItem[]>);

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
              <span role="img" aria-label="right arrow">
                ⬇️
              </span>{" "}
              Sort A-Z
            </SortButton>
          )}
          {Object.entries(groupedItems)
            .sort(
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
                {itemsInCategory.map((item) => (
                  <ListItem key={item.id}>
                    <Label>
                      <CheckboxInput
                        type="checkbox"
                        name="checkbox"
                        onChange={() => handleCheckItem(item)}
                      />
                      {item.name}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove item"
                      >
                        X
                      </button>
                    </Label>
                  </ListItem>
                ))}
              </CategoryContainer>
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
                ✅
              </span>
            </CheckedItemsTitle>
            {checkedItems.length > 0 && (
              <Message>
                {"("}Click to bring back to Shopping&nbsp;List{")"}
              </Message>
            )}{" "}
            {checkedItems.length > 4 && (
              <SortButton onClick={sortCheckedItemsAlphabetically}>
                <span role="img" aria-label="down arrow">
                  ⬇️
                </span>{" "}
                Sort A-Z
              </SortButton>
            )}
            {checkedItems.map((item) => (
              <CheckedItem
                key={item.id}
                onClick={() => handleReturnToShoppingList(item)}
              >
                <CheckedItemName>
                  {item.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click event from bubbling up
                      handleRemoveCheckedItem(item.id);
                    }}
                    title="Remove item"
                  >
                    X
                  </button>
                </CheckedItemName>
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

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
  Category,
} from "./ShoppingList.style";
const categories = [
  "fructe/legume",
  "lactate",
  "carne",
  "panificație",
  "băuturi",
  "dulciuri",
  "conserve",
  "congelate",
  "curățenie",
  "igienă personală",
  "nealimentare",
  "altele",
];
type CategoryType = (typeof categories)[number];

const categoryDisplay: Record<CategoryType, { name: string; emoji: string }> = {
  "fructe/legume": { name: "Fructe/Legume", emoji: "🍎 🥦" },
  lactate: { name: "Lactate", emoji: "🥛" },
  carne: { name: "Carne", emoji: "🥩" },
  panificație: { name: "Panificație", emoji: "🍞" },
  băuturi: { name: "Băuturi", emoji: "🥤" },
  dulciuri: { name: "Dulciuri", emoji: "🍬" },
  conserve: { name: "Conserve", emoji: "🥫" },
  congelate: { name: "Congelate", emoji: "🧊" },
  curățenie: { name: "Curățenie", emoji: "🧼" },
  "igienă personală": { name: "Igienă Personală", emoji: "🧴" },
  nealimentare: { name: "Nealimentare", emoji: "🔋" },
  altele: { name: "Altele", emoji: "🛒" },
};

const productCategoryMap: { [key: string]: CategoryType } = {
  // Fructe/Legume
  mere: "fructe/legume",
  banane: "fructe/legume",
  portocale: "fructe/legume",
  struguri: "fructe/legume",
  capsuni: "fructe/legume",
  rosii: "fructe/legume",
  castraveti: "fructe/legume",
  cartofi: "fructe/legume",
  ceapa: "fructe/legume",
  morcovi: "fructe/legume",
  salata: "fructe/legume",
  ardei: "fructe/legume",
  lamai: "fructe/legume",
  avocado: "fructe/legume",
  usturoi: "fructe/legume",
  piersici: "fructe/legume",
  pere: "fructe/legume",
  ananas: "fructe/legume",
  kiwi: "fructe/legume",
  cirese: "fructe/legume",
  zmeura: "fructe/legume",
  afine: "fructe/legume",
  prune: "fructe/legume",
  pepene: "fructe/legume",
  varza: "fructe/legume",
  conopida: "fructe/legume",
  broccoli: "fructe/legume",
  dovlecei: "fructe/legume",
  vinete: "fructe/legume",
  fasole: "fructe/legume",
  mazare: "fructe/legume",
  "ceapa verde": "fructe/legume",
  ridichi: "fructe/legume",
  sparanghel: "fructe/legume",
  anghinare: "fructe/legume",
  sfecla: "fructe/legume",
  telina: "fructe/legume",
  papaya: "fructe/legume",
  mango: "fructe/legume",
  rodie: "fructe/legume",
  curmale: "fructe/legume",

  // Lactate
  lapte: "lactate",
  iaurt: "lactate",
  branza: "lactate",
  cascaval: "lactate",
  smantana: "lactate",
  unt: "lactate",
  kefir: "lactate",
  "branza de vaci": "lactate",
  "lapte batut": "lactate",
  mascarpone: "lactate",
  gorgonzola: "lactate",
  parmezan: "lactate",
  mozzarella: "lactate",
  ricotta: "lactate",
  feta: "lactate",
  telemea: "lactate",
  edam: "lactate",
  gouda: "lactate",
  cheddar: "lactate",
  "branza topita": "lactate",
  "smantana pentru gatit": "lactate",
  "branza de burduf": "lactate",
  cottage: "lactate",

  // Carne
  pui: "carne",
  porc: "carne",
  vita: "carne",
  peste: "carne",
  carnati: "carne",
  sunca: "carne",
  salam: "carne",
  curcan: "carne",
  miel: "carne",
  costita: "carne",
  creveti: "carne",
  somon: "carne",
  ton: "carne",
  calcan: "carne",
  hering: "carne",
  macrou: "carne",
  sardine: "carne",
  midii: "carne",
  crab: "carne",
  homar: "carne",
  languste: "carne",
  calamar: "carne",
  caracatita: "carne",
  mici: "carne",
  "pulpa porc": "carne",
  "piept pui": "carne",
  "cotlet porc": "carne",
  muschiulet: "carne",
  ficat: "carne",
  rinichi: "carne",
  creier: "carne",
  slanina: "carne",
  pastrama: "carne",
  "piept de curcan": "carne",
  "pulpa de pui": "carne",
  "coaste de porc": "carne",
  "file de peste": "carne",

  // Panificație
  paine: "panificație",
  chifle: "panificație",
  cornuri: "panificație",
  biscuiti: "panificație",
  covrigi: "panificație",
  franzela: "panificație",
  bagheta: "panificație",
  croissant: "panificație",
  foccacia: "panificație",
  pita: "panificație",
  gogoși: "panificație",
  branzoaice: "panificație",
  placinta: "panificație",
  prajitura: "panificație",
  "orez expandat": "panificație",
  patiserie: "panificație",
  lipie: "panificație",
  "poale-n brau": "panificație",
  cozonac: "panificație",

  // Băuturi
  apa: "băuturi",
  suc: "băuturi",
  bere: "băuturi",
  vin: "băuturi",
  cafea: "băuturi",
  ceai: "băuturi",
  votca: "băuturi",
  whisky: "băuturi",
  rom: "băuturi",
  gin: "băuturi",
  sampanie: "băuturi",

  // Dulciuri
  ciocolata: "dulciuri",
  bomboane: "dulciuri",
  napolitane: "dulciuri",
  prajituri: "dulciuri",
  fursecuri: "dulciuri",
  jeleuri: "dulciuri",

  // Conserve
  "conserve de ton": "conserve",
  "conserve de porumb": "conserve",
  "conserve de mazare": "conserve",
  zacusca: "conserve",
  "conserva de rosii": "conserve",
  "conserva de fasole": "conserve",
  "conserva de ciuperci": "conserve",
  "conserva de peste": "conserve",
  linte: "conserve",
  naut: "conserve",

  // Congelate
  "legume congelate": "congelate",
  "pizza congelata": "congelate",
  "cartofi congelati": "congelate",
  inghetata: "congelate",
  "fructe de padure congelate": "congelate",
  "pui congelat": "congelate",
  "pește congelat": "congelate",

  // Altele

  // Curățenie
  detergent: "curățenie",
  "detergent de vase": "curățenie",
  "solutie de geamuri": "curățenie",
  bureti: "curățenie",
  "saci de gunoi": "curățenie",
  clor: "curățenie",

  // Igienă Personală
  sapun: "igienă personală",
  sampon: "igienă personală",
  "pasta de dinti": "igienă personală",
  "periuta de dinti": "igienă personală",
  "hartie igienica": "igienă personală",
  deodorant: "igienă personală",

  // Nealimentare
  baterii: "nealimentare",
  becuri: "nealimentare",
  chibrituri: "nealimentare",
};

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
              <div key={category}>
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
              </div>
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

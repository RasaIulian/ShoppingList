import React, { useState, useEffect, useRef, useCallback } from "react";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { database } from "../firebase";

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
} from "./ShoppingList.style";

const categories = [
  "fructe/legume",
  "lactate",
  "carne",
  "panificatie",
  "bauturi",
  "dulciuri",
  "produse de baza",
  "conserve",
  "congelate",
  "curatenie",
  "igiena personala",
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
  id: string;
  name: string;
  category: CategoryType;
  sortOrder?: number;
}

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
  const [listId] = useState<string>(getListId());
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>([]);
  const [error, setError] = useState<string>("");
  const [listName, setListName] = useState<string>("Shopping List");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempListName, setTempListName] = useState("");
  const editContainerRef = useRef<HTMLDivElement>(null);

  // Listen to list name in real-time
  useEffect(() => {
    const listNameRef = ref(database, `lists/${listId}/name`);

    const unsubscribe = onValue(listNameRef, (snapshot) => {
      const name = snapshot.val();
      if (name) {
        setListName(name);
      } else {
        // Set default name if none exists
        set(listNameRef, "Shopping List");
      }
    });

    return () => unsubscribe();
  }, [listId]);

  // Listen to items in real-time
  useEffect(() => {
    const itemsRef = ref(database, `lists/${listId}/items`);

    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsArray = Object.entries(data)
          .map(([id, item]: [string, any]) => ({
            id,
            ...item,
          }))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setItems(itemsArray);
      } else {
        setItems([]);
      }
    });

    return () => unsubscribe();
  }, [listId]);

  // Listen to checked items in real-time
  useEffect(() => {
    const checkedItemsRef = ref(database, `lists/${listId}/checkedItems`);

    const unsubscribe = onValue(checkedItemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const checkedArray = Object.entries(data)
          .map(([id, item]: [string, any]) => ({
            id,
            ...item,
          }))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

        setCheckedItems(checkedArray);
      } else {
        setCheckedItems([]);
      }
    });

    return () => unsubscribe();
  }, [listId]);

  const handleUpdateListName = async () => {
    const newName = tempListName.trim();
    if (newName !== "") {
      const listNameRef = ref(database, `lists/${listId}/name`);
      await set(listNameRef, newName);
      setIsEditingName(false);
    }
  };

  // Effect to handle clicks outside the editing container
  useEffect(() => {
    if (!isEditingName) return; // Only run when editing

    const handleClickOutside = (event: MouseEvent) => {
      if (
        editContainerRef.current &&
        !editContainerRef.current.contains(event.target as Node)
      ) {
        handleUpdateListName(); // This will now use the current tempListName
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingName, tempListName]); // Rerun when editing starts/stops or temp name changes

  const handleStartEditingName = () => {
    setTempListName(listName);
    setIsEditingName(true);
  };

  const handleCancelEditingName = () => {
    setIsEditingName(false);
    setTempListName("");
  };

  const handleAddItem = async () => {
    if (inputValue.trim() !== "") {
      const category = guessCategory(inputValue);
      const itemName = inputValue.trim();

      // Check if item already exists
      const existsInItems = items.some(
        (item) => item.name.toLowerCase() === itemName.toLowerCase()
      );
      const existsInChecked = checkedItems.some(
        (item) => item.name.toLowerCase() === itemName.toLowerCase()
      );

      if (existsInItems) {
        setError(`${itemName} is already in the list!`);
        setInputValue("");
        return;
      } else if (existsInChecked) {
        setError(`${itemName} already in checked list ->`);
        setInputValue("");
        return;
      }

      // Add to Firebase
      const itemsRef = ref(database, `lists/${listId}/items`);
      const newItemRef = push(itemsRef);

      await set(newItemRef, {
        name: itemName,
        category: category,
        sortOrder: items.length,
      });

      setInputValue("");
      setError("");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const itemRef = ref(database, `lists/${listId}/items/${itemId}`);
    await remove(itemRef);
  };

  const handleRemoveCheckedItem = async (itemId: string) => {
    const itemRef = ref(database, `lists/${listId}/checkedItems/${itemId}`);
    await remove(itemRef);
  };

  const handleCheckItem = async (checkedItem: ShoppingItem) => {
    // Remove from items
    const itemRef = ref(database, `lists/${listId}/items/${checkedItem.id}`);
    await remove(itemRef);

    // Add to checked items
    const checkedItemsRef = ref(
      database,
      `lists/${listId}/checkedItems/${checkedItem.id}`
    );
    await set(checkedItemsRef, {
      name: checkedItem.name,
      category: checkedItem.category,
      sortOrder: checkedItems.length,
    });
  };

  const handleReturnToShoppingList = async (returnedItem: ShoppingItem) => {
    // Remove from checked items
    const checkedItemRef = ref(
      database,
      `lists/${listId}/checkedItems/${returnedItem.id}`
    );
    await remove(checkedItemRef);

    // Add back to items
    const itemsRef = ref(database, `lists/${listId}/items/${returnedItem.id}`);
    await set(itemsRef, {
      name: returnedItem.name,
      category: returnedItem.category,
      sortOrder: items.length,
    });
  };

  const handleRemoveAllListItems = async () => {
    const itemsRef = ref(database, `lists/${listId}/items`);
    await remove(itemsRef);
  };

  const handleRemoveAllCheckedItems = async () => {
    const checkedItemsRef = ref(database, `lists/${listId}/checkedItems`);
    await remove(checkedItemsRef);
  };

  const sortItemsAlphabetically = (items: ShoppingItem[]) => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  };

  const sortShoppingListAlphabetically = async () => {
    const sortedItems = sortItemsAlphabetically([...items]);
    const itemsRef = ref(database, `lists/${listId}/items`);

    // Create updates object
    const updates: any = {};
    sortedItems.forEach((item, index) => {
      // update the sortOrder for each item's ID.
      updates[`${item.id}/sortOrder`] = index;
    });

    await update(itemsRef, updates);
  };

  const sortCheckedItemsAlphabetically = async () => {
    const sortedCheckedItems = sortItemsAlphabetically([...checkedItems]);
    const checkedItemsRef = ref(database, `lists/${listId}/checkedItems`);

    const updates: any = {};
    sortedCheckedItems.forEach((item, index) => {
      updates[`${item.id}/sortOrder`] = index;
    });

    await update(checkedItemsRef, updates);
  };

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<CategoryType, ShoppingItem[]>);

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
                  handleUpdateListName();
                } else if (e.key === "Escape") {
                  handleCancelEditingName();
                }
              }}
              autoFocus
            />
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
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {items.length > 4 && (
            <SortButton onClick={sortShoppingListAlphabetically}>
              <span role="img" aria-label="right arrow">
                ⬇️
              </span>{" "}
              Sort
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
            )}
            {checkedItems.length > 4 && (
              <SortButton onClick={sortCheckedItemsAlphabetically}>
                <span role="img" aria-label="down arrow">
                  ⬇️
                </span>{" "}
                Sort
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
                      e.stopPropagation();
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

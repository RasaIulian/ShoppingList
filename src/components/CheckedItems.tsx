import React from "react";

interface ShoppingItem {
  id: number;
  name: string;
}

interface Props {
  checkedItems: ShoppingItem[];
}

const CheckedItems: React.FC<Props> = ({ checkedItems }) => {
  // Function to move item from checked items back to shopping list
  const handleUncheckItem = (item: ShoppingItem) => {
    // Implement your logic here to remove the item from checked items
  };

  return (
    <div>
      <h2>Checked Items</h2>
      <ul>
        {checkedItems.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked
                onChange={() => handleUncheckItem(item)}
              />
              {item.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckedItems;

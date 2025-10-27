import React from "react";
import { BrowserRouter } from "react-router-dom";
import ShoppingList from "./Pages/ShoppingList";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <ShoppingList />
      </div>
    </BrowserRouter>
  );
};

export default App;

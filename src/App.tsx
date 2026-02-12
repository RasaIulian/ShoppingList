import React from "react";
import { BrowserRouter } from "react-router-dom";
import ShoppingList from "./Pages/ShoppingList";
import { LanguageProvider } from "./hooks/useLanguage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ShoppingList />
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;

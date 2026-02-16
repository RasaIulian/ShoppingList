/**
 * Language Context and Provider Hook
 * Manages application language state (Romanian/English) with localStorage persistence
 * Provides language switching functionality throughout the app
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/** Supported language types */
export type Language = "ro" | "en";

/** Language context value type with getter and setter functions */
interface LanguageContextType {
  language: Language; // Current language setting
  setLanguage: (lang: Language) => void; // Set to specific language
  toggleLanguage: () => void; // Toggle between RO/EN
}

/** Create context with undefined as default (will be set by provider) */
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

/**
 * LanguageProvider Component
 * Wraps the app to provide language state and functions to all components
 * Persists language preference to localStorage
 * @param children - React components to be wrapped
 */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("preferredLanguage") as Language | null;
    return stored && ["ro", "en"].includes(stored) ? stored : "en";
  });

  // Persist language preference whenever it changes
  useEffect(() => {
    localStorage.setItem("preferredLanguage", language);
  }, [language]);

  // Set language if it's valid
  const setLanguage = (lang: Language) => {
    if (["ro", "en"].includes(lang)) {
      setLanguageState(lang);
    }
  };

  // Toggle between Romanian and English
  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "ro" ? "en" : "ro"));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage Hook
 * Access current language and language switching functions
 * Must be used within LanguageProvider
 * @returns Language context with current language and setter functions
 * @throws Error if used outside LanguageProvider
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

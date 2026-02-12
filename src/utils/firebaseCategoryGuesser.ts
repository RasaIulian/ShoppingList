import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { guessCategory } from "./categoryGuesser";
import { CategoryType } from "./categories";
import { Language } from "../hooks/useLanguage";

// Define the structure of the data returned from the function
type CategorizeResult = {
  category: CategoryType;
  categoryRo?: CategoryType;
  categoryEn?: CategoryType;
};

const categorizeItemCallable = httpsCallable(functions, "categorizeItem");

export const getCategoryFromFirebase = async (
  itemName: string,
  language: Language = "ro",
): Promise<CategoryType> => {
  // 1. First, try the local, instant, and free category guesser.
  const localGuess = guessCategory(itemName, language);

  // 2. If the local guess is specific (not the default "altele"/"others"), use it.
  const defaultCategoryRo = "altele";
  const defaultCategoryEn = "others";

  if (localGuess !== defaultCategoryRo && localGuess !== defaultCategoryEn) {
    console.log(`Local guess for "${itemName}": ${localGuess}`);
    return localGuess;
  }

  // 3. If local guesser failed, call the AI-powered Firebase Function.
  console.log(`Local guess failed for "${itemName}", calling AI...`);
  try {
    const result = await categorizeItemCallable({ text: itemName, language });
    const data = result.data as CategorizeResult;

    // Return category in the requested language
    if (language === "en" && data.categoryEn) {
      return data.categoryEn;
    } else if (language === "ro" && data.categoryRo) {
      return data.categoryRo;
    }

    return data.category || (language === "en" ? "others" : "altele");
  } catch (error: any) {
    console.error("Error calling 'categorizeItem' function.", error);
    // Fallback to a default category in case of an AI error.
    return language === "en" ? "others" : "altele";
  }
};

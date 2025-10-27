import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { guessCategory } from "./categoryGuesser";
import { CategoryType } from "./categories";

// Define the structure of the data returned from the function
type CategorizeResult = { category: CategoryType };

const categorizeItemCallable = httpsCallable(functions, "categorizeItem");

export const getCategoryFromFirebase = async (
  itemName: string
): Promise<CategoryType> => {
  // 1. First, try the local, instant, and free category guesser.
  const localGuess = guessCategory(itemName);

  // 2. If the local guess is specific (not the default "altele"), use it.
  if (localGuess !== "altele") {
    console.log(`Local guess for "${itemName}": ${localGuess}`);
    return localGuess;
  }

  // 3. If local guesser failed, call the AI-powered Firebase Function.
  console.log(`Local guess failed for "${itemName}", calling AI...`);
  try {
    const result = await categorizeItemCallable({ text: itemName });
    const data = result.data as CategorizeResult;
    return data.category;
  } catch (error: any) {
    console.error("Error calling 'categorizeItem' function.", error);
    // Fallback to a default category in case of an AI error.
    return "altele"; // Default to Romanian fallback
  }
};

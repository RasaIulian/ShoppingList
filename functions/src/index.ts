import { setGlobalOptions } from "firebase-functions";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { VertexAI } from "@google-cloud/vertexai";
import { categoriesRO, categoriesEN } from "../../src/utils/categories";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10, region: "europe-central2" });
// The 'region' property above sets the physical location where this Cloud Function
// will be deployed and run. All client-side calls must target this region.

/**
 * A callable function that uses the Vertex AI Gemini model to categorize
 * a shopping list item.
 */
export const categorizeItem = onCall(
  {
    // Allow unauthenticated requests.
    invoker: "public",
  },
  async (request) => {
    logger.info("categorizeItem function invoked.", { structuredData: true });

    const { text } = request.data;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      logger.error("Request data must include a non-empty 'text' field.");
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with one argument 'text' " +
          "containing the item name to categorize."
      );
    }

    const projectId = process.env.GCLOUD_PROJECT;
    if (!projectId) {
      logger.error("GCLOUD_PROJECT environment variable not set.");
      throw new HttpsError(
        "internal",
        "Server configuration error: Project ID is missing."
      );
    }

    // Initialize Vertex AI
    const vertexAI = new VertexAI({
      project: projectId,
      location: "europe-central2",
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `You are a strict shopping item categorizer. Your response must be a JSON object: {"category": "<category_name>"}.
    Item: "${text}".
    Categorize the item into one of the following categories.
    Romanian categories: [${categoriesRO.join(", ")}].
    English categories: [${categoriesEN.join(", ")}].
    If the item is not a valid, misspelled, single shopping product, is a phrase, or is ambiguous, use 'altele' for Romanian or 'others' for English.
    Examples:
    "paine" -> {"category": "panificatie"}
    "milk" -> {"category": "dairy"}
    "miilk" -> {"category": "others"}`;

    // Call the Vertex AI model
    try {
      const resp = await generativeModel.generateContent(prompt);
      const aiResponse = resp.response;
      // Use optional chaining to safely access the category from the response.
      // This prevents errors if `candidates` or any nested property is missing.
      const responseText =
        aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      let category = "altele"; // Default to Romanian fallback

      if (responseText) {
        try {
          // The model might return the JSON wrapped in a markdown code block.
          const cleanedResponseText = responseText.replace(
            /^```json\s*|```$/g,
            ""
          );
          const responseObject = JSON.parse(cleanedResponseText);
          category = responseObject.category || "altele";
        } catch (parseError) {
          logger.error("Failed to parse JSON from AI response", {
            responseText,
            error: parseError,
          });
          // If parsing fails, we'll stick with the default category "altele".
          // You might want to add more sophisticated error handling here.
        }
      }

      // Add detailed logging to see the full AI response for debugging.
      logger.debug("Full Vertex AI response:", {
        structuredData: true,
        response: aiResponse,
      });

      logger.info(`Item: "${text}", Guessed Category: "${category}"`);

      // Return the category to the client
      return { category };
    } catch (error) {
      logger.error("Error calling Vertex AI:", error);
      throw new HttpsError(
        "internal",
        "Failed to categorize item using Vertex AI."
      );
    }
  }
);

// src/services/gemini-client.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// --- 1. INITIALIZE GEMINI API ---

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCTLaaXKPPgOu9G4z0Njtdi-Tz5TlGdnv8"; // Your API key - fallback for local development
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- 2. HELPER & AI CALL FUNCTION ---

/**
 * A helper function to introduce a delay.
 * @param ms The number of milliseconds to wait.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * A generic function to call the Gemini API with a given prompt, including a retry mechanism.
 * @param prompt The complete prompt to send to the AI.
 * @param retries The number of times to retry the request.
 * @param delay The initial delay between retries, in milliseconds.
 * @returns A promise that resolves to the parsed JSON response of type T.
 */
export async function callGemini<T>(prompt: string, retries = 3, delay = 2000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();
      
      const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      return JSON.parse(cleanedJson) as T;

    } catch (error: any) {
      console.error(`Error calling Gemini API (attempt ${i + 1}/${retries}):`, error);
      
      const isLastAttempt = i === retries - 1;
      const isRateLimitError = error.toString().includes('429');
      const isServiceUnavailable = error.toString().includes('503');

      if (isLastAttempt) {
        if (isRateLimitError) {
          throw new Error("You have exceeded your API quota. Please check your plan and billing details, or try again later.");
        }
        if (isServiceUnavailable) {
          throw new Error("The AI service is currently overloaded. Please try again in a few moments.");
        }
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The request was blocked due to safety settings. Please modify your input.");
        }
        throw new Error("Failed to generate content from AI after multiple attempts.");
      }
      
      if (isServiceUnavailable) {
        // Wait before retrying with exponential backoff for server overload
        await sleep(delay * Math.pow(2, i));
      } else if (isRateLimitError) {
        // Wait a longer, fixed time for rate limit errors
        await sleep(delay * Math.pow(2, i));
      } else {
        // For other errors (like safety), don't retry
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The request was blocked due to safety settings. Please modify your input.");
        }
        throw new Error("An unexpected error occurred while communicating with the AI.");
      }
    }
  }
  // This should be unreachable if the loop logic is correct, but is here as a fallback.
  throw new Error("Exceeded max retries for Gemini API call.");
}

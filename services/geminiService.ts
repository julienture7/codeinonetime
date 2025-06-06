
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { GeminiContent } from '../types'; // Adjusted path
import { GEMINI_TEXT_MODEL_NAME } from "../constants"; // Adjusted path

// API_KEY is expected to be available as an environment variable.
// For client-side (React SPA), this needs to be handled by the bundler (e.g., Vite with import.meta.env.VITE_API_KEY)
// or provided through a secure mechanism. The prompt assumes `process.env.API_KEY` is available.
// In a Vite app, you might use `import.meta.env.VITE_GEMINI_API_KEY`.
// For this exercise, we'll try to use `process.env.API_KEY` as instructed,
// but acknowledge it might need adjustment based on the actual build/runtime environment.

const API_KEY = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || (window as any).API_KEY || "";

if (!API_KEY) {
  console.error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  // Potentially throw an error or have a fallback if running in an environment where it's critical
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates content using the Gemini model.
 * @param prompt The text prompt.
 * @param history Optional chat history.
 * @returns The generated text or an error message.
 */
export const generateGeminiText = async (
  prompt: string,
  history?: GeminiContent[] // Note: Gemini uses 'model', not 'assistant' for role
): Promise<string> => {
  if (!API_KEY) return "API Key not configured.";
  
  try {
    // Construct contents array. Gemini API expects alternating user/model messages.
    const contents: GeminiContent[] = [];
    if (history) {
        contents.push(...history);
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL_NAME,
        contents: contents, // Send the constructed contents array
        // config: { // Optional config
        //   temperature: 0.7,
        //   topK: 1,
        //   topP: 1,
        //   maxOutputTokens: 2048,
        // },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    return `Error: Unable to get response from AI. ${(error as Error).message}`;
  }
};

/**
 * Generates content from multimodal input (e.g., text and image).
 * @param textPrompt The text part of the prompt.
 * @param base64Image The base64 encoded image data.
 * @param mimeType The MIME type of the image (e.g., 'image/png', 'image/jpeg').
 * @returns The generated text or an error message.
 */
export const generateGeminiMultimodalText = async (
  textPrompt: string,
  base64Image: string,
  mimeType: string = 'image/png'
): Promise<string> => {
  if (!API_KEY) return "API Key not configured.";

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    const textPart = {
      text: textPrompt,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL_NAME, // Or a vision-capable model like gemini-pro-vision if needed
        contents: { parts: [textPart, imagePart] }, // Single turn with multiple parts
    });

    return response.text;
  } catch (error) {
    console.error("Error generating multimodal content from Gemini:", error);
    return `Error: Unable to get multimodal response from AI. ${(error as Error).message}`;
  }
};
    

import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

export const getAIShopperResponse = async (
  userMessage: string,
  availableProducts: Product[]
) => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productContext = availableProducts.map(p => 
    `- ${p.name} ($${p.price}): ${p.description} [Category: ${p.category}]`
  ).join('\n');

  const systemInstruction = `
    You are a friendly and professional Personal Shopper for "ShopHub".
    Your goal is to help users find the perfect product from our catalog.
    
    Current Catalog:
    ${productContext}
    
    Guidelines:
    1. Be concise and stylish in your speech.
    2. If a user asks for recommendations, pick 1-2 items from the catalog that match their vibe.
    3. If they ask about something not in the catalog, politely guide them to our existing categories.
    4. Use emojis occasionally to maintain a premium yet friendly tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Directly access .text property as per guidelines
    return response.text || "I'm sorry, I couldn't process that request right now. How else can I help you find what you need?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting to my brain right now. Please try again in a moment!";
  }
};

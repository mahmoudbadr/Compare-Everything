import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ComparisonResult } from "../types";

const comparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The normalized names of the items being compared.",
    },
    summary: {
      type: Type.STRING,
      description: "A concise 2-3 sentence summary of the main differences.",
    },
    verdict: {
      type: Type.STRING,
      description: "A definitive recommendation or conclusion.",
    },
    criteria: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Criterion name (e.g. Cost, Speed).",
          },
          descriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Short description for each item.",
          },
          scores: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: "Score 1-10 for each item.",
          },
          winnerIndex: {
            type: Type.INTEGER,
            description: "Index of winner, or -1 for tie.",
          },
        },
        required: ["name", "descriptions", "scores", "winnerIndex"],
      },
    },
  },
  required: ["items", "summary", "verdict", "criteria"],
};

export const generateComparison = async (items: string[]): Promise<ComparisonResult> => {
  // Initialize inside function to ensure environment is ready
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Compare: ${items.join(", ")}.
    
    Determine 5-6 key attributes relevant to these items.
    For each attribute:
    1. Score each item (1-10).
    2. Provide a short reason.
    3. Pick a winner.
    
    If items are very different (e.g. "Apple vs Orange"), compare on abstract qualities (e.g. "Nutrition", "Convenience").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: comparisonSchema,
        temperature: 0.4, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ComparisonResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};

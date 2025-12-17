import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ComparisonResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const comparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The names of the items being compared, normalized if necessary.",
    },
    summary: {
      type: Type.STRING,
      description: "A concise executive summary of the comparison.",
    },
    verdict: {
      type: Type.STRING,
      description: "A final conclusion or recommendation based on the comparison.",
    },
    criteria: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the comparison attribute (e.g., Price, Performance, Flavor).",
          },
          descriptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A short text description for each item regarding this attribute. Order must match the items array.",
          },
          scores: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: "A numerical score from 1 to 10 for each item on this attribute. 10 is best.",
          },
          winnerIndex: {
            type: Type.INTEGER,
            description: "The index of the item that wins this category. Use -1 if it's a tie or subjective.",
          },
        },
        required: ["name", "descriptions", "scores", "winnerIndex"],
      },
    },
  },
  required: ["items", "summary", "verdict", "criteria"],
};

export const generateComparison = async (items: string[]): Promise<ComparisonResult> => {
  const prompt = `
    Compare the following items: ${items.join(", ")}.
    
    Dynamically determine the most relevant attributes/criteria for comparing these specific things.
    For example, if comparing cars, use Speed, Safety, Price. If comparing framework, use Performance, Ecosystem, Learning Curve.
    
    For each attribute:
    1. Provide a short description for each item.
    2. Assign a score from 1-10 (10 being best/highest positive impact).
    3. Determine a winner index.
    
    Be objective, smart, and context-aware. If the items are abstract concepts (e.g., "Love vs Money"), compare them philosophically but still provide structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: comparisonSchema,
        temperature: 0.4, // Keep it relatively factual but creative enough for abstract concepts
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ComparisonResult;
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

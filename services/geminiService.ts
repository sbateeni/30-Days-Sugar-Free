import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isCompliant: { type: Type.BOOLEAN },
    foodName: { type: Type.STRING },
    sugarContent: { type: Type.STRING },
    sugarPercentage: { type: Type.STRING },
    explanation: { type: Type.STRING },
    macros: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fats: { type: Type.STRING },
      }
    }
  }
};

export const analyzeFoodImage = async (base64Image: string, lang: 'ar' | 'en'): Promise<FoodAnalysis> => {
  try {
    const languageName = lang === 'ar' ? 'Arabic' : 'English';
    const prompt = `
      You are a strict nutritionist helper for a "30 Days No Sugar Challenge". 
      Analyze the image provided. Identify the food item.
      Determine if this food is generally allowed in a strict no-added-sugar diet. 
      Natural sugars in whole fruits are usually allowed in moderation, but added sugars, sweets, pastries, and processed sugary foods are NOT allowed.
      
      Respond in JSON format with the following structure:
      {
        "isCompliant": boolean, // true if allowed, false if it contains added sugar or is forbidden
        "foodName": string, // Name of the food in ${languageName}
        "sugarContent": string, // Brief description of sugar content in ${languageName}
        "sugarPercentage": string, // Estimated percentage of sugar ~approx
        "explanation": string, // Detailed reason in ${languageName} why it is allowed or not
        "macros": {
           "calories": string, // approx per 100g
           "protein": string,
           "carbs": string,
           "fats": string
        }
      }
      
      Ensure all text fields are in ${languageName}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FoodAnalysis;
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw error;
  }
};

export const analyzeFoodText = async (foodName: string, lang: 'ar' | 'en'): Promise<FoodAnalysis> => {
  try {
    const languageName = lang === 'ar' ? 'Arabic' : 'English';
    const prompt = `
      You are a strict nutritionist helper for a "30 Days No Sugar Challenge". 
      Analyze the food item described as: "${foodName}".
      Determine if this food is generally allowed in a strict no-added-sugar diet. 
      Natural sugars in whole fruits are usually allowed in moderation, but added sugars, sweets, pastries, and processed sugary foods are NOT allowed.
      
      Respond in JSON format with the following structure:
      {
        "isCompliant": boolean, // true if allowed, false if it contains added sugar or is forbidden
        "foodName": string, // The name of the food in ${languageName} (correct it if misspelled)
        "sugarContent": string, // Brief description of sugar content in ${languageName}
        "sugarPercentage": string, // Estimated percentage of sugar ~approx
        "explanation": string, // Detailed reason in ${languageName} why it is allowed or not
        "macros": {
           "calories": string, // approx per 100g
           "protein": string,
           "carbs": string,
           "fats": string
        }
      }
      
      Ensure all text fields are in ${languageName}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FoodAnalysis;
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error) {
    console.error("Gemini Text Analysis Error:", error);
    throw error;
  }
};
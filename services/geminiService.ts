import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizResponse } from "../types";

// Define the schema for the response
const exampleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "A common word or idiom using the character" },
    pinyin: { type: Type.STRING, description: "Pinyin for the word" },
  },
  required: ["word", "pinyin"],
};

const quizItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    character: { type: Type.STRING, description: "The target Chinese character (Hanzi)" },
    pinyin: { type: Type.STRING, description: "The correct Pinyin for the character" },
    wrongPinyins: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 incorrect Pinyin options distinct from the correct one",
    },
    wrongChars: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 incorrect Hanzi options distinct from the target one",
    },
    examples: {
      type: Type.ARRAY,
      items: exampleSchema,
      description: "3 example words containing the character",
    },
  },
  required: ["character", "pinyin", "wrongPinyins", "wrongChars", "examples"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: quizItemSchema,
    },
  },
  required: ["items"],
};

export const fetchQuizData = async (): Promise<QuizResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Generate a set of 10 quiz questions for primary school students learning Chinese characters (Hanzi).
      Select 10 random, common characters suitable for grades 1-3.
      
      For each character, provide:
      1. The character itself.
      2. Its correct Pinyin.
      3. 3 distractors (wrong Pinyin).
      4. 3 distractors (wrong characters).
      5. 3 common words or idioms (词语) that use this character, along with their Pinyin.
      
      Ensure the examples are simple and easy for children to understand.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a friendly teacher creating educational content for children.",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from Gemini");
    }

    return JSON.parse(text) as QuizResponse;
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    throw error;
  }
};

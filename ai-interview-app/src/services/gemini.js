import { GoogleGenAI } from "@google/genai";

// Add your Gemini API key here
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function askGemini(topic) {

    const response = await ai.models.generateContent({

        model: "gemini-3.5-flash-lite",

        contents: `Give me one beginner interview question on ${topic} only.`

    });

    return response.text;

}
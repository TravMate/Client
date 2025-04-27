import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || ""
);

export interface PlaceRecommendations {
  visitTips: string[];
  budgetTips: string[];
  photoSpots: string[];
  bestTimes: string[];
}

export async function generatePlaceRecommendations(
  placeName: string,
  placeAddress: string
): Promise<PlaceRecommendations> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As an AI travel assistant, please provide detailed recommendations for visiting ${placeName} located at ${placeAddress}. Format the response in JSON with the following structure:
{
  "visitTips": ["3-4 practical tips for visiting the place, each as a separate bullet point"],
  "budgetTips": ["2-3 specific tips for saving money, each as a separate bullet point"],
  "photoSpots": ["2-3 best spots or angles for taking photos, each as a separate bullet point"],
  "bestTimes": ["2-3 best times to visit, each as a separate bullet point"]
}

Please ensure each field contains an array of strings, with each string being a separate tip or point. The response must be strictly in valid JSON format.`;

    // Use structured output to ensure we get valid JSON
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = await result.response;
    const text = response.text();

    try {
      // Parse the JSON response
      return JSON.parse(text);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw parseError;
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return {
      visitTips: [
        "Unable to generate visit tips at this time. Please try again later.",
      ],
      budgetTips: [
        "Unable to generate budget tips at this time. Please try again later.",
      ],
      photoSpots: [
        "Unable to generate photo spot recommendations at this time. Please try again later.",
      ],
      bestTimes: [
        "Unable to generate best times recommendations at this time. Please try again later.",
      ],
    };
  }
}

export async function generatePlaceAnswer(
  placeName: string,
  placeAddress: string,
  question: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As an AI travel assistant, please answer the following question about ${placeName} located at ${placeAddress}:

Question: ${question}

Please provide a concise but informative answer that would be helpful for a tourist. Focus on practical, accurate information.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating answer:", error);
    return "Sorry, I couldn't generate an answer at this time. Please try again later.";
  }
}

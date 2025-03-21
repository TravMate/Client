import axios from "axios";
import { Place } from "@/types/type";

const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";

interface GoogleAutocompleteResponse {
  suggestions?: Array<{
    placePrediction?: {
      place?: string;
      placeId?: string;
      text?: {
        text?: string;
        matches?: Array<{ startOffset: number; endOffset: number }>;
      };
      structuredFormat?: {
        mainText?: {
          text?: string;
          matches?: Array<{ startOffset: number; endOffset: number }>;
        };
        secondaryText?: {
          text?: string;
        };
      };
      location?: { latitude: number; longitude: number };
      types?: string[];
      distanceMeters?: number;
    };
  }>;
}

export const fetchAutocompletePlacesNew = async (
  input: string
): Promise<Place[]> => {
  try {
    // Validate API key before making requests
    if (!PLACES_API_KEY?.startsWith("AIza")) {
      throw new Error("Invalid Google Places API key format");
    }

    // Return early for empty input
    if (!input.trim()) return [];

    const response = await axios.post<GoogleAutocompleteResponse>(
      AUTOCOMPLETE_URL,
      {
        input: input.trim(),
        locationBias: {
          circle: {
            center: {
              latitude: 30.0444,
              longitude: 31.2357,
            },
            radius: 15000.0,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "*",
          // "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types,suggestions.placePrediction.distanceMeters",
        },
        timeout: 5000,
      }
    );

    // Validate response structure
    if (!response.data?.suggestions) {
      return [];
    }

    return response.data.suggestions
      .filter(
        (suggestion) =>
          suggestion?.placePrediction?.placeId &&
          suggestion.placePrediction.structuredFormat?.mainText?.text
      )
      .map(({ placePrediction }) => {
        // Use non-null assertion after filtering
        const pp = placePrediction!;

        return {
          id: pp.placeId!,
          name: pp.structuredFormat!.mainText!.text!,
          description: pp.text?.text || "",
          placeId: pp.placeId!,
          types: pp.types || [],
          primaryType: pp.types?.[0] || "location",
          distanceMeters: pp.distanceMeters,
          matchOffset: pp.text?.matches?.[0]?.endOffset || 0,
        };
      });
  } catch (error) {
    console.error("Places API Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      console.error("API Error Details:", errorMessage);
    }

    return [];
  }
};

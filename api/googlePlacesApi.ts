import axios from "axios";
import { Place } from "@/types/type";
const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";

export const fetchTourismPlacesApi = async (
  radius: number
): Promise<Place[]> => {
  try {
    // Validate API key format
    if (!PLACES_API_KEY?.startsWith("AIza")) {
      throw new Error("Invalid Google Places API key format");
    }

    const requestBody = {
      includedTypes: ["tourist_attraction"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: 30.0444, // Cairo coordinates
            longitude: 31.2357,
          },
          radius: radius, // 20 kilometers
        },
      },
    };

    const response = await axios.post(BASE_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.location,places.types,places.rating,places.userRatingCount,places.photos,places.formattedAddress",
      },
    });

    // Validate response structure
    if (!response.data?.places) {
      throw new Error("Invalid API response format");
    }

    // console.log(
    //   response.data.places.map((place: any) => ({
    //     id: place.id,
    //     displayName: place.displayName,
    //     location: place.location,
    //     types: place.types,
    //     rating: place.rating,
    //     userRatingCount: place.userRatingCount,
    //     photos: place.photos,
    //     formattedAddress: place.formattedAddress,
    //   }))
    // );

    return response.data.places.map((place: any) => ({
      id: place.id,
      displayName: place.displayName,
      location: place.location,
      types: place.types,
      rating: place.rating,
      userRatingCount: place.userRatingCount,
      photos: place.photos,
      formattedAddress: place.formattedAddress,
    }));
  } catch (error) {
    console.error("Error fetching tourism places:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Places API Error: ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch tourism places");
  }
};

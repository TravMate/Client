import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places";

interface PlaceDetailsParams {
  placeId: string;
}

interface PlaceDetailsResponse {
  id: string;
  displayName: {
    text: string;
  };
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
  // Add other fields you might need
}

export const usePlaceDetails = (params: PlaceDetailsParams) => {
  return useQuery({
    queryKey: ["placeDetails", params.placeId],
    queryFn: async () => {
      if (!params.placeId) {
        throw new Error("Place ID is required");
      }

      try {
        const response = await axios.get<PlaceDetailsResponse>(
          `${PLACES_DETAILS_URL}/${params.placeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": PLACES_API_KEY,
              "X-Goog-FieldMask": "id,displayName,photos",
            },
            timeout: 5000,
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching place details:", error);
        throw new Error("Failed to fetch place details");
      }
    },
    enabled: !!params.placeId && !!PLACES_API_KEY,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

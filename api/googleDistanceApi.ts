import { TripPlace } from "@/store/planTripStore";
import { LocationObject } from "expo-location";

export interface RouteInfo {
  placeId: string;
  placeName: string;
  distance: number;
  duration: number;
}

export const fetchRouteMatrix = async (
  apiKey: string,
  userLocation: { latitude: number; longitude: number },
  places: TripPlace[]
): Promise<RouteInfo[]> => {
  try {
    // Validate inputs
    if (!apiKey) throw new Error("Missing API key");
    if (!userLocation) throw new Error("Missing user location");
    if (!places?.length) throw new Error("No places provided");

    // Use correct format for Google Routes API V2
    const requestBody = {
      origin: {
        location: {
          latLng: {
            // latitude: userLocation.latitude,
            // longitude: userLocation.longitude,
            latitude: 30.0444,
            longitude: 31.2357,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: places[places.length - 1].latitude,
            longitude: places[places.length - 1].longitude,
          },
        },
      },
      intermediates: places.slice(0, -1).map((place) => ({
        location: {
          latLng: {
            latitude: place.latitude,
            longitude: place.longitude,
          },
        },
      })),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      languageCode: "en-US",
      units: "METRIC",
    };

    console.log("Request body:", JSON.stringify(requestBody));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.legs",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    // Log response details
    console.log("Response status:", response.status);
    console.log("Response content-type:", response.headers.get("content-type"));

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const responseText = await response.text();
      console.error(
        "Non-JSON response:",
        responseText.substring(0, 200) + "..."
      );
      throw new Error(`Invalid response format: ${contentType}`);
    }

    const data = await response.json();
    console.log(
      "Response data:",
      JSON.stringify(data).substring(0, 200) + "..."
    );

    if (!response.ok) {
      const errorMessage = data.error?.message || `HTTP ${response.status}`;
      throw new Error(`API Error: ${errorMessage}`);
    }

    if (!data.routes || !data.routes[0] || !data.routes[0].legs) {
      throw new Error("Invalid response format: missing routes or legs");
    }

    const legs = data.routes[0].legs;

    // Process route data
    return places.map((place, index) => {
      const leg = legs[index];
      return {
        placeId: place.id,
        placeName: place.name,
        distance: leg.distanceMeters / 1000, // Convert to km
        duration: parseFloat((leg.duration.seconds / 60).toFixed(1)), // Convert to minutes
      };
    });
  } catch (error) {
    console.error("Route matrix fetch error:", error);
    throw new Error(
      `Failed to fetch route matrix: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

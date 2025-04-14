import { PlacePrediction } from "@/components/map/GooglePlacesAutoComplete";

export interface RouteInfo {
  place: PlacePrediction;
  distance: number;
  polyline?: string; // Added for route drawing
  legs?: Array<{
    startLocation: { latLng: { latitude: number; longitude: number } };
    endLocation: { latLng: { latitude: number; longitude: number } };
    polyline: string;
  }>;
}

export const fetchRouteMatrix = async (
  apiKey: string,
  userLocation: { latitude: number; longitude: number },
  places: PlacePrediction[]
): Promise<RouteInfo[]> => {
  try {
    // Validate inputs
    if (!apiKey) throw new Error("Missing API key");
    if (!userLocation) throw new Error("Missing user location");
    if (!places?.length) throw new Error("No places provided");

    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: 30.0444,
            longitude: 31.2357,
          },
        },
      },
      destination: {
        placeId: places[places.length - 1].placeId,
      },
      intermediates: places.slice(0, -1).map((place) => ({
        placeId: place.placeId,
      })),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      languageCode: "en-US",
      units: "METRIC",
    };

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
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.distanceMeters,routes.legs.duration,routes.legs.polyline.encodedPolyline,routes.legs.steps.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes?.[0]) {
      throw new Error("No routes found in response");
    }

    const route = data.routes[0];
    const legs = route.legs || [];

    return places.map((place, index) => ({
      place,
      distance: legs[index]?.distanceMeters
        ? legs[index].distanceMeters / 1000
        : 0,
      polyline: route.polyline?.encodedPolyline, // Full route polyline
      legs: legs.map((leg) => ({
        startLocation: leg.startLocation,
        endLocation: leg.endLocation,
        polyline: leg.polyline?.encodedPolyline,
      })),
    }));
  } catch (error) {
    console.error("Route matrix fetch error:", error);
    throw new Error(
      `Failed to fetch route matrix: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

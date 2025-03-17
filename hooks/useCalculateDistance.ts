import { useQuery } from "@tanstack/react-query";
import { fetchRouteMatrix } from "@/api/googleDistanceApi";
import { TripPlace } from "@/store/planTripStore";
import * as Location from "expo-location";

const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Location permission denied");

  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export const useRouteMatrix = (places: TripPlace[]) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  return useQuery({
    queryKey: ["routeMatrix", places.map((p) => p.id).join("-")],
    queryFn: async () => {
      if (!apiKey) throw new Error("API key not configured");

      // Get fresh location for each request
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied");

      const location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      return fetchRouteMatrix(apiKey, userLocation, places);
    },
    enabled: !!apiKey && places.length > 0,
    retry: (failureCount, error) => {
      // Don't retry for these errors
      if (
        error.message.includes("permission") ||
        error.message.includes("API key")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

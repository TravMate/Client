import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlacePrediction } from "@/components/map/GooglePlacesAutoComplete";
import { Place } from "@/types/type";

export interface TripPlace {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  geometry?: any;
  distanceMeters?: number;
  description?: string;
}

interface PlanTripState {
  places: PlacePrediction[];
  addPlace: (place: PlacePrediction) => void;
  removePlace: (id: string) => void;
  clearPlaces: () => void;
}

const usePlanTripStore = create<PlanTripState>()(
  persist(
    (set, get) => ({
      places: [],
      addPlace: (place) => {
        set((state) => ({
          // Check if the place already exists in the list
          places: state.places.some((p) => p.placeId === place.placeId)
            ? state.places
            : [...state.places, place],
        }));
      },
      removePlace: (id: string) => {
        set((state) => ({
          places: state.places.filter((place) => place.placeId !== id),
        }));
      },
      clearPlaces: () => set({ places: [] }),
    }),
    {
      name: "plan-trip-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

export default usePlanTripStore;

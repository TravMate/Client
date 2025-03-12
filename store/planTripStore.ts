import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TripPlace {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  geometry?: any;
}

interface PlanTripState {
  places: TripPlace[];
  addPlace: (place: TripPlace) => void;
  removePlace: (id: string) => void;
  clearPlaces: () => void;
}

const usePlanTripStore = create<PlanTripState>()(
  persist(
    (set, get) => ({
      places: [],
      addPlace: (place) => {
        set((state) => ({
          places: [...state.places, place],
        }));
      },
      removePlace: (id) => {
        set((state) => ({
          places: state.places.filter((place) => place.id !== id),
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

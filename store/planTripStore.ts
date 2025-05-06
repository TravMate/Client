import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlacePrediction } from "@/components/map/GooglePlacesAutoComplete";
import { Place } from "@/types/type";
import { useGuideStore } from "./guideStore";

export interface TripPlace extends PlacePrediction {
  duration?: number; // Duration in minutes
}

interface PriceBreakdown {
  transportation: number;
  guide: number;
  car: number;
  serviceFee: number;
  total: number;
}

interface PlanTripState {
  places: TripPlace[];
  addPlace: (place: PlacePrediction) => void;
  removePlace: (id: string) => void;
  clearPlaces: () => void;
  updatePlaceDuration: (placeId: string, duration: number) => void;
  calculateTripPrice: (routes: any[], selectedGuideId: string | null) => number;
  getTripPriceBreakdown: (
    routes: any[],
    selectedGuideId: string | null
  ) => PriceBreakdown;
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
            : [...state.places, { ...place, duration: 60 }], // Default duration: 60 minutes
        }));
      },
      removePlace: (id: string) => {
        set((state) => ({
          places: state.places.filter((place) => place.placeId !== id),
        }));
      },
      clearPlaces: () => set({ places: [] }),
      updatePlaceDuration: (placeId: string, duration: number) => {
        set((state) => ({
          places: state.places.map((place) =>
            place.placeId === placeId ? { ...place, duration } : place
          ),
        }));
      },
      calculateTripPrice: (routes: any[], selectedGuideId: string | null) => {
        const breakdown = get().getTripPriceBreakdown(routes, selectedGuideId);
        return breakdown.total;
      },
      getTripPriceBreakdown: (
        routes: any[],
        selectedGuideId: string | null
      ) => {
        // --- All cost rates/constants here ---
        const TRANSPORTATION_RATE_PER_KM = 0.5; // $ per km
        const CAR_RATE_PER_KM = 0.2; // $ per km
        const SERVICE_FEE_PERCENT = 0.05; // 5%

        const state = get();
        const { guides } = useGuideStore.getState();

        // Calculate total distance (km) from routes
        const totalDistance = Array.isArray(routes)
          ? routes.reduce((acc, route) => acc + (route.distance || 0), 0)
          : 0;

        // Calculate total duration (minutes) from places
        const totalMinutes = state.places.reduce(
          (acc, place) => acc + (place.duration || 60),
          0
        );
        const totalHours = Math.ceil(totalMinutes / 60);

        // Dynamic cost calculations
        const transportation = Math.round(
          totalDistance * TRANSPORTATION_RATE_PER_KM
        );
        const car = Math.round(totalDistance * CAR_RATE_PER_KM);
        let guide = 0;
        if (selectedGuideId) {
          const selectedGuide = guides.find((g) => g.$id === selectedGuideId);
          if (selectedGuide) {
            // Guide price is now hourly rate
            guide = selectedGuide.price * totalHours;
          }
        }

        // Subtotal before service fee
        const subtotal = transportation + car + guide;
        // Service fee: percent of subtotal
        const serviceFee = Math.round(subtotal * SERVICE_FEE_PERCENT);
        const total = subtotal + serviceFee;
        return { transportation, guide, car, serviceFee, total };
      },
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

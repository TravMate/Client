import { create } from "zustand";
import { Trip, getUserTrips } from "@/lib/trips";

interface TripsState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  fetchUserTrips: () => Promise<void>;
}

export const useTripsStore = create<TripsState>()((set) => ({
  trips: [],
  loading: false,
  error: null,
  fetchUserTrips: async () => {
    try {
      set({ loading: true, error: null });
      const trips = await getUserTrips();
      set({ trips, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch trips",
        loading: false,
      });
    }
  },
}));

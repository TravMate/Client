import { create } from "zustand";
import { database, getFavoritePlaces } from "@/lib/favoritePlaces"; // Adjust the import path
import { Account, Client, ID, Query } from "react-native-appwrite"; // Correct import

const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;

const client = new Client()
  .setProject(`${PROJECT_ID}`)
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setPlatform("com.company.travmate");

interface FavoriteStore {
  favoriteIds: string[]; // Array of place IDs
  loading: boolean; // Loading state
  addFavorite: (placeId: string) => void;
  removeFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  loadFavorites: () => Promise<void>; // Load favorites for a specific user
}

const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_COLLECTION_ID;

// Fetch the authenticated user's details

if (!DATABASE_ID || !COLLECTION_ID) {
  throw new Error(
    "Database ID or Collection ID is not defined in environment variables."
  );
}

const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favoriteIds: [],
  loading: true, // Initialize loading state
  addFavorite: async (placeId: string) => {
    try {
      const account = new Account(client);
      const user = await account.get();
      // Add the favorite to the Appwrite database
      await database.createDocument(
        DATABASE_ID, // Database ID
        COLLECTION_ID, // Collection ID
        ID.unique(), // Document ID (auto-generated)
        {
          userId: user.$id,
          placeId,
        }
      );

      // Update local state
      set((state) => ({
        favoriteIds: [...state.favoriteIds, placeId],
      }));
      console.log("favoriteIds", get().favoriteIds);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  },
  removeFavorite: async (placeId: string) => {
    try {
      const account = new Account(client);
      const user = await account.get();
      // Fetch the document ID for the favorite using the proper query syntax
      const response = await database.listDocuments(
        DATABASE_ID, // Database ID
        COLLECTION_ID, // Collection ID
        [Query.equal("userId", user.$id), Query.equal("placeId", placeId)] // Proper query
      );

      if (response.documents.length > 0) {
        const documentId = response.documents[0].$id;

        // Delete the favorite from the Appwrite database
        await database.deleteDocument(
          DATABASE_ID, // Database ID
          COLLECTION_ID, // Collection ID
          documentId // Document ID
        );

        // Update local state
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== placeId),
        }));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  },
  isFavorite: (placeId: string) => {
    return get().favoriteIds.includes(placeId);
  },
  loadFavorites: async () => {
    set({ loading: true });
    try {
      const response = await getFavoritePlaces();

      // If response has a `documents` array (Appwrite standard):
      const favoriteIds = response.map((doc) => doc.placeId);

      set({ favoriteIds, loading: false });
    } catch (error) {
      console.error("Error loading favorites:", error);
      set({ favoriteIds: [], loading: false });
    }
  },
}));

export default useFavoriteStore;

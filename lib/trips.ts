import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
const TRIPS_COLLECTION_ID = process.env.EXPO_PUBLIC_TRIPS_COLLECTION_ID;

const client = new Client()
  .setProject(`${PROJECT_ID}`)
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setPlatform("com.company.travmate");

const database = new Databases(client);

export interface Trip {
  $id?: string;
  userId: string;
  places: any[];
  guideId: string | null;
  totalAmount: number;
  status: "booked" | "cancelled";
  paymentIntentId: string;
  createdAt: Date;
  withGuidance: boolean;
}

export async function createTrip(tripData: Omit<Trip, "$id">) {
  try {
    return await database.createDocument(
      `${DATABASE_ID}`,
      `${TRIPS_COLLECTION_ID}`,
      ID.unique(),
      tripData
    );
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
}

export async function getUserTrips() {
  try {
    const account = new Account(client);
    const user = await account.get();
    const response = await database.listDocuments(
      `${DATABASE_ID}`,
      `${TRIPS_COLLECTION_ID}`,
      [Query.equal("userId", user?.$id)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching user trips:", error);
    throw error;
  }
}

export async function getTripById(tripId: string) {
  try {
    return await database.getDocument(
      `${DATABASE_ID}`,
      `${TRIPS_COLLECTION_ID}`,
      tripId
    );
  } catch (error) {
    console.error("Error fetching trip:", error);
    throw error;
  }
}

import { Account, Client, Databases, Query } from "react-native-appwrite";

const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;

const client = new Client()
  .setProject(`${PROJECT_ID}`)
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setPlatform("com.company.travmate");

const database = new Databases(client);

export { database };

const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_COLLECTION_ID;

export const addFavoritePlace = async (placeId: string) => {
  try {
    const account = new Account(client);
    const user = await account.get();
    const response = await database.createDocument(
      `${DATABASE_ID}`,
      `${COLLECTION_ID}`,
      "unique()",
      {
        userId: user.$id,
        placeId: placeId,
      }
    );
    // console.log(response);
    return response;
  } catch (error) {
    console.error("Error adding favorite place:", error);
    throw error;
  }
};

export const getFavoritePlaces = async () => {
  try {
    const account = new Account(client);
    const user = await account.get(); // Fetch the authenticated user's details

    const response = await database.listDocuments(
      `${DATABASE_ID}`,
      `${COLLECTION_ID}`,
      [
        Query.equal("userId", user.$id), // Fetch movies only for this user
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching favorite places:", error);
    throw error;
  }
};

export const removeFavoritePlace = async (documentId: string) => {
  try {
    const response = await database.deleteDocument(
      `${DATABASE_ID}`,
      `${COLLECTION_ID}`,
      documentId
    );
    return response;
  } catch (error) {
    console.error("Error removing favorite place:", error);
    throw error;
  }
};

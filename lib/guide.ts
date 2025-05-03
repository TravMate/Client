import { Client, Databases, Storage } from "react-native-appwrite";

const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_GUIDE_COLLECTOION_ID;
const BUCKET_ID = process.env.EXPO_PUBLIC_BUCKET_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject(`${PROJECT_ID}`); // Replace with your project ID

const databases = new Databases(client);
const storage = new Storage(client);

async function fetchGuidesWithImages() {
  try {
    // 1. Fetch all guide documents
    const response = await databases.listDocuments(
      `${DATABASE_ID}`, // Replace with your database ID
      `${COLLECTION_ID}` // Your collection ID
    );

    // 2. Map through documents and add image URLs
    const guidesWithImages = await Promise.all(
      response.documents.map(async (guide) => {
        let guideImageUrl = null;
        let carImageUrl = null;

        if (guide.guideImageId && guide.carImageId) {
          // 3. Get image URL from Storage
          guideImageUrl = storage.getFileView(
            `${BUCKET_ID}`, // Replace with your storage bucket ID
            guide.guideImageId
          );
          carImageUrl = storage.getFileView(
            `${BUCKET_ID}`, // Replace with your storage bucket ID
            guide.carImageId
          );
        }

        return {
          ...guide,
          guideImageUrl, // Add the URL to the guide object
          carImageUrl,
        };
      })
    );

    return guidesWithImages;
  } catch (error) {
    console.error("Error fetching guides:", error);
    return [];
  }
}

export { fetchGuidesWithImages };

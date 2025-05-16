import { Client, Databases, Storage } from "react-native-appwrite";
import { Guide } from "@/components/ChooseGuide";

const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;
const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_GUIDE_COLLECTION_ID;
const BUCKET_ID = process.env.EXPO_PUBLIC_BUCKET_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(`${PROJECT_ID}`);

const databases = new Databases(client);
const storage = new Storage(client);

async function fetchGuidesWithImages() {
  try {
    const response = await databases.listDocuments(
      `${DATABASE_ID}`,
      `${COLLECTION_ID}`
    );

    const guidesWithImages = await Promise.all(
      response.documents.map(async (guide) => {
        let guideImageUrl = null;
        let carImageUrl = null;

        if (guide.guideImageId && guide.carImageId) {
          const guideImageViewUrl = storage.getFileView(
            `${BUCKET_ID}`,
            guide.guideImageId
          );
          const carImageViewUrl = storage.getFileView(
            `${BUCKET_ID}`,
            guide.carImageId
          );
          guideImageUrl = guideImageViewUrl.href;
          carImageUrl = carImageViewUrl.href;
        }

        return {
          ...guide,
          guideImageUrl,
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

async function fetchGuideById(guideId: string): Promise<Guide | null> {
  try {
    const guide = await databases.getDocument(
      `${DATABASE_ID}`,
      `${COLLECTION_ID}`,
      guideId
    );

    let guideImageUrl = null;
    let carImageUrl = null;

    if (guide.guideImageId && guide.carImageId) {
      const guideImageViewUrl = storage.getFileView(
        `${BUCKET_ID}`,
        guide.guideImageId
      );
      const carImageViewUrl = storage.getFileView(
        `${BUCKET_ID}`,
        guide.carImageId
      );
      guideImageUrl = guideImageViewUrl.href;
      carImageUrl = carImageViewUrl.href;
    }

    return {
      $id: guide.$id,
      name: guide.name,
      price: guide.price,
      rating: guide.rating,
      guideImageUrl,
      carImageUrl,
      $createdAt: guide.$createdAt,
      $updatedAt: guide.$updatedAt,
      $collectionId: guide.$collectionId,
      $databaseId: guide.$databaseId,
      $permissions: guide.$permissions,
    };
  } catch (error) {
    console.error("Error fetching guide:", error);
    return null;
  }
}

export { fetchGuidesWithImages, fetchGuideById };

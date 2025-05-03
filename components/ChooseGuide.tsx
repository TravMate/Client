import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchGuidesWithImages } from "@/lib/guide";
import GuideCard from "./GuideCard";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useGuideStore } from "@/store/guideStore";

export interface Guide {
  $id: string;
  name: string;
  price: number;
  rating: number;
  guideImageUrl: string | null;
  carImageUrl: string | null;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
}

const GuideCardSkeleton = () => {
  return (
    <View style={styles.smallContainer}>
      <ShimmerPlaceholder
        style={styles.smallCard}
        LinearGradient={LinearGradient}
      />
    </View>
  );
};

const ChooseGuide = () => {
  // const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { guides, selectedGuide, setGuides, setSelectedGuide } =
    useGuideStore();

  // console.log("Guides from store:", guides);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const guidesData = await fetchGuidesWithImages();
        setGuides((guidesData as Guide[]) || []);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <GuideCardSkeleton />
        <View style={{ height: 10 }} />
        <GuideCardSkeleton />
        <View style={{ height: 10 }} />
        <GuideCardSkeleton />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={guides}
        renderItem={({ item }) => (
          <GuideCard
            item={{
              id: item.$id,
              name: item.name,
              price: item.price,
              rating: item.rating,
              imageUrl: item.guideImageUrl || undefined,
              carImageUrl: item.carImageUrl || undefined,
              time: 0, // Add a default value if needed
            }}
            selected={selectedGuide!}
            setSelected={() => setSelectedGuide(item.$id)}
          />
        )}
        keyExtractor={(item) => item.$id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.listContainer}
      />
    </View>
  );
};

export default ChooseGuide;

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 25,
  },
  loadingContainer: {
    padding: 16,
    marginTop: 25,
  },
  smallContainer: {
    borderRadius: 10,
  },
  smallCard: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
});

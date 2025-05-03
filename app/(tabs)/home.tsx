import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useFetchTourismPlaces } from "@/hooks/FetchTourismPLaces";
import SwipList from "@/components/SwipList";
import PlacesList from "@/components/PlacesList";
import useFavoriteStore from "@/store/favoriteStore";
import ScreenLoadingSkeleton from "@/components/ScreenLoadingSkeleton";

const home = () => {
  const { data, isLoading } = useFetchTourismPlaces();
  const { loadFavorites, loading } = useFavoriteStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  if (isLoading || loading) {
    return <ScreenLoadingSkeleton />;
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-1 p-6">
        <Text className="text-2xl font-bold">
          Commented out to save requests
        </Text>
      </View>
      {/* <View className="flex-1 pt-6">
        <Text className="text-2xl font-bold mb-5 ml-5">Places near to you</Text>
        <SwipList data={data || []} />
      </View>

      <View className="flex-1">
        <PlacesList data={data || []} title="Places in this City" />
      </View>

      <View className="flex-1">
        <PlacesList data={data || []} title="Explore the Country" />
      </View> */}
    </ScrollView>
  );
};

export default home;

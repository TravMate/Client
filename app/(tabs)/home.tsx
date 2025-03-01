import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchTourismPlacesApi } from "@/api/googlePlacesApi";
import { useFetchTourismPlaces } from "@/hooks/FetchTourismPLaces";
import SwipList from "@/components/SwipList";
import PlacesList from "@/components/PlacesList";
import useFavoriteStore from "@/store";

const home = () => {
  const { data, isLoading } = useFetchTourismPlaces();
  const { loadFavorites, loading } = useFavoriteStore();

  // console.log(data);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    loadFavorites();
    fetchTourismPlacesApi().then((data) => setPlaces(data));
  }, []);

  if (isLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="flex-1 pt-6">
        <Text className="text-2xl font-bold mb-5 ml-5">Places near to you</Text>
        <SwipList data={data} />
      </View>

      <View className="flex-1">
        <PlacesList data={data} title="Places in this City" />
      </View>

      <View className="flex-1">
        <PlacesList data={data} title="Explore the Country" />
      </View>
    </ScrollView>
  );
};

export default home;

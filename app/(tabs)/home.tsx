import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { logout } from "@/lib/auth";
import { router } from "expo-router";
import { fetchTourismPlacesApi } from "@/api/googlePlacesApi";
import { images } from "@/constants";
import { useFetchTourismPlaces } from "@/hooks/FetchTourismPLaces";
import SwipList from "@/components/SwipList";
import PlacesList from "@/components/PlacesList";

const home = () => {
  const { data, isLoading } = useFetchTourismPlaces();
  // console.log(data);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetchTourismPlacesApi().then((data) => setPlaces(data));
  }, []);

  if (isLoading) {
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

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
});

import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BigPlaceCard from "@/components/BigPlaceCard";
import { Place } from "@/types/type";
import useFavoriteStore from "@/store/favoriteStore";
import { router } from "expo-router";
import * as Icons from "react-native-heroicons/outline";
import { useFetchTourismPlaces } from "@/hooks/FetchTourismPLaces";




const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2 + CARD_GAP)) / 2;

const buttonStyles = {
  shadowColor: "rgba(0, 0, 0, 0.1)",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 1,
  shadowRadius: 4,
  elevation: 4,
};

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { favoriteIds, loadFavorites } = useFavoriteStore();
  const { data, isLoading } = useFetchTourismPlaces(20000);

  useEffect(() => {
    loadFavorites();
  }, []);

  const filteredPlaces =
    data?.filter((p) => p.id && favoriteIds.includes(p.id)) || [];

  const renderItem = ({ item }: { item: Place }) => (
    <View style={{ width: CARD_WIDTH }}>
      <BigPlaceCard item={item} variation="small" key={item.id} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative px-5 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white rounded-full p-2"
            style={buttonStyles}
          >
            <Icons.ChevronLeftIcon size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-center ml-24">
            Favorites
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-2 border border-gray-200 shadow-lg">
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-grey-500"
            placeholderTextColor="#666"
          />
          <Icons.MagnifyingGlassIcon size={20} color="#666" />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF7043" />
        </View>
      ) : filteredPlaces.length === 0 ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-xl text-gray-500 text-center">
            {searchQuery.trim() === ""
              ? "You haven't saved any places yet"
              : "No places found matching your search"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlaces}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING }}
          columnWrapperStyle={{ gap: CARD_GAP, marginBottom: CARD_GAP }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Favorites;

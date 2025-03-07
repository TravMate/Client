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
import useFavoriteStore from "@/store";
import { router } from "expo-router";
import * as Icons from "react-native-heroicons/outline";

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
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { favoriteIds, loadFavorites } = useFavoriteStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const placesData = await Promise.all(
          favoriteIds.map(async (placeId) => {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,vicinity,photos,place_id&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
            );
            const data = await response.json();
            if (data.result) {
              return {
                place_id: data.result.place_id,
                name: data.result.name,
                vicinity: data.result.vicinity,
                photos: data.result.photos,
              };
            }
            return null;
          })
        );
        const validPlaces = placesData.filter(
          (place): place is Place => place !== null
        );
        setPlaces(validPlaces);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (favoriteIds.length > 0) {
      fetchPlaces();
    } else {
      setIsLoading(false);
    }
  }, [favoriteIds]);

  const filteredPlaces = React.useMemo(() => {
    if (!searchQuery.trim()) return places;

    const query = searchQuery.toLowerCase().trim();
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.vicinity.toLowerCase().includes(query)
    );
  }, [places, searchQuery]);

  const renderItem = ({ item }: { item: Place }) => (
    <View style={{ width: CARD_WIDTH }}>
      <BigPlaceCard item={item} variation="small" />
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
          <ActivityIndicator size="large" color="#F98C53" />
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
          keyExtractor={(item) => item.place_id}
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

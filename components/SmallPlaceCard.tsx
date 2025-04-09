import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Place } from "@/types/type";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useFavoriteStore from "@/store/favoriteStore"; // Adjust the import path
import { useFetchTourismPlaces } from "@/hooks/FetchTourismPLaces";
import PlaceCardSkeleton from "./PlaceCardSkeleton";

interface SmallPlaceCardProps {
  item: Place;
}

type RootStackParamList = {
  PlaceDetails: { placeData: Place; isFav: boolean; photoUrl: string };
};

type PlaceDetailsNavigationProp = NavigationProp<
  RootStackParamList,
  "PlaceDetails"
>;

var width = Dimensions.get("window").width;
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const SmallPlaceCard = ({ item }: SmallPlaceCardProps) => {
  const navigation = useNavigation<PlaceDetailsNavigationProp>();
  const [isFav, setIsFav] = useState(false);

  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  useEffect(() => {
    isFavorite(item.id) ? setIsFav(true) : setIsFav(false);
  }, [item.id]);

  const url = `https://places.googleapis.com/v1/${
    item.photos ? item.photos[0].name : ""
  }/media?maxHeightPx=400&maxWidthPx=400&key=${
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY
  }`;

  const handleFavoritePress = () => {
    if (!isFav) {
      addFavorite(item.id);
    } else {
      removeFavorite(item.id);
    }
    setIsFav(!isFav);
  };

  const handleCardPress = () => {
    navigation.navigate("PlaceDetails", {
      placeData: item,
      isFav: isFav,
      photoUrl: url || "",
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={{
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#fff",
        elevation: 5,
        position: "relative",
        width: width * 0.5,
        marginHorizontal: 10,
      }}
    >
      {/* Background Image */}
      {url ? (
        <Image
          source={{ uri: url }}
          style={{
            width: width * 0.55,
            height: width * 0.55,
            borderRadius: 10,
          }}
          resizeMode="cover"
          onError={() => {
            useFetchTourismPlaces();
          }}
        />
      ) : (
        <PlaceCardSkeleton size="small" />
      )}

      {/* Gradient Overlay */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      />

      {/* Location & Title */}
      <View
        style={{
          position: "absolute",
          bottom: 15,
          left: 15,
          width: "100%",
        }}
      >
        <Text
          className="text-white font-bold text-lg"
          style={{
            color: "white",
            width: "85%",
          }}
        >
          {item.displayName.text}
        </Text>
      </View>

      {/* Favorite (Heart) Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 15,
          right: 15,
          backgroundColor: "#fff",
          borderRadius: 25,
          padding: 10,
        }}
        onPress={handleFavoritePress}
      >
        {isFav ? (
          <SolidIcons.HeartIcon size={24} color="#F98C53" />
        ) : (
          <OutlineIcons.HeartIcon size={24} color="#F98C53" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SmallPlaceCard;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

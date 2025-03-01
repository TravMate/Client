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
import useFavoriteStore from "@/store"; // Adjust the import path

interface SmallPlaceCardProps {
  item: Place;
}

type RootStackParamList = {
  PlaceDetails: { placeData: Place; isFav: boolean };
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
    isFavorite(item.place_id) ? setIsFav(true) : setIsFav(false);
  }, [item.place_id]);

  const handleFavoritePress = () => {
    if (!isFav) {
      addFavorite(item.place_id);
    } else {
      removeFavorite(item.place_id);
    }
    setIsFav(!isFav);
  };

  const handleCardPress = () => {
    navigation.navigate("PlaceDetails", {
      placeData: item,
      isFav: isFav,
    });
  };

  // Safely check if item.photos and item.photos[0] exist
  const photoUrl =
    item.photos && item.photos[0] && item.photos[0].photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&photoreference=${item.photos[0].photo_reference}&key=${API_KEY}`
      : null;

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
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={{
            width: width * 0.55,
            height: width * 0.55,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: width * 0.55,
            height: width * 0.55,
            borderRadius: 10,
            backgroundColor: "#e0e0e0", // Placeholder background color
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No Image Available</Text>
        </View>
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
          {item.name}
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

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Place } from "@/types/type";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface SmallPlaceCardProps {
  item: Place;
}

type RootStackParamList = {
  PlaceDetails: { data: Place };
};

type PlaceDetailsNavigationProp = NavigationProp<
  RootStackParamList,
  "PlaceDetails"
>;

var width = Dimensions.get("window").width;
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const SmallPlaceCard = ({ item }: SmallPlaceCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation<PlaceDetailsNavigationProp>();
  const handleCardPress = () => {
    navigation.navigate("PlaceDetails", {
      data: item,
    });
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
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
      <Image
        source={{
          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${width}&photoreference=${item.photos[0].photo_reference}&key=${API_KEY}`,
        }}
        style={{
          width: width * 0.55,
          height: width * 0.55,
          borderRadius: 10,
        }}
        resizeMode="cover"
      />

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
      >
        {isFavorite ? (
          <SolidIcons.HeartIcon
            size={24}
            color="#F98C53"
            onPress={handleFavoritePress}
          />
        ) : (
          <OutlineIcons.HeartIcon
            size={24}
            color="#F98C53"
            onPress={handleFavoritePress}
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SmallPlaceCard;

const styles = StyleSheet.create({});

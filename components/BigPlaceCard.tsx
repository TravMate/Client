import { Dimensions, Image, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Place } from "@/types/type";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useFavoriteStore from "@/store";
import { LinearGradient } from "expo-linear-gradient";
import { useFetchTourismPlaces } from "@/hooks/FetchTourismPLaces";

interface PlaceCardProps {
  item: Place;
  index?: number;
  variation?: "large" | "small";
}

type RootStackParamList = {
  PlaceDetails: { placeData: Place; isFav: boolean; photoUrl: string };
};

type PlaceDetailsNavigationProp = NavigationProp<
  RootStackParamList,
  "PlaceDetails"
>;

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const HORIZONTAL_PADDING = 20;
const SMALL_CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2 + CARD_GAP)) / 2;

const BigPlaceCard = ({ item, variation = "large" }: PlaceCardProps) => {
  const navigation = useNavigation<PlaceDetailsNavigationProp>();
  const [isFav, setIsFav] = useState(false);
  // const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;

  useEffect(() => {
    isFavorite(item?.place_id) ? setIsFav(true) : setIsFav(false);
  }, [item.place_id]);

  // useEffect(() => {
  //   const fetchFreshPhotoUrl = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=photos&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
  //       );
  //       const data = await response.json();

  //       if (data.result?.photos?.[0]?.photo_reference) {
  //         const newPhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.result.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;
  //         setPhotoUrl(newPhotoUrl);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching fresh photo URL:", error);
  //     }
  //   };

  //   fetchFreshPhotoUrl();
  // }, [item.place_id]);

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
      photoUrl: url || "",
    });
  };

  const cardWidth = variation === "large" ? width : SMALL_CARD_WIDTH;
  const cardHeight =
    variation === "large" ? width * 0.6 : SMALL_CARD_WIDTH * 1.6;

  return (
    <View
      style={{
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#fff",
        elevation: 5,
        position: "relative",
      }}
    >
      {/* Background Image */}
      {url ? (
        <Image
          source={{ uri: url }}
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: 20,
          }}
          resizeMode="cover"
          onError={() => {
            useFetchTourismPlaces();
          }}
        />
      ) : (
        <View
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: 20,
            backgroundColor: "#e0e0e0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No Image Available</Text>
        </View>
      )}

      {/* Gradient Overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100%",
          borderRadius: 20,
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
          className="text-md font-bold"
          style={{
            color: "white",
            width: variation === "large" ? "74%" : "100%",
          }}
        >
          {item.vicinity}
        </Text>
        <Text
          className={`text-slate-100 font-bold ${
            variation === "small" ? "text-lg" : "text-2xl"
          }`}
          style={{
            color: "white",
            width: variation === "large" ? "74%" : "100%",
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

      {/* Next (→) Button */}
      {variation === "large" && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 15,
            right: 15,
            backgroundColor: "#fff",
            borderRadius: 25,
            padding: 10,
          }}
          onPress={handleCardPress}
        >
          <OutlineIcons.ChevronRightIcon size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BigPlaceCard;

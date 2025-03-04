import { Dimensions, Image, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Place } from "@/types/type";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useFavoriteStore from "@/store";

interface PlaceCardProps {
  item: Place;
  index?: number;
}

type RootStackParamList = {
  PlaceDetails: { placeData: Place; isFav: boolean };
};

type PlaceDetailsNavigationProp = NavigationProp<
  RootStackParamList,
  "PlaceDetails"
>;

var { width } = Dimensions.get("window");
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const BigPlaceCard = ({ item }: PlaceCardProps) => {
  const navigation = useNavigation<PlaceDetailsNavigationProp>();
  const [isFav, setIsFav] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const { addFavorite, removeFavorite, isFavorite, loading, favoriteIds } =
    useFavoriteStore();

  useEffect(() => {
    isFavorite(item?.place_id) ? setIsFav(true) : setIsFav(false);
  }, [item.place_id]);

  useEffect(() => {
    const fetchFreshPhotoUrl = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=photos&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();

        if (data.result?.photos?.[0]?.photo_reference) {
          const newPhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&photoreference=${data.result.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;
          setPhotoUrl(newPhotoUrl);
        }
      } catch (error) {
        console.error("Error fetching fresh photo URL:", error);
        // Fallback to a default image or handle error as needed
      }
    };

    fetchFreshPhotoUrl();
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
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={{
            width: width,
            height: width * 0.6,
            borderRadius: 20,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: width,
            height: width * 0.6,
            borderRadius: 20,
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
          className="text-md font-bold"
          style={{ color: "white", width: "74%" }}
        >
          {item.vicinity}
        </Text>
        <Text
          className="text-slate-100 font-bold text-2xl"
          style={{
            color: "white",
            width: "74%",
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
    </View>
  );
};

export default BigPlaceCard;

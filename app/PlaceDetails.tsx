import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { act, useEffect, useState } from "react";
import { Place } from "@/types/type";
import { useRoute } from "@react-navigation/native";
import { Image } from "react-native";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { router } from "expo-router";

interface PlaceDetailsProps {
  placeData: Place;
  isFav: boolean;
  photoUrl: string;
}

var width = Dimensions.get("window").width;
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
const geoapifyApiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY; // Replace with your Geoapify API key

const activites = [
  {
    id: 1,
    activity: "Photography Tours",
    icon: <SolidIcons.CameraIcon size={24} color="black" />,
  },
  {
    id: 2,
    activity: "Guided Exploration",
    icon: <SolidIcons.LightBulbIcon size={24} color="black" />,
  },
  {
    id: 3,
    activity: "Visit Historic Landmarks",
    icon: <SolidIcons.MapPinIcon size={24} color="black" />,
  },
];

const PlaceDetails = () => {
  const [placeDetails, setPlaceDetails] = useState<Place | null>(null);
  const [isFav, setIsFav] = useState(false);
  const route = useRoute();
  const data = route.params as PlaceDetailsProps;
  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${placeDetails?.location.longitude},${placeDetails?.location.latitude}&zoom=13&apiKey=${geoapifyApiKey}`;
  useEffect(() => {
    setPlaceDetails(data.placeData);
    setIsFav(data.isFav);
  }, [placeDetails, isFav]);
  const handleChevronLeftPress = () => {
    router.back();
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* image section */}
      <View>
        <Image
          // source={{
          //   uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${placeDetails?.photos[0].photo_reference}&key=${API_KEY}`,
          // }}
          source={{ uri: data.photoUrl }}
          style={{
            width: width,
            height: width * 0.6,
          }}
          resizeMode="cover"
          className="m-auto"
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            backgroundColor: "#fff",
            borderRadius: 25,
            padding: 8,
          }}
          onPress={handleChevronLeftPress}
        >
          <OutlineIcons.ChevronLeftIcon size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            backgroundColor: "#fff",
            borderRadius: 25,
            padding: 8,
          }}
        >
          {isFav ? (
            <SolidIcons.HeartIcon
              size={24}
              color="#F98C53"
              // onPress={handleFavoritePress}
            />
          ) : (
            <OutlineIcons.HeartIcon
              size={24}
              color="#F98C53"
              // onPress={handleFavoritePress}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* details section */}
      <View className="px-5 pt-5">
        {/* name and rating section */}
        <View className="flex flex-row justify-between">
          <View className="w-[40%]">
            <Text className="text-2xl font-bold ">{placeDetails?.name}</Text>
          </View>
          <View className="w-[50%] flex-row align-right justify-center ">
            <SolidIcons.StarIcon color={"#FFC107"} size={22} />
            <Text className="text-xl"> {placeDetails?.rating}</Text>
            <Text className="font-bold text-lg"> | </Text>
            <Text className="text-xl">
              {placeDetails?.userRatingCount} reviews
            </Text>
          </View>
        </View>
        <Text className="text-xl pt-3">{placeDetails?.formattedAddress}</Text>

        {/* opening hours section */}
        {/* <View className="mt-2.5 mb-2.5 items-end">
          {placeDetails?.opening_hours?.open_now.toString() ? (
            <Text className="text-lg font-bold text-lime-500">Open Now</Text>
          ) : (
            <Text className="text-lg font-bold text-red-500">Closed</Text>
          )}
        </View> */}

        {/* activities section */}
        <View className="mt-2">
          {/* Heading */}
          <Text className="text-2xl font-semibold mb-2">Activities</Text>

          {/* Flexbox Layout */}
          <View className="flex flex-row flex-wrap">
            {activites.map((activity) => (
              <View
                className="flex-1 min-w-[150px] sm:min-w-[200px] p-2" // Adjust minimum width for larger screens
                key={activity.id}
              >
                <View className="flex-row items-center gap-2 p-2 border border-gray-400 rounded-full">
                  {activity.icon}
                  <Text className="w-[80%]">{activity.activity}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* location on map section */}
        <View className="mt-4 pb-10">
          <Text className="text-2xl font-semibold mt-2 mb-3">Location</Text>
          <Image
            source={{ uri: mapUrl }}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  mapImage: {
    width: "100%",
    height: 200, // Adjust height as needed
    borderRadius: 8, // Optional: Add rounded corners
  },
});

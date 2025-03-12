import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-get-random-values";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import GoogleTextInput, { GoogleTextInputRef } from "./GoogleTextInput";
import * as SolidIcons from "react-native-heroicons/solid";
import * as OutlineIcons from "react-native-heroicons/outline";
import usePlanTripStore, { TripPlace } from "@/store/planTripStore";

const width = Dimensions.get("window").width;

export default function PlanTrip() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const googleInputRef = useRef<GoogleTextInputRef>(null);

  // Use the Zustand store
  const { places, addPlace: addTripPlace, removePlace } = usePlanTripStore();

  const addPlace = () => {
    if (currentLocation) {
      const newPlace: TripPlace = {
        id: currentLocation.place_id || `place-${Date.now()}`,
        name:
          currentLocation.structured_formatting?.main_text ||
          currentLocation.address?.split(",")[0] ||
          "Selected Place",
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: currentLocation.address,
        geometry: currentLocation.geometry,
      };

      addTripPlace(newPlace);

      // Clear the input after adding
      if (googleInputRef.current) {
        googleInputRef.current.clear();
      }

      setCurrentLocation(null);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className=" z-10">
        <View className="flex-row items-center justify-between w-full">
          <GoogleTextInput
            containerStyle="flex-1"
            handlePress={(data) => {
              // Create a location object with the data from GoogleTextInput
              setCurrentLocation({
                ...data,
                place_id: `place-${Date.now()}`, // Generate a unique ID
                geometry: {
                  location: {
                    lat: data.latitude,
                    lng: data.longitude,
                  },
                },
              });
            }}
          />
        </View>

        <TouchableOpacity
          onPress={addPlace}
          disabled={!currentLocation}
          style={styles.plusButton}
        >
          <PlusCircleIcon
            size={50}
            color={currentLocation ? "#FF7043" : "#ccc"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={places}
        className="flex-1 px-2 mt-3"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className="flex-row items-center justify-between p-3 mb-6 bg-orange-500"
            style={{ width: width * 0.8 }}
          >
            <View className="flex-row ">
              <View className="justify-center items-center">
                <SolidIcons.MapPinIcon size={30} color="#FF7043" />
              </View>
              <View className="ml-3 pr-5 w-[80%]">
                <Text className="text-base font-medium">{item.name}</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {item.address}
                </Text>
              </View>
            </View>
            <View className="p-2 justify-end">
              <TouchableOpacity onPress={() => removePlace(item.id)}>
                <OutlineIcons.XCircleIcon size={30} color="#FF7043" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-5">
            <Text className="text-gray-500 text-base text-center">
              Search for places and add them to your trip
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    alignSelf: "flex-end",
  },
});

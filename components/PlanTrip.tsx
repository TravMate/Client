import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo
} from "react-native";
import "react-native-get-random-values";

import * as SolidIcons from "react-native-heroicons/solid";
import * as OutlineIcons from "react-native-heroicons/outline";
import usePlanTripStore, { TripPlace } from "@/store/planTripStore";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";
import MapView from "react-native-maps";
import {
  GooglePlacesAutoComplete,
  PlacePrediction
} from "@/components/map/GooglePlacesAutoComplete";

const width = Dimensions.get("window").width;

export default function PlanTrip() {
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  console.log("currentLocation", currentLocation);

  // Use the Zustand store
  const { places, addPlace: addTripPlace, removePlace } = usePlanTripStore();
  const { data: routes, isLoading, error } = useRouteMatrix(places);
  // console.log(">>>>", places);
  // if (error) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <Text className="text-red-500">Error: {error.message}</Text>
  //     </View>
  //   );
  // }

  function onSelectPlace(place: PlacePrediction) {
    addTripPlace(place);
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<PlacePrediction>) => (
    <View
      className="flex-row items-center justify-between p-3 mb-10"
      style={{ width: width * 0.8 }}
    >
      <View className="flex-row ">
        <View className="justify-center items-center">
          <SolidIcons.MapPinIcon size={30} color="#FF7043" />
        </View>
        <View className="ml-3 pr-5 w-[80%]">
          <Text className="text-lg font-bold">
            {item.structuredFormat.mainText.text}
          </Text>
          <Text className="text-base text-gray-600 mt-1">{item.text.text}</Text>
          <Text className="text-sm text-gray-600 mt-1">
            {index === 0 ? "From Your Location" : "From previous location"} →{" "}
            {routes && routes[index]?.distance
              ? `${routes[index].distance.toFixed(1)} km `
              : "Calculating..."}
          </Text>
        </View>
      </View>
      <View className="p-2 justify-end">
        <TouchableOpacity onPress={() => removePlace(item.placeId)}>
          <OutlineIcons.XCircleIcon size={30} color="#FF7043" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <MapView style={{ width: "100%", height: 300 }} />
      </View>

      <View style={styles.content}>
        <GooglePlacesAutoComplete
          onPressPlace={onSelectPlace}
          center={{ latitude: 30.0444, longitude: 31.2357 }}
        />
        {places && (
          <FlatList
            data={places}
            renderItem={renderItem}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center p-5">
                <Text className="text-gray-500 text-base text-center">
                  Search for places and add them to your trip
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20
  },
  content: {
    padding: 20
  }
});

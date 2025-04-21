import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";
import "react-native-get-random-values";

import * as SolidIcons from "react-native-heroicons/solid";
import * as OutlineIcons from "react-native-heroicons/outline";
import usePlanTripStore, { TripPlace } from "@/store/planTripStore";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  GooglePlacesAutoComplete,
  PlacePrediction,
} from "@/components/map/GooglePlacesAutoComplete";
import { decodePolyline } from "@/lib/decodePolyline";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const INITIAL_REGION = {
  latitude: 30.0444, // Cairo coordinates
  longitude: 31.2357,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function PlanTrip() {
  // Use the Zustand store
  const { places, addPlace: addTripPlace, removePlace } = usePlanTripStore();
  const { data: routes, isLoading, error } = useRouteMatrix(places);

  function onSelectPlace(place: PlacePrediction) {
    addTripPlace(place);
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<PlacePrediction>) => (
    <View
      className="flex-row items-center justify-between p-3 my-6"
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
        <MapView
          style={{ width: "100%", height: 200 }}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton
        >
          {/* Render the complete route polyline */}
          {routes?.[0]?.polyline && (
            <Polyline
              coordinates={decodePolyline(routes[0].polyline)}
              strokeColor="#ff9776"
              strokeWidth={4}
            />
          )}

          {/* Render markers for each leg */}
          {routes?.[0]?.legs?.map((leg, index) => {
            const location = leg.startLocation?.latLng ||
              leg.endLocation?.latLng || { latitude: 0, longitude: 0 };

            return (
              <Marker
                key={`marker-${index}`}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={`${index + 1} - ${
                  places[index - 1]?.structuredFormat?.mainText?.text ||
                  "your location"
                }`}
                description={`${
                  routes[index - 1]?.distance
                    ? "Distance:" +
                      routes[index - 1].distance.toFixed(1) +
                      " km"
                    : "starting point"
                }`}
              >
                <SolidIcons.MapPinIcon size={30} color="#FF7043" />
              </Marker>
            );
          })}

          {/* Add destination marker */}
          {(routes?.[0]?.legs?.length || 0) > 0 && (
            <Marker
              coordinate={{
                latitude:
                  routes?.[0]?.legs?.[routes[0].legs.length - 1]?.endLocation
                    ?.latLng.latitude || 0,
                longitude:
                  routes?.[0].legs?.[routes[0].legs.length - 1]?.endLocation
                    ?.latLng.longitude || 0,
              }}
              title={`${
                places[places.length - 1]?.structuredFormat?.mainText?.text
              }`}
              description="final point"
            >
              <SolidIcons.MapPinIcon size={30} color="#FF7043" />
            </Marker>
          )}
        </MapView>
      </View>

      <View style={styles.content}>
        <View className="px-6">
          <GooglePlacesAutoComplete
            onPressPlace={onSelectPlace}
            center={{ latitude: 30.0444, longitude: 31.2357 }}
          />
        </View>
        {places && (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.placesList}
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
  },
  content: {
    padding: 20,
  },
  placesList: {
    marginTop: 10,
    // height: "55%",
    marginBottom: 215,
    // backgroundColor: "red",
  },
});

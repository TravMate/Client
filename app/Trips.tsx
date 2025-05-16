import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import TripCard from "@/components/TripCard";
import { useTripsStore } from "@/store/tripsStore";
import { router } from "expo-router";
import * as Icons from "react-native-heroicons/outline";

const Trips = () => {
  const { trips, fetchUserTrips } = useTripsStore();

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

  useEffect(() => {
    fetchUserTrips();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="relative px-5 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white rounded-full p-2"
            style={buttonStyles}
          >
            <Icons.ChevronLeftIcon size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-center ml-20">
            Booked Trips
          </Text>
        </View>
      </View>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.$id || ""}
        renderItem={({ item }) => <TripCard item={item} />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center h-screen">
            <Text className="text-lg text-gray-500">No trips booked yet</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Trips;

const styles = StyleSheet.create({});

import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { logout } from "@/lib/auth";
import { router } from "expo-router";
import { fetchTourismPlacesApi } from "@/api/googlePlacesApi";
import { images } from "@/constants";

const home = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetchTourismPlacesApi().then((data) => setPlaces(data));
  }, []);

  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  // const renderItem = ({ item }) => (
  //   <View style={styles.item}>
  //     <Text style={styles.title}>{item.name}</Text>
  //     <Text>{item.vicinity}</Text>
  //     {item.photos && (
  //       <Image
  //         source={{
  //           uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${API_KEY}`,
  //         }}
  //         style={styles.image}
  //         // className="w-[300px] h-[200px]"
  //         // resizeMode="contain"
  //       />
  //     )}
  //   </View>
  // );

  return (
    <View className="flex-1 px-5">
      <View className="flex-row justify-between items-center">
        <View className="flex-row justify-between items-center gap-1">
          <Image
            source={images.logo}
            className="w-[30px] h-[30px]"
            resizeMode="contain"
          />
          <Image
            source={images.travmate}
            className="w-[85px] h-[80px]"
            resizeMode="contain"
          />
        </View>
        <View className="p-1.5 rounded-full bg-white">
          <SolidIcons.Squares2X2Icon color={"#F98C53"} size={30} />
        </View>
      </View>
      {/* <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={(item) => item.place_id}
      /> */}
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
});

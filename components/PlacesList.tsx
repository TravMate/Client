import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import { Place } from "@/types/type";
import SmallPlaceCard from "./SmallPlaceCard";

interface PlacesProps {
  data: Place[];
  title?: string;
  containerStyle?: object;
}

const PlacesList = ({ data, title, containerStyle }: PlacesProps) => {
  const reversedData = [...data].reverse(); // Create a reversed copy

  return (
    <View style={[containerStyle]} className="mt-10">
      <Text className="text-2xl font-bold ml-5">{title}</Text>
      <FlatList
        data={reversedData} // Use the reversed data
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingEnd: 10,
          paddingTop: 10,
          paddingBottom: 10,
          paddingStart: 5,
        }}
        renderItem={({ item }) => <SmallPlaceCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default PlacesList;

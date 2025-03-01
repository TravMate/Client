import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Place } from "@/types/type";
import SmallPlaceCard from "./SmallPlaceCard";

interface PlacesProps {
  data: Place[];
  title?: string;
  containerStyle?: object;
}

const PlacesList = ({ data, title, containerStyle }: PlacesProps) => {
  return (
    <View style={[containerStyle]} className="mt-10">
      <Text className="text-2xl font-bold ml-5">{title}</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          paddingEnd: 10,
          paddingTop: 10,
          paddingBottom: 10,
          paddingStart: 5,
        }}
      >
        {data?.map((item) => (
          <SmallPlaceCard item={item} key={item.place_id} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PlacesList;

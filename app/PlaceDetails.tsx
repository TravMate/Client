import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Place } from "@/types/type";
import { useRoute } from "@react-navigation/native";

interface PlaceDetailsProps {
  data: Place;
}

const PlaceDetails = () => {
  const [placeDetails, setPlaceDetails] = useState<Place | null>(null);
  const route = useRoute();
  const data = route.params as PlaceDetailsProps;
  useEffect(() => {
    setPlaceDetails(data.data);
  }, []);
  return (
    <View>
      <Text>{placeDetails?.name}</Text>
      <Text>{placeDetails?.rating}</Text>
    </View>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({});

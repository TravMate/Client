import React from "react";
import { Image, View, StyleSheet, DimensionValue } from "react-native";
import { usePlaceDetails } from "@/hooks/usePlaceDetails";
import PlaceCardSkeleton from "./PlaceCardSkeleton";
import { LinearGradient } from "expo-linear-gradient";

interface PlaceImageProps {
  placeId: string;
  width?: DimensionValue;
  height?: DimensionValue;
  showGradient?: boolean;
}

const PlaceImage: React.FC<PlaceImageProps> = ({
  placeId,
  width = "100%",
  height = "100%",
  showGradient = true,
}) => {
  const { data, isLoading, error } = usePlaceDetails({ placeId });

  if (isLoading || error || !data) {
    return <PlaceCardSkeleton size="large" />;
  }

  const photoReference = data.photos?.[0]?.name;

  if (!photoReference) {
    return <PlaceCardSkeleton size="large" />;
  }

  const imageUrl = `https://places.googleapis.com/v1/${photoReference}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`;

  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {showGradient && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
});

export default PlaceImage;

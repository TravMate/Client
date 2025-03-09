import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

interface PlaceCardSkeletonProps {
  size: "small" | "large";
}

const PlaceCardSkeleton = ({ size }: PlaceCardSkeletonProps) => {
  const small = (
    <View style={styles.smallContainer}>
      <ShimmerPlaceHolder
        style={styles.smallCard}
        LinearGradient={LinearGradient}
      />
    </View>
  );

  const large = (
    <View style={styles.largeContainer}>
      <ShimmerPlaceHolder
        style={styles.largeCard}
        LinearGradient={LinearGradient}
      />
    </View>
  );

  return size === "small" ? small : large;
};

export default PlaceCardSkeleton;

const styles = StyleSheet.create({
  smallContainer: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  largeContainer: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  smallCard: {
    width: "100%",
    height: 220,
    borderRadius: 10,
  },
  largeCard: {
    width: "100%",
    height: 250,
    borderRadius: 20,
  },
});

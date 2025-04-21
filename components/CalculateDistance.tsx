import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import usePlanTripStore from "@/store/planTripStore";
import * as SolidIcons from "react-native-heroicons/solid";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";
import Carousel from "react-native-reanimated-carousel";
import PlaceImage from "./PlaceImage";

const { width } = Dimensions.get("window");

const PlaceCard = ({ place, distance, index, totalPlaces }: any) => {
  const estimatedPrice = 210;

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <PlaceImage placeId={place.placeId} height={width * 0.5} />
      </View>

      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>
          {place.structuredFormat.mainText.text}
        </Text>
        <View style={styles.locationRow}>
          <SolidIcons.MapPinIcon size={16} color="#666" />
          <Text style={styles.locationText}>
            {index === 0
              ? "From your location"
              : `From ${
                  totalPlaces[index - 1].place.structuredFormat.mainText.text
                }`}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distance.toFixed(1)}km</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Est. Price</Text>
          <Text style={styles.statValue}>${estimatedPrice}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Stop</Text>
          <Text style={styles.statValue}>
            {index + 1}/{totalPlaces.length}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Route Details</Text>
        <Text style={styles.descriptionText}>
          {index === 0
            ? `Starting point to ${place.structuredFormat.secondaryText.text}`
            : `From ${
                totalPlaces[index - 1].place.structuredFormat.secondaryText.text
              } to ${place.structuredFormat.secondaryText.text}`}
        </Text>
      </View>
    </View>
  );
};

const CalculateDistance = () => {
  const { places } = usePlanTripStore();
  const { data: routes, isLoading, error } = useRouteMatrix(places);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  if (places.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No places added to your trip yet</Text>
      </View>
    );
  }

  const totalDistance =
    routes?.reduce((acc, curr) => acc + curr.distance, 0) || 0;
  const totalPrice = 210;

  return (
    <View style={styles.container}>
      <Carousel
        loop={false}
        width={width}
        height={width * 1.5}
        data={routes || []}
        scrollAnimationDuration={1000}
        renderItem={({ item, index }) => (
          <PlaceCard
            place={item.place}
            distance={item.distance}
            index={index}
            totalPlaces={routes}
          />
        )}
      />

      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  card: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: width * 1.1,
  },
  imageContainer: {
    width: "100%",
    height: width * 0.5,
    position: "relative",
  },
  placeImage: {
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
  placeInfo: {
    padding: 15,
  },
  placeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F2650",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationText: {
    color: "#666",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F98C53",
  },
  descriptionContainer: {
    padding: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F2650",
    marginBottom: 8,
  },
  descriptionText: {
    color: "#666",
    lineHeight: 20,
  },
  totalPriceContainer: {
    padding: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalPriceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  totalDistance: {
    fontSize: 16,
    color: "#0F2650",
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F2650",
    marginVertical: 5,
  },
  nextButton: {
    backgroundColor: "#F98C53",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default CalculateDistance;

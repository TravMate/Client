import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native";
import usePlanTripStore from "@/store/planTripStore";
import * as SolidIcons from "react-native-heroicons/solid";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Distance</Text>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>
          Total Trip Distance:{" "}
          {routes?.reduce((acc, curr) => acc + curr.distance, 0).toFixed(1)}
          km
        </Text>
      </View>

      <Text style={styles.subtitle}>Distance Details:</Text>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.place.placeId}
        renderItem={({ item, index }) => (
          <View style={styles.distanceItem}>
            <View style={styles.iconContainer}>
              {index === 0 ? (
                <SolidIcons.UserIcon size={24} color="#FF7043" />
              ) : (
                <SolidIcons.MapPinIcon size={24} color="#FF7043" />
              )}
            </View>
            <View style={styles.distanceInfo}>
              <Text style={styles.placeName}>
                {index === 0 ? "Your Location" : "From previous location"} →{" "}
                {item.place.structuredFormat.mainText.text}
              </Text>
              <View style={styles.detailsRow}>
                <Text style={styles.distance}>{item.distance} km</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#0F2650"
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#0F2650"
  },
  totalContainer: {
    backgroundColor: "#F98C53",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff"
  },
  totalDistance: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff"
  },
  distanceItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: "center"
  },
  distanceInfo: {
    flex: 1
  },
  placeName: {
    fontSize: 16,
    fontWeight: "500"
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4
  },
  distance: {
    fontSize: 14,
    color: "#666"
  },
  duration: {
    fontSize: 14,
    color: "#FF7043",
    fontWeight: "500"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  }
});

export default CalculateDistance;

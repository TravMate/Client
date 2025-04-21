import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import usePlanTripStore from "@/store/planTripStore";
import * as SolidIcons from "react-native-heroicons/solid";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";
import Carousel from "react-native-reanimated-carousel";
import PlaceImage from "./PlaceImage";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

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
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLeft}>
            <View
              style={[styles.timelineDot, { backgroundColor: "#FF9457" }]}
            />
            <View style={styles.timelineLine} />
            <View
              style={[styles.timelineDot, { backgroundColor: "#0F2650" }]}
            />
          </View>
          <View style={styles.timelineRight}>
            <Text style={styles.timelineText}>
              {index === 0
                ? "Your location"
                : totalPlaces[index - 1].place.structuredFormat.mainText.text}
            </Text>
            <Text style={[styles.timelineText, styles.timelineDestination]}>
              {place.structuredFormat.mainText.text}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <ShimmerPlaceholder style={styles.skeletonImage} />
      </View>

      <View style={styles.placeInfo}>
        <ShimmerPlaceholder style={styles.skeletonTitle} />
        <View style={styles.locationRow}>
          <ShimmerPlaceholder style={styles.skeletonLocation} />
        </View>
      </View>

      <View style={styles.statsContainer}>
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={styles.statBox}>
            <ShimmerPlaceholder style={styles.skeletonStatLabel} />
            <ShimmerPlaceholder style={styles.skeletonStatValue} />
          </View>
        ))}
      </View>

      <View style={styles.descriptionContainer}>
        <ShimmerPlaceholder style={styles.skeletonDescriptionTitle} />
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLeft}>
            <ShimmerPlaceholder style={styles.skeletonTimelineDot} />
            <ShimmerPlaceholder style={styles.skeletonTimelineLine} />
            <ShimmerPlaceholder style={styles.skeletonTimelineDot} />
          </View>
          <View style={styles.timelineRight}>
            <ShimmerPlaceholder style={styles.skeletonTimelineText} />
            <ShimmerPlaceholder style={styles.skeletonTimelineText} />
          </View>
        </View>
      </View>
    </View>
  );
};

const CalculateDistance = () => {
  const { places } = usePlanTripStore();
  const { data: routes, isLoading, error } = useRouteMatrix(places);
  const estimatedPrice = 210;

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
        height={Dimensions.get("window").height}
        data={isLoading ? Array(3).fill(null) : routes || []}
        scrollAnimationDuration={1000}
        renderItem={({ item, index }) => (
          <ScrollView style={styles.scrollView}>
            {isLoading ? (
              <SkeletonCard />
            ) : (
              <View style={styles.card}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                  <PlaceImage
                    placeId={item.place.placeId}
                    height={width * 0.5}
                  />
                </View>

                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>
                    {item.place.structuredFormat.mainText.text}
                  </Text>
                  <View style={styles.locationRow}>
                    <SolidIcons.MapPinIcon size={16} color="#666" />
                    <Text style={styles.locationText}>
                      {index === 0
                        ? "From your location"
                        : `From ${
                            routes[index - 1].place.structuredFormat.mainText
                              .text
                          }`}
                    </Text>
                  </View>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>
                      {item.distance.toFixed(1)}km
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Est. Price</Text>
                    <Text style={styles.statValue}>${estimatedPrice}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Stop</Text>
                    <Text style={styles.statValue}>
                      {index + 1}/{routes.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>Route Details</Text>
                  <View style={styles.timelineContainer}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          { backgroundColor: "#FF9457" },
                        ]}
                      />
                      <View style={styles.timelineLine} />
                      <View
                        style={[
                          styles.timelineDot,
                          { backgroundColor: "#0F2650" },
                        ]}
                      />
                    </View>
                    <View style={styles.timelineRight}>
                      <Text style={styles.timelineText}>
                        {index === 0
                          ? "Your location"
                          : routes[index - 1].place.structuredFormat
                              .secondaryText.text}
                      </Text>
                      <Text
                        style={[
                          styles.timelineText,
                          styles.timelineDestination,
                        ]}
                      >
                        {item.place.structuredFormat.secondaryText.text}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  scrollView: {
    flex: 1,
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
    flex: 1,
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
    marginBottom: 15,
  },
  timelineContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  timelineLeft: {
    width: 20,
    alignItems: "center",
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 15,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: "#E0E0E0",
    marginVertical: 5,
  },
  timelineText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  timelineDestination: {
    color: "#0F2650",
    fontWeight: "500",
  },
  totalPriceContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  totalPriceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F2650",
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
  skeletonImage: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 20,
  },
  skeletonTitle: {
    width: "80%",
    height: 24,
    marginBottom: 8,
  },
  skeletonLocation: {
    width: 100,
    height: 14,
  },
  skeletonStatLabel: {
    width: "30%",
    height: 14,
    marginBottom: 4,
  },
  skeletonStatValue: {
    width: "70%",
    height: 16,
    marginTop: 4,
  },
  skeletonDescriptionTitle: {
    width: "80%",
    height: 18,
    marginBottom: 15,
  },
  skeletonTimelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  skeletonTimelineLine: {
    width: 2,
    height: 30,
    backgroundColor: "#E0E0E0",
    marginVertical: 5,
  },
  skeletonTimelineText: {
    width: "100%",
    height: 15,
    marginBottom: 20,
  },
});

export default CalculateDistance;

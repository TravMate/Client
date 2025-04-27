import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import usePlanTripStore from "@/store/planTripStore";
import * as SolidIcons from "react-native-heroicons/solid";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";
import Carousel from "react-native-reanimated-carousel";
import PlaceImage from "./PlaceImage";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { generatePlaceRecommendations } from "@/lib/gemini";

const { width } = Dimensions.get("window");
const height = Dimensions.get("window").height;

interface Recommendations {
  visitTips: string;
  budgetTips: string;
  photoSpots: string;
  bestTimes: string;
}

interface RecommendationsModalProps {
  visible: boolean;
  onClose: () => void;
  recommendations: Recommendations | null;
  isLoading: boolean;
}

const DurationSelector = ({
  duration,
  onDurationChange,
}: {
  duration: number;
  onDurationChange: (duration: number) => void;
}) => {
  const [hours, setHours] = useState(Math.floor(duration / 60).toString());
  const [minutes, setMinutes] = useState((duration % 60).toString());

  const updateDuration = (newHours: string, newMinutes: string) => {
    const h = parseInt(newHours) || 0;
    const m = parseInt(newMinutes) || 0;
    const totalMinutes = Math.min(Math.max(h * 60 + m, 5), 480); // Between 5 min and 8 hours
    const updatedHours = Math.floor(totalMinutes / 60);
    const updatedMinutes = totalMinutes % 60;

    setHours(updatedHours.toString());
    setMinutes(updatedMinutes.toString().padStart(2, "0"));
    onDurationChange(totalMinutes);
  };

  const increment = () => {
    const currentTotal = parseInt(hours) * 60 + parseInt(minutes);
    const newTotal = Math.min(currentTotal + 5, 480);
    updateDuration(
      Math.floor(newTotal / 60).toString(),
      (newTotal % 60).toString()
    );
  };

  const decrement = () => {
    const currentTotal = parseInt(hours) * 60 + parseInt(minutes);
    const newTotal = Math.max(currentTotal - 5, 5);
    updateDuration(
      Math.floor(newTotal / 60).toString(),
      (newTotal % 60).toString()
    );
  };

  const handleHoursChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setHours(numericValue);
  };

  const handleMinutesChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setMinutes(numericValue);
  };

  const handleHoursBlur = () => {
    updateDuration(hours, minutes);
  };

  const handleMinutesBlur = () => {
    updateDuration(hours, minutes);
  };

  return (
    <View style={styles.durationContainer}>
      <Text style={styles.durationLabel}>Time to Spend</Text>
      <View style={styles.durationControls}>
        <Pressable style={styles.durationButton} onPress={decrement}>
          <Text style={styles.durationButtonText}>−</Text>
        </Pressable>
        <View style={styles.durationValue}>
          <TextInput
            style={styles.durationInput}
            value={hours}
            onChangeText={handleHoursChange}
            onBlur={handleHoursBlur}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
          <Text style={styles.durationUnit}>h</Text>
          <Text style={styles.durationSeparator}>{":"}</Text>
          <TextInput
            style={styles.durationInput}
            value={minutes}
            onChangeText={handleMinutesChange}
            onBlur={handleMinutesBlur}
            keyboardType="number-pad"
            maxLength={2}
            selectTextOnFocus
          />
          <Text style={styles.durationUnit}>m</Text>
        </View>
        <Pressable style={styles.durationButton} onPress={increment}>
          <Text style={styles.durationButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const RecommendationsModal = ({
  visible,
  onClose,
  recommendations,
  isLoading,
}: RecommendationsModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Recommendations</Text>
            <TouchableOpacity onPress={onClose}>
              <SolidIcons.XMarkIcon size={24} color="#0F2650" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0F2650" />
                <Text style={styles.loadingText}>
                  Generating recommendations...
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.recommendationSection}>
                  <Text style={styles.sectionTitle}>🎯 Visit Tips</Text>
                  <Text style={styles.recommendationText}>
                    {recommendations?.visitTips}
                  </Text>
                </View>

                <View style={styles.recommendationSection}>
                  <Text style={styles.sectionTitle}>💰 Budget Tips</Text>
                  <Text style={styles.recommendationText}>
                    {recommendations?.budgetTips}
                  </Text>
                </View>

                <View style={styles.recommendationSection}>
                  <Text style={styles.sectionTitle}>📸 Photo Spots</Text>
                  <Text style={styles.recommendationText}>
                    {recommendations?.photoSpots}
                  </Text>
                </View>

                <View style={styles.recommendationSection}>
                  <Text style={styles.sectionTitle}>⏰ Best Times</Text>
                  <Text style={styles.recommendationText}>
                    {recommendations?.bestTimes}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const PlaceCard = ({ place, distance, index, totalPlaces }: any) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] =
    useState<Recommendations | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);

  const updatePlaceDuration = usePlanTripStore(
    (state) => state.updatePlaceDuration
  );
  const estimatedPrice = 210;

  const handleGetRecommendations = async () => {
    setShowRecommendations(true);
    setIsLoadingRecommendations(true);

    try {
      const placeName = place.structuredFormat.mainText.text;
      const placeAddress = place.structuredFormat.secondaryText.text;

      const recommendations = await generatePlaceRecommendations(
        placeName,
        placeAddress
      );
      setRecommendations(recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      setRecommendations({
        visitTips: "Unable to generate visit tips at this time.",
        budgetTips: "Unable to generate budget tips at this time.",
        photoSpots:
          "Unable to generate photo spot recommendations at this time.",
        bestTimes:
          "Unable to generate best times recommendations at this time.",
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

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

      <TouchableOpacity
        style={styles.recommendationsButton}
        onPress={handleGetRecommendations}
      >
        <SolidIcons.SparklesIcon size={20} color="#fff" />
        <Text style={styles.recommendationsButtonText}>
          Get AI Recommendations
        </Text>
      </TouchableOpacity>

      <DurationSelector
        duration={place.duration || 60}
        onDurationChange={(duration) =>
          updatePlaceDuration(place.placeId, duration)
        }
      />

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

      <RecommendationsModal
        visible={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        recommendations={recommendations}
        isLoading={isLoadingRecommendations}
      />
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
  const updatePlaceDuration = usePlanTripStore(
    (state) => state.updatePlaceDuration
  );
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

  // Merge routes with places data to get duration
  const routesWithDuration = routes?.map((route) => ({
    ...route,
    place: {
      ...route.place,
      duration:
        places.find((p) => p.placeId === route.place.placeId)?.duration || 60,
    },
  }));

  const totalDistance =
    routes?.reduce((acc, curr) => acc + curr.distance, 0) || 0;
  const totalPrice = 210;

  return (
    <View style={styles.container}>
      <Carousel
        loop={false}
        width={width}
        height={Dimensions.get("window").height}
        data={isLoading ? Array(3).fill(null) : routesWithDuration || []}
        scrollAnimationDuration={1000}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
          failOffsetY: [-5, 5],
        }}
        renderItem={({ item, index }) => (
          <View style={styles.cardContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <PlaceCard
                  place={item.place}
                  distance={item.distance}
                  index={index}
                  totalPlaces={routesWithDuration}
                />
              )}
            </ScrollView>
          </View>
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  cardContainer: {
    height: height * 0.7,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    fontSize: 21,
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
  durationContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F2650",
    marginBottom: 10,
    textAlign: "center",
  },
  durationControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  durationButton: {
    width: 36,
    height: 36,
    backgroundColor: "#0F2650",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  durationButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "600",
    lineHeight: 24,
  },
  durationValue: {
    minWidth: 120,
    paddingHorizontal: 10,
    height: 36,
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  durationInput: {
    fontSize: 16,
    color: "#0F2650",
    fontWeight: "600",
    textAlign: "center",
    minWidth: 24,
    padding: 0,
  },
  durationUnit: {
    fontSize: 16,
    color: "#0F2650",
    fontWeight: "600",
    marginLeft: 2,
    marginRight: 4,
  },
  durationSeparator: {
    fontSize: 16,
    color: "#0F2650",
    fontWeight: "600",
    marginHorizontal: 2,
  },
  recommendationsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F2650",
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    gap: 8,
  },
  recommendationsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "70%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F2650",
  },
  modalBody: {
    maxHeight: "80%",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  recommendationSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F2650",
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});

export default CalculateDistance;

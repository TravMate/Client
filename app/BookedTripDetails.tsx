import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Trip } from "@/lib/trips";
import { fetchGuideById } from "@/lib/guide";
import { Guide } from "@/components/ChooseGuide";
import * as SolidIcons from "react-native-heroicons/solid";
import { router } from "expo-router";

interface BookedTripDetailsProps {
  bookedTripData: Trip;
}

const BookedTripDetails = () => {
  const [bookedTripData, setBookedTripData] = useState<Trip | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const data = route.params as BookedTripDetailsProps;
  const withGuidance = data.bookedTripData.withGuidance;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setBookedTripData(data.bookedTripData);

      if (data.bookedTripData.guideId) {
        try {
          const guideData = await fetchGuideById(data.bookedTripData.guideId);
          setGuide(guideData);
        } catch (error) {
          console.error("Error fetching guide for Booked Trip details:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const date = new Date(bookedTripData?.createdAt.toString() || "");

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "booked":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7043" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <SolidIcons.ChevronLeftIcon size={24} color="#0F2650" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
      </View>

      {/* Status Card */}
      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(bookedTripData?.status || "") },
            ]}
          >
            <Text style={styles.statusText}>{bookedTripData?.status}</Text>
          </View>
        </View>
        <Text style={styles.date}>Booked on {date.toLocaleDateString()}</Text>
      </View>

      {/* Places Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Places you Visited</Text>
        {bookedTripData?.places.map((place, index) => (
          <View key={index} style={styles.placeItem}>
            <SolidIcons.MapPinIcon size={20} color="#FF7043" />
            <Text style={styles.placeText}>{place}</Text>
          </View>
        ))}
      </View>

      {/* Guide Card */}
      {guide && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tour Guide</Text>
          <View style={styles.guideContainer}>
            <Image
              source={
                guide.guideImageUrl
                  ? { uri: guide.guideImageUrl }
                  : require("@/assets/images/Tour guide-amico 1.png")
              }
              style={styles.guideImage}
            />
            <View style={styles.guideInfo}>
              <Text style={styles.guideName}>{guide.name}</Text>
              <View style={styles.ratingContainer}>
                <SolidIcons.StarIcon size={16} color="#FF7043" />
                <Text style={styles.ratingText}>{guide.rating}</Text>
              </View>
              <Text style={styles.priceText}>
                $
                {withGuidance
                  ? guide.priceWithGuidance
                  : guide.priceWithoutGuidance}
                /hr
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Price Card */}
      <View style={[styles.card, styles.priceCard]}>
        <Text style={styles.cardTitle}>Price Details</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>${bookedTripData?.totalAmount}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default BookedTripDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#0F2650",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#0F2650",
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
  },
  placeText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    color: "#333",
  },
  guideContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
  },
  guideImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
    color: "#0F2650",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 4,
    color: "#666",
  },
  priceText: {
    fontSize: 16,
    color: "#FF7043",
    fontWeight: "500",
  },
  priceCard: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF7043",
  },
});

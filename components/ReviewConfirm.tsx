import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useGuideStore } from "@/store/guideStore";
import usePlanTripStore from "@/store/planTripStore";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";
import CustomButton from "./CustomButton";
import * as SolidIcons from "react-native-heroicons/solid";
import { useStripe } from "@stripe/stripe-react-native";
import { fetchAPI } from "@/lib/fetch";
import { UserProps } from "@/types/type";
import { getUser } from "@/lib/auth";
import ReactNativeModal from "react-native-modal";
import { router } from "expo-router";
import { createTrip } from "@/lib/trips";
import { useTripsStore } from "@/store/tripsStore";

const checkImage = require("../assets/images/check.png");

const ReviewConfirm = ({
  onEdit,
  onConfirm,
}: {
  onEdit?: () => void;
  onConfirm?: () => void;
}) => {
  const [formattedPlaces, setFormattedPlaces] = useState<string[]>([]);
  const { places } = usePlanTripStore();
  const { withGuidance } = usePlanTripStore();
  useEffect(() => {
    const formatted = places.map(
      (place) => place.structuredFormat?.mainText?.text
    );
    setFormattedPlaces(formatted);
  }, [places]);

  const { selectedGuide, guides } = useGuideStore();
  const { data: routes } = useRouteMatrix(places);
  const getTripPriceBreakdown = usePlanTripStore(
    (state) => state.getTripPriceBreakdown
  );
  const breakdown = getTripPriceBreakdown(routes || [], selectedGuide);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [user, setUser] = useState<UserProps | null>(null);
  const { clearPlaces } = usePlanTripStore();
  const { clearSelectedGuide } = useGuideStore();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const openPaymentSheet = async () => {
    setLoading(true);
    try {
      const response = await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error("Payment sheet error:", error);
        Alert.alert(
          "Payment Error",
          error.message || "There was a problem processing your payment."
        );
      } else {
        // Save trip to backend after successful payment
        if (formattedPlaces.length > 0) {
          try {
            await createTrip({
              userId: user?.$id || "",
              places: formattedPlaces,
              guideId: selectedGuide,
              totalAmount: breakdown.total,
              status: "booked",
              paymentIntentId: response.paymentIntent.id,
              createdAt: new Date(),
              withGuidance,
            });
            setSuccess(true);
            clearPlaces();
            clearSelectedGuide();
          } catch (tripError) {
            console.error("Error saving trip:", tripError);
            Alert.alert(
              "Warning",
              "Payment successful but there was an error saving your trip. Please contact support."
            );
          }
        }
      }
    } catch (e) {
      console.error("Payment error:", e);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, customer } = await fetchAPI("/(stripe)/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.name || user?.email?.split("@")[0],
          email: user?.email,
          amount: breakdown.total,
        }),
      });

      if (!paymentIntent?.client_secret) {
        throw new Error("Failed to initialize payment");
      }

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Travmate, Inc.",
        paymentIntentClientSecret: paymentIntent.client_secret,
        customerEphemeralKeySecret: paymentIntent.ephemeralKey?.secret,
        customerId: customer,
        defaultBillingDetails: {
          name: user?.name || user?.email?.split("@")[0],
          email: user?.email,
        },
        returnURL: "travmate://stripe-redirect",
      });

      if (error) {
        throw error;
      }

      return { paymentIntent };
    } catch (e) {
      console.error("Initialize payment sheet error:", e);
      throw e;
    }
  };

  // Trip details
  const startLocation =
    places.length > 0 ? places[0]?.structuredFormat?.mainText?.text : "-";
  const destination =
    places.length > 0
      ? places[places.length - 1]?.structuredFormat?.mainText?.text
      : "-";
  const numStops = places.length;
  const totalDistance =
    routes && Array.isArray(routes)
      ? routes.reduce((acc, route) => acc + (route.distance || 0), 0)
      : 0;
  const totalMinutes = places.reduce((acc, p) => acc + (p.duration || 60), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeExpected =
    hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}` : `${minutes}m`;

  // Guide info
  const guide = guides.find((g) => g.$id === selectedGuide);
  const guideHourly = withGuidance
    ? guide?.priceWithGuidance
    : guide?.priceWithoutGuidance;
  const guideName = guide ? guide.name : "-";
  const guideRating = guide ? guide.rating : null;
  const guideCost = breakdown.guide;
  const guideCostText = guide
    ? `$${guideHourly}/hr × ${Math.ceil(
        totalMinutes / 60
      )} hours = $${guideCost}`
    : "-";

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip Details</Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>From:</Text> {startLocation}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>To:</Text> {destination}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Stops:</Text> {numStops}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Total distance:</Text>{" "}
            {totalDistance.toFixed(1)} km
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Total duration:</Text> {timeExpected}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Tour guide:</Text> {guideName}
            {guideRating !== null ? ` (⭐${guideRating})` : ""}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>
          <Text style={styles.costText}>
            <Text style={styles.bold}>Transportation:</Text> $
            {breakdown.transportation}{" "}
            <Text style={styles.explainText}>
              (for {totalDistance.toFixed(1)} km)
            </Text>
          </Text>
          <Text style={styles.costText}>
            <Text style={styles.bold}>Car cost:</Text> ${breakdown.car}{" "}
            <Text style={styles.explainText}>
              (for {totalDistance.toFixed(1)} km)
            </Text>
          </Text>
          <Text style={styles.costText}>
            <Text style={styles.bold}>Tour guide:</Text> {guideCostText}
          </Text>
          <Text style={styles.costText}>
            <Text style={styles.bold}>Service fee:</Text> $
            {breakdown.serviceFee}
          </Text>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <SolidIcons.BanknotesIcon
              size={28}
              color="#22c55e"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.totalText}>
              Total: <Text style={styles.bold}>${breakdown.total}</Text>
            </Text>
          </View>
          <Text style={styles.serviceNote}>
            *The service fee helps us keep the app running and provide support.*
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <CustomButton
            title="Confirm reservation"
            handlePress={openPaymentSheet}
            containerStyles="flex-1 min-h-[48px] bg-[#F98C53] rounded-xl"
            textStyles="text-white"
          />
          <ReactNativeModal
            isVisible={success}
            onBackdropPress={() => setSuccess(false)}
          >
            <View style={styles.modelContainer}>
              <Image source={checkImage} style={styles.checkImage} />
              <Text style={styles.modelTitle}>Booking placed successfully</Text>
              <Text style={styles.modelExplainText}>
                Thank you for your booking. Your reservation has been
                successfully placed. Please proceed with your trip.
              </Text>
              <CustomButton
                title="Back Home"
                handlePress={() => {
                  setSuccess(false);
                  if (onConfirm) onConfirm();
                  router.push("/(tabs)/home");
                }}
                containerStyles="w-[50%] mx-auto min-h-[48px] bg-[#F98C53] rounded-xl mt-8"
                textStyles="text-white"
              />
            </View>
          </ReactNativeModal>
          <View style={{ width: 16 }} />
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit || (() => {})}
          >
            <SolidIcons.PencilSquareIcon
              size={20}
              color="#0F2650"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  detailText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  costText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  totalText: {
    fontSize: 22,
    color: "#222",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 48,
  },
  editText: {
    color: "#0F2650",
    fontWeight: "bold",
    fontSize: 16,
  },
  explainText: {
    color: "#888",
    fontSize: 13,
    fontStyle: "italic",
    marginLeft: 4,
  },
  serviceNote: {
    color: "#888",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "center",
  },
  modelContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 26,
    borderRadius: 16,
  },
  checkImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  modelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F2650",
  },
  modelExplainText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
    marginTop: 7,
    textAlign: "center",
  },
});

export default ReviewConfirm;

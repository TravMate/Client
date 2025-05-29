import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import usePlanTripStore from "@/store/planTripStore";
import { useGuideStore } from "@/store/guideStore";
import { fetchGuidesWithImages } from "@/lib/guide";
import { Guide } from "./ChooseGuide";

interface ChooseGuidanceTypeProps {
  onNavigateNext: () => void;
}

const ChooseGuidanceType = ({ onNavigateNext }: ChooseGuidanceTypeProps) => {
  const { chooseGuidePrice } = usePlanTripStore();
  const { setGuides } = useGuideStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true);
        const guidesData = await fetchGuidesWithImages();
        setGuides((guidesData as Guide[]) || []);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const handleYesPress = () => {
    chooseGuidePrice(true);
    onNavigateNext();
  };

  const handleNoPress = () => {
    chooseGuidePrice(false);
    onNavigateNext();
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../assets/images/guide_image_vector_2.png")}
          style={styles.image}
        />
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            Do you want the Guide to be with you in the places you visit ?
          </Text>
          <Text style={styles.subText}>
            # Note: This will cost you extra money
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.yesButton} onPress={handleYesPress}>
            <Text style={styles.yesButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noButton} onPress={handleNoPress}>
            <Text style={styles.noButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChooseGuidanceType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 260,
    height: 260,
    marginBottom: 10,
    alignSelf: "center",
  },
  textContainer: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  mainText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  yesButton: {
    borderWidth: 1,
    borderColor: "#F98C53",
    backgroundColor: "#F98C53",
    width: "45%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  noButton: {
    borderWidth: 1,
    borderColor: "#F98C53",
    backgroundColor: "#fff",
    width: "45%",
    paddingVertical: 10,
    borderRadius: 10,
  },
  yesButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  noButtonText: {
    textAlign: "center",
    color: "#F98C53",
    fontWeight: "bold",
  },
});

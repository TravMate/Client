import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Trip } from "@/lib/trips";
import * as SolidIcons from "react-native-heroicons/solid";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  BookedTripDetails: { bookedTripData: Trip };
};

type BookedTripDetailsNavigationProp = NavigationProp<
  RootStackParamList,
  "BookedTripDetails"
>;

const TripCard = ({ item }: { item: Trip }) => {
  const lenght = item.places.length;
  const date = new Date(item?.createdAt.toString() || "");
  const navigation = useNavigation<BookedTripDetailsNavigationProp>();

  const handlePress = () => {
    navigation.navigate("BookedTripDetails", {
      bookedTripData: item,
    });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <View style={styles.routeDetails}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#a9a9a9",
            marginBottom: 6,
          }}
        >
          Trip Start & End
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <SolidIcons.MapPinIcon size={20} color="#FF7043" />
          <Text style={styles.routeText} numberOfLines={1}>
            {item.places[0]}
          </Text>
        </View>
        <SolidIcons.ArrowDownIcon
          size={20}
          color="#000"
          style={{ marginVertical: 3, alignSelf: "flex-start" }}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <SolidIcons.MapPinIcon size={20} color="#FF7043" />
          <Text style={styles.routeText} numberOfLines={1}>
            {item.places[lenght - 1]}
          </Text>
        </View>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingPrice}>${item.totalAmount}</Text>
        <View style={styles.bookingStatus}>
          <Text style={styles.bookingStatusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  routeDetails: {
    width: "70%",
  },

  routeText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  bookingDetails: {
    alignItems: "center",
    width: "30%",
  },
  bookingStatus: {
    backgroundColor: "#98fb98",
    padding: 8,
    borderRadius: 5,
  },
  bookingPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bookingStatusText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
  dateText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#a9a9a9",
    marginTop: 10,
  },
});

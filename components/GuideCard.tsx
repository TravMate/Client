import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SolidIcons from "react-native-heroicons/solid";

const defaultAvatar = require("../assets/images/Tour guide-amico 1.png");
const defaultCar = require("../assets/images/carImage4.png");

interface DriverCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    time: number;
    rating: number;
    imageUrl?: string;
    carImageUrl?: string;
  };
  selected?: string;
  setSelected?: () => void;
}

const GuideCard = ({ item, selected, setSelected }: DriverCardProps) => {
  // console.log(selected);
  const isSelected = selected === item.id;
  return (
    <TouchableOpacity
      onPress={setSelected}
      style={[styles.container, isSelected && styles.selectedContainer]}
    >
      <Image
        source={
          item.imageUrl ? { uri: item.imageUrl.toString() } : defaultAvatar
        }
        style={styles.personalImage}
      />

      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <SolidIcons.StarIcon size={12} color="#FF7043" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.priceDetailsContainer}>
          <View style={styles.priceContainer}>
            <SolidIcons.CurrencyDollarIcon size={16} color="#FF7043" />
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
      </View>

      <Image
        source={
          item.carImageUrl ? { uri: item.carImageUrl.toString() } : defaultCar
        }
        resizeMode="contain"
        style={{ width: 60, height: 60 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 17,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 13,
    marginHorizontal: 16,
  },
  selectedContainer: {
    borderWidth: 1,
    borderColor: "#FF7043",
  },
  personalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 5,
  },
  name: {
    color: "#000",
    fontSize: 18,
    fontFamily: "JakartaRegular",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 6,
  },
  rating: {
    color: "#000",
    fontSize: 12,
    fontFamily: "JakartaRegular",
    marginLeft: 2,
  },
  priceDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  price: {
    fontSize: 12,
    fontFamily: "JakartaRegular",
    marginLeft: 4,
    fontWeight: "bold",
  },
});

export default GuideCard;

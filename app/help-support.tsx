import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Icons from "react-native-heroicons/outline";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const buttonStyles = {
  shadowColor: "rgba(0, 0, 0, 0.1)",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 1,
  shadowRadius: 4,
  elevation: 4,
};

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How to book a trip?",
    answer:
      "To book a trip, navigate to the 'Trips' section, select your desired destination, choose your preferred dates, and proceed to payment. ",
  },
  {
    question: "What are the payment methods?",
    answer:
      "We accept credit/debit cards, PayPal, and digital wallets like Apple Pay and Google Pay.",
  },
  {
    question: "How to cancel a booking?",
    answer:
      "You can cancel your booking by going to 'My Trips', selecting the booking, and clicking 'Cancel'.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refunds depend on the booking type. Check the cancellation policy before proceeding with the request.",
  },
];

const Accordion = ({ item, isLast }: { item: FAQItem; isLast: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animationValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const maxHeight = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const rotateStyle = {
    transform: [
      {
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={toggleAccordion}
        className="flex-row justify-between items-center bg-white p-4 rounded-[10px]"
        style={{
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.30)",
        }}
      >
        <Text className="flex-1 text-lg font-medium text-gray-500 mr-4">
          {item.question}
        </Text>
        <Animated.View style={rotateStyle}>
          <Icons.ChevronDownIcon size={20} color="#666" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={{ maxHeight }}
        className="px-4 mt-2 bg-gray-500 rounded-lg"
      >
        <Text className="text-white leading-6 py-2">{item.answer}</Text>
      </Animated.View>
    </View>
  );
};

const HelpSupport = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative px-5 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white rounded-full p-2"
            style={buttonStyles}
          >
            <Icons.ChevronLeftIcon size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-center ml-24">
            Help & Support
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute right-5 top-4 bg-white rounded-full p-2"
          style={buttonStyles}
        ></TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 mt-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl text-black mb-2 font-bold">
          Frequently Asked Questions
        </Text>

        <View className="bg-white rounded-xl py-4">
          {FAQ_DATA.map((item, index) => (
            <Accordion
              key={index}
              item={item}
              isLast={index === FAQ_DATA.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupport;

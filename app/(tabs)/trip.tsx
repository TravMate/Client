import { Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Stack } from "expo-router";
import * as SolidIcons from "react-native-heroicons/solid";
import GoogleTextInput from "@/components/GoogleTextInput";
import "react-native-get-random-values";

const width = Dimensions.get("window").width;

const stepsConfig = [
  {
    component: () => (
      <View className="flex-1">
        {/* <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
          Choose your first destination
        </Text> */}
        <GoogleTextInput
          // icon={<SolidIcons.MapPinIcon size={24} color="black" />}
          containerStyle="w-full"
          handlePress={() => {}}
          // textInputBackgroundColor="#fff"
          initialLocation="Egypt"
        />
      </View>
    ),
    title: "Choose Destination",
  },
  {
    component: () => (
      <View className="flex-1">
        <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
          Calculate distance
        </Text>
      </View>
    ),
    title: "Calculate Distance",
  },
  {
    component: () => (
      <View className="flex-1">
        <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
          Choose tourguide
        </Text>
      </View>
    ),
    title: "Choose Tourguide",
  },
  {
    component: () => (
      <View className="flex-1">
        <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
          Review & Confirm
        </Text>
      </View>
    ),
    title: "Review & Confirm",
  },
];

const Trip = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View className="h-full relative bg-[#F1F1F1]">
      <Stack.Screen
        options={{
          headerShown: currentStep > 0,
          headerLeft: () =>
            currentStep > 0 ? (
              <TouchableOpacity
                style={{
                  marginLeft: 15,
                  backgroundColor: "#fff",
                  borderRadius: 25,
                  padding: 8,
                }}
                onPress={handleBack}
              >
                <SolidIcons.ChevronLeftIcon size={24} color="black" />
              </TouchableOpacity>
            ) : null,
          headerTitle:
            currentStep > 0 ? stepsConfig[currentStep - 1].title : "",
          headerStyle: {
            height: 75,
          },
          headerTitleStyle: {
            marginLeft: width / 2 - 145,
          },
          headerBackground: () => (
            <View
              style={{
                backgroundColor: "#F6F6F6",
                height: 4,
                width: "100%",
                position: "absolute",
                bottom: 0,
              }}
            >
              <View
                style={{
                  backgroundColor: "#F98C53",
                  height: 4,
                  width: `${(currentStep / 4) * 100}%`,
                }}
              />
            </View>
          ),
        }}
      />

      {currentStep === 0 ? (
        <>
          <Image
            source={require("@/assets/images/cairo.png")}
            className="w-full h-[80%]"
            resizeMode="cover"
          />
          <View className="absolute left-5 right-5 bottom-[15%] bg-white p-5 rounded-2xl shadow-lg">
            <Text className="text-2xl font-bold mb-2.5 text-center">
              Start booking your trip
            </Text>
            <Text className="text-base text-gray-600 text-center mb-5">
              You will go through 4 stages to easily customize your trip.
            </Text>
            <CustomButton
              title="Start now"
              handlePress={handleStart}
              containerStyles="w-full mx-auto min-h-[48px] bg-[#F98C53] rounded-xl"
              textStyles="text-[#0F2650]"
            />
          </View>
        </>
      ) : (
        <View className="flex-1 p-5">
          {currentStep > 0 && stepsConfig[currentStep - 1].component()}
          <View className="py-5">
            <CustomButton
              title={currentStep === 4 ? "Finish" : "Next"}
              handlePress={handleNext}
              containerStyles="w-full mx-auto min-h-[48px] bg-[#F98C53] rounded-xl"
              textStyles="text-[#0F2650]"
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Trip;

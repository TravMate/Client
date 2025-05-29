import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Stack, useRouter } from "expo-router";
import * as SolidIcons from "react-native-heroicons/solid";
import "react-native-get-random-values";
import PlanTrip from "@/components/PlanTrip";
import usePlanTripStore from "@/store/planTripStore";
import { useGuideStore } from "@/store/guideStore";
import CalculateDistance from "@/components/CalculateDistance";
import ChooseGuide from "@/components/ChooseGuide";
import { useRouteMatrix } from "@/hooks/useCalculateDistance";
import ReviewConfirm from "@/components/ReviewConfirm";
import ChooseGuidanceType from "@/components/ChooseGuidanceType";

// const width = Dimensions.get("window").width;

interface StepProps {
  onNavigateNext?: () => void;
  onEdit?: () => void;
  onConfirm?: () => void;
}

const stepsConfig = [
  {
    component: (props: StepProps) => <PlanTrip />,
    title: "Plan Your Trip",
  },
  {
    component: (props: StepProps) => <CalculateDistance />,
    title: "Preview Your Trip",
  },
  {
    component: (props: StepProps) => (
      <ChooseGuidanceType onNavigateNext={props.onNavigateNext!} />
    ),
    title: "Choose Guidance Type",
  },
  {
    component: (props: StepProps) => <ChooseGuide />,
    title: "Choose Your Guide",
  },
  {
    component: (props: StepProps) => (
      <ReviewConfirm onEdit={props.onEdit!} onConfirm={props.onConfirm!} />
    ),
    title: "Review & Confirm",
  },
];

const Trip = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { places, getTripPriceBreakdown } = usePlanTripStore();
  const { data: routes } = useRouteMatrix(places);
  const { selectedGuide } = useGuideStore();
  const breakdown = getTripPriceBreakdown(routes || [], selectedGuide);

  // Use useEffect to handle state changes based on places
  useEffect(() => {
    // const userTrips = fetchUserTrips();
    if (places.length > 0 && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [places, currentStep]);

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleEdit = () => setCurrentStep(1); // Go back to trip planning
  const handleConfirm = () => {
    setCurrentStep(0); // Reset to initial step
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
          headerTitleAlign: "center",
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
                  width: `${(currentStep / 5) * 100}%`,
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
        <View className="flex-1 flex-col">
          <View className="flex-1">
            {currentStep === 5
              ? stepsConfig[4].component({
                  onEdit: handleEdit,
                  onConfirm: handleConfirm,
                })
              : currentStep > 0 &&
                stepsConfig[currentStep - 1].component({
                  onNavigateNext: handleNext,
                })}
          </View>

          {currentStep < 5 && currentStep !== 3 && (
            <View className="px-8 py-2 mt-auto">
              {currentStep === 2 ? (
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-gray-600 text-lg">Total price</Text>
                    <Text className="text-3xl font-bold">
                      ${breakdown.total}
                    </Text>
                  </View>
                  <CustomButton
                    title="Next"
                    handlePress={handleNext}
                    containerStyles="w-[45%] ml-auto min-h-[46px] bg-[#F98C53] rounded-xl"
                    textStyles="text-white"
                  />
                </View>
              ) : (
                <CustomButton
                  title="Next"
                  handlePress={handleNext}
                  containerStyles="w-full mx-auto min-h-[46px] bg-[#F98C53] rounded-xl"
                  textStyles="text-white"
                />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Trip;

const styles = StyleSheet.create({
  currentStep: {
    flex: 1,
  },
});

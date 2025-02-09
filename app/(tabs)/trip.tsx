import { Text, View, Image } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Stack } from "expo-router";

const StepOne = () => (
  <View className="flex-1">
    <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
      Choose your first destination
    </Text>
  </View>
);

const StepTwo = () => (
  <View className="flex-1">
    <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
      Calculate distance
    </Text>
  </View>
);

const StepThree = () => (
  <View className="flex-1">
    <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
      Choose tourguide
    </Text>
  </View>
);

const StepFour = () => (
  <View className="flex-1">
    <Text className="text-2xl font-bold mb-5 text-[#0F2650]">
      Review & Confirm
    </Text>
  </View>
);

const Trip = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [StepOne, StepTwo, StepThree, StepFour];
  const CurrentStepComponent =
    currentStep === 0 ? null : steps[currentStep - 1];

  const handleStart = () => {
    console.log("start");
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
    <View className="h-full relative">
      <Stack.Screen
        options={{
          headerShown: currentStep > 0,
          headerLeft: () =>
            currentStep > 0 ? (
              <CustomButton
                title="Back"
                handlePress={handleBack}
                containerStyles="bg-transparent"
                textStyles="text-[#0F2650]"
              />
            ) : null,
          headerTitle: currentStep > 0 ? `Step ${currentStep} of 4` : "",
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
          {CurrentStepComponent && <CurrentStepComponent />}
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

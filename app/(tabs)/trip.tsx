import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Stack, router } from "expo-router";

const StepOne = () => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Choose your first destination</Text>
  </View>
);

const StepTwo = () => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Calculate distance</Text>
  </View>
);

const StepThree = () => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Choose tourguide</Text>
  </View>
);

const StepFour = () => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Review & Confirm</Text>
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
    <View style={{ height: "100%", position: "relative" }}>
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
            className="w-full"
            resizeMode="cover"
            style={{ height: "80%" }}
          />
          <View style={styles.card}>
            <Text style={styles.title}>Start booking your trip</Text>
            <Text style={styles.description}>
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
        <View style={styles.stepsContainer}>
          {CurrentStepComponent && <CurrentStepComponent />}
          <View style={styles.navigationButtons}>
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

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: "15%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  stepsContainer: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0F2650",
  },
  navigationButtons: {
    paddingVertical: 20,
  },
});

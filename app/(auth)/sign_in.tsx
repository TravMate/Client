import { Text, ScrollView, Alert, View, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createSession } from "@/lib/auth";
import { router } from "expo-router";
import CustomTextInput from "@/components/CustomTextInput";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async (email: string, password: string) => {
    const response = await createSession({ email, password });

    if (response) {
      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Error", "Sign in failed. Please try again.");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-center text-3xl text-[#0F2650] font-bold mt-12 mb-10">
          Sign In
        </Text>
        <View className="justify-center items-center pb-10">
          <Image
            source={images.logo}
            className="w-[110px] h-[110px]"
            resizeMode="contain"
          />
          <Image
            source={images.travmate}
            className="w-[160px] h-[100px]"
            resizeMode="contain"
          />
        </View>
        <CustomTextInput
          label="Email"
          inputStyles={{ marginBottom: 35 }}
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />
        <CustomTextInput
          label="Password"
          password={true}
          inputStyles={{ marginBottom: 35 }}
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />
        <CustomButton
          title="Sign In"
          handlePress={() => handleSignIn(form.email, form.password)}
          containerStyles="w-full mx-auto mt-10 min-h-[62px] bg-[#F98C53] rounded-xl"
          textStyles="text-[#0F2650]"
        />
        <View className="flex-row justify-center mt-10">
          <Text className="text-base text-[#0F2650]">Don’t have Account?</Text>
          <Text
            className="text-[#F98C53] text-base"
            onPress={() => router.push("/(auth)/sign_up")}
          >
            {"  "}Sign Up
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "@/components/CustomTextInput";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { getUser } from "@/lib/auth";
import { Account, Client } from "react-native-appwrite";
import * as Icons from "react-native-heroicons/outline";

const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;

const client = new Client()
  .setProject(`${PROJECT_ID}`)
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setPlatform("com.company.travmate");

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

const EditProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      if (userData) {
        setForm({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
      }
    };
    loadUser();
  }, []);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const account = new Account(client);

      // Update name
      if (form.name) {
        await account.updateName(form.name);
      }

      // Update phone
      if (form.phone) {
        await account.updatePhone(form.phone, "");
      }

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Edit Profile
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute right-5 top-4 bg-white rounded-full p-2"
          style={buttonStyles}
        ></TouchableOpacity>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View className="items-center my-6">
          <View className="w-24 h-24 rounded-full overflow-hidden mb-3">
            <Image
              source={{
                uri:
                  "https://ui-avatars.com/api/?name=" + (form.name || "User"),
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="space-y-5">
          {/* Full Name Input */}
          <View className="mb-5">
            <Text className="text-gray-600 mb-2 text-base">Full Name</Text>
            <CustomTextInput
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
              inputStyles={{ backgroundColor: "#F9FAFB" }}
            />
          </View>

          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-gray-600 mb-2 text-base">Email</Text>
            <CustomTextInput
              value={form.email}
              editable={false}
              inputStyles={{ backgroundColor: "#F9FAFB" }}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
          </View>

          {/* Phone Input */}
          <View>
            <Text className="text-gray-600 mb-2 text-base">Phone Number</Text>
            <CustomTextInput
              value={form.phone}
              onChangeText={(value) => setForm({ ...form, phone: value })}
              keyboardType="phone-pad"
              inputStyles={{ backgroundColor: "#F9FAFB" }}
            />
          </View>

          <CustomButton
            title="Update"
            handlePress={handleUpdateProfile}
            isLoading={isLoading}
            containerStyles="w-full mx-auto bg-[#F98C53] rounded-xl py-4 mt-52"
            textStyles="text-white font-medium"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

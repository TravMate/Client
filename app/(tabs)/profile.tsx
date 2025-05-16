import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { logout, getUser } from "@/lib/auth";
import { router } from "expo-router";
import * as Icons from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserProps } from "@/types/type";
import usePlanTripStore from "@/store/planTripStore";

const buttonStyles = {
  borderWidth: 1,
  borderColor: "rgba(0, 0, 0, 0.30)",
  shadowColor: "rgba(0, 0, 0, 0.25)",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 1,
  shadowRadius: 3.3,
  elevation: 3,
};

const Profile = () => {
  const [user, setUser] = useState<UserProps | null>(null);
  const { clearPlaces } = usePlanTripStore();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  const logoutHandlePress = async () => {
    await logout();
    clearPlaces();
    router.replace("/welcome");
  };

  const navigateToEditProfile = () => {
    router.push("/edit-profile");
  };

  const navigateToFavorites = () => {
    router.push("/favorites");
  };

  const navigateToBookedTrips = () => {
    router.push("/Trips");
  };

  const navigateToHelp = () => {
    router.push("/help-support");
  };

  const navigateToSettings = () => {
    // To be implemented
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Text className="text-2xl font-semibold text-center mt-12 mb-6">
        Profile
      </Text>

      {/* Profile Info */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full overflow-hidden mb-3">
          <Image
            source={{
              uri: "https://ui-avatars.com/api/?name=" + (user?.name || "User"),
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-lg font-semibold mb-1">
          {user?.name || "Loading..."}
        </Text>
        <Text className="text-gray-500 text-sm">
          {user?.email || "Loading..."}
        </Text>
      </View>

      {/* Menu Items */}
      <View className="px-5 space-y-3">
        <TouchableOpacity
          onPress={navigateToEditProfile}
          className="flex-row items-center bg-white rounded-2xl py-4 px-4 shadow-sm"
          style={buttonStyles}
        >
          <View className="flex-row items-center flex-1">
            <Icons.UserIcon
              size={28}
              color="white"
              fill="rgba(0, 0, 0, 0.60)"
            />
            <Text className="text-base text-gray-600 ml-3">Edit profile</Text>
          </View>
          <Icons.ChevronRightIcon size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToFavorites}
          className="flex-row items-center bg-white rounded-2xl py-4 px-4 shadow-sm mt-4"
          style={buttonStyles}
        >
          <View className="flex-row items-center flex-1">
            <Icons.HeartIcon
              size={28}
              color="white"
              fill="rgba(0, 0, 0, 0.60)"
            />
            <Text className="text-base text-gray-600 ml-3">Favorites</Text>
          </View>
          <Icons.ChevronRightIcon size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToHelp}
          className="flex-row items-center bg-white rounded-2xl py-4 px-4 shadow-sm mt-4"
          style={buttonStyles}
        >
          <View className="flex-row items-center flex-1">
            <Icons.QuestionMarkCircleIcon
              size={28}
              color="white"
              fill="rgba(0, 0, 0, 0.60)"
            />
            <Text className="text-base text-gray-600 ml-3">
              Help and support
            </Text>
          </View>
          <Icons.ChevronRightIcon size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToBookedTrips}
          className="flex-row items-center bg-white rounded-2xl py-4 px-4 shadow-sm mt-4"
          style={buttonStyles}
        >
          <View className="flex-row items-center flex-1">
            <Icons.MapIcon size={28} color="white" fill="rgba(0, 0, 0, 0.60)" />
            <Text className="text-base text-gray-600 ml-3">
              Your Booked Trips
            </Text>
          </View>
          <Icons.ChevronRightIcon size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={logoutHandlePress}
        className="mx-5 mt-auto mb-5 bg-red-500 rounded-xl py-4"
      >
        <View className="flex-row justify-center items-center">
          <Icons.ArrowRightOnRectangleIcon color="white" size={24} />
          <Text className="ml-2 text-white text-base font-medium">Log out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

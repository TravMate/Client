import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { logout } from "@/lib/auth";
import { router } from "expo-router";
import * as Icons from "react-native-heroicons/outline";

const profile = () => {
  const logoutHandlePress = () => {
    logout();
    router.replace("/welcome");
  };
  return (
    <View className="flex-1 items-center justify-center">
      <Icons.ArrowLeftStartOnRectangleIcon
        color={"red"}
        size={40}
        onPress={logoutHandlePress}
      />
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});

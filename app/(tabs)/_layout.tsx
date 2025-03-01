import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";
import { images } from "@/constants";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 65,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "orange",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          headerStyle: { backgroundColor: "#F1F1F1" },
          headerLeft: () => (
            <View className="flex-row justify-between items-center gap-1 ml-5">
              <Image
                source={images.logo}
                className="w-[30px] h-[30px]"
                resizeMode="contain"
              />
              <Image
                source={images.travmate}
                className="w-[85px] h-[80px]"
                resizeMode="contain"
              />
            </View>
          ),
          headerRight: () => (
            <View className="mr-5">
              <SolidIcons.BellIcon color={"#F98C53"} size={30} />
            </View>
          ),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SolidIcons.HomeIcon size={24} color={color} />
            ) : (
              <OutlineIcons.HomeIcon size={24} color={color} />
            ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          headerShown: false,
          title: "Trip",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SolidIcons.MapIcon size={24} color={color} />
            ) : (
              <OutlineIcons.MapIcon size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <SolidIcons.UserIcon size={24} color={color} />
            ) : (
              <OutlineIcons.UserIcon size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});

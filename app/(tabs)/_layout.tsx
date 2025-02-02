import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import * as OutlineIcons from "react-native-heroicons/outline";

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: () => {
            return <OutlineIcons.HomeIcon size={24} color="black" />;
          },
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          headerShown: false,
          tabBarIcon: () => {
            return <OutlineIcons.MapIcon size={24} color="black" />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: () => {
            return <OutlineIcons.UserIcon size={24} color="black" />;
          },
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});

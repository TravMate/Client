import { View, Text, Image } from "react-native";
import React from "react";
import { GoogleInputProps } from "@/types/type";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
// Define the ref type
export type GoogleTextInputRef = {
  clear: () => void;
};

const GoogleTextInput = ({
  icon,
  containerStyle,
  handlePress,
  textInputBackgroundColor,
  initialLocation,
}: GoogleInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl mb-5 ${containerStyle}`}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Where you want to go?"
        debounce={200}
        enablePoweredByContainer={false}
        keyboardShouldPersistTaps="handled"
        styles={{
          container: {
            flex: 0,
            width: "100%",
          },
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor || "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
            paddingVertical: 10,
          },
          listView: {
            backgroundColor: textInputBackgroundColor || "white",
            position: "absolute",
            top: 55,
            left: 20,
            right: 20,
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
            elevation: 3,
          },
          row: {
            padding: 13,
            height: 50,
          },
          separator: {
            height: 0.5,
            backgroundColor: "#c8c7cc",
          },
        }}
        onPress={(data, details = null) => {
          if (!details) return;
          handlePress({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "ar",
          components: "country:eg",
          types: "establishment",
          radius: 20000,
          location: initialLocation,
        }}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where you want to go?",
          returnKeyType: "search",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;

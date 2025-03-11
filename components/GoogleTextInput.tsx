// import { View, Text } from "react-native";
// import React, { forwardRef, useImperativeHandle, useRef } from "react";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

// interface GoogleInputProps {
//   icon?: any;
//   containerStyle?: string;
//   handlePress: (data: any) => void;
//   textInputBackgroundColor?: string;
//   initialLocation?: string;
// }

// // Define the ref type
export type GoogleTextInputRef = {
  clear: () => void;
};

// const GoogleTextInput = forwardRef<GoogleTextInputRef, GoogleInputProps>(
//   (
//     {
//       icon,
//       containerStyle,
//       handlePress,
//       textInputBackgroundColor,
//       initialLocation,
//     },
//     ref
//   ) => {
//     const googlePlacesRef = useRef(null);

//     // Expose methods to parent component through ref
//     useImperativeHandle(ref, () => ({
//       clear: () => {
//         if (googlePlacesRef.current) {
//           // @ts-ignore - We know this method exists on the ref
//           googlePlacesRef.current.clear();
//         }
//       },
//     }));

//     return (
//       <View className={`flex-1 rounded-xl ${containerStyle}`}>
//         <GooglePlacesAutocomplete
//           ref={googlePlacesRef}
//           fetchDetails={true}
//           placeholder="Where you want to go?"
//           debounce={200}
//           styles={{
//             textInputContainer: {
//               alignItems: "center",
//               justifyContent: "center",
//               borderRadius: 20,
//               position: "relative",
//               shadowColor: "#d4d4d4",
//             },
//             textInput: {
//               backgroundColor: textInputBackgroundColor || "white",
//               fontSize: 16,
//               fontWeight: "600",
//               marginTop: 5,
//               borderRadius: 200,
//               paddingHorizontal: 16,
//               paddingVertical: 12,
//             },
//             listView: {
//               backgroundColor: textInputBackgroundColor || "white",
//               position: "relative",
//               top: 0,
//               borderRadius: 10,
//               shadowColor: "#d4d4d4",
//               zIndex: 99,
//             },
//           }}
//           onPress={(data, details = null) => {
//             if (!details) return;
//             handlePress({
//               latitude: details.geometry.location.lat,
//               longitude: details.geometry.location.lng,
//               address: data.description,
//             });
//           }}
//           query={{
//             key: googlePlacesApiKey,
//             language: "ar", // Changed from "ar" to "en"
//             components: "country:eg",
//             types: "establishment",
//             radius: 20000,
//             location: initialLocation,
//           }}
//           textInputProps={{
//             placeholderTextColor: "gray",
//             placeholder: initialLocation ?? "Where you want to go?",
//           }}
//         />
//       </View>
//     );
//   }
// );

// export default GoogleTextInput;

import { View, Text, Image } from "react-native";
import React from "react";
import { GoogleInputProps } from "@/types/type";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { icons } from "@/constants";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

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
        styles={{
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
          },
          listView: {
            backgroundColor: textInputBackgroundColor || "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
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
        // renderLeftButton={() => (
        //   <View className="justify-center items-center w-6 h-6">
        //     <Image
        //       source={icon ? icon : icons.search}
        //       className="w-6 h-6"
        //       resizeMode="contain"
        //     />
        //   </View>
        // )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;

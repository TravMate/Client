import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";

export const unstable_settings = {
  initialRouteName: "welcome",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [loaded, error] = useFonts({
    // Add any custom fonts here
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.travmate.com" // required for Apple Pay
      urlScheme={Linking.createURL("/")?.split(":")[0]} // required for 3D Secure and bank redirects
    >
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="PlaceDetails" options={{ headerShown: false }} />
          <Stack.Screen
            name="BookedTripDetails"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="favorites" options={{ headerShown: false }} />
          <Stack.Screen name="help-support" options={{ headerShown: false }} />
          <Stack.Screen name="Trips" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </StripeProvider>
  );
}

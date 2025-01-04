import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useOnboarding } from "@/store/onboarding";

import { Redirect } from "expo-router";

import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

export default function AppIndexLayout() {
  const { showOnboarding, isLoading, setIsLoading } = useOnboarding();

  if (showOnboarding === true) {
    return <Redirect href={"/(onboarding)"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="setting" options={{ headerShown: false }} />
      <Stack.Screen
        name="currency-details/[symbol]"
        options={{
          presentation: "formSheet",
          headerShown: false,
          statusBarAnimation: "fade",
          statusBarHidden: false,
          sheetGrabberVisible: true,
          statusBarStyle: "light",
          contentStyle: {
            backgroundColor: "#F7ECC9",
          },
        }}
      />
      <Stack.Screen
        name="change-currency/[symbol]"
        options={{
          presentation: "formSheet",
          headerShown: false,
          statusBarAnimation: "fade",
          statusBarHidden: false,
          sheetGrabberVisible: true,
          statusBarStyle: "light",
          contentStyle: {
            backgroundColor: "#F7ECC9",
          },
        }}
      />
      <Stack.Screen
        name="color-picker"
        options={{
          presentation: "formSheet",
          headerShown: false,
          statusBarAnimation: "fade",
          statusBarHidden: false,
          sheetAllowedDetents: [0.5, 0.75],
          sheetGrabberVisible: true,
          statusBarStyle: "light",
          contentStyle: {
            backgroundColor: "#F7ECC9",
          },
        }}
      />
    </Stack>
  );
}

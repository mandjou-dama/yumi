import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="choose-favorites"
          options={{ headerShown: false }}
        />
        <Stack.Screen />
      </Stack>
    </SafeAreaProvider>
  );
}

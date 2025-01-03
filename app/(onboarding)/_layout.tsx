import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#F7ECC9",
          },
        }}
      />
      <Stack.Screen name="choose-favorites" options={{ headerShown: false }} />
    </Stack>
  );
}

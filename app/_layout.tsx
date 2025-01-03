import { useEffect } from "react";
import { Redirect, router } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { View, ActivityIndicator } from "react-native";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColorScheme } from "@/hooks/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

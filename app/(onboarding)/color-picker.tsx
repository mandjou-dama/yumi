import React from "react";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Colors } from "@/data/colors";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function ColorPickerScreen() {
  const router = useRouter();
  const { newSymbol, newName } = useLocalSearchParams();

  const {
    setFavoriteCurrencyColor,
    replaceFavoriteCurrency,
    fetchExchangeRates,
    fetchTimeSeries,
  } = useCurrencyStore();

  const handleColorSelect = (color: string) => {
    if (newSymbol) {
      //   replaceFavoriteCurrency(newSymbol.toString(), newName.toString(), color);
      //   fetchExchangeRates();
      //   fetchTimeSeries();
    }
    router.dismissTo("/(onboarding)/choose-favorites");
  };

  return (
    <FlatList
      data={Colors}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            if (process.env.EXPO_OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            handleColorSelect(item);
          }}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: item,
            }}
          />
        </Pressable>
      )}
      numColumns={5}
      keyExtractor={(item) => item}
      automaticallyAdjustContentInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: 0 }}
      scrollIndicatorInsets={{ bottom: 0 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 40,
        gap: 16,
        paddingBottom: 100,
      }}
    />
  );
}

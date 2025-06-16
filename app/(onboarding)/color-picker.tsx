import React from "react";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Colors } from "@/data/colors";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { FlashList } from "@shopify/flash-list";

export default function ColorPickerScreen() {
  const router = useRouter();
  const { newSymbol, newName, index } = useLocalSearchParams();

  const { addItemToFavoriteCurrencies } = useCurrencyStore();

  const handleColorSelect = (color: string) => {
    if (newSymbol) {
      addItemToFavoriteCurrencies(
        index.toString(),
        newSymbol.toString(),
        newName.toString(),
        color
      );
    }
    console.log(index, newSymbol, newName, color);
    router.dismissTo("/(onboarding)/choose-favorites");
  };

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={Colors}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              handleColorSelect(item);
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8,
              paddingVertical: 8,
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
        estimatedItemSize={66}
        contentInset={{ bottom: 0 }}
        scrollIndicatorInsets={{ bottom: 0 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 40,
          // gap: 16,
          paddingBottom: 100,
        }}
        // style={{ gap: 16 }}
      />
    </View>
  );
}

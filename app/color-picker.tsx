import React from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Colors } from "@/data/colors";

export default function ColorPickerScreen() {
  const router = useRouter();

  const handleColorSelect = (color: string) => {
    //setSelectedColor(color);
    router.canGoBack();
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

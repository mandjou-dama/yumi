import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import Box from "@/components/Box";
import Draggable from "@/components/draggable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView } from "react-native";

const arr = new Array(3).fill("").map((_, i) => i);

export default function SettingScreen() {
  const positions = useSharedValue(
    Object.assign({}, ...arr.map((item) => ({ [item]: item })))
  );

  return (
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        <View
          style={{ height: "30%", backgroundColor: "blue", width: "100%" }}
        ></View>
        <View style={styles.wrapper}>
          {arr.map((item) => (
            <Draggable key={item} positions={positions} id={item}>
              <Box key={item} count={item} />
            </Draggable>
          ))}
        </View>
        <View
          style={{ height: "30%", backgroundColor: "blue", width: "100%" }}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },
  topWrapper: {
    height: "97%",
    backgroundColor: "#F7ECC9",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    paddingHorizontal: 20,
    height: "30%",
    width: "100%",
    backgroundColor: "red",
    overflow: "hidden",
  },
});

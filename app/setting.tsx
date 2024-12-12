import { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        <View style={styles.wrapper}></View>
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
    width: "100%",
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
  item: {
    padding: 10,
    backgroundColor: "#6e48eb",
    borderRadius: 10,
    marginBottom: 3,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

import { GenerateVoice, BottomArrow } from "@/assets/icons/icons";
export interface CurrencyCardProps {
  currency?: string | undefined;
  color?: string | undefined;
  currencyValue?: string | undefined;
  currencyName?: string | undefined;
  isLong?: boolean;
  onPress?: () => void;
  onBottomArrowPress?: () => void;
}

export default function CurrencyCard(props: CurrencyCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, { backgroundColor: props.color }]}
      onPress={props.onPress}
    >
      <View style={styles.leftWrapper}>
        <View style={styles.imageContainer}></View>
        <View>
          <Text style={styles.currencyName}>{props.currencyName}</Text>
          <Text style={styles.currencyValue}>{props.currencyValue}</Text>
        </View>
      </View>

      <View style={styles.rightWrapper}>
        {props.isLong && <GenerateVoice />}
        <TouchableOpacity
          onPress={props.onBottomArrowPress}
          style={styles.bottomArrow}
        >
          <BottomArrow />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 75,
    backgroundColor: "#f0ebd8",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  leftWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: "80%",
  },
  rightWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  imageContainer: {
    width: 55,
    height: "100%",
    backgroundColor: "#f0ebd86e",
    borderRadius: 10,
  },
  currencyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  currencyValue: {
    fontSize: 16,
  },
  bottomArrow: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

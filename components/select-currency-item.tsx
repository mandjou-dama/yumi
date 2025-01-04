import { StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

type Props = {
  name: string;
  symbol: string;
  onPress: () => void;
};

const SelectCurrency = ({ name, symbol, onPress }: Props) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPress();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
    >
      <Animated.View style={[styles.container]}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.symbol}>{symbol}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default SelectCurrency;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff46",
    marginBottom: 10,
    borderRadius: 15,
    gap: 10,
  },
  name: {
    fontWeight: 600,
  },
  symbol: {},
});

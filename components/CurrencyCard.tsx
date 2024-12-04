import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { GenerateVoice, BottomArrow } from "@/assets/icons/icons";

export interface CurrencyCardProps {
  currency?: string;
  color?: string;
  currencyValue?: string;
  currencyName?: string;
  isLong?: boolean;
  onPress?: () => void;
  onBottomArrowPress?: () => void;
}

export default function CurrencyCard(props: CurrencyCardProps) {
  const scale = useSharedValue(1);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 200 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={props.onPress}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: props.color },
          animatedStyle,
        ]}
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
          <TouchableWithoutFeedback
            onPress={props.onBottomArrowPress}
            style={styles.bottomArrow}
          >
            <BottomArrow />
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
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

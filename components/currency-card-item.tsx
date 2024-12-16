// Import necessary modules and components from React and React Native
import { BottomArrow, GenerateVoice } from "@/assets/icons/icons";
import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export const ITEM_HEIGHT = 75;
export const BORDER_RADIUS = 20;

// Define the type for information about each list item
export type CurrencyCardItem = {
  name: string;
  symbol: string;
  value: string;
  color: string;
};

// Define the type for the props of the ListItem component
type ListItemProps = {
  style?: StyleProp<ViewStyle>;
  activeIndex: Animated.SharedValue<number | null>;
  index: number;
  maxBorderRadius?: number;
  isLong?: boolean;
  onPress: () => void;
  onBottomArrowPress?: () => void;
  item: CurrencyCardItem;
};

// Define the ListItem component
export const ListItem: React.FC<ListItemProps> = ({
  style,
  activeIndex,
  index,
  item,
  isLong,
  onPress,
  onBottomArrowPress,
}) => {
  // Render the ListItem component
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      {/* Icon and Text Container */}
      <Animated.View style={[styles.container, style]}>
        <View style={styles.leftWrapper}>
          <View style={styles.imageContainer}>
            <Text style={[styles.currency]}>{index}</Text>
          </View>
          <View>
            <Text style={styles.currencyName}>{item.name}</Text>
            <Text style={styles.currencyValue}>{item.value}</Text>
          </View>
        </View>

        <View style={styles.rightWrapper}>
          {isLong && <GenerateVoice />}
          <TouchableWithoutFeedback
            onPress={onBottomArrowPress}
            style={styles.bottomArrow}
          >
            <BottomArrow />
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// Define styles for the ListItem component
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: ITEM_HEIGHT,
    backgroundColor: "#f0ebd8",
    borderRadius: BORDER_RADIUS,
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
    backgroundColor: "#e7e7e66d",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
  currency: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d1321",
    opacity: 0.1,
  },
});

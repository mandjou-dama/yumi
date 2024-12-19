// Import necessary modules and components from React and React Native
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { Link } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BottomArrow, GenerateVoice } from "@/assets/icons/icons";

export const ITEM_HEIGHT = 75;
export const BORDER_RADIUS = 20;

// Define the type for information about each list item
export type CurrencyCardItem = {
  name: string;
  symbol: string;
  color: string;
};

// Define the type for the props of the ListItem component
type ListItemProps = {
  style?: StyleProp<ViewStyle>;
  activeIndex: Animated.SharedValue<number | null>;
  index: number;
  maxBorderRadius?: number;
  isLong?: boolean;
  color?: string;
  value: string;
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
  value,
  onPress,
  onBottomArrowPress,
}) => {
  // Use shared value for opacity with React Compiler-compliant API
  const opacity = useSharedValue(0.1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Trigger fade-out and fade-in effect when the index changes
    opacity.set(() =>
      withTiming(0, { duration: 300 }, () => {
        opacity.set(() => withTiming(0.1, { duration: 300 }));
      })
    );
  }, [index]);

  // Animated style for opacity
  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.get(),
    };
  });

  // Animated style for scale
  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.get() }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 500 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 500 });
  };

  return (
    <View>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Link
          href={{
            pathname: "/currency-details/[symbol]",
            params: { symbol: item.symbol, color: item.color, name: item.name },
          }}
        >
          <Animated.View style={[styles.container, style, animatedScaleStyle]}>
            {/* Left section with currency name and value */}
            <View style={styles.leftWrapper}>
              <View style={styles.imageContainer}>
                <Animated.Text style={[styles.currency, animatedOpacityStyle]}>
                  {index}
                </Animated.Text>
              </View>
              <View>
                <Text style={styles.currencyName}>{item.name}</Text>
                <Text style={styles.currencyValue}>{value}</Text>
              </View>
            </View>

            {/* Right section with optional icons */}
            <View style={styles.rightWrapper}>
              {isLong && <GenerateVoice />}
              {onBottomArrowPress && (
                <TouchableWithoutFeedback onPress={onBottomArrowPress}>
                  <View style={styles.bottomArrow}>
                    <BottomArrow />
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </Animated.View>
        </Link>
      </TouchableWithoutFeedback>
    </View>
  );
};

// Styles for the ListItem component
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
  },
});

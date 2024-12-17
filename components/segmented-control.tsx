import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import React from "react";

type SegmentedControlProps = {
  options: string[];
  selectedOption: string;
  color: string;
  onOptionPress: (option: string) => void;
};

const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
  ({ options, color, selectedOption, onOptionPress }) => {
    const { width: windowWidth } = useWindowDimensions();

    const segmentedControlWidth = windowWidth * 0.65;
    const segmentedControlInternalPadding = 15;
    const itemsWidth =
      (segmentedControlWidth - segmentedControlInternalPadding) /
      options.length;

    const rStyle = useAnimatedStyle(() => {
      return {
        left: withTiming(
          options.indexOf(selectedOption) <= 0
            ? itemsWidth * options.indexOf(selectedOption) +
                segmentedControlInternalPadding / 4
            : itemsWidth * options.indexOf(selectedOption) +
                segmentedControlInternalPadding / 2
        ),
      };
    }, [selectedOption, options, itemsWidth]);

    return (
      <View
        style={[
          styles.container,
          {
            width: segmentedControlWidth,
            paddingHorizontal: segmentedControlInternalPadding,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.animatedView,
            rStyle,
            {
              width: itemsWidth,
              backgroundColor: color,
            },
          ]}
        />
        {options.map((option) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onOptionPress?.(option);
            }}
            key={option}
            style={[
              styles.textContainer,
              {
                width: itemsWidth,
              },
            ]}
          >
            <Text style={styles.text}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
);

export { SegmentedControl };

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 15,
    height: 55,
    alignSelf: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  animatedView: {
    position: "absolute",
    height: "90%",
    borderRadius: 15,
  },
});

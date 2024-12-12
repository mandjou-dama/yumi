import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
} from "react-native-reanimated";
import Box from "@/components/Box";
import Draggable from "@/components/draggable";
import {
  PanGestureHandler,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { MARGIN, getOrder, getPosition } from "@/utils/for-draggable";

const arr = new Array(3).fill("").map((_, i) => i);

export default function SettingScreen() {
  const positions = useSharedValue(
    Object.assign({}, ...arr.map((item) => ({ [item]: item })))
  );

  const [id, setId] = useState(0);

  const position = getPosition(positions.value[id] || 0);
  const translateY = useSharedValue(position.y);
  const prevTranslateY = useSharedValue(0);
  const pressed = useSharedValue(false);

  const isGestureActive = useSharedValue(false);

  useAnimatedReaction(
    () => positions.value[id],
    (newOrder) => {
      if (newOrder != null) {
        const newPositions = getPosition(newOrder);
        translateY.value = withTiming(newPositions.y);
      }
    }
  );

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      pressed.value = true;
    })
    .onStart(() => {
      prevTranslateY.value = translateY.value;
      isGestureActive.value = true;
    })
    .onUpdate((evt) => {
      translateY.value = prevTranslateY.value + evt.translationY;

      const oldOrder = positions.value[id];
      const newOrder = getOrder(translateY.value);

      if (oldOrder !== newOrder) {
        const idToSwap = Object.keys(positions.value).find(
          (key) => positions.value[key] === newOrder
        );
        if (idToSwap != null) {
          const newPositions = { ...positions.value };
          newPositions[id] = newOrder;
          newPositions[idToSwap] = oldOrder;
          positions.value = newPositions;
        }
      }
    })
    .onEnd(() => {
      const destination = getPosition(positions.value[id] || 0);
      translateY.value = withTiming(destination.y);
    })
    .onFinalize(() => {
      isGestureActive.value = false;
      pressed.value = false;
    });

  return (
    <View style={styles.container}>
      <View style={styles.topWrapper}>
        <View
          style={{ height: "30%", backgroundColor: "blue", width: "100%" }}
        ></View>
        <View style={styles.wrapper}>
          {arr.map((item) => (
            <GestureDetector key={item} gesture={dragGesture}>
              <Draggable
                isGestureActive={isGestureActive}
                positions={positions}
                id={item}
              >
                <Box count={item} />
              </Draggable>
            </GestureDetector>
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

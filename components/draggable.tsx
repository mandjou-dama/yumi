import React from "react";
import {
  PanGestureHandler,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MARGIN, getOrder, getPosition } from "@/utils/for-draggable";
import { StyleSheet } from "react-native";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const Draggable = ({ children, positions, id, isGestureActive }: any) => {
  const position = getPosition(positions.value[id]);
  const translateY = useSharedValue(position.y);
  const prevTranslateY = useSharedValue(0);
  const pressed = useSharedValue<boolean>(false);

  useAnimatedReaction(
    () => positions.value[id],
    (newOrder) => {
      const newPostions = getPosition(newOrder);
      translateY.value = withTiming(newPostions.y);
    }
  );

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    //.activateAfterLongPress(1000)
    //.hitSlop({ top: 10, bottom: 10, left: 10, right: 10 })
    //.shouldCancelWhenOutside(true)
    .onBegin(() => {
      pressed.value = true;
    })
    .onStart((_evt) => {
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
        if (idToSwap) {
          const newPostions = JSON.parse(JSON.stringify(positions.value));
          newPostions[id] = newOrder;
          newPostions[idToSwap] = oldOrder;
          positions.value = newPostions;
        }
      }
    })
    .onEnd(() => {
      const destination = getPosition(positions.value[id]);
      translateY.value = withTiming(destination.y);
    })
    .onFinalize(() => {
      isGestureActive.value = false;
      pressed.value = false;
    });

  //   const panGesture = useAnimatedGestureHandler({
  //     onStart: (_, ctx) => {
  //       ctx.startY = translateY.value;
  //       isGestureActive.value = true;
  //     },
  //     onActive: (evt, ctx: any) => {
  //       translateY.value = ctx.startY + evt.translationY;

  //       const oldOrder = positions.value[id];
  //       const newOrder = getOrder(translateY.value);
  //       if (oldOrder !== newOrder) {
  //         const idToSwap = Object.keys(positions.value).find(
  //           (key) => positions.value[key] === newOrder
  //         );
  //         if (idToSwap) {
  //           const newPostions = JSON.parse(JSON.stringify(positions.value));
  //           newPostions[id] = newOrder;
  //           newPostions[idToSwap] = oldOrder;
  //           positions.value = newPostions;
  //         }
  //       }
  //     },
  //     onEnd: () => {
  //       const destination = getPosition(positions.value[id]);
  //       translateY.value = withTiming(destination.y);
  //     },
  //     onFinish: () => {
  //       isGestureActive.value = false;
  //     },
  //   });

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 1000 : 1;
    return {
      position: "absolute",
      margin: MARGIN * 3,
      zIndex,
      transform: [
        { translateY: translateY.value },
        { scale: withTiming(pressed.value ? 1.2 : 1) },
      ],
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <Animated.View>{children}</Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({});

export default Draggable;

import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ScrollViewProps, ViewProps } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";

// Import the SortableItem component and Positions type
import { CurrencySortableItem } from "./currency-sortable-item";
import type { Positions } from "@/typings";

// Define the props for the SortableList component
type SortableListProps<T> = {
  listItemHeight: number;
  data: T[];
  renderItem?: (_: { item: T; index: number }) => React.ReactNode;
  onAnimatedIndexChange?: (index: number | null) => void;
  onDragEnd?: (positions: Positions) => void;
  backgroundItem?: React.ReactNode;
} & ViewProps;

// Define the SortableList component
function CurrencySortableList<T>({
  renderItem: renderItemProp,
  data,
  listItemHeight,
  onAnimatedIndexChange,
  onDragEnd,
  backgroundItem,
  ...rest
}: SortableListProps<T>) {
  // Shared values for tracking scroll position, animated index, and scroll view reference
  const scrollContentOffsetY = useSharedValue(0);
  const scrollView = useAnimatedRef<Animated.View>();

  // Initial positions for list items
  const initialPositions = new Array(data?.length)
    .fill(0)
    .map((_, index) => index * listItemHeight)
    .reduce((acc, curr, index) => {
      acc[index] = curr;
      return acc;
    }, {} as Positions);

  // Shared value for tracking positions of list items
  const positions = useSharedValue<Positions>(initialPositions);

  // Shared value for tracking the currently animated index during drag-and-drop
  const animatedIndex = useSharedValue<number | null>(null);

  // Animated reaction to trigger a callback when the animated index changes
  useAnimatedReaction(
    () => animatedIndex.value,
    (currentIndex) => {
      if (onAnimatedIndexChange) runOnJS(onAnimatedIndexChange)(currentIndex);
    }
  );

  // Callback function for rendering each item
  const renderItem = useCallback(
    (params: { item: T; index: number }) => {
      return (
        <CurrencySortableItem
          itemHeight={listItemHeight}
          positions={positions}
          index={params.index}
          animatedIndex={animatedIndex}
          onDragEnd={onDragEnd}
          backgroundItem={backgroundItem}
          viewRef={scrollView}
          scrollContentOffsetY={scrollContentOffsetY}
          key={params.index}
        >
          {renderItemProp?.(params)}
        </CurrencySortableItem>
      );
    },
    [
      animatedIndex,
      backgroundItem,
      listItemHeight,
      onDragEnd,
      positions,
      renderItemProp,
      scrollContentOffsetY,
      scrollView,
    ]
  );

  // Render the SortableList component with an Animated.ScrollView
  return (
    <Animated.View
      {...rest}
      //ref={scrollView}
      style={[
        rest.style,
        {
          height: listItemHeight * data.length,
          //paddingTop: listItemHeight * data.length,
        },
      ]}
    >
      {data.map((item, index) => {
        return renderItem({
          item,
          index: index,
        });
      })}
    </Animated.View>
  );
}

// Export the SortableList component
export { CurrencySortableList };

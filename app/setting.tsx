import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";

import { CurrencySortableList } from "@/components/currencies-card-list";
import { ListItem } from "@/components/currency-card-item";
import { ITEMS } from "@/data/fakeCardData";
import type { Positions } from "@/typings";

const PADDING = 6;
const HEIGHT = 80;
const ITEM_HEIGHT = HEIGHT + PADDING * 2;
const MAX_BORDER_RADIUS = 10;

const LINEAR_GRADIENT_COLORS = [
  "rgba(255,255,255,1)",
  "rgba(255,255,255,0.05)",
  "rgba(255,255,255,0.025)",
];

const Setting = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { top: safeTop } = useSafeAreaInsets();

  const onDragEnd = useCallback((data: Positions) => {
    // onDragEnd is called when the user releases the item (if the item was moved)
    // The data argument contains the new positions of the items
    // The data is a map of index to height

    // Here's an example of how to get the new order of the items based on the data

    // Convert the map into an array of [index, height] pairs
    const heightArray = Object.entries(data).map(([index, height]) => [
      parseInt(index, 10),
      height,
    ]);

    // Sort the array based on the height (second element in each pair)
    heightArray.sort((a, b) => a[1] - b[1]);

    // Extract the sorted indices
    const newOrder = heightArray.map(([index]) => index);

    console.log({ newOrder });
  }, []);

  // Shared value for tracking the currently active index (the item that is being dragged)
  // This is used to update the border radius of the active item
  const currentActiveIndex = useSharedValue<number | null>(null);

  return (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0.05)",
          "rgba(255,255,255,0.025)",
        ]}
        style={[
          {
            height: safeTop * 3,
          },
          styles.gradient,
        ]}
      />
      <CurrencySortableList
        style={{
          paddingTop: safeTop,
        }}
        onAnimatedIndexChange={(index) => {
          currentActiveIndex.value = index;
        }}
        onDragEnd={onDragEnd}
        backgroundItem={
          // Kind of hacky way to make the background item have rounded corners
          <View
            style={[
              styles.backgroundItem,
              {
                width: windowWidth - PADDING * 2,
              },
            ]}
          />
        }
        showsVerticalScrollIndicator={false}
        data={ITEMS}
        listItemHeight={ITEM_HEIGHT}
        // At the beginning I was thinking about using a FlatList
        // but unfortunately it doesn't work well while dragging
        // (because the zIndex of the items is not updated correctly)
        renderItem={({ item, index }) => {
          return (
            <ListItem
              item={item}
              style={{
                height: HEIGHT,
                margin: PADDING,
                backgroundColor: "white",
              }}
              maxBorderRadius={MAX_BORDER_RADIUS}
              index={index}
              activeIndex={currentActiveIndex}
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 50,
  },
  backgroundItem: {
    backgroundColor: "rgba(0,0,0,0.1)",
    flex: 1,
    borderRadius: MAX_BORDER_RADIUS,
    margin: PADDING,
  },
});

export default Setting;

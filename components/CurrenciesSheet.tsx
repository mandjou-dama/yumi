import React, { useCallback, useMemo, forwardRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

// Define the type for the data items
type DataItem = string;

const CurrenciesSheet = forwardRef((props, ref: any) => {
  // variables
  const data = useMemo<DataItem[]>(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const snapPoints = useMemo(() => ["70%"], []);

  // render
  const renderItem = useCallback<{
    ({ item }: { item: DataItem }): JSX.Element;
  }>(
    ({ item }) => (
      <View style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const keyExtractor = (item: DataItem, index: number) => `key-${index}`;

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        {...props}
      >
        <BottomSheetFlashList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={43.3}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

CurrenciesSheet.displayName = "CurrenciesSheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default CurrenciesSheet;

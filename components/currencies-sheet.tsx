import React, { useCallback, useMemo, forwardRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

// type for the data items
type DataItem = string;

// type for the props
export interface CurrenciesSheetProps {
  color?: string;
}

const CurrenciesSheet = forwardRef<BottomSheetModal, CurrenciesSheetProps>(
  (props, ref: any) => {
    // variables
    const data = useMemo<DataItem[]>(
      () =>
        Array(50)
          .fill(0)
          .map((_, index) => `index-${index}`),
      []
    );

    const snapPoints = useMemo(() => ["82%"], []);

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

    // callbacks
    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
      return (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          pressBehavior="close"
          disappearsOnIndex={-1}
        />
      );
    }, []);

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
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.backgroundStyle}
          handleIndicatorStyle={{ backgroundColor: props.color }}
          stackBehavior="push"
          {...props}
        >
          <BottomSheetFlashList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={43.3}
            contentContainerStyle={styles.contentContainerStyle}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

CurrenciesSheet.displayName = "CurrenciesSheet";

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
  },
  backgroundStyle: {
    backgroundColor: "#F7ECC9",
  },
});

export default CurrenciesSheet;

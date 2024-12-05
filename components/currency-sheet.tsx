import React, { useCallback, useMemo, forwardRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  BottomSheetView,
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

const CurrencySheet = forwardRef<BottomSheetModal, CurrenciesSheetProps>(
  (props, ref: any) => {
    const snapPoints = useMemo(() => ["82%"], []);

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
          <BottomSheetView style={styles.contentContainerStyle}>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

CurrencySheet.displayName = "CurrencySheet";

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

export default CurrencySheet;

import React, { useCallback, useMemo, forwardRef, useState } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import Chart from "./chart";

// type for the props
export interface CurrenciesSheetProps {
  color?: string;
}

const CurrencySheet = forwardRef<BottomSheetModal, CurrenciesSheetProps>(
  (props, ref: any) => {
    const [activeCurrency, setActiveCurrency] = useState("XOF");

    const snapPoints = useMemo(() => ["82%"], []);
    const currencies = useMemo(() => ["XOF", "EUR"], []);

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

      if (index === -1) {
        setActiveCurrency("XOF");
      }
    }, []);

    const scale = useSharedValue(1);

    // Animated style
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withTiming(0.95, { duration: 200 });
    };

    const handlePressOut = () => {
      scale.value = withTiming(1, { duration: 200 });
    };

    const handleSelectCurrency = useCallback(
      (currency: string) => {
        setActiveCurrency(currency);
      },
      [activeCurrency]
    );
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
          detached={false}
          enableContentPanningGesture={false}
          {...props}
        >
          <BottomSheetView style={styles.contentContainerStyle}>
            <View style={styles.header}>
              <View style={styles.currencyInfosWrapper}>
                <View
                  style={[
                    styles.currencySymbolWrapper,
                    { backgroundColor: props.color },
                  ]}
                >
                  <Text style={styles.currencySymbol}>USD</Text>
                </View>
                <Text style={styles.currencyName}>United States Dollar</Text>
              </View>

              <View style={styles.currenciesSelectorWrapper}>
                {currencies.map((currency, index) => (
                  <TouchableWithoutFeedback
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={() => handleSelectCurrency(currency)}
                    key={index}
                  >
                    <Animated.View
                      style={
                        activeCurrency === currency
                          ? [styles.currencyWrapper, animatedStyle]
                          : styles.currencyWrapperInactive
                      }
                    >
                      <Text
                        style={
                          activeCurrency === currency
                            ? [styles.currency, { color: props.color }]
                            : [styles.currency, { color: "#0d1321" }]
                        }
                      >
                        {currency}
                      </Text>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                ))}
              </View>

              <View style={styles.currencyChartWrapper}>
                <Chart color={props.color} />
              </View>
            </View>
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
  header: {
    paddingTop: 10,
  },
  currencyInfosWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  currencySymbolWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 55,
    borderRadius: 100,
  },
  currencySymbol: {
    fontWeight: "bold",
    color: "#0d1321",
  },
  currencyName: {
    color: "#0d1321",
    fontSize: 16,
    opacity: 0.4,
    marginTop: 10,
  },
  currenciesSelectorWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "65%",
    alignSelf: "center",
  },
  currencyWrapper: {
    width: "50%",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#0C0C0C",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyWrapperInactive: {
    width: "50%",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f7ecc993",
    justifyContent: "center",
    alignItems: "center",
  },
  currency: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currencyChartWrapper: {
    flex: 1,
    justifyContent: "center",
    marginTop: 15,
    width: "100%",
    height: "100%",
    overflowX: "hidden",
    //paddingHorizontal: 20,
  },
});

export default CurrencySheet;

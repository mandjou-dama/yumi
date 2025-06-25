import { useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useOnboarding } from "@/store/onboarding";
import { usePositionStore } from "@/store/usePositionStore";

//hooks
import { useAnimatedShake } from "@/hooks/useAnimatedShake";

// components & icons
import NumPad from "@/components/num-pad";
import { RestoreIcon, Settings } from "@/assets/icons/icons";
import { CurrencySortableList } from "@/components/currencies-card-list";
import { Positions } from "@/typings";
import { ListItem } from "@/components/currency-card-item";

const PADDING = 6;
const HEIGHT = 75;
const ITEM_HEIGHT = HEIGHT + PADDING * 2;
const MAX_BORDER_RADIUS = 20;

export default function HomeScreen() {
  // state
  const { width } = useWindowDimensions();
  console.log(width);

  const { isUpdateAvailable } = Updates.useUpdates();

  // If true, we show the button to download and run the update
  const showDownloadButton = isUpdateAvailable;

  const updateAsync = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Error fetching update:", error);
      // You might want to show an error message to the user here
    }
  };

  // store
  const {
    favoriteCurrencies,
    setBaseCurrency,
    amountToConvert,
    setAmountToConvert,
    amountInputRaw,
    setAmountInputRaw,
    fetchExchangeRates,
    handleConversion,
    convertedCurrencies,
    lastFetchTime,
  } = useCurrencyStore();

  const { resetPositions } = usePositionStore();
  const {
    isLoading,
    setIsLoading,
    clearStorage: clearOnboardingStorage,
  } = useOnboarding();

  useEffect(() => {
    //const fiveMinutesInMilliseconds = 5 * 60 * 1000;
    const sevenDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;

    // Check if 7 days have passed since the last fetch
    if (
      !lastFetchTime ||
      Date.now() - parseInt(lastFetchTime, 10) > sevenDaysInMilliseconds
    ) {
      //function to get actual Date and Date - 7 days in this format "YYYY-MM-DD"
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - sevenDaysInMilliseconds)
        .toISOString()
        .split("T")[0];

      fetchExchangeRates();
    }
  }, [favoriteCurrencies]);

  useEffect(() => {
    if (isLoading === true) {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
    return () => {};
  }, []);

  // hooks
  const insets = useSafeAreaInsets();
  const { shake, rStyle, isShaking } = useAnimatedShake();

  // animated styles
  const rErrorTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isShaking.get() ? "#eb7b81" : "#0d1321", {
        duration: 50,
      }),
    };
  }, []);

  const handleInputChange = (value: string) => {
    setAmountInputRaw(value);
    const amount = Number(value);
    setAmountToConvert(amount);
    handleConversion(amount);
  };

  // Accepts string input to preserve user formatting
  const formatCurrency = (input: string | number, sliced: boolean = false) => {
    let str = typeof input === "number" ? input.toString() : input;
    if (!str) return "";
    // If input starts with '.', prepend '0'
    if (str.startsWith(".")) str = "0" + str;
    // If input ends with '.', keep the trailing dot
    const [integer, decimal] = str.split(".");
    const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (typeof decimal !== "undefined") {
      if (sliced) {
        return `${formattedInt}.${decimal.slice(0, 2)}`;
      }
      return `${formattedInt}.${decimal}`;
    }
    return formattedInt;
  };

  const onDragEnd = useCallback(
    (data: Positions) => {
      // Map indices to heights
      const heightArray = Object.entries(data).map(([index, height]) => [
        parseInt(index, 10),
        height,
      ]);

      // Sort items by height
      heightArray.sort((a, b) => a[1] - b[1]);

      // Get the sorted indices
      const newOrder = heightArray.map(([index]) => index);

      // Find the new first item's symbol
      const newFirstSymbol = favoriteCurrencies[newOrder[0]].symbol;

      // Set the new first item
      setBaseCurrency(newFirstSymbol);

      // Recalculate conversions with the current amount
      handleConversion(amountToConvert);
    },
    [favoriteCurrencies, amountToConvert]
  );

  // Shared value for tracking the currently active index (the item that is being dragged)
  // This is used to update the border radius of the active item
  const currentActiveIndex = useSharedValue<number | null>(null);

  return (
    <>
      {isLoading && (
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#F7D786",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <Text
            style={{
              marginBottom: 15,
            }}
          >
            Tes devises arrivent...
          </Text>
          <ActivityIndicator size={"large"} color={"#89E3A3"} />
        </View>
      )}
      <View style={[styles.container, { paddingBottom: insets?.bottom ?? 20 }]}>
        <View style={[styles.topWrapper, { paddingTop: insets?.top ?? 20 }]}>
          {showDownloadButton && (
            <View style={styles.header}>
              <View style={styles.headerIcons}>
                <View style={styles.updateWrapper}>
                  <Text style={styles.updateText}>
                    ✨ Mise à jour disponible
                  </Text>
                  <Pressable
                    onPress={updateAsync}
                    style={styles.updateButtonWrapper}
                  >
                    <Text style={styles.updateButtonText}>Rafraîchir</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View
            style={[
              styles.bodyWrapper,
              {
                marginTop: !showDownloadButton ? insets.top : 0,
              },
            ]}
          >
            <Text style={styles.bodyText}>Tes devises favorites</Text>

            <CurrencySortableList
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
                      width: "100%",
                      alignSelf: "center",
                    },
                  ]}
                />
              }
              data={favoriteCurrencies}
              listItemHeight={ITEM_HEIGHT}
              renderItem={({ item, index, position }) => {
                const value = convertedCurrencies[item.symbol];
                return (
                  <ListItem
                    key={`${item.symbol}-${index}`}
                    item={item}
                    style={{
                      height: HEIGHT,
                      marginVertical: PADDING,
                      backgroundColor: item.color,
                      width: "100%",
                      alignSelf: "center",
                    }}
                    value={
                      position <= 0
                        ? formatCurrency(
                            amountInputRaw === "" ? "0" : amountInputRaw
                          )
                        : typeof value !== "number"
                        ? "Chargement..."
                        : formatCurrency(value.toString(), true)
                    }
                    maxBorderRadius={MAX_BORDER_RADIUS}
                    index={position <= 0 ? 1 : position === 87 ? 2 : 3}
                    activeIndex={currentActiveIndex}
                    onPress={() => {}}
                    onBottomArrowPress={() => console.log("onBottomArrowPress")}
                  />
                );
              }}
            />
          </View>

          <View
            style={[
              styles.exchangeAmount,
              {
                marginTop: !showDownloadButton ? (width < 390 ? 10 : 25) : 10,
              },
            ]}
          >
            <Text style={styles.exchangeText}>Montant à convertir</Text>
            <Animated.Text
              style={[styles.exchangeAmountText, rStyle, rErrorTextStyle]}
            >
              {formatCurrency(amountInputRaw === "" ? "0" : amountInputRaw)}
            </Animated.Text>
          </View>
        </View>

        <View style={[styles.bottom, { marginBottom: insets.bottom }]}>
          <NumPad shake={shake} onInputChange={handleInputChange} />
        </View>

        {/* <CurrenciesSheet
          color={handleIndicatorStyle}
          ref={currenciesSheetRef}
        /> */}

        <StatusBar style={"dark"} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },
  gestureHandler: {
    flex: 1,
  },
  topWrapper: {
    height: "64%",
    backgroundColor: "#F7ECC9",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  header: {
    height: 65,
    marginTop: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  themeIconContainer: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#22223b",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  exchangeAmount: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10,
  },
  exchangeText: {
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.4,
  },
  exchangeAmountText: {
    fontSize: 34,
    color: "#0d1321",
  },
  exchangeArrows: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#0d1321",
    marginBottom: 30,
  },
  bodyWrapper: {},
  bodyText: {
    fontSize: 18,
    marginBottom: 10,
  },
  body: {
    //flexWrap: "wrap",
    //rowGap: 10,
    marginBottom: 0,
  },
  bottom: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  placeholder: {
    width: "100%",
    height: 75,
    backgroundColor: "#0d1321",
    borderRadius: 20,
    marginBottom: 10,
  },
  backgroundItem: {
    backgroundColor: "rgba(0,0,0,0.1)",
    flex: 1,
    borderRadius: MAX_BORDER_RADIUS,
    margin: PADDING,
  },

  //updateWrapper
  updateWrapper: {
    flexDirection: "row",
    backgroundColor: "#89e3a34d",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 5,
    paddingVertical: 5,
    borderRadius: 50,
    borderCurve: "circular",
    gap: 5,
    width: "100%",
  },
  updateText: {
    fontSize: 12,
    color: "black",
  },
  updateButtonWrapper: {
    backgroundColor: "#89E3A3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    borderCurve: "circular",
  },
  updateButtonText: {
    fontSize: 12,
    color: "black",
  },
});

import { useState, useRef, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

//hooks
import { useAnimatedShake } from "@/hooks/useAnimatedShake";
import useCurrenciesStore from "@/store/useCurrencies";

// components & icons
import NumPad from "@/components/num-pad";
import { DarkTheme, Settings } from "@/assets/icons/icons";
import CurrencyCard from "@/components/currency-card";
import CurrenciesSheet from "@/components/currencies-sheet";
import CurrencySheet from "@/components/currency-sheet";

export default function HomeScreen() {
  // state
  const [inputValue, setInputValue] = useState<number>(0);
  const currenciesSheetRef = useRef<BottomSheetModal>(null);
  const currencySheetRef = useRef<BottomSheetModal>(null);
  const [handleIndicatorStyle, setHandleIndicatorStyle] = useState("#fff");

  // hooks
  const insets = useSafeAreaInsets();
  const { shake, rStyle, isShaking } = useAnimatedShake();

  // animated styles
  const rErrorTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isShaking.value ? "#eb7b81" : "#0d1321", {
        duration: 50,
      }),
    };
  }, []);

  // callbacks
  const handlePresentCurrenciesSheet = useCallback(
    ({ color }: { color: string }) => {
      currenciesSheetRef.current?.present();
      setHandleIndicatorStyle(color);
    },
    []
  );

  const handlePresentCurrencySheet = useCallback(
    ({ color }: { color: string }) => {
      currencySheetRef.current?.present();
      setHandleIndicatorStyle(color);
    },
    []
  );

  const handleInputChange = (value: string): void => {
    console.log("User input:", value);
    setInputValue(Number(value));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.topWrapper, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View></View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.themeIconContainer}
            >
              <DarkTheme />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.themeIconContainer}
            >
              <Settings />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bodyWrapper}>
          <Text style={styles.bodyText}>Vos devises favorites</Text>
          <View style={styles.body}>
            <CurrencyCard
              color={"#89E3A3"}
              currencyName="EUR"
              currencyValue="195"
              currencyNumber={1}
              onPress={() => handlePresentCurrencySheet({ color: "#89E3A3" })}
              onBottomArrowPress={() =>
                handlePresentCurrenciesSheet({ color: "#89E3A3" })
              }
            />
            <CurrencyCard
              color={"#F7D786"}
              currencyName="XOF"
              currencyValue="197,000"
              currencyNumber={2}
              onPress={() => handlePresentCurrencySheet({ color: "#F7D786" })}
              onBottomArrowPress={() =>
                handlePresentCurrenciesSheet({ color: "#F7D786" })
              }
              isLong
            />
            <CurrencyCard
              color={"#ACBBEF"}
              currencyName="USD"
              currencyValue="196"
              currencyNumber={3}
              onPress={() => handlePresentCurrencySheet({ color: "#ACBBEF" })}
              onBottomArrowPress={() =>
                handlePresentCurrenciesSheet({ color: "#ACBBEF" })
              }
            />
          </View>
        </View>

        <View style={styles.exchangeAmount}>
          <Text style={styles.exchangeText}>Montant à convertir</Text>
          <Animated.Text
            style={[styles.exchangeAmountText, rStyle, rErrorTextStyle]}
          >
            {formatCurrency(inputValue)}
          </Animated.Text>
        </View>
      </View>

      <View style={[styles.bottom, { marginBottom: insets.bottom }]}>
        <NumPad shake={shake} onInputChange={handleInputChange} />
      </View>

      <CurrenciesSheet color={handleIndicatorStyle} ref={currenciesSheetRef} />
      <CurrencySheet color={handleIndicatorStyle} ref={currencySheetRef} />

      <StatusBar style={"dark"} />
    </View>
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
    gap: 10,
  },
  exchangeAmount: {
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 15,
  },
  body: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 10,
    marginBottom: 30,
  },
  bottom: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

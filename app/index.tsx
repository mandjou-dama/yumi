import { useState, useRef, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";

//hooks
import { useAnimatedShake } from "@/hooks/useAnimatedShake";

// components & icons
import NumPad from "@/components/num-pad";
import { DarkTheme, Settings } from "@/assets/icons/icons";
import CurrencyCard from "@/components/currency-card";
import CurrenciesSheet from "@/components/currencies-sheet";
import CurrencySheet from "@/components/currency-sheet";
import Draggable from "@/components/draggable";

const currenciesData = [
  {
    id: "XAF",
    name: "CFA Franc BEAC",
    code: "XAF",
  },
  {
    id: "XOF",
    name: "CFA Franc BCEAO",
    code: "XOF",
  },
  {
    id: "EUR",
    name: "Euro",
    code: "EUR",
  },
];

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
    <View style={[styles.container, { paddingBottom: insets?.bottom ?? 20 }]}>
      <View style={[styles.topWrapper, { paddingTop: insets?.top ?? 20 }]}>
        <View style={styles.header}>
          <View></View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.themeIconContainer}
            >
              <Link href={"/setting"}>
                <Settings />
              </Link>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bodyWrapper}>
          <Text style={styles.bodyText}>Vos devises favorites</Text>

          <CurrencyCard
            color={"#89E3A3"}
            currencyName="EUR"
            currencyValue="197"
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
    gap: 10,
  },
  exchangeAmount: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
    //flexWrap: "wrap",
    //rowGap: 10,
    marginBottom: 30,
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
});

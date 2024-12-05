import { StatusBar } from "expo-status-bar";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAnimatedShake } from "@/hooks/useAnimatedShake";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

//import components & icons
import NumPad from "@/components/NumPad";
import { DarkTheme, Exchange, History, Settings } from "@/assets/icons/icons";
import CurrencyCard from "@/components/CurrencyCard";
import CurrenciesSheet from "@/components/CurrenciesSheet";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState<number>(0);
  const sheetRef = useRef<BottomSheetModal>(null);
  const [handleIndicatorStyle, setHandleIndicatorStyle] = useState("#fff");

  const { shake, rStyle, isShaking } = useAnimatedShake();

  const rErrorTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(isShaking.value ? "#eb7b81" : "#0d1321", {
        duration: 50,
      }),
    };
  }, []);

  // callbacks for bottom sheets
  const handlePresentModalPress = useCallback(
    ({ color }: { color: string }) => {
      sheetRef.current?.present();
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
              currencyValue="200"
              onBottomArrowPress={() =>
                handlePresentModalPress({ color: "#89E3A3" })
              }
            />
            <CurrencyCard
              color={"#F7D786"}
              currencyName="XOF"
              currencyValue="197,000"
              onBottomArrowPress={() =>
                handlePresentModalPress({ color: "#F7D786" })
              }
              isLong
            />
            <CurrencyCard
              color={"#ACBBEF"}
              currencyName="USD"
              currencyValue="196"
              onBottomArrowPress={() =>
                handlePresentModalPress({ color: "#ACBBEF" })
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

      <CurrenciesSheet color={handleIndicatorStyle} ref={sheetRef} />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
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

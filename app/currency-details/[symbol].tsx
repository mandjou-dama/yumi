import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useWindowDimensions } from "react-native";

import { useCurrencyStore } from "@/store/useCurrencyStore";
import Chart from "@/components/chart";
import { SegmentedControl } from "@/components/segmented-control";

export default function CurrencyDetails() {
  const { symbol, color, name } = useLocalSearchParams();
  const { height } = useWindowDimensions();

  // store
  const { favoriteCurrencies: items } = useCurrencyStore();

  // filter items by creating a new array without the selected item
  const filteredItems = items.filter((item) => item.symbol !== symbol);

  const [activeCurrency, setActiveCurrency] = useState(filteredItems[0].symbol);

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.currencyInfosWrapper}>
          <View
            style={[
              styles.currencySymbolWrapper,
              { backgroundColor: color.toString() },
            ]}
          >
            <Text style={styles.currencySymbol}>{symbol}</Text>
          </View>
          <Text style={styles.currencyName}>{name}</Text>
        </View>

        <SegmentedControl
          options={filteredItems.map((item) => item.symbol)}
          selectedOption={activeCurrency}
          onOptionPress={setActiveCurrency}
          color={color.toString()}
        />
      </View>

      {/* Chart */}
      <View style={styles.currencyChartWrapper}>
        <Chart
          color={color.toString()}
          activeCurrency={activeCurrency}
          currentCurrency={symbol.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 25,
    backgroundColor: "#F7ECC9",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
  },
  backgroundStyle: {},
  header: {
    paddingTop: 10,
    marginBottom: 20,
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
    backgroundColor: "#F7ECC9",
    justifyContent: "center",
    marginTop: 15,
    width: "100%",
    height: "100%",
    overflowX: "hidden",
    //paddingHorizontal: 20,
  },
});

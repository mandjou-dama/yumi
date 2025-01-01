import React, { useCallback } from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { currencies } from "@/data/currencies";
import { Colors } from "@/data/colors";
import SelectCurrency from "@/components/select-currency-item";

type Props = {};
const data: any = [];

const ChangeCurrency = (props: Props) => {
  const { symbol, color, name } = useLocalSearchParams();

  const filterColors = Colors.filter((el) => el !== color);
  const findCurrent = currencies.find((el) => el.name === name);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headline}>Changer de monnaie</Text>
      <View style={styles.actualCurrencyWrapper}>
        <Text style={styles.actualCurrencyHeadline}>Monnaie actuelle</Text>
        <View style={styles.actualCurrency}>
          <View style={styles.actualCurrencyLeft}>
            <View
              style={[
                styles.actualCurrencySymbol,
                { backgroundColor: color.toString() },
              ]}
            >
              <Text style={styles.actualCurrencySymbolText}>{symbol}</Text>
            </View>
            <Text style={styles.actualCurrencyName}>{name}</Text>
          </View>

          <Pressable style={[styles.actualCurrencyRight]}>
            <View
              style={[
                styles.actualCurrencyColorBorder,
                { borderColor: color.toString(), borderWidth: 1.5 },
              ]}
            >
              <View
                style={[
                  styles.actualCurrencyColor,
                  { backgroundColor: color.toString() },
                ]}
              ></View>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={styles.header}></View>

      <FlatList
        contentContainerStyle={{ flex: 1 }}
        data={currencies}
        renderItem={({ item }) => (
          <SelectCurrency name={item.name} symbol={item.symbol} />
        )}
        keyboardDismissMode="on-drag"
      />
    </View>
  );
};

export default ChangeCurrency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 25,
    backgroundColor: "#F7ECC9",
  },
  headline: {
    color: "#0d1321",
    fontSize: 16,
    opacity: 0.4,
    marginTop: 10,
    alignSelf: "center",
  },
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

  actualCurrencyWrapper: {
    marginTop: 15,
  },
  actualCurrencyHeadline: {
    color: "#0d1321",
    fontSize: 16,
    opacity: 0.4,
  },
  actualCurrency: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actualCurrencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actualCurrencySymbol: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  actualCurrencySymbolText: {
    fontSize: 12,
  },
  actualCurrencyName: {},
  actualCurrencyRight: {},
  actualCurrencyColorBorder: {
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  actualCurrencyColor: {
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
    borderRadius: 100,
  },
});

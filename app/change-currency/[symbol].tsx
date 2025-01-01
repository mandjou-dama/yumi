import React, { useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { currencies } from "@/data/currencies";
import { Colors } from "@/data/colors";
import SelectCurrency from "@/components/select-currency-item";
import { Search, Settings } from "@/assets/icons/icons";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {};

const ChangeCurrency = (props: Props) => {
  const { symbol, color, name } = useLocalSearchParams();

  const filterColors = Colors.filter((el) => el !== color);
  const filterCurrent = currencies.filter((el) => el.name !== name);

  console.log(JSON.stringify(filterCurrent, null, 2));

  const [input, setInput] = useState("");
  const [data, setData] = useState(filterCurrent);
  const [colors, setColors] = useState(filterColors);
  const [isCurrent, setIsCurrent] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleFilter = (text: string) => {
    const filteredData = filterCurrent.filter(
      (currency) =>
        currency.name.toLowerCase().includes(text.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(text.toLowerCase())
    );
    setData(filteredData);
  };

  useEffect(() => {
    handleFilter(input);
  }, [input]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headline}>Changer de monnaie</Text>

      <Animated.FlatList
        ListHeaderComponent={
          <View style={styles.actualCurrencyWrapper}>
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
            <View
              style={{
                width: "100%",
                borderBottomColor: color.toString(),
                borderBottomWidth: 0.2,
                marginTop: 10,
              }}
            />

            <View
              style={{
                marginTop: 25,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                value={input}
                onChangeText={(value) => setInput(value)}
                style={{ fontSize: 16, flexGrow: 1 }}
                placeholder="Rechercher une monnaie..."
              />
              <Search />
            </View>
          </View>
        }
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <SelectCurrency name={item.name} symbol={item.symbol} />
        )}
        keyboardDismissMode="on-drag"
        itemLayoutAnimation={LinearTransition}
      />

      {isCurrent ? (
        <View>
          <Text>Cette monnaie est déjà sélectionnée </Text>
        </View>
      ) : null}
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
    marginBottom: 10,
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
    marginBottom: 15,
  },
  actualCurrencyHeadline: {
    color: "#0d1321",
    fontSize: 16,
    opacity: 0.4,
    marginTop: 25,
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

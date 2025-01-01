import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

type Props = {};
const data: any = [];

const ChangeCurrency = (props: Props) => {
  const { symbol, color, name } = useLocalSearchParams();

  return (
    <View style={styles.container}>
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
      </View>

      {/* <FlatList data={data} keyboardDismissMode="on-drag" /> */}
    </View>
  );
};

export default ChangeCurrency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 25,
    backgroundColor: "#F7ECC9",
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
});

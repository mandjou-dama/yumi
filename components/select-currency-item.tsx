import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";

type Props = {
  name: string;
  symbol: string;
  onPress: () => void;
};

const SelectCurrency = ({ name, symbol, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.symbol}>{symbol}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SelectCurrency;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff46",
    marginBottom: 10,
    borderRadius: 15,
    gap: 10,
  },
  name: {
    fontWeight: 600,
  },
  symbol: {},
});

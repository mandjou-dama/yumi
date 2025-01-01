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
};

const SelectCurrency = ({ name, symbol }: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View style={styles.container}>
        <Text>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SelectCurrency;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#ffffff46",
    marginBottom: 5,
    borderRadius: 15,
  },
});

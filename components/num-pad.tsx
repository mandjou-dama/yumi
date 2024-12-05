import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

// Icons
import { Delete } from "@/assets/icons/icons";

interface NumPadProps {
  onInputChange?: (value: string) => void;
  shake: () => void;
}

interface KeyProps {
  value: string;
  onPress: (value: string) => void;
  onLongPress?: (value: string) => void;
  renderCustom?: () => React.ReactNode;
}

const NumPad: React.FC<NumPadProps> = ({ onInputChange, shake }) => {
  const [input, setInput] = useState<string>("");

  const handlePress = useCallback(
    (value: string): void => {
      if (value === "delete") {
        const updatedInput = input.slice(0, -1);
        setInput(updatedInput);
        onInputChange && onInputChange(updatedInput);
      } else if (input.length >= 13) {
        shake();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      } else {
        const updatedInput = input + value;
        setInput(updatedInput);
        onInputChange && onInputChange(updatedInput);
        Haptics.selectionAsync();
      }
    },
    [input, onInputChange] // Dependencies
  );

  const handleLongPress = () => {
    const updatedInput = "0";
    setInput(updatedInput);
    onInputChange && onInputChange(updatedInput);

    // Trigger haptic feedback if the input is cleared to "0"
    if (updatedInput === "0") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {["1", "2", "3"].map((num) => (
          <Key key={num} value={num} onPress={handlePress} />
        ))}
      </View>
      <View style={styles.row}>
        {["4", "5", "6"].map((num) => (
          <Key key={num} value={num} onPress={handlePress} />
        ))}
      </View>
      <View style={styles.row}>
        {["7", "8", "9"].map((num) => (
          <Key key={num} value={num} onPress={handlePress} />
        ))}
      </View>
      <View style={styles.row}>
        <Key value="." onPress={handlePress} />
        <Key value="0" onPress={handlePress} />
        <Key
          value="delete"
          onPress={handlePress}
          onLongPress={handleLongPress}
          renderCustom={() => <Delete />}
        />
      </View>
    </View>
  );
};

const Key: React.FC<KeyProps> = ({
  value,
  onPress,
  onLongPress,
  renderCustom,
}) => (
  <TouchableOpacity
    style={styles.key}
    onPress={() => onPress(value)}
    onLongPress={() => {
      onLongPress ? onLongPress(value) : null;
    }}
  >
    {renderCustom ? (
      renderCustom()
    ) : (
      <Text style={styles.keyText}>{value}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  display: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: "right",
    borderBottomWidth: 1,
    paddingBottom: 10,
    color: "#F7ECC9",
    borderColor: "#F7ECC9",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  key: {
    backgroundColor: "#0C0C0C",
    width: 110,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  keyText: {
    fontSize: 24,
    color: "#F7ECC9",
  },
});

export default NumPad;

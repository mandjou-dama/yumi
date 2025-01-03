import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";

type Props = {};

const Onboarding = (props: Props) => {
  // hooks
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View>
        <Text>Onboarding</Text>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

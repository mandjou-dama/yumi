import React from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

const Onboarding = (props: Props) => {
  // hooks
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: -80,
          right: 0,
          width: 600,
          height: 600,
        }}
      >
        <Image
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          source={require("@/assets/images/lines.png")}
        />
      </View>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: 22,
          justifyContent: "space-between",
        }}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>Yumi</Text>
        </View>

        <View style={styles.infoWrapper}>
          <View style={styles.textsWrapper}>
            <Text style={styles.headline}>
              Convertissez en Toute simplicité !
            </Text>
            <Text style={styles.subline}>
              Découvrez un convertisseur rapide, précis et un brin amusant pour
              toutes vos conversions monétaires. Partez à la conquête des
              devises avec style !
            </Text>
          </View>

          <TouchableWithoutFeedback>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Commencer la conversion</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  logo: {
    alignSelf: "center",
    marginTop: 20,
  },
  logoText: {
    fontSize: 22,

    fontWeight: 600,
    color: "#0C0C0C",
  },
  infoWrapper: {
    gap: 30,
    marginBottom: 20,
  },
  textsWrapper: {
    gap: 12,
  },
  headline: {
    position: "relative",
    fontSize: 38,
    lineHeight: 46,
    fontWeight: 600,
    color: "#0C0C0C",
  },
  headlineHighlight: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: 600,
    color: "#0C0C0C",
  },
  subline: {
    fontSize: 16,
    lineHeight: 22,
    color: "#0C0C0C",
  },
  button: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0C0C0C",
  },
  buttonText: {
    fontSize: 16,
    color: "#F7ECC9",
  },
});

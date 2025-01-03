import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Data = [1, 2, 3];

type Props = {};

const ChooseCurrencies = (props: Props) => {
  // hooks
  const insets = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const scale2 = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 500 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 500 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleOnChoose = () => {};

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: -200,
          left: -80,
          right: 0,
          width: 600,
          height: 600,
          zIndex: -1,
        }}
      >
        <Image
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transform: [{ rotateZ: "100deg" }],
          }}
          source={require("@/assets/images/lines.png")}
        />
      </View>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          justifyContent: "flex-end",
        }}
      >
        <View style={styles.textInfosWrapper}>
          <Text style={styles.headline}>Choisis tes monnaies !</Text>
          <Text style={styles.subline}>
            Avant de commencer, choisis tes monnaies principales ! Tu pourra les
            changer après si tu veux.
          </Text>
        </View>

        <View style={styles.selectElementWrapper}>
          {Data.map((el, index) => {
            return (
              <TouchableWithoutFeedback
                key={el}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.navigate({
                    pathname: "/(onboarding)/choose-favorite/[index]",
                    params: { index },
                  });
                }}
              >
                <Animated.View style={[styles.selectElementContainer]}>
                  <View style={styles.selectElementLeft}>
                    <Text style={styles.selectElementText}>{el}</Text>
                  </View>
                  <View>
                    <Text>
                      {index === 0
                        ? "Choisis ta première monnaie"
                        : index === 1
                        ? "Choisis ta deuxième monnaie"
                        : "Choisis ta troisième monnaie"}
                    </Text>
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          //onPress={() => router.navigate("/(onboarding)/choose-favorites")}
        >
          <Animated.View style={[styles.button, animatedStyle]}>
            <Text style={styles.buttonText}>Commencer la conversion</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default ChooseCurrencies;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    position: "relative",
  },
  textInfosWrapper: {
    gap: 4,
  },
  headline: {
    position: "relative",
    fontSize: 26,
    lineHeight: 46,
    fontWeight: 600,
    color: "#0C0C0C",
  },
  subline: {
    fontSize: 16,
    lineHeight: 22,
    color: "#0C0C0C",
  },
  selectElementWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0ebd861",
    gap: 20,
    marginTop: 30,
    marginBottom: 30,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  selectElementContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "#f7d7863d",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  selectElementLeft: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#F7D786",
    borderRadius: 10,
  },
  selectElementText: {
    alignSelf: "center",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#89E3A3",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#0C0C0C",
  },
});

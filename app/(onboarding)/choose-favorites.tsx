import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useNetworkState } from "expo-network";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useOnboarding } from "@/store/onboarding";

type Props = {};

const ChooseCurrencies = (props: Props) => {
  //states
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  // hooks
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const { setShowOnboarding, setIsLoading } = useOnboarding();
  const networkState = useNetworkState();

  const {
    favoriteCurrencies,
    clearFavoriteCurrencies,
    fetchExchangeRates,
    fetchTimeSeries,
    setBaseCurrency,
  } = useCurrencyStore();

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

  const getCurrencyLabel = (index: number, name: string) => {
    if (name === "") {
      if (index === 0) return "Choisis ta première monnaie";
      if (index === 1) return "Choisis ta deuxième monnaie";
      if (index === 2) return "Choisis ta troisième monnaie";
    }
    return name;
  };

  const checkIfAllSelected = () => {
    let allSelected = true;
    favoriteCurrencies.forEach((el) => {
      if (el.name === "") {
        allSelected = false;
      }
    });
    setIsAllSelected(allSelected);
  };

  useEffect(() => {
    checkIfAllSelected();

    return () => {
      // cleanup
    };
  }, [favoriteCurrencies]);

  useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      setIsOnline(false);
    } else if (
      networkState.isConnected &&
      networkState.isInternetReachable === true
    ) {
      setIsOnline(true);
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  const handleOnChoose = () => {
    const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - sevenDaysInMilliseconds)
      .toISOString()
      .split("T")[0];

    if (isOnline === false) {
      Alert.alert(
        "🔌 Ouups tu es hors ligne",
        "A ce point tu as besoin d'une connexion internet pour commencer. Réessaye plus tard."
      );
      return;
    }

    setBaseCurrency(favoriteCurrencies[0].symbol);
    fetchExchangeRates();
    fetchTimeSeries(startDate, endDate);
    setIsLoading(true);
    setShowOnboarding(false);
    router.replace("/(index)");
  };

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
          {favoriteCurrencies.map((el, index) => {
            const label = getCurrencyLabel(index, el.name);
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.navigate({
                    pathname: "/(onboarding)/choose-favorite/[index]",
                    params: { index },
                  });
                }}
              >
                <Animated.View
                  style={[
                    styles.selectElementContainer,
                    {
                      backgroundColor: el.color !== "" ? el.color : "#f7d7863d",
                    },
                  ]}
                >
                  <View style={[styles.selectElementLeft]}>
                    <Text style={styles.selectElementText}>{index + 1}</Text>
                  </View>
                  <View>
                    <Text>{label}</Text>
                    {el.symbol !== "" && <Text>{el.symbol}</Text>}
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>

        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleOnChoose}
          disabled={!isAllSelected}
          //onPress={() => router.navigate("/(onboarding)/choose-favorites")}
        >
          <Animated.View
            style={[
              styles.button,
              animatedStyle,
              { opacity: isAllSelected ? 1 : 0.5 },
            ]}
          >
            <Text style={styles.buttonText}>Commence la conversion</Text>
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
    backgroundColor: "rgba(255,255,255,0.2)",
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

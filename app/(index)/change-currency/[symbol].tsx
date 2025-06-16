import React, { useCallback, useState, useEffect, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";

import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { currencies } from "@/data/currencies";
import { Colors } from "@/data/colors";
import SelectCurrency from "@/components/select-currency-item";
import { Search } from "@/assets/icons/icons";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
} from "react-native-reanimated";

type Props = {};

const ScrollToTop = ({ onPress }: { onPress: () => void }) => (
  <Animated.View exiting={FadeOut} entering={FadeIn} style={styles.scrollToTop}>
    <BlurView
      intensity={30}
      tint="dark"
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onPress}
      >
        <Text style={styles.scrollToTopText}>↑</Text>
      </Pressable>
    </BlurView>
  </Animated.View>
);

const ChangeCurrency = (props: Props) => {
  const { symbol, color, name, index } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);
  const scale = useSharedValue(1);

  const router = useRouter();

  const filterColors = Colors.filter((el) => el !== color);
  const filterCurrent = currencies.filter((el) => el.name !== name);

  //console.log(JSON.stringify(filterCurrent, null, 2));

  const [input, setInput] = useState("");
  const [data, setData] = useState(filterCurrent);
  const [colors, setColors] = useState(filterColors);
  const [isCurrent, setIsCurrent] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

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
    //console.log(scrollOffset);
    // if (data.length === 0) {
    //   setNotFound(true);
    // }
  }, [input]);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[0]}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setScrollOffset(offsetY);
        }}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <BlurView intensity={30} tint="light" style={styles.blurContainer}>
          <Text style={styles.headline}>Changer de monnaie</Text>
        </BlurView>

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

            <Pressable
              style={[styles.actualCurrencyRight]}
              onPress={() =>
                router.push({
                  pathname: "/color-picker",
                  params: { actualSymbol: symbol },
                })
              }
            >
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
              autoFocus
              value={input}
              onChangeText={(value) => setInput(value)}
              style={{ fontSize: 16, flexGrow: 1 }}
              placeholder="Rechercher une monnaie..."
              placeholderTextColor={"#00000045"}
            />
            <Search />
          </View>
        </View>

        <FlashList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 70, paddingHorizontal: 15 }}
          data={data}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <SelectCurrency
              name={item.name}
              symbol={item.symbol}
              onPress={() =>
                router.push({
                  pathname: "/color-picker",
                  params: {
                    actualSymbol: symbol,
                    newSymbol: item.symbol,
                    newName: item.name,
                    index: index,
                  },
                })
              }
            />
          )}
          //pagingEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          estimatedItemSize={150}
        />
      </ScrollView>

      {scrollOffset > 200 && <ScrollToTop onPress={scrollToTop} />}
    </View>
  );
};

export default ChangeCurrency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7ECC9",
  },
  flatlist: {
    height: "auto",
    paddingBlockEnd: 70,
  },
  blurContainer: {
    textAlign: "center",
    justifyContent: "center",
    height: "auto",
    width: "100%",
  },
  headline: {
    color: "#0d1321",
    fontSize: 16,
    opacity: 0.4,
    marginBottom: 10,
    alignSelf: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  actualCurrencyWrapper: {
    marginBottom: 15,
    paddingHorizontal: 15,
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
  scrollToTop: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    top: "5.4%",
    right: 20,
    borderRadius: 100,
    zIndex: 10,
    overflow: "hidden",
  },
  scrollToTopText: {},
});

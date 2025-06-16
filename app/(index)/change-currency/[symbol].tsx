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
  const flashListRef = useRef<FlashList<any>>(null);
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
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);
  const renderHeader = () => {
    return (
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        <Text style={styles.headline}>Changer de monnaie</Text>
      </BlurView>
    );
  };

  const renderActual = () => {
    return (
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
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: (typeof currencies)[0] }) => {
      return (
        <View style={{ paddingHorizontal: 20 }}>
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
        </View>
      );
    },
    [index, router]
  );

  const renderEmptyComponent = useCallback(() => {
    if (notFound) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune monnaie trouvée</Text>
        </View>
      );
    }
    return null;
  }, [notFound]);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        ref={flashListRef}
        data={[{ id: "header" }, { id: "search" }, ...data]}
        keyExtractor={(item) => item.id || item.name}
        renderItem={({ item }) => {
          if (item.id === "header") return renderHeader();
          if (item.id === "search") return renderActual();
          return renderItem({ item });
        }}
        estimatedItemSize={70}
        stickyHeaderIndices={[0]}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setScrollOffset(offsetY);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatlist}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        ListEmptyComponent={renderEmptyComponent}
      />

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
    // height: "auto",
    paddingBottom: 70,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#00000045",
  },
});

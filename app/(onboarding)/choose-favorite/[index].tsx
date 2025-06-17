import React, { useCallback, useState, useEffect, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { currencies } from "@/data/currencies";
import SelectCurrency from "@/components/select-currency-item";
import { Search } from "@/assets/icons/icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
  const { index } = useLocalSearchParams();
  const flashListRef = useRef<FlashList<any>>(null);
  const router = useRouter();

  const [input, setInput] = useState("");
  const [data, setData] = useState(currencies);
  const [notFound, setNotFound] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleFilter = useCallback((text: string) => {
    if (text === "") {
      setData(currencies);
      setNotFound(false);
      return;
    }

    const filteredData = currencies.filter(
      (currency) =>
        currency.name.toLowerCase().includes(text.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(text.toLowerCase())
    );

    setData(filteredData);
    setNotFound(filteredData.length === 0);
  }, []);

  useEffect(() => {
    handleFilter(input);
  }, [input, handleFilter]);

  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const renderHeader = () => {
    return (
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        <Text style={styles.headline}>Choisir une monnaie</Text>
      </BlurView>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.actualCurrencyWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            autoFocus
            value={input}
            onChangeText={(value) => setInput(value)}
            style={styles.searchInput}
            placeholder="Rechercher une monnaie..."
            placeholderTextColor={"#00000063"}
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
                  index: index,
                  newSymbol: item.symbol,
                  newName: item.name,
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
          if (item.id === "search") return renderSearchBar();
          return renderItem({ item });
        }}
        estimatedItemSize={70}
        stickyHeaderIndices={[0]}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          setScrollOffset(offsetY);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContentContainer}
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
  listContentContainer: {
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
    paddingTop: 25,
    paddingBottom: 10,
  },
  actualCurrencyWrapper: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  searchContainer: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff63",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    // paddingHorizontal: 20,
  },
  searchInput: {
    fontSize: 16,
    flexGrow: 1,
  },
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
  scrollToTop: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    bottom: "5.4%",
    right: 20,
    borderRadius: 100,
    zIndex: 10,
    overflow: "hidden",
  },
  scrollToTopText: {
    fontSize: 20,
  },
});

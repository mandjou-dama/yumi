import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { LineGraph, GraphPoint } from "react-native-graph";
import * as Haptics from "expo-haptics";

import { useCurrencyStore } from "@/store/useCurrencyStore";

const Chart = ({
  color,
  activeCurrency,
  currentCurrency,
}: {
  color: string;
  activeCurrency: string;
  currentCurrency: string;
}) => {
  const { timeSeries } = useCurrencyStore();
  const activeCurrencyTimeSeries: any = timeSeries[currentCurrency as any];

  const jsonObject = activeCurrencyTimeSeries.reduce((acc: any, item: any) => {
    const [key, value] = Object.entries(item)[0];
    acc[key] = value;
    return acc;
  }, {});

  const graphData: GraphPoint[] = Object.entries(
    jsonObject[activeCurrency]
  ).map(([date, value]) => {
    return {
      date: new Date(date),
      value: value as number,
    };
  });

  //console.log(JSON.stringify(graphData, null, 2));

  const [selectedPoint, setSelectedPoint] = useState<GraphPoint>(
    graphData[graphData.length - 1]
  );

  // Update `selectedPoint` whenever `activeCurrency` changes
  useEffect(() => {
    if (graphData.length > 0) {
      setSelectedPoint(graphData[graphData.length - 1]);
    }
  }, [activeCurrency]);

  const onPointSelected = useCallback((point: GraphPoint) => {
    setSelectedPoint(point);
    Haptics.selectionAsync();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.graphHeader}>
        <View style={styles.graphSymbolWrapper}>
          <Text style={styles.graphSymbol}>{activeCurrency}</Text>
          <Text style={styles.graphAmount}>
            {selectedPoint?.value < 1
              ? selectedPoint?.value.toFixed(4)
              : selectedPoint?.value.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.graphDate}>
          {selectedPoint?.date.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      <View style={{ marginTop: 35, backgroundColor: "red" }}>
        <LineGraph
          style={[styles.graph, StyleSheet.absoluteFill]}
          points={graphData}
          animated={true}
          color={color || "#F7ECC9"}
          enablePanGesture={true}
          onPointSelected={onPointSelected}
          enableFadeInMask={true}
          enableIndicator={true}
          indicatorPulsating
          verticalPadding={25}
          horizontalPadding={25}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  graphHeader: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    overflow: "visible",
    height: 50,
    width: "100%",
  },
  graph: {
    width: "100%",
    height: 290,
    overflow: "visible",
  },
  graphSymbolWrapper: {
    flexDirection: "row",
    marginBottom: 5,
    gap: 5,
  },
  graphAmount: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  graphSymbol: {
    opacity: 0.4,
    fontSize: 16,
    textAlign: "center",
  },
  graphDate: {
    textTransform: "capitalize",
    width: "100%",
    textAlign: "center",
  },
  graphTimelineWrapper: {
    width: "100%",
    height: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 90,
  },
  graphTimelineItem: {
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  graphTimelineItemActive: {
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d1321",
  },
});

export default Chart;

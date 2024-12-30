import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { LineGraph, GraphPoint } from "react-native-graph";
import * as Haptics from "expo-haptics";

import timeseries from "../data/timeseries.json";

const Chart = ({
  color,
  symbol,
  data,
  activeCurrency,
  isLoading,
}: {
  color: string;
  symbol: string;
  data: any;
  activeCurrency: string;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const graphData: GraphPoint[] = Object.entries(
    data.results[activeCurrency]
  ).map(([date, value]) => {
    return {
      date: new Date(date),
      value: value,
    };
  });

  const [activeTimeline, setActiveTimeline] = useState<{ range: string }>({
    range: "1D",
  });

  const [selectedPoint, setSelectedPoint] = useState<GraphPoint>(
    graphData[graphData.length - 1]
  );

  const onPointSelected = useCallback((point: GraphPoint) => {
    setSelectedPoint(point);
    Haptics.selectionAsync();
  }, []);

  const graphTimelineData = [
    {
      range: "1D",
    },
    {
      range: "1W",
    },
    {
      range: "1M",
    },
    {
      range: "3M",
    },
    {
      range: "1Y",
    },
  ];

  const handleSelectTimeline = (range: { range: string }) => {
    setActiveTimeline(range);
  };

  return (
    <View style={styles.container}>
      <View style={styles.graphHeader}>
        <View style={styles.graphSymbolWrapper}>
          <Text style={styles.graphSymbol}>{symbol}</Text>
          <Text style={styles.graphAmount}>
            {selectedPoint?.value.toFixed(2)}
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

      <View style={{ marginTop: 35 }}>
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

      <View style={styles.graphTimelineWrapper}>
        {graphTimelineData.map((item, index) => (
          <TouchableWithoutFeedback
            onPress={() => handleSelectTimeline(item)}
            key={index}
          >
            <View
              style={
                activeTimeline.range === item.range
                  ? [styles.graphTimelineItemActive]
                  : styles.graphTimelineItem
              }
            >
              <Text
                style={
                  activeTimeline.range === item.range
                    ? {
                        textAlign: "center",
                        fontSize: 10,
                        color: color,
                        fontWeight: "bold",
                      }
                    : { textAlign: "center", fontSize: 10 }
                }
              >
                {item.range}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
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
    height: 280,
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

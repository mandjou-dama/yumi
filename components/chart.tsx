import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineGraph, GraphPoint } from "react-native-graph";
import timeseries from "../data/timeseries.json";
import * as Haptics from "expo-haptics";

const Chart = ({ color }: { color: string | undefined }) => {
  const graphData: GraphPoint[] = Object.entries(timeseries.results["XAF"]).map(
    ([date, value]) => {
      return {
        date: new Date(date),
        value: value,
      };
    }
  );

  const [selectedPoint, setSelectedPoint] = useState<GraphPoint>(
    graphData[graphData.length - 1]
  );

  const onPointSelected = (point: GraphPoint) => {
    setSelectedPoint(point);
  };

  const hapticFeedback = () => {
    Haptics.selectionAsync();
  };

  return (
    <View>
      <View style={styles.graphHeader}>
        <Text style={styles.graphAmount}>
          ${selectedPoint?.value.toFixed(2)}
        </Text>
        <Text style={styles.graphDate}>
          {selectedPoint?.date.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      <View style={{ alignItems: "center", marginTop: 15 }}>
        <LineGraph
          style={[styles.graph, StyleSheet.absoluteFill]}
          points={graphData}
          animated={true}
          color={color || "#F7ECC9"}
          enablePanGesture={true}
          onPointSelected={onPointSelected}
          onGestureStart={hapticFeedback}
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
  graphHeader: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    overflow: "visible",
    height: 70,
    width: "100%",
  },
  graph: {
    width: "100%",
    height: 280,
    overflow: "visible",
  },
  graphAmount: {
    fontSize: 24,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    marginBottom: 3,
  },
  graphDate: {
    textTransform: "capitalize",
    width: "100%",
    textAlign: "center",
  },
});

export default Chart;

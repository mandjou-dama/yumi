import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ruleTypes, DataSet } from "gifted-charts-core";

const Chart = ({ color }: { color: string | undefined }) => {
  // JSON data (replace this with your actual data source)
  const jsonData = {
    start: "2024-11-22",
    end: "2024-12-05",
    interval: "P1D",
    base: "USD",
    results: {
      XAF: {
        "2024-11-22": 630.44423,
        "2024-11-23": 629.31392,
        "2024-11-24": 629.31392,
        "2024-11-25": 625.18345,
        "2024-11-26": 625.88997,
        "2024-11-27": 620.14411,
        "2024-11-28": 621.44034,
        "2024-11-29": 620.54532,
        "2024-11-30": 619.98006,
        "2024-12-01": 619.98006,
        "2024-12-02": 626.43036,
        "2024-12-03": 623.7665,
        "2024-12-04": 622.76379,
        "2024-12-05": 620.07788,
      },
    },
    ms: 5,
  };

  // Transform the JSON data into chart-compatible format
  const currencyData = jsonData.results.XAF;
  const lineData = Object.keys(currencyData).map((date) => ({
    value: currencyData[date], // Exchange rate (y-axis value)
    label: date.slice(8), // Use MM-DD as x-axis label
  }));

  // Create the dataset
  const dataSet: Array<DataSet> = [
    {
      data: lineData,
      color: color,
      startFillColor: color,
      endFillColor: color,
      stepChart: true,
      lineSegments: [
        { startIndex: 0, endIndex: lineData.length - 1, color: color },
      ],
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      <LineChart
        areaChart={false}
        curved
        dataSet={dataSet}
        height={200}
        showVerticalLines={false}
        spacing={50}
        initialSpacing={0}
        hideDataPoints={false}
        startOpacity={0.8}
        endOpacity={0.3}
        textShiftY={-2}
        textShiftX={-5}
        textFontSize={13}
        showYAxisIndices={false}
        showDataPointLabelOnFocus
        showXAxisIndices={false}
        yAxisColor={"rgba(0, 0, 0, 0)"}
        xAxisColor={"rgba(0, 0, 0, 0)"}
        yAxisLabelWidth={0}
        focusEnabled
        showDataPointOnFocus={false}
        showStripOnFocus={false}
        disableScroll
      />
    </View>
  );
};

export default Chart;

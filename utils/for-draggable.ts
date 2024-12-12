import { Dimensions } from "react-native";

const COL = 1;
export const MARGIN = 10;
const width = Dimensions.get("window").width;
const height = 75;

export const SIZE = {
  width,
  height,
};

export const getPosition = (index: number) => {
  "worklet";
  return {
    x: (index % COL) * SIZE.width,
    y: Math.floor(index / COL) * SIZE.height,
  };
};

export const getOrder = (y: number) => {
  "worklet";
  const row = Math.round(y / SIZE.height);
  return row * COL;
};

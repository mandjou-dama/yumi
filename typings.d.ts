export type Currency = {
  symbol: string;
  name: string;
};

//for currencies card list
type Index = number;
type PositionValue = number;

export type Positions = Record<Index, PositionValue>;

// for currency card item
export type CurrencyCardProps = {
  name: string;
  symbol: string;
  value: string;
  position: number;
  activeValues: boolean[];
  color: string;
  isLong?: boolean;
  onPress: () => void;
  onBottomArrowPress?: () => void;
  onLongPress?: () => void;
};

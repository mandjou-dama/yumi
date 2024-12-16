import { create } from "zustand";
import type { CurrencyCardItem } from "@/components/currency-card-item";

// Initial data
const initialItems: CurrencyCardItem[] = [
  {
    name: "Africa CFA Franc",
    symbol: "XOF",
    value: "190",
    color: "#89E3A3",
  },
  {
    name: "Euro",
    symbol: "EUR",
    value: "190",
    color: "#F7D786",
  },
  {
    name: "US Dollar",
    symbol: "$",
    value: "190",
    color: "#ACBBEF",
  },
];

// Define the Zustand store
type CurrencyStore = {
  items: CurrencyCardItem[];
  setItems: (newItems: CurrencyCardItem[]) => void;
};

export const useCurrenciesStore = create<CurrencyStore>((set) => ({
  items: initialItems,
  setItems: (newItems) => set({ items: newItems }),
}));

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { CurrencyCardItem } from "@/components/currency-card-item";

// MMKV instance
const storage = new MMKV({ id: "currency-storage" });

// Custom StateStorage for MMKV
const zustandCurrencyStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

// Initial data
const initialItems: CurrencyCardItem[] = [
  {
    name: "CFA Franc BCEAO",
    symbol: "XOF",
    value: "0", // Start at 0
    color: "#89E3A3",
  },
  {
    name: "Euro",
    symbol: "EUR",
    value: "0", // Start at 0
    color: "#F7D786",
  },
  {
    name: "United States Dollar",
    symbol: "USD",
    value: "0", // Start at 0
    color: "#ACBBEF",
  },
];

interface Rates {
  [currency: string]: number; // Exchange rate values
}

interface CurrencyStore {
  favoriteCurrencies: CurrencyCardItem[];
  baseCurrency: string;
  baseAmount: number;
  rates: Rates;
  setBaseCurrency: (base: string) => void;
  setBaseAmount: (amount: number) => void;
  setRates: (rates: Rates) => void;
  setFavoriteCurrency: (symbol: string) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      favoriteCurrencies: initialItems,
      baseCurrency: initialItems[0].symbol, // Default to the first item
      baseAmount: 0,
      rates: {},
      setBaseCurrency: (base) => {
        set({ baseCurrency: base });
        const { baseAmount, rates, favoriteCurrencies } = get();
        if (baseAmount > 0 && rates[base]) {
          const baseRate = rates[base];
          const updatedCurrencies = favoriteCurrencies.map((currency) => {
            if (currency.symbol === base) {
              return { ...currency, value: baseAmount.toString() };
            }
            if (rates[currency.symbol]) {
              const convertedValue = (
                (baseAmount / baseRate) *
                rates[currency.symbol]
              ).toFixed(2);
              return { ...currency, value: convertedValue };
            }
            return currency;
          });
          set({ favoriteCurrencies: updatedCurrencies });
        }
      },
      setBaseAmount: (amount) => {
        set({ baseAmount: amount });
        const { baseCurrency, rates, favoriteCurrencies } = get();
        if (rates[baseCurrency]) {
          const baseRate = rates[baseCurrency];
          const updatedCurrencies = favoriteCurrencies.map((currency) => {
            if (currency.symbol === baseCurrency) {
              return { ...currency, value: amount.toString() };
            }
            if (rates[currency.symbol]) {
              const convertedValue = (
                (amount / baseRate) *
                rates[currency.symbol]
              ).toFixed(2);
              return { ...currency, value: convertedValue };
            }
            return currency;
          });
          set({ favoriteCurrencies: updatedCurrencies });
        }
      },
      setRates: (rates) => set({ rates }),
      setFavoriteCurrency: (symbol) => {
        set(() => ({ baseCurrency: symbol }));
      },
    }),
    {
      name: "currency-store-persist", // Key for persistence
      storage: createJSONStorage(() => zustandCurrencyStorage), // Use custom MMKV storage
    }
  )
);

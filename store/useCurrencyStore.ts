import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { CurrencyCardItem } from "@/components/currency-card-item";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchExchangeRates as getExchangeRates } from "@/api/currencies";

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
    color: "#89E3A3",
  },
  {
    name: "Euro",
    symbol: "EUR",
    color: "#F7D786",
  },
  {
    name: "United States Dollar",
    symbol: "USD",
    color: "#ACBBEF",
  },
];

interface CurrencyStore {
  favoriteCurrencies: CurrencyCardItem[];
  //favoriteCurrencyRates: Record<string, Record<string, number>>; // Store rates for favorite currencies
  baseCurrency: string;
  amountToConvert: number;
  convertedCurrencies: Record<string, number>;
  setAmountToConvert: (amount: number) => void;
  setBaseCurrency: (base: string) => void;
  handleConversion: (
    amount: number,
    favoriteCurrencyRates: { base: string; results: Record<string, number> }[]
  ) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      favoriteCurrencies: initialItems,
      //favoriteCurrencyRates: {},
      baseCurrency: initialItems[0].symbol, // Default to the first item
      amountToConvert: 0,
      convertedCurrencies: {},

      setAmountToConvert: (amount) => {
        set({ amountToConvert: amount });
      },

      setBaseCurrency: (currency) => set({ baseCurrency: currency }),

      handleConversion: (
        amount,
        currencyRates: { base: string; results: Record<string, number> }[]
      ) => {
        set((state) => {
          const baseData = currencyRates?.find(
            (rate) => rate?.base === state.baseCurrency
          );
          const rates = baseData?.results || {};

          console.log("RATES :", JSON.stringify(baseData, null, 2));

          // Calculate converted values
          const converted = state.favoriteCurrencies.reduce<
            Record<string, number>
          >((acc, currency) => {
            if (currency.symbol !== state.baseCurrency) {
              acc[currency.symbol] = amount * (rates[currency.symbol] || 0); // Multiply by the rate
            }
            return acc;
          }, {});

          return { convertedCurrencies: converted };
        });
      },
    }),
    {
      name: "currency-store-persist", // Key for persistence
      storage: createJSONStorage(() => zustandCurrencyStorage), // Use custom MMKV storage
    }
  )
);

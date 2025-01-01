import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { CurrencyCardItem } from "@/components/currency-card-item";
import { TimeSeriesType } from "@/typings";

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

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

// Initial data
export const initialItems: CurrencyCardItem[] = [
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
  favoriteCurrencyRates: Record<string, Record<string, number>>; // Store rates for favorite currencies
  baseCurrency: string;
  amountToConvert: number;
  convertedCurrencies: Record<string, number>;
  lastFetchTime: string | null;
  //setLastFetchTime: (time: Date) => void;
  timeSeries: TimeSeriesType[];
  setAmountToConvert: (amount: number) => void;
  setBaseCurrency: (base: string) => void;
  fetchExchangeRates: () => Promise<void>;
  fetchTimeSeries: () => Promise<void>;
  handleConversion: (amount: number) => void;
}

const regroupByBaseCurrency = (data: any[]) => {
  const groupedResults: Record<string, any[]> = {};

  data.forEach((entry) => {
    const base = entry.base;
    if (!groupedResults[base]) {
      groupedResults[base] = [];
    }

    groupedResults[base].push(entry.results);
  });

  return groupedResults;
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      favoriteCurrencies: initialItems,
      favoriteCurrencyRates: {},
      convertedCurrencies: {},
      timeSeries: [],
      baseCurrency: initialItems[0].symbol, // Default to the first item
      amountToConvert: 0,
      lastFetchTime: null,
      setAmountToConvert: (amount) => {
        set({ amountToConvert: amount });
      },
      setBaseCurrency: (currency) => set({ baseCurrency: currency }),
      fetchExchangeRates: async () => {
        const { favoriteCurrencies } = get();
        const allRates: Record<string, Record<string, number>> = {}; // Store rates for all base currencies

        try {
          for (const currency of favoriteCurrencies) {
            let filteredCurrencies = favoriteCurrencies.filter(
              (item) => item.symbol !== currency.symbol
            );

            const response = await fetch(
              `https://api.fastforex.io/fetch-multi?from=${currency.symbol}&to=${filteredCurrencies[0].symbol},${filteredCurrencies[1].symbol}&api_key=${API_KEY}`,
              {
                method: "GET",
                headers: { accept: "application/json" },
              }
            );

            if (!response.ok) {
              console.error(`Failed to fetch rates for ${currency.symbol}`);
              continue;
            }

            const data = await response.json();

            if (data.results) {
              allRates[currency.symbol] = data.results;
            } else {
              console.error("Invalid data:", data);
            }
          }

          // Update the store with all fetched rates
          console.log("Fetching exchange rates...");
          set({ lastFetchTime: Date.now().toString() });
          set({ favoriteCurrencyRates: allRates });
        } catch (error) {
          //console.error("Error fetching exchange rates:", error);
        }
      },
      fetchTimeSeries: async () => {
        const { favoriteCurrencies } = get();
        const fetchPromises = favoriteCurrencies.flatMap((currency) => {
          const filteredCurrencies = favoriteCurrencies.filter(
            (item) => item.symbol !== currency.symbol
          );

          // Create fetch requests for each pair
          return filteredCurrencies.map((filteredCurrency) =>
            fetch(
              `https://api.fastforex.io/time-series?from=${currency.symbol}&to=${filteredCurrency.symbol}&start=2024-12-22&end=2024-12-31&api_key=${API_KEY}`,
              {
                method: "GET",
                headers: { accept: "application/json" },
              }
            ).then((response) => response.json())
          );
        });

        // Await all fetches concurrently
        const responses = await Promise.all(fetchPromises);
        const data: any = regroupByBaseCurrency(responses);

        // Update the store with all fetched rates
        console.log("Fetching time series...");
        set({ lastFetchTime: Date.now().toString() });
        set({ timeSeries: data });
      },
      handleConversion: (amount) => {
        set((state) => {
          const rates = state.favoriteCurrencyRates[state.baseCurrency] || {};

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

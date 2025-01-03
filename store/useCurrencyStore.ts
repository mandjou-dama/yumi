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
    name: "",
    symbol: "",
    color: "",
  },
  {
    name: "",
    symbol: "",
    color: "",
  },
  {
    name: "",
    symbol: "",
    color: "",
  },
];

interface CurrencyStore {
  //favoriteCurrencies: CurrencyCardItem[];
  favoriteCurrencies: CurrencyCardItem[];
  favoriteCurrencyRates: Record<string, Record<string, number>>; // Store rates for favorite currencies
  baseCurrency: string;
  amountToConvert: number;
  convertedCurrencies: Record<string, number>;
  lastFetchTime: string | null;
  timeSeries: TimeSeriesType[];
  setFavoriteCurrencyColor: (symbol: string, color: string) => void;
  addItemToFavoriteCurrencies: (
    actualIndex: string,
    newSymbol: string,
    newName: string,
    newColor: string
  ) => void;
  replaceFavoriteCurrency: (
    actualSymbol: string,
    newSymbol: string,
    newName: string,
    newColor: string
  ) => void;
  clearFavoriteCurrencies: () => void;
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
      timeSeries: [],
      convertedCurrencies: {},
      baseCurrency: initialItems[0].symbol, // Default to the first item
      amountToConvert: 0,
      lastFetchTime: null,
      clearFavoriteCurrencies: () => {
        set({ favoriteCurrencies: initialItems });
      },
      replaceFavoriteCurrency: (actualSymbol, newSymbol, newName, newColor) => {
        set((state) => {
          const favoriteCurrencies = state.favoriteCurrencies.map((item) => {
            if (item.symbol === actualSymbol) {
              return { name: newName, symbol: newSymbol, color: newColor };
            }
            return item;
          });

          return { favoriteCurrencies };
        });
      },
      addItemToFavoriteCurrencies: (
        actualIndex,
        newSymbol,
        newName,
        newColor
      ) => {
        set((state) => {
          const favoriteCurrencies = state.favoriteCurrencies.map(
            (item, index) => {
              console.log("actualIndex", actualIndex, "index", index);
              if (actualIndex === index.toString()) {
                return { name: newName, symbol: newSymbol, color: newColor };
              }
              return item;
            }
          );
          return { favoriteCurrencies };
        });
      },
      setFavoriteCurrencyColor: (symbol, color) => {
        set((state) => {
          const favoriteCurrencies = state.favoriteCurrencies.map((item) => {
            if (item.symbol === symbol) {
              return { ...item, color };
            }
            return item;
          });

          return { favoriteCurrencies };
        });
      },
      setAmountToConvert: (amount) => {
        set({ amountToConvert: amount });
      },
      setBaseCurrency: (currency) => set({ baseCurrency: currency }),
      fetchExchangeRates: async () => {
        const { favoriteCurrencies, handleConversion, amountToConvert } = get();
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
          // Trigger conversion after rates are updated
          handleConversion(amountToConvert);
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

          // Ensure rates are available before performing conversion
          if (Object.keys(rates).length === 0) {
            return { convertedCurrencies: {} };
          }

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

import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { CurrencyCardItem } from "@/components/currency-card-item";
import { TimeSeriesType } from "@/typings";

// MMKV instance
const storage = new MMKV({ id: "currency-storage" });

// Custom StateStorage for MMKV
const zustandCurrencyStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.delete(name);
  },
};

// Initial data
export const initialItems: CurrencyCardItem[] = [
  { name: "", symbol: "", color: "" },
  { name: "", symbol: "", color: "" },
  { name: "", symbol: "", color: "" },
];

interface CurrencyStore {
  favoriteCurrencies: CurrencyCardItem[];
  favoriteCurrencyRates: Record<string, Record<string, number>>;
  baseCurrency: string;
  amountToConvert: number;
  amountInputRaw: string;
  convertedCurrencies: Record<string, number>;
  lastFetchTime: string | null;
  isFetching: boolean;
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
  setAmountInputRaw: (input: string) => void;
  setBaseCurrency: (base: string) => void;
  fetchExchangeRates: () => Promise<void>;
  fetchTimeSeries: (startDate: string, endDate: string) => Promise<void>;
  handleConversion: (amount: number) => void;
  clearStorage: () => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      favoriteCurrencies: initialItems,
      favoriteCurrencyRates: {},
      timeSeries: [],
      convertedCurrencies: {},
      baseCurrency: initialItems[0].symbol,
      amountToConvert: 0,
      amountInputRaw: "",
      lastFetchTime: null,
      isFetching: false,

      clearFavoriteCurrencies: () => {
        set({ favoriteCurrencies: initialItems });
      },

      replaceFavoriteCurrency: (actualSymbol, newSymbol, newName, newColor) => {
        set((state) => {
          const favoriteCurrencies = state.favoriteCurrencies.map((item) =>
            item.symbol === actualSymbol
              ? { name: newName, symbol: newSymbol, color: newColor }
              : item
          );
          return { favoriteCurrencies };
        });
        get().fetchExchangeRates();
      },

      addItemToFavoriteCurrencies: (
        actualIndex,
        newSymbol,
        newName,
        newColor
      ) => {
        set((state) => {
          const favoriteCurrencies = state.favoriteCurrencies.map(
            (item, index) =>
              actualIndex === index.toString()
                ? { name: newName, symbol: newSymbol, color: newColor }
                : item
          );
          return { favoriteCurrencies };
        });
      },

      setFavoriteCurrencyColor: (symbol, color) => {
        set((state) => {
          const favoriteCurrencies = state.favoriteCurrencies.map((item) =>
            item.symbol === symbol ? { ...item, color } : item
          );
          return { favoriteCurrencies };
        });
      },

      setAmountToConvert: (amount) => {
        set({ amountToConvert: amount });
      },

      setAmountInputRaw: (input) => {
        set({ amountInputRaw: input });
      },

      setBaseCurrency: (currency) => {
        set({ baseCurrency: currency });
      },

      fetchExchangeRates: async () => {
        const { favoriteCurrencies, handleConversion, amountToConvert } = get();
        // const allRates: Record<string, Record<string, number>> = {};

        const responses = await Promise.all(
          favoriteCurrencies.map(async (currency) => {
            if (!currency.symbol) return null;
            const currencyLower = currency.symbol.toLowerCase();
            const url = `https://www.floatrates.com/daily/${currencyLower}.json`;

            try {
              const response = await fetch(url);
              const contentType = response.headers.get("content-type");

              if (!contentType?.includes("application/json")) return null;
              if (!response.ok) return null;

              const data = await response.json();

              const otherCurrencies = favoriteCurrencies
                .filter(
                  (item) => item.symbol && item.symbol !== currency.symbol
                )
                .map((item) => item.symbol.toLowerCase());

              const rates: Record<string, number> = {};
              for (const target of otherCurrencies) {
                if (data[target]) {
                  rates[target.toUpperCase()] = data[target].rate;
                }
              }

              return { symbol: currency.symbol, rates };
            } catch (error) {
              console.error(`Error fetching ${currency.symbol}:`, error);
              return null;
            }
          })
        );

        const allRates: Record<string, Record<string, number>> = {};
        for (const result of responses) {
          if (result && Object.keys(result.rates).length > 0) {
            allRates[result.symbol] = result.rates;
          }
        }

        set({
          lastFetchTime: Date.now().toString(),
          favoriteCurrencyRates: allRates,
        });
        handleConversion(amountToConvert);
      },

      fetchTimeSeries: async () => {
        set({ timeSeries: [] });
      },

      handleConversion: (amount) => {
        set((state) => {
          const rates = state.favoriteCurrencyRates[state.baseCurrency] || {};
          const converted = state.favoriteCurrencies.reduce<
            Record<string, number>
          >((acc, currency) => {
            if (currency.symbol && currency.symbol !== state.baseCurrency) {
              acc[currency.symbol] = amount * (rates[currency.symbol] ?? 0);
            }
            return acc;
          }, {});
          return { convertedCurrencies: converted };
        });
      },

      clearStorage: () => {
        storage.clearAll();
        set({
          favoriteCurrencies: initialItems,
          favoriteCurrencyRates: {},
          timeSeries: [],
          convertedCurrencies: {},
          baseCurrency: initialItems[0].symbol,
          amountToConvert: 0,
          amountInputRaw: "",
          lastFetchTime: null,
          isFetching: false,
        });
      },
    }),
    {
      name: "currency-store-persist",
      storage: createJSONStorage(() => zustandCurrencyStorage),
    }
  )
);

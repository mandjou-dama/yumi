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
  favoriteCurrencies: CurrencyCardItem[];
  favoriteCurrencyRates: Record<string, Record<string, number>>;
  baseCurrency: string;
  amountToConvert: number;
  convertedCurrencies: Record<string, number>;
  lastFetchTime: string | null;
  timeSeries: TimeSeriesType[]; // Will be empty since FloatRates doesn't support this
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
  fetchTimeSeries: (startDate: string, endDate: string) => Promise<void>; // Will do nothing
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
        const allRates: Record<string, Record<string, number>> = {};

        try {
          for (const currency of favoriteCurrencies) {
            // Skip if currency is not selected
            if (!currency.symbol) continue;

            const response = await fetch(
              `https://www.floatrates.com/daily/${currency.symbol.toLowerCase()}.json`
            );

            if (!response.ok) {
              console.error(`Failed to fetch rates for ${currency.symbol}`);
              continue;
            }

            const data = await response.json();

            // console.log(data);

            // Get the other currencies we need to convert to
            const otherCurrencies = favoriteCurrencies
              .filter((item) => item.symbol && item.symbol !== currency.symbol)
              .map((item) => item.symbol.toLowerCase());

            // Prepare rates object for this base currency
            const rates: Record<string, number> = {};

            // Extract rates for the currencies we're interested in
            for (const targetCurrency of otherCurrencies) {
              if (data[targetCurrency]) {
                rates[targetCurrency.toUpperCase()] = data[targetCurrency].rate;
              }
            }

            if (Object.keys(rates).length > 0) {
              allRates[currency.symbol] = rates;
            }
          }

          set({
            lastFetchTime: Date.now().toString(),
            favoriteCurrencyRates: allRates,
          });

          // Trigger conversion after rates are updated
          handleConversion(amountToConvert);
        } catch (error) {
          console.error("Error fetching exchange rates:", error);
        }
      },
      fetchTimeSeries: async () => {
        // FloatRates doesn't support time series, so we'll just return an empty array
        set({ timeSeries: [] });
      },
      handleConversion: (amount) => {
        set((state) => {
          const rates = state.favoriteCurrencyRates[state.baseCurrency] || {};

          if (Object.keys(rates).length === 0) {
            return { convertedCurrencies: {} };
          }

          const converted = state.favoriteCurrencies.reduce<
            Record<string, number>
          >((acc, currency) => {
            if (currency.symbol && currency.symbol !== state.baseCurrency) {
              acc[currency.symbol] = amount * (rates[currency.symbol] || 0);
            }
            return acc;
          }, {});

          return { convertedCurrencies: converted };
        });
      },
      clearStorage: () => {
        storage.clearAll();
      },
    }),
    {
      name: "currency-store-persist",
      storage: createJSONStorage(() => zustandCurrencyStorage),
    }
  )
);

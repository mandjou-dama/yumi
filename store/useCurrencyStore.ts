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

interface Rates {
  [currency: string]: number; // Exchange rate values
}

interface CurrencyStore {
  favoriteCurrencies: CurrencyCardItem[];
  favoriteCurrencyRates: Record<string, number>; // Store rates for favorite currencies
  baseCurrency: string;
  amountToConvert: number;
  convertedCurrencies: Record<string, number>;
  setAmountToConvert: (amount: number) => void;
  setBaseCurrency: (base: string) => void;
  fetchExchangeRates: () => Promise<void>;
  handleConversion: (amount: number) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      favoriteCurrencies: initialItems,
      favoriteCurrencyRates: {},
      baseCurrency: initialItems[0].symbol, // Default to the first item
      amountToConvert: 0,
      convertedCurrencies: {},

      setAmountToConvert: (amount) => {
        set({ amountToConvert: amount });
      },

      setBaseCurrency: (currency) => set({ baseCurrency: currency }),

      fetchExchangeRates: async () => {
        const { favoriteCurrencies, baseCurrency } = get();
        const rates: Record<string, number> = {}; // Flat map of currency to rate

        try {
          const response = await fetch(
            `https://api.fastforex.io/fetch-all?from=${baseCurrency}&api_key=86871c47b0-6d77251689-sopc73`,
            {
              method: "GET",
              headers: { accept: "application/json" },
            }
          );

          if (!response.ok) {
            console.error(`Failed to fetch rates for ${baseCurrency}`);
            return;
          }

          const data = await response.json();

          if (data.results) {
            // Filter only favorite currencies
            favoriteCurrencies.forEach((currency) => {
              if (data.results[currency.symbol]) {
                rates[currency.symbol] = data.results[currency.symbol];
              }
            });
          } else {
            console.error("Invalid data:", data);
          }

          // Update the store with processed rates
          set({ favoriteCurrencyRates: rates });
        } catch (error) {
          console.error("Error fetching exchange rates:", error);
        }
      },

      handleConversion: (amount) => {
        set((state) => {
          const rates = state.favoriteCurrencyRates;
          const baseRate = rates[state.baseCurrency];

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

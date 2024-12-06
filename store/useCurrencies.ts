import { create } from "zustand";

interface CurrencyStore {
  favoriteCurrencies: { [currency: string]: number }; // Stores the values of favorite currencies
  setFavoriteCurrencies: (currencies: { [currency: string]: number }) => void;
  convertAmount: (amount: number) => { [currency: string]: number }; // Converts the amount into all three currencies
}

const useCurrenciesStore = create<CurrencyStore>((set, get) => ({
  favoriteCurrencies: {
    USD: 1, // USD as base currency
    EUR: 0.94, // Example exchange rate
    XOF: 630.44, // Example exchange rate
  },

  setFavoriteCurrencies: (currencies) =>
    set({ favoriteCurrencies: currencies }),

  convertAmount: (amount) => {
    const { favoriteCurrencies } = get();
    const result: { [currency: string]: number } = {};

    for (const [currency, value] of Object.entries(favoriteCurrencies)) {
      result[currency] = value * amount; // Multiply the currency value by the given amount
    }

    return result;
  },
}));

export default useCurrenciesStore;

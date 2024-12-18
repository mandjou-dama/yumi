import { MMKV } from "react-native-mmkv";

import { StateStorage } from "zustand/middleware";

export const storage = new MMKV({
  id: "position-storage",
});

const zustandPostStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

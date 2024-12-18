import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import type { Positions } from "@/typings";

interface PositionStore {
  positions: Positions;
  setPositions: (newPositions: Positions) => void;
  resetPositions: () => void;
}

// MMKV instance
const storage = new MMKV({ id: "position-storage" });

// Custom StateStorage for MMKV
const zustandPostStorage = {
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

const usePositionStore = create<PositionStore>()(
  persist(
    (set) => ({
      positions: {}, // Initialize with an empty positions object
      setPositions: (newPositions) => set({ positions: newPositions }),
      resetPositions: () => set({ positions: {} }),
    }),
    {
      name: "position-store", // Key for persisting the store
      storage: createJSONStorage(() => zustandPostStorage), // Use custom MMKV storage
    }
  )
);

export { usePositionStore };

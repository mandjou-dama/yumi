import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Positions } from "@/typings";

interface PositionStore {
  positions: Positions;
  setPositions: (newPositions: Positions) => void;
  resetPositions: () => void;
}

const usePositionStore = create<PositionStore>()(
  persist(
    (set) => ({
      positions: {}, // Initialize with an empty positions object
      setPositions: (newPositions) => set({ positions: newPositions }),
      resetPositions: () => set({ positions: {} }),
    }),
    { name: "position-store" } // Key for persisting the store
  )
);

export { usePositionStore };

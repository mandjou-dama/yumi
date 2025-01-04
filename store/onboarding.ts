import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

//MMKV instance
const storage = new MMKV({ id: "onboarding-storage" });

const zustandOnboardingStorage = {
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

//storage.clearAll();

interface OnboardingStore {
  showOnboarding: boolean;
  isLoading: boolean;
  setShowOnboarding: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

export const useOnboarding = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      showOnboarding: true,
      isLoading: false,
      setShowOnboarding: (value) => {
        set({ showOnboarding: value });
      },
      setIsLoading: (value) => {
        set({ isLoading: value });
      },
    }),
    {
      name: "onboarding-store-persist",
      storage: createJSONStorage(() => zustandOnboardingStorage),
    }
  )
);

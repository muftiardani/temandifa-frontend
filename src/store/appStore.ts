import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

type Theme = "light" | "dark";
type Language = "id" | "en";

interface AppState {
  theme: Theme;
  language: Language;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  completeOnboarding: () => void;
  setIsLoading: (status: boolean) => void;
}

type PersistedState = {
  theme: Theme;
  language: Language;
};

export const useAppStore = create(
  persist<AppState, [], [], PersistedState>(
    (set) => ({
      theme: Appearance.getColorScheme() ?? "light",
      language: "id",
      hasCompletedOnboarding: false,
      isLoading: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setLanguage: (lang) => set({ language: lang }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setIsLoading: (status) => set({ isLoading: status }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);

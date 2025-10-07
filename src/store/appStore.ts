import { create } from "zustand";
import { Appearance } from "react-native";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";
type Language = "id" | "en";

interface AppState {
  theme: Theme;
  language: Language;
  hasCompletedOnboarding: boolean;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  completeOnboarding: () => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      theme: Appearance.getColorScheme() ?? "light",
      language: "id",
      hasCompletedOnboarding: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setLanguage: (lang) => set({ language: lang }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
);

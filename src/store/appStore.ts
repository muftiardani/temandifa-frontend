import { create } from "zustand";
import { Appearance } from "react-native";

type Theme = "light" | "dark";
type Language = "id" | "en";

interface AppState {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: Appearance.getColorScheme() ?? "light",
  language: "id",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  setLanguage: (lang) => set({ language: lang }),
}));

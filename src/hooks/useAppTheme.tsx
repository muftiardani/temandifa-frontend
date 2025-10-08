import { useAppStore } from "../store/appStore";
import { lightColors, darkColors } from "../constants/Colors";

export const useAppTheme = () => {
  const { theme } = useAppStore();
  const colors = theme === "dark" ? darkColors : lightColors;

  return { colors, theme };
};

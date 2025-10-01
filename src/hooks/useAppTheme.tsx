import { useAppStore } from "../store/appStore";
import { Strings } from "../constants/Strings";
import { lightColors, darkColors } from "../constants/Colors";

export const useAppTheme = () => {
  const { language, theme } = useAppStore();

  const t = Strings[language];
  const colors = theme === "dark" ? darkColors : lightColors;

  return { t, colors, theme };
};

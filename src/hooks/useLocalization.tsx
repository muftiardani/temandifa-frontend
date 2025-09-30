import { useAppStore } from "../store/appStore";
import { Strings } from "../constants/Strings";

export const useLocalization = () => {
  const language = useAppStore((state) => state.language);

  return Strings[language];
};

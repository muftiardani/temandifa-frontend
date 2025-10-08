import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import en from "./locales/en.json";
import id from "./locales/id.json";

export const resources = {
  en: {
    translation: en,
  },
  id: {
    translation: id,
  },
} as const;

const i18nOptions: InitOptions = {
  resources,
  lng: getLocales()[0]?.languageCode ?? "id",
  fallbackLng: "id",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
};

i18n.use(initReactI18next).init(i18nOptions);

export default i18n;

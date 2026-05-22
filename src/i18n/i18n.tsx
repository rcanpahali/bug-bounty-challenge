import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { cloneDeep } from "lodash";
import type { ReactElement } from "react";
import { initReactI18next } from "react-i18next";
import de from "./locales/de.json";
import en from "./locales/en.json";
import { STORAGE_KEYS } from "../storage/keys";

export const FALLBACK_LANGUAGE = "en";

export interface Language {
  locale: string;
  name: string;
  icon: ReactElement;
}

export const defaultTranslationModules = [
  { locale: "de", texts: de },
  { locale: "en", texts: en }
];
export const defaultLanguages = defaultTranslationModules.map((m) => m.locale);

const resources = cloneDeep(Object.fromEntries(defaultTranslationModules.map((m) => [m.locale, m.texts])));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: ["common", "app"],
    defaultNS: "app",
    load: "languageOnly",
    supportedLngs: defaultLanguages,
    nonExplicitSupportedLngs: true,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
      convertDetectedLanguage: (lng: string) => lng.split("-")[0] // convert e.g. "en-US" to "en" to match our resources
    },
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export const setLanguage = (lang: string): void => {
  i18n.changeLanguage(lang);
};

export default i18n;

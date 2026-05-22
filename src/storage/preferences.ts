import { useLocalStorageValue } from "@react-hookz/web";
import { STORAGE_KEYS } from "./keys";

export type Theme = "light" | "dark";
export type Language = "en" | "de";

const stringTransformer = {
  parse: <T extends string>(str: string | null, fb: T | null): T | null => (str as T) ?? fb,
  stringify: <T extends string>(val: T) => val
};

export function useThemeStorage() {
  return useLocalStorageValue<Theme>(STORAGE_KEYS.THEME, {
    defaultValue: "light",
    initializeWithValue: true,
    ...stringTransformer
  });
}

export function useLanguageStorage() {
  return useLocalStorageValue<Language>(STORAGE_KEYS.LANGUAGE, {
    defaultValue: "en",
    initializeWithValue: true,
    ...stringTransformer
  });
}

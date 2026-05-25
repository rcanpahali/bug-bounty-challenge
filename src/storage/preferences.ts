import { useLocalStorageValue } from "@react-hookz/web";
import { z } from "zod";
import { STORAGE_KEYS } from "./keys";

export const ThemeSchema = z.enum(["light", "dark"]);
export const LanguageSchema = z.enum(["en", "de"]);

export type Theme = z.infer<typeof ThemeSchema>;
export type Language = z.infer<typeof LanguageSchema>;

function enumStringifier<T extends string>(schema: z.ZodType<T>, fallback: T) {
  return {
    parse: (str: string | null): T => {
      const result = schema.safeParse(str);

      return result.success ? result.data : fallback;
    },
    stringify: (val: T): string => val
  };
}

export function useThemeStorage() {
  return useLocalStorageValue<Theme>(STORAGE_KEYS.THEME, {
    defaultValue: "light",
    initializeWithValue: true,
    ...enumStringifier(ThemeSchema, "light")
  });
}

export function useLanguageStorage() {
  return useLocalStorageValue<Language>(STORAGE_KEYS.LANGUAGE, {
    defaultValue: "en",
    initializeWithValue: true,
    ...enumStringifier(LanguageSchema, "en")
  });
}

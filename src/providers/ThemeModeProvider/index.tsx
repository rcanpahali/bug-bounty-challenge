import React, { createContext, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { osapiens } from "../../themes";
import { useThemeStorage } from "../../storage/preferences";
import type { Theme } from "../../storage/preferences";

export type ThemeMode = Theme;

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const useThemeMode = (): ThemeModeContextValue => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }

  return ctx;
};

const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value, set: setMode } = useThemeStorage();
  const mode: ThemeMode = value ?? "light";

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={osapiens[mode]}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;

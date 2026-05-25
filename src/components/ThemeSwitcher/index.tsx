import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { ThemeMode, useThemeMode } from "../../providers/ThemeModeProvider";

const themeModes: ThemeMode[] = ["light", "dark"];

const THEME_EMOJI: Record<ThemeMode, string> = {
  light: "☀️",
  dark: "🌙"
};

const ThemeSwitcher: React.FC = () => {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const { t } = useTranslation("app");

  return (
    <ButtonGroup color="inherit" aria-label="theme switcher">
      {themeModes.map((m) => (
        <Button
          key={m}
          onClick={() => setMode(m)}
          variant="outlined"
          aria-label={t(`theme.${m}`)}
          sx={{
            fontWeight: mode === m ? 700 : 400,
            backgroundColor: mode === m ? theme.tokens.color.secondary : "transparent"
          }}
        >
          {THEME_EMOJI[m]}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ThemeSwitcher;

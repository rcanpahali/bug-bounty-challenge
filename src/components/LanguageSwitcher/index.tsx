import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { defaultLanguages, setLanguage } from "../../i18n/i18n";

const LanguageSwitcher: React.FC = () => {
  const theme = useTheme();
  // prettier-ignore
  const {i18n: { resolvedLanguage, language }} = useTranslation();
  const activeLanguage = resolvedLanguage ?? language;

  return (
    <ButtonGroup color="inherit" aria-label="language switcher">
      {defaultLanguages.map((lang) => (
        <Button
          key={lang}
          onClick={() => setLanguage(lang)}
          variant="outlined"
          aria-label={lang.toUpperCase()}
          sx={{
            fontWeight: activeLanguage === lang ? 700 : 400,
            backgroundColor: activeLanguage === lang ? theme.tokens.color.secondary : "transparent"
          }}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default LanguageSwitcher;

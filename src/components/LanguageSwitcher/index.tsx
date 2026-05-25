import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { defaultLanguages } from "../../i18n/i18n";
import { useLanguageStorage } from "../../storage/preferences";

const LanguageSwitcher: React.FC = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const language = useLanguageStorage();

  const storedLang = language.value;

  // keep i18next in sync when storage changes (e.g. cross-tab update)
  useEffect(() => {
    if (storedLang && storedLang !== i18n.resolvedLanguage) {
      i18n.changeLanguage(storedLang);
    }
  }, [storedLang, i18n]);

  const activeLanguage = storedLang ?? i18n.resolvedLanguage ?? i18n.language;

  const handleChange = (lang: string) => {
    language.set(lang as "en" | "de");
    i18n.changeLanguage(lang);
  };

  return (
    <ButtonGroup color="inherit" aria-label="language switcher">
      {defaultLanguages.map((lang) => (
        <Button
          key={lang}
          onClick={() => handleChange(lang)}
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

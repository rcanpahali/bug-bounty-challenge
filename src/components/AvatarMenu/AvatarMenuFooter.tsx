import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";

const AvatarMenuFooter: React.FC = () => {
  const { t } = useTranslation("app");
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="row" alignItems="center" p={2}>
      <Button variant="text" size="small" sx={{ color: theme.palette.primary.main, textTransform: "none" }}>
        {t("dataPrivacy")}
      </Button>
      <Button variant="text" size="small" sx={{ color: theme.palette.primary.main, textTransform: "none" }}>
        {t("imprint")}
      </Button>
    </Box>
  );
};

export default AvatarMenuFooter;

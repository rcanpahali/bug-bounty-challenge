import { mdiAlert } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { observer } from "mobx-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn, useLogout } from "../../api/services/User";
import { ERoute } from "../../types/global";

const AccessDenied: React.FC = () => {
  const { t } = useTranslation("app");
  const theme = useTheme();
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  const color = theme.palette.error.main;
  const logout = useLogout();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap={2}>
      <Icon size={2} color={color} path={mdiAlert} />
      <Typography variant="h5" sx={{ color }}>
        {t("AccessDenied")}
      </Typography>
      <Typography>{t("speakToYourAdmin")}</Typography>
      <Box display="flex" gap={1}>
        {isLoggedIn && (
          <Button variant="outlined" onClick={() => navigate(ERoute.HOME)}>
            {t("goHome")}
          </Button>
        )}
        <Button sx={{ color }} onClick={logout}>
          {t("logout")}
        </Button>
      </Box>
    </Box>
  );
};

export default observer(AccessDenied);

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "../AppHeader";
import { ERoute } from "../../types/global";

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation("app");
  const location = useLocation();

  const routeLabels: Partial<Record<ERoute, string>> = {
    [ERoute.LOGIN]: t("login"),
    [ERoute.HOME]: t("routes.home")
  };

  const pageTitle = routeLabels[location.pathname as ERoute] ?? "";

  return (
    <div id="portal-container" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          backgroundColor: theme.palette.background.default
        }}
      >
        <AppHeader pageTitle={pageTitle} />
        <Box
          component="main"
          sx={{
            position: "relative",
            height: `calc(100% - ${theme.tokens.header.height})`,
            width: "100%",
            marginTop: theme.tokens.header.height
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default observer(AppLayout);

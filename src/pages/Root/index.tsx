import { Box, Button, CircularProgress, Slide, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppHeader from "../../components/AppHeader";
import useMatchedRoute from "../../hooks/useMatchedRoute";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { ERoute, TRoute } from "../../types/global";
import AccessDenied from "../AccessDenied";
import { routes as useRoutes } from "../routes";
import { useIsLoggedIn, useLogin, useUserError, useUserLoading } from "../../api/services/User";

const hideSplashScreen = () => {
  const splashscreen = document.getElementById("app-splashscreen");

  if (splashscreen) {
    splashscreen.className = "";
    setTimeout(() => {
      splashscreen.remove();
    }, 300);
  }
};

const Root = () => {
  const { t } = useTranslation("app");
  const theme = useTheme();
  const location = useLocation();
  const loadingApp = useUserLoading();
  const accessDenied = useUserError();
  const isLoggedIn = useIsLoggedIn();
  const login = useLogin();

  const routes = [...useRoutes] as readonly TRoute[];
  const [fallbackRoute] = routes;
  const Fallback = fallbackRoute.Component;
  const { route = fallbackRoute, MatchedElement } = useMatchedRoute(routes, Fallback, { matchOnSubPath: true });

  const routeLabels: Partial<Record<ERoute, string>> = {
    [ERoute.HOME]: t("routes.home")
  };
  const pageTitle = routeLabels[route?.parentPath ?? route?.path] ?? "";

  useEffect(() => {
    hideSplashScreen();
  }, []);

  if (location.pathname === ERoute.ROOT) {
    return <Navigate to={ERoute.HOME} replace />;
  }

  if (accessDenied) {
    return <AccessDenied />;
  }

  return (
    <div
      id="portal-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
      }}
    >
      {loadingApp && (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
          <CircularProgress color="primary" size={100} />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          backgroundColor: theme.palette.background.default
        }}
      >
        <Slide direction="down" in={!loadingApp} mountOnEnter>
          <AppHeader pageTitle={pageTitle} />
        </Slide>
        <Box
          component="main"
          sx={{
            position: "relative",
            height: `calc(100% - ${theme.tokens.header.height})`,
            width: "100%",
            marginTop: theme.tokens.header.height /* Necessary because of AppBar */
          }}
        >
          {!isLoggedIn && !loadingApp ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap={2}>
              <Typography variant="h6">{t("notLoggedIn")}</Typography>
              <Button variant="contained" onClick={login}>
                {t("login")}
              </Button>
            </Box>
          ) : (
            MatchedElement
          )}
        </Box>
      </Box>
    </div>
  );
};

export default observer(Root);

import { CircularProgress, Grow } from "@mui/material";
import { Box } from "@mui/system";
import { observer } from "mobx-react";
import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import AuthGuard from "../../components/AuthGuard";
import { ERoute } from "../../types/global";
import { routes } from "../routes";

const Login = lazy(() => import("../Login"));

const Loading = (
  <Grow in>
    <Box position="absolute" display="flex" justifyContent="center" alignItems="center" width="100%" height="100vh">
      <CircularProgress />
    </Box>
  </Grow>
);

const hideSplashScreen = () => {
  const splashscreen = document.getElementById("app-splashscreen");
  if (splashscreen) {
    splashscreen.className = "";
    setTimeout(() => splashscreen.remove(), 300);
  }
};

const Root: React.FC = () => {
  useEffect(() => {
    hideSplashScreen();
  }, []);

  return (
    <Suspense fallback={Loading}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ERoute.ROOT} element={<Navigate to={ERoute.LOGIN} replace />} />
          <Route path={ERoute.LOGIN} element={<Login />} />

          <Route element={<AuthGuard />}>
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>

          <Route path="*" element={<Navigate to={ERoute.LOGIN} replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default observer(Root);

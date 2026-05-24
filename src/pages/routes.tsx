import { mdiHome } from "@mdi/js";
import Icon from "@mdi/react";
import { CircularProgress, Grow } from "@mui/material";
import { Box } from "@mui/system";
import React, { lazy, Suspense } from "react";
import { ERoute, TRoute } from "../types/global";

const Home = lazy(() => import("./Home"));

const Loading = (
  <Grow in={true}>
    <Box position="absolute" display="flex" justifyContent="center" alignItems="center" width="100%" bottom="0px" top="0px">
      <CircularProgress />
    </Box>
  </Grow>
);

const lazyLoad = (Component: React.ComponentType) => {
  const Lazy = () => (
    <Suspense fallback={Loading}>
      <Component />
    </Suspense>
  );
  Lazy.displayName = `Lazy(${Component.displayName ?? Component.name})`;

  return Lazy;
};

export const routes: TRoute[] = [
  {
    path: ERoute.HOME,
    Icon: <Icon path={mdiHome} size={1} />,
    Component: lazyLoad(Home)
  }
];

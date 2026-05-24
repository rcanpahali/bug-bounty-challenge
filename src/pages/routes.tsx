import { mdiHome } from "@mdi/js";
import Icon from "@mdi/react";
import { lazy } from "react";
import { ERoute, TRoute } from "../types/global";

const Home = lazy(() => import("./Home"));

export const routes: TRoute[] = [
  {
    path: ERoute.HOME,
    Icon: <Icon path={mdiHome} size={1} />,
    Component: Home
  }
];

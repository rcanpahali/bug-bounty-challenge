import { Box, Fade, Grow, Slide } from "@mui/material";
import React from "react";
import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { PathParams, TRoute } from "../types/global";
import { validateParams } from "../utils/router";

interface UseMatchedRouteOptions {
  notFoundComponent?: React.FC;
  matchOnSubPath?: boolean;
  transition?:
    | "none"
    | "fade"
    | "grow"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right";
}

const useMatchedRoute = (
  routes: ReadonlyArray<TRoute>,
  fallbackComponent?: React.FC,
  options?: UseMatchedRouteOptions
): {
  route: TRoute;
  params: PathParams | null;
  MatchedElement: JSX.Element;
} => {
  const { notFoundComponent, matchOnSubPath, transition = "fade" } =
    options || {};
  const location = useLocation();
  const results = routes
    .map((route: TRoute): {
      route: TRoute;
      match: ReturnType<typeof matchPath> | null;
    } => ({
      route,
      match: matchPath(
        { path: route.path, end: !matchOnSubPath, caseSensitive: !matchOnSubPath },
        location.pathname
      )
    }))
    .filter(({ match }) => !!match);
  const [firstResult] = results;
  const { match, route } = firstResult || {};
  const Fallback = fallbackComponent;
  const NotFound = notFoundComponent || (() => <>not found</>);

  const Transition: React.FC<React.PropsWithChildren> = React.useMemo(() => {
    if (transition === "fade") {
      const FadeTransition: React.FC<React.PropsWithChildren> = ({ children }) => (
        <Fade in timeout={300}>
          <Box height={"100%"}>{children}</Box>
        </Fade>
      );
      return FadeTransition;
    }

    if (transition === "grow") {
      const GrowTransition: React.FC<React.PropsWithChildren> = ({ children }) => (
        <Grow in timeout={300}>
          <Box height={"100%"}>{children}</Box>
        </Grow>
      );
      return GrowTransition;
    }

    if (transition.startsWith("slide")) {
      const [, direction] = transition.split("-");
      const SlideTransition: React.FC<React.PropsWithChildren> = ({ children }) => (
        <Slide
          in
          direction={direction as "left" | "right" | "up" | "down"}
          timeout={300}
        >
          <Box height={"100%"}>{children}</Box>
        </Slide>
      );
      return SlideTransition;
    }
    return (({ children }) => <>{children}</>) as React.FC<React.PropsWithChildren>;
  }, [transition]);

  return {
    route: route,
    params:
      match && validateParams(route.path, match.params) ? match.params as PathParams : {},
    MatchedElement: (
      <Routes>
        {matchOnSubPath &&
          routes.map(({ path, Component: RouteComponent }) => (
            <Route
              key={path + "matchOnSubPath"}
              path={`/${path.split("/").slice(1, 2)}/*`}
              element={
                <Transition>
                  <RouteComponent />
                </Transition>
              }
            />
          ))}
        {routes.map(({ path, Component: RouteComponent }) => (
          <Route
            key={path + "root"}
            path={path}
            caseSensitive
            element={
              <Transition>
                <RouteComponent />
              </Transition>
            }
          />
        ))}
        <Route
          path="*"
          element={
            <Transition>
              {Fallback ? <Fallback /> : <NotFound />}
            </Transition>
          }
        />
      </Routes>
    )
  };
};

export default useMatchedRoute;

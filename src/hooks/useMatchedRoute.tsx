import { Box, Fade, Grow, Slide } from "@mui/material";
import React, { type ReactElement } from "react";
import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { PathParams, TRoute } from "../types/global";
import { validateParams } from "../utils/router";

interface UseMatchedRouteOptions {
  notFoundComponent?: React.FC;
  matchOnSubPath?: boolean;
  transition?: TransitionType;
}

type TransitionType = "none" | "fade" | "grow" | "slide-up" | "slide-down" | "slide-left" | "slide-right";

interface TransitionWrapperProps extends React.PropsWithChildren {
  type: TransitionType;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children, type }) => {
  if (type === "fade") {
    return (
      <Fade in timeout={300}>
        <Box height="100%">{children}</Box>
      </Fade>
    );
  }
  if (type === "grow") {
    return (
      <Grow in timeout={300}>
        <Box height="100%">{children}</Box>
      </Grow>
    );
  }
  if (type.startsWith("slide")) {
    const [, direction] = type.split("-");
    return (
      <Slide in direction={direction as "left" | "right" | "up" | "down"} timeout={300}>
        <Box height="100%">{children}</Box>
      </Slide>
    );
  }
  return <>{children}</>;
};

const DefaultNotFound: React.FC = () => <>not found</>;

const useMatchedRoute = (
  routes: ReadonlyArray<TRoute>,
  fallbackComponent?: React.FC,
  options?: UseMatchedRouteOptions
): {
  route: TRoute;
  params: PathParams | null;
  MatchedElement: ReactElement;
} => {
  const { notFoundComponent, matchOnSubPath, transition = "fade" } = options || {};
  const location = useLocation();
  const results = routes
    .map(
      (
        route: TRoute
      ): {
        route: TRoute;
        match: ReturnType<typeof matchPath> | null;
      } => ({
        route,
        match: matchPath({ path: route.path, end: !matchOnSubPath, caseSensitive: !matchOnSubPath }, location.pathname)
      })
    )
    .filter(({ match }) => !!match);
  const [firstResult] = results;
  const { match, route } = firstResult || {};
  const Fallback = fallbackComponent;
  const NotFound = notFoundComponent || DefaultNotFound;

  return {
    route: route,
    params: match && validateParams(route.path, match.params) ? match.params : {},
    MatchedElement: (
      <Routes>
        {matchOnSubPath &&
          routes.map(({ path, Component: RouteComponent }) => (
            <Route
              key={path + "matchOnSubPath"}
              path={`/${path.split("/").slice(1, 2)}/*`}
              element={
                <TransitionWrapper type={transition}>
                  <RouteComponent />
                </TransitionWrapper>
              }
            />
          ))}
        {routes.map(({ path, Component: RouteComponent }) => (
          <Route
            key={path + "root"}
            path={path}
            caseSensitive
            element={
              <TransitionWrapper type={transition}>
                <RouteComponent />
              </TransitionWrapper>
            }
          />
        ))}
        <Route path="*" element={<TransitionWrapper type={transition}>{Fallback ? <Fallback /> : <NotFound />}</TransitionWrapper>} />
      </Routes>
    )
  };
};

export default useMatchedRoute;

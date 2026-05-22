import React, { Suspense } from "react";

import { HashRouter } from "react-router-dom";

import { StyledEngineProvider } from "@mui/material/styles";

import RootComponent from "./pages/Root/index";

import "./i18n";
import { StoreProvider as UserStoreProvider } from "./api/services/User";
import SnackbarProvider from "./providers/SnackbarProvider";
import ThemeModeProvider from "./providers/ThemeModeProvider";

const AppContainer = () => {
  return (
    <>
      {/* Kickstart a simple scoped CSS baseline to build upon. */}
      {/* Required to override Material-UI's styles via CSS modules. */}
      <Suspense fallback={<div>loading...</div>}>
        <StyledEngineProvider injectFirst>
          <ThemeModeProvider>
            <UserStoreProvider>
              <SnackbarProvider>
                <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <RootComponent />
                </HashRouter>
              </SnackbarProvider>
            </UserStoreProvider>
          </ThemeModeProvider>
        </StyledEngineProvider>
      </Suspense>
    </>
  );
};

export default AppContainer;

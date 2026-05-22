import React, { Suspense } from "react";

import { HashRouter } from "react-router-dom";

import { CssBaseline } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

import RootComponent from "./pages/Root/index";
import { osapiens } from "./themes";

import "./i18n";
import { StoreProvider as UserStoreProvider } from "./api/services/User";
import SnackbarProvider from "./providers/SnackbarProvider";

const theme = osapiens.light;

const AppContainer = () => {
  return (
    <>
      <CssBaseline />
      {/* Kickstart a simple scoped CSS baseline to build upon. */}
      {/* Required to override Material-UI's styles via CSS modules. */}
      <Suspense fallback={<div>loading...</div>}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <UserStoreProvider>
              <SnackbarProvider>
                <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <RootComponent />
                </HashRouter>
              </SnackbarProvider>
            </UserStoreProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </Suspense>
    </>
  );
};

export default AppContainer;

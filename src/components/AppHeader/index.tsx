import { Button, Grow, Box, Theme, Toolbar, Tooltip, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useIsLoggedIn, useLogin } from "../../api/services/User";
import { User } from "../../api/services/User/store";
import { useTimerReset, useTimerSkip } from "../../api/services/Timer";
import AvatarMenu from "../AvatarMenu";
import CountdownTimer from "../CountdownTimer";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User | null;
  pageTitle: string;
}

const typoStyle = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  lineHeight: 1
};

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  height: theme.tokens.header.height
}));

const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>((props, ref) => {
  const { user, pageTitle } = props;
  const { t } = useTranslation("app");
  const theme = useTheme();
  const isLoggedIn = useIsLoggedIn();
  const login = useLogin();

  // these are timer controls to test the timer functionality more easily - not necessarily intended as UX
  const skip = useTimerSkip();
  const reset = useTimerReset();

  return (
    <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
      <Toolbar>
        <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, overflow: "hidden" }}>
            <CountdownTimer />
            <Tooltip title={!isLoggedIn ? t("timer.controls.loginRequired") : ""}>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  disabled={!isLoggedIn}
                  onClick={skip}
                  sx={{ "&.Mui-disabled": { color: theme.tokens.color.lighten3, borderColor: theme.tokens.color.lighten3 } }}
                >
                  {t("timer.controls.skip")}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  disabled={!isLoggedIn}
                  onClick={reset}
                  sx={{ "&.Mui-disabled": { color: theme.tokens.color.lighten3, borderColor: theme.tokens.color.lighten3 } }}
                >
                  {t("timer.controls.reset")}
                </Button>
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ minWidth: 0, px: 1 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5)
              }}
              variant="h6"
              component="div"
              noWrap
            >
              {t("appTitle").toLocaleUpperCase()}
            </Typography>
            <Typography sx={{ ...typoStyle }} variant="overline" component="div" noWrap>
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ justifyContent: "flex-end", display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </Box>
            <Grow in>
              <Box sx={{ display: "flex" }}>
                {isLoggedIn && user ? (
                  <AvatarMenu user={user} />
                ) : (
                  <Button variant="contained" onClick={login}>
                    {t("login")}
                  </Button>
                )}
              </Box>
            </Grow>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});
AppHeader.displayName = "AppHeader";

export default observer(AppHeader);

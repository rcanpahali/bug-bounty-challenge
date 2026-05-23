import { Grow, Box, Theme, Toolbar, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../api/services/User/store";
import AvatarMenu from "../AvatarMenu";
import CountdownTimer from "../CountdownTimer";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

interface AppBarProps extends MuiAppBarProps {
  theme?: Theme;
}

interface AppHeaderProps {
  user: User | null; // todo: check this again, should it be nullable or not?
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

  return (
    <AppBar ref={ref} position="fixed" sx={{ width: "100vw" }}>
      <Toolbar>
        <Box sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
          <Box>
            <CountdownTimer />
          </Box>
          <Box sx={{ width: 20, height: 20, flex: 1 }} />
          <Box sx={{ flex: 2 }}>
            <Typography
              sx={{
                ...typoStyle,
                color: theme.palette.primary.main,
                mb: theme.spacing(0.5)
              }}
              variant="h6"
              component="div"
            >
              {t("appTitle").toLocaleUpperCase()}
            </Typography>
            <Typography sx={{ ...typoStyle }} variant="overline" component="div" noWrap>
              {pageTitle.toLocaleUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, justifyContent: "flex-end", display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Grow in>
              <Box sx={{ display: "flex" }}>{user && <AvatarMenu user={user} />}</Box>
            </Grow>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
});
AppHeader.displayName = "AppHeader";

export default AppHeader;

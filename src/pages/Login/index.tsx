import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useIsLoggedIn, useLogin, useUserLoading } from "../../api/services/User";
import { ERoute } from "../../types/global";

const Login: React.FC = () => {
  const { t } = useTranslation("app");
  const isLoggedIn = useIsLoggedIn();
  const isLoading = useUserLoading();
  const login = useLogin();

  if (isLoggedIn) {
    return <Navigate to={ERoute.HOME} replace />;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap={2}>
      <Typography variant="h6">{t("notLoggedIn")}</Typography>
      <Button variant="contained" onClick={login} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} color="inherit" /> : t("login")}
      </Button>
    </Box>
  );
};

export default observer(Login);

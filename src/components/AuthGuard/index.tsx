import { Box, CircularProgress } from "@mui/material";
import { observer } from "mobx-react";
import { Navigate, Outlet } from "react-router-dom";
import { useIsLoggedIn, useUserError, useUserLoading } from "../../api/services/User";
import AccessDenied from "../../pages/AccessDenied";
import { ERoute } from "../../types/global";

const AuthGuard: React.FC = () => {
  const isLoggedIn = useIsLoggedIn();
  const isLoading = useUserLoading();
  const hasError = useUserError();

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
        <CircularProgress size={100} />
      </Box>
    );
  }

  if (hasError) {
    return <AccessDenied />;
  }

  if (!isLoggedIn) {
    return <Navigate to={ERoute.LOGIN} replace />;
  }

  return <Outlet />;
};

export default observer(AuthGuard);

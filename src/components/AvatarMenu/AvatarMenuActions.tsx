import { mdiLogoutVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { Box, Button, Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface AvatarMenuActionsProps {
  onLogout: () => void;
}

const AvatarMenuActions: React.FC<AvatarMenuActionsProps> = ({ onLogout }) => {
  const { t } = useTranslation("app");

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Tooltip title={<Box>{t("logout")}</Box>}>
        <Button onClick={onLogout} variant="text">
          <Icon path={mdiLogoutVariant} size={1} />
          <Box m={0.5} />
          {t("logout")}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default AvatarMenuActions;

import { Box, Typography } from "@mui/material";
import React from "react";
import { User } from "../../api/services/User/store";

interface AvatarMenuUserInfoProps {
  user: User;
}

const AvatarMenuUserInfo: React.FC<AvatarMenuUserInfoProps> = ({ user }) => (
  <Box display="flex" flexDirection="column" alignItems="center" p={1}>
    <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
    <Typography variant="body2" color="textSecondary">
      {user.email}
    </Typography>
    <Box m={1} />
  </Box>
);

export default AvatarMenuUserInfo;

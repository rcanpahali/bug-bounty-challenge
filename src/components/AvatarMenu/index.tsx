import { Avatar, Divider, IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import React from "react";
import { useLogout } from "../../api/services/User";
import { User } from "../../api/services/User/store";
import AvatarMenuActions from "./AvatarMenuActions";
import AvatarMenuFooter from "./AvatarMenuFooter";
import AvatarMenuUserInfo from "./AvatarMenuUserInfo";

const getInitials = (user: User): string =>
  [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name![0].toLocaleUpperCase())
    .join("");

const stringAvatar = (user: User) => {
  const initials = getInitials(user);
  // 36 * 7 <= 255
  const r = Math.floor(parseInt(initials[0] ?? "k", 36) * 7);
  const g = Math.floor(parseInt(initials[1] ?? "l", 36) * 7);
  const b = Math.floor(parseInt(user?.firstName?.[1] ?? "m", 36) * 7);

  return {
    sx: { bgcolor: `rgb(${r},${g},${b})`, cursor: "pointer" },
    children: initials
  };
};

interface AvatarMenuProps {
  user: User;
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const logout = useLogout();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <div>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ p: 0 }}
      >
        <Avatar {...stringAvatar(user)} />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <AvatarMenuUserInfo user={user} />
        <Divider />
        <AvatarMenuActions onLogout={handleLogout} />
        <Divider />
        <AvatarMenuFooter />
      </Menu>
    </div>
  );
};

export default AvatarMenu;

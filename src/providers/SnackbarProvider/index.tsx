import React from "react";
import { SnackbarProvider as NotistackSnackbarProvider, SnackbarContent, type CustomContentProps } from "notistack";

import { styled } from "@mui/material/styles";

/* Create custom SnackbarContent to apply variant-based styling. */
const StyledSnackbarContent = styled(SnackbarContent)<{ variant: CustomContentProps["variant"] }>(({ theme, variant }) => ({
  ...(variant === "success" && { backgroundColor: theme.palette.success.main }),
  ...(variant === "error" && { backgroundColor: theme.palette.error.main }),
  ...(variant === "warning" && { backgroundColor: theme.palette.warning.main }),
  ...(variant === "info" && { backgroundColor: theme.palette.info.main })
}));

const VariantSnackbar = React.forwardRef<HTMLDivElement, CustomContentProps>(({ id: _id, variant, ...props }, ref) => (
  <StyledSnackbarContent ref={ref} role="alert" variant={variant} {...props} />
));
VariantSnackbar.displayName = "VariantSnackbar";

const SnackbarProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <NotistackSnackbarProvider
    maxSnack={3}
    Components={{
      success: VariantSnackbar,
      error: VariantSnackbar,
      warning: VariantSnackbar,
      info: VariantSnackbar
    }}
  >
    {children}
  </NotistackSnackbarProvider>
);

export default SnackbarProvider;

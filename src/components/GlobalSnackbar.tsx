import React from "react";
import { Snackbar, Alert } from "@mui/material";
import useNotificationStore from "../stores/notificationStore";

export const GlobalSnackbar: React.FC = () => {
  const notification = useNotificationStore((s) => s.notification);
  const clearNotification = useNotificationStore((s) => s.clearNotification);

  return (
    <Snackbar
      key={notification?.key}
      open={notification !== null}
      autoHideDuration={6000}
      onClose={clearNotification}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={clearNotification}
        severity={notification?.severity ?? "info"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;

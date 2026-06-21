import { create } from "zustand";

export type NotificationSeverity = "error" | "warning" | "info" | "success";

interface Notification {
  message: string;
  severity: NotificationSeverity;
  key: number;
}

interface NotificationState {
  notification: Notification | null;
  showNotification: (message: string, severity?: NotificationSeverity) => void;
  showError: (message: string) => void;
  clearNotification: () => void;
}

const useNotificationStore = create<NotificationState>()((set) => ({
  notification: null,
  showNotification: (message, severity = "info") =>
    set({ notification: { message, severity, key: Date.now() } }),
  showError: (message) =>
    set({ notification: { message, severity: "error", key: Date.now() } }),
  clearNotification: () => set({ notification: null }),
}));

export default useNotificationStore;

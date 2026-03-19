import { http } from "./http";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

export type AppNotification = {
  _id: string;
  userId: string;
  type: "new_message" | "friend_request" | "friend_accepted";
  referenceId: string;
  isRead: boolean;
  createdAt: string;
};

export const apiGetNotifications = async () => {
  const res = await http.get<ApiResponse<AppNotification[]>>("/api/notifications");
  return res.data;
};

export const apiMarkRead = async (notificationId: string) => {
  const res = await http.put<ApiResponse<AppNotification>>(
    `/api/notifications/${notificationId}/read`
  );
  return res.data;
};

export const apiMarkAllRead = async () => {
  const res = await http.put<ApiResponse<void>>("/api/notifications/read-all");
  return res.data;
};

export const apiGetUnreadCount = async () => {
  const res = await http.get<ApiResponse<{ count: number }>>("/api/notifications/unread-count");
  return res.data;
};

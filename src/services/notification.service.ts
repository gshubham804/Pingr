import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";

// Get all notifications for a user (newest first)
export const getNotifications = async (userId: string) => {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);
};

// Mark a single notification as read
export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found");
  return notification;
};

// Mark ALL notifications as read
export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

// Count unread notifications
export const getUnreadCount = async (userId: string) => {
  return Notification.countDocuments({ userId, isRead: false });
};

import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../services/notification.service.js";

// GET /api/notifications
export const listNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notifications = await getNotifications(req.user!.userId);
    res.status(200).json(new ApiResponse(200, "Notifications fetched", notifications));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};

// GET /api/notifications/unread-count
export const unreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await getUnreadCount(req.user!.userId);
    res.status(200).json(new ApiResponse(200, "Unread count", { count }));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};

// PUT /api/notifications/:notificationId/read
export const readOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notificationId = req.params.notificationId as string;
    const notification = await markAsRead(notificationId, req.user!.userId);
    res.status(200).json(new ApiResponse(200, "Notification marked as read", notification));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};

// PUT /api/notifications/read-all
export const readAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await markAllAsRead(req.user!.userId);
    res.status(200).json(new ApiResponse(200, "All notifications marked as read"));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};

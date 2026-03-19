import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getUserProfile, updateUserProfile, searchUsers } from "../services/user.service.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProfileSchema } from "../validators/user.validator.js";

// GET /api/users/search?q=...
export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = req.query.q as string;
        const users = await searchUsers(query, req.user!.userId);
        res.status(200).json(new ApiResponse(200, "Search results", users));
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
    }
};


// GET /api/users/me
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await getUserProfile(req.user!.userId);
        res.status(200).json(new ApiResponse(200, "Profile fetched", user));
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
    }
};

// GET /api/users/:userId
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId as string;
        const user = await getUserProfile(userId);
        res.status(200).json(new ApiResponse(200, "Profile fetched", user));
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
    }
};

// PUT /api/users/me
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await updateUserProfile(req.user!.userId, req.body);
    res.status(200).json(new ApiResponse(200, "Profile updated", user));
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error"));
  }
};
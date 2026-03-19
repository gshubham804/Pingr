import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(new ApiResponse(201, "User registered successfully", result));
  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(new ApiResponse(200, "Login successful", result));
  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
};

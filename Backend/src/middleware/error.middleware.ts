import type { NextFunction, Response, Request } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    // Log the error for debugging
    console.error(`[Error]: ${err instanceof Error ? err.message : "Unknown error"}`);

    // Check if it's our custom ApiError, otherwise treat it as a 500
    if (err instanceof ApiError) {
        res.status(err.statusCode).json(
            new ApiResponse(err.statusCode, err.message)
        );
        return;
    }

    // Fallback for unexpected errors
    res.status(500).json(
        new ApiResponse(500, "Internal Server Error")
    );
};

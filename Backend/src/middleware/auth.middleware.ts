import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export const protectRoute = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
        // STEP 1: Extract the token from the "Authorization" header
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return next(new ApiError(401, "Unauthorized - Token missing"))
        }

        // STEP 2: Verify the token using your secret key
        const decoded = verifyToken(token);

        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return next(new ApiError(401, "Unauthorized - Invalid or expired token"))
    }
}

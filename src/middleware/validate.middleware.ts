import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // Format the Zod errors into a readable message
            const errorMessage = result.error.issues
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join(", ");

            return next(new ApiError(400, errorMessage));
        }

        req.body = result.data;
        next();
    };
};

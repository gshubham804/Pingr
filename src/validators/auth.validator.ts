import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .email({ message: "Invalid email format" })
        .trim()
        .toLowerCase(),

    password: z
        .string({ message: "Password is required" })
        .min(8, "Password must be at least 8 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    fullName: z
    .string({message:"Full name is required"})
    .trim()
    .min(2, "FUll name must be at least 2 characters long"),

    email: z
    .email({message:"Invalid email format"})
    .trim()
    .toLowerCase(),

    password: z
    .string({message: "Password is required"})
    .min(8, "Password must be at least 8 characters long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
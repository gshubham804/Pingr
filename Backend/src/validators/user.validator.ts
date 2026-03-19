import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters").optional(),
    profile: z.object({
        bio:z.string().max(300, "Bio must be under 300 characters").optional(),
        location: z.string().max(100).optional(),
        avatar: z.url("Avatar must be a valid URL").optional(),
    }).optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
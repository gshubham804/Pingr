import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.object({
    type: z.enum(["text", "image", "file"]),
    body: z.string().min(1, "Message body cannot be empty"),
  }),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

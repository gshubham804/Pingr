import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { sendMessageSchema } from "../validators/chat.validator.js";
import {
  startConversation,
  getConversations,
  postMessage,
  listMessages,
} from "../controllers/chat.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/conversations", getConversations);
router.post("/conversations/:userId", startConversation);
router.post("/conversations/:conversationId/messages", validate(sendMessageSchema), postMessage);
router.get("/conversations/:conversationId/messages", listMessages);

export default router;

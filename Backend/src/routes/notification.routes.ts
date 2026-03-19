import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { listNotifications, unreadCount, readOne, readAll } from "../controllers/notification.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", listNotifications);
router.get("/unread-count", unreadCount);
router.put("/read-all", readAll);
router.put("/:notificationId/read", readOne);

export default router;

import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sendRequest,
  respondRequest,
  getPending,
  getFriends,
} from "../controllers/friendRequest.controller.js";

const router = Router();

// All routes protected
router.use(protectRoute);

router.post("/request/:toUserId", sendRequest);
router.put("/request/:requestId/respond", respondRequest);
router.get("/requests/pending", getPending);
router.get("/", getFriends);

export default router;

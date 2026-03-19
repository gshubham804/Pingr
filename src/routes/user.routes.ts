import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateProfileSchema } from "../validators/user.validator.js";
import { search, getMe, getProfile, updateProfile } from "../controllers/user.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/search", search);
router.get("/me", getMe);
router.put("/me", validate(updateProfileSchema), updateProfile);
router.get("/:userId", getProfile);

export default router;

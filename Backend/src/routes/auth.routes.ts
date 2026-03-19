import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

// POST /api/auth/login
// First: validate middleware checks & sanitizes the body
// Then: login controller handles the business logic
router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);


export default router;

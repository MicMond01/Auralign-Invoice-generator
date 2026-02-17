import { Router } from "express";
import authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} from "../validations/auth.validation";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

// Public routes
router.post(
  "/register",
  authLimiter,
  validate(registerValidation),
  authController.register,
);
router.post(
  "/login",
  authLimiter,
  validate(loginValidation),
  authController.login,
);

// Protected routes
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordValidation),
  authController.changePassword,
);

router.post(
  "/register-admin",
  authLimiter,
  validate(registerValidation),
  authController.registerAdmin,
);

export default router;

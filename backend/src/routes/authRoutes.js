import express from "express";
import {
  changePassword,
  forgotPassword,
  getUserProfile,
  login,
  logout,
  requestEmailChange,
  resetPassword,
  updateProfile,
  verifyEmailChange,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middlewares/fileUpload.js";
import {
  changeEmailLimiter,
  forgotPasswordLimiter,
  loginLimiter,
  resetPasswordLimiter,
  verifyEmailChangeLimiter,
} from "../middlewares/rateLimiters.js";

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/logout", logout);

router.get("/profile", authMiddleware, getUserProfile);

router.patch("/change-password", authMiddleware, changePassword);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);

router.patch(
  "/update-profile",
  authMiddleware,
  upload.single("avatar"),
  uploadToCloudinary("patina/avatars"),
  updateProfile,
);

router.post(
  "/change-email",
  authMiddleware,
  changeEmailLimiter,
  requestEmailChange,
);
router.post(
  "/verify-email-change",
  verifyEmailChangeLimiter,
  verifyEmailChange,
);

export default router;

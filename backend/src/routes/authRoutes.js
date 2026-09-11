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

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", authMiddleware, getUserProfile);

router.patch("/change-password", authMiddleware, changePassword);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.patch(
  "/update-profile",
  authMiddleware,
  // upload.single("avatar"),
  updateProfile,
);

router.post("/change-email", authMiddleware, requestEmailChange);
router.post("/verify-email-change", verifyEmailChange);

export default router;

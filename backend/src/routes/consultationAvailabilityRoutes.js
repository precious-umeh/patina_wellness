import express from "express";
import {
  getAvailability,
  getAvailableSlots,
  updateAvailability,
} from "../controllers/consultationAvailabilityController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-consultation-available-slots", getAvailableSlots);

router.get("/get-consultation-availability", authMiddleware, getAvailability);

router.patch(
  "/update-consultation-availability",
  authMiddleware,
  updateAvailability,
);

export default router;

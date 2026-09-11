import express from "express";
import {
  createBlockedDate,
  deleteBlockedDate,
  getBlockedDate,
  getBlockedDates,
  updateBlockedDate,
} from "../controllers/consultationBlockedDateController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-consultation-blocked-date",
  authMiddleware,
  createBlockedDate,
);

router.get("/get-consultation-blocked-dates", authMiddleware, getBlockedDates);

router.get(
  "/get-consultation-blocked-date/:id",
  authMiddleware,
  getBlockedDate,
);

router.patch(
  "/update-consultation-blocked-date/:id",
  authMiddleware,
  updateBlockedDate,
);

router.delete(
  "/delete-consultation-blocked-date/:id",
  authMiddleware,
  deleteBlockedDate,
);

export default router;

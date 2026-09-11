import express from "express";
import {
  createPartnership,
  deletePartnership,
  getNewPartnerships,
  getPartnership,
  getPartnerships,
  updatePartnership,
} from "../controllers/partnershipController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Public
 */
router.post("/create-partnership", createPartnership);

/**
 * Admin
 */
router.get("/get-partnerships", authMiddleware, getPartnerships);

router.get("/get-new-partnerships", authMiddleware, getNewPartnerships);

router.get("/get-partnership/:id", authMiddleware, getPartnership);

router.patch("/update-partnership/:id", authMiddleware, updatePartnership);

router.delete("/delete-partnership/:id", authMiddleware, deletePartnership);

export default router;

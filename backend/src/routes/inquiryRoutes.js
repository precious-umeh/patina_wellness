import express from "express";
import {
  createInquiry,
  deleteInquiry,
  getInquiries,
  getInquiry,
  getNewInquiries,
  updateInquiry,
} from "../controllers/inquiryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// public
router.post("/create-inquiry", createInquiry);

// admin
router.get("/get-inquiries", authMiddleware, getInquiries);

router.get("/get-new-inquiries", authMiddleware, getNewInquiries);

router.get("/get-inquiry/:id", authMiddleware, getInquiry);

router.patch("/update-inquiry/:id", authMiddleware, updateInquiry);

router.delete("/delete-inquiry/:id", authMiddleware, deleteInquiry);

export default router;

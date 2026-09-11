import express from "express";
import {
  createBooking,
  deleteBooking,
  getBooking,
  getBookings,
  getPendingBookings,
  updateBooking,
} from "../controllers/consultationBookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-booking", createBooking);

router.get("/get-bookings", authMiddleware, getBookings);
router.get("/get-pending-bookings", authMiddleware, getPendingBookings);
router.get("/get-booking/:id", authMiddleware, getBooking);

router.patch("/update-booking/:id", authMiddleware, updateBooking);

router.delete("/delete-booking/:id", authMiddleware, deleteBooking);

export default router;

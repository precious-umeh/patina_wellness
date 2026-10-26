import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import consultationBookingRoutes from "./routes/consultationBookingRoutes.js";
import consultationAvailabilityRoutes from "./routes/consultationAvailabilityRoutes.js";
import consultationBlockedDateRoutes from "./routes/consultationBlockedDateRoutes.js";
import generalSettingsRoutes from "./routes/generalSettingsRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import partnershipRoutes from "./routes/partnershipRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import multer from "multer";
import { env } from "./config/env.js";

const server = express();

// Reject oversized JSON request bodies.
server.use(express.json({ limit: "1mb" }));

// Configure allowed browser origins.
const allowedOrigins = [env.frontendUrl];

server.use(
  cors({
    origin(origin, callback) {
      // Allow non-browsser request without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Don't grant CORS access to unapproved browser origins.
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

server.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Application routes
server.use("/auth", authRoutes);
server.use("/api", consultationBookingRoutes);
server.use("/api", consultationAvailabilityRoutes);
server.use("/api", consultationBlockedDateRoutes);
server.use("/api", generalSettingsRoutes);
server.use("/api", inquiryRoutes);
server.use("/api", partnershipRoutes);
server.use("/api", productRoutes);
server.use("/api", categoryRoutes);

// JSON response for unmatched routes
server.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Centralized error handler
server.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof multer.MulterError) {
    const isTooLarge = err.code === "LIMIT_FILE_SIZE";

    return res.status(isTooLarge ? 413 : 400).json({
      success: false,
      message: isTooLarge
        ? "Image exceeds the maximum allowed file size"
        : "Invalid file upload",
    });
  }

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : Number.isInteger(err.status) && err.status >= 400 && err.status <= 599
        ? err.status
        : 500;

  // Log unexpected server errors.
  if (statusCode >= 500) {
    console.error("Unhandled request error:", err);
  }

  const message =
    statusCode >= 500
      ? "An unexpected server error occurred"
      : err.message || "Request failed";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

export default server;

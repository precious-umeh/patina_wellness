import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

import consultationBookingRoutes from "./routes/consultationBookingRoutes.js";
import consultationAvailabilityRoutes from "./routes/consultationAvailabilityRoutes.js";
import consultationBlockedDateRoutes from "./routes/consultationBlockedDateRoutes.js";

import generalSettingsRoutes from "./routes/generalSettingsRoutes.js";

import inquiryRoutes from "./routes/inquiryRoutes.js";

import partnershipRoutes from "./routes/partnershipRoutes.js";

import testRoutes from "./routes/testRoutes.js";

const server = express();
server.use(express.json());
server.use(cors());

server.use("/auth", authRoutes);

server.use("/api", consultationBookingRoutes);
server.use("/api", consultationAvailabilityRoutes);
server.use("/api", consultationBlockedDateRoutes);

server.use("/api", generalSettingsRoutes);

server.use("/api", inquiryRoutes);

server.use("/api", partnershipRoutes);

server.use("/test", testRoutes);

export default server;

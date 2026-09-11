import express from "express";
import { testEmail } from "../controllers/testEmailController.js";

const router = express.Router();

router.get("/test-email", testEmail);

export default router;

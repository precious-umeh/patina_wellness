import express from "express";

import {
  getGeneralSettings,
  getPublicSiteSettings,
  updateGeneralSettings,
} from "../controllers/generalSettingsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-general-settings", authMiddleware, getGeneralSettings);
router.get("/get-public-site-settings", getPublicSiteSettings);
router.patch("/update-general-settings", authMiddleware, updateGeneralSettings);

export default router;

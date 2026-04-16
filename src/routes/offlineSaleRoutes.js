import express from "express";
import {
  syncOfflineSale,
  getOfflineSales,
} from "../controllers/offlineSaleController.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔥 MAIN SYNC ENDPOINT
router.post("/sync", protectRoute, syncOfflineSale);

// 🔥 VIEW SYNCED OFFLINE SALES
router.get("/", protectRoute, getOfflineSales);

export default router;
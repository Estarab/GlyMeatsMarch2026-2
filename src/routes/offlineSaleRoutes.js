import express from "express";
import {
  syncOfflineSales,
  getOfflineSales,
} from "../controllers/offlineSaleController.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sync", protectRoute, syncOfflineSales);
router.get("/", protectRoute, getOfflineSales);

export default router;
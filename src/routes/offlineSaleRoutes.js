import express from "express";
import { syncOfflineSales } from "../controllers/offlineSalesController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sync", protectRoute, syncOfflineSales);

export default router;
import express from "express";
const router = express.Router();

// Import controller functions
import { getStockLogs, createStockLog } from "../controllers/stockController.js";

// You likely have a middleware for auth - adjust name if necessary
// import { verifyToken } from "../middleware/auth.js"; 

// Apply routes
// If you have verifyToken middleware, add it here: router.get("/", verifyToken, getStockLogs);
router.get("/", getStockLogs);
router.post("/", createStockLog);

export default router;
import express from "express";
import { createSale, getSales } from "../controllers/saleController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protectRoute, getSales).post(protectRoute, createSale);

export default router;
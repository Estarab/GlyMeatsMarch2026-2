import express from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protectRoute, createProduct);
router.route("/:id").put(protectRoute, updateProduct).delete(protectRoute, deleteProduct);

export default router;
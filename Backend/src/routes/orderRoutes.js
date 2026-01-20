import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { createOrder, getOrderById, getOrders } from "../controllers/orderController.js";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, getOrders);
router.get("/:id", requireAuth, getOrderById);

export default router;

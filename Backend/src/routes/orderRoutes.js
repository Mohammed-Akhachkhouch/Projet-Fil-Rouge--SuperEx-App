import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { createOrder, getOrderById } from "../controllers/orderController.js";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/:id", requireAuth, getOrderById);

export default router;

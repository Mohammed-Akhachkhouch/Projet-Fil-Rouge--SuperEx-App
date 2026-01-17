import express from "express";
import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/product.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const orders = await Order.findAll({ include: Product });
    res.json(orders);
});

router.post("/", async (req, res) => {
    const { userId, items } = req.body;
    const order = await Order.create({ UserId: userId });
    for (let i of items) {
        await OrderItem.create({ OrderId: order.id, ProductId: i.productId, quantity: i.quantity, price: i.price });
    }
    res.json({ orderId: order.id });
});

export default router;

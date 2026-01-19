import { Order, OrderItem, Product } from "../models/index.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items = [], address = "" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items are required" });
    }

    const order = await Order.create({
      userId,
      status: "pending",
      address,
    });

    for (const it of items) {
      const product = await Product.findByPk(it.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${it.productId}` });
      }

      const quantity = Math.max(1, Number(it.quantity || 1));

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity,
        unitPrice: Number(product.price),
      });
    }

    return res.status(201).json({ message: "Order created", orderId: order.id });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const items = await OrderItem.findAll({ where: { orderId: order.id } });

    return res.json({ order, items });
  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

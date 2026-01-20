import { Order, OrderItem, Product } from "../models/index.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items is required" });
    }

    const order = await Order.create({ userId, status: "pending" });

    for (const it of items) {
      const productId = Number(it.productId);
      const quantity = Math.max(1, Number(it.quantity || 1));

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity,
        price: Number(product.price), // unit price
      });
    }

    return res.status(201).json({ orderId: order.id });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching orders for user:", userId);

    const orders = await Order.findAll({ where: { userId } });
    console.log("Found orders:", orders);

    return res.json({ orders });
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const items = await OrderItem.findAll({ where: { orderId } });

    return res.json({ order, items });
  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

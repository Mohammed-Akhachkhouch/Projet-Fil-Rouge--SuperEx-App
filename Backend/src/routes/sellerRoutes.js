import express from "express";
import Product from "../models/product.js";
import Category from "../models/category.js";
import User from "../models/user.js";
import { Order, OrderItem } from "../models/index.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

const requireSeller = (req, res, next) => {
  if (req.user?.role !== "seller") {
    return res.status(403).json({ message: "Seller only" });
  }
  next();
};

router.get("/stats", requireAuth, requireSeller, async (req, res) => {
  try {
    const sellerId = req.user.id;

    // 1. Calculate Total Revenue & Total Orders
    const sellerOrders = await OrderItem.findAll({
      include: [
        {
          model: Product,
          where: { sellerId },
          attributes: ["price"],
        },
        {
          model: Order,
          attributes: ["id", "createdAt", "status"],
          include: [{ model: User, attributes: ["username"] }]
        }
      ],
      order: [[Order, "createdAt", "DESC"]]
    });

    const ordersMap = {};
    let totalRevenue = 0;

    sellerOrders.forEach((item) => {
      const orderId = item.Order.id;
      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          id: item.Order.id,
          date: item.Order.createdAt,
          status: item.Order.status,
          customer: item.Order.User?.username || "Guest",
          itemsCount: 0,
          total: 0
        };
      }
      const itemTotal = item.quantity * item.price;
      ordersMap[orderId].total += itemTotal;
      ordersMap[orderId].itemsCount += item.quantity;
      totalRevenue += itemTotal;
    });

    const allOrders = Object.values(ordersMap).sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalOrders = allOrders.length;
    const recentOrders = allOrders.slice(0, 5); // Take top 5 recent

    // 2. Count Total Products
    const totalProducts = await Product.count({
      where: { sellerId }
    });

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      recentOrders
    });

  } catch (err) {
    console.error("GET SELLER STATS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile", requireAuth, requireSeller, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "storeName", "storeAddress", "storePhone"]
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/orders", requireAuth, requireSeller, async (req, res) => {
  try {
    const sellerId = req.user.id;

    // الحصول على جميع الـ order items الخاصة بمنتجات هذا الـ seller
    const sellerOrders = await OrderItem.findAll({
      include: [
        {
          model: Product,
          where: { sellerId },
          attributes: ["id", "name", "price"],
        },
        {
          model: Order,
          attributes: ["id", "status", "createdAt", "userId"],
          include: [
            {
              model: User,
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
    });

    // تجميع النتائج حسب Order ID
    const ordersMap = {};
    sellerOrders.forEach((item) => {
      const orderId = item.Order.id;
      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          id: item.Order.id,
          status: item.Order.status,
          createdAt: item.Order.createdAt,
          customerId: item.Order.userId,
          customerName: item.Order.User.username,
          customerEmail: item.Order.User.email,
          items: [],
          total: 0,
        };
      }
      ordersMap[orderId].items.push({
        productId: item.Product.id,
        productName: item.Product.name,
        quantity: item.quantity,
        price: item.price,
      });
      ordersMap[orderId].total += item.quantity * item.price;
    });

    const orders = Object.values(ordersMap);
    return res.json({ orders });
  } catch (err) {
    console.error("GET SELLER ORDERS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
});


router.put("/profile", requireAuth, requireSeller, async (req, res) => {
  try {
    const { storeName, storeAddress, storePhone } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({
      storeName: storeName ?? user.storeName,
      storeAddress: storeAddress ?? user.storeAddress,
      storePhone: storePhone ?? user.storePhone,
    });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      storeName: user.storeName,
      storeAddress: user.storeAddress,
      storePhone: user.storePhone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/products", requireAuth, requireSeller, async (req, res) => {
  const products = await Product.findAll({
    where: { sellerId: req.user.id },
    include: [
      { model: Category, attributes: ["id", "name"] },
      {
        model: User,
        as: "seller",
        attributes: ["id", "username", "email", "storeName", "storeAddress", "storePhone"]
      }
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(products);
});

router.post("/products", requireAuth, requireSeller, async (req, res) => {
  const { name, price, stock, categoryId, image, isActive } = req.body;

  if (!name || price == null || categoryId == null) {
    return res.status(400).json({ message: "name, price, categoryId are required" });
  }

  const product = await Product.create({
    name,
    price: Number(price),
    stock: Number(stock || 0),
    categoryId: Number(categoryId),
    image: image || null,
    isActive: isActive ?? true,
    sellerId: req.user.id,
  });

  res.status(201).json(product);
});

router.put("/products/:id", requireAuth, requireSeller, async (req, res) => {
  const id = Number(req.params.id);
  const product = await Product.findOne({ where: { id, sellerId: req.user.id } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, price, stock, categoryId, image, isActive } = req.body;

  await product.update({
    name: name ?? product.name,
    price: price != null ? Number(price) : product.price,
    stock: stock != null ? Number(stock) : product.stock,
    categoryId: categoryId != null ? Number(categoryId) : product.categoryId,
    image: image ?? product.image,
    isActive: isActive ?? product.isActive,
  });

  res.json(product);
});

router.delete("/products/:id", requireAuth, requireSeller, async (req, res) => {
  const id = Number(req.params.id);
  const product = await Product.findOne({ where: { id, sellerId: req.user.id } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.destroy();
  res.json({ message: "Deleted" });
});

export default router;

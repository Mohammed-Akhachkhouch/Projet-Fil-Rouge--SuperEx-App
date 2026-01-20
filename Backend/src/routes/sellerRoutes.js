import express from "express";
import Product from "../models/product.js";
import Category from "../models/category.js";
import User from "../models/user.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

const requireSeller = (req, res, next) => {
  if (req.user?.role !== "seller") {
    return res.status(403).json({ message: "Seller only" });
  }
  next();
};

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

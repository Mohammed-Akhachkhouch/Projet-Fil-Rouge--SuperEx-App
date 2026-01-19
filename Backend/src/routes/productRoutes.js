import express from "express";
import Product from "../models/product.js";
import Category from "../models/category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.findAll({
    where: { isActive: true },
    include: [{ model: Category, attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  });
  res.json(products);
});

export default router;

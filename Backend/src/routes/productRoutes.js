import express from "express";
import Product from "../models/product.js";
import Category from "../models/category.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.findAll({
    where: { isActive: true },
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

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { 
          model: User, 
          as: "seller", 
          attributes: ["id", "username", "email", "storeName", "storeAddress", "storePhone"] 
        }
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

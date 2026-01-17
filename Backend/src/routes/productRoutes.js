import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});

router.post("/", async (req, res) => {
    const { name, price, stock } = req.body;
    const product = await Product.create({ name, price, stock });
    res.json(product);
});

export default router;

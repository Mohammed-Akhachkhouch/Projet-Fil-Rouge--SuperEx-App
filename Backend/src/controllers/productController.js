import { Product, Category, User } from "../models/index.js";

export const getProducts = async (req, res) => {
  try {
    console.log("=== GET PRODUCTS CALLED ===");
    const { category } = req.query;

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "name"]
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "username", "email", "storeName", "storeAddress", "storePhone"]
        }
      ],
      order: [["id", "ASC"]],
    });

    console.log("Products fetched:", products.length);
    if (products.length > 0) {
      const firstProduct = products[0].toJSON();
      console.log("First product:", JSON.stringify(firstProduct, null, 2));
    }

    return res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err.message);
    console.error("Error stack:", err.stack);
    return res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { 
          model: Category, 
          attributes: ["id", "name"] 
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "username", "email", "storeName", "storeAddress", "storePhone"]
        }
      ],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json(product);
  } catch (err) {
    console.error("GET PRODUCT BY ID ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock = 0, categoryId, qtyLabel, description, imageUrl, image } = req.body;

    if (!name || price == null || !categoryId) {
      return res.status(400).json({ message: "name, price, categoryId are required" });
    }

    const product = await Product.create({ 
      name, 
      price, 
      stock, 
      categoryId, 
      qtyLabel, 
      description, 
      image: image || imageUrl 
    });
    return res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

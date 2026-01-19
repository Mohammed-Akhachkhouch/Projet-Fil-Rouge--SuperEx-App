import { Category } from "../models/index.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    return res.json(categories);
  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

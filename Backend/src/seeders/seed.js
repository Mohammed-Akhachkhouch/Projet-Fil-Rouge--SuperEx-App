import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { sequelize, User, Category, Product } from "../models/index.js";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ force: true });
    console.log("✅ Tables recreated");

    // =========================
    // Users (customer + seller)
    // =========================
    const passwordHash = await bcrypt.hash("123456", 10);

    const users = await User.bulkCreate(
      [
        { username: "Customer1", email: "c1@superex.com", password: passwordHash, role: "customer" },
        { username: "Seller1", email: "s1@superex.com", password: passwordHash, role: "seller" },
      ],
      { returning: true }
    );

    console.log("✅ Users seeded (2)");

    const sellerId = users.find((u) => u.role === "seller")?.id;
    if (!sellerId) throw new Error("No seller user found to assign sellerId");

    // =========================
    // Categories
    // =========================
   const categories = await Category.bulkCreate(
  [
    { name: "Fruits & Vegetables", image: "https://picsum.photos/seed/fruits/600/400" },
    { name: "Meat & Fish", image: "https://picsum.photos/seed/meat/600/400" },
    { name: "Drinks", image: "https://picsum.photos/seed/drinks/600/400" },
    { name: "Bakery", image: "https://picsum.photos/seed/bakery/600/400" },
  ],
  { returning: true }
);

console.log("✅ Categories seeded (4)");


    const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

    // =========================
    // Products (8 per category) + sellerId ✅
    // =========================
    const products = [
      // Fruits & Vegetables (8)
      { name: "Apple", price: 3.5, stock: 100, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },
      { name: "Banana", price: 2.8, stock: 150, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },
      { name: "Orange", price: 3.2, stock: 120, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },
      { name: "Tomato", price: 1.9, stock: 200, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },
      { name: "Potato", price: 1.5, stock: 300, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },
      { name: "Onion", price: 1.2, stock: 250, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },
      { name: "Carrot", price: 1.8, stock: 180, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },
      { name: "Cucumber", price: 2.0, stock: 160, categoryId: catMap["Fruits & Vegetables"], sellerId, image: "" },

      // Meat & Fish (8)
      { name: "Beef", price: 45, stock: 30, categoryId: catMap["Meat & Fish"], sellerId, image: "" },
      { name: "Chicken", price: 22, stock: 50, categoryId: catMap["Meat & Fish"], sellerId, image: "" },
      { name: "Lamb", price: 55, stock: 25, categoryId: catMap["Meat & Fish"], sellerId, image: "" },
      { name: "Turkey", price: 28, stock: 40, categoryId: catMap["Meat & Fish"], sellerId, image: "" },
      { name: "Salmon", price: 60, stock: 20, categoryId: catMap["Meat & Fish"], sellerId, image: "" },
      { name: "Tuna", price: 48, stock: 35, categoryId: catMap["Meat & Fish"], sellerId, image: "" },
      { name: "Sardine", price: 18, stock: 80, categoryId: catMap["Meat & Fish"], sellerId, image: "" },
      { name: "Shrimp", price: 70, stock: 15, categoryId: catMap["Meat & Fish"], sellerId, image: "" },

      // Drinks (8)
      { name: "Coca Cola", price: 5, stock: 200, categoryId: catMap["Drinks"], sellerId, image: "" },
      { name: "Pepsi", price: 5, stock: 180, categoryId: catMap["Drinks"], sellerId, image: "" },
      { name: "Orange Juice", price: 6, stock: 140, categoryId: catMap["Drinks"], sellerId, image: "" },
      { name: "Apple Juice", price: 6, stock: 130, categoryId: catMap["Drinks"], sellerId, image: "" },
      { name: "Mineral Water", price: 2, stock: 500, categoryId: catMap["Drinks"], sellerId, image: "" },
      { name: "Sparkling Water", price: 3, stock: 300, categoryId: catMap["Drinks"], sellerId, image: "" },
      { name: "Energy Drink", price: 8, stock: 120, categoryId: catMap["Drinks"], sellerId, image: "" },
      { name: "Iced Tea", price: 4, stock: 160, categoryId: catMap["Drinks"], sellerId, image: "" },

      // Bakery (8)
      { name: "Bread", price: 1.5, stock: 200, categoryId: catMap["Bakery"], sellerId, image: "" },
      { name: "Baguette", price: 1.2, stock: 180, categoryId: catMap["Bakery"], sellerId, image: "" },
      { name: "Croissant", price: 2.5, stock: 120, categoryId: catMap["Bakery"], sellerId, image: "" },
      { name: "Pain au chocolat", price: 2.8, stock: 110, categoryId: catMap["Bakery"], sellerId, image: "" },
      { name: "Cake", price: 15, stock: 40, categoryId: catMap["Bakery"], sellerId, image: "" },
      { name: "Donut", price: 3, stock: 90, categoryId: catMap["Bakery"], sellerId, image: "" },
      { name: "Cookies", price: 4, stock: 100, categoryId: catMap["Bakery"], sellerId, image: "" },
      { name: "Muffin", price: 3.5, stock: 80, categoryId: catMap["Bakery"], sellerId, image: "" },
    ];

    await Product.bulkCreate(products);

    console.log("✅ Products seeded:", products.length);
    console.log("🎉 Seeding completed successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();

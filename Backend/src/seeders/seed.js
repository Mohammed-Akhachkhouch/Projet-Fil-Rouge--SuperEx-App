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

   
    const passwordHash = await bcrypt.hash("123456", 10);

    const users = await User.bulkCreate(
      [
        { username: "Customer1", email: "c1@superex.com", password: passwordHash, role: "customer" },
        { 
          username: "Seller1", 
          email: "s1@superex.com", 
          password: passwordHash, 
          role: "seller",
          storeName: "SuperMarket Express",
          storeAddress: "123 Main Street, Downtown",
          storePhone: "+1 (555) 123-4567"
        },
      ],
      { returning: true }
    );

    console.log("✅ Users seeded (2)");

    const sellerId = users.find((u) => u.role === "seller")?.id;

   const categories = await Category.bulkCreate(
  [
    { name: "Fruits & Vegetables", image: "https://ik.imagekit.io/acqqus74p/images/Vegetables.png" },
    { name: "Meat & Fish", image: "https://ik.imagekit.io/acqqus74p/images/meat.png" },
    { name: "Drinks", image: "https://ik.imagekit.io/acqqus74p/images/dairy.png" },
    { name: "Bakery", image: "https://ik.imagekit.io/acqqus74p/images/bakery.png" },
  ],
  { returning: true }
);

console.log("✅ Categories seeded (4)");

    const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  
    

    await Product.bulkCreate(products);
    console.log("✅ Sample products seeded (4) - for testing");

    console.log("🎉 Seeding completed successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();

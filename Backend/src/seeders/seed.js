import bcrypt from "bcrypt";
import { sequelize, User, Category, Product } from "../models/index.js";

async function seed() {
  try {
   
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ force: true });
    console.log("✅ Tables recreated");


    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = await User.bulkCreate([
      {
        username: "admin",
        email: "admin@superex.com",
        password: hashedPassword,
      },
      {
        username: "mohammed",
        email: "m@test.com",
        password: hashedPassword,
      },
    ]);

    console.log(`✅ Users seeded (${users.length})`);

   
    const categories = await Category.bulkCreate([
      { name: "Fruits & Vegetables", image: "https://ik.imagekit.io/acqqus74p/images/Vegetables.png" },
      { name: "Meat & Fish", image: "https://ik.imagekit.io/acqqus74p/images/meat.png" },
      { name: "Drinks", image: "https://ik.imagekit.io/acqqus74p/images/dairy.png" },
      { name: "Bakery", image: "https://ik.imagekit.io/acqqus74p/images/bakery.png" },

    ]);

    console.log(`✅ Categories seeded (${categories.length})`);

  
    const products = await Product.bulkCreate([
  // ================= Fruits & Vegetables =================
  { name: "Apple", price: 3.5, stock: 100, categoryId: categories[0].id },
  { name: "Banana", price: 2.8, stock: 150, categoryId: categories[0].id },
  { name: "Orange", price: 3.2, stock: 120, categoryId: categories[0].id },
  { name: "Tomato", price: 1.9, stock: 200, categoryId: categories[0].id },
  { name: "Potato", price: 1.5, stock: 300, categoryId: categories[0].id },
  { name: "Onion", price: 1.2, stock: 250, categoryId: categories[0].id },
  { name: "Carrot", price: 1.8, stock: 180, categoryId: categories[0].id },
  { name: "Cucumber", price: 2.0, stock: 160, categoryId: categories[0].id },

  // ================= Meat & Fish =================
  { name: "Beef", price: 45, stock: 30, categoryId: categories[1].id },
  { name: "Chicken", price: 22, stock: 50, categoryId: categories[1].id },
  { name: "Lamb", price: 55, stock: 25, categoryId: categories[1].id },
  { name: "Turkey", price: 28, stock: 40, categoryId: categories[1].id },
  { name: "Salmon", price: 60, stock: 20, categoryId: categories[1].id },
  { name: "Tuna", price: 48, stock: 35, categoryId: categories[1].id },
  { name: "Sardine", price: 18, stock: 80, categoryId: categories[1].id },
  { name: "Shrimp", price: 70, stock: 15, categoryId: categories[1].id },

  // ================= Drinks =================
  { name: "Coca Cola", price: 5, stock: 200, categoryId: categories[2].id },
  { name: "Pepsi", price: 5, stock: 180, categoryId: categories[2].id },
  { name: "Orange Juice", price: 6, stock: 140, categoryId: categories[2].id },
  { name: "Apple Juice", price: 6, stock: 130, categoryId: categories[2].id },
  { name: "Mineral Water", price: 2, stock: 500, categoryId: categories[2].id },
  { name: "Sparkling Water", price: 3, stock: 300, categoryId: categories[2].id },
  { name: "Energy Drink", price: 8, stock: 120, categoryId: categories[2].id },
  { name: "Iced Tea", price: 4, stock: 160, categoryId: categories[2].id },

  // ================= Bakery =================
  { name: "Bread", price: 1.5, stock: 200, categoryId: categories[3].id },
  { name: "Baguette", price: 1.2, stock: 180, categoryId: categories[3].id },
  { name: "Croissant", price: 2.5, stock: 120, categoryId: categories[3].id },
  { name: "Pain au chocolat", price: 2.8, stock: 110, categoryId: categories[3].id },
  { name: "Cake", price: 15, stock: 40, categoryId: categories[3].id },
  { name: "Donut", price: 3, stock: 90, categoryId: categories[3].id },
  { name: "Cookies", price: 4, stock: 100, categoryId: categories[3].id },
  { name: "Muffin", price: 3.5, stock: 80, categoryId: categories[3].id },
]);

console.log(`✅ Products seeded (${products.length})`);

    console.log("🎉 Seeding completed successfully");
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await sequelize.close();
  }
}

seed();

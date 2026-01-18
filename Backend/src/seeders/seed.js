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
      { name: "Fruits & Vegetables" },
      { name: "Meat & Fish" },
      { name: "Drinks" },
      { name: "Bakery" },
    ]);

    console.log(`✅ Categories seeded (${categories.length})`);

  
    const products = await Product.bulkCreate([
      {
        name: "Apple",
        price: 3.5,
        stock: 100,
        categoryId: categories[0].id,
      },
      {
        name: "Banana",
        price: 2.8,
        stock: 150,
        categoryId: categories[0].id,
      },
      {
        name: "Beef",
        price: 45,
        stock: 30,
        categoryId: categories[1].id,
      },
      {
        name: "Chicken",
        price: 22,
        stock: 50,
        categoryId: categories[1].id,
      },
      {
        name: "Coca Cola",
        price: 5,
        stock: 200,
        categoryId: categories[2].id,
      },
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

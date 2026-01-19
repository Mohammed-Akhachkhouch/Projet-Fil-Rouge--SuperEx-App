import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import Catrgory from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", Catrgory);

sequelize.sync({ alter: true })
    .then(() => console.log("Database & tables created!"))
    .catch(err => console.log("DB sync error:", err));

export default app;

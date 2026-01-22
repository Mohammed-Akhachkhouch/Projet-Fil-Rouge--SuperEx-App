import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";

dotenv.config();
const app = express();

app.use(cors(
  {
    origin: "http://superex.up.railway.app/",
    credentials: true,
  }
));
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/seller", sellerRoutes);

const force = false;

sequelize
  .sync({ force })
  .then(() => console.log("Database & tables ready!", force ? "(force rebuild)" : ""))
  .catch((err) => console.log("DB sync error:", err));

export default app;

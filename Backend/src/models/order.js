import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
  },
  { tableName: "orders", timestamps: true }
);

export default Order;

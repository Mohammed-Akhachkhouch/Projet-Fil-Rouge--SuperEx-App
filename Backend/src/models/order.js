import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.js";

const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: { type: DataTypes.STRING, defaultValue: "pending" }
}, { tableName: "orders" });

User.hasMany(Order);
Order.belongsTo(User);

export default Order;

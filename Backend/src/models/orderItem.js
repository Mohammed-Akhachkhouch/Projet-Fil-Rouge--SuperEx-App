import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Order from "./order.js";
import Product from "./product.js";

const OrderItem = sequelize.define("OrderItem", {
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: "order_items" });

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

export default OrderItem;

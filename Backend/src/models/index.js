import { sequelize } from "../config/database.js";
import User from "./user.js";
import Product from "./product.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

export { sequelize, User, Product, Order, OrderItem };

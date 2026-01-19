
import { sequelize } from "../config/database.js";

import User from "./user.js";
import Product from "./product.js";
import Category from "./category.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";

User.hasMany(Order, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
});


Category.hasMany(Product, {
  foreignKey: { name: "categoryId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(Category, {
  foreignKey: { name: "categoryId", allowNull: false },
});


User.hasMany(Product, {
  foreignKey: { name: "sellerId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(User, {
  foreignKey: { name: "sellerId", allowNull: false },
  as: "seller",
});


Order.belongsToMany(Product, {
  through: OrderItem,
  foreignKey: "orderId",
  otherKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: "productId",
  otherKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export { sequelize, User, Product, Category, Order, OrderItem };

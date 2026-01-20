
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    categoryId: { type: DataTypes.INTEGER, allowNull: false },

    image: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true }, 
    qtyLabel: { type: DataTypes.STRING, allowNull: true, defaultValue: "unit" },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    sellerId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "products", timestamps: true }
);

export default Product;

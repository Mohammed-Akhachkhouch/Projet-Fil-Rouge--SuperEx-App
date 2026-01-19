import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Product = sequelize.define(
  "Product",
  {
    name: { type: DataTypes.STRING, allowNull: false },

    price: { type: DataTypes.FLOAT, allowNull: false },

    stock: { type: DataTypes.INTEGER, defaultValue: 0 },

    categoryId: { type: DataTypes.INTEGER, allowNull: false },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;

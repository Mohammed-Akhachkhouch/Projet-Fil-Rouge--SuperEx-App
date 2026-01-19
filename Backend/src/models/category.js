import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Categories",
    timestamps: true,
  }
);

export default Category;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./Category");
const Warehouse = require("./Warehouse");

const Product = sequelize.define(
  "Product",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    categoryId: {
      type: DataTypes.INTEGER,
      references: { model: "Categories", key: "id" },
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      references: { model: "Warehouses", key: "id" },
    },
    lowStockThreshold: { type: DataTypes.INTEGER, defaultValue: 5 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  },
  { timestamps: true }
);

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Warehouse, { foreignKey: "warehouseId" });
Warehouse.hasMany(Product, { foreignKey: "warehouseId" });

module.exports = Product;
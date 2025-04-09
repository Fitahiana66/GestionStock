const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./Order");
const Product = require("./Product");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    orderId: {
      type: DataTypes.INTEGER,
      references: { model: "Orders", key: "id" },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: { model: "Products", key: "id" },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { timestamps: true }
);

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

module.exports = OrderItem;
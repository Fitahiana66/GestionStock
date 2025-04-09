const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Supplier = require("./Supplier");
const User = require("./User");

const Order = sequelize.define(
  "Order",
  {
    type: { type: DataTypes.ENUM("purchase", "sale"), allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
      defaultValue: "pending",
    },
    supplierId: {
      type: DataTypes.INTEGER,
      references: { model: "Suppliers", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
    },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  },
  { timestamps: true }
);

Order.belongsTo(Supplier, { foreignKey: "supplierId" });
Order.belongsTo(User, { foreignKey: "userId" });

module.exports = Order;
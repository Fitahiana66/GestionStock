const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./Product");
const User = require("./User");

const StockMovement = sequelize.define(
  "StockMovement",
  {
    productId: {
      type: DataTypes.INTEGER,
      references: { model: "Products", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
    },
    type: {
      type: DataTypes.ENUM("Entre", "Sortie", "update", "transfer"),
      allowNull: false,
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

StockMovement.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(StockMovement, { foreignKey: "productId" });
StockMovement.belongsTo(User, { foreignKey: "userId" });

module.exports = StockMovement;
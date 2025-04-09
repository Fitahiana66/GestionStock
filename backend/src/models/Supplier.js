const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Supplier = sequelize.define(
  "Supplier",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    contactEmail: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

module.exports = Supplier;
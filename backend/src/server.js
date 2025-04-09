const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { auth } = require("./middleware/auth");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

sequelize
  .sync()
  .then(() => console.log("Base de données synchronisée"))
  .catch((err) => console.error("Erreur de synchronisation :", err));

app.use("/auth", authRoutes);
app.use("/products", auth, productRoutes);
app.use("/warehouses", auth, warehouseRoutes);
app.use("/suppliers", auth, supplierRoutes);
app.use("/orders", auth, orderRoutes);
app.use("/categories", auth, categoryRoutes);

app.get("/", (req, res) => {
  res.send("Serveur de gestion de stock opérationnel");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

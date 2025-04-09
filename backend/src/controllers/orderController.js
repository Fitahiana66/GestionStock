const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const sequelize = require("../config/db");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: ["Supplier", "User"] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { type, supplierId, items } = req.body;
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const order = await Order.create({
      type,
      supplierId: type === "purchase" ? supplierId : null,
      userId: req.user.id,
      totalAmount,
    });

    await sequelize.transaction(async (t) => {
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) throw new Error(`Produit ${item.productId} non trouvé`);
        if (type === "sale" && product.quantity < item.quantity) {
          throw new Error(`Stock insuffisant pour ${product.name}`);
        }

        await OrderItem.create(
          { orderId: order.id, productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice },
          { transaction: t }
        );

        const movementType = type === "purchase" ? "Entre" : "Sortie";
        await product.update(
          { quantity: type === "purchase" ? product.quantity + item.quantity : product.quantity - item.quantity,
            cost: type === "purchase" ? item.unitPrice : product.cost,
           },
          { transaction: t }
        );
        await StockMovement.create(
          {
            productId: item.productId,
            userId: req.user.id,
            type: movementType,
            quantity: item.quantity,
            reason: type === "purchase" ? "Commande d'achat" : "Vente",
          },
          { transaction: t }
        );
      }
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Commande non trouvée" });
    await order.update({ status });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: ["Supplier", "User", { model: OrderItem, include: "Product" }],
    });
    if (!order) return res.status(404).json({ error: "Commande non trouvée" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
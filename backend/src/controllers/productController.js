const { Op } = require("sequelize");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const sequelize = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const { warehouseId, minStock, categoryId } = req.query;
    const where = {};
    if (warehouseId) where.warehouseId = warehouseId;
    if (minStock) where.quantity = { [Op.lte]: minStock };
    if (categoryId) where.categoryId = categoryId;

    const products = await Product.findAll({
      where,
      include: ["Category", "Warehouse"],
    });
    const productsWithAlerts = products.map((product) => ({
      ...product.toJSON(),
      isLowStock: product.quantity <= product.lowStockThreshold,
    }));
    res.json(productsWithAlerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, categoryId, warehouseId, lowStockThreshold, price, cost } = req.body;
    const product = await Product.create({
      name,
      quantity,
      categoryId,
      warehouseId,
      lowStockThreshold,
      price,
      cost,
    });
    await StockMovement.create({
      productId: product.id,
      userId: req.user.id,
      type: "Entre",
      quantity,
      reason: "Création initiale",
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, categoryId, warehouseId, lowStockThreshold, price, cost } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });

    const oldQuantity = product.quantity;
    await product.update({ name, quantity, categoryId, warehouseId, lowStockThreshold, price, cost });

    if (quantity !== oldQuantity) {
      const movementType = quantity > oldQuantity ? "Entre" : "Sortie";
      await StockMovement.create({
        productId: id,
        userId: req.user.id,
        type: movementType,
        quantity: Math.abs(quantity - oldQuantity),
        reason: "Mise à jour du stock",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    // const { id } = req.params;
    const movements = await StockMovement.findAll({
      // where: { productId: id },
      include: ["Product", "User"],
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.transferStock = async (req, res) => {
  try {
    const { productId, fromWarehouseId, toWarehouseId, quantity } = req.body;
    const product = await Product.findOne({ where: { id: productId, warehouseId: fromWarehouseId } });
    if (!product || product.quantity < quantity) {
      return res.status(400).json({ error: "Stock insuffisant ou produit non trouvé" });
    }

    await sequelize.transaction(async (t) => {
      await product.update({ quantity: product.quantity - quantity }, { transaction: t });
      await StockMovement.create(
        {
          productId,
          userId: req.user.id,
          type: "Sortie",
          quantity,
          reason: "Transfert vers autre entrepôt",
        },
        { transaction: t }
      );

      const targetProduct = await Product.findOne({
        where: { name: product.name, warehouseId: toWarehouseId },
      });
      if (targetProduct) {
        await targetProduct.update(
          { quantity: targetProduct.quantity + quantity },
          { transaction: t }
        );
      } else {
        await Product.create(
          {
            name: product.name,
            quantity,
            categoryId: product.categoryId,
            warehouseId: toWarehouseId,
            lowStockThreshold: product.lowStockThreshold,
            price: product.price,
            cost: product.cost,
          },
          { transaction: t }
        );
      }
      await StockMovement.create(
        {
          productId,
          userId: req.user.id,
          type: "Entre",
          quantity,
          reason: "Transfert depuis autre entrepôt",
        },
        { transaction: t }
      );
    });

    res.status(200).json({ message: "Transfert réussi" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStockReport = async (req, res) => {
  try {
    const totalStock = await Product.sum("quantity");
    const lowStockProducts = await Product.count({
      where: { quantity: { [Op.lte]: sequelize.col("lowStockThreshold") } },
    });
    const stockValue = await Product.sum("price", {
      attributes: [[sequelize.literal('quantity * price'), 'stockValue']],
      raw: true,
    });

    const stockValueResult = await Product.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.literal('quantity * price')), 'stockValue']],
      raw: true,
    });

    const finalStockValue = stockValueResult[0].stockValue || 0;

    res.json({ 
      totalStock, 
      lowStockProducts, 
      stockValue: parseFloat(finalStockValue).toFixed(2) 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
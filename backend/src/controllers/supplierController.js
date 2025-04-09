const Supplier = require("../models/Supplier");

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { name, contactEmail, phone } = req.body;
    const supplier = await Supplier.create({ name, contactEmail, phone });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactEmail, phone } = req.body;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: "Fournisseur non trouvé" });
    await supplier.update({ name, contactEmail, phone });
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: "Fournisseur non trouvé" });
    await supplier.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
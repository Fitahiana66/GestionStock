const Warehouse = require("../models/Warehouse");

exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWarehouse = async (req, res) => {
  try {
    const { name, location } = req.body;
    const warehouse = await Warehouse.create({ name, location });
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) return res.status(404).json({ error: "Entrepôt non trouvé" });
    await warehouse.update({ name, location });
    res.json(warehouse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) return res.status(404).json({ error: "Entrepôt non trouvé" });
    await warehouse.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
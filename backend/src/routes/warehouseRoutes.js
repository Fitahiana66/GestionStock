const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseController");
const { requireRole } = require("../middleware/auth");

router.get("/", warehouseController.getAllWarehouses);
router.post("/", warehouseController.createWarehouse);
router.put("/:id", warehouseController.updateWarehouse);
router.delete("/:id", warehouseController.deleteWarehouse);

module.exports = router;
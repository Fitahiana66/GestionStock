const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { requireRole } = require("../middleware/auth");

router.get("/", supplierController.getAllSuppliers);
router.post("/", supplierController.createSupplier);
router.put("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { requireRole } = require("../middleware/auth");

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/history", productController.getStockHistory);
router.post("/transfer", productController.transferStock);
router.get("/report/stock", productController.getStockReport);

module.exports = router;
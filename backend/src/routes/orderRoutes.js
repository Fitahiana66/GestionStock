const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireRole } = require("../middleware/auth");

router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.get("/:id", orderController.getOrderDetails);

module.exports = router;
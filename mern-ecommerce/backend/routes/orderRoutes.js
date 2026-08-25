const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/", protect, allowRoles("customer"), placeOrder);
router.get("/mine", protect, allowRoles("customer"), getMyOrders);
router.get("/seller", protect, allowRoles("seller"), getSellerOrders);
router.put("/:id/status", protect, allowRoles("seller"), updateOrderStatus);

module.exports = router;

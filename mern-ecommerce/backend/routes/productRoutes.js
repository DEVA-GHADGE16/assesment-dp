const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, allowRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getProducts);
router.get("/seller/mine", protect, allowRoles("seller"), getMyProducts);
router.get("/:id", getProductById);

router.post("/", protect, allowRoles("seller"), upload.single("image"), createProduct);
router.put("/:id", protect, allowRoles("seller"), upload.single("image"), updateProduct);
router.delete("/:id", protect, allowRoles("seller"), deleteProduct);

module.exports = router;

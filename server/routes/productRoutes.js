const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// Create Product (Protected)
router.get("/", protect, getProducts);
router.post("/", protect, createProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);
router.get("/stats", protect, getProductStats);

module.exports = router;
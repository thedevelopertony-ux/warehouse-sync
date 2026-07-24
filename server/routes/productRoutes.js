const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// Create Product (Protected)
router.get("/", protect, getProducts);
router.post("/", protect, createProduct);

module.exports = router;
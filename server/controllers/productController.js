const Product = require("../models/Product");

// ===============================
// Create Product
// ===============================
const createProduct = async (req, res) => {
  try {
    let {
      name,
      sku,
      category,
      quantity,
      price,
      supplier,
      location,
    } = req.body;

    // Validation
    if (!name || !sku || !category) {
      return res.status(400).json({
        message: "Name, SKU and Category are required",
      });
    }

    if (quantity == null || quantity < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    if (price == null || price < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    // Clean data
    name = name.trim();
    sku = sku.trim().toUpperCase();
    category = category.trim();
    supplier = supplier ? supplier.trim() : "";
    location = location ? location.trim() : "";

    // Check duplicate SKU
    const existingProduct = await Product.findOne({ sku });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product with this SKU already exists",
      });
    }

    const product = await Product.create({
      name,
      sku,
      category,
      quantity,
      price,
      supplier,
      location,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Get All Products
// ===============================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Update Product
// ===============================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Delete Product
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Product Statistics
// ===============================
const getProductStats = async (req, res) => {
  try {
    const products = await Product.find();

    const totalProducts = products.length;

    const totalQuantity = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    const inventoryValue = products.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0
    );

    const lowStock = products.filter(
      (product) => product.quantity < 10
    ).length;

    const categories = [...new Set(products.map((p) => p.category))].length;

    res.status(200).json({
      totalProducts,
      totalQuantity,
      lowStock,
      inventoryValue,
      categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
 updateProduct,
 deleteProduct,
 getProductStats,
};
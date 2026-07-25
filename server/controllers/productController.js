const Product = require("../models/Product");

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      quantity,
      price,
      supplier,
      location,
    } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product with this SKU already exists",
      });
    }

    // Create Product
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

// Get All Products
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

// Delete Product
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

// Update Product
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
        runValidators: true,
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
module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
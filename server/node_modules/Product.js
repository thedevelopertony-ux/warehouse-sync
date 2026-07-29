const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    sku: {
      type: String,
      unique: true,
    },
    category: String,
    quantity: Number,
    price: Number,
    supplier: String,
    location: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
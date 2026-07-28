const XLSX = require("xlsx");
const Product = require("../models/Product");

const uploadInventory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an Excel or CSV file",
      });
    }

    // Read uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);

    // Get first sheet
    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    let imported = 0;
    let updated = 0;

    // Loop through each row
    for (const row of data) {
      // Skip rows without SKU
      if (!row.SKU) {
        console.log("Skipped row because SKU is missing:", row);
        continue;
      }

      const sku = String(row.SKU).trim().toUpperCase();

      console.log("=================================");
      console.log("Excel SKU:", sku);

      // Find existing product
      const existingProduct = await Product.findOne({ sku });

      console.log("Existing Product:", existingProduct);

      if (existingProduct) {
        // Update existing product
        existingProduct.name = row.Name;
        existingProduct.category = row.Category;
        existingProduct.quantity += Number(row.Quantity);
        existingProduct.price = row.Price;
        existingProduct.supplier = row.Supplier;
        existingProduct.location = row.Location;

        await existingProduct.save();

        updated++;

        console.log("Updated:", sku);
      } else {
        // Create new product
        await Product.create({
          name: row.Name,
          sku,
          category: row.Category,
          quantity: row.Quantity,
          price: row.Price,
          supplier: row.Supplier,
          location: row.Location,
        });

        imported++;

        console.log("Created:", sku);
      }
    }

    res.status(200).json({
      message: "Inventory imported successfully",
      imported,
      updated,
      totalRows: data.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadInventory,
};
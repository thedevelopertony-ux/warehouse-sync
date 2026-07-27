const XLSX = require("xlsx");
const Product = require("../models/Product");

const uploadInventory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an Excel or CSV file",
      });
    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    let imported = 0;
    let updated = 0;

    for (const row of data) {
      const sku = row.SKU.trim().toUpperCase();

      const existingProduct = await Product.findOne({ sku });

      if (existingProduct) {
        existingProduct.name = row.Name;
        existingProduct.category = row.Category;
        existingProduct.quantity = row.Quantity;
        existingProduct.price = row.Price;
        existingProduct.supplier = row.Supplier;
        existingProduct.location = row.Location;

        await existingProduct.save();

        updated++;
      } else {
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
    });
  }
};

module.exports = {
  uploadInventory,
};
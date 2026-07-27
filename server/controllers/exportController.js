const ExcelJS = require("exceljs");
const Product = require("../models/Product");

const exportInventory = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    // Create workbook
    const workbook = new ExcelJS.Workbook();

    // Create worksheet
    const worksheet = workbook.addWorksheet("Inventory");

    // Add header row
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "SKU", key: "sku", width: 20 },
      { header: "Category", key: "category", width: 20 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Supplier", key: "supplier", width: 20 },
      { header: "Location", key: "location", width: 20 },
    ];

    // Add product rows
    products.forEach((product) => {
      worksheet.addRow({
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        supplier: product.supplier,
        location: product.location,
      });
    });

    // Style header
    worksheet.getRow(1).font = {
      bold: true,
    };

    // Tell browser this is an Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory.xlsx"
    );

    // Send workbook
    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  exportInventory,
};
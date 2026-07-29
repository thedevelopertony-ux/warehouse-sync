const XLSX = require("xlsx");
const Product = require("../models/Product");
const Mapping = require("../models/Mapping");

const uploadInventory = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an Excel or CSV file",
      });
    }

    // Get user's saved mapping
    const mappingDoc = await Mapping.findOne({
      user: req.user.id,
    });

    if (!mappingDoc) {
      return res.status(400).json({
        message: "No mapping found. Please create a column mapping first.",
      });
    }

    const savedMapping = mappingDoc.mappings;

    console.log("Saved Mapping:", savedMapping);


    // Read uploaded Excel file
    const workbook = XLSX.read(req.file.buffer || req.file.path, {
      type: req.file.buffer ? "buffer" : "file",
    });


    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);


    let imported = 0;
    let updated = 0;


    // Process every row
    for (const row of data) {

      const mappedRow = {};

      for (const excelColumn in savedMapping) {

        const warehouseField = savedMapping[excelColumn];

        mappedRow[warehouseField] = row[excelColumn];

      }


      console.log("Mapped Row:", mappedRow);


      // Validate SKU
      if (!mappedRow.SKU) {
        console.log("Skipping row - SKU missing");
        continue;
      }


      const sku = String(mappedRow.SKU)
        .trim()
        .toUpperCase();



      // Check existing product
      const existingProduct = await Product.findOne({
        sku,
      });



      if (existingProduct) {

        console.log("Updating:", sku);


        existingProduct.quantity += Number(
          mappedRow.Quantity || 0
        );


        if (mappedRow.Name)
          existingProduct.name = mappedRow.Name;


        if (mappedRow.Category)
          existingProduct.category = mappedRow.Category;


        if (mappedRow.Price)
          existingProduct.price = mappedRow.Price;


        if (mappedRow.Supplier)
          existingProduct.supplier = mappedRow.Supplier;


        if (mappedRow.Location)
          existingProduct.location = mappedRow.Location;


        await existingProduct.save();

        updated++;


      } else {

        console.log("Creating:", sku);


        await Product.create({

          name: mappedRow.Name,

          sku,

          category: mappedRow.Category,

          quantity: Number(
            mappedRow.Quantity || 0
          ),

          price: Number(
            mappedRow.Price || 0
          ),

          supplier: mappedRow.Supplier,

          location: mappedRow.Location,

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

    console.error("Upload Error:", error);


    res.status(500).json({

      message: "Server Error",

      error: error.message,

    });

  }
};


module.exports = {
  uploadInventory,
};
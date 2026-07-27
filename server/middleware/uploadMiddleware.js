const multer = require("multer");
const path = require("path");

// Store uploaded files in the "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Allow only Excel and CSV files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".xlsx",
    ".xls",
    ".csv",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel and CSV files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
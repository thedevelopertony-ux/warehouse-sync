const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { exportInventory } = require("../controllers/exportController");

router.get("/", protect, exportInventory);

module.exports = router;
const Mapping = require("../models/Mapping");

// Save Mapping
const saveMapping = async (req, res) => {
  try {
    const { mappings } = req.body;

    const existing = await Mapping.findOne({
      user: req.user.id,
    });

    if (existing) {
      existing.mappings = mappings;

      await existing.save();

      return res.json({
        message: "Mapping Updated",
      });
    }

    await Mapping.create({
      user: req.user.id,
      mappings,
    });

    res.json({
      message: "Mapping Saved",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Mapping
const getMapping = async (req, res) => {

  try {

    const mapping = await Mapping.findOne({
      user: req.user.id,
    });

    if (!mapping) {
      return res.json({
        mappings: {},
      });
    }

    res.json(mapping);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  saveMapping,
  getMapping,
};
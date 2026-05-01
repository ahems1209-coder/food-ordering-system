import Config from "../models/Config.js";

// Initialize config if it doesn't exist, then return it
export const getConfig = async (req, res) => {
  try {
    const ownerId = req.query.restaurantId || (req.user ? req.user.id : null);
    if (!ownerId) return res.status(400).json({ message: "Restaurant ID required" });
    let config = await Config.findOne({ owner: ownerId });
    if (!config) {
      config = await Config.create({ totalTables: 20, owner: ownerId });
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { totalTables } = req.body;
    let config = await Config.findOne({ owner: req.user.id });
    if (!config) {
      config = await Config.create({ totalTables, owner: req.user.id });
    } else {
      config.totalTables = totalTables;
      await config.save();
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
